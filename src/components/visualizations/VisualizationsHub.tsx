import React, { useState } from 'react';
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
  Calculator, PieChart, Sparkles, BookOpen
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

  const tabs: { id: VisualizationTab; label: string; icon: React.ElementType }[] = [
    { id: 'rag-architecture', label: 'RAG & Knowledge Bases', icon: Database },
    { id: 'model-customization', label: 'Model Customization Spectrum', icon: Sliders },
    { id: 'bedrock-guardrails', label: 'Bedrock & Guardrails', icon: ShieldCheck },
    { id: 'sagemaker-lifecycle', label: 'SageMaker & Governance', icon: Layers },
    { id: 'service-decision-tree', label: 'AWS Service Selector', icon: Compass },
    { id: 'confusion-matrix', label: 'Metrics & Confusion Matrix', icon: Calculator },
    { id: 'exam-domain-analytics', label: '446 Question Analytics', icon: PieChart },
  ];

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 py-4 space-y-6">
      
      {/* Top Visualizer Category Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 whitespace-nowrap min-h-[44px] ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

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

    </div>
  );
};
