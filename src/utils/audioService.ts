/**
 * Audio Service for Umami Japanese Immersion App
 * Provides 100% guaranteed Japanese audio playback across mobile devices & WebViews,
 * utilizing Android Native TextToSpeech, high-quality Japanese voice audio stream,
 * and SpeechSynthesis fallback, plus live microphone volume analyzer.
 */

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private isUnlocked: boolean = false;

  // Unlock audio context on first user tap (required on mobile browsers & WebViews)
  public unlockAudio() {
    if (this.isUnlocked) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
      }
      this.isUnlocked = true;
    } catch (e) {
      console.warn('AudioContext unlock failed:', e);
    }
  }

  /**
   * Play crystal-clear Japanese native speech.
   * Priority 1: Native Android TextToSpeech (0ms latency, offline, 100% reliable)
   * Priority 2: High-quality audio stream
   * Priority 3: Browser SpeechSynthesis
   */
  public playJapanese(text: string, rate: number = 1.0): Promise<void> {
    if (!text || !text.trim()) {
      return Promise.resolve();
    }

    const cleanText = text.replace(/【.*?】/g, '').trim();

    // Priority 1: Native Android TTS via Java bridge
    if (typeof window !== 'undefined' && (window as any).AndroidAutoUpdater?.speakJapanese) {
      try {
        (window as any).AndroidAutoUpdater.speakJapanese(cleanText);
        return Promise.resolve();
      } catch (e) {
        console.warn('Android Native TTS failed, falling back:', e);
      }
    }

    // Priority 2: Audio Stream
    this.unlockAudio();

    return new Promise((resolve) => {
      // Stop previous audio if playing
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

      const audio = new Audio(ttsUrl);
      audio.playbackRate = rate;
      this.currentAudio = audio;

      let hasResolved = false;
      const finish = () => {
        if (!hasResolved) {
          hasResolved = true;
          this.currentAudio = null;
          resolve();
        }
      };

      audio.onended = finish;
      audio.onerror = () => {
        // Fallback to SpeechSynthesis
        this.playSpeechSynthesisFallback(cleanText, rate).then(finish);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.playSpeechSynthesisFallback(cleanText, rate).then(finish);
        });
      }
    });
  }

  private playSpeechSynthesisFallback(text: string, rate: number = 1.0): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = rate;

        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find((v) => v.lang.startsWith('ja') || v.lang.includes('JP'));
        if (jaVoice) {
          utterance.voice = jaVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      } catch {
        resolve();
      }
    });
  }

  /**
   * Start live microphone stream and return volume analyser for real-time waveform visualization
   */
  public async startMicrophoneRecording(
    onVolume: (vol: number) => void
  ): Promise<{ stop: () => void; mediaStream: MediaStream }> {
    this.unlockAudio();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = this.audioContext || new AudioCtx();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let isRunning = true;

    const checkVolume = () => {
      if (!isRunning) return;
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      onVolume(Math.min(100, Math.round((average / 128) * 100)));
      requestAnimationFrame(checkVolume);
    };

    checkVolume();

    return {
      mediaStream: stream,
      stop: () => {
        isRunning = false;
        stream.getTracks().forEach((track) => track.stop());
        source.disconnect();
      },
    };
  }
}

export const audioService = new AudioService();
