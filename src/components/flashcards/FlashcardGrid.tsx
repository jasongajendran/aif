import React, { useState } from 'react';
import { Flashcard } from '../../types';
import { HighlightedExamText } from '../HighlightedExamText';
import { 
  CheckCircle, Bookmark, BookmarkCheck, RotateCw, 
  Flame, Tag, ExternalLink, AlertTriangle, Check, Search
} from 'lucide-react';

interface FlashcardGridProps {
  cards: Flashcard[];
  masteredIds: Set<string>;
  bookmarkedIds: Set<string>;
  onToggleMastered: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onSelectQuestion?: (questionId: number) => void;
  onCardClick?: (index: number) => void;
}

export const FlashcardGrid: React.FC<FlashcardGridProps> = ({
  cards,
  masteredIds,
  bookmarkedIds,
  onToggleMastered,
  onToggleBookmark,
  onSelectQuestion,
  onCardClick
}) => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const flipAllCards = (flipToBack: boolean) => {
    if (flipToBack) {
      setFlippedCards(new Set(cards.map((c) => c.id)));
    } else {
      setFlippedCards(new Set());
    }
  };

  if (cards.length === 0) {
    return (
      <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
        <Search className="w-10 h-10 text-slate-500 mx-auto" />
        <h4 className="text-lg font-bold text-slate-300">No Flashcards Match Your Filter</h4>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Try clearing your search query or selecting a different exam domain filter above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid Toolbar: Flip All / Unflip All */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {cards.length} Exam Cards</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => flipAllCards(false)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            Show All Questions
          </button>
          <button
            onClick={() => flipAllCards(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 transition-colors"
          >
            Show All Answers
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const isFlipped = flippedCards.has(card.id);
          const isMastered = masteredIds.has(card.id);
          const isBookmarked = bookmarkedIds.has(card.id);

          return (
            <div
              key={card.id}
              onClick={(e) => toggleFlip(card.id, e)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between space-y-4 relative select-none hover:shadow-xl ${
                isFlipped
                  ? 'bg-slate-900/95 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 truncate max-w-[170px]">
                    {card.domain}
                  </span>
                  
                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleBookmark(card.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark card'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onToggleMastered(card.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isMastered
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={isMastered ? 'Mastered' : 'Mark as mastered'}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-2">
                  {card.title}
                </h4>
              </div>

              {/* Card Body */}
              <div className="flex-1 text-xs text-slate-300">
                {!isFlipped ? (
                  <div className="space-y-2 py-1">
                    {card.front.scenarioOrContext && (
                      <p className="italic text-slate-400 text-[11px] line-clamp-2">
                        "<HighlightedExamText
                          text={card.front.scenarioOrContext}
                          clues={card.back.examKeywords}
                          domain={card.domain}
                          enabled={true}
                        />"
                      </p>
                    )}
                    <div className="font-semibold text-amber-200/90 leading-snug">
                      <HighlightedExamText
                        text={card.front.question}
                        clues={card.back.examKeywords}
                        domain={card.domain}
                        enabled={true}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 py-1">
                    <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30 text-emerald-200 font-bold text-xs leading-snug">
                      {card.back.coreAnswer}
                    </div>

                    {card.back.distractorTrap && (
                      <div className="bg-rose-950/30 p-2 rounded-lg border border-rose-500/30 text-[11px] text-rose-200">
                        <span className="font-bold text-rose-400 block mb-0.5">⚠️ Trap:</span>
                        {card.back.distractorTrap}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer: Flip trigger & Practice Link */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1 text-slate-400 group-hover:text-amber-400 transition-colors">
                  <RotateCw className="w-3 h-3 text-amber-400" />
                  <span>{isFlipped ? 'Show Front' : 'Flip Answer'}</span>
                </span>

                {card.back.relatedQuestionIds && card.back.relatedQuestionIds.length > 0 && onSelectQuestion && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectQuestion(card.back.relatedQuestionIds![0]);
                    }}
                    className="text-amber-400 hover:underline flex items-center space-x-1 font-mono font-bold"
                  >
                    <span>Practice Q{card.back.relatedQuestionIds[0]}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
