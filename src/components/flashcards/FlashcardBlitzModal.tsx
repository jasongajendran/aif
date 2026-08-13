import React, { useState, useEffect } from 'react';
import { Flashcard } from '../../types';
import { 
  Timer, X, RotateCw, CheckCircle, RefreshCw, Trophy, 
  Flame, ArrowRight, Play, Eye
} from 'lucide-react';

interface FlashcardBlitzModalProps {
  cards: Flashcard[];
  isOpen: boolean;
  onClose: () => void;
  onMarkMastered: (id: string) => void;
}

export const FlashcardBlitzModal: React.FC<FlashcardBlitzModalProps> = ({
  cards,
  isOpen,
  onClose,
  onMarkMastered
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; review: number }>({ correct: 0, review: 0 });
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentCard = cards[currentIndex];

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setTimeLeft(30);
      setIsPaused(false);
      setScore({ correct: 0, review: 0 });
      setIsFinished(false);
    }
  }, [isOpen, cards]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isFinished || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFlipped(true); // Automatically flip on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isFinished, isPaused, currentIndex]);

  if (!isOpen || !currentCard) return null;

  const handleNext = (wasCorrect: boolean) => {
    if (wasCorrect) {
      onMarkMastered(currentCard.id);
      setScore((s) => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore((s) => ({ ...s, review: s.review + 1 }));
    }

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setTimeLeft(30);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Exam Speed Blitz
                <span className="text-xs font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  Card {currentIndex + 1}/{cards.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Rapid 30-Second Exam Recall Drill</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Timer Badge */}
            {!isFinished && (
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm border ${
                timeLeft <= 5 
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse' 
                  : 'bg-slate-800 text-amber-300 border-slate-700'
              }`}>
                <Timer className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {!isFinished ? (
            <div className="space-y-4">
              {/* Card Question */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {currentCard.domain}
                </span>
                <h4 className="text-xl font-bold text-white leading-snug">
                  {currentCard.title}
                </h4>
                {currentCard.front.scenarioOrContext && (
                  <p className="text-xs italic text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    "{currentCard.front.scenarioOrContext}"
                  </p>
                )}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-base font-bold text-amber-200">
                  {currentCard.front.question}
                </div>
              </div>

              {/* Back Answer reveal if flipped */}
              {isFlipped ? (
                <div className="space-y-3 animate-in fade-in duration-200 pt-2 border-t border-slate-800">
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 font-bold text-base leading-snug">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase block mb-1">⚡ Core Exam Answer:</span>
                    {currentCard.back.coreAnswer}
                  </div>

                  {currentCard.back.distractorTrap && (
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200">
                      <span className="font-bold text-rose-400 block mb-0.5">⚠️ Exam Distractor Trap:</span>
                      {currentCard.back.distractorTrap}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-sm border border-slate-700 flex items-center justify-center space-x-2 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Answer Before Timer Expires</span>
                </button>
              )}
            </div>
          ) : (
            /* Blitz Results Summary */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-amber-500/20">
                <Trophy className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black text-white">Speed Blitz Complete!</h4>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                You drilled through {cards.length} exam-critical flashcards under timed pressure.
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto py-2">
                <div className="bg-emerald-950/50 p-4 rounded-2xl border border-emerald-500/40">
                  <span className="text-xs font-mono text-emerald-400 block font-bold">Mastered</span>
                  <span className="text-2xl font-black text-emerald-200">{score.correct}</span>
                </div>
                <div className="bg-rose-950/50 p-4 rounded-2xl border border-rose-500/40">
                  <span className="text-xs font-mono text-rose-400 block font-bold">Needs Review</span>
                  <span className="text-2xl font-black text-rose-200">{score.review}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          {!isFinished ? (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setIsFlipped((prev) => !prev)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-700"
              >
                <RotateCw className="w-3.5 h-3.5 inline mr-1" />
                {isFlipped ? 'Hide Answer' : 'Flip'}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNext(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-300 border border-slate-700 text-xs font-bold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                  Review Again
                </button>
                <button
                  onClick={() => handleNext(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors shadow-md"
                >
                  <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                  Mastered!
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-colors"
            >
              Return to Flashcards Hub
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
