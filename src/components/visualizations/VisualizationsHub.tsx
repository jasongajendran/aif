import React, { useState, useRef, useEffect } from 'react';
import { Question, VisualizationTab } from '../../types';
import { RagArchitectureVisualizer } from './RagArchitectureVisualizer';
import { ModelCustomizationVisualizer } from './ModelCustomizationVisualizer';
import { BedrockArchitectureVisualizer } from './BedrockArchitectureVisualizer';
import { SageMakerLifecycleVisualizer } from './SageMakerLifecycleVisualizer';
import { ServiceDecisionTreeVisualizer } from './ServiceDecisionTreeVisualizer';
import { EvaluationMetricsVisualizer } from './EvaluationMetricsVisualizer';
import { ExamAnalyticsVisualizer } from './ExamAnalyticsVisualizer';
import { 
  Layers, Database, Sliders, ShieldCheck, Compass, 
  Calculator, PieChart, Sparkles, BookOpen, ChevronLeft, 
  ChevronRight, LayoutGrid, Search, X, ArrowUp, ArrowRight, ArrowLeft
} from 'lucide-react';

interface VisualizationsHubProps {
  questions: Question[];
  onSelectQuestion: (questionId: number) => void;
  defaultTab?: VisualizationTab;
  onOpenReadyReckoner?: () => void;
  onOpenPractice?: () => void;
}

