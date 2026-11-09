import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

export const SPEECH_UNAVAILABLE_MSG =
  'อุปกรณ์นี้ยังไม่รองรับการรู้จำเสียง หรือยังไม่ได้อนุญาตไมโครโฟน';

export const isNativeSpeech = (): boolean => Capacitor.isNativePlatform();

// Active session state (one recognition session at a time)
let listeners: PluginListenerHandle[] = [];
let webRecognition: any = null;
let sessionActive = false;
let lastText = '';
let finalizeSession: ((text: string) => void) | null = null;

const finalize = () => {
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

const ensureNativePermission = async (): Promise<void> => {
  const { available } = await SpeechRecognition.available();
  if (!available) throw new Error('speech-unavailable');
  let perm = await SpeechRecognition.checkPermissions();
  if (perm.speechRecognition !== 'granted') {
    perm = await SpeechRecognition.requestPermissions();
  }
  if (perm.speechRecognition !== 'granted') throw new Error('speech-denied');
};

/**
 * Start Japanese speech recognition.
 * onPartial receives interim text; onFinal is called exactly once when the session ends
 * (after stopRecognition() or when the recognizer ends on its own) with the best text heard.
 * Returns false (and calls onError with a Thai message) if recognition cannot start.
 */
export async function startJapaneseRecognition(
  onPartial: (text: string) => void,
  onFinal: (text: string) => void,
  onError: (msg: string) => void
): Promise<boolean> {
  if (sessionActive) return true;
  lastText = '';
  finalizeSession = onFinal;

  if (isNativeSpeech()) {
    try {
      await ensureNativePermission();
      await removeListeners();
      listeners.push(
        await SpeechRecognition.addListener('partialResults', (data: { matches: string[] }) => {
          const text = data?.matches?.[0] ?? '';
          if (text) {
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
      return true;
    } catch (err) {
      console.warn('Native speech start error:', err);
      sessionActive = false;
      finalizeSession = null;
      await removeListeners();
      onError(SPEECH_UNAVAILABLE_MSG);
      return false;
    }
  }

  // Web: Web Speech API (desktop browsers)
  const Rec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Rec) {
    finalizeSession = null;
    onError(SPEECH_UNAVAILABLE_MSG);
    return false;
  }
  try {
    const recognition = new Rec();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript ?? '';
      lastText = text;
      onPartial(text);
    };
    recognition.onerror = () => {
      // keep mic volume active; the session ends via onend
    };
    recognition.onend = () => finalize();
    webRecognition = recognition;
    sessionActive = true;
    recognition.start();
    return true;
  } catch (err) {
    console.warn('Web speech start error:', err);
    sessionActive = false;
    webRecognition = null;
    finalizeSession = null;
    onError(SPEECH_UNAVAILABLE_MSG);
    return false;
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
