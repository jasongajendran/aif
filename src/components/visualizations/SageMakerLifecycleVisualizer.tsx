import React, { useState } from 'react';
import { 
  FileText, Activity, ShieldCheck, Cpu, Layers, Sparkles, 
  Check, ArrowRight, Eye, AlertCircle, BarChart3, BookOpen
} from 'lucide-react';

interface SageMakerLifecycleVisualizerProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const SageMakerLifecycleVisualizer: React.FC<SageMakerLifecycleVisualizerProps> = ({ onSelectQuestion }) => {
  const [activeStageId, setActiveStageId] = useState<string>('clarify-bias');

  const stages = [
    {
      id: 'clarify-bias',
      number: '1',
      title: 'SageMaker Clarify (Pre-Training Bias)',
      category: 'Data Preparation & Fairness',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Analyzes raw tabular training datasets to detect demographic imbalances and statistical bias before a machine learning model is trained (e.g., Difference in Proportions of Labels [DPL], Class Imbalance [CI]).',
      examClue: 'Pre-training bias detection in raw datasets before model training ➔ SageMaker Clarify.',
      relatedQuestions: [425, 431, 435],
    },
    {
      id: 'jumpstart',
      number: '2',
      title: 'SageMaker JumpStart',
      category: 'Model Hub & Acceleration',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      description: 'A centralized machine learning hub that provides access to pre-trained open-weight models (Llama, Mistral, FLAN-T5), built-in algorithms, sample Jupyter notebooks, and 1-click deployment/fine-tuning templates.',
      examClue: 'Curated hub of pre-trained models, quick-start templates, and example notebooks in SageMaker ➔ SageMaker JumpStart.',
      relatedQuestions: [422],
    },
    {
      id: 'model-cards',
      number: '3',
      title: 'SageMaker Model Cards',
      category: 'Governance & Transparency',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Standardized documentation framework ("fact sheets") detailing custom ML model metadata, intended business use cases, owners, data assumptions, evaluation metrics, risk ratings, and operational limitations.',
      examClue: 'Standardized documentation / fact sheet for custom model purpose, metrics, and limitations ➔ SageMaker Model Cards. (Contrast with AWS AI Service Cards for AWS-managed AI services).',
      relatedQuestions: [440, 444],
    },
    {
      id: 'clarify-explain',
      number: '4',
      title: 'SageMaker Clarify (Explainability & SHAP)',
      category: 'Model Interpretability',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'Generates post-training feature attribution using Kernel SHAP (Shapley Additive exPlanations) to explain which specific user behaviors or input features most heavily influenced model predictions.',
      examClue: 'Explaining which features drove an ML prediction or explaining recommendation behavior ➔ SageMaker Clarify (SHAP values).',
      relatedQuestions: [435, 445],
    },
    {
      id: 'model-monitor',
      number: '5',
      title: 'SageMaker Model Monitor',
      category: 'Production Observability',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'Continuously monitors deployed model endpoints in production for 4 distinct drift types: Data Quality Drift, Model Quality Drift (Ground truth comparison), Bias Drift, and Feature Attribution Drift.',
      examClue: 'Continuously detecting data drift or concept drift on deployed production endpoints ➔ SageMaker Model Monitor.',
      relatedQuestions: [425, 440],
    },
  ];

  const currentStage = stages.find((s) => s.id === activeStageId) || stages[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-md font-bold">
            Amazon SageMaker AI Ecosystem
          </span>
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold px-2.5 py-1 rounded-md">
            ML Lifecycle & Governance
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          SageMaker Governance & ML Lifecycle Suite
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Learn how Amazon SageMaker features map across the end-to-end Machine Learning and Responsible AI lifecycle.
        </p>
      </div>

      {/* Interactive Lifecycle Stages */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Interactive Lifecycle Flow (Click any stage)
          </h3>
        </div>

        {/* 5 Stage Horizontal Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stages.map((stage) => {
            const isSelected = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[130px] ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`w-6 h-6 rounded-md text-xs font-mono font-black flex items-center justify-center ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {stage.number}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {stage.category.split('&')[0]}
                    </span>
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold leading-snug ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                    {stage.title}
                  </h4>
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 mt-2 truncate font-mono">
                  Stage {stage.number} of 5
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm font-mono">
                {currentStage.number}
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {currentStage.title}
                </h4>
                <p className="text-xs text-amber-400 font-mono">
                  Category: {currentStage.category}
                </p>
              </div>
            </div>

            {/* Related Questions */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Exam Practice Qs:</span>
              {currentStage.relatedQuestions.map((qId) => (
                <button
                  key={qId}
                  onClick={() => onSelectQuestion?.(qId)}
                  className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 transition-colors"
                >
                  Q{qId}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="font-bold text-slate-200 flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-wide text-amber-400">
                <BookOpen className="w-4 h-4" /> Feature Scope & Capabilities
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentStage.description}
              </p>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-400" /> AIF-C01 Exam Clue
              </div>
              <p className="text-amber-100 leading-relaxed font-medium">
                {currentStage.examClue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Cards vs AI Service Cards Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Crucial Exam Distinction: Model Cards vs AI Service Cards
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-bold">
              Amazon SageMaker Model Cards
            </span>
            <h4 className="text-base font-bold text-white">For YOUR Custom Models</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Created and owned by <strong>your organization</strong>. Used to document custom-trained ML models, training datasets, intended business use cases, and known operational limitations (Q440, Q444).
            </p>
          </div>

          <div className="bg-slate-950 border border-sky-500/40 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded font-bold">
              AWS AI Service Cards
            </span>
            <h4 className="text-base font-bold text-white">For AWS Managed AI Services</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Published directly by <strong>AWS</strong>. Provides transparency on the intended use, limitations, and responsible AI evaluation of AWS-managed AI services like Amazon Rekognition, Amazon Textract, and Amazon Transcribe (Q444).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
