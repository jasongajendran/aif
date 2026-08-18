import React, { useState, useMemo, useEffect } from 'react';
import { FlashcardDeckId, Flashcard, Question, NavigationOrigin } from '../../types';
import { FLASHCARD_DECKS, FLASHCARD_DATA } from './flashcardData';
import { FlashcardViewer } from './FlashcardViewer';
import { FlashcardGrid } from './FlashcardGrid';
import { FlashcardBlitzModal } from './FlashcardBlitzModal';
import { 
  Sparkles, Brain, Cpu, ShieldCheck, Lock, AlertTriangle, 
  Zap, Search, Filter, Shuffle, RotateCcw, Timer, LayoutGrid, 
  Layers, CheckCircle2, Bookmark, BookmarkCheck, BookOpen, 
  ArrowRight, Flame, BarChart2, Check, ChevronDown, ChevronUp
} from 'lucide-react';

interface ExamFlashcardsHubProps {
  questions: Question[];
  onSelectQuestion: (questionId: number, origin?: NavigationOrigin) => void;
  onOpenPractice?: () => void;
  onOpenVisualizations?: () => void;
  onOpenReadyReckoner?: () => void;
}

const STORAGE_KEY_MASTERED = 'aif_c01_flashcards_mastered_v1';
const STORAGE_KEY_BOOKMARKS = 'aif_c01_flashcards_bookmarks_v1';
const STORAGE_KEY_DECK = 'aif_c01_flashcards_deck_v1';

