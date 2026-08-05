import React, { useState, useMemo, useEffect } from 'react';
import { Question, OptionId } from '../types';
import { 
  CheckCircle2, XCircle, ArrowLeft, ArrowRight, Lightbulb, 
  Eye, EyeOff, Sparkles, Check,
  ArrowUp, Layers, ListFilter, Grid, ChevronDown, ChevronUp
} from 'lucide-react';

interface McqPracticeViewProps {
  questions: Question[];
  alwaysRevealAnswers: boolean;
  onToggleAlwaysReveal: () => void;
  selectedQuestionId?: number;
  onSelectQuestionId?: (questionId: number) => void;
  onOpenVisualizations?: () => void;
  onOpenReadyReckoner?: () => void;
}

const CHUNK_SIZE = 50;

export const McqPracticeView: React.FC<McqPracticeViewProps> = ({
  questions,
  alwaysRevealAnswers,
  onToggleAlwaysReveal,
  selectedQuestionId: propSelectedQuestionId,
  onSelectQuestionId: propOnSelectQuestionId,
  onOpenVisualizations,
  onOpenReadyReckoner,
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
    setUserSelectedOptions((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
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
    <div className="w-full px-2 sm:px-4 lg:px-6 py-4 space-y-4 relative">
      
      {/* 50-Question Tab Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Section Label */}
        <div className="flex items-center space-x-2 shrink-0">
          <Layers className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-slate-100 text-sm sm:text-base tracking-wide">Question Sets:</span>
        </div>

        {/* Set Tabs list */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1 w-full md:w-auto">
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
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap min-h-[44px] ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                <span>Set {setNum} (Q{startQ}–Q{endQ})</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-slate-400'
                }`}>
                  {countInSet}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => handleSelectSetTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap min-h-[44px] ${
              activeSetTab === 'all'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <span>All Questions ({questions.length})</span>
          </button>
        </div>
      </div>

      {/* Question Dropdown Selector for Easy Navigation (Compact Space) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Dropdown Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
            <div className="flex items-center space-x-2 shrink-0">
              <ListFilter className="w-5 h-5 text-amber-400" />
              <label htmlFor="question-select" className="text-sm sm:text-base font-bold text-slate-100 whitespace-nowrap">
                Select Question ({filteredQuestions.length}):
              </label>
            </div>
            
            <select
              id="question-select"
              value={currentQuestion?.id || selectedQuestionId}
              onChange={(e) => {
                const qId = Number(e.target.value);
                setSelectedQuestionId(qId);
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
              className="bg-slate-950 border-2 border-slate-700 text-amber-300 font-bold text-base sm:text-lg rounded-xl px-3.5 py-3 w-full flex-1 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none min-h-[50px] shadow-inner cursor-pointer"
            >
              {filteredQuestions.map((q, idx) => {
                const qNumInSet = idx + 1;
                const snippet = q.questionText.length > 80 ? q.questionText.slice(0, 80) + '...' : q.questionText;
                return (
                  <option key={q.id} value={q.id} className="bg-slate-950 text-slate-100 py-2">
                    Q{q.id} (#{qNumInSet}): {snippet}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Quick Prev / Next Jump Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-colors min-h-[46px]"
              title="Previous Question"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Prev</span>
            </button>
            
            <span className="text-xs sm:text-sm text-slate-300 font-mono font-bold px-1.5">
              {currentQuestionIndex + 1}/{filteredQuestions.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 text-xs sm:text-sm font-black flex items-center space-x-1.5 transition-colors min-h-[46px] shadow-md shadow-amber-500/20"
              title="Next Question"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Question Card Container */}
      {currentQuestion ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-7 shadow-2xl relative">
          
          {/* Card Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-mono text-sm sm:text-base font-black px-3.5 py-1.5 rounded-xl shadow-md">
                Question {currentQuestion.id} of {questions.length}
              </span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl">
                {currentQuestion.domain}
              </span>
              <span className="bg-slate-800 text-slate-200 text-xs sm:text-sm px-3 py-1.5 rounded-xl font-medium border border-slate-700">
                {currentQuestion.topic}
              </span>
            </div>

            <div className="flex items-center gap-2">
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
          <div className="bg-slate-950/90 border-l-4 border-amber-500 rounded-r-2xl p-4 sm:p-6 mb-6 text-slate-100 text-base sm:text-lg leading-relaxed font-sans shadow-inner">
            <div className="flex items-center space-x-2 text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Scenario Context</span>
            </div>
            <p className="font-normal text-slate-100">{currentQuestion.scenario}</p>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-6 leading-snug tracking-tight">
            {currentQuestion.questionText}
          </h2>

          {/* Options List */}
          <div className="space-y-3.5 mb-6">
            {currentQuestion.options.map((option) => {
              const isSelected = userPickedOption === option.id;
              const isCorrectOption = Array.isArray(currentQuestion.correctOption)
                ? currentQuestion.correctOption.includes(option.id)
                : option.id === currentQuestion.correctOption;

              let optionStyle = 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-slate-500 text-slate-100';
              let badgeStyle = 'bg-slate-800 border-slate-600 text-slate-200';

              if (isRevealed) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-50 ring-2 ring-emerald-500/60 font-medium shadow-lg shadow-emerald-950/40';
                  badgeStyle = 'bg-emerald-500 text-slate-950 font-black';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'bg-rose-950/70 border-rose-500 text-rose-50 ring-2 ring-rose-500/60';
                  badgeStyle = 'bg-rose-500 text-white font-black';
                } else {
                  optionStyle = 'bg-slate-950/50 border-slate-800 text-slate-400 opacity-70';
                }
              } else if (isSelected) {
                optionStyle = 'bg-slate-800 border-amber-400 text-white ring-2 ring-amber-400';
                badgeStyle = 'bg-amber-400 text-slate-950 font-black';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex items-start space-x-4 group relative min-h-[56px] ${optionStyle}`}
                >
                  <span className={`w-9 h-9 rounded-xl border text-base sm:text-lg font-mono font-bold flex items-center justify-center flex-shrink-0 transition-all ${badgeStyle}`}>
                    {option.id}
                  </span>

                  <span className="flex-1 pt-0.5 text-base sm:text-lg leading-relaxed">
                    {option.text}
                  </span>

                  {isRevealed && isCorrectOption && (
                    <div className="flex items-center space-x-1.5 bg-emerald-500 text-slate-950 text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl flex-shrink-0 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>CORRECT ANSWER</span>
                    </div>
                  )}
                  {isSelected && !isCorrectOption && isRevealed && (
                    <div className="flex items-center space-x-1.5 bg-rose-500 text-white text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl flex-shrink-0 shadow-sm">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>YOUR PICK</span>
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
            <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Correct Answer Explanation with Scenario Example */}
              <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
                <p className="text-base sm:text-lg text-emerald-100 leading-relaxed font-medium">
                  {currentQuestion.explanation}
                </p>
                <div className="bg-emerald-950/90 border border-emerald-800 rounded-xl p-4 text-sm sm:text-base text-emerald-200 space-y-1.5">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm sm:text-base">
                    <Check className="w-4 h-4 text-emerald-400" /> Real-World Scenario Example:
                  </div>
                  <p className="leading-relaxed">{currentQuestion.example}</p>
                </div>
              </div>

              {/* Why Wrong Answers are Wrong Section */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <div className="grid gap-3">
                  {currentQuestion.options.map((opt) => {
                    const isCorrect = Array.isArray(currentQuestion.correctOption)
                      ? currentQuestion.correctOption.includes(opt.id)
                      : opt.id === currentQuestion.correctOption;
                    if (isCorrect) return null;
                    const explanation = currentQuestion.wrongOptionsExplanation[opt.id];
                    return (
                      <div key={opt.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-sm sm:text-base text-slate-200 leading-relaxed">
                        <span className="font-bold text-rose-400 mr-2">Option {opt.id} ({opt.text}):</span>
                        <span>{explanation}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exam Tip & Keyword Clues Callout */}
              <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 border border-amber-500/50 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                <p className="text-base sm:text-lg font-medium text-amber-100 leading-relaxed">
                  {currentQuestion.examTip}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs sm:text-sm text-amber-400 font-bold mr-1">Keyword Clues:</span>
                  {currentQuestion.keywordClues.map((kw, i) => (
                    <span key={i} className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs sm:text-sm px-3 py-1 rounded-full font-mono font-bold">
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
          className="fixed bottom-6 right-6 z-50 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 p-4 rounded-full shadow-2xl shadow-amber-500/40 border-2 border-slate-900 transition-all duration-200 flex items-center justify-center group"
          title="Go to Top"
        >
          <ArrowUp className="w-6 h-6 font-bold group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

    </div>
  );
};




