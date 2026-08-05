import React, { useState } from 'react';
import { 
  ShieldCheck, Brain, Route, Terminal, Globe, Activity, 
  Sparkles, Lock, Eye, CheckCircle2, AlertTriangle, Layers, BookOpen
} from 'lucide-react';

interface BedrockArchitectureVisualizerProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const BedrockArchitectureVisualizer: React.FC<BedrockArchitectureVisualizerProps> = ({ onSelectQuestion }) => {
  const [activeTab, setActiveTab] = useState<'guardrails' | 'routing' | 'agentcore'>('guardrails');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-md font-bold">
                Amazon Bedrock Deep Dive
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-md">
                Guardrails, Routing & AgentCore
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
              Amazon Bedrock Managed Architecture & Security Suite
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-3xl">
              Amazon Bedrock provides unified serverless API access to multi-provider foundation models with enterprise-grade safety, intelligent prompt routing, and AgentCore services.
            </p>
          </div>

          {/* Sub-nav Tab Selector */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto flex-wrap">
            <button
              onClick={() => setActiveTab('guardrails')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'guardrails'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bedrock Guardrails
            </button>
            <button
              onClick={() => setActiveTab('routing')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'routing'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Intelligent Prompt Routing
            </button>
            <button
              onClick={() => setActiveTab('agentcore')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'agentcore'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bedrock AgentCore
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Bedrock Guardrails Architecture */}
      {activeTab === 'guardrails' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Amazon Bedrock Guardrails: 5 Core Safety Layers
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Exam Questions:</span>
                {[443, 442, 431, 425].map((qId) => (
                  <button
                    key={qId}
                    onClick={() => onSelectQuestion?.(qId)}
                    className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500 hover:text-slate-950 transition-colors"
                  >
                    Q{qId}
                  </button>
                ))}
              </div>
            </div>

            {/* 5 Guardrails Policies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">Layer 1</span>
                  <span className="text-xs text-slate-400">Input & Output</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">Denied Topics</h4>
                <p className="text-xs text-slate-300">
                  Define specific undesirable topics using natural language (e.g., "Do not provide financial investment or medical prescription advice"). Guardrails block requests matching these definitions.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Layer 2</span>
                  <span className="text-xs text-slate-400">Threshold Based</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">Content Filters</h4>
                <p className="text-xs text-slate-300">
                  Configure filtering strength (NONE, LOW, MEDIUM, HIGH) across 6 harmful categories: Hate speech, Insults, Sexual content, Violence, Misconduct, and Prompt Attack (Jailbreaks).
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded">Layer 3</span>
                  <span className="text-xs text-slate-400">Compliance & Privacy</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">Sensitive Information (PII)</h4>
                <p className="text-xs text-slate-300">
                  Automatically detect, block, or mask (anonymize) personally identifiable information (PII) such as Social Security Numbers, Credit Cards, Names, Emails, and custom regex patterns.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded">Layer 4</span>
                  <span className="text-xs text-slate-400">Custom Vocabulary</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">Word Filters</h4>
                <p className="text-xs text-slate-300">
                  Block exact custom words/phrases (e.g., competitor brand names, proprietary internal code names) or enable pre-built global profanity filter lists.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">Layer 5 (RAG Grounding)</span>
                  <span className="text-xs text-slate-400">Hallucination Mitigation</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">Contextual Grounding Check</h4>
                <p className="text-xs text-slate-300">
                  Evaluates the generated model response against the retrieved source reference to detect factual hallucinations (Faithfulness) and verify user query relevance before delivering the answer.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Intelligent Prompt Routing */}
      {activeTab === 'routing' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Route className="w-5 h-5 text-amber-400" />
                Intelligent Prompt Routing (Question 429 Exam Topic)
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Exam Question:</span>
                <button
                  onClick={() => onSelectQuestion?.(429)}
                  className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500 hover:text-slate-950 transition-colors"
                >
                  Q429
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                <strong>How it works:</strong> Bedrock provides a <em>single serverless endpoint</em> that dynamically inspects each incoming user prompt, predicts required model complexity, and routes the request between <strong>two supported models in the same family</strong> (e.g. Anthropic Claude 3.5 Haiku vs Claude 3.5 Sonnet) to balance response quality and minimize token cost.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold">Fast & Low Cost Model</span>
                  <h4 className="text-sm font-bold text-white">Simple / Standard Prompts</h4>
                  <p className="text-xs text-slate-300">
                    Short summarization, basic categorization, straightforward FAQ lookup ➔ Routed automatically to smaller, cheaper model (e.g. Claude Haiku / Nova Micro).
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-mono text-amber-400 font-bold">High Reasoning Model</span>
                  <h4 className="text-sm font-bold text-white">Complex / Reasoning Prompts</h4>
                  <p className="text-xs text-slate-300">
                    Multi-step coding, dense logical reasoning, complex mathematical extraction ➔ Routed automatically to larger model (e.g. Claude Sonnet / Nova Pro).
                  </p>
                </div>
              </div>

              <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 text-xs sm:text-sm text-amber-200">
                <strong>Exam Clue:</strong> "Single serverless endpoint that automatically chooses between smaller and larger model in the same model family to balance quality and cost" ➔ <strong>Intelligent Prompt Routing</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Bedrock AgentCore Services */}
      {activeTab === 'agentcore' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                Amazon Bedrock AgentCore Capabilities (Question 436 Exam Topic)
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Exam Question:</span>
                <button
                  onClick={() => onSelectQuestion?.(436)}
                  className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500 hover:text-slate-950 transition-colors"
                >
                  Q436
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">AgentCore Observability</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Provides detailed execution trace paths, visualization of tool invocation steps, and production performance monitoring for multi-agent workflows.
                </p>
                <div className="text-[11px] font-mono text-blue-300 bg-blue-950/60 p-2 rounded border border-blue-900">
                  Purpose: Trace, debug, and monitor agent execution paths in production.
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Terminal className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">AgentCore Code Interpreter</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Enables an AI agent to securely generate and execute Python code in an isolated managed sandbox environment for complex numerical calculations, charting, and data analysis.
                </p>
                <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 p-2 rounded border border-emerald-900">
                  Purpose: Securely write and run Python calculations in an isolated sandbox.
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">AgentCore Browser</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Provides a managed, isolated browser environment for autonomous AI agents to interact with web pages, fill form fields, and navigate web applications safely.
                </p>
                <div className="text-[11px] font-mono text-purple-300 bg-purple-950/60 p-2 rounded border border-purple-900">
                  Purpose: Isolated browser environment for web app interaction.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
