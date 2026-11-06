package com.umami.japanese;

import android.Manifest;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.util.Locale;

public class MainActivity extends BridgeActivity implements TextToSpeech.OnInitListener {
    private static final int PERMISSION_REQUEST_CODE = 301;
    private TextToSpeech tts;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize Android Native Japanese Text-to-Speech
        try {
            tts = new TextToSpeech(this, this);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 1. Request Runtime Audio Recording permissions if not granted
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{
                Manifest.permission.RECORD_AUDIO,
                Manifest.permission.MODIFY_AUDIO_SETTINGS
            }, PERMISSION_REQUEST_CODE);
        }

        try {
            WebView webView = this.getBridge().getWebView();

            // 2. Grant WebView web-level media capture permissions (navigator.mediaDevices.getUserMedia)
            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    for (String resource : request.getResources()) {
                        if (resource.equals(PermissionRequest.RESOURCE_AUDIO_CAPTURE)) {
                            request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                            return;
                        }
                    }
                    super.onPermissionRequest(request);
                }
            });

            // 3. Native Auto-Updater & Speech JavaScript Bridge
            webView.addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void speakJapanese(String text) {
                    if (tts != null && text != null && !text.trim().isEmpty()) {
                        try {
                            tts.setLanguage(Locale.JAPANESE);
                            tts.speak(text.trim(), TextToSpeech.QUEUE_FLUSH, null, "umami_tts_" + System.currentTimeMillis());
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }

                @JavascriptInterface
                public void installApkFromUrl(String apkUrl) {
                    downloadAndInstall(apkUrl);
                }

                @JavascriptInterface
                public void installLocalApk(String fileName) {
                    installFromDownloads(fileName);
                }

                @JavascriptInterface
                public void openUnknownAppSourcesPermission() {
                    requestInstallPermission();
                }

                @JavascriptInterface
                public boolean canInstallPackages() {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        return getPackageManager().canRequestPackageInstalls();
                    }
                    return true;
                }

                @JavascriptInterface
                public boolean isNativeAndroid() {
                    return true;
                }
            }, "AndroidAutoUpdater");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS && tts != null) {
            try {
                tts.setLanguage(Locale.JAPANESE);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onDestroy() {
        if (tts != null) {
            try {
                tts.stop();
                tts.shutdown();
            } catch (Exception ignored) {}
        }
        super.onDestroy();
    }

    public void requestInstallPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!getPackageManager().canRequestPackageInstalls()) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "กรุณากดเปิดสิทธิ์ 'อนุญาตจากแหล่งที่มานี้' เพื่อให้แอปติดตั้งอัปเดตได้", Toast.LENGTH_LONG).show());
                Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            } else {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "เปิดสิทธิ์ติดตั้งแอปเรียบร้อยแล้ว", Toast.LENGTH_SHORT).show());
            }
        }
    }

    private void installFromDownloads(String fileName) {
        try {
            String name = (fileName != null && !fileName.trim().isEmpty()) ? fileName.trim() : "umami-app-debug.apk";

            // 1. Try public Downloads directory
            File publicDownloads = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            File targetFile = new File(publicDownloads, name);

            // 2. Try app's private download directory if not found in public
            if (!targetFile.exists()) {
                targetFile = new File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), name);
            }

            if (!targetFile.exists()) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "ไม่พบไฟล์ " + name + " ในโฟลเดอร์ Downloads", Toast.LENGTH_LONG).show());
                return;
            }

            triggerInstall(targetFile);
        } catch (Exception e) {
            e.printStackTrace();
            runOnUiThread(() -> Toast.makeText(MainActivity.this, "เกิดข้อผิดพลาด: " + e.getMessage(), Toast.LENGTH_LONG).show());
        }
    }

    private void downloadAndInstall(String url) {
        if (url == null || (!url.startsWith("http://") && !url.startsWith("https://"))) {
            runOnUiThread(() -> Toast.makeText(MainActivity.this, "URL ดาวน์โหลดไม่ถูกต้อง กรุณาระบุลิงก์ HTTP/HTTPS", Toast.LENGTH_LONG).show());
            return;
        }

        try {
            // First check if install permission is granted
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !getPackageManager().canRequestPackageInstalls()) {
                requestInstallPermission();
                return;
            }

            runOnUiThread(() -> Toast.makeText(MainActivity.this, "เริ่มดาวน์โหลดอัปเดตเวอร์ชันใหม่...", Toast.LENGTH_SHORT).show());

            Uri downloadUri = Uri.parse(url);
            DownloadManager.Request request = new DownloadManager.Request(downloadUri);
            request.setTitle("Umami (うまみ) Update");
            request.setDescription("Downloading latest version...");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);

            File destinationFile = new File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "umami-update.apk");
            if (destinationFile.exists()) {
                destinationFile.delete();
            }
            request.setDestinationInExternalFilesDir(MainActivity.this, Environment.DIRECTORY_DOWNLOADS, "umami-update.apk");

            DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
            long downloadId = dm.enqueue(request);

            BroadcastReceiver onComplete = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                    if (id == downloadId) {
                        try {
                            unregisterReceiver(this);
                        } catch (Exception ignored) {}

                        // Verify download was successful
                        DownloadManager.Query query = new DownloadManager.Query();
                        query.setFilterById(downloadId);
                        Cursor cursor = dm.query(query);
                        if (cursor != null) {
                            if (cursor.moveToFirst()) {
                                int statusIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
                                int status = cursor.getInt(statusIndex);
                                if (status != DownloadManager.STATUS_SUCCESSFUL) {
                                    cursor.close();
                                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "ดาวน์โหลดไม่สำเร็จ: ลิงก์ URL ไม่มีไฟล์อยู่จริง (HTTP Error)", Toast.LENGTH_LONG).show());
                                    return;
                                }
                            }
                            cursor.close();
                        }

                        // Verify file is a valid size (> 100KB)
                        if (!destinationFile.exists() || destinationFile.length() < 100 * 1024) {
                            runOnUiThread(() -> Toast.makeText(MainActivity.this, "ไฟล์ที่ดาวน์โหลดมาไม่สมบูรณ์ (ขนาดเล็กเกินไป ไม่ใช่ APK)", Toast.LENGTH_LONG).show());
                            return;
                        }

                        runOnUiThread(() -> Toast.makeText(MainActivity.this, "ดาวน์โหลดเสร็จสิ้น กำลังเปิดตัวติดตั้ง...", Toast.LENGTH_SHORT).show());
                        triggerInstall(destinationFile);
                    }
                }
            };

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                registerReceiver(onComplete, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE), Context.RECEIVER_EXPORTED);
            } else {
                registerReceiver(onComplete, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
            }
        } catch (Exception e) {
            e.printStackTrace();
            runOnUiThread(() -> Toast.makeText(MainActivity.this, "ดาวน์โหลดไม่สำเร็จ: " + e.getMessage(), Toast.LENGTH_LONG).show());
        }
    }

    private void triggerInstall(File apkFile) {
        try {
            if (!apkFile.exists() || apkFile.length() < 100 * 1024) {
                runOnUiThread(() -> Toast.makeText(this, "ไม่พบไฟล์ APK หรือไฟล์ไม่สมบูรณ์", Toast.LENGTH_SHORT).show());
                return;
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (!getPackageManager().canRequestPackageInstalls()) {
                    runOnUiThread(() -> Toast.makeText(this, "กรุณาเปิด 'อนุญาตจากแหล่งที่มานี้' เพื่อให้แอปติดตั้งอัปเดตได้", Toast.LENGTH_LONG).show());
                    Intent manageIntent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getPackageName()));
                    manageIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(manageIntent);
                    return;
                }
            }

            Intent intent = new Intent(Intent.ACTION_VIEW);
            Uri apkUri;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                apkUri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", apkFile);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else {
                apkUri = Uri.fromFile(apkFile);
            }
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
            runOnUiThread(() -> Toast.makeText(this, "เกิดข้อผิดพลาดในการติดตั้ง: " + e.getMessage(), Toast.LENGTH_LONG).show());
        }
    }
}
