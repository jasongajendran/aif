import React, { useState, useEffect } from 'react';
import { Flashcard } from '../../types';
import { 
  RotateCw, CheckCircle, RefreshCw, Bookmark, BookmarkCheck, 
  ArrowLeft, ArrowRight, Sparkles, AlertTriangle, Lightbulb, 
  ExternalLink, Key, ShieldCheck, Flame, Tag, Check, Eye
} from 'lucide-react';

interface FlashcardViewerProps {
  card: Flashcard;
  cardIndex: number;
  totalCards: number;
  isMastered: boolean;
  isBookmarked: boolean;
  onToggleMastered: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectQuestion?: (questionId: number) => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  card,
  cardIndex,
  totalCards,
  isMastered,
  isBookmarked,
  onToggleMastered,
  onToggleBookmark,
  onNext,
  onPrev,
  onSelectQuestion
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement).tagName?.toLowerCase())) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        onPrev();
      } else if (e.key === '1') {
        e.preventDefault();
        if (isMastered) onToggleMastered(card.id);
        onNext();
      } else if (e.key === '2') {
        e.preventDefault();
        if (!isMastered) onToggleMastered(card.id);
        onNext();
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        onToggleBookmark(card.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card.id, isMastered, onNext, onPrev, onToggleMastered, onToggleBookmark]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Card Controls & Progress Info */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 px-1">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            Card {cardIndex + 1} of {totalCards}
          </span>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            [Space = Flip | ←/→ = Prev/Next]
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleBookmark(card.id)}
            className={`p-2 rounded-xl transition-all border flex items-center space-x-1.5 ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title={isBookmarked ? 'Remove Bookmark (Press B)' : 'Bookmark for Exam Review (Press B)'}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
            <span className="text-xs font-semibold hidden sm:inline">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          </button>

          <span className={`text-xs px-2.5 py-1 rounded-xl font-bold border flex items-center space-x-1.5 ${
            isMastered
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isMastered ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span>{isMastered ? 'Mastered' : 'Needs Review'}</span>
          </span>
        </div>
      </div>

      {/* Main 3D Flipping Flashcard Container */}
      <div 
        onClick={() => setIsFlipped((prev) => !prev)}
        className="cursor-pointer group relative min-h-[380px] sm:min-h-[420px] rounded-3xl transition-all duration-300 transform perspective-1000 select-none"
      >
        <div 
          className={`relative w-full h-full rounded-3xl p-6 sm:p-8 transition-all duration-500 transform shadow-2xl border ${
            isFlipped 
              ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-amber-500/40 ring-1 ring-amber-500/20' 
              : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Card Badges Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-4">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="bg-slate-800/90 text-slate-300 text-xs px-3 py-1 rounded-lg font-mono font-bold border border-slate-700/80 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                {card.domain}
              </span>
              <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-lg font-bold border border-amber-500/20 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {card.highYieldRating === 'essential' ? 'Essential Core' : card.highYieldRating === 'critical-distractor' ? 'Critical Trap' : 'High Frequency'}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-400 group-hover:text-amber-400 transition-colors">
                <RotateCw className={`w-3.5 h-3.5 transition-transform duration-300 ${isFlipped ? 'rotate-180 text-amber-400' : ''}`} />
                {isFlipped ? 'Answer View (Click to Flip)' : 'Question View (Click to Flip)'}
              </span>
            </div>
          </div>

          {/* FRONT VIEW */}
          {!isFlipped ? (
            <div className="space-y-6 py-2">
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono font-black text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4" /> Concept Trigger & Question
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {card.title}
                </h3>
              </div>

              {/* Scenario Context Box */}
              {card.front.scenarioOrContext && (
                <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800/90 text-sm text-slate-300 leading-relaxed shadow-inner">
                  <span className="text-[11px] font-mono uppercase font-bold text-slate-400 block mb-1">
                    📋 Exam Scenario Context:
                  </span>
                  <p className="italic text-slate-200">
                    "{card.front.scenarioOrContext}"
                  </p>
                </div>
              )}

              {/* Core Question Prompt */}
              <div className="bg-amber-500/5 p-5 rounded-2xl border border-amber-500/20 text-base sm:text-lg font-bold text-amber-100 leading-relaxed">
                {card.front.question}
              </div>

              {/* Prompt to Flip */}
              <div className="pt-4 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-amber-400 transition-colors gap-2">
                <Eye className="w-4 h-4" />
                <span>Click anywhere on card or press SPACE to reveal exam answer & distractor traps</span>
              </div>
            </div>
          ) : (
            /* BACK VIEW (EXAM PERSPECTIVE) */
            <div className="space-y-5 py-1 text-slate-200">
              
              {/* Direct Core Answer */}
              <div className="bg-emerald-950/60 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 text-slate-100 shadow-md">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                  <Check className="w-4 h-4" /> Direct Exam Answer & Rule
                </div>
                <div className="text-base sm:text-lg font-black text-emerald-200 leading-snug">
                  {card.back.coreAnswer}
                </div>
              </div>

              {/* Exam Keywords Badges */}
              {card.back.examKeywords && card.back.examKeywords.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                    🎯 Exam Trigger Keywords:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.back.examKeywords.map((kw, i) => (
                      <span key={i} className="text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 font-mono font-semibold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Distractor Trap Callout (Crucial for passing!) */}
              {card.back.distractorTrap && (
                <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-500/40 text-xs sm:text-sm text-rose-200 leading-relaxed">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="uppercase font-mono text-[11px] tracking-wider">Exam Distractor Trap (Watch Out!):</span>
                  </div>
                  <p>{card.back.distractorTrap}</p>
                </div>
              )}

              {/* Mental Model / Analogy */}
              {card.back.mentalModelOrAnalogy && (
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="flex items-center space-x-1.5 text-cyan-400 font-bold mb-1">
                    <Lightbulb className="w-4 h-4 shrink-0" />
                    <span className="uppercase font-mono text-[11px]">Mental Model / Analogy:</span>
                  </div>
                  <p className="italic text-slate-300">{card.back.mentalModelOrAnalogy}</p>
                </div>
              )}

              {/* Key Exam Points */}
              {card.back.keyPoints && card.back.keyPoints.length > 0 && (
                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400 block">
                    📌 Key Exam Takeaways:
                  </span>
                  <ul className="space-y-1">
                    {card.back.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practice Questions Links */}
              {card.back.relatedQuestionIds && card.back.relatedQuestionIds.length > 0 && onSelectQuestion && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs"
                >
                  <span className="text-slate-400 font-mono">Test your mastery in MCQ practice:</span>
                  <div className="flex items-center space-x-1.5">
                    {card.back.relatedQuestionIds.map((qid) => (
                      <button
                        key={qid}
                        onClick={() => onSelectQuestion(qid)}
                        className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/40 font-mono font-bold transition-all flex items-center space-x-1"
                      >
                        <span>Practice Q{qid}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Bottom Action Controls: Self-Assessment & Card Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Navigation buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={onPrev}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setIsFlipped((prev) => !prev)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <RotateCw className="w-4 h-4" />
            <span>{isFlipped ? 'Show Front' : 'Flip to Answer'}</span>
          </button>

          <button
            onClick={onNext}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Self-Rating Grading Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              if (isMastered) onToggleMastered(card.id);
              onNext();
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm"
            title="Mark as needing review (Press 1)"
          >
            <RefreshCw className="w-4 h-4 text-rose-400" />
            <span>Study Again [1]</span>
          </button>

          <button
            onClick={() => {
              if (!isMastered) onToggleMastered(card.id);
              onNext();
            }}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20"
            title="Mark as mastered (Press 2)"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            <span>Mastered! [2]</span>
          </button>
        </div>
      </div>

    </div>
  );
};
