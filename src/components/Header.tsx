import React from 'react';
import { Brain, Award, Eye, EyeOff } from 'lucide-react';

interface HeaderProps {
  totalQuestions: number;
  alwaysRevealAnswers: boolean;
  onToggleAlwaysReveal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalQuestions,
  alwaysRevealAnswers,
  onToggleAlwaysReveal,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="w-full px-2.5 sm:px-4 lg:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/10 shrink-0">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2 py-0.5 rounded-md font-bold tracking-wider">
                  AWS AIF-C01
                </span>
                <span className="text-xs sm:text-sm text-emerald-400 font-bold flex items-center gap-1">
                  <Award className="w-4 h-4" /> Exam Practice MCQs
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                AWS Certified AI Practitioner Practice Questions
              </h1>
            </div>
          </div>

          {/* Top Toggle for Always Reveal Answers */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3">
            <button
              onClick={onToggleAlwaysReveal}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 border shadow-sm min-h-[44px] ${
                alwaysRevealAnswers
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 ring-2 ring-emerald-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Toggle to automatically reveal answers and explanations for all questions"
            >
              {alwaysRevealAnswers ? (
                <Eye className="w-4.5 h-4.5 text-emerald-400" />
              ) : (
                <EyeOff className="w-4.5 h-4.5 text-slate-400" />
              )}
              <span>Always Reveal Answers:</span>
              <span className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-extrabold ${
                alwaysRevealAnswers ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}>
                {alwaysRevealAnswers ? 'ON' : 'OFF'}
              </span>
            </button>
            <span className="text-xs sm:text-sm text-slate-400 font-mono font-bold">
              {totalQuestions} Qs
            </span>
          </div>

        </div>
      </div>
    </header>
  );
};


