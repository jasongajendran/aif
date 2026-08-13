import React, { useState, useEffect } from 'react';
import { ViewMode } from '../types';
import { 
  ArrowUp, BookOpen, BarChart2, Sparkles, Compass, 
  Layers, ChevronUp, Menu, X
} from 'lucide-react';

interface FloatingNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  totalQuestions: number;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  currentView,
  onViewChange,
  totalQuestions,
}) => {
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleSelectView = (view: ViewMode) => {
    onViewChange(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showScrollTop && !isMenuOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Expanded Quick Switch Menu */}
      {isMenuOpen && (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-3xl p-3 shadow-2xl space-y-1.5 w-64 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2 mb-1">
            <span className="font-bold text-amber-400">Quick View Jump</span>
            <span>AIF-C01</span>
          </div>

          <button
            onClick={() => handleSelectView('practice')}
            className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
              currentView === 'practice'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Practice MCQs</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">{totalQuestions} Qs</span>
          </button>

          <button
            onClick={() => handleSelectView('visualizations')}
            className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
              currentView === 'visualizations'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4" />
              <span>Concept Visualizers</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">7 Modules</span>
          </button>

          <button
            onClick={() => handleSelectView('ready-reckoner')}
            className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
              currentView === 'ready-reckoner'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Exam Ready Reckoner</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">5 Sections</span>
          </button>

          <button
            onClick={() => handleSelectView('flashcards')}
            className={`w-full px-3 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
              currentView === 'flashcards'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Exam Flashcards</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">Active Recall</span>
          </button>

          <div className="pt-1 border-t border-slate-800 flex justify-end">
            <button
              onClick={scrollToTop}
              className="text-[11px] text-amber-400 hover:underline font-bold px-2 py-1 flex items-center space-x-1"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Scroll to Top</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-2xl">
        
        {/* Quick Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-9 h-9 rounded-xl transition-all flex items-center justify-center ${
            isMenuOpen
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
          }`}
          title="Quick Jump between sections"
        >
          {isMenuOpen ? <X className="w-4 h-4" /> : <Compass className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700 flex items-center justify-center transition-all shadow-md"
          title="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
