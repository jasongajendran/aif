import React, { useState } from 'react';
import { HelpCircle, Info, X } from 'lucide-react';

interface ExplainTermProps {
  term: string;
  expansion?: string;
  definition: string;
  badgeColor?: string;
  children?: React.ReactNode;
}

export const ExplainTerm: React.FC<ExplainTermProps> = ({
  term,
  expansion,
  definition,
  badgeColor = 'amber',
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span className="relative inline-flex items-center align-baseline">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 mx-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-medium cursor-help transition-colors"
        title="Click to learn what this term means"
      >
        <span>{children || term}</span>
        <HelpCircle className="w-2.5 h-2.5 opacity-70 shrink-0 ml-0.5" />
      </button>

      {showTooltip && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 bg-slate-900 border-2 border-amber-500/80 rounded-xl p-3 shadow-2xl text-left text-xs text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-start justify-between gap-1 pb-1.5 mb-1.5 border-b border-slate-800">
            <div className="min-w-0">
              <span className="font-bold text-amber-300 block">{term}</span>
              {expansion && <span className="text-[10px] text-slate-400 block font-mono">{expansion}</span>}
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-slate-200 text-[11px] leading-relaxed">
            {definition}
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </span>
  );
};
