import React, { useState } from 'react';
import { domainOverviews, DomainOverview } from './reckonerData';
import { BookOpen, Layers, CheckCircle2, AlertCircle, Award, Sparkles, ChevronRight } from 'lucide-react';

interface DomainCheatSheetsProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const DomainCheatSheets: React.FC<DomainCheatSheetsProps> = () => {
  const [selectedDomainId, setSelectedDomainId] = useState<number>(1);

  const activeDomain = domainOverviews.find(d => d.domainId === selectedDomainId) || domainOverviews[0];

  return (
    <div className="space-y-6">
      
      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {domainOverviews.map((domain) => {
          const isActive = domain.domainId === activeDomain.domainId;
          return (
            <button
              key={domain.domainId}
              onClick={() => setSelectedDomainId(domain.domainId)}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border flex items-center space-x-2 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Domain {domain.domainId}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {domain.weight.split('(')[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Domain Detail Card */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Banner */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-850">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase">
              AWS AIF-C01 Exam Guide
            </span>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {activeDomain.weight}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {activeDomain.name}
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Core Concepts Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Must-Know Core Concepts</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {activeDomain.coreConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-start space-x-2.5 text-xs sm:text-sm text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Recurring Exam Question Patterns */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>High-Frequency Exam Question Traps & Patterns</span>
            </h3>
            <div className="space-y-2.5">
              {activeDomain.topExamPatterns.map((pattern, idx) => (
                <div
                  key={idx}
                  className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3.5 flex items-start space-x-3 text-xs sm:text-sm text-amber-200"
                >
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="text-amber-300 font-bold">Exam Pattern #{idx + 1}: </strong>
                    {pattern}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key AWS Services */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Primary AWS Services for this Domain</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeDomain.keyServices.map((service, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-200"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