export const VisualizationsHub: React.FC<VisualizationsHubProps> = ({
  questions,
  onSelectQuestion,
  defaultTab = 'rag-architecture',
  onOpenReadyReckoner,
  onOpenPractice,
}) => {
  const [activeTab, setActiveTab] = useState<VisualizationTab>(defaultTab);
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const contentTopRef = useRef<HTMLDivElement>(null);

  const visualizers: {
    id: VisualizationTab;
    number: number;
    title: string;
    shortTitle: string;
    subtitle: string;
    description: string;
    domain: string;
    icon: React.ElementType;
    badge: string;
    badgeColor: string;
  }[] = [
    {
      id: 'rag-architecture',
      number: 1,
      title: 'RAG & Knowledge Bases Architecture',
      shortTitle: 'RAG & Knowledge Bases',
      subtitle: '2-Phase Pipeline: Ingestion & Runtime Inference',
      description: 'Interactive pipeline visualizing vector embeddings, chunking strategies, OpenSearch Serverless, and Top-K context retrieval.',
      domain: 'Domain 2 & 3',
      icon: Database,
      badge: 'Interactive Pipeline',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'model-customization',
      number: 2,
      title: 'Foundation Model Customization Spectrum',
      shortTitle: 'Model Customization',
      subtitle: 'Prompt Eng ➔ RAG ➔ Fine-Tuning ➔ Pre-Training',
      description: 'Compare the 5 customization tiers on cost, data volume requirements, weight modifications, and compute overhead.',
      domain: 'Domain 2: GenAI',
      icon: Sliders,
      badge: '5-Tier Spectrum',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    },
    {
      id: 'bedrock-guardrails',
      number: 3,
      title: 'Amazon Bedrock & 5-Layer Guardrails',
      shortTitle: 'Bedrock & Guardrails',
      subtitle: 'Unified API & Multi-Layer Safety Firewall',
      description: 'Explore the 5 guardrail safety layers (Denied Topics, Content Filters, Sensitive Info/PII, Word Filters, Contextual Grounding) with live prompt testing.',
      domain: 'Domain 3 & 4',
      icon: ShieldCheck,
      badge: '5-Layer Simulator',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'sagemaker-lifecycle',
      number: 4,
      title: 'SageMaker Governance & Drift Monitor',
      shortTitle: 'SageMaker & Governance',
      subtitle: 'Pre-Training Bias, Cards, SHAP & 4 Drift Types',
      description: 'End-to-end MLOps pipeline covering Clarify pre-training bias, Model Cards fact sheets, SHAP explainability, and Model Monitor drift simulation.',
      domain: 'Domain 4: Governance',
      icon: Layers,
      badge: '4-Drift Simulator',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
    {
      id: 'service-decision-tree',
      number: 5,
      title: 'AWS AI Service Selection Decision Tree',
      shortTitle: 'AWS Service Selector',
      subtitle: 'Scenario Matcher: Textract, Comprehend, Polly, Transcribe, etc.',
      description: '10 real-world exam scenario trees to instantly identify the winning AWS AI service vs. common exam distractor traps.',
      domain: 'Domain 3: Services',
      icon: Compass,
      badge: '10 Scenarios',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
    {
      id: 'confusion-matrix',
      number: 6,
      title: 'ML Evaluation Metrics & Confusion Matrix',
      shortTitle: 'Metrics & Confusion Matrix',
      subtitle: 'Interactive TP/FP/FN/TN Matrix + ROUGE, BLEU, BERTScore',
      description: 'Live 2x2 confusion matrix simulator calculating Precision, Recall, F1, and Accuracy, paired with GenAI text evaluation metrics.',
      domain: 'Domain 1: Fundamentals',
      icon: Calculator,
      badge: 'Interactive Calculator',
      badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    },
    {
      id: 'exam-domain-analytics',
      number: 7,
      title: '446 Question Domain Distribution & Analytics',
      shortTitle: '446 Qs Analytics',
      subtitle: 'Domain Breakdown, Topic Density & Question Heatmap',
      description: 'Comprehensive breakdown of all 446 practice questions across the 5 official AWS AIF-C01 domains and exam topics.',
      domain: 'All 5 Domains',
      icon: PieChart,
      badge: 'Question Analytics',
      badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    },
  ];

  const currentIndex = visualizers.findIndex((v) => v.id === activeTab);
  const currentVisualizer = visualizers[currentIndex] || visualizers[0];
  const prevVisualizer = currentIndex > 0 ? visualizers[currentIndex - 1] : null;
  const nextVisualizer = currentIndex < visualizers.length - 1 ? visualizers[currentIndex + 1] : null;

  const handleSelectTab = (tabId: VisualizationTab) => {
    setActiveTab(tabId);
    setIsCatalogOpen(false);
    // Smooth scroll to top of content area
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

  const filteredCatalog = visualizers.filter((v) => {
    if (!catalogSearch.trim()) return true;
    const query = catalogSearch.toLowerCase();
    return (
      v.title.toLowerCase().includes(query) ||
      v.subtitle.toLowerCase().includes(query) ||
      v.description.toLowerCase().includes(query) ||
      v.domain.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 py-4 space-y-5" ref={contentTopRef}>
      
      {/* Sticky Secondary Visualizer Navigation Bar */}
      <div className="sticky top-[106px] sm:top-[102px] lg:top-[98px] z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-2xl transition-all">
        
        <div className="flex items-center justify-between gap-2">
          
          {/* Catalog / Grid Toggle Button */}
          <button
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 border min-h-[40px] ${
              isCatalogOpen
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                : 'bg-slate-800/90 text-amber-300 hover:bg-slate-700 hover:text-white border-amber-500/30'
            }`}
            title="Browse all 7 Concept Visualizers catalog"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visualizers Index</span>
            <span className="sm:hidden">Index</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-950/60 text-[10px] font-mono">
              7
            </span>
          </button>

          {/* Tab Scroll Container with Left/Right Buttons */}
          <div className="flex-1 flex items-center space-x-1 min-w-0 relative">
            <button
              onClick={() => scrollTabs('left')}
              className="w-7 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 hidden md:flex"
              title="Scroll tabs left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={tabsScrollRef}
              className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5 px-1 w-full"
            >
              {visualizers.map((v) => {
                const Icon = v.icon;
                const isSelected = activeTab === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => handleSelectTab(v.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap min-h-[40px] shrink-0 border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 border-amber-400 ring-1 ring-amber-400'
                        : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                      isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {v.number}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>{v.shortTitle}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => scrollTabs('right')}
              className="w-7 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 hidden md:flex"
              title="Scroll tabs right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prev / Next Visualizer Flip Buttons */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => prevVisualizer && handleSelectTab(prevVisualizer.id)}
              disabled={!prevVisualizer}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                prevVisualizer
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-amber-500/50'
                  : 'bg-slate-900/40 text-slate-600 border-slate-800/50 cursor-not-allowed'
              }`}
              title={prevVisualizer ? `Previous: ${prevVisualizer.shortTitle}` : 'No previous visualizer'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono text-slate-400 font-bold px-1 hidden sm:inline">
              {currentIndex + 1}/7
            </span>

            <button
              onClick={() => nextVisualizer && handleSelectTab(nextVisualizer.id)}
              disabled={!nextVisualizer}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                nextVisualizer
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-amber-500/50'
                  : 'bg-slate-900/40 text-slate-600 border-slate-800/50 cursor-not-allowed'
              }`}
              title={nextVisualizer ? `Next: ${nextVisualizer.shortTitle}` : 'No next visualizer'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Visualizers Catalog Dropdown / Drawer Modal */}
      {isCatalogOpen && (
        <div className="bg-slate-900/95 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  Concept Visualizers Catalog (All 7 Interactive Modules)
                </h3>
                <p className="text-xs text-slate-400">
                  Select any visual architecture diagram or interactive simulator below:
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

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Filter visualizers by keyword, topic, or domain..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {filteredCatalog.map((v) => {
              const Icon = v.icon;
              const isSelected = activeTab === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => handleSelectTab(v.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/10 border-amber-500 ring-2 ring-amber-500/40 shadow-lg'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${v.badgeColor}`}>
                        {v.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {v.domain}
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
                          {v.number}. {v.title}
                        </h4>
                        <p className="text-[11px] text-amber-300/80 font-medium">
                          {v.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {v.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono">Module #{v.number}</span>
                    <span className={`font-bold flex items-center space-x-1 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                      <span>{isSelected ? 'Currently Viewing' : 'Open Visualizer'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* Render Active Visualizer Content */}
      <div className="transition-all duration-200">
        {activeTab === 'rag-architecture' && (
          <RagArchitectureVisualizer onSelectQuestion={onSelectQuestion} />
        )}
        {activeTab === 'model-customization' && (
          <ModelCustomizationVisualizer onSelectQuestion={onSelectQuestion} />
        )}
        {activeTab === 'bedrock-guardrails' && (
          <BedrockArchitectureVisualizer onSelectQuestion={onSelectQuestion} />
        )}
        {activeTab === 'sagemaker-lifecycle' && (
          <SageMakerLifecycleVisualizer onSelectQuestion={onSelectQuestion} />
        )}
        {activeTab === 'service-decision-tree' && (
          <ServiceDecisionTreeVisualizer onSelectQuestion={onSelectQuestion} />
        )}
        {activeTab === 'confusion-matrix' && (
          <EvaluationMetricsVisualizer onSelectQuestion={onSelectQuestion} />
        )}
        {activeTab === 'exam-domain-analytics' && (
          <ExamAnalyticsVisualizer questions={questions} onSelectQuestion={onSelectQuestion} />
        )}
      </div>

      {/* Bottom Sticky-Friendly Visualizer Navigation Footer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        
        {/* Previous Visualizer */}
        <div className="w-full sm:w-auto">
          {prevVisualizer ? (
            <button
              onClick={() => handleSelectTab(prevVisualizer.id)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 text-left transition-all group flex items-center space-x-3"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-850 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center text-slate-300 transition-colors shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  Previous Visualizer ({prevVisualizer.number}/7)
                </span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {prevVisualizer.shortTitle}
                </span>
              </div>
            </button>
          ) : (
            <div className="hidden sm:block text-xs font-mono text-slate-600 px-4">
              Start of Visualizers
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
            title="Scroll to top of current visualizer"
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
            <span>All 7 Visualizers</span>
          </button>
        </div>

        {/* Next Visualizer */}
        <div className="w-full sm:w-auto">
          {nextVisualizer ? (
            <button
              onClick={() => handleSelectTab(nextVisualizer.id)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 text-right transition-all group flex items-center justify-end space-x-3 ml-auto"
            >
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  Next Visualizer ({nextVisualizer.number}/7)
                </span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {nextVisualizer.shortTitle}
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-850 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center text-slate-300 transition-colors shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ) : (
            onOpenReadyReckoner && (
              <button
                onClick={onOpenReadyReckoner}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Continue to Exam Ready Reckoner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )
          )}
        </div>

      </div>

    </div>
  );
};