export const ExamFlashcardsHub: React.FC<ExamFlashcardsHubProps> = ({
  questions,
  onSelectQuestion,
  onOpenPractice,
  onOpenVisualizations,
  onOpenReadyReckoner
}) => {
  // Active Deck
  const [selectedDeckId, setSelectedDeckId] = useState<FlashcardDeckId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DECK);
      return (saved as FlashcardDeckId) || 'all';
    } catch {
      return 'all';
    }
  });

  // Mastered & Bookmarked sets stored in localStorage
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MASTERED);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [isOverviewCollapsed, setIsOverviewCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aif_c01_flashcards_overview_collapsed_v1');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleOverviewCollapse = () => {
    setIsOverviewCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('aif_c01_flashcards_overview_collapsed_v1', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // UI state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unmastered' | 'mastered' | 'bookmarked'>('all');
  const [viewLayout, setViewLayout] = useState<'single' | 'grid'>('single');
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isBlitzOpen, setIsBlitzOpen] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [deckOrderSeed, setDeckOrderSeed] = useState<number>(0);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MASTERED, JSON.stringify(Array.from(masteredIds)));
    } catch (e) {
      console.error(e);
    }
  }, [masteredIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DECK, selectedDeckId);
    } catch (e) {
      console.error(e);
    }
  }, [selectedDeckId]);

  // Toggle Handlers
  const handleToggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset mastery status for all flashcards? Your bookmarks will be kept.')) {
      setMasteredIds(new Set());
    }
  };

  const handleShuffle = () => {
    setIsShuffled((prev) => !prev);
    setDeckOrderSeed((s) => s + 1);
    setCardIndex(0);
  };

  // Filter Cards
  const filteredCards = useMemo(() => {
    let list = FLASHCARD_DATA.filter((card) => {
      // Deck Filter
      if (selectedDeckId !== 'all' && card.deckId !== selectedDeckId) {
        return false;
      }

      // Status Filter
      if (statusFilter === 'mastered' && !masteredIds.has(card.id)) return false;
      if (statusFilter === 'unmastered' && masteredIds.has(card.id)) return false;
      if (statusFilter === 'bookmarked' && !bookmarkedIds.has(card.id)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = card.title.toLowerCase().includes(q);
        const inQ = card.front.question.toLowerCase().includes(q);
        const inAnswer = card.back.coreAnswer.toLowerCase().includes(q);
        const inKeywords = card.back.examKeywords?.some((k) => k.toLowerCase().includes(q));
        const inTrap = card.back.distractorTrap?.toLowerCase().includes(q);
        const inDomain = card.domain.toLowerCase().includes(q);
        return inTitle || inQ || inAnswer || inKeywords || inTrap || inDomain;
      }

      return true;
    });

    if (isShuffled) {
      // Deterministic shuffle using seed
      list = [...list].sort(() => Math.random() - 0.5);
    }

    return list;
  }, [selectedDeckId, statusFilter, searchQuery, isShuffled, deckOrderSeed, masteredIds, bookmarkedIds]);

  // Ensure cardIndex stays valid
  useEffect(() => {
    if (cardIndex >= filteredCards.length) {
      setCardIndex(Math.max(0, filteredCards.length - 1));
    }
  }, [filteredCards.length, cardIndex]);

  // Stats Calculations
  const totalMasteredCount = masteredIds.size;
  const totalCardsCount = FLASHCARD_DATA.length;
  const masteryPercentage = Math.round((totalMasteredCount / totalCardsCount) * 100);

  // Deck icon lookup
  const getDeckIcon = (deckId: FlashcardDeckId) => {
    switch (deckId) {
      case 'domain-1': return Brain;
      case 'domain-2': return Sparkles;
      case 'domain-3': return Cpu;
      case 'domain-4': return ShieldCheck;
      case 'domain-5': return Lock;
      case 'exam-traps': return AlertTriangle;
      case 'scenario-triggers': return Zap;
      default: return Sparkles;
    }
  };

  const handleNextCard = () => {
    if (cardIndex + 1 < filteredCards.length) {
      setCardIndex((i) => i + 1);
    } else {
      setCardIndex(0); // Loop back to start
    }
  };

  const handlePrevCard = () => {
    if (cardIndex > 0) {
      setCardIndex((i) => i - 1);
    } else {
      setCardIndex(filteredCards.length - 1); // Loop to end
    }
  };

  const handleSelectQuestionFromFlashcard = (questionId: number) => {
    onSelectQuestion(questionId, {
      view: 'flashcards',
      sectionTitle: 'Exam Flashcards Hub',
      tabId: selectedDeckId
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 space-y-4">
      
      {/* 1. Header Banner & Exam Perspective Overview (Collapsible) */}
      {isOverviewCollapsed ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 shadow-md flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 truncate">
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
              Active Recall
            </span>
            <span className="font-bold text-slate-200 truncate">
              AIF-C01 Flashcards Hub
            </span>
            <span className="text-slate-400 font-mono text-[11px] hidden md:inline">
              ({totalMasteredCount}/{totalCardsCount} Mastered • {masteryPercentage}%)
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsBlitzOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center space-x-1"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Blitz</span>
            </button>

            <button
              onClick={toggleOverviewCollapse}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Expand Overview"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> AIF-C01 Flashcards
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                  Active Recall Engine
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Exam Flashcards & Active Recall Hub
              </h2>
              <p className="text-xs text-slate-300 leading-normal">
                Drill high-yield concepts with explicit <strong>exam trigger keywords</strong> and <strong>distractor watch-outs</strong>.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsBlitzOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
              >
                <Timer className="w-4 h-4" />
                <span>Launch 30s Speed Blitz</span>
              </button>

              <button
                onClick={toggleOverviewCollapse}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center space-x-1"
                title="Collapse Banner"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compact</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-3 text-slate-300 font-mono text-[11px]">
              <span>Mastery: <strong className="text-emerald-400">{masteryPercentage}%</strong></span>
              <span>•</span>
              <span><strong className="text-white">{totalMasteredCount}</strong>/{totalCardsCount} Mastered</span>
              <span>•</span>
              <span><strong className="text-amber-400">{bookmarkedIds.size}</strong> Starred</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Deck Selection Tabs - Compact Horizontal Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <span className="font-bold text-slate-300">Select Exam Domain / Deck:</span>
          <span>8 Decks</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {FLASHCARD_DECKS.map((deck) => {
            const IconComponent = getDeckIcon(deck.id);
            const isSelected = selectedDeckId === deck.id;
            const deckCards = deck.id === 'all' 
              ? FLASHCARD_DATA 
              : FLASHCARD_DATA.filter((c) => c.deckId === deck.id);
            const deckMastered = deckCards.filter((c) => masteredIds.has(c.id)).length;

            return (
              <button
                key={deck.id}
                onClick={() => {
                  setSelectedDeckId(deck.id);
                  setCardIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg border text-left transition-all flex items-center space-x-2 whitespace-nowrap min-h-[32px] ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-1 ring-amber-400 border-transparent'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className="text-xs font-bold">{deck.shortName}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-950 text-slate-400'
                }`}>
                  {deckMastered}/{deckCards.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search & Filter Toolbar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCardIndex(0);
              }}
              placeholder="Search concepts, AWS services (Transcribe, Bedrock...), exam keywords, or traps..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          {/* Filter Chips & View Mode Switcher */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Status Filter */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCardIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({FLASHCARD_DATA.length})
              </button>
              <button
                onClick={() => {
                  setStatusFilter('unmastered');
                  setCardIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'unmastered'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Review ({FLASHCARD_DATA.length - totalMasteredCount})
              </button>
              <button
                onClick={() => {
                  setStatusFilter('mastered');
                  setCardIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'mastered'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mastered ({totalMasteredCount})
              </button>
              <button
                onClick={() => {
                  setStatusFilter('bookmarked');
                  setCardIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'bookmarked'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ★ ({bookmarkedIds.size})
              </button>
            </div>

            {/* Layout Toggle: Single vs Grid */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewLayout('single')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewLayout === 'single'
                    ? 'bg-slate-800 text-amber-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Single Card Focus Mode"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewLayout === 'grid'
                    ? 'bg-slate-800 text-amber-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Grid Overview Mode"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Shuffle & Reset */}
            <button
              onClick={handleShuffle}
              className={`p-2.5 rounded-xl border transition-all ${
                isShuffled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Shuffle Cards (Randomize Order)"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetProgress}
              className="p-2.5 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 hover:text-rose-400 hover:border-rose-500/40 transition-all"
              title="Reset Mastery Progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 4. Active Deck Context Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          <span className="font-bold text-slate-200">
            {FLASHCARD_DECKS.find((d) => d.id === selectedDeckId)?.name}
          </span>
          <span className="text-slate-500 ml-2 hidden sm:inline">
            — {FLASHCARD_DECKS.find((d) => d.id === selectedDeckId)?.description}
          </span>
        </div>
        <span className="font-mono text-amber-400 font-bold whitespace-nowrap">
          {filteredCards.length} Cards Found
        </span>
      </div>

      {/* 5. Main Card Viewer OR Grid View */}
      {filteredCards.length === 0 ? (
        <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Search className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-lg font-bold text-slate-300">No Flashcards Match Your Filters</h4>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms, switching to "All Cards", or clearing the status filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setSelectedDeckId('all');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewLayout === 'single' ? (
        <FlashcardViewer
          card={filteredCards[cardIndex]}
          cardIndex={cardIndex}
          totalCards={filteredCards.length}
          isMastered={masteredIds.has(filteredCards[cardIndex].id)}
          isBookmarked={bookmarkedIds.has(filteredCards[cardIndex].id)}
          onToggleMastered={handleToggleMastered}
          onToggleBookmark={handleToggleBookmark}
          onNext={handleNextCard}
          onPrev={handlePrevCard}
          onSelectQuestion={handleSelectQuestionFromFlashcard}
        />
      ) : (
        <FlashcardGrid
          cards={filteredCards}
          masteredIds={masteredIds}
          bookmarkedIds={bookmarkedIds}
          onToggleMastered={handleToggleMastered}
          onToggleBookmark={handleToggleBookmark}
          onSelectQuestion={handleSelectQuestionFromFlashcard}
          onCardClick={(idx) => {
            setCardIndex(idx);
            setViewLayout('single');
          }}
        />
      )}

      {/* 6. Speed Blitz Modal */}
      <FlashcardBlitzModal
        cards={filteredCards}
        isOpen={isBlitzOpen}
        onClose={() => setIsBlitzOpen(false)}
        onMarkMastered={handleToggleMastered}
      />

    </div>
  );
};
