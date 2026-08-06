import React, { useState, useRef } from 'react';
import { logicFlows, LogicFlow, LogicFlowNode } from './reckonerData';
import { 
  GitFork, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, Sparkles, 
  BookOpen, AlertCircle, HelpCircle, Layers, Compass, ArrowDown,
  ChevronLeft, ChevronRight, ChevronRight as BreadcrumbSeparator
} from 'lucide-react';

interface LogicFlowsProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const LogicFlows: React.FC<LogicFlowsProps> = ({ onSelectQuestion }) => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(logicFlows[0].id);
  const [currentNodeId, setCurrentNodeId] = useState<string>(logicFlows[0].rootNodeId);
  const [history, setHistory] = useState<{ nodeId: string; optionLabel: string; question: string }[]>([]);
  const flowContainerRef = useRef<HTMLDivElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const activeIndex = logicFlows.findIndex(f => f.id === selectedFlowId);
  const activeFlow = (activeIndex >= 0 ? logicFlows[activeIndex] : logicFlows[0]) || logicFlows[0];
  const currentNode: LogicFlowNode = activeFlow.nodes[currentNodeId] || activeFlow.nodes[activeFlow.rootNodeId];

  const prevFlow = activeIndex > 0 ? logicFlows[activeIndex - 1] : null;
  const nextFlow = activeIndex < logicFlows.length - 1 ? logicFlows[activeIndex + 1] : null;

  const handleSelectFlow = (flowId: string) => {
    const flow = logicFlows.find(f => f.id === flowId) || logicFlows[0];
    setSelectedFlowId(flowId);
    setCurrentNodeId(flow.rootNodeId);
    setHistory([]);
    if (flowContainerRef.current) {
      flowContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleSelectOption = (option: { label: string; description: string; nextNodeId?: string; recommendation?: any }) => {
    setHistory((prev) => [
      ...prev,
      {
        nodeId: currentNodeId,
        optionLabel: option.label,
        question: currentNode.question,
      },
    ]);
    if (option.nextNodeId && activeFlow.nodes[option.nextNodeId]) {
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleReset = () => {
    setCurrentNodeId(activeFlow.rootNodeId);
    setHistory([]);
  };

  const handleJumpToHistoryStep = (stepIndex: number) => {
    if (stepIndex < 0) {
      handleReset();
      return;
    }
    const targetNodeId = history[stepIndex].nodeId;
    setHistory(history.slice(0, stepIndex));
    setCurrentNodeId(targetNodeId);
  };

  const handleStepBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const lastStep = newHistory.pop();
    setHistory(newHistory);
    if (lastStep) {
      setCurrentNodeId(lastStep.nodeId);
    }
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      tabsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-5" ref={flowContainerRef}>
      
      {/* Flow Selector Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 sm:p-4 rounded-3xl flex items-center justify-between gap-3 shadow-xl">
        
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <GitFork className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-bold text-white block">Decision Logic Trees</span>
            <span className="text-[10px] text-slate-400 font-mono">{logicFlows.length} Exam Pathways</span>
          </div>
        </div>

        {/* Left Scroll */}
        <button
          onClick={() => scrollTabs('left')}
          className="w-7 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 hidden md:flex"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Selector Tabs */}
        <div
          ref={tabsScrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
        >
          {logicFlows.map((flow, idx) => {
            const isSelected = flow.id === activeFlow.id;
            return (
              <button
                key={flow.id}
                onClick={() => handleSelectFlow(flow.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-2 shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/30 font-black'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                  isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <span>{flow.title.split('Logic Flow')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll */}
        <button
          onClick={() => scrollTabs('right')}
          className="w-7 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 hidden md:flex"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Prev / Next Flow Arrows */}
        <div className="flex items-center space-x-1 shrink-0 pl-2 border-l border-slate-800">
          <button
            onClick={() => prevFlow && handleSelectFlow(prevFlow.id)}
            disabled={!prevFlow}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              prevFlow
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
            }`}
            title={prevFlow ? `Previous: ${prevFlow.title}` : 'No previous flow'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono text-slate-400 font-bold px-1 hidden sm:inline">
            {activeIndex + 1}/{logicFlows.length}
          </span>

          <button
            onClick={() => nextFlow && handleSelectFlow(nextFlow.id)}
            disabled={!nextFlow}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              nextFlow
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
            }`}
            title={nextFlow ? `Next: ${nextFlow.title}` : 'No next flow'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Flow Container */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
        
        {/* Flow Top Bar */}
        <div className="p-5 sm:p-7 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-black uppercase">
                {activeFlow.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Flow {activeIndex + 1} of {logicFlows.length} • Step {history.length + 1}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {activeFlow.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-3xl">
              {activeFlow.description}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {history.length > 0 && (
              <button
                onClick={handleStepBack}
                className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Step Back</span>
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center space-x-1.5"
              title="Reset decision flow to beginning"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Restart Flow</span>
            </button>
          </div>
        </div>

        {/* Step Breadcrumb Trail */}
        {history.length > 0 && (
          <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
            <button
              onClick={handleReset}
              className="text-amber-400 hover:underline font-bold shrink-0"
            >
              Start
            </button>
            {history.map((step, idx) => (
              <React.Fragment key={idx}>
                <BreadcrumbSeparator className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <button
                  onClick={() => handleJumpToHistoryStep(idx)}
                  className="text-slate-300 hover:text-white hover:underline whitespace-nowrap shrink-0 max-w-[200px] truncate"
                  title={`Jump back to: ${step.optionLabel}`}
                >
                  Step {idx + 1}: {step.optionLabel}
                </button>
              </React.Fragment>
            ))}
            <BreadcrumbSeparator className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-amber-400 font-bold whitespace-nowrap shrink-0">
              Current Step
            </span>
          </div>
        )}

        {/* Decision Step Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Decision Point {history.length + 1}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {currentNode.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentNode.options.map((option, idx) => {
              const isTerminal = !!option.recommendation;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 text-left group ${
                    isTerminal
                      ? 'bg-gradient-to-br from-emerald-950/30 via-slate-950 to-slate-950 border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/10 hover:shadow-xl'
                      : 'bg-slate-950 border-slate-800 hover:border-amber-500/60 hover:bg-slate-850 hover:shadow-amber-500/5 hover:shadow-xl'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                        isTerminal
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {isTerminal ? 'Final Recommendation' : `Pathway Option ${idx + 1}`}
                      </span>

                      <div className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center text-slate-400 transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {option.label}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  {/* Recommendation Card if Terminal */}
                  {option.recommendation && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/20 bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/30 space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Winning Service: {option.recommendation.service}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {option.recommendation.reason}
                      </p>
                      <div className="bg-slate-950/80 p-2.5 rounded-lg text-xs text-amber-200 font-medium">
                        <strong>Exam Clue:</strong> {option.recommendation.examTip}
                      </div>
                      {option.recommendation.targetQuestionIds && option.recommendation.targetQuestionIds.length > 0 && onSelectQuestion && (
                        <div className="flex items-center space-x-2 pt-1">
                          <span className="text-[11px] text-slate-400">Related MCQs:</span>
                          {option.recommendation.targetQuestionIds.map((qId: number) => (
                            <button
                              key={qId}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectQuestion(qId);
                              }}
                              className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 text-xs font-mono font-bold transition-all"
                            >
                              Q#{qId}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Flow Step Navigator */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
          <div>
            {prevFlow ? (
              <button
                onClick={() => handleSelectFlow(prevFlow.id)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="line-clamp-1">Prev Flow: {prevFlow.title.split('Logic Flow')[0].trim()}</span>
              </button>
            ) : (
              <span className="text-xs font-mono text-slate-600">First decision tree</span>
            )}
          </div>

          <div className="text-xs font-mono text-slate-400 font-bold hidden sm:block">
            Flow {activeIndex + 1} of {logicFlows.length}
          </div>

          <div>
            {nextFlow ? (
              <button
                onClick={() => handleSelectFlow(nextFlow.id)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2"
              >
                <span className="line-clamp-1">Next Flow: {nextFlow.title.split('Logic Flow')[0].trim()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-mono text-slate-600">Last decision tree</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
