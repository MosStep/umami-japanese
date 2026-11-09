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
  // SHA-256 (lowercase hex) of the bundle zip. Required by @capgo/capacitor-updater download().
  checksum: string;
  release_notes: string[];
  announcement?: string;
  apk_url?: string;
};

export type UpdateKind = 'none' | 'ota' | 'apk';

export const isNative = (): boolean => Capacitor.isNativePlatform();

const CHECKSUM_RE = /^[0-9a-f]{64}$/;
const isValidChecksum = (value: unknown): value is string =>
  typeof value === 'string' && CHECKSUM_RE.test(value);

// Versions whose OTA bundle failed to install or to pass notifyAppReady. The plugin rolls these back
// and deletes them, so without this list every launch would download and apply the same bad zip again.
const FAILED_VERSIONS_KEY = 'umami_ota_failed_versions';
// Version passed to next() on the previous launch. If the app still runs an older version on the
// next launch and the manifest still offers this version, the activation did not stick: mark it failed.
const LAST_ATTEMPT_KEY = 'umami_ota_last_attempt';

function readFailedVersions(): string[] {
  try {
    const raw = localStorage.getItem(FAILED_VERSIONS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function addFailedVersion(version: string): void {
  try {
    const list = readFailedVersions();
    if (!list.includes(version)) {
      list.push(version);
      localStorage.setItem(FAILED_VERSIONS_KEY, JSON.stringify(list));
    }
  } catch {}
}

function readLastAttempt(): string | null {
  try {
    return localStorage.getItem(LAST_ATTEMPT_KEY);
  } catch {
    return null;
  }
}

function writeLastAttempt(version: string | null): void {
  try {
    if (version) localStorage.setItem(LAST_ATTEMPT_KEY, version);
    else localStorage.removeItem(LAST_ATTEMPT_KEY);
  } catch {}
}

let initPromise: Promise<void> | null = null;

// Memoized: main.tsx calls it without awaiting, the launch check awaits the same promise.
export function initOta(): Promise<void> {
  if (!initPromise) initPromise = runOtaInit();
  return initPromise;
}

async function runOtaInit(): Promise<void> {
  try {
    for (const key of LEGACY_OTA_KEYS) localStorage.removeItem(key);
  } catch {}

  if (!isNative()) return;

  try {
    await CapacitorUpdater.addListener('updateFailed', (e) => addFailedVersion(e.bundle.version));
  } catch (err) {
    console.warn('updateFailed listener failed:', err);
  }

  try {
    // Returns the failed update only once, so store it here.
    const failed = await CapacitorUpdater.getFailedUpdate();
    if (failed?.bundle?.version) addFailedVersion(failed.bundle.version);
  } catch (err) {
    console.warn('getFailedUpdate failed:', err);
  }
}

// Tells the updater plugin this bundle rendered. Call from App after first mount (not before render):
// a bundle that crashes while rendering never gets here and is rolled back on the next launch.
export async function markBundleReady(): Promise<void> {
  if (!isNative()) return;
  try {
    await CapacitorUpdater.notifyAppReady();
  } catch (err) {
    console.warn('notifyAppReady failed:', err);
  }
}

// Background path only (manual modal retry is always allowed). Returns true when this manifest version
// must not be downloaded automatically: it previously failed, or the last activation attempt did not stick.
export function shouldSkipBackgroundOta(m: Manifest): boolean {
  const last = readLastAttempt();
  if (last) {
    if (compareVersions(APP_VERSION_NAME, last) >= 0) {
      writeLastAttempt(null); // activation worked
    } else if (compareVersions(m.version, last) === 0) {
      addFailedVersion(last);
      writeLastAttempt(null);
    }
  }
  return readFailedVersions().includes(m.version);
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
  // Native OTA download fails without a checksum, so never offer it from a manifest that lacks one.
  if (isNative() && !isValidChecksum(m.checksum)) {
    console.warn('OTA manifest has no valid sha256 checksum; skipping update', m.version);
    return 'none';
  }
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
  if (!isValidChecksum(m.checksum)) {
    throw new Error('OTA manifest has no valid sha256 checksum');
  }

  const handle = await CapacitorUpdater.addListener('download', (e) => onProgress(e.percent));
  try {
    return await CapacitorUpdater.download({
      url: m.bundle_url,
      version: m.version,
      checksum: m.checksum,
    });
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
    writeLastAttempt(bundle.version);
  }
}
