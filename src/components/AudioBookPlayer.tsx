import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from '../types';
import { getQuestionSpokenSegments, getEnglishVoices, SpokenSegment } from '../utils/audioBookHelper';
import { 
  Play, Pause, Square, SkipForward, SkipBack, Volume2, 
  VolumeX, Settings, ChevronUp, ChevronDown, Headphones, 
  Sparkles, CheckCircle, HelpCircle, Layers, Check, X, RotateCcw,
  ListOrdered, CheckCircle2, ListFilter, Minimize2, Maximize2
} from 'lucide-react';

export interface AudioBookPlayerProps {
  questions: Question[];
  currentQuestionId: number;
  onSelectQuestionId: (id: number) => void;
  activeSetTab: number | 'all';
  onSelectSetTab: (setNum: number | 'all') => void;
  onClose?: () => void;
  isOpen?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

const CHUNK_SIZE = 50;
const STORAGE_KEY_VOICE_NAME = 'aif_c01_audiobook_voice_v1';
const STORAGE_KEY_SPEED = 'aif_c01_audiobook_speed_v1';
const STORAGE_KEY_READ_ALL_OPTIONS = 'aif_c01_audiobook_read_all_options_v1';
const STORAGE_KEY_COLLAPSED = 'aif_c01_audiobook_collapsed_v1';

export const AudioBookPlayer: React.FC<AudioBookPlayerProps> = ({
  questions,
  currentQuestionId,
  onSelectQuestionId,
  activeSetTab,
  onSelectSetTab,
  onClose,
  isOpen = true,
  isCollapsed: controlledIsCollapsed,
  onToggleCollapse,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentPlaybackQIndex, setCurrentPlaybackQIndex] = useState<number>(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [currentSegments, setCurrentSegments] = useState<SpokenSegment[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [autoSyncView, setAutoSyncView] = useState<boolean>(true);

  // Collapsible bottom bar state
  const [internalIsCollapsed, setInternalIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COLLAPSED);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;

  const handleToggleCollapse = (val: boolean) => {
    setInternalIsCollapsed(val);
    if (onToggleCollapse) {
      onToggleCollapse(val);
    }
    try {
      localStorage.setItem(STORAGE_KEY_COLLAPSED, String(val));
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle mode: Read all options (A, B, C, D) first before correct answer, or correct option alone
  const [readAllOptions, setReadAllOptions] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_READ_ALL_OPTIONS);
      return saved !== null ? saved === 'true' : true; // Default to true
    } catch {
      return true;
    }
  });

  // Speed and Voice
  const [playbackRate, setPlaybackRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SPEED);
      return saved ? parseFloat(saved) : 1.0;
    } catch {
      return 1.0;
    }
  });

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_VOICE_NAME) || '';
    } catch {
      return '';
    }
  });

  // Helper to smoothly focus and scroll to the active question card on screen
  const focusQuestionCard = useCallback((qId: number) => {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      try {
        const cardEl = document.getElementById('current-question-card') || 
                       document.getElementById(`question-card-${qId}`) || 
                       document.getElementById('main-question-container');
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }
      } catch (e) {
        console.error('Focus error', e);
      }
    }, 40);
  }, []);

  // Track internal advance vs manual question selection from dropdown/UI
  const isInternalAdvanceRef = useRef<boolean>(false);
  const prevQIdRef = useRef<number>(currentQuestionId);

  // Track active utterance, chunk safety timer, and session generation to prevent stale callbacks and ensure clean replays on mobile
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chunkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionEpochRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;

  const isPausedRef = useRef<boolean>(false);
  isPausedRef.current = isPaused;

  const currentQIndexRef = useRef<number>(0);
  currentQIndexRef.current = currentPlaybackQIndex;

  const currentSegIndexRef = useRef<number>(0);
  currentSegIndexRef.current = currentSegmentIndex;

  const currentSegmentsRef = useRef<SpokenSegment[]>([]);
  currentSegmentsRef.current = currentSegments;

  const readAllOptionsRef = useRef<boolean>(readAllOptions);
  readAllOptionsRef.current = readAllOptions;

  const rateRef = useRef<number>(playbackRate);
  rateRef.current = playbackRate;

  const voiceNameRef = useRef<string>(selectedVoiceName);
  voiceNameRef.current = selectedVoiceName;

  // Filter questions for the current active set
  const setQuestions = React.useMemo(() => {
    if (activeSetTab === 'all') return questions;
    const startQ = (activeSetTab - 1) * CHUNK_SIZE + 1;
    const endQ = activeSetTab * CHUNK_SIZE;
    return questions.filter((q) => q.id >= startQ && q.id <= endQ);
  }, [questions, activeSetTab]);

  // Load browser voices & select best natural voice by default
  useEffect(() => {
    const updateVoices = () => {
      const voices = getEnglishVoices();
      setAvailableVoices(voices);

      if (voices.length > 0) {
        const storedName = voiceNameRef.current;
        const exists = voices.some((v) => v.name === storedName);
        if (!storedName || !exists) {
          // Select top-ranked natural/neural voice automatically
          const bestVoice = voices[0];
          setSelectedVoiceName(bestVoice.name);
          voiceNameRef.current = bestVoice.name;
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SPEED, String(playbackRate));
    } catch (e) {
      console.error(e);
    }
  }, [playbackRate]);

  useEffect(() => {
    try {
      if (selectedVoiceName) {
        localStorage.setItem(STORAGE_KEY_VOICE_NAME, selectedVoiceName);
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedVoiceName]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_READ_ALL_OPTIONS, String(readAllOptions));
    } catch (e) {
      console.error(e);
    }
  }, [readAllOptions]);

  // Stop Speech
  const stopAudio = useCallback(() => {
    sessionEpochRef.current += 1;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (chunkTimeoutRef.current) {
      clearTimeout(chunkTimeoutRef.current);
      chunkTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
    if (typeof window !== 'undefined') {
      (window as any).__activeSpeechUtterance = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    isPlayingRef.current = false;
    isPausedRef.current = false;
  }, []);

  // Play next segment or advance to next question with generation epoch guard & mobile safety timeouts
  const speakCurrentSegment = useCallback((epoch: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (epoch !== sessionEpochRef.current) return;
    if (!isPlayingRef.current || isPausedRef.current) return;

    if (chunkTimeoutRef.current) {
      clearTimeout(chunkTimeoutRef.current);
      chunkTimeoutRef.current = null;
    }

    const segments = currentSegmentsRef.current;
    const segIdx = currentSegIndexRef.current;
    const qIdx = currentQIndexRef.current;

    if (!segments || segIdx >= segments.length) {
      // Finished all segments for this question -> advance to next question in set!
      const nextQIdx = qIdx + 1;
      if (nextQIdx < setQuestions.length) {
        const nextQ = setQuestions[nextQIdx];
        const nextSegments = getQuestionSpokenSegments(nextQ, readAllOptionsRef.current);
        setCurrentPlaybackQIndex(nextQIdx);
        setCurrentSegmentIndex(0);
        setCurrentSegments(nextSegments);
        currentSegmentsRef.current = nextSegments;
        currentSegIndexRef.current = 0;
        currentQIndexRef.current = nextQIdx;

        // Auto-sync and scroll focus back to top of the next question
        if (autoSyncView) {
          isInternalAdvanceRef.current = true;
          prevQIdRef.current = nextQ.id;
          onSelectQuestionId(nextQ.id);
          focusQuestionCard(nextQ.id);
        }

        // Slight natural pause between questions
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if (epoch === sessionEpochRef.current && isPlayingRef.current && !isPausedRef.current) {
            speakCurrentSegment(epoch);
          }
        }, 650);
      } else {
        // Completed the whole Set!
        stopAudio();
      }
      return;
    }

    const currentSeg = segments[segIdx];
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentSeg.text);
    
    // Support speeds between 0.5x and 2.5x accurately across all browsers
    const effectiveRate = Math.max(0.5, Math.min(2.5, rateRef.current || 1.0));
    utterance.rate = effectiveRate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Attach voice if selected or fallback to high-scoring English voice
    if (voiceNameRef.current) {
      const voice = availableVoices.find((v) => v.name === voiceNameRef.current);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'en-GB';
      } else {
        utterance.lang = 'en-GB';
      }
    } else {
      utterance.lang = 'en-GB';
    }

    const handleAdvanceNextChunk = () => {
      if (chunkTimeoutRef.current) {
        clearTimeout(chunkTimeoutRef.current);
        chunkTimeoutRef.current = null;
      }
      if (epoch !== sessionEpochRef.current || !isPlayingRef.current || isPausedRef.current) return;

      // Advance to next segment
      const nextSeg = segIdx + 1;
      setCurrentSegmentIndex(nextSeg);
      currentSegIndexRef.current = nextSeg;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (epoch === sessionEpochRef.current && isPlayingRef.current && !isPausedRef.current) {
          speakCurrentSegment(epoch);
        }
      }, 180);
    };

    utterance.onend = () => {
      handleAdvanceNextChunk();
    };

    utterance.onerror = (e) => {
      if (epoch !== sessionEpochRef.current) return;
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('SpeechSynthesis error:', e);
        handleAdvanceNextChunk();
      }
    };

    // Keep global reference to prevent Garbage Collection on Mobile Safari / Android Chrome
    activeUtteranceRef.current = utterance;
    (window as any).__activeSpeechUtterance = utterance;

    window.speechSynthesis.speak(utterance);

    // Watchdog timer: estimated duration with speed scaling + safety buffer
    const words = currentSeg.text.split(/\s+/).filter(Boolean).length;
    const estimatedSec = Math.max(1.2, (words / (2.8 * effectiveRate)) + 1.2);
    const expectedDurationMs = estimatedSec * 1000;

    chunkTimeoutRef.current = setTimeout(() => {
      if (epoch === sessionEpochRef.current && isPlayingRef.current && !isPausedRef.current) {
        console.warn('Chunk safety timer triggered for segment:', currentSeg.text);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        handleAdvanceNextChunk();
      }
    }, Math.max(expectedDurationMs, 2500));
  }, [setQuestions, autoSyncView, onSelectQuestionId, stopAudio, availableVoices, focusQuestionCard]);

  // Handle Dynamic Speed Change with Immediate Audible Effect
  const handleSpeedChange = useCallback((newRate: number) => {
    setPlaybackRate(newRate);
    rateRef.current = newRate;
    try {
      localStorage.setItem(STORAGE_KEY_SPEED, String(newRate));
    } catch (e) {
      console.error(e);
    }

    // If currently playing, restart current segment at new speed immediately
    if (isPlayingRef.current && !isPausedRef.current) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (chunkTimeoutRef.current) {
        clearTimeout(chunkTimeoutRef.current);
        chunkTimeoutRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      const newEpoch = ++sessionEpochRef.current;
      timerRef.current = setTimeout(() => {
        speakCurrentSegment(newEpoch);
      }, 50);
    }
  }, [speakCurrentSegment]);

  // Start / Play Audiobook for target question
  const startAudiobook = useCallback((startFromQId?: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    window.speechSynthesis.cancel();

    const newEpoch = ++sessionEpochRef.current;

    // Determine starting question index in current set
    const targetQId = startFromQId !== undefined ? startFromQId : currentQuestionId;
    let foundIndex = setQuestions.findIndex((q) => q.id === targetQId);
    if (foundIndex < 0) foundIndex = 0;

    const startQ = setQuestions[foundIndex] || setQuestions[0];
    if (!startQ) return;

    const segments = getQuestionSpokenSegments(startQ, readAllOptionsRef.current);
    setCurrentPlaybackQIndex(foundIndex);
    setCurrentSegmentIndex(0);
    setCurrentSegments(segments);

    currentQIndexRef.current = foundIndex;
    currentSegIndexRef.current = 0;
    currentSegmentsRef.current = segments;

    setIsPlaying(true);
    setIsPaused(false);
    isPlayingRef.current = true;
    isPausedRef.current = false;

    if (autoSyncView) {
      onSelectQuestionId(startQ.id);
      focusQuestionCard(startQ.id);
    }

    // Begin speaking cleanly with generation epoch
    timerRef.current = setTimeout(() => {
      speakCurrentSegment(newEpoch);
    }, 60);
  }, [currentQuestionId, setQuestions, autoSyncView, onSelectQuestionId, speakCurrentSegment, focusQuestionCard]);

  // Replay Current Question from start
  const replayCurrentQuestion = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    window.speechSynthesis.cancel();

    const newEpoch = ++sessionEpochRef.current;

    const q = setQuestions[currentQIndexRef.current] || setQuestions[0];
    if (!q) return;

    const segments = getQuestionSpokenSegments(q, readAllOptionsRef.current);
    setCurrentSegmentIndex(0);
    setCurrentSegments(segments);

    currentSegIndexRef.current = 0;
    currentSegmentsRef.current = segments;

    setIsPlaying(true);
    setIsPaused(false);
    isPlayingRef.current = true;
    isPausedRef.current = false;

    if (autoSyncView) {
      onSelectQuestionId(q.id);
      focusQuestionCard(q.id);
    }

    timerRef.current = setTimeout(() => {
      speakCurrentSegment(newEpoch);
    }, 60);
  }, [setQuestions, autoSyncView, onSelectQuestionId, speakCurrentSegment, focusQuestionCard]);

  // Handle Mode Change (All Options vs Correct Only)
  const handleToggleReadAllOptions = (value: boolean) => {
    setReadAllOptions(value);
    readAllOptionsRef.current = value;

    const q = setQuestions[currentQIndexRef.current] || setQuestions[0];
    if (q) {
      const segs = getQuestionSpokenSegments(q, value);
      setCurrentSegments(segs);
      currentSegmentsRef.current = segs;

      // If playing actively, restart the current question with new mode seamlessly
      if (isPlayingRef.current && !isPausedRef.current) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        const newEpoch = ++sessionEpochRef.current;
        setCurrentSegmentIndex(0);
        currentSegIndexRef.current = 0;
        timerRef.current = setTimeout(() => {
          speakCurrentSegment(newEpoch);
        }, 60);
      }
    }
  };

  // Pause / Resume toggle
  const togglePlayPause = () => {
    if (!isPlaying) {
      startAudiobook(currentQuestionId);
    } else if (isPaused) {
      setIsPaused(false);
      isPausedRef.current = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
    } else {
      setIsPaused(true);
      isPausedRef.current = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    }
  };

  // Skip to next question
  const skipToNextQuestion = () => {
    const nextIdx = currentPlaybackQIndex + 1;
    if (nextIdx < setQuestions.length) {
      startAudiobook(setQuestions[nextIdx].id);
    }
  };

  // Skip to prev question
  const skipToPrevQuestion = () => {
    const prevIdx = Math.max(0, currentPlaybackQIndex - 1);
    startAudiobook(setQuestions[prevIdx].id);
  };

  // Keep track of active set changes
  const prevSetTabRef = useRef<number | 'all'>(activeSetTab);
  useEffect(() => {
    if (prevSetTabRef.current !== activeSetTab) {
      prevSetTabRef.current = activeSetTab;
      // Start from first question of new set if already open
      const firstQ = setQuestions[0];
      if (firstQ) {
        startAudiobook(firstQ.id);
      }
    }
  }, [activeSetTab, setQuestions, startAudiobook]);

  // Sync when currentQuestionId changes:
  // - If audio is currently playing and change was manual (from dropdown/UI), immediately read the selected question!
  // - If audio is not playing or paused, prepare segments for the newly selected question.
  useEffect(() => {
    // If this change was triggered internally by the audiobook auto-advancing, don't interrupt playback
    if (isInternalAdvanceRef.current) {
      isInternalAdvanceRef.current = false;
      prevQIdRef.current = currentQuestionId;
      return;
    }

    if (currentQuestionId === prevQIdRef.current) {
      return;
    }
    prevQIdRef.current = currentQuestionId;

    let foundIndex = setQuestions.findIndex((q) => q.id === currentQuestionId);
    if (foundIndex < 0) foundIndex = 0;
    const q = setQuestions[foundIndex];
    if (!q) return;

    const segments = getQuestionSpokenSegments(q, readAllOptionsRef.current);
    setCurrentPlaybackQIndex(foundIndex);
    setCurrentSegmentIndex(0);
    setCurrentSegments(segments);
    currentQIndexRef.current = foundIndex;
    currentSegIndexRef.current = 0;
    currentSegmentsRef.current = segments;

    // If audio is actively playing, immediately read the question selected on the screen!
    if (isPlayingRef.current) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (chunkTimeoutRef.current) {
        clearTimeout(chunkTimeoutRef.current);
        chunkTimeoutRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      const newEpoch = ++sessionEpochRef.current;
      setIsPaused(false);
      isPausedRef.current = false;
      focusQuestionCard(q.id);
      timerRef.current = setTimeout(() => {
        speakCurrentSegment(newEpoch);
      }, 50);
    }
  }, [currentQuestionId, setQuestions, speakCurrentSegment, focusQuestionCard]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (chunkTimeoutRef.current) {
        clearTimeout(chunkTimeoutRef.current);
        chunkTimeoutRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (typeof window !== 'undefined') {
        (window as any).__activeSpeechUtterance = null;
      }
    };
  }, []);

  const currentPlayingQ = setQuestions[currentPlaybackQIndex] || setQuestions[0];
  const activeSegment = currentSegments[currentSegmentIndex];
  const progressPercent = setQuestions.length > 0 
    ? Math.round(((currentPlaybackQIndex + 1) / setQuestions.length) * 100) 
    : 0;

  const setName = activeSetTab === 'all' 
    ? 'All 446' 
    : `Set ${activeSetTab} (Q${(Number(activeSetTab) - 1) * CHUNK_SIZE + 1}–Q${Number(activeSetTab) * CHUNK_SIZE})`;

  if (!isOpen) return null;

  return (
    <div 
      id="audiobook-player-container"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-amber-500/40 backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-6"
    >
      {/* Top Progress Bar */}
      <div className="w-full bg-slate-950 h-1 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* COLLAPSED MINI-BAR VIEW (Compact Docked Floating Bar)                     */}
      {/* ========================================================================= */}
      {isCollapsed ? (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2.5">
          {/* Left: Mini Status & Active Segment */}
          <div 
            onClick={() => handleToggleCollapse(false)}
            className="flex items-center space-x-2.5 min-w-0 flex-1 cursor-pointer group"
            title="Click to expand full audiobook player"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black shrink-0 transition-all ${
              isPlaying && !isPaused
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 animate-pulse'
                : 'bg-slate-800 text-amber-400 border border-slate-700'
            }`}>
              <Headphones className="w-3.5 h-3.5" />
            </div>

            <div className="min-w-0 flex items-center space-x-2 truncate">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0">
                {setName} • Q{currentPlaybackQIndex + 1}/{setQuestions.length}
              </span>

              {activeSegment ? (
                <span className="text-xs text-slate-200 truncate group-hover:text-amber-300 transition-colors">
                  {activeSegment.text}
                </span>
              ) : (
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                  Audiobook Ready ({readAllOptions ? 'All Options' : 'Correct Alone'})
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick Controls & Expand Button */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              id="audiobook-mini-prev-btn"
              onClick={skipToPrevQuestion}
              disabled={currentPlaybackQIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              title="Previous Question"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              id="audiobook-mini-play-btn"
              onClick={togglePlayPause}
              className={`p-1.5 sm:px-3 sm:py-1 rounded-lg font-black text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
                isPlaying && !isPaused
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
              }`}
              title={isPlaying && !isPaused ? 'Pause' : 'Play'}
            >
              {isPlaying && !isPaused ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>

            <button
              id="audiobook-mini-next-btn"
              onClick={skipToNextQuestion}
              disabled={currentPlaybackQIndex === setQuestions.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              title="Next Question"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Mini Speed Selector */}
            <div className="flex items-center space-x-0.5 bg-slate-950/80 border border-slate-800 rounded-lg px-1.5 py-0.5">
              <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">Speed:</span>
              <select
                id="audiobook-mini-speed-select"
                value={playbackRate}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="bg-transparent text-amber-300 font-mono font-bold text-[11px] focus:outline-none cursor-pointer"
                title="Playback Speed"
              >
                <option value="0.75" className="bg-slate-900 text-slate-100">0.75x</option>
                <option value="1.0" className="bg-slate-900 text-slate-100">1.0x</option>
                <option value="1.2" className="bg-slate-900 text-slate-100">1.2x</option>
                <option value="1.5" className="bg-slate-900 text-slate-100">1.5x</option>
                <option value="1.75" className="bg-slate-900 text-slate-100">1.75x</option>
                <option value="2.0" className="bg-slate-900 text-slate-100">2.0x</option>
              </select>
            </div>

            {/* Expand Bar Button */}
            <button
              id="audiobook-mini-expand-btn"
              onClick={() => handleToggleCollapse(false)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
              title="Expand full audiobook bar"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Expand</span>
            </button>

            {/* Close */}
            {onClose && (
              <button
                id="audiobook-mini-close-btn"
                onClick={() => {
                  stopAudio();
                  onClose();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Audiobook Bar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* EXPANDED FULL PLAYER BAR                                                  */
        /* ========================================================================= */
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Left Column: Set Badge, Playing Question Info, Narration Mode & Live Caption */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 transition-all ${
                isPlaying && !isPaused
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 animate-pulse'
                  : 'bg-slate-800 text-amber-400 border border-slate-700'
              }`}>
                <Headphones className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono">
                    {setName}
                  </span>
                  <span className="text-slate-400">
                    Question {currentPlaybackQIndex + 1} of {setQuestions.length}
                  </span>

                  {/* Mode Indicator Tag */}
                  <span className="bg-slate-800/80 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                    {readAllOptions ? 'Mode: All Options (A–D)' : 'Mode: Correct Alone'}
                  </span>

                  {/* Active Segment Pill */}
                  {activeSegment && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                      activeSegment.type === 'option'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                        : activeSegment.type === 'correctAnswer'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : activeSegment.type === 'explanation'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : activeSegment.type === 'examTip'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {activeSegment.label}
                    </span>
                  )}
                </div>

                {/* Live Spoken Sentence Subtitle */}
                <div className="text-xs sm:text-sm font-medium text-slate-200 truncate mt-0.5">
                  {activeSegment ? (
                    <span>{activeSegment.text}</span>
                  ) : (
                    <span className="text-slate-400">
                      {readAllOptions 
                        ? 'Ready to read: Question -> All Options (A-D) -> Correct Answer -> Explanation & Tip'
                        : 'Ready to read: Question -> Correct Answer Alone -> Explanation & Tip'
                      }
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Center Column: Core Playback Controls */}
            <div className="flex items-center justify-center space-x-2 shrink-0">
              {/* Prev Question */}
              <button
                id="audiobook-btn-prev"
                onClick={skipToPrevQuestion}
                disabled={currentPlaybackQIndex === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                title="Previous Question in Set"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Replay */}
              <button
                id="audiobook-btn-replay"
                onClick={replayCurrentQuestion}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                title="Replay Current Question from Start"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Main Play / Pause Button */}
              <button
                id="audiobook-btn-play-pause"
                onClick={togglePlayPause}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-lg cursor-pointer ${
                  isPlaying && !isPaused
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                }`}
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : isPlaying && isPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Listen Audiobook</span>
                  </>
                )}
              </button>

              {/* Next Question */}
              <button
                id="audiobook-btn-next"
                onClick={skipToNextQuestion}
                disabled={currentPlaybackQIndex === setQuestions.length - 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                title="Next Question in Set"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Stop */}
              {isPlaying && (
                <button
                  id="audiobook-btn-stop"
                  onClick={stopAudio}
                  className="p-2 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-700 text-rose-300 transition-all cursor-pointer"
                  title="Stop Audiobook"
                >
                  <Square className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Column: Mode Toggle, Speed, Voice Settings, Collapse & Close */}
            <div className="flex items-center justify-between sm:justify-end flex-wrap gap-2 shrink-0">
              
              {/* Direct Options Mode Switcher Toggle */}
              <div 
                id="audiobook-mode-toggle-group"
                className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px] font-bold shadow-inner"
                title="Select whether to read all answer options or only the correct answer"
              >
                <button
                  id="audiobook-mode-all-options-btn"
                  onClick={() => handleToggleReadAllOptions(true)}
                  className={`px-2.5 py-1 rounded-md flex items-center space-x-1 transition-all cursor-pointer ${
                    readAllOptions
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Read Question -> All Options (A, B, C, D) -> Correct Option -> Explanation & Tip"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">All Options</span>
                  <span className="sm:hidden">All (A-D)</span>
                </button>

                <button
                  id="audiobook-mode-correct-alone-btn"
                  onClick={() => handleToggleReadAllOptions(false)}
                  className={`px-2.5 py-1 rounded-md flex items-center space-x-1 transition-all cursor-pointer ${
                    !readAllOptions
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Read Question -> Correct Answer Alone -> Explanation & Tip"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Correct Alone</span>
                  <span className="sm:hidden">Correct</span>
                </button>
              </div>

              {/* Speed Selector */}
              <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
                <span className="text-[10px] font-mono text-slate-400 px-1">Speed:</span>
                <select
                  id="audiobook-speed-select"
                  value={playbackRate}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="bg-transparent text-amber-300 font-mono font-bold text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="0.75" className="bg-slate-900 text-slate-100">0.75x</option>
                  <option value="1.0" className="bg-slate-900 text-slate-100">1.0x</option>
                  <option value="1.2" className="bg-slate-900 text-slate-100">1.2x</option>
                  <option value="1.5" className="bg-slate-900 text-slate-100">1.5x</option>
                  <option value="1.75" className="bg-slate-900 text-slate-100">1.75x</option>
                  <option value="2.0" className="bg-slate-900 text-slate-100">2.0x</option>
                </select>
              </div>

              {/* Settings Toggle (Voice, Auto-sync, Mode) */}
              <button
                id="audiobook-btn-settings"
                onClick={() => setShowSettings((prev) => !prev)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  showSettings
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Audiobook Voice and playback settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Expand / Collapse Transcript View */}
              <button
                id="audiobook-btn-expand"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center space-x-1 transition-all cursor-pointer"
                title="Toggle audio transcript view"
              >
                <span className="hidden sm:inline">Script</span>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>

              {/* Collapse Bar Button */}
              <button
                id="audiobook-btn-collapse"
                onClick={() => handleToggleCollapse(true)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1 transition-all cursor-pointer"
                title="Collapse player into compact mini-bar"
              >
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Collapse</span>
              </button>

              {/* Close Button */}
              {onClose && (
                <button
                  id="audiobook-btn-close"
                  onClick={() => {
                    stopAudio();
                    onClose();
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close Audiobook Bar"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Settings Drawer */}
          {showSettings && (
            <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 text-xs bg-slate-950/80 p-3 rounded-xl">
              {/* Voice selection */}
              <div className="flex items-center space-x-2 flex-1 min-w-[220px]">
                <label htmlFor="audiobook-voice-select" className="font-bold text-slate-300 whitespace-nowrap">
                  Narrator Voice:
                </label>
                <select
                  id="audiobook-voice-select"
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 w-full focus:ring-1 focus:ring-amber-500 focus:outline-none cursor-pointer"
                >
                  {availableVoices.map((v) => (
                    <option key={v.name} value={v.name} className="bg-slate-900 text-slate-100">
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Answer Options Reading Mode in Settings */}
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-300">Answer Options:</span>
                <button
                  onClick={() => handleToggleReadAllOptions(!readAllOptions)}
                  className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    readAllOptions
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {readAllOptions ? '✓ Read All Options First (A, B, C, D)' : '⚡ Correct Answer Alone'}
                </button>
              </div>

              {/* Auto-sync UI toggle */}
              <label className="flex items-center space-x-2 text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSyncView}
                  onChange={(e) => setAutoSyncView(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                />
                <span>Auto-sync Question in Practice View while listening</span>
              </label>
            </div>
          )}

          {/* Expanded Script / Question Preview Drawer */}
          {isExpanded && currentPlayingQ && (
            <div className="mt-3 pt-3 border-t border-slate-800 max-h-56 overflow-y-auto pr-1 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 font-bold border-b border-slate-800 pb-1">
                <span>
                  Narrated Script for Question {currentPlayingQ.id} {readAllOptions ? '(All Options -> Correct Answer -> Explanation & Tip)' : '(Correct Answer Alone -> Explanation & Tip)'}
                </span>
                <span className="font-mono text-amber-400">{currentPlayingQ.domain}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                {/* Question & Options Column */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block">
                    Question Prompt {readAllOptions && '& All Answer Options'}
                  </span>
                  <p className="text-slate-200 line-clamp-3">{currentPlayingQ.scenario || currentPlayingQ.questionText}</p>

                  {readAllOptions && currentPlayingQ.options && (
                    <div className="space-y-1 pt-1 border-t border-slate-800/80">
                      {currentPlayingQ.options.map((opt) => (
                        <div key={opt.id} className="text-[11px] flex items-start space-x-1 text-slate-300">
                          <span className="font-bold text-amber-400 shrink-0">{opt.id}:</span>
                          <span className="line-clamp-2">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Correct Answer & Explanation Column */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block">
                    Correct Answer, Explanation & Exam Tip
                  </span>
                  <p className="text-emerald-300 font-medium text-xs">
                    {Array.isArray(currentPlayingQ.correctOption) 
                      ? `Options ${currentPlayingQ.correctOption.join(', ')}: ${currentPlayingQ.correctOptionText}`
                      : `Option ${currentPlayingQ.correctOption}: ${currentPlayingQ.correctOptionText}`
                    }
                  </p>
                  <p className="text-slate-300 text-[11px] line-clamp-3">{currentPlayingQ.explanation}</p>
                  {currentPlayingQ.examTip && (
                    <p className="text-purple-300 text-[11px] italic bg-purple-950/30 p-1.5 rounded border border-purple-900/50">
                      <strong className="font-bold">Exam Tip:</strong> {currentPlayingQ.examTip}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
