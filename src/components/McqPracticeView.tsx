import React, { useState, useMemo, useEffect } from 'react';
import { Question, OptionId, NavigationOrigin } from '../types';
import { HighlightedExamText } from './HighlightedExamText';
import { 
  CheckCircle2, XCircle, ArrowLeft, ArrowRight, Lightbulb, 
  Eye, EyeOff, Sparkles, Check,
  ArrowUp, Layers, ListFilter, Grid, ChevronDown, ChevronUp,
  RotateCcw, Headphones, Volume2, Play
} from 'lucide-react';
import { AudioBookPlayer } from './AudioBookPlayer';
import { SetAudioBookModal } from './SetAudioBookModal';

interface McqPracticeViewProps {
  questions: Question[];
  alwaysRevealAnswers: boolean;
  onToggleAlwaysReveal: () => void;
  selectedQuestionId?: number;
  onSelectQuestionId?: (questionId: number) => void;
  navigationOrigin?: NavigationOrigin | null;
  onReturnToOrigin?: () => void;
  onOpenVisualizations?: () => void;
  onOpenReadyReckoner?: () => void;
  onOpenFlashcards?: () => void;
}

const CHUNK_SIZE = 50;

export const McqPracticeView: React.FC<McqPracticeViewProps> = ({
  questions,
  alwaysRevealAnswers,
  onToggleAlwaysReveal,
  selectedQuestionId: propSelectedQuestionId,
  onSelectQuestionId: propOnSelectQuestionId,
  navigationOrigin,
  onReturnToOrigin,
  onOpenVisualizations,
  onOpenReadyReckoner,
  onOpenFlashcards,
}) => {
  const [internalSelectedQuestionId, setInternalSelectedQuestionId] = useState<number>(1);
  const selectedQuestionId = propSelectedQuestionId !== undefined ? propSelectedQuestionId : internalSelectedQuestionId;

  const setSelectedQuestionId = (id: number) => {
    setInternalSelectedQuestionId(id);
    propOnSelectQuestionId?.(id);
  };

  const [activeSetTab, setActiveSetTab] = useState<number | 'all'>(() => {
    const initId = propSelectedQuestionId || 1;
    return Math.ceil(initId / CHUNK_SIZE) || 1;
  });

  // Sync set tab if external selectedQuestionId changes
  useEffect(() => {
    if (propSelectedQuestionId !== undefined) {
      const neededSet = Math.ceil(propSelectedQuestionId / CHUNK_SIZE);
      if (activeSetTab !== 'all' && activeSetTab !== neededSet) {
        setActiveSetTab(neededSet);
      }
    }
  }, [propSelectedQuestionId]);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState<boolean>(true);

  // User selected option per question for interactive practice
  const [userSelectedOptions, setUserSelectedOptions] = useState<Record<number, OptionId>>({});

  // Track manually revealed answers per question (when alwaysRevealAnswers is OFF)
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});

  // Highlight Exam Keywords & Trigger Clues (defaults to ON for rapid revision)
  const [highlightKeywords, setHighlightKeywords] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aif_c01_highlight_keywords_v1');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Collapsible Set Bar state (saves vertical space)
  const [isSetBarCollapsed, setIsSetBarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aif_c01_set_bar_collapsed_v1');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleSetBarCollapse = () => {
    setIsSetBarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('aif_c01_set_bar_collapsed_v1', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleToggleHighlightKeywords = () => {
    setHighlightKeywords((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('aif_c01_highlight_keywords_v1', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Set Audiobook Player & Modal State
  const [isAudioBookOpen, setIsAudioBookOpen] = useState<boolean>(false);
  const [isAudioBookModalOpen, setIsAudioBookModalOpen] = useState<boolean>(false);

  const handleStartSetAudioBook = (setNum: number | 'all', targetQId?: number) => {
    handleSelectSetTab(setNum);
    if (targetQId) {
      setSelectedQuestionId(targetQId);
    }
    setIsAudioBookOpen(true);
  };

  const handleToggleAudioBookPlayer = () => {
    setIsAudioBookOpen((prev) => !prev);
  };

  // Monitor window scroll for Go To Top icon
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total 50-question sets dynamically
  const maxQId = Math.max(...questions.map((q) => q.id), 0);
  const totalSets = Math.ceil(maxQId / CHUNK_SIZE) || 1;

  // Filter questions list based on Set Tab
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 50-Question Set Tab filter
      if (activeSetTab !== 'all') {
        const minId = (activeSetTab - 1) * CHUNK_SIZE + 1;
        const maxId = activeSetTab * CHUNK_SIZE;
        if (q.id < minId || q.id > maxId) {
          return false;
        }
      }
      return true;
    });
  }, [questions, activeSetTab]);

  // Current question or fallback
  const currentQuestionIndex = filteredQuestions.findIndex((q) => q.id === selectedQuestionId);
  const currentQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0] || questions[0];

  const userPickedOption = userSelectedOptions[currentQuestion?.id];
  // An answer is revealed if the global toggle is ON or if individually revealed for this question
  const isRevealed = alwaysRevealAnswers || (currentQuestion && revealedQuestions[currentQuestion.id]);

  // Switch Set Tab and auto-select first question in that set
  const handleSelectSetTab = (setNum: number | 'all') => {
    setActiveSetTab(setNum);
    if (setNum === 'all') {
      setSelectedQuestionId(questions[0]?.id || 1);
    } else {
      const minId = (setNum - 1) * CHUNK_SIZE + 1;
      const maxId = setNum * CHUNK_SIZE;
      const firstInSet = questions.find((q) => q.id >= minId && q.id <= maxId);
      if (firstInSet) {
        setSelectedQuestionId(firstInSet.id);
      }
    }
  };

  const handleOptionClick = (optionId: OptionId) => {
    if (!currentQuestion) return;
    setUserSelectedOptions((prev) => {
      const isMulti = Array.isArray(currentQuestion.correctOption);
      if (isMulti) {
        const current = prev[currentQuestion.id];
        const currentArr: OptionId[] = Array.isArray(current)
          ? current
          : current
          ? [current as OptionId]
          : [];
        const exists = currentArr.includes(optionId);
        const updated = exists
          ? currentArr.filter((id) => id !== optionId)
          : [...currentArr, optionId];
        return {
          ...prev,
          [currentQuestion.id]: updated,
        };
      }
      return {
        ...prev,
        [currentQuestion.id]: optionId,
      };
    });
  };

  const toggleRevealAnswer = () => {
    if (!currentQuestion) return;
    setRevealedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setSelectedQuestionId(filteredQuestions[currentQuestionIndex + 1].id);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setSelectedQuestionId(filteredQuestions[currentQuestionIndex - 1].id);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Helper to strip redundant "Option X —" prefix if present in correctOptionText
  const cleanOptionText = (text: string) => {
    return text.replace(/^Option\s+[A-E]\s*(?:—|-|:|\))\s*/i, '');
  };

  return (
    <div className={`w-full px-2 sm:px-4 lg:px-6 py-4 space-y-4 relative ${isAudioBookOpen ? 'pb-36' : ''}`}>
      
      {/* Return to Origin Banner (Shown when navigated from a Visualizer or Ready Reckoner) */}
      {navigationOrigin && onReturnToOrigin && (
        <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Direct Practice Link from {navigationOrigin.view === 'visualizations' ? 'Concept Visualizer' : navigationOrigin.view === 'flashcards' ? 'Exam Flashcards' : 'Ready Reckoner'}
              </div>
              <div className="text-sm sm:text-base font-bold text-white truncate">
                {navigationOrigin.sectionTitle}
              </div>
            </div>
          </div>

          <button
            onClick={onReturnToOrigin}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-500/20 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {navigationOrigin.view === 'visualizations' ? 'Visualizer' : navigationOrigin.view === 'flashcards' ? 'Flashcards' : 'Ready Reckoner'}</span>
          </button>
        </div>
      )}

      {/* Space-Efficient Collapsible Navigation Bar */}
      {isSetBarCollapsed ? (
        /* COLLAPSED MODE: Single 36px bar combining Set Selector, Question Selector & Jump Buttons */
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 shadow-md flex flex-wrap items-center justify-between gap-2">
          {/* Left: Set Selector Dropdown & Expand Pills toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            <label htmlFor="set-select" className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Set:</span>
            </label>
            <select
              id="set-select"
              value={activeSetTab}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                handleSelectSetTab(val);
              }}
              className="bg-slate-950 border border-slate-700 text-amber-300 font-bold text-xs rounded px-2 py-1 focus:ring-1 focus:ring-amber-500 focus:outline-none cursor-pointer"
            >
              {Array.from({ length: totalSets }).map((_, idx) => {
                const setNum = idx + 1;
                const startQ = (setNum - 1) * CHUNK_SIZE + 1;
                const endQ = setNum * CHUNK_SIZE;
                return (
                  <option key={setNum} value={setNum} className="bg-slate-950 text-slate-100">
                    Set {setNum} (Q{startQ}–Q{endQ})
                  </option>
                );
              })}
              <option value="all" className="bg-slate-950 text-slate-100">
                All Questions ({questions.length})
              </option>
            </select>

            <button
              onClick={toggleSetBarCollapse}
              className="text-[10px] text-slate-400 hover:text-amber-400 font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 transition-colors"
              title="Expand set tabs as pills"
            >
              <ChevronDown className="w-3 h-3" />
              <span className="hidden sm:inline">Pills</span>
            </button>

            {/* Compact Mode Audiobook Hub Button */}
            <button
              id="compact-audiobook-btn"
              onClick={() => handleStartSetAudioBook(activeSetTab)}
              className="text-[11px] text-slate-950 font-black flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 shadow-xs transition-all cursor-pointer"
              title="Listen to Set Audiobook"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Audiobook</span>
            </button>
          </div>

          {/* Center: Question Select Dropdown */}
          <div className="flex items-center space-x-1.5 flex-1 min-w-[200px]">
            <select
              id="question-select-compact"
              value={currentQuestion?.id || selectedQuestionId}
              onChange={(e) => {
                const qId = Number(e.target.value);
                setSelectedQuestionId(qId);
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 font-medium text-xs rounded px-2 py-1 w-full focus:ring-1 focus:ring-amber-500 focus:outline-none cursor-pointer truncate"
            >
              {filteredQuestions.map((q, idx) => {
                const qNumInSet = idx + 1;
                const snippet = q.questionText.length > 60 ? q.questionText.slice(0, 60) + '...' : q.questionText;
                return (
                  <option key={q.id} value={q.id} className="bg-slate-950 text-slate-100 py-0.5">
                    Q{q.id} (#{qNumInSet}): {snippet}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Right: Quick Prev/Next Navigation */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1 transition-colors"
            >
              <ArrowLeft className="w-3 h-3 text-amber-400" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            <span className="text-[11px] text-slate-400 font-mono font-bold px-1">
              {currentQuestionIndex + 1}/{filteredQuestions.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
              className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 text-xs font-black flex items-center space-x-1 transition-colors shadow-xs"
            >
              <span className="hidden xs:inline">Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        /* EXPANDED MODE: Space-optimized pills bar + compact Question dropdown */
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 shadow-md space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
            <div className="flex items-center space-x-2 shrink-0">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200 text-xs tracking-wide">Question Sets:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* Listen to current active set */}
              <button
                id="set-audiobook-btn"
                onClick={() => handleStartSetAudioBook(activeSetTab)}
                className="text-[11px] text-slate-950 font-black flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 shadow-sm transition-all cursor-pointer"
                title={`Listen to Set ${activeSetTab === 'all' ? 'All' : activeSetTab} Audiobook (Questions, Correct Answers alone & Explanations)`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Set {activeSetTab === 'all' ? 'All' : activeSetTab} Audiobook</span>
              </button>

              {/* Browse All Set Audiobooks */}
              <button
                id="all-sets-audiobook-modal-btn"
                onClick={() => setIsAudioBookModalOpen(true)}
                className="text-[11px] text-amber-300 hover:text-amber-200 font-bold flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-800 border border-slate-700 hover:border-amber-500/40 transition-colors cursor-pointer"
                title="Browse all 9 Set Audiobooks & Marathon"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>All Audiobooks</span>
              </button>

              <button
                onClick={toggleSetBarCollapse}
                className="text-[10px] text-slate-400 hover:text-amber-400 font-medium flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
                title="Collapse into single compact selector"
              >
                <ChevronUp className="w-3 h-3" />
                <span>Compact</span>
              </button>
            </div>
          </div>

          {/* Set Pills list - tight and compact */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {Array.from({ length: totalSets }).map((_, idx) => {
              const setNum = idx + 1;
              const startQ = (setNum - 1) * CHUNK_SIZE + 1;
              const endQ = setNum * CHUNK_SIZE;
              const countInSet = questions.filter((q) => q.id >= startQ && q.id <= endQ).length;
              const isSelected = activeSetTab === setNum;

              return (
                <button
                  key={setNum}
                  onClick={() => handleSelectSetTab(setNum)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap min-h-[30px] ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>Set {setNum} ({startQ}–{endQ})</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {countInSet}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => handleSelectSetTab('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap min-h-[30px] ${
                activeSetTab === 'all'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <span>All ({questions.length})</span>
            </button>
          </div>

          {/* Dropdown Selector inside expanded view */}
          <div className="pt-1.5 border-t border-slate-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <ListFilter className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                id="question-select"
                value={currentQuestion?.id || selectedQuestionId}
                onChange={(e) => {
                  const qId = Number(e.target.value);
                  setSelectedQuestionId(qId);
                }}
                className="bg-slate-950 border border-slate-700 text-slate-200 font-medium text-xs rounded px-2 py-1 w-full focus:ring-1 focus:ring-amber-500 focus:outline-none cursor-pointer truncate"
              >
                {filteredQuestions.map((q, idx) => {
                  const qNumInSet = idx + 1;
                  const snippet = q.questionText.length > 70 ? q.questionText.slice(0, 70) + '...' : q.questionText;
                  return (
                    <option key={q.id} value={q.id} className="bg-slate-950 text-slate-100 py-0.5">
                      Q{q.id} (#{qNumInSet}): {snippet}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center space-x-1 shrink-0 justify-end">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3 text-amber-400" />
                <span>Prev</span>
              </button>
              <span className="text-[11px] text-slate-400 font-mono font-bold px-1">
                {currentQuestionIndex + 1}/{filteredQuestions.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === filteredQuestions.length - 1}
                className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 text-xs font-black flex items-center space-x-1 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Question Card Container */}
      {currentQuestion ? (
        <div 
          id="current-question-card"
          data-question-id={currentQuestion.id}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative scroll-mt-24"
        >
          
          {/* Card Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg shadow-md">
                Question {currentQuestion.id} of {questions.length}
              </span>
              {Array.isArray(currentQuestion.correctOption) && (
                <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 text-[10px] sm:text-xs font-black px-2 py-1 rounded-lg">
                  Select {currentQuestion.correctOption.length} Answers
                </span>
              )}
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg">
                {currentQuestion.domain}
              </span>
              <span className="bg-slate-800 text-slate-200 text-[10px] sm:text-xs px-2 py-1 rounded-lg font-medium border border-slate-700">
                {currentQuestion.topic}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Question Listen Audiobook Button */}
              <button
                id="card-audiobook-listen-btn"
                onClick={() => {
                  handleStartSetAudioBook(activeSetTab, currentQuestion.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                title="Listen to Set Audiobook starting from this question"
              >
                <Headphones className="w-3.5 h-3.5 text-amber-400" />
                <span>Audiobook</span>
              </button>

              {navigationOrigin && onReturnToOrigin && (
                <button
                  onClick={onReturnToOrigin}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/20 animate-pulse"
                  title="Return directly back to the visualizer section where you clicked this question"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to {navigationOrigin.view === 'visualizations' ? 'Visualizer' : 'Ready Reckoner'}</span>
                </button>
              )}
              {onOpenVisualizations && (
                <button
                  onClick={onOpenVisualizations}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                  title="Switch to Interactive Architecture & Concept Visualizers"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Visualizers</span>
                </button>
              )}
              {onOpenReadyReckoner && (
                <button
                  onClick={onOpenReadyReckoner}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                  title="Switch to Exam Ready Reckoner & Memory Hub"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ready Reckoner</span>
                </button>
              )}
            </div>
          </div>

          {/* Scenario Context Block */}
          <div className="bg-slate-950/90 border-l-4 border-amber-500 rounded-r-xl p-3 sm:p-4 mb-4 text-slate-100 text-sm sm:text-base leading-relaxed font-sans shadow-inner">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-900">
              <div className="flex items-center space-x-2 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scenario Context</span>
                {highlightKeywords && (
                  <span className="hidden sm:inline-block bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    Keywords Highlighted
                  </span>
                )}
              </div>

              {/* Keywords Highlight Toggle Button */}
              <button
                onClick={handleToggleHighlightKeywords}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] font-medium flex items-center space-x-1.5 transition-all border ${
                  highlightKeywords
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title="Toggle highlighting of key exam triggers and keyword clues"
              >
                <Sparkles className={`w-3 h-3 ${highlightKeywords ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Exam Clues:</span>
                <span className={`font-mono font-bold text-[10px] ${highlightKeywords ? 'text-amber-300' : 'text-slate-400'}`}>
                  {highlightKeywords ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
            
            <p className="font-normal text-slate-100">
              <HighlightedExamText
                text={currentQuestion.scenario}
                clues={currentQuestion.keywordClues}
                topic={currentQuestion.topic}
                domain={currentQuestion.domain}
                enabled={highlightKeywords}
              />
            </p>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 leading-snug tracking-tight">
            <HighlightedExamText
              text={currentQuestion.questionText}
              clues={currentQuestion.keywordClues}
              topic={currentQuestion.topic}
              domain={currentQuestion.domain}
              enabled={highlightKeywords}
            />
          </h2>

          {/* Options List */}
          <div className="space-y-2 mb-5">
            {currentQuestion.options.map((option) => {
              const isSelected = Array.isArray(userPickedOption)
                ? userPickedOption.includes(option.id)
                : userPickedOption === option.id;
              const isCorrectOption = Array.isArray(currentQuestion.correctOption)
                ? currentQuestion.correctOption.includes(option.id)
                : option.id === currentQuestion.correctOption;

              let optionStyle = 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-slate-500 text-slate-100';
              let badgeStyle = 'bg-slate-800 border-slate-600 text-slate-200';

              if (isRevealed) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-50 ring-1 ring-emerald-500/60 font-medium shadow-md shadow-emerald-950/40';
                  badgeStyle = 'bg-emerald-500 text-slate-950 font-black';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'bg-rose-950/70 border-rose-500 text-rose-50 ring-1 ring-rose-500/60';
                  badgeStyle = 'bg-rose-500 text-white font-black';
                } else {
                  optionStyle = 'bg-slate-950/50 border-slate-800 text-slate-400 opacity-70';
                }
              } else if (isSelected) {
                optionStyle = 'bg-slate-800 border-amber-400 text-white ring-1 ring-amber-400';
                badgeStyle = 'bg-amber-400 text-slate-950 font-black';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all duration-150 flex items-center space-x-3 group relative min-h-[44px] ${optionStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg border text-sm sm:text-base font-mono font-bold flex items-center justify-center flex-shrink-0 transition-all ${badgeStyle}`}>
                    {option.id}
                  </span>

                  <span className="flex-1 text-sm sm:text-base leading-snug">
                    {option.text}
                  </span>

                  {isRevealed && isCorrectOption && (
                    <div className="flex items-center space-x-1.5 bg-emerald-500 text-slate-950 text-[10px] sm:text-xs font-black px-2 py-1 rounded-lg flex-shrink-0 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">CORRECT</span>
                    </div>
                  )}
                  {isSelected && !isCorrectOption && isRevealed && (
                    <div className="flex items-center space-x-1.5 bg-rose-500 text-white text-[10px] sm:text-xs font-black px-2 py-1 rounded-lg flex-shrink-0 shadow-sm">
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">YOUR PICK</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Reveal Answer Control at Bottom of Question (only when not in Always Reveal Mode) */}
          {!alwaysRevealAnswers && (
            <div className="pt-4 border-t border-slate-800/80 mb-6 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={toggleRevealAnswer}
                className={`px-5 py-3 rounded-xl border transition-all flex items-center space-x-2 text-sm sm:text-base font-bold min-h-[44px] ${
                  isRevealed
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 shadow-md'
                } hover:scale-[1.01]`}
                title="Reveal or hide the correct answer and detailed explanation"
              >
                {isRevealed ? <EyeOff className="w-5 h-5 text-emerald-400" /> : <Eye className="w-5 h-5 text-amber-400" />}
                <span>
                  {isRevealed ? 'Hide Answer & Explanation' : 'Reveal Answer & Detailed Explanation'}
                </span>
              </button>

              <button
                onClick={onToggleAlwaysReveal}
                className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 underline font-semibold"
              >
                Turn on "Always Reveal Answers" for all questions
              </button>
            </div>
          )}

          {/* Answer Breakdown & Detailed Explanations Panel */}
          {isRevealed && (
            <div className="space-y-3 pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Correct Answer Explanation with Scenario Example */}
              <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-4 sm:p-5 space-y-3">
                <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-medium">
                  {currentQuestion.explanation}
                </p>
                <div className="bg-emerald-950/90 border border-emerald-800 rounded-lg p-3 text-xs sm:text-sm text-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs sm:text-sm">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Real-World Scenario Example:
                  </div>
                  <p className="leading-relaxed">{currentQuestion.example}</p>
                </div>
              </div>

              {/* Why Wrong Answers are Wrong Section */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="grid gap-2.5">
                  {currentQuestion.options.map((opt) => {
                    const isCorrect = Array.isArray(currentQuestion.correctOption)
                      ? currentQuestion.correctOption.includes(opt.id)
                      : opt.id === currentQuestion.correctOption;
                    if (isCorrect) return null;
                    const explanation = currentQuestion.wrongOptionsExplanation[opt.id];
                    return (
                      <div key={opt.id} className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                        <span className="font-bold text-rose-400 mr-2">Option {opt.id} ({opt.text}):</span>
                        <span>{explanation}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exam Tip & Keyword Clues Callout */}
              <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 border border-amber-500/50 rounded-xl p-4 sm:p-5 space-y-3 shadow-md">
                <p className="text-sm sm:text-base font-medium text-amber-100 leading-relaxed">
                  {currentQuestion.examTip}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-amber-400 font-bold mr-1">Keyword Clues:</span>
                  {currentQuestion.keywordClues.map((kw, i) => (
                    <span key={i} className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                      "{kw}"
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800 gap-2">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 sm:px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-100 text-sm sm:text-base font-bold flex items-center space-x-2 transition-colors border border-slate-700 min-h-[48px]"
            >
              <ArrowLeft className="w-5 h-5 text-amber-400" />
              <span>Previous</span>
            </button>

            <span className="text-xs sm:text-sm text-slate-300 font-mono font-bold">
              {currentQuestionIndex + 1} of {filteredQuestions.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
              className="px-4 sm:px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 text-slate-950 text-sm sm:text-base font-black flex items-center space-x-2 transition-colors shadow-lg shadow-amber-500/20 min-h-[48px]"
            >
              <span>Next Question</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Back to Top helper button */}
          <button
            onClick={scrollToTop}
            className="sm:hidden w-full mt-4 py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-sm font-bold text-slate-200 flex items-center justify-center space-x-2 transition-colors min-h-[44px]"
          >
            <ArrowUp className="w-4 h-4 text-amber-400" />
            <span>Back to Top</span>
          </button>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <p className="text-lg font-semibold text-slate-200">No questions match the current filters.</p>
          <p className="text-sm mt-1">Try selecting a different Question Set Tab or clear search filters.</p>
          <button
            onClick={() => {
              setActiveSetTab('all');
            }}
            className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-sm font-bold"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Floating Go To Top Icon at Bottom Right */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={`fixed right-6 z-50 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 p-4 rounded-full shadow-2xl shadow-amber-500/40 border-2 border-slate-900 transition-all duration-200 flex items-center justify-center group ${
            isAudioBookOpen ? 'bottom-28' : 'bottom-6'
          }`}
          title="Go to Top"
        >
          <ArrowUp className="w-6 h-6 font-bold group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Set Audiobooks Selection Modal */}
      <SetAudioBookModal
        isOpen={isAudioBookModalOpen}
        onClose={() => setIsAudioBookModalOpen(false)}
        questions={questions}
        activeSetTab={activeSetTab}
        onStartSetAudioBook={(setNum) => {
          handleStartSetAudioBook(setNum);
        }}
      />

      {/* Bottom Sticky Set Audiobook Player Bar */}
      <AudioBookPlayer
        isOpen={isAudioBookOpen}
        questions={questions}
        currentQuestionId={currentQuestion?.id || selectedQuestionId}
        onSelectQuestionId={(id) => setSelectedQuestionId(id)}
        activeSetTab={activeSetTab}
        onSelectSetTab={(setNum) => handleSelectSetTab(setNum)}
        onClose={() => setIsAudioBookOpen(false)}
      />

    </div>
  );
};




