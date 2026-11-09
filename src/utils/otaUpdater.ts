import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater, type BundleInfo } from '@capgo/capacitor-updater';
import { APP_VERSION_NAME, NATIVE_BUILD } from '../config/version';

const MANIFEST_URL = 'https://raw.githubusercontent.com/MosStep/umami-japanese/main/public/live_catalog.json';
const DEFAULT_APK_URL = (version: string) =>
  `https://github.com/MosStep/umami-japanese/releases/download/v${version}/umami-app-debug.apk`;

// Keys written by the old fake "OTA" (localStorage only). Removed once on launch.
const LEGACY_OTA_KEYS = [
  'umami_live_version',
  'umami_live_tag',
  'umami_live_title',
  'umami_live_date',
  'umami_live_release_notes',
  'umami_live_catalog',
];

export type Manifest = {
  version: string;
  build: number;
  min_native_build: number;
  bundle_url: string;
  release_notes: string[];
  announcement?: string;
  apk_url?: string;
};

export type UpdateKind = 'none' | 'ota' | 'apk';

export const isNative = (): boolean => Capacitor.isNativePlatform();

export async function initOta(): Promise<void> {
  try {
    for (const key of LEGACY_OTA_KEYS) localStorage.removeItem(key);
  } catch {}

  if (isNative()) {
    try {
      await CapacitorUpdater.notifyAppReady();
    } catch (err) {
      console.warn('notifyAppReady failed:', err);
    }
  }
}

export async function fetchManifest(): Promise<Manifest> {
  try {
    const res = await fetch(`${MANIFEST_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Manifest;
  } catch (err) {
    console.warn('Manifest fetch failed:', err);
    throw new Error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์อัปเดตได้ กรุณาลองใหม่อีกครั้ง');
  }
}

// Semantic version compare: returns 1 if a > b, -1 if a < b, 0 if equal.
export function compareVersions(a: string, b: string): number {
  const pa = a.replace(/^v/, '').trim().split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.replace(/^v/, '').trim().split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

// 'none' = already up to date, 'apk' = native shell must be replaced,
// 'ota' = web bundle swap is enough (on web, 'ota' means reload the page).
export function getUpdateKind(m: Manifest): UpdateKind {
  if (compareVersions(m.version, APP_VERSION_NAME) <= 0) return 'none';
  if (m.min_native_build > NATIVE_BUILD) return 'apk';
  return 'ota';
}

export function getApkUrl(m: Manifest): string {
  return m.apk_url || DEFAULT_APK_URL(m.version);
}

// Downloads the web bundle zip (native only). Returns null on web.
export async function downloadOta(
  m: Manifest,
  onProgress: (pct: number) => void,
): Promise<BundleInfo | null> {
  if (!isNative()) return null;

  const handle = await CapacitorUpdater.addListener('download', (e) => onProgress(e.percent));
  try {
    return await CapacitorUpdater.download({ url: m.bundle_url, version: m.version });
  } finally {
    await handle.remove();
  }
}

// Activates the bundle now. Native: the plugin reloads the webview. Web: plain reload.
export async function applyNow(bundle: BundleInfo | null): Promise<void> {
  if (isNative() && bundle) {
    await CapacitorUpdater.set({ id: bundle.id });
    return;
  }
  window.location.reload();
}

// Queues the bundle so it is used on the next launch (native only).
export async function applyOnNextLaunch(bundle: BundleInfo | null): Promise<void> {
  if (isNative() && bundle) {
    await CapacitorUpdater.next({ id: bundle.id });
  }
}
