import React, { useState } from 'react';
import { ReckonerTab, Question } from '../../types';
import { ComparisonTables } from './ComparisonTables';
import { LogicFlows } from './LogicFlows';
import { CodeSnippets } from './CodeSnippets';
import { ExamGoldenRules } from './ExamGoldenRules';
import { DomainCheatSheets } from './DomainCheatSheets';
import { 
  Table, 
  GitFork, 
  Code, 
  Lightbulb, 
  BookOpen, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ReadyReckonerHubProps {
  questions: Question[];
  onSelectQuestion: (questionId: number) => void;
  onOpenVisualizations?: () => void;
  onOpenPractice?: () => void;
}

export const ReadyReckonerHub: React.FC<ReadyReckonerHubProps> = ({
  onSelectQuestion,
  onOpenVisualizations,
  onOpenPractice
}) => {
  const [activeTab, setActiveTab] = useState<ReckonerTab>('comparison-tables');

  const tabs = [
    {
      id: 'comparison-tables' as ReckonerTab,
      label: 'Comparison Tables & Differences',
      icon: Table,
      badge: '6 Core Tables',
      description: 'Bedrock vs SageMaker, RAG vs Fine-Tuning, Pre-built AI, Governance Matrix'
    },
    {
      id: 'logic-flows' as ReckonerTab,
      label: 'Decision Logic Flows',
      icon: GitFork,
      badge: 'Interactive Trees',
      description: 'Step-by-step service selectors, customization pathways & troubleshooting'
    },
    {
      id: 'code-snippets' as ReckonerTab,
      label: 'AWS SDK & Boto3 Snippets',
      icon: Code,
      badge: 'Production APIs',
      description: 'Bedrock InvokeModel, Knowledge Bases, Guardrails, Textract & Comprehend'
    },
    {
      id: 'exam-golden-rules' as ReckonerTab,
      label: 'Exam Traps & Golden Rules',
      icon: Lightbulb,
      badge: 'Mnemonics',
      description: 'Recall vs Precision, AI Cards vs Model Cards, Temperature & Bedrock Privacy'
    },
    {
      id: 'domain-cheat-sheets' as ReckonerTab,
      label: 'Domain-by-Domain Cheat Sheets',
      icon: ShieldCheck,
      badge: 'All 5 Domains',
      description: 'High-frequency exam patterns, checklists, and weighting breakdown'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-6 space-y-6">
      
      {/* Ready Reckoner Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-amber-400">
                  AIF-C01 High-Yield Reference Guide
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  Exam Ready Reckoner & Memory Hub
                </h1>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              {onOpenPractice && (
                <button
                  onClick={onOpenPractice}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Practice MCQs</span>
                </button>
              )}
              {onOpenVisualizations && (
                <button
                  onClick={onOpenVisualizations}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Architecture Visualizers</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            High-density summary tables, key differences, interactive logic flowcharts, production Boto3 code payloads, and high-yield memory rules engineered for quick revision and maximum exam retention.
          </p>

          {/* Module Selector Navigation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/10 border-amber-500/80 text-white shadow-lg ring-2 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  </div>
                  <span className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Module Content Switcher */}
      <div>
        {activeTab === 'comparison-tables' && (
          <ComparisonTables onSelectQuestion={onSelectQuestion} />
        )}
        {activeTab === 'logic-flows' && (
          <LogicFlows onSelectQuestion={onSelectQuestion} />
        )}
        {activeTab === 'code-snippets' && (
          <CodeSnippets onSelectQuestion={onSelectQuestion} />
        )}
        {activeTab === 'exam-golden-rules' && (
          <ExamGoldenRules onSelectQuestion={onSelectQuestion} />
        )}
        {activeTab === 'domain-cheat-sheets' && (
          <DomainCheatSheets onSelectQuestion={onSelectQuestion} />
        )}
      </div>

    </div>
  );
};
