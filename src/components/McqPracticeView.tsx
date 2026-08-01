import React, { useState, useMemo, useEffect } from 'react';
import { Question, OptionId } from '../types';
import { 
  CheckCircle2, XCircle, ArrowLeft, ArrowRight, Lightbulb, 
  Eye, EyeOff, Sparkles, Check,
  ArrowUp, Layers
} from 'lucide-react';

interface McqPracticeViewProps {
  questions: Question[];
  alwaysRevealAnswers: boolean;
  onToggleAlwaysReveal: () => void;
}

const CHUNK_SIZE = 50;

export const McqPracticeView: React.FC<McqPracticeViewProps> = ({
  questions,
  alwaysRevealAnswers,
  onToggleAlwaysReveal,
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [activeSetTab, setActiveSetTab] = useState<number | 'all'>(1); // Tab 1 = Q1-Q50, Tab 2 = Q51-Q100, etc.
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative">
      
      {/* 50-Question Tab Navigation Bar (Slim) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 shadow-lg flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 text-xs">
        {/* Left: Compact Label */}
        <div className="flex items-center space-x-2 shrink-0">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-200 text-xs tracking-wide">Sets:</span>
        </div>

        {/* Set Tabs list */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5 w-full sm:w-auto">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/10'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>Set {setNum} (Q{startQ}–Q{endQ})</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-slate-950 text-amber-400 font-extrabold' : 'bg-slate-900 text-slate-400'
                }`}>
                  {countInSet}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => handleSelectSetTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeSetTab === 'all'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/10'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
            }`}
          >
            <span>All ({questions.length})</span>
          </button>
        </div>
      </div>

      {/* Main Question Card Container */}
      {currentQuestion ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          
          {/* Card Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="bg-slate-800 text-amber-400 border border-slate-700 font-mono text-xs font-bold px-3 py-1 rounded-lg">
                Question {currentQuestion.id} of {questions.length}
              </span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold px-2.5 py-1 rounded-lg">
                {currentQuestion.domain}
              </span>
              <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg font-medium hidden sm:inline">
                {currentQuestion.topic}
              </span>
            </div>
          </div>

          {/* Scenario Context Block */}
          <div className="bg-slate-950/80 border-l-4 border-amber-500 rounded-r-xl p-4 sm:p-5 mb-5 text-slate-200 text-sm leading-relaxed font-sans shadow-inner">
            <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scenario Context</span>
            </div>
            <p>{currentQuestion.scenario}</p>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-semibold text-white mb-6 leading-snug">
            {currentQuestion.questionText}
          </h2>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option) => {
              const isSelected = userPickedOption === option.id;
              const isCorrectOption = option.id === currentQuestion.correctOption;

              let optionStyle = 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200';
              let badgeStyle = 'bg-slate-800 border-slate-700 text-slate-300';

              if (isRevealed) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/50 font-medium shadow-md shadow-emerald-950/30';
                  badgeStyle = 'bg-emerald-500 text-slate-950 font-bold';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-100 ring-1 ring-rose-500/50';
                  badgeStyle = 'bg-rose-500 text-white font-bold';
                } else {
                  optionStyle = 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-70';
                }
              } else if (isSelected) {
                optionStyle = 'bg-slate-800 border-amber-400 text-white ring-1 ring-amber-400';
                badgeStyle = 'bg-amber-400 text-slate-950 font-bold';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-150 flex items-start space-x-3.5 group relative ${optionStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg border text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 transition-all ${badgeStyle}`}>
                    {option.id}
                  </span>

                  <span className="flex-1 pt-0.5 leading-relaxed">
                    {option.text}
                  </span>

                  {isRevealed && isCorrectOption && (
                    <div className="flex items-center space-x-1.5 bg-emerald-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>CORRECT ANSWER</span>
                    </div>
                  )}
                  {isSelected && !isCorrectOption && isRevealed && (
                    <div className="flex items-center space-x-1 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0">
                      <XCircle className="w-4 h-4" />
                      <span>YOUR PICK</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Reveal Answer Control at Bottom of Question */}
          <div className="pt-4 border-t border-slate-800/80 mb-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={toggleRevealAnswer}
              disabled={alwaysRevealAnswers}
              className={`px-4 py-2.5 rounded-xl border transition-all flex items-center space-x-2 text-xs font-bold ${
                isRevealed
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 shadow-md'
              } ${alwaysRevealAnswers ? 'cursor-default opacity-90' : 'hover:scale-[1.01]'}`}
              title="Reveal or hide the correct answer and detailed explanation"
            >
              {isRevealed ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
              <span>
                {alwaysRevealAnswers 
                  ? 'Answer & Detailed Explanation Revealed (Always Mode Active)' 
                  : isRevealed ? 'Hide Answer & Explanation' : 'Reveal Answer & Detailed Explanation'}
              </span>
            </button>

            {!alwaysRevealAnswers && (
              <button
                onClick={onToggleAlwaysReveal}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
              >
                Turn on "Always Reveal Answers" for all questions
              </button>
            )}
          </div>

          {/* Answer Breakdown & Detailed Explanations Panel */}
          {isRevealed && (
            <div className="space-y-6 pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Verdict Banner */}
              <div className="p-4 rounded-xl border bg-emerald-950/40 border-emerald-500/60 text-emerald-300 flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">
                    Correct Choice: Option {currentQuestion.correctOption} — {currentQuestion.correctOptionText}
                  </p>
                  <p className="text-xs opacity-80 mt-0.5">
                    Review the full explanation, real-world scenario example, and why wrong options failed below.
                  </p>
                </div>
              </div>

              {/* Why Correct Section with Scenario Example */}
              <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-5 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Why Option {currentQuestion.correctOption} ({currentQuestion.correctOptionText}) is Correct</span>
                </div>
                <p className="text-sm text-emerald-100 leading-relaxed font-medium">
                  {currentQuestion.explanation}
                </p>
                <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-lg p-3.5 text-xs text-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Real-World Scenario Example:
                  </div>
                  <p className="leading-relaxed">{currentQuestion.example}</p>
                </div>
              </div>

              {/* Why Wrong Answers are Wrong Section */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  <span>Why Wrong Options Fail the Requirements</span>
                </div>
                <div className="grid gap-2.5">
                  {currentQuestion.options.map((opt) => {
                    if (opt.id === currentQuestion.correctOption) return null;
                    const explanation = currentQuestion.wrongOptionsExplanation[opt.id];
                    return (
                      <div key={opt.id} className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                        <span className="font-bold text-rose-400 mr-2">Option {opt.id} ({opt.text}):</span>
                        <span>{explanation}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exam Tip & Keyword Clues Callout */}
              <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 rounded-xl p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4" />
                    <span>AIF-C01 Exam Tip & Decision Rule</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-amber-100 leading-relaxed">
                  {currentQuestion.examTip}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-amber-400/80 font-semibold mr-1">Keyword Clues:</span>
                  {currentQuestion.keywordClues.map((kw, i) => (
                    <span key={i} className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] px-2 py-0.5 rounded-full font-mono">
                      "{kw}"
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-colors border border-slate-700/60"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              {currentQuestionIndex + 1} of {filteredQuestions.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center space-x-2 transition-colors shadow-md shadow-amber-500/10"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Back to Top helper button */}
          <button
            onClick={scrollToTop}
            className="sm:hidden w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-300 flex items-center justify-center space-x-2 transition-colors"
          >
            <ArrowUp className="w-4 h-4 text-amber-400" />
            <span>Back to Top</span>
          </button>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <p className="text-base font-semibold text-slate-300">No questions match the current filters.</p>
          <p className="text-xs mt-1">Try selecting a different Question Set Tab or clear search filters.</p>
          <button
            onClick={() => {
              setActiveSetTab('all');
              setSelectedDomain('All Domains');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
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
          className="fixed bottom-6 right-6 z-50 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 p-3.5 rounded-full shadow-2xl shadow-amber-500/30 border-2 border-slate-900 transition-all duration-200 flex items-center justify-center group"
          title="Go to Top"
        >
          <ArrowUp className="w-5 h-5 font-bold group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

    </div>
  );
};



