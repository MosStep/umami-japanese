import { STORAGE_KEYS } from '../config/storageKeys';

// Idempotent cleanup of AI settings saved by older builds (Kob AI era).
// - provider 'kob-ai' -> 'tenixe' (Kob AI is no longer offered); its model names are not Tenixe models.
// - API key starting with 'kob_' is a Kob key and is rejected by Tenixe; it is cleared.
// Safe to run on every launch: once migrated, the stored values no longer match.
export const runMigrationAi = (): void => {
  try {
    if (localStorage.getItem(STORAGE_KEYS.AI_PROVIDER) === 'kob-ai') {
      localStorage.setItem(STORAGE_KEYS.AI_PROVIDER, 'tenixe');
      localStorage.setItem(STORAGE_KEYS.AI_MODEL, 'claude-haiku-5-5');
    }
    const key = localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
    if (key.trim().startsWith('kob_')) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, '');
    }
  } catch {
    // storage unavailable: the in-memory defaults still apply
  }
};
