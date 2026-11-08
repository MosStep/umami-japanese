export const APP_VERSION_BASE = 'v1.0.6';
export const APP_VERSION_NAME = '1.0.6';
export const APP_BUILD = 106;
export const APP_RELEASE_DATE = '2026-11-08';

export const getLiveAppVersion = (): string => {
  try {
    const live = localStorage.getItem('umami_live_tag') || localStorage.getItem('umami_live_version');
    if (live) return live.startsWith('v') ? live : `v${live}`;
  } catch {}
  return APP_VERSION_BASE;
};

export const APP_VERSION = getLiveAppVersion();
