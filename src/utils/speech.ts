import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

export const SPEECH_UNAVAILABLE_MSG =
  'อุปกรณ์นี้ยังไม่รองรับการรู้จำเสียง หรือยังไม่ได้อนุญาตไมโครโฟน';
export const SPEECH_NO_SERVICE_MSG =
  'เครื่องนี้ไม่มีบริการรู้จำเสียงของ Google — ติดตั้ง/อัปเดตแอป Google แล้วลองใหม่';
// Time allowed for the first partial result after starting before we warn the user.
export const SPEECH_FIRST_RESULT_TIMEOUT_MS = 8000;

export const isNativeSpeech = (): boolean => Capacitor.isNativePlatform();

const errMsg = (err: unknown): string => {
  if (err instanceof Error) return err.message || err.name;
  if (err && typeof err === 'object' && 'message' in err) return String((err as any).message);
  return String(err);
};

// Active session state (one recognition session at a time)
let listeners: PluginListenerHandle[] = [];
let webRecognition: any = null;
let sessionActive = false;
let lastText = '';
let finalizeSession: ((text: string) => void) | null = null;
let firstResultTimer: ReturnType<typeof setTimeout> | null = null;

const clearFirstResultTimer = () => {
  if (firstResultTimer) clearTimeout(firstResultTimer);
  firstResultTimer = null;
};

const finalize = () => {
  clearFirstResultTimer();
  if (!sessionActive) return;
  sessionActive = false;
  const cb = finalizeSession;
  finalizeSession = null;
  const text = lastText;
  lastText = '';
  cb?.(text.trim());
};

const removeListeners = async () => {
  const handles = listeners;
  listeners = [];
  await Promise.all(handles.map((h) => h.remove().catch(() => undefined)));
};

/** Resets session state, removes native listeners and reports a Thai error with its technical detail. */
const failSession = async (onError: (msg: string) => void, msg: string): Promise<false> => {
  console.error('[speech] start failed:', msg);
  clearFirstResultTimer();
  sessionActive = false;
  finalizeSession = null;
  webRecognition = null;
  await removeListeners();
  onError(msg);
  return false;
};

/**
 * Start Japanese speech recognition.
 * onPartial receives interim text; onFinal is called exactly once when the session ends
 * (after stopRecognition() or when the recognizer ends on its own) with the best text heard.
 * onError receives a Thai message with the technical cause when recognition cannot start.
 * onWarning receives non-fatal problems while the session runs (e.g. no result within 8 s).
 * Returns false when recognition could not start (onError was called).
 */
export async function startJapaneseRecognition(
  onPartial: (text: string) => void,
  onFinal: (text: string) => void,
  onError: (msg: string) => void,
  onWarning?: (msg: string) => void
): Promise<boolean> {
  if (sessionActive) return true;
  lastText = '';
  finalizeSession = onFinal;
  let gotResult = false;

  const armFirstResultTimer = () => {
    clearFirstResultTimer();
    firstResultTimer = setTimeout(() => {
      firstResultTimer = null;
      if (!gotResult && sessionActive) {
        const msg = `ยังไม่ได้ยินผลการรู้จำเสียงภายใน ${SPEECH_FIRST_RESULT_TIMEOUT_MS / 1000} วินาที (ลองพูดให้ดังขึ้นหรือตรวจไมค์) — ไม่มีผลลัพธ์จากบริการรู้จำเสียง`;
        console.warn('[speech]', msg);
        onWarning?.(msg);
      }
    }, SPEECH_FIRST_RESULT_TIMEOUT_MS);
  };

  if (isNativeSpeech()) {
    // 1. Availability and permission are resolved BEFORE any listener is added or start() is called.
    try {
      const { available } = await SpeechRecognition.available();
      if (!available) return failSession(onError, SPEECH_NO_SERVICE_MSG + ' (available = false)');
      let perm = await SpeechRecognition.checkPermissions();
      if (perm.speechRecognition !== 'granted') {
        perm = await SpeechRecognition.requestPermissions();
      }
      if (perm.speechRecognition !== 'granted') {
        return failSession(
          onError,
          `ยังไม่ได้รับสิทธิ์การรู้จำเสียง/ไมโครโฟน (สถานะ: ${String(perm.speechRecognition)})`
        );
      }
    } catch (err) {
      return failSession(onError, `เริ่มรู้จำเสียงไม่สำเร็จ: ${errMsg(err)}`);
    }

    // 2. Listeners are attached before start() so no early partial result is lost.
    try {
      await removeListeners();
      listeners.push(
        await SpeechRecognition.addListener('partialResults', (data: { matches: string[] }) => {
          const text = data?.matches?.[0] ?? '';
          if (text) {
            gotResult = true;
            clearFirstResultTimer();
            lastText = text;
            onPartial(text);
          }
        })
      );
      listeners.push(
        await SpeechRecognition.addListener('listeningState', (data: { status: string }) => {
          if (data?.status === 'stopped') finalize();
        })
      );
      sessionActive = true;
      await SpeechRecognition.start({
        language: 'ja-JP',
        maxResults: 1,
        partialResults: true,
        popup: false,
      });
      armFirstResultTimer();
      return true;
    } catch (err) {
      return failSession(onError, `เริ่มรู้จำเสียงไม่สำเร็จ: ${errMsg(err)}`);
    }
  }

  // Web: Web Speech API (desktop browsers)
  const Rec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Rec) {
    return failSession(onError, `${SPEECH_UNAVAILABLE_MSG} (ไม่มี SpeechRecognition API ในเบราว์เซอร์นี้)`);
  }
  try {
    const recognition = new Rec();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript ?? '';
      if (text) {
        gotResult = true;
        clearFirstResultTimer();
      }
      lastText = text;
      onPartial(text);
    };
    recognition.onerror = (event: any) => {
      // 'no-speech' and 'aborted' are normal ends; the session still finishes via onend.
      const code = event?.error ? String(event.error) : 'unknown';
      if (code !== 'no-speech' && code !== 'aborted') {
        console.warn('[speech] web recognition error:', code);
        onWarning?.(`รู้จำเสียงผิดพลาด: ${code}`);
      }
    };
    recognition.onend = () => finalize();
    webRecognition = recognition;
    sessionActive = true;
    recognition.start();
    armFirstResultTimer();
    return true;
  } catch (err) {
    return failSession(onError, `เริ่มรู้จำเสียงไม่สำเร็จ: ${errMsg(err)}`);
  }
}

/** Stop the current session; onFinal fires with the final text. */
export async function stopRecognition(): Promise<void> {
  if (!sessionActive) return;
  if (isNativeSpeech()) {
    try {
      await SpeechRecognition.stop();
    } catch {
      // ignore: finalize below still runs
    }
    await removeListeners();
    finalize();
  } else {
    try {
      webRecognition?.stop();
    } catch {
      // ignore
    }
    webRecognition = null;
    finalize();
  }
}
