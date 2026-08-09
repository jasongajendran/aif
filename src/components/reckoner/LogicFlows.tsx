import React, { useState, useRef } from 'react';
import { logicFlows, LogicFlowNode } from './reckonerData';
import { 
  GitFork, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, 
  Compass, ChevronRight as BreadcrumbSeparator
} from 'lucide-react';
import { NavigationOrigin } from '../../types';

interface LogicFlowsProps {
  onSelectQuestion?: (questionId: number, origin?: NavigationOrigin) => void;
}

export const LogicFlows: React.FC<LogicFlowsProps> = ({ onSelectQuestion }) => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(logicFlows[0].id);
  const [currentNodeId, setCurrentNodeId] = useState<string>(logicFlows[0].rootNodeId);
  const [history, setHistory] = useState<{ nodeId: string; optionLabel: string; question: string }[]>([]);
  const flowContainerRef = useRef<HTMLDivElement>(null);

  const activeIndex = logicFlows.findIndex(f => f.id === selectedFlowId);
  const activeFlow = (activeIndex >= 0 ? logicFlows[activeIndex] : logicFlows[0]) || logicFlows[0];
  const currentNode: LogicFlowNode = activeFlow.nodes[currentNodeId] || activeFlow.nodes[activeFlow.rootNodeId];

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

  return (
    <div className="space-y-4" ref={flowContainerRef}>
      
      {/* Flow Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {logicFlows.map((flow, idx) => {
          const isSelected = flow.id === activeFlow.id;
          return (
            <button
              key={flow.id}
              onClick={() => handleSelectFlow(flow.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-1.5 shrink-0 ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm ring-1 ring-amber-500/50'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{flow.title.split('Logic Flow')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Main Flow Container */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Flow Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold uppercase">
                {activeFlow.badge}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              {activeFlow.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {activeFlow.description}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {history.length > 0 && (
              <button
                onClick={handleStepBack}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Step Back</span>
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center space-x-1.5"
              title="Reset decision flow to beginning"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Step Breadcrumb Trail */}
        {history.length > 0 && (
          <div className="px-4 sm:px-6 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
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
                  className="text-slate-300 hover:text-white hover:underline whitespace-nowrap shrink-0 max-w-[180px] truncate"
                  title={`Jump back to: ${step.optionLabel}`}
                >
                  {step.optionLabel}
                </button>
              </React.Fragment>
            ))}
            <BreadcrumbSeparator className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-amber-400 font-bold whitespace-nowrap shrink-0">
              Current
            </span>
          </div>
        )}

        {/* Decision Step Body */}
        <div className="p-4 sm:p-6 space-y-4">
          
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-amber-400 text-[11px] font-mono font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Decision Question</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {currentNode.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {currentNode.options.map((option, idx) => {
              const isTerminal = !!option.recommendation;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 text-left group ${
                    isTerminal
                      ? 'bg-gradient-to-br from-emerald-950/30 via-slate-950 to-slate-950 border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/10 hover:shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-amber-500/60 hover:bg-slate-850 hover:shadow-amber-500/5 hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isTerminal
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {isTerminal ? 'Recommendation' : `Option ${idx + 1}`}
                      </span>

                      <div className="w-5 h-5 rounded-full bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center text-slate-400 transition-colors">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {option.label}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  {/* Recommendation Card if Terminal */}
                  {option.recommendation && (
                    <div className="mt-2 pt-2 border-t border-emerald-500/20 bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/30 space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Winning Service: {option.recommendation.service}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {option.recommendation.reason}
                      </p>
                      <div className="bg-slate-950/80 p-2 rounded text-[11px] text-amber-200 font-medium">
                        <strong>Exam Clue:</strong> {option.recommendation.examTip}
                      </div>
                      {option.recommendation.targetQuestionIds && option.recommendation.targetQuestionIds.length > 0 && onSelectQuestion && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400">Related MCQs:</span>
                          {option.recommendation.targetQuestionIds.map((qId: number) => (
                            <button
                              key={qId}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectQuestion(qId, {
                                  view: 'ready-reckoner',
                                  tabId: 'logic-flows',
                                  sectionTitle: `Decision Logic Flow: ${activeFlow.title}`,
                                  subItemId: selectedFlowId,
                                });
                              }}
                              className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 text-[10px] font-mono font-bold transition-all flex items-center space-x-1 border border-amber-500/30"
                            >
                              <span>Q#{qId}</span>
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

      </div>

    </div>
  );
};
