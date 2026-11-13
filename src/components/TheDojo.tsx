import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MinedSentenceRecord, SubtitleLineRecord } from '../schema/databaseSchema';
import { audioService } from '../utils/audioService';
import { AiChat } from './AiChat';
import { AGAIN_GAP, NEW_PER_SESSION, buildReviewQueue, gradeWord, loadWordSrs, saveWordSrs, WordSrsMap } from '../utils/wordSrs';
import {
  isNativeSpeech,
  startJapaneseRecognition,
  stopRecognition,
} from '../utils/speech';
import {
  Swords,
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  Zap,
  Flame,
  Layers,
  MessageCircle,
  X,
  Minus,
  Check,
} from 'lucide-react';

export const TheDojo: React.FC = () => {
  const {
    minedSentences,
    updateSRSReview,
    videos,
    getLineById,
    dictionaryWords,
    wordStates,
    setWordStatus,
    getWordStatus,
    addXP,
    recordReview,
    setActiveVideoId,
    setActiveTab,
  } = useApp();

  const [activeMode, setActiveMode] = useState<'srs' | 'shadowing' | 'roleplay'>('srs');

  // Mode A: Flashcards & SRS State
  const [srsDeckType, setSrsDeckType] = useState<'words' | 'mined'>('words');
  const [wordFilter, setWordFilter] = useState<'all' | 'learning' | 'known'>('all');
  // Word cards: a queue of word ids built once per session/filter (not re-sorted while you study).
  const [srsMap, setSrsMap] = useState<WordSrsMap>(loadWordSrs);
  const [wordQueue, setWordQueue] = useState<string[]>([]);
  const [queueTotal, setQueueTotal] = useState<number>(0);
  const [queueNonce, setQueueNonce] = useState<number>(0);
  const [srsIndex, setSrsIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [quizMode, setQuizMode] = useState<'cloze' | 'listening'>('cloze');

  // Mode B: Shadowing State
  const [selectedMinedForShadow, setSelectedMinedForShadow] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveVolume, setLiveVolume] = useState<number>(0);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [moraFeedback, setMoraFeedback] = useState<{ char: string; correct: boolean }[]>([]);
  const [speechWarning, setSpeechWarning] = useState<string | null>(null);
  const recordingStopRef = useRef<(() => void) | null>(null);

  const learningCount = dictionaryWords.filter(
    (w) => (wordStates[w.id] || 'new') === 'learning'
  ).length;
  const knownCount = dictionaryWords.filter(
    (w) => (wordStates[w.id] || 'new') === 'known'
  ).length;

  const filteredWords = React.useMemo(() => {
    if (wordFilter === 'learning') {
      const list = dictionaryWords.filter(
        (w) => (wordStates[w.id] || 'new') === 'learning'
      );
      return list.length ? list : dictionaryWords;
    }
    if (wordFilter === 'known') {
      const list = dictionaryWords.filter(
        (w) => (wordStates[w.id] || 'new') === 'known'
      );
      return list.length ? list : dictionaryWords;
    }
    return [...dictionaryWords].sort((a, b) => {
      const sa = wordStates[a.id] || 'new';
      const sb = wordStates[b.id] || 'new';
      if (sa === 'learning' && sb !== 'learning') return -1;
      if (sb === 'learning' && sa !== 'learning') return 1;
      if (sa === 'known' && sb === 'new') return -1;
      if (sb === 'known' && sa === 'new') return 1;
      return 0;
    });
  }, [dictionaryWords, wordStates, wordFilter]);

  // 'all' = today's review (due + a few new words); 'learning' / 'known' = browse those lists in a loop.
  useEffect(() => {
    const ids =
      wordFilter === 'all'
        ? buildReviewQueue(dictionaryWords.map((w) => w.id), loadWordSrs())
        : filteredWords.map((w) => w.id);
    setWordQueue(ids);
    setQueueTotal(ids.length);
    setIsRevealed(false);
    // filteredWords is read once per rebuild on purpose: grading must not reshuffle the cards under you.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordFilter, dictionaryWords.length, queueNonce]);

  // One real example sentence per word (scripts/build-word-examples.mjs), loaded only when the Dojo opens.
  const [examples, setExamples] = useState<Record<string, [string, string, string, number]> | null>(null);
  useEffect(() => {
    import('../data/word-examples.json')
      .then((m) => setExamples(m.default as unknown as Record<string, [string, string, string, number]>))
      .catch(() => setExamples({}));
  }, []);
  const exampleFor = (w: { id: string; lemma: string; reading_kana: string }) =>
    examples?.[w.id.startsWith('g:') ? w.id.slice(2) : `${w.lemma}|${w.reading_kana}`];
  const openExampleClip = (youtubeId: string) => {
    const v = videos.find((x) => x.youtube_id === youtubeId);
    if (!v) return;
    setActiveVideoId(v.id);
    setActiveTab('player');
  };

  const dueTodayCount = buildReviewQueue(dictionaryWords.map((w) => w.id), srsMap).length;
  const currentWord = dictionaryWords.find((w) => w.id === wordQueue[0]);
  const reviewedInQueue = queueTotal - wordQueue.length;
  // Cards get harder as a word matures: read it → hear it → recall it from Thai (today's review only).
  const cardStage: 'read' | 'listen' | 'recall' = (() => {
    if (wordFilter !== 'all' || !currentWord) return 'read';
    const ivl = srsMap[currentWord.id]?.ivl ?? 0;
    return ivl >= 8 ? 'recall' : ivl >= 2 ? 'listen' : 'read';
  })();
  useEffect(() => {
    if (currentWord && cardStage === 'listen' && !isRevealed) audioService.playJapanese(currentWord.lemma);
    // play once when a listening card appears
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWord?.id, cardStage]);
  const currentMined = minedSentences[srsIndex] || minedSentences[0];

  // Guaranteed native audio playback across all devices
  const playAudio = (text: string) => {
    audioService.playJapanese(text);
  };

  // Helper to locate full subtitle line across all available lines
  const findLine = (videoId?: string, lineId?: string): SubtitleLineRecord | undefined =>
    getLineById(videoId, lineId);

  // [BUG-03] Separate Mode A Sentence Retriever (SRS Index based)
  const getModeAMinedSentence = () => {
    const mined = minedSentences[srsIndex] || minedSentences[0];
    if (!mined) return { japanese: 'ここに 3匹の ポケモンが いるじゃろう！', thai: 'ตรงนี้มีโปเกมอนอยู่ 3 ตัวยังไงล่ะ!', targetWord: null, targetLemma: '', line: undefined, mined: undefined };
    const line = findLine(mined.video_id, mined.subtitle_line_id);
    const targetWord = dictionaryWords.find((w) => w.id === mined.target_word_id);
    // Prefer the inflected surface as it appears in the line (待ってる), then the dictionary lemma.
    const targetLemma =
      line?.tokens_json?.find((t) => t.word_id === mined.target_word_id)?.surface || targetWord?.lemma || '';
    // Never use the Thai user_note as the Japanese text; fall back to the target lemma.
    const japanese = line?.raw_text || targetLemma || '';
    const missing = !japanese;
    const thai = line?.thai_translation || line?.natural_translation || mined.user_note || 'คำแปลประโยคภาษาไทย';
    return { japanese, thai, targetWord, targetLemma, line, mined, missing };
  };

  // [BUG-03] Proper Cloze Deletion replacer: blanks out the target word or token
  const getClozeSentence = (japanese: string, targetLemma: string, line?: SubtitleLineRecord): string => {
    if (!japanese) return '【 ＿＿＿ 】';
    if (targetLemma && japanese.includes(targetLemma)) {
      return japanese.replace(targetLemma, '【 ＿＿＿ 】');
    }
    if (line && line.tokens_json) {
      for (const t of line.tokens_json) {
        if (t.surface && japanese.includes(t.surface) && !['が', 'を', 'に', 'へ', 'と', 'で', 'は', 'の', 'か'].includes(t.surface)) {
          return japanese.replace(t.surface, '【 ＿＿＿ 】');
        }
      }
    }
    // Fallback: blank out first or middle section
    if (japanese.length > 6) {
      const start = Math.floor(japanese.length / 4);
      const end = Math.min(japanese.length, start + 3);
      return japanese.slice(0, start) + '【 ＿＿＿ 】' + japanese.slice(end);
    }
    return '【 ＿＿＿ 】';
  };

  // [BUG-04] Separate Mode B Sentence Retriever (selectedMinedForShadow based)
  const getModeBShadowSentence = () => {
    const mined = minedSentences[selectedMinedForShadow] || minedSentences[0];
    if (!mined) return { japanese: 'ここに 3匹の ポケモンが いるじゃろう！', thai: 'ตรงนี้มีโปเกมอนอยู่ 3 ตัวยังไงล่ะ!', targetWord: null, targetLemma: '', line: undefined, mined: undefined };
    const line = findLine(mined.video_id, mined.subtitle_line_id);
    const targetWord = dictionaryWords.find((w) => w.id === mined.target_word_id);
    const targetLemma = targetWord?.lemma || '';
    // Never use the Thai user_note as the Japanese text; fall back to the target lemma.
    const japanese = line?.raw_text || targetLemma || '';
    const missing = !japanese;
    const thai = line?.thai_translation || line?.natural_translation || mined.user_note || '';
    return { japanese, thai, targetWord, targetLemma, line, mined, missing };
  };

  // Start shadowing recording. Web: mic volume waveform + Web Speech API.
  // Native (Android): Capacitor speech plugin only; the waveform is skipped because
  // a concurrent getUserMedia stream can block the native recognizer.
  const stopMic = () => {
    if (recordingStopRef.current) {
      recordingStopRef.current();
      recordingStopRef.current = null;
    }
  };

  const finishRecording = (spoken: string) => {
    stopMic();
    setIsRecording(false);
    setLiveVolume(0);
    const text = spoken.trim();
    if (!text) {
      setPronunciationScore(null);
      setMoraFeedback([]);
      setSpeechWarning('ยังตรวจไม่พบเสียงพูด กรุณาลองพูดใหม่อีกครั้ง');
      return;
    }
    setUserTranscript(text);
    setSpeechWarning(null);
    gradeShadowing(text);
  };

  const startRecording = async () => {
    setIsRecording(true);
    setUserTranscript('');
    setPronunciationScore(null);
    setMoraFeedback([]);
    setSpeechWarning(null);

    if (!isNativeSpeech()) {
      try {
        const mic = await audioService.startMicrophoneRecording((vol) => {
          setLiveVolume(vol);
        });
        recordingStopRef.current = mic.stop;
      } catch (err) {
        console.warn('Microphone start error:', err);
      }
    }

    await startJapaneseRecognition(
      (partial) => {
        setUserTranscript(partial);
        setSpeechWarning(null);
      },
      (finalText) => finishRecording(finalText),
      (msg) => {
        stopMic();
        setIsRecording(false);
        setLiveVolume(0);
        setSpeechWarning(msg);
      },
      (warn) => setSpeechWarning(warn)
    );
  };

  // Stop Recording and Grade Pronunciation (the session's onFinal calls finishRecording)
  const stopRecording = () => {
    void stopRecognition();
  };

  // Grade shadowing character-level diff and mora cadence
  const gradeShadowing = (spoken: string) => {
    const { japanese } = getModeBShadowSentence();
    const target = japanese;
    setUserTranscript(spoken);

    let matches = 0;
    const feedback: { char: string; correct: boolean }[] = [];

    for (let i = 0; i < target.length; i++) {
      const char = target[i];
      const isMatched = spoken.includes(char);
      if (isMatched) matches++;
      feedback.push({ char, correct: isMatched });
    }

    const calculatedScore = Math.min(
      100,
      Math.max(25, Math.round((matches / Math.max(1, target.length)) * 100))
    );
    setPronunciationScore(calculatedScore);
    setMoraFeedback(feedback);
    addXP('shadowing', Math.round(calculatedScore / 2));
  };

  const handleSRSGrade = (grade: 'again' | 'hard' | 'good' | 'easy') => {
    if (currentMined) {
      updateSRSReview(currentMined.id, grade);
    }
    setIsRevealed(false);
    if (srsIndex < minedSentences.length - 1) {
      setSrsIndex((prev) => prev + 1);
    } else {
      setSrsIndex(0);
    }
  };

  const handleWordGrade = (grade: 'again' | 'good' | 'easy') => {
    if (!currentWord) return;
    recordReview();
    if (grade === 'again') {
      setWordStatus(currentWord.id, 'learning');
    } else if (grade === 'good') {
      setWordStatus(currentWord.id, 'learning');
      addXP('reading', 5);
    } else {
      setWordStatus(currentWord.id, 'known');
      addXP('reading', 15);
    }
    const nextMap = { ...srsMap, [currentWord.id]: gradeWord(srsMap[currentWord.id], grade) };
    setSrsMap(nextMap);
    saveWordSrs(nextMap);
    setIsRevealed(false);
    setWordQueue((q) => {
      const [head, ...rest] = q;
      if (wordFilter !== 'all') return [...rest, head]; // browsing: rotate
      if (grade === 'again') return [...rest.slice(0, AGAIN_GAP), head, ...rest.slice(AGAIN_GAP)];
      return rest;
    });
    if (wordFilter === 'all' && grade === 'again') setQueueTotal((t) => t + 1);
  };


  // Presentation helpers (layout only)
  const modeTabs = [
    { key: 'srs' as const, label: 'แฟลชการ์ด', Icon: Layers },
    { key: 'shadowing' as const, label: 'พูดตาม', Icon: Mic },
    { key: 'roleplay' as const, label: 'คุยกับ AI', Icon: MessageCircle },
  ];

  const chipClass = (on: boolean, onCls: string) =>
    `min-h-11 px-2 rounded-xl border text-sm font-bold transition-all active:opacity-80 ${
      on ? onCls : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
    }`;

  const gradeClass = (tone: 'rose' | 'amber' | 'indigo' | 'emerald') => {
    const tones = {
      rose: 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-950/80',
      amber: 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-950/80',
      indigo: 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/80',
      emerald: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/80',
    };
    return `min-h-12 px-1.5 py-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-0.5 text-sm font-bold text-center leading-tight transition-all active:opacity-80 ${tones[tone]}`;
  };

  const renderProgress = (label: string, index: number, total: number) => (
    <div className="space-y-1.5">
      <div className="font-mono text-xs font-semibold text-rose-300">
        {label} {index + 1} / {total}
      </div>
      <div
        className="h-1.5 rounded-full bg-slate-800 overflow-hidden"
        role="progressbar"
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={Math.max(1, total)}
        aria-valuenow={index + 1}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-300"
          style={{ width: `${Math.round(((index + 1) / Math.max(1, total)) * 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Compact Dojo Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950/40 border border-red-500/30 px-4 py-2 md:p-6 shadow-lg">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-9xl font-jp select-none font-black text-rose-500 hidden md:block">
          道場
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <Swords className="w-5 h-5 md:w-7 md:h-7 text-rose-400 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-extrabold text-white leading-tight">โดโจ</h1>
            <p className="text-xs md:text-sm text-slate-300">ฝึกคำศัพท์ • พูดตาม • สนทนา</p>
          </div>
        </div>
      </header>

      {/* Mode Switch: sticky segmented control under the app navbar */}
      <div className="sticky top-[calc(53px_+_var(--sat))] sm:top-[calc(57px_+_var(--sat))] z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-slate-950/90 backdrop-blur-md">
        <div
          role="tablist"
          aria-label="โหมดฝึก"
          className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800"
        >
          {modeTabs.map(({ key, label, Icon }) => {
            const selected = activeMode === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveMode(key)}
                className={`min-h-12 px-1 md:px-2 rounded-xl flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-1.5 text-sm font-bold transition-all active:opacity-80 ${
                  selected
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode A: Flashcards & SRS Review */}
      {activeMode === 'srs' && (
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Deck chips (row 1) and word filter chips (row 2, words deck only) */}
          <div className="space-y-2">
          <div role="group" aria-label="ชุดคำถาม" className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={srsDeckType === 'words'}
              onClick={() => {
                setSrsDeckType('words');
                setIsRevealed(false);
              }}
              className={chipClass(srsDeckType === 'words', 'bg-rose-600 border-rose-500 text-white')}
            >
              คำศัพท์ ({dictionaryWords.length})
            </button>
            <button
              type="button"
              aria-pressed={srsDeckType === 'mined'}
              onClick={() => {
                setSrsDeckType('mined');
                setIsRevealed(false);
              }}
              className={chipClass(srsDeckType === 'mined', 'bg-rose-600 border-rose-500 text-white')}
            >
              ประโยคที่บันทึก ({minedSentences.length})
            </button>
          </div>
          {srsDeckType === 'words' && (
            <div role="group" aria-label="ตัวกรองคำศัพท์" className="grid grid-cols-3 gap-2">
              <button
                type="button"
                aria-pressed={wordFilter === 'all'}
                onClick={() => {
                  setWordFilter('all');
                  setIsRevealed(false);
                }}
                className={chipClass(wordFilter === 'all', 'bg-slate-200 border-slate-200 text-slate-900')}
              >
                <span className="flex flex-col leading-tight">
                  <span>ทบทวนวันนี้</span>
                  <span className="text-xs font-normal">{dueTodayCount} คำ</span>
                </span>
              </button>
              <button
                type="button"
                aria-pressed={wordFilter === 'learning'}
                onClick={() => {
                  setWordFilter('learning');
                  setIsRevealed(false);
                }}
                className={chipClass(wordFilter === 'learning', 'bg-amber-600 border-amber-500 text-white')}
              >
                <span className="flex flex-col leading-tight">
                  <span>กำลังเรียน</span>
                  <span className="text-xs font-normal">{learningCount} คำ</span>
                </span>
              </button>
              <button
                type="button"
                aria-pressed={wordFilter === 'known'}
                onClick={() => {
                  setWordFilter('known');
                  setIsRevealed(false);
                }}
                className={chipClass(wordFilter === 'known', 'bg-emerald-600 border-emerald-500 text-white')}
              >
                <span className="flex flex-col leading-tight">
                  <span>จำได้แล้ว</span>
                  <span className="text-xs font-normal">{knownCount} คำ</span>
                </span>
              </button>
            </div>
          )}
          </div>

          {srsDeckType === 'words' ? (
            /* WORDS VAULT DECK */
            <div className="space-y-3">
              {currentWord && renderProgress(wordFilter === 'all' ? 'ทบทวนแล้ว' : 'คำที่', wordFilter === 'all' ? reviewedInQueue : 0, queueTotal)}
              <div className="rounded-3xl bg-slate-900/90 border-2 border-slate-800 shadow-2xl overflow-hidden p-4 sm:p-8 space-y-4">
                {currentWord ? (
                  <>
                    {/* Flashcard Body: front depends on the stage, back shows reading, meaning and a real example */}
                    <div className="py-2 sm:py-4 space-y-3 text-center">
                      <p className="text-xs font-semibold text-slate-400">
                        {cardStage === 'read' ? 'ดูคำ แล้วนึกความหมาย' : cardStage === 'listen' ? 'ฟังเสียง แล้วนึกความหมาย' : 'ดูความหมาย แล้วนึกคำภาษาญี่ปุ่น'}
                      </p>

                      {cardStage === 'listen' && !isRevealed ? (
                        <button
                          type="button"
                          onClick={() => playAudio(currentWord.lemma)}
                          aria-label="ฟังอีกครั้ง"
                          className="mx-auto w-24 h-24 rounded-full bg-rose-600/20 border-2 border-rose-500/50 text-rose-300 flex items-center justify-center active:opacity-80"
                        >
                          <Volume2 className="w-10 h-10" aria-hidden="true" />
                        </button>
                      ) : cardStage === 'recall' && !isRevealed ? (
                        <p className="text-2xl sm:text-3xl font-bold text-emerald-300 leading-relaxed">
                          {currentWord.core_meanings?.join(', ') || '—'}
                        </p>
                      ) : (
                        <p className="font-jp text-4xl sm:text-5xl font-extrabold text-white leading-relaxed tracking-wider">
                          {currentWord.lemma}
                        </p>
                      )}

                      {isRevealed && (
                        <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                          <div className="flex items-center justify-center gap-2">
                            <p className="text-lg font-jp text-indigo-300 font-bold">
                              {currentWord.reading_kana} {currentWord.romaji ? `(${currentWord.romaji})` : ''}
                            </p>
                            <button
                              type="button"
                              onClick={() => playAudio(currentWord.lemma)}
                              aria-label="ฟังคำนี้"
                              className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl bg-slate-800 text-rose-300 hover:bg-slate-700 active:opacity-80 transition-colors"
                            >
                              <Volume2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                          {cardStage !== 'recall' && (
                            <p className="text-lg sm:text-xl text-emerald-300 font-bold">
                              {currentWord.core_meanings?.join(', ') || '—'}
                            </p>
                          )}
                          {(() => {
                            const ex = exampleFor(currentWord);
                            if (!ex) return null;
                            return (
                              <div className="text-left rounded-2xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5">
                                <p className="text-xs font-semibold text-slate-400">ตัวอย่างจากคลิป</p>
                                <p className="font-jp text-base text-slate-100 leading-relaxed">{ex[0]}</p>
                                <p className="text-sm text-slate-400">{ex[1]}</p>
                                <div className="flex gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => playAudio(ex[0])}
                                    className="min-h-10 px-3 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold flex items-center gap-1.5 hover:bg-slate-700"
                                  >
                                    <Volume2 className="w-4 h-4" aria-hidden="true" /> ฟังประโยค
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openExampleClip(ex[2])}
                                    className="min-h-10 px-3 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700"
                                  >
                                    ดูในคลิป
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Reveal / Controls */}
                    {!isRevealed ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsRevealed(true);
                          playAudio(currentWord.lemma);
                        }}
                        className="w-full min-h-12 py-3 rounded-2xl text-base font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/30 transition-all active:opacity-80"
                      >
                        แตะเพื่อดูคำตอบ
                      </button>
                    ) : (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        {/* Word Grade Rating Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleWordGrade('again')}
                            className={gradeClass('rose')}
                          >
                            <span className="flex items-center gap-1">
                              <X className="w-4 h-4" aria-hidden="true" />
                              <span>ยังจำไม่ได้</span>
                            </span>
                            <span className="text-xs font-normal text-slate-300">ทบทวนต่อ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleWordGrade('good')}
                            className={gradeClass('amber')}
                          >
                            <span className="flex items-center gap-1">
                              <Zap className="w-4 h-4" aria-hidden="true" />
                              <span>พอจำได้</span>
                            </span>
                            <span className="text-xs font-normal text-slate-300">+5 XP</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleWordGrade('easy')}
                            className={gradeClass('emerald')}
                          >
                            <span className="flex items-center gap-1">
                              <Check className="w-4 h-4" aria-hidden="true" />
                              <span>จำได้แม่น</span>
                            </span>
                            <span className="text-xs font-normal text-slate-300">+15 XP</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  wordFilter === 'all' ? (
                    <div className="text-center py-8 space-y-3">
                      <p className="text-4xl" aria-hidden="true">🎉</p>
                      <p className="text-lg font-bold text-white">ทบทวนครบแล้วสำหรับวันนี้</p>
                      <p className="text-sm text-slate-400">คำที่ทบทวนแล้วจะกลับมาให้ทวนอีกตามรอบ (1, 2, 4, 8… วัน)</p>
                      <button
                        type="button"
                        onClick={() => setQueueNonce((n) => n + 1)}
                        className="min-h-12 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                      >
                        เรียนคำใหม่อีก {NEW_PER_SESSION} คำ
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-300">ยังไม่มีคำในกลุ่มนี้</div>
                  )
                )}
              </div>
            </div>
          ) : minedSentences.length === 0 ? (
            /* MINED SENTENCES DECK: empty */
            <div className="text-center py-12 space-y-4 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <Swords className="w-12 h-12 text-rose-500/60 mx-auto" aria-hidden="true" />
              <h3 className="text-xl font-bold text-slate-200">ยังไม่มีประโยคที่บันทึกไว้</h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                ไปที่หน้าเครื่องเล่นวิดีโอ แล้วแตะปุ่ม "Mine" บนซับไตเติลใดก็ได้เพื่อดึงประโยคเข้ามาฝึก
              </p>
            </div>
          ) : (
            /* MINED SENTENCES DECK */
            <div className="space-y-3">
              {renderProgress('ประโยคที่', srsIndex, minedSentences.length)}
              <div className="rounded-3xl bg-slate-900/90 border-2 border-slate-800 shadow-2xl overflow-hidden p-4 sm:p-8 space-y-4">
                {/* Card Meta & Drill Toggle (hidden when the line cannot be resolved) */}
                <div className="flex items-center justify-between gap-2">
                  {!getModeAMinedSentence().missing ? (
                    <button
                      type="button"
                      onClick={() => setQuizMode(quizMode === 'cloze' ? 'listening' : 'cloze')}
                      className="min-h-11 px-3.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-sm font-semibold transition-colors active:opacity-80"
                    >
                      โหมด: {quizMode === 'cloze' ? 'เติมคำ' : 'ฟังเสียง'}
                    </button>
                  ) : (
                    <span />
                  )}
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono text-xs">
                    ช่วง: {currentMined?.srs_interval || 1} วัน
                  </span>
                </div>

                {/* Flashcard Prompt Area */}
                {(() => {
                  const modeA = getModeAMinedSentence();
                  const clozeText = getClozeSentence(modeA.japanese, modeA.targetLemma, modeA.line);

                  if (modeA.missing) {
                    // Unresolvable line: no cloze/reveal/grade controls, only a skip to the next card.
                    return (
                      <>
                        <div className="py-2 sm:py-4 space-y-3 text-center">
                          <p className="text-sm text-slate-300">ไม่พบประโยคต้นฉบับ (คลิปอาจถูกอัปเดต)</p>
                          {modeA.thai && <p className="text-base text-emerald-300 font-bold">🇹🇭 {modeA.thai}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsRevealed(false);
                            setSrsIndex(srsIndex < minedSentences.length - 1 ? srsIndex + 1 : 0);
                          }}
                          className="w-full min-h-12 py-3 rounded-2xl text-base font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 transition-all active:opacity-80"
                        >
                          ไปการ์ดถัดไป
                        </button>
                      </>
                    );
                  }

                  return (
                    <>
                      <div className="py-2 sm:py-4 space-y-3 text-center">
                        {quizMode === 'listening' && !isRevealed ? (
                          <div className="space-y-4">
                            <button
                              type="button"
                              onClick={() => playAudio(modeA.japanese)}
                              className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 text-white flex items-center justify-center mx-auto shadow-2xl shadow-rose-600/50 transition-all active:opacity-80"
                              aria-label="ฟังเสียงประโยค"
                            >
                              <Volume2 className="w-10 h-10" aria-hidden="true" />
                            </button>
                            <p className="text-sm text-slate-300 font-medium">
                              แตะปุ่มเพื่อฟังเสียง แล้วนึกความหมายในใจ
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2">
                              <p className="font-jp text-2xl sm:text-3xl font-extrabold text-white leading-relaxed tracking-wide">
                                {isRevealed ? modeA.japanese : clozeText}
                              </p>
                              {isRevealed && (
                                <button
                                  type="button"
                                  onClick={() => playAudio(modeA.japanese)}
                                  aria-label="ฟังอีกครั้ง"
                                  className="min-h-11 min-w-11 shrink-0 inline-flex items-center justify-center rounded-xl bg-slate-800 text-rose-300 hover:bg-slate-700 active:opacity-80 transition-colors"
                                >
                                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                                </button>
                              )}
                            </div>
                            {isRevealed && (
                              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                                <p className="text-lg text-emerald-300 font-bold">🇹🇭 {modeA.thai}</p>
                                {modeA.targetWord && (
                                  <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm font-bold mt-1">
                                    <span>คำศัพท์เป้าหมาย:</span>
                                    <span className="font-jp text-white font-extrabold">{modeA.targetWord.lemma}</span>
                                    <span className="text-slate-300">({modeA.targetWord.reading_kana})</span>
                                    <span>• {modeA.targetWord.core_meanings?.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Reveal & Audio Controls */}
                      {!isRevealed ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsRevealed(true);
                            playAudio(modeA.japanese);
                          }}
                          className="w-full min-h-12 py-3 rounded-2xl text-base font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/30 transition-all active:opacity-80"
                        >
                          แตะเพื่อดูคำตอบ
                        </button>
                      ) : (
                        <div className="space-y-4 animate-in fade-in duration-150">
                          {/* SRS Rating Buttons */}
                          <div className="grid grid-cols-4 gap-2">
                            <button
                              type="button"
                              onClick={() => handleSRSGrade('again')}
                              className={gradeClass('rose')}
                            >
                              <span className="flex items-center gap-1">
                                <X className="w-4 h-4" aria-hidden="true" />
                                <span>อีกครั้ง</span>
                              </span>
                              <span className="text-xs font-normal text-slate-300">12 ชม.</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSRSGrade('hard')}
                              className={gradeClass('amber')}
                            >
                              <span className="flex items-center gap-1">
                                <Minus className="w-4 h-4" aria-hidden="true" />
                                <span>ยาก</span>
                              </span>
                              <span className="text-xs font-normal text-slate-300">1 วัน</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSRSGrade('good')}
                              className={gradeClass('indigo')}
                            >
                              <span className="flex items-center gap-1">
                                <Check className="w-4 h-4" aria-hidden="true" />
                                <span>ดี</span>
                              </span>
                              <span className="text-xs font-normal text-slate-300">3 วัน</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSRSGrade('easy')}
                              className={gradeClass('emerald')}
                            >
                              <span className="flex items-center gap-1">
                                <Zap className="w-4 h-4" aria-hidden="true" />
                                <span>ง่าย</span>
                              </span>
                              <span className="text-xs font-normal text-slate-300">5 วัน</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode B: Shadowing & Live Waveform Grader */}
      {activeMode === 'shadowing' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {(() => {
            const modeB = getModeBShadowSentence();

            return (
              <div className="rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-4 sm:p-8 space-y-5 shadow-2xl">
                {/* Sentence Selector Dropdown */}
                {minedSentences.length > 0 && (
                  <div className="space-y-1.5 pb-2 border-b border-slate-800">
                    <label
                      htmlFor="shadowing-sentence"
                      className="text-xs font-semibold text-slate-300 flex items-center justify-between gap-2"
                    >
                      <span>เลือกประโยคที่จะฝึก ({selectedMinedForShadow + 1} / {minedSentences.length}):</span>
                      <span className="font-mono text-rose-300">สลับประโยค</span>
                    </label>
                    <select
                      id="shadowing-sentence"
                      value={selectedMinedForShadow}
                      onChange={(e) => {
                        setSelectedMinedForShadow(Number(e.target.value));
                        setUserTranscript('');
                        setPronunciationScore(null);
                        setMoraFeedback([]);
                        setSpeechWarning(null);
                      }}
                      className="w-full min-h-11 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-medium cursor-pointer"
                    >
                      {minedSentences.map((m, idx) => {
                        const l = findLine(m.video_id, m.subtitle_line_id);
                        const txt = l?.raw_text || m.user_note || `ประโยคที่ ${idx + 1}`;
                        return (
                          <option key={m.id} value={idx}>
                            ประโยคที่ {idx + 1}: {txt.length > 35 ? txt.slice(0, 35) + '...' : txt}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-rose-300 tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                    ฟังเสียงต้นฉบับ แล้วพูดตาม
                  </span>
                  {modeB.missing ? (
                    <p className="text-sm text-slate-300 pt-1">ไม่พบประโยคต้นฉบับ (คลิปอาจถูกอัปเดต)</p>
                  ) : (
                    <h3 className="font-jp text-2xl sm:text-3xl font-extrabold text-white pt-1 leading-relaxed">
                      {modeB.japanese}
                    </h3>
                  )}
                  {modeB.thai && <p className="text-sm font-medium text-emerald-300">🇹🇭 {modeB.thai}</p>}
                </div>

                {!modeB.missing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => playAudio(modeB.japanese)}
                    className="min-h-11 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors active:opacity-80"
                  >
                    <Volume2 className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    ฟังเสียงต้นฉบับ
                  </button>

                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="min-h-12 px-6 rounded-2xl text-sm font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/30 inline-flex items-center justify-center gap-2 transition-all active:opacity-80"
                    >
                      <Mic className="w-4 h-4" aria-hidden="true" />
                      <span>กดเพื่อพูด</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="min-h-12 px-6 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/40 animate-pulse inline-flex items-center justify-center gap-2 transition-all active:opacity-80"
                    >
                      <MicOff className="w-4 h-4" aria-hidden="true" />
                      <span>หยุดและตรวจคะแนน</span>
                    </button>
                  )}
                </div>
                )}

                {/* Speech Recognition Warning */}
                {speechWarning && (
                  <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-sm font-bold flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                    <span>{speechWarning}</span>
                  </div>
                )}

                {/* Live Real-Time Microphone Waveform */}
                {isRecording && isNativeSpeech() && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-rose-600 flex items-center justify-center animate-pulse shadow-lg shadow-rose-600/40">
                      <Mic className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-bold text-rose-300">กำลังฟัง… พูดตามประโยคด้านบน</p>
                    <p className="text-base text-slate-100 text-center min-h-[1.5rem] break-words w-full">
                      {userTranscript}
                    </p>
                  </div>
                )}

                {isRecording && !isNativeSpeech() && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        กำลังบันทึกเสียง...
                      </span>
                      <span className="font-mono text-amber-300">ระดับเสียง: {liveVolume}%</span>
                    </div>
                    {/* Dynamic EQ bars responding directly to user's voice */}
                    <div className="h-14 flex items-center justify-center gap-1.5 px-2">
                      {Array.from({ length: 18 }).map((_, i) => {
                        // Calculate height based on liveVolume with rhythmic spread
                        const factor = Math.sin((i / 18) * Math.PI);
                        const barHeight = Math.max(15, Math.min(100, liveVolume * factor * 1.5));
                        return (
                          <div
                            key={i}
                            className="w-2 bg-gradient-to-t from-rose-600 via-amber-500 to-emerald-400 rounded-full transition-all duration-75"
                            style={{ height: `${barHeight}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pronunciation Grader Output */}
                {pronunciationScore !== null && (
                  <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        คะแนนความแม่นยำ:
                      </span>
                      <span
                        className={`text-3xl font-extrabold font-mono ${
                          pronunciationScore >= 80
                            ? 'text-emerald-400'
                            : pronunciationScore >= 60
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {pronunciationScore}%
                      </span>
                    </div>

                    {/* Character / Mora Diffing Feedback */}
                    <div className="space-y-2">
                      <span className="text-xs text-slate-300 font-medium block">แยกทีละเสียง (โมระ):</span>
                      <div className="flex flex-wrap gap-1.5 font-jp text-xl">
                        {moraFeedback.map((m, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-xl font-bold transition-transform hover:scale-110 ${
                              m.correct
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {m.char}
                          </span>
                        ))}
                      </div>
                    </div>

                    {userTranscript && (
                      <p className="text-xs text-slate-300">
                        เสียงที่ตรวจพบ:{' '}
                        <span className="text-slate-200 font-jp font-semibold">"{userTranscript}"</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Mode C: AI conversation practice */}
      {activeMode === 'roleplay' && <AiChat />}
    </div>
  );
};
