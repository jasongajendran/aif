import React, { useState, useRef } from 'react';
import { domainOverviews } from './reckonerData';
import { 
  Layers, Award, 
  Sparkles, Check, Target
} from 'lucide-react';

interface DomainCheatSheetsProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const DomainCheatSheets: React.FC<DomainCheatSheetsProps> = () => {
  const [selectedDomainId, setSelectedDomainId] = useState<number>(1);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const domainContainerRef = useRef<HTMLDivElement>(null);

  const activeIndex = domainOverviews.findIndex(d => d.domainId === selectedDomainId);
  const activeDomain = (activeIndex >= 0 ? domainOverviews[activeIndex] : domainOverviews[0]) || domainOverviews[0];

  const handleSelectDomain = (domainId: number) => {
    setSelectedDomainId(domainId);
    if (domainContainerRef.current) {
      domainContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const toggleTopic = (topic: string) => {
    setCompletedTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
  };

  const completedCount = activeDomain.coreConcepts.filter(c => completedTopics[c]).length;
  const progressPct = ((completedCount / activeDomain.coreConcepts.length) * 100).toFixed(0);

  return (
    <div className="space-y-4" ref={domainContainerRef}>
      
      {/* Domain Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {domainOverviews.map((domain) => {
          const isActive = domain.domainId === activeDomain.domainId;
          return (
            <button
              key={domain.domainId}
              onClick={() => handleSelectDomain(domain.domainId)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-2 shrink-0 ${
                isActive
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm ring-1 ring-amber-500/50'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Domain {domain.domainId}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
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
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-850">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold uppercase">
                AWS AIF-C01 Breakdown
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                Exam Weight: {activeDomain.weight}
              </span>
            </div>

            {/* Checklist Progress */}
            <div className="flex items-center space-x-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Mastery:</span>
              <span className="font-mono font-bold text-amber-400">{completedCount}/{activeDomain.coreConcepts.length}</span>
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Domain {activeDomain.domainId}: {activeDomain.name}
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Column 1: Core Concept Checklist */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-mono">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Core Concept Checklist</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Click to check</span>
            </div>

            <div className="space-y-1.5">
              {activeDomain.coreConcepts.map((concept, idx) => {
                const isChecked = !!completedTopics[concept];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleTopic(concept)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start space-x-2.5 text-xs ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
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
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 pb-2 border-b border-slate-800 font-mono">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>High-Frequency Exam Patterns</span>
            </h3>

            <div className="space-y-2">
              {activeDomain.topExamPatterns.map((pattern, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900/80 border border-slate-800/80 rounded-lg space-y-1 text-xs">
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
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 pb-2 border-b border-slate-800 font-mono">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Key AWS Services Tested</span>
            </h3>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeDomain.keyServices.map((svc, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-200 flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{svc}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-2.5 text-xs text-amber-200 mt-3">
              <strong>Domain Mastery Tip:</strong> Understand when to combine pre-built AWS services with Bedrock or SageMaker rather than training custom models from scratch.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
