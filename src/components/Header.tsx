import React from 'react';
import { Brain, Award, Eye, EyeOff, Layers, BookOpen, BarChart2, Sparkles, Table } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  totalQuestions: number;
  alwaysRevealAnswers: boolean;
  onToggleAlwaysReveal: () => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalQuestions,
  alwaysRevealAnswers,
  onToggleAlwaysReveal,
  currentView,
  onViewChange,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="w-full px-2.5 sm:px-4 lg:px-6 py-3 space-y-3">
        
        {/* Top Row: Logo, Title & Always Reveal Toggle */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/10 shrink-0">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2 py-0.5 rounded-md font-bold tracking-wider">
                  AWS AIF-C01
                </span>
                <span className="text-xs sm:text-sm text-emerald-400 font-bold flex items-center gap-1">
                  <Award className="w-4 h-4" /> Exam Mastery Hub
                </span>
              </div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight leading-snug">
                AWS Certified AI Practitioner Practice Exam & Visual Study Hub
              </h1>
            </div>
          </div>

          {/* Right Controls: Always Reveal Toggle & Total Questions Badge */}
          <div className="flex items-center justify-between lg:justify-end space-x-3">
            <button
              onClick={onToggleAlwaysReveal}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 border shadow-sm min-h-[42px] ${
                alwaysRevealAnswers
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 ring-2 ring-emerald-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Toggle to automatically reveal answers and explanations for all questions"
            >
              {alwaysRevealAnswers ? (
                <Eye className="w-4 h-4 text-emerald-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
              <span>Always Reveal Answers:</span>
              <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-extrabold ${
                alwaysRevealAnswers ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}>
                {alwaysRevealAnswers ? 'ON' : 'OFF'}
              </span>
            </button>
            <span className="text-xs sm:text-sm text-slate-400 font-mono font-bold whitespace-nowrap">
              {totalQuestions} Questions
            </span>
          </div>

        </div>

        {/* Bottom Row: Primary Mode Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-800/80 pt-2.5 pb-0.5 scrollbar-thin">
          <button
            onClick={() => onViewChange('practice')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap min-h-[42px] ${
              currentView === 'practice'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice MCQs ({totalQuestions} Qs)</span>
          </button>

          <button
            onClick={() => onViewChange('visualizations')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap min-h-[42px] ${
              currentView === 'visualizations'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Concept Visualizers</span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-extrabold ml-1">
              Interactive
            </span>
          </button>

          <button
            onClick={() => onViewChange('ready-reckoner')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap min-h-[42px] ${
              currentView === 'ready-reckoner'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Exam Ready Reckoner</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-extrabold ml-1">
              Cheat Sheets & Flows
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};


