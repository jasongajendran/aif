import React, { useState, useRef } from 'react';
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
  ArrowLeft,
  ArrowUp,
  ShieldCheck,
  LayoutGrid,
  Search,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ReadyReckonerHubProps {
  questions: Question[];
  onSelectQuestion: (questionId: number) => void;
  onOpenVisualizations?: () => void;
  onOpenPractice?: () => void;
}

export const ReadyReckonerHub: React.FC<ReadyReckonerHubProps> = ({
  questions,
  onSelectQuestion,
  onOpenVisualizations,
  onOpenPractice
}) => {
  const [activeTab, setActiveTab] = useState<ReckonerTab>('comparison-tables');
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const contentTopRef = useRef<HTMLDivElement>(null);

  const modules = [
    {
      id: 'comparison-tables' as ReckonerTab,
      number: 1,
      label: 'Comparison Tables & Differences',
      shortLabel: 'Comparison Tables',
      subtitle: '6 Core High-Density Matrices',
      icon: Table,
      badge: '6 Core Tables',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Side-by-side matrices: Bedrock vs SageMaker, RAG vs Fine-Tuning vs Pre-training, Pre-built AI Services, Responsible AI & Governance.'
    },
    {
      id: 'logic-flows' as ReckonerTab,
      number: 2,
      label: 'Decision Logic Flows',
      shortLabel: 'Decision Logic Flows',
      subtitle: 'Interactive Scenario Step-by-Step Trees',
      icon: GitFork,
      badge: 'Interactive Trees',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      description: 'Interactive branching trees for AWS service selection, model customization pathways, bias & drift troubleshooting, and security endpoints.'
    },
    {
      id: 'code-snippets' as ReckonerTab,
      number: 3,
      label: 'AWS SDK & Boto3 Snippets',
      shortLabel: 'Boto3 Code Snippets',
      subtitle: 'Production Python API Payloads with Live Runner',
      icon: Code,
      badge: 'Production APIs',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Tested Boto3 snippets: Bedrock InvokeModel, Knowledge Bases RetrieveAndGenerate, Guardrails ApplyGuardrail, Textract & Comprehend.'
    },
    {
      id: 'exam-golden-rules' as ReckonerTab,
      number: 4,
      label: 'Exam Traps & Golden Rules',
      shortLabel: 'Traps & Golden Rules',
      subtitle: 'Mnemonics, Trap Alerts & Metric Formulas',
      icon: Lightbulb,
      badge: 'Mnemonics & Traps',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'High-frequency exam traps, mnemonics (Recall vs Precision), AI Service Cards vs Model Cards, and Temperature vs Top-P rules.'
    },
    {
      id: 'domain-cheat-sheets' as ReckonerTab,
      number: 5,
      label: 'Domain-by-Domain Cheat Sheets',
      shortLabel: 'Domain Cheat Sheets',
      subtitle: 'All 5 Exam Domains & High-Yield Checklists',
      icon: ShieldCheck,
      badge: 'All 5 Domains',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'Domain-by-domain weightings, core concept checklists, high-frequency question patterns, and essential service mappings.'
    }
  ];

  const currentIndex = modules.findIndex((m) => m.id === activeTab);
  const currentModule = modules[currentIndex] || modules[0];
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const handleSelectTab = (tabId: ReckonerTab) => {
    setActiveTab(tabId);
    setIsCatalogOpen(false);
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      tabsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredCatalog = modules.filter((m) => {
    if (!catalogSearch.trim()) return true;
    const query = catalogSearch.toLowerCase();
    return (
      m.label.toLowerCase().includes(query) ||
      m.subtitle.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-4 space-y-5" ref={contentTopRef}>
      
      {/* Ready Reckoner Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-amber-400">
                  AIF-C01 High-Yield Reference Hub
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Exam Ready Reckoner & Quick Memory Hub
                </h1>
              </div>
            </div>

            {/* Quick cross-view jump buttons */}
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

          <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
            High-density comparison matrices, key differences, interactive logic flowcharts, production Boto3 code payloads, and high-yield memory rules engineered for rapid revision and maximum exam retention.
          </p>

          {/* Module Selector Navigation Grid (in Hero) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectTab(m.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/10 border-amber-500 text-white shadow-lg ring-2 ring-amber-500/40'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                        isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.number}
                      </span>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {m.badge}
                    </span>
                  </div>
                  <span className={`text-xs font-bold leading-tight ${isActive ? 'text-white font-black' : 'text-slate-300'}`}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Sticky Secondary Ready Reckoner Navigation Bar */}
      <div className="sticky top-[106px] sm:top-[102px] lg:top-[98px] z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-2xl transition-all">
        
        <div className="flex items-center justify-between gap-2">
          
          {/* Catalog Toggle */}
          <button
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 border min-h-[40px] ${
              isCatalogOpen
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                : 'bg-slate-800/90 text-amber-300 hover:bg-slate-700 hover:text-white border-amber-500/30'
            }`}
            title="Browse all 5 Ready Reckoner modules"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Modules Index</span>
            <span className="sm:hidden">Index</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-950/60 text-[10px] font-mono">
              5
            </span>
          </button>

          {/* Module Scroll Tabs */}
          <div className="flex-1 flex items-center space-x-1 min-w-0 relative">
            <button
              onClick={() => scrollTabs('left')}
              className="w-7 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 hidden md:flex"
              title="Scroll modules left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={tabsScrollRef}
              className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5 px-1 w-full"
            >
              {modules.map((m) => {
                const Icon = m.icon;
                const isSelected = activeTab === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectTab(m.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap min-h-[40px] shrink-0 border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 border-amber-400 ring-1 ring-amber-400'
                        : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                      isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {m.number}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>{m.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => scrollTabs('right')}
              className="w-7 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 hidden md:flex"
              title="Scroll modules right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prev / Next Module Flip Buttons */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => prevModule && handleSelectTab(prevModule.id)}
              disabled={!prevModule}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                prevModule
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-amber-500/50'
                  : 'bg-slate-900/40 text-slate-600 border-slate-800/50 cursor-not-allowed'
              }`}
              title={prevModule ? `Previous: ${prevModule.shortLabel}` : 'No previous module'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono text-slate-400 font-bold px-1 hidden sm:inline">
              {currentIndex + 1}/5
            </span>

            <button
              onClick={() => nextModule && handleSelectTab(nextModule.id)}
              disabled={!nextModule}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                nextModule
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-amber-500/50'
                  : 'bg-slate-900/40 text-slate-600 border-slate-800/50 cursor-not-allowed'
              }`}
              title={nextModule ? `Next: ${nextModule.shortLabel}` : 'No next module'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Ready Reckoner Catalog Drawer Modal */}
      {isCatalogOpen && (
        <div className="bg-slate-900/95 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  Exam Ready Reckoner Modules (All 5 Cheat Sheet Sections)
                </h3>
                <p className="text-xs text-slate-400">
                  Select any high-yield cheat sheet or interactive tool below:
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCatalogOpen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              title="Close catalog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search ready reckoner modules..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {filteredCatalog.map((m) => {
              const Icon = m.icon;
              const isSelected = activeTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectTab(m.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/10 border-amber-500 ring-2 ring-amber-500/40 shadow-lg'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${m.badgeColor}`}>
                        {m.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Section #{m.number}
                      </span>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                          {m.number}. {m.label}
                        </h4>
                        <p className="text-[11px] text-amber-300/80 font-medium">
                          {m.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {m.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono">Module #{m.number}</span>
                    <span className={`font-bold flex items-center space-x-1 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                      <span>{isSelected ? 'Currently Viewing' : 'Open Module'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      )}

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

      {/* Bottom Sticky-Friendly Ready Reckoner Navigation Footer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        
        {/* Previous Module */}
        <div className="w-full sm:w-auto">
          {prevModule ? (
            <button
              onClick={() => handleSelectTab(prevModule.id)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 text-left transition-all group flex items-center space-x-3"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-850 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center text-slate-300 transition-colors shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  Previous Section ({prevModule.number}/5)
                </span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {prevModule.shortLabel}
                </span>
              </div>
            </button>
          ) : (
            <div className="hidden sm:block text-xs font-mono text-slate-600 px-4">
              Start of Ready Reckoner
            </div>
          )}
        </div>

        {/* Center: Back to Top & Catalog Action */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (contentTopRef.current) {
                contentTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center space-x-1.5 border border-slate-700"
            title="Scroll to top of current section"
          >
            <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Top</span>
          </button>

          <button
            onClick={() => {
              setIsCatalogOpen(true);
              if (contentTopRef.current) {
                contentTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all flex items-center space-x-1.5 border border-amber-500/30"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All 5 Modules</span>
          </button>
        </div>

        {/* Next Module */}
        <div className="w-full sm:w-auto">
          {nextModule ? (
            <button
              onClick={() => handleSelectTab(nextModule.id)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 text-right transition-all group flex items-center justify-end space-x-3 ml-auto"
            >
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  Next Section ({nextModule.number}/5)
                </span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {nextModule.shortLabel}
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-850 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center text-slate-300 transition-colors shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ) : (
            onOpenPractice && (
              <button
                onClick={onOpenPractice}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Test Yourself: Practice MCQs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )
          )}
        </div>

      </div>

    </div>
  );
};
