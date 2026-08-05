import React, { useState } from 'react';
import { logicFlows, LogicFlow, LogicFlowNode } from './reckonerData';
import { GitFork, ArrowRight, RotateCcw, CheckCircle, Sparkles, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';

interface LogicFlowsProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const LogicFlows: React.FC<LogicFlowsProps> = ({ onSelectQuestion }) => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(logicFlows[0].id);
  const [currentNodeId, setCurrentNodeId] = useState<string>(logicFlows[0].rootNodeId);
  const [history, setHistory] = useState<{ nodeId: string; optionIndex: number }[]>([]);

  const activeFlow = logicFlows.find(f => f.id === selectedFlowId) || logicFlows[0];
  const currentNode: LogicFlowNode = activeFlow.nodes[currentNodeId] || activeFlow.nodes[activeFlow.rootNodeId];

  const handleSelectFlow = (flowId: string) => {
    const flow = logicFlows.find(f => f.id === flowId) || logicFlows[0];
    setSelectedFlowId(flowId);
    setCurrentNodeId(flow.rootNodeId);
    setHistory([]);
  };

  const handleSelectOption = (optionIndex: number, nextNodeId?: string) => {
    setHistory((prev) => [...prev, { nodeId: currentNodeId, optionIndex }]);
    if (nextNodeId && activeFlow.nodes[nextNodeId]) {
      setCurrentNodeId(nextNodeId);
    }
  };

  const handleReset = () => {
    setCurrentNodeId(activeFlow.rootNodeId);
    setHistory([]);
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
    <div className="space-y-6">
      
      {/* Flow Selector Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-md">
        <div className="flex items-center space-x-2">
          <GitFork className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold text-white">Interactive Decision Logic Flows</span>
        </div>

        {/* Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {logicFlows.map((flow) => {
            const isSelected = flow.id === activeFlow.id;
            return (
              <button
                key={flow.id}
                onClick={() => handleSelectFlow(flow.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {flow.title.split('Logic Flow')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Flow Container */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Flow Top Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase">
                {activeFlow.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Step {history.length + 1}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {activeFlow.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {activeFlow.description}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {history.length > 0 && (
              <button
                onClick={handleStepBack}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center space-x-1"
              >
                <span>Back</span>
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center space-x-1"
              title="Reset decision flow to beginning"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Breadcrumbs of Decisions Made */}
        {history.length > 0 && (
          <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs text-slate-400">
            <span className="font-semibold text-slate-500 shrink-0">Your Path:</span>
            {history.map((step, idx) => {
              const node = activeFlow.nodes[step.nodeId];
              const option = node?.options[step.optionIndex];
              return (
                <React.Fragment key={idx}>
                  <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-lg shrink-0">
                    <span className="text-amber-400 font-bold">#{idx + 1}</span>
                    <span className="text-slate-200 max-w-[200px] truncate">{option?.label}</span>
                  </div>
                  {idx < history.length && <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Current Node Question & Decision Options */}
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Question Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>{currentNode.title}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentNode.question}
            </h3>
          </div>

          {/* Decision Choices */}
          <div className="grid grid-cols-1 gap-4">
            {currentNode.options.map((option, optIdx) => {
              const isRecommendation = !!option.recommendation;

              return (
                <div
                  key={optIdx}
                  className={`rounded-2xl border transition-all ${
                    isRecommendation
                      ? 'bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border-emerald-500/40 p-5 sm:p-6'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-amber-500/60 p-5 cursor-pointer group'
                  }`}
                  onClick={() => {
                    if (!isRecommendation) {
                      handleSelectOption(optIdx, option.nextNodeId);
                    }
                  }}
                >
                  {/* Non-terminal choice */}
                  {!isRecommendation ? (
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                            {option.label}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 pl-8 leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/50 transition-all shrink-0 mt-1">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    /* Recommendation Box */
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                              Prescribed Architecture & Service
                            </span>
                            <h4 className="text-base sm:text-lg font-black text-white">
                              {option.recommendation.service}
                            </h4>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-bold font-mono">
                          Target Match
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                        <strong className="text-white">Why this service: </strong>
                        {option.recommendation.reason}
                      </p>

                      {/* Exam Tip Callout */}
                      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-amber-200 leading-relaxed">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-300">Exam Clue / Trigger: </strong>
                          {option.recommendation.examTip}
                        </div>
                      </div>

                      {/* Linked Questions */}
                      {option.recommendation.targetQuestionIds && option.recommendation.targetQuestionIds.length > 0 && onSelectQuestion && (
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                          <span className="text-xs text-slate-400">
                            Practice with real exam questions:
                          </span>
                          <div className="flex items-center space-x-2">
                            {option.recommendation.targetQuestionIds.map((qId) => (
                              <button
                                key={qId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectQuestion(qId);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-xs font-bold font-mono text-amber-300 transition-all flex items-center space-x-1"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>Q#{qId}</span>
                              </button>
                            ))}
                          </div>
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

      {/* Decision Tree Quick Summary Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Decision Logic Flow Quick Index</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <h5 className="font-bold text-amber-300">Pre-built AI</h5>
            <p className="text-slate-400">Zero ML training. Call REST API for document OCR, PII redaction, facial recognition, or transcription.</p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <h5 className="font-bold text-emerald-300">Amazon Bedrock</h5>
            <p className="text-slate-400">Serverless Foundation Models. Best for RAG, Knowledge Bases, prompt engineering, and serverless fine-tuning.</p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <h5 className="font-bold text-cyan-300">Amazon SageMaker</h5>
            <p className="text-slate-400">Custom ML lifecycle. Full compute control, custom Docker containers, Autopilot, Clarify, and Model Monitor.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
