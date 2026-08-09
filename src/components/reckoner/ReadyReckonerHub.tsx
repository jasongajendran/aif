import React, { useState, useRef, useEffect } from 'react';
import { ReckonerTab, Question, NavigationOrigin } from '../../types';
import { ComparisonTables } from './ComparisonTables';
import { LogicFlows } from './LogicFlows';
import { CodeSnippets } from './CodeSnippets';
import { ExamGoldenRules } from './ExamGoldenRules';
import { DomainCheatSheets } from './DomainCheatSheets';
import { AITerminologyGlossary } from '../AITerminologyGlossary';
import { 
  Table, 
  GitFork, 
  Code, 
  Lightbulb, 
  BookOpen, 
  Sparkles, 
  Layers, 
  ShieldCheck
} from 'lucide-react';

interface ReadyReckonerHubProps {
  questions: Question[];
  onSelectQuestion: (questionId: number, origin?: NavigationOrigin) => void;
  initialTab?: ReckonerTab;
  initialSubItemId?: string;
  onOpenVisualizations?: () => void;
  onOpenPractice?: () => void;
}

export const ReadyReckonerHub: React.FC<ReadyReckonerHubProps> = ({
  questions,
  onSelectQuestion,
  initialTab = 'comparison-tables',
  initialSubItemId,
  onOpenVisualizations,
  onOpenPractice
}) => {
  const [activeTab, setActiveTab] = useState<ReckonerTab>(initialTab);
  const contentTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const modules = [
    {
      id: 'comparison-tables' as ReckonerTab,
      number: 1,
      label: 'Comparison Tables',
      badge: '8 Tables',
      icon: Table,
      description: 'Side-by-side matrices: Bedrock vs SageMaker, Customization, Vector Stores, Governance, Security.'
    },
    {
      id: 'logic-flows' as ReckonerTab,
      number: 2,
      label: 'Decision Logic Flows',
      badge: '4 Trees',
      icon: GitFork,
      description: 'Branching logic trees for AWS service selection, customization pathways, bias, drift, and security.'
    },
    {
      id: 'code-snippets' as ReckonerTab,
      number: 3,
      label: 'Boto3 Code Snippets',
      badge: '8 APIs',
      icon: Code,
      description: 'Python API payloads with live simulator: Bedrock InvokeModel, Knowledge Bases, Guardrails, Textract.'
    },
    {
      id: 'exam-golden-rules' as ReckonerTab,
      number: 4,
      label: 'Traps & Golden Rules',
      badge: '14 Rules',
      icon: Lightbulb,
      description: 'High-frequency exam traps, memory mnemonics (Recall vs Precision), and temperature vs Top-P rules.'
    },
    {
      id: 'domain-cheat-sheets' as ReckonerTab,
      number: 5,
      label: 'Domain Cheat Sheets',
      badge: '5 Domains',
      icon: ShieldCheck,
      description: 'Domain weightings, core concept checklists, high-frequency question patterns, and service mappings.'
    }
  ];

  const handleSelectTab = (tabId: ReckonerTab) => {
    setActiveTab(tabId);
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-4 space-y-5" ref={contentTopRef}>
      
      {/* Ready Reckoner Clean Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-amber-400">
                  AIF-C01 High-Yield Reference
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                  Quick Memory Hub
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Exam Ready Reckoner
              </h1>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {onOpenPractice && (
              <button
                onClick={onOpenPractice}
                className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Practice MCQs ({questions.length})</span>
              </button>
            )}
            {onOpenVisualizations && (
              <button
                onClick={onOpenVisualizations}
                className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Concept Visualizers</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Terminology & Acronym Explainer Accordion/Glossary */}
      <AITerminologyGlossary />

      {/* Primary Ready Reckoner Navigation Bar */}
      <div className="sticky top-[72px] sm:top-[76px] z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 sm:p-2 shadow-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
          {modules.map((m) => {
            const Icon = m.icon;
            const isSelected = activeTab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectTab(m.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between space-x-2 border min-h-[44px] ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 border-amber-400 ring-1 ring-amber-400'
                    : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className="truncate">{m.label}</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                  isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-slate-400'
                }`}>
                  {m.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Content */}
      <div className="transition-all duration-200">
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
