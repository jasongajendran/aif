import React, { useState, useRef } from 'react';
import { domainOverviews, DomainOverview } from './reckonerData';
import { 
  BookOpen, Layers, CheckCircle2, AlertCircle, Award, 
  Sparkles, ChevronRight, Check, Target, ShieldCheck,
  ChevronLeft, ArrowLeft, ArrowRight
} from 'lucide-react';

interface DomainCheatSheetsProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const DomainCheatSheets: React.FC<DomainCheatSheetsProps> = ({ onSelectQuestion }) => {
  const [selectedDomainId, setSelectedDomainId] = useState<number>(1);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const domainContainerRef = useRef<HTMLDivElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const activeIndex = domainOverviews.findIndex(d => d.domainId === selectedDomainId);
  const activeDomain = (activeIndex >= 0 ? domainOverviews[activeIndex] : domainOverviews[0]) || domainOverviews[0];

  const prevDomain = activeIndex > 0 ? domainOverviews[activeIndex - 1] : null;
  const nextDomain = activeIndex < domainOverviews.length - 1 ? domainOverviews[activeIndex + 1] : null;

  const handleSelectDomain = (domainId: number) => {
    setSelectedDomainId(domainId);
    if (domainContainerRef.current) {
      domainContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const toggleTopic = (topic: string) => {
    setCompletedTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      tabsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const completedCount = activeDomain.coreConcepts.filter(c => completedTopics[c]).length;
  const progressPct = ((completedCount / activeDomain.coreConcepts.length) * 100).toFixed(0);

  return (
    <div className="space-y-5" ref={domainContainerRef}>
      
      {/* Domain Navigation Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2 sm:p-2.5 flex items-center justify-between gap-2 shadow-lg">
        
        <button
          onClick={() => scrollTabs('left')}
          className="w-7 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 hidden sm:flex"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={tabsScrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 px-1 w-full"
        >
          {domainOverviews.map((domain) => {
            const isActive = domain.domainId === activeDomain.domainId;
            return (
              <button
                key={domain.domainId}
                onClick={() => handleSelectDomain(domain.domainId)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border flex items-center space-x-2 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Domain {domain.domainId}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-850 text-slate-400'
                }`}>
                  {domain.weight.split('(')[0].trim()}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollTabs('right')}
          className="w-7 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 hidden sm:flex"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Prev / Next Domain arrows */}
        <div className="flex items-center space-x-1 shrink-0 pl-1 border-l border-slate-800">
          <button
            onClick={() => prevDomain && handleSelectDomain(prevDomain.domainId)}
            disabled={!prevDomain}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              prevDomain
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
            }`}
            title={prevDomain ? `Previous: Domain ${prevDomain.domainId}` : 'No previous domain'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono text-slate-400 font-bold px-1 hidden md:inline">
            {activeIndex + 1}/{domainOverviews.length}
          </span>

          <button
            onClick={() => nextDomain && handleSelectDomain(nextDomain.domainId)}
            disabled={!nextDomain}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              nextDomain
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
            }`}
            title={nextDomain ? `Next: Domain ${nextDomain.domainId}` : 'No next domain'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Active Domain Detail Card */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
        
        {/* Banner */}
        <div className="p-5 sm:p-7 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-850">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-black uppercase">
                AWS AIF-C01 Domain Breakdown
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                Exam Weight: {activeDomain.weight}
              </span>
            </div>

            {/* Checklist Progress */}
            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Mastery Progress:</span>
              <span className="font-mono font-bold text-amber-400">{completedCount}/{activeDomain.coreConcepts.length}</span>
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Domain {activeDomain.domainId}: {activeDomain.name}
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Core Concept Checklist */}
          <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-mono">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Core Concept Checklist</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Click to check</span>
            </div>

            <div className="space-y-2">
              {activeDomain.coreConcepts.map((concept, idx) => {
                const isChecked = !!completedTopics[concept];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleTopic(concept)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 text-xs ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 border ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={isChecked ? 'line-through opacity-80' : 'font-medium'}>
                      {concept}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: High-Frequency Exam Patterns */}
          <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 pb-2 border-b border-slate-800 font-mono">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>High-Frequency Exam Patterns</span>
            </h3>

            <div className="space-y-2.5">
              {activeDomain.topExamPatterns.map((pattern, idx) => (
                <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Pattern #{idx + 1}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{pattern}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Essential AWS Services */}
          <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 pb-2 border-b border-slate-800 font-mono">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Key AWS Services Tested</span>
            </h3>

            <div className="flex flex-wrap gap-2 pt-1">
              {activeDomain.keyServices.map((svc, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-200 flex items-center space-x-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>{svc}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 text-xs text-amber-200 mt-4">
              <strong>Domain Mastery Tip:</strong> Ensure you understand when to combine pre-built AWS services with Bedrock or SageMaker rather than training custom models from scratch.
            </div>
          </div>

        </div>

        {/* Bottom Domain Step Navigator */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
          <div>
            {prevDomain ? (
              <button
                onClick={() => handleSelectDomain(prevDomain.domainId)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="line-clamp-1">Prev: Domain {prevDomain.domainId}</span>
              </button>
            ) : (
              <span className="text-xs font-mono text-slate-600">First domain</span>
            )}
          </div>

          <div className="text-xs font-mono text-slate-400 font-bold hidden sm:block">
            Domain {activeIndex + 1} of {domainOverviews.length}
          </div>

          <div>
            {nextDomain ? (
              <button
                onClick={() => handleSelectDomain(nextDomain.domainId)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2"
              >
                <span className="line-clamp-1">Next: Domain {nextDomain.domainId}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-mono text-slate-600">Last domain</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
