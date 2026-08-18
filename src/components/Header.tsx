import React, { useState, useEffect } from 'react';
import { Brain, Award, Eye, EyeOff, Layers, BookOpen, BarChart2, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  totalQuestions: number;
  alwaysRevealAnswers: boolean;
  onToggleAlwaysReveal: () => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const STORAGE_KEY_HEADER_COLLAPSED = 'aif_c01_header_collapsed_v1';

export const Header: React.FC<HeaderProps> = ({
  totalQuestions,
  alwaysRevealAnswers,
  onToggleAlwaysReveal,
  currentView,
  onViewChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HEADER_COLLAPSED);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HEADER_COLLAPSED, String(isCollapsed));
    } catch (e) {
      console.error(e);
    }
  }, [isCollapsed]);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-95 shadow-md">
      <div className="w-full px-2 sm:px-4 py-1.5 transition-all duration-200">
        
        {/* ULTRA-COMPACT COLLAPSED MODE HEADER */}
        {isCollapsed ? (
          <div className="flex items-center justify-between gap-2 min-h-[32px]">
            {/* Left: Mini Brand & View Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-0.5">
              <div className="flex items-center space-x-1.5 shrink-0 pr-1 border-r border-slate-800">
                <div className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black text-amber-400 hidden sm:inline">AIF-C01</span>
              </div>

              {/* Ultra-compact View Tabs */}
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={() => onViewChange('practice')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all flex items-center space-x-1 whitespace-nowrap ${
                    currentView === 'practice'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Practice ({totalQuestions})</span>
                </button>

                <button
                  onClick={() => onViewChange('visualizations')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all flex items-center space-x-1 whitespace-nowrap ${
                    currentView === 'visualizations'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <BarChart2 className="w-3 h-3" />
                  <span>Visualizers</span>
                </button>

                <button
                  onClick={() => onViewChange('ready-reckoner')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all flex items-center space-x-1 whitespace-nowrap ${
                    currentView === 'ready-reckoner'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Ready Reckoner</span>
                </button>

                <button
                  onClick={() => onViewChange('flashcards')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all flex items-center space-x-1 whitespace-nowrap ${
                    currentView === 'flashcards'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Flashcards</span>
                </button>
              </div>
            </div>

            {/* Right: Reveal Toggle & Expand Header Switch */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={onToggleAlwaysReveal}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 border ${
                  alwaysRevealAnswers
                    ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Always Reveal Answers"
              >
                {alwaysRevealAnswers ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3" />}
                <span className="hidden xs:inline">Reveal:</span>
                <span className="font-mono font-black">{alwaysRevealAnswers ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors border border-slate-700"
                title="Expand Header"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* REGULAR COMPACT HEADER MODE */
          <div className="space-y-1.5">
            {/* Top Bar: Title & Right Controls */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-md shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                      AWS AIF-C01
                    </span>
                    <span className="text-[11px] text-slate-300 font-bold truncate hidden sm:inline">
                      Study Hub ({totalQuestions} Qs)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Controls & Header Collapse Toggle */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={onToggleAlwaysReveal}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                    alwaysRevealAnswers
                      ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Toggle to automatically reveal answers and explanations"
                >
                  {alwaysRevealAnswers ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Always Reveal:</span>
                  <span className={`px-1 py-0.2 rounded font-mono text-[10px] font-black ${
                    alwaysRevealAnswers ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400'
                  }`}>
                    {alwaysRevealAnswers ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => setIsCollapsed(true)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors border border-slate-700 flex items-center space-x-1 text-[10px] font-bold px-1.5"
                  title="Collapse Header to Save Space"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Compact</span>
                </button>
              </div>
            </div>

            {/* Bottom Bar: Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-800/80 pt-1.5 pb-0.5 scrollbar-none">
              <button
                onClick={() => onViewChange('practice')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap min-h-[32px] ${
                  currentView === 'practice'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Practice MCQs ({totalQuestions})</span>
              </button>

              <button
                onClick={() => onViewChange('visualizations')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap min-h-[32px] ${
                  currentView === 'visualizations'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Concept Visualizers</span>
              </button>

              <button
                onClick={() => onViewChange('ready-reckoner')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap min-h-[32px] ${
                  currentView === 'ready-reckoner'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ready Reckoner</span>
              </button>

              <button
                onClick={() => onViewChange('flashcards')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap min-h-[32px] ${
                  currentView === 'flashcards'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Flashcards</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
