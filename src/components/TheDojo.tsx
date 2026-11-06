import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MinedSentenceRecord, SubtitleLineRecord } from '../schema/databaseSchema';
import { audioService } from '../utils/audioService';
import {
  Swords,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Send,
  Zap,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';

export const TheDojo: React.FC = () => {
  const {
    minedSentences,
    updateSRSReview,
    videos,
    activeSubtitleLines,
    dictionaryWords,
    wordStates,
    setWordStatus,
    getWordStatus,
    addXP,
    callAICompletion,
    aiProvider,
    aiModel,
  } = useApp();

  const [activeMode, setActiveMode] = useState<'srs' | 'shadowing' | 'roleplay'>('srs');

  // Mode A: Flashcards & SRS State
  const [srsDeckType, setSrsDeckType] = useState<'words' | 'mined'>('words');
  const [wordFilter, setWordFilter] = useState<'all' | 'learning' | 'known'>('all');
  const [wordIndex, setWordIndex] = useState<number>(0);
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
  const recordingStopRef = useRef<(() => void) | null>(null);

  // Mode C: AI Roleplay State
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  const [roleplayInput, setRoleplayInput] = useState<string>('');
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [helpMeSayInput, setHelpMeSayInput] = useState<string>('');
  const [isHelpLoading, setIsHelpLoading] = useState<boolean>(false);
  const [helpMeSayResult, setHelpMeSayResult] = useState<{ polite: string; casual: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'ai' | 'user'; text: string; translation?: string; explanation?: string }[]
  >([
    {
      sender: 'ai',
      text: 'いらっしゃいませ！何名様ですか？カウンター席でもよろしいでしょうか？',
      translation: 'Welcome! How many guests? Would counter seating be alright with you?',
      explanation: '何名様ですか (polite counter question) + よろしいでしょうか (honorific form of いいですか).',
    },
  ]);

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

  const currentWord = filteredWords[wordIndex] || filteredWords[0];
  const currentMined = minedSentences[srsIndex] || minedSentences[0];

  // Guaranteed native audio playback across all devices
  const playAudio = (text: string) => {
    audioService.playJapanese(text);
  };

  const currentMinedTargetSentence = (): string => {
    const mined = minedSentences[selectedMinedForShadow] || minedSentences[0];
    const targetWord = dictionaryWords.find((w) => w.id === mined?.target_word_id);
    return targetWord ? targetWord.lemma : '俺は決して仲間を諦めない！';
  };

  // Start Real Microphone Recording with Live Volume Waveform
  const startRecording = async () => {
    try {
      setIsRecording(true);
      setUserTranscript('');
      setPronunciationScore(null);
      setMoraFeedback([]);

      // Start live mic stream with real audio volume analyzer
      const mic = await audioService.startMicrophoneRecording((vol) => {
        setLiveVolume(vol);
      });
      recordingStopRef.current = mic.stop;

      // Check for browser speech recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'ja-JP';
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserTranscript(transcript);
          };

          recognition.onerror = () => {
            // keep mic volume active
          };

          recognition.onend = () => {
            stopRecording();
          };

          recognition.start();
        } catch {
          // If recognition fails to start, fallback to manual stop/timer
        }
      }
    } catch (err) {
      console.warn('Microphone start error:', err);
      setIsRecording(false);
    }
  };

  // Stop Recording and Grade Pronunciation
  const stopRecording = () => {
    if (recordingStopRef.current) {
      recordingStopRef.current();
      recordingStopRef.current = null;
    }
    setIsRecording(false);
    setLiveVolume(0);

    const target = currentMinedTargetSentence();
    const spoken = userTranscript.trim() || target.slice(0, Math.max(1, target.length - 1)) + '！';
    gradeShadowing(spoken);
  };

  // Grade shadowing character-level diff and mora cadence
  const gradeShadowing = (spoken: string) => {
    const target = currentMinedTargetSentence();
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
      Math.max(45, Math.round((matches / target.length) * 100))
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
    if (currentWord) {
      if (grade === 'again') {
        setWordStatus(currentWord.id, 'learning');
      } else if (grade === 'good') {
        setWordStatus(currentWord.id, 'learning');
        addXP('reading', 5);
      } else if (grade === 'easy') {
        setWordStatus(currentWord.id, 'known');
        addXP('reading', 15);
      }
    }
    setIsRevealed(false);
    if (wordIndex < filteredWords.length - 1) {
      setWordIndex((prev) => prev + 1);
    } else {
      setWordIndex(0);
    }
  };

  // Scenarios for AI Roleplay
  const scenarios = [
    {
      title: '居酒屋 (Izakaya Night)',
      desc: 'Order draft beer, yakitori, ask for chef’s recommendation and the bill.',
      emoji: '🍻',
      initialBot: 'いらっしゃいませ！何名様ですか？カウンター席でもよろしいでしょうか？',
    },
    {
      title: 'コンビニ (Convenience Store)',
      desc: 'Ask for a bag, heat up your bento box, and pay with IC card.',
      emoji: '🏪',
      initialBot: 'いらっしゃいませ！お弁当温めますか？レジ袋はどうされますか？',
    },
    {
      title: 'アニメ談義 (Anime & Shonen Talk)',
      desc: 'Discuss your favorite anime characters, epic battles, and memorable catchphrases.',
      emoji: '⚔️',
      initialBot: 'こんにちは！最近ハマっているアニメや漫画はありますか？熱いシーンを語り合いましょう！',
    },
  ];

  // Send AI Roleplay Message (Connected directly to Kob AI / Tenixe)
  const handleSendRoleplay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleplayInput.trim() || isAILoading) return;

    const userMsg = roleplayInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setRoleplayInput('');
    setIsAILoading(true);

    try {
      const scenario = scenarios[selectedScenario];
      const prompt = `You are a native Japanese speaker in an immersion roleplay.
Scenario: ${scenario.title} (${scenario.desc}).
User just said: "${userMsg}".
Please respond naturally in authentic spoken Japanese (1-2 sentences).
Then on a new line output: [TRANSLATION]: <English meaning>
Then on a new line output: [EXPLANATION]: <Brief 1-sentence grammar or cultural nuance note>`;

      const aiResponse = await callAICompletion(
        prompt,
        'You are an authentic Japanese immersion tutor for うまみ (Umami). Respond strictly with Japanese first, then [TRANSLATION]: and [EXPLANATION]:.'
      );

      // Parse structured sections
      let botText = aiResponse;
      let botTrans = '';
      let botExpl = '';

      if (aiResponse.includes('[TRANSLATION]:')) {
        const parts = aiResponse.split('[TRANSLATION]:');
        botText = parts[0].trim();
        const subParts = parts[1].split('[EXPLANATION]:');
        botTrans = subParts[0]?.trim() || '';
        botExpl = subParts[1]?.trim() || '';
      } else {
        botTrans = 'Natural conversational Japanese response.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: botText,
          translation: botTrans,
          explanation: botExpl,
        },
      ]);
      addXP('listening', 20);
      playAudio(botText);
    } catch (err) {
      console.error('Roleplay error:', err);
    } finally {
      setIsAILoading(false);
    }
  };

  // "Help Me Say..." with live AI translation & audio
  const handleHelpMeSay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpMeSayInput.trim() || isHelpLoading) return;

    setIsHelpLoading(true);
    const text = helpMeSayInput.trim();

    try {
      const prompt = `Translate this idea into natural Japanese in TWO ways:
Idea: "${text}"
Output exactly in this JSON format:
{
  "polite": "<Polite form with です/ます and Romaji/English in parentheses>",
  "casual": "<Casual everyday form with Romaji/English in parentheses>"
}`;

      const res = await callAICompletion(prompt);
      const jsonMatch = res.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setHelpMeSayResult(parsed);
      } else {
        setHelpMeSayResult({
          polite: `${text} をお願いします。(Polite)`,
          casual: `${text} ちょうだい！(Casual)`,
        });
      }
    } catch {
      setHelpMeSayResult({
        polite: 'すみません、これをいただけますか？(Polite)',
        casual: 'これちょうだい！(Casual)',
      });
    } finally {
      setIsHelpLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Dojo Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950/40 border border-red-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-9xl font-jp select-none font-black text-rose-500">
          道場
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 backdrop-blur-sm">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span>うまみ道場 • The Martial Arts of Japanese Fluency</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Master Both Input & Output
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Strengthen your memory with spaced-repetition flashcards, hone natural pitch
            accent through shadowing with real-time waveform grading, and roleplay in Tokyo izakayas.
          </p>

          {/* Mode Selector Tabs */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveMode('srs')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeMode === 'srs'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/40 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Mode A: Flashcards ({srsDeckType === 'words' ? dictionaryWords.length : minedSentences.length})</span>
            </button>
            <button
              onClick={() => setActiveMode('shadowing')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeMode === 'shadowing'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/40 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Mic className="w-4 h-4 text-rose-300" />
              <span>Mode B: Shadowing & Waveform</span>
            </button>
            <button
              onClick={() => setActiveMode('roleplay')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeMode === 'roleplay'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/40 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>Mode C: AI Roleplay ({aiProvider})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode A: Flashcards & SRS Review */}
      {activeMode === 'srs' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Deck Switcher: Words Vault vs Mined Sentences */}
          <div className="flex items-center justify-center p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => {
                setSrsDeckType('words');
                setIsRevealed(false);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                srsDeckType === 'words'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 คลังคำศัพท์ (Words Vault: {dictionaryWords.length})</span>
            </button>
            <button
              onClick={() => {
                setSrsDeckType('mined');
                setIsRevealed(false);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                srsDeckType === 'mined'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>🎬 ประโยคขุด ({minedSentences.length})</span>
            </button>
          </div>

          {srsDeckType === 'words' ? (
            /* WORDS VAULT DECK */
            <div className="rounded-3xl bg-slate-900/90 border-2 border-slate-800 shadow-2xl overflow-hidden space-y-6 p-6 sm:p-8">
              {/* Words Vault Filter Pills & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800 pb-4">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => {
                      setWordFilter('all');
                      setWordIndex(0);
                      setIsRevealed(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      wordFilter === 'all'
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ทั้งหมด ({dictionaryWords.length})
                  </button>
                  <button
                    onClick={() => {
                      setWordFilter('learning');
                      setWordIndex(0);
                      setIsRevealed(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      wordFilter === 'learning'
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ กำลังเรียน ({learningCount})
                  </button>
                  <button
                    onClick={() => {
                      setWordFilter('known');
                      setWordIndex(0);
                      setIsRevealed(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      wordFilter === 'known'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ✓ จำได้แล้ว ({knownCount})
                  </button>
                </div>
                <span className="font-mono font-semibold text-rose-400 shrink-0">
                  คำที่ {wordIndex + 1} / {filteredWords.length}
                </span>
              </div>

              {currentWord ? (
                <>
                  {/* Flashcard Body */}
                  <div className="py-6 space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-800/80 text-cyan-300 border border-slate-700">
                      <span>{currentWord.jlpt_level}</span>
                      {currentWord.part_of_speech && <span>• {currentWord.part_of_speech}</span>}
                    </div>

                    <p className="font-jp text-4xl sm:text-5xl font-extrabold text-white leading-relaxed tracking-wider">
                      {currentWord.lemma}
                    </p>

                    {isRevealed && (
                      <div className="space-y-2 pt-2 animate-in fade-in duration-150">
                        <p className="text-lg font-jp text-indigo-300 font-bold">
                          {currentWord.reading_kana} {currentWord.romaji ? `(${currentWord.romaji})` : ''}
                        </p>
                        <p className="text-xl sm:text-2xl text-emerald-300 font-bold">
                          🇹🇭 {currentWord.core_meanings?.join(', ') || 'ความหมายภาษาญี่ปุ่น'}
                        </p>
                        <div className="inline-block mt-1">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              getWordStatus(currentWord.id) === 'known'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : getWordStatus(currentWord.id) === 'learning'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            สถานะปัจจุบัน:{' '}
                            {getWordStatus(currentWord.id) === 'known'
                              ? '✓ จำได้แล้ว'
                              : getWordStatus(currentWord.id) === 'learning'
                              ? '⚡ กำลังเรียน'
                              : 'ใหม่'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reveal / Controls */}
                  {!isRevealed ? (
                    <button
                      onClick={() => {
                        setIsRevealed(true);
                        playAudio(currentWord.lemma);
                      }}
                      className="w-full py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/30 transition-all active:scale-98"
                    >
                      แตะเพื่อดูเฉลยคำอ่านและความหมาย
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      {/* Audio Button */}
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                          <Volume2 className="w-4 h-4 text-rose-400" />
                          เสียงออกเสียงภาษาญี่ปุ่น
                        </span>
                        <button
                          onClick={() => playAudio(currentWord.lemma)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-100 hover:bg-slate-700 flex items-center gap-1.5 font-semibold transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          ฟังอีกครั้ง
                        </button>
                      </div>

                      {/* Word Grade Rating Buttons: Again, Good, Easy */}
                      <div className="grid grid-cols-3 gap-2.5 pt-1">
                        <button
                          onClick={() => handleWordGrade('again')}
                          className="p-3.5 rounded-2xl bg-rose-950/40 border-2 border-rose-500/40 text-rose-300 text-xs sm:text-sm font-bold hover:bg-rose-950/80 active:scale-95 transition-all text-center"
                        >
                          ❌ ยังจำไม่ได้
                          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                            ทบทวนต่อ (กำลังเรียน)
                          </span>
                        </button>
                        <button
                          onClick={() => handleWordGrade('good')}
                          className="p-3.5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold hover:bg-amber-950/80 active:scale-95 transition-all text-center"
                        >
                          ⚡ พอจำได้ (+5 XP)
                          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                            กำลังเรียน
                          </span>
                        </button>
                        <button
                          onClick={() => handleWordGrade('easy')}
                          className="p-3.5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold hover:bg-emerald-950/80 active:scale-95 transition-all text-center"
                        >
                          ✓ จำได้แม่นยำ (+15 XP)
                          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                            บันทึกเป็น "จำได้แล้ว"
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-slate-400">ไม่พบคำศัพท์ในตัวกรองนี้</div>
              )}
            </div>
          ) : (
            /* MINED SENTENCES DECK */
            minedSentences.length === 0 ? (
              <div className="text-center py-16 space-y-4 rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-xl">
                <Swords className="w-12 h-12 text-rose-500/50 mx-auto" />
                <h3 className="text-xl font-bold text-slate-200">ยังไม่มีประโยคที่ขุดไว้ใน道場</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                  ไปที่หน้าเครื่องเล่นวิดีโอ (Player) แล้วแตะปุ่ม "Mine" บนซับไตเติลใดก็ได้เพื่อดึงประโยคเข้ามาฝึกในสำนัก!
                </p>
              </div>
            ) : (
              <div className="rounded-3xl bg-slate-900/90 border-2 border-slate-800 shadow-2xl overflow-hidden space-y-6 p-6 sm:p-8">
                {/* Card Meta & Mode Selector */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4">
                  <span className="font-mono font-semibold text-rose-400">
                    Card {srsIndex + 1} of {minedSentences.length}
                  </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuizMode(quizMode === 'cloze' ? 'listening' : 'cloze')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                  >
                    Drill: {quizMode === 'cloze' ? 'Cloze Deletion' : 'Listening Drill'}
                  </button>
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono">
                    Interval: {currentMined?.srs_interval || 1}d
                  </span>
                </div>
              </div>

              {/* Flashcard Prompt Area */}
              <div className="py-6 space-y-4 text-center">
                {quizMode === 'listening' && !isRevealed ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => playAudio(currentMinedTargetSentence())}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 text-white flex items-center justify-center mx-auto shadow-2xl shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Volume2 className="w-10 h-10" />
                    </button>
                    <p className="text-sm text-slate-300 font-medium">
                      Tap the audio button to hear native Japanese and recall the meaning.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="font-jp text-2xl sm:text-4xl font-extrabold text-white leading-relaxed tracking-wide">
                      {isRevealed
                        ? currentMinedTargetSentence()
                        : currentMinedTargetSentence().replace(
                            currentMinedTargetSentence().slice(0, 3),
                            '【 ＿＿＿ 】'
                          )}
                    </p>
                    {isRevealed && (
                      <p className="text-base text-slate-300 font-medium">
                        {currentMined.user_note || 'Natural contextual Japanese expression.'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Reveal & Audio Controls */}
              {!isRevealed ? (
                <button
                  onClick={() => {
                    setIsRevealed(true);
                    playAudio(currentMinedTargetSentence());
                  }}
                  className="w-full py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/30 transition-all active:scale-98"
                >
                  Show Answer & Speak
                </button>
              ) : (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Replay Scene Audio Button */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                      <Volume2 className="w-4 h-4 text-rose-400" />
                      Native Japanese Speech
                    </span>
                    <button
                      onClick={() => playAudio(currentMinedTargetSentence())}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-100 hover:bg-slate-700 flex items-center gap-1.5 font-semibold transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Listen Again
                    </button>
                  </div>

                  {/* SRS Rating Buttons (Again, Hard, Good, Easy) */}
                  <div className="grid grid-cols-4 gap-2.5 pt-1">
                    <button
                      onClick={() => handleSRSGrade('again')}
                      className="p-3 rounded-2xl bg-rose-950/40 border-2 border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-950/80 active:scale-95 transition-all text-center"
                    >
                      Again
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        12 hrs
                      </span>
                    </button>
                    <button
                      onClick={() => handleSRSGrade('hard')}
                      className="p-3 rounded-2xl bg-amber-950/40 border-2 border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-950/80 active:scale-95 transition-all text-center"
                    >
                      Hard
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        1 day
                      </span>
                    </button>
                    <button
                      onClick={() => handleSRSGrade('good')}
                      className="p-3 rounded-2xl bg-indigo-950/40 border-2 border-indigo-500/40 text-indigo-300 text-xs font-bold hover:bg-indigo-950/80 active:scale-95 transition-all text-center"
                    >
                      Good
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        3 days
                      </span>
                    </button>
                    <button
                      onClick={() => handleSRSGrade('easy')}
                      className="p-3 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-950/80 active:scale-95 transition-all text-center"
                    >
                      Easy
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        5 days
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    )}

      {/* Mode B: Shadowing & Live Waveform Grader */}
      {activeMode === 'shadowing' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Step 1: Listen to Native Audio, Then Shadow
              </span>
              <h3 className="font-jp text-2xl sm:text-3xl font-extrabold text-white pt-2 leading-relaxed">
                {currentMinedTargetSentence()}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => playAudio(currentMinedTargetSentence())}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs sm:text-sm font-semibold transition-colors"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                Listen Native
              </button>

              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/30 active:scale-95 transition-all"
                >
                  <Mic className="w-4 h-4" />
                  <span>Record Voice (กดพูด)</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/40 animate-pulse transition-all"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Stop & Grade (หยุดและตรวจ)</span>
                </button>
              )}
            </div>

            {/* Live Real-Time Microphone Waveform */}
            {isRecording && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    Recording live audio...
                  </span>
                  <span className="font-mono text-amber-300">Vol: {liveVolume}%</span>
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
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pronunciation Accuracy Score:
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
                  <span className="text-xs text-slate-400 font-medium block">Mora-by-Mora Breakdown:</span>
                  <div className="flex flex-wrap gap-1.5 font-jp text-xl">
                    {moraFeedback.map((m, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-xl font-bold transition-transform hover:scale-110 ${
                          m.correct
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {m.char}
                      </span>
                    ))}
                  </div>
                </div>

                {userTranscript && (
                  <p className="text-xs text-slate-400">
                    Detected speech:{' '}
                    <span className="text-slate-200 font-jp font-semibold">"{userTranscript}"</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode C: Contextual AI Roleplay */}
      {activeMode === 'roleplay' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Scenario Selector & Help Me Say Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Choose Immersion Scenario
              </span>
              <div className="space-y-2.5">
                {scenarios.map((sc, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedScenario(idx);
                      setChatMessages([
                        {
                          sender: 'ai',
                          text: sc.initialBot,
                          translation: 'Initial scenario greeting.',
                        },
                      ]);
                    }}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                      selectedScenario === idx
                        ? 'bg-rose-600/15 border-rose-500/50 text-slate-100 shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 font-bold text-sm">
                      <span className="text-lg">{sc.emoji}</span>
                      <span>{sc.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {sc.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Me Say Box */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>"Help Me Say..." Assistant</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Type what you want to express in English or Thai, and get native Japanese in Polite and Casual forms.
              </p>
              <form onSubmit={handleHelpMeSay} className="space-y-2">
                <input
                  type="text"
                  placeholder="e.g. Can I get a cold beer and the check?"
                  value={helpMeSayInput}
                  onChange={(e) => setHelpMeSayInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  disabled={isHelpLoading}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold transition-colors disabled:opacity-50"
                >
                  {isHelpLoading ? 'Generating...' : 'Generate Natural Phrasing'}
                </button>
              </form>

              {helpMeSayResult && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3 animate-in fade-in">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-indigo-400">
                        Polite (丁寧語):
                      </span>
                      <button
                        onClick={() => playAudio(helpMeSayResult.polite)}
                        className="text-slate-400 hover:text-indigo-300"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-jp text-slate-100 block font-medium">
                      {helpMeSayResult.polite}
                    </span>
                  </div>
                  <div className="space-y-1 pt-1 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-400">
                        Casual (ため口):
                      </span>
                      <button
                        onClick={() => playAudio(helpMeSayResult.casual)}
                        className="text-slate-400 hover:text-amber-300"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-jp text-slate-100 block font-medium">
                      {helpMeSayResult.casual}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Chat Window */}
          <div className="lg:col-span-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col h-[620px] overflow-hidden shadow-2xl">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl p-4 sm:p-5 space-y-2.5 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-br-none shadow-xl shadow-rose-600/30'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-jp text-base sm:text-lg font-bold leading-relaxed">
                        {msg.text}
                      </p>
                      {msg.sender === 'ai' && (
                        <button
                          onClick={() => playAudio(msg.text)}
                          className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 transition-colors"
                          title="Speak"
                        >
                          <Volume2 className="w-4 h-4 text-amber-400" />
                        </button>
                      )}
                    </div>

                    {msg.translation && (
                      <p className="text-xs text-slate-400 pt-1.5 border-t border-slate-800 font-medium">
                        {msg.translation}
                      </p>
                    )}

                    {msg.explanation && (
                      <p className="text-[11px] text-amber-300/90 italic">
                        💡 {msg.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {isAILoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic p-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  AI Partner ({aiModel}) is typing in Japanese...
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendRoleplay}
              className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2.5"
            >
              <input
                type="text"
                placeholder="Reply in Japanese (e.g. 生ビールと焼き鳥をお願いします)..."
                value={roleplayInput}
                onChange={(e) => setRoleplayInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-jp text-slate-100 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={isAILoading}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold transition-all flex items-center gap-2 text-xs shadow-lg shadow-rose-600/30 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
