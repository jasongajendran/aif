import React, { useState, useEffect } from 'react';
import { 
  FileText, Activity, ShieldCheck, Cpu, Layers, Sparkles, 
  CheckCircle2, ArrowRight, ArrowLeft, Eye, AlertCircle, BarChart3, BookOpen,
  Server, RefreshCw, AlertTriangle, Check
} from 'lucide-react';
import { NavigationOrigin } from '../../types';

interface SageMakerLifecycleVisualizerProps {
  onSelectQuestion?: (questionId: number, origin?: NavigationOrigin) => void;
  initialStageId?: string;
}

export const SageMakerLifecycleVisualizer: React.FC<SageMakerLifecycleVisualizerProps> = ({ 
  onSelectQuestion,
  initialStageId,
}) => {
  const [activeStageId, setActiveStageId] = useState<string>(initialStageId || 'clarify-bias');
  
  useEffect(() => {
    if (initialStageId) {
      setActiveStageId(initialStageId);
    }
  }, [initialStageId]);
  
  // Drift Simulator State
  const [driftType, setDriftType] = useState<'none' | 'data-drift' | 'concept-drift' | 'bias-drift'>('none');

  const stages = [
    {
      id: 'clarify-bias',
      number: '1',
      title: 'SageMaker Clarify (Pre-Training Bias)',
      shortTitle: 'Pre-Training Bias',
      category: 'Data Preparation & Fairness',
      service: 'Amazon SageMaker Clarify',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Analyzes raw tabular training datasets to detect demographic imbalances and statistical bias before a machine learning (ML) model is trained (e.g., Difference in Proportions of Labels [DPL], Class Imbalance [CI], Disparate Impact).',
      examClue: 'Pre-training bias detection in raw datasets before model training ➔ Amazon SageMaker Clarify.',
      keyMetrics: ['Difference in Proportions of Labels (DPL)', 'Class Imbalance (CI)', 'Demographic Facet Imbalance'],
      relatedQuestions: [425, 431, 435],
    },
    {
      id: 'jumpstart',
      number: '2',
      title: 'SageMaker JumpStart (Foundation Model Hub)',
      shortTitle: 'JumpStart Hub',
      category: 'Model Hub & Pre-Trained Foundation Models',
      service: 'Amazon SageMaker JumpStart Model Hub',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      description: 'A centralized machine learning (ML) hub that provides access to pre-trained open-weight foundation models (such as Llama 3, Mistral, and FLAN-T5), built-in algorithms, sample Jupyter notebooks, and 1-click deployment/fine-tuning templates without writing low-level code.',
      examClue: 'Curated hub of pre-trained open models, quick-start templates, and example notebooks in SageMaker ➔ Amazon SageMaker JumpStart.',
      keyMetrics: ['Pre-trained Open Foundation Models (FMs)', 'Built-in Solution Blueprints', '1-Click Endpoint Deployments'],
      relatedQuestions: [422],
    },
    {
      id: 'model-cards',
      number: '3',
      title: 'SageMaker Model Cards (Governance & Auditing)',
      shortTitle: 'Model Cards',
      category: 'Governance & Transparency',
      service: 'Amazon SageMaker Model Governance & Cards',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Standardized documentation framework ("fact sheets") detailing custom ML model metadata, intended business use cases, owners, data assumptions, evaluation metrics, risk ratings, and operational limitations.',
      examClue: 'Standardized documentation / fact sheet for custom model purpose, metrics, and limitations ➔ Amazon SageMaker Model Cards. (Contrast with AWS AI Service Cards for AWS-managed AI services like Rekognition or Comprehend).',
      keyMetrics: ['Intended Use & Operational Limits', 'Evaluation Baselines & F1 Scores', 'Risk & Ethical Fairness Ratings'],
      relatedQuestions: [440, 444],
    },
    {
      id: 'clarify-explain',
      number: '4',
      title: 'SageMaker Clarify (Explainability & SHAP Attribution)',
      shortTitle: 'SHAP Explainability',
      category: 'Model Interpretability & Explainability',
      service: 'Amazon SageMaker Clarify (Kernel SHAP)',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'Generates post-training feature attribution using Kernel SHAP (Shapley Additive exPlanations) to explain which specific user behaviors or input features most heavily influenced model predictions.',
      examClue: 'Explaining which features drove an ML prediction or explaining recommendation behavior ➔ Amazon SageMaker Clarify (SHAP values).',
      keyMetrics: ['Kernel SHAP (Shapley Additive exPlanations)', 'Feature Importance Rankings', 'Local & Global Decision Explanations'],
      relatedQuestions: [435, 445],
    },
    {
      id: 'model-monitor',
      number: '5',
      title: 'SageMaker Model Monitor (Production Drift)',
      shortTitle: 'Model Monitor (Drift)',
      category: 'Production Observability & MLOps',
      service: 'Amazon SageMaker Model Monitor',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'Continuously monitors deployed model endpoints in production for 4 distinct drift types: Data Quality Drift, Model Quality Drift (Ground truth comparison), Bias Drift, and Feature Attribution Drift.',
      examClue: 'Continuously detecting data drift or concept drift on deployed production endpoints ➔ Amazon SageMaker Model Monitor.',
      keyMetrics: ['Data Quality Drift (Missing/skewed inputs)', 'Model Quality Drift (Accuracy degradation)', 'Bias Drift (Fairness drop)', 'Feature Attribution Drift (SHAP shift)'],
      relatedQuestions: [425, 440],
    },
  ];

  const currentStage = stages.find((s) => s.id === activeStageId) || stages[0];
  const currentStageIndex = stages.findIndex((s) => s.id === currentStage.id);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-xl font-black">
              SageMaker AI Ecosystem
            </span>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold px-2.5 py-1 rounded-xl">
              ML Lifecycle & Governance
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            SageMaker Governance & End-to-End MLOps Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Amazon SageMaker provides full lifecycle tools for data preparation, pre-training bias audits, curated model hubs, standardized model cards, post-training SHAP explainability, and automated production drift monitoring.
          </p>
        </div>
      </div>

      {/* Connected 5-Stage MLOps Pipeline Flowchart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            End-to-End Lifecycle Flow (Click any stage to inspect)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Stage {currentStage.number} of 5
          </span>
        </div>

        {/* 5 Stepped Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stages.map((stage) => {
            const isSelected = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[145px] ${
                  isSelected
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/10 transform -translate-y-1'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-7 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {stage.number}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {stage.category.split('&')[0]}
                    </span>
                  </div>

                  <h4 className={`text-xs sm:text-sm font-bold leading-snug ${
                    isSelected ? 'text-amber-300 font-extrabold' : 'text-slate-200'
                  }`}>
                    {stage.shortTitle}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-800/80 mt-2 text-[10px] font-mono text-slate-400 truncate">
                  {stage.service.replace('Amazon ', '')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-inner">
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3 min-w-0">
              <span className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm font-mono flex-shrink-0">
                {currentStage.number}
              </span>
              <div className="min-w-0">
                <h4 className="text-base sm:text-lg font-black text-white truncate">
                  {currentStage.title}
                </h4>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {currentStage.category}
                </span>
              </div>
            </div>

            {/* Prev / Next Stage Buttons & Linked Questions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1.5 shrink-0">
                {currentStageIndex > 0 && (
                  <button
                    onClick={() => setActiveStageId(stages[currentStageIndex - 1].id)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Prev Stage</span>
                  </button>
                )}
                {currentStageIndex < stages.length - 1 && (
                  <button
                    onClick={() => setActiveStageId(stages[currentStageIndex + 1].id)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1"
                  >
                    <span className="hidden sm:inline">Next Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {currentStage.relatedQuestions && currentStage.relatedQuestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pl-2 border-l border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold mr-0.5">Test:</span>
                  {currentStage.relatedQuestions.map((qId) => (
                    <button
                      key={qId}
                      onClick={() => onSelectQuestion?.(qId, {
                        view: 'visualizations',
                        tabId: 'sagemaker-lifecycle',
                        sectionTitle: `SageMaker MLOps: Stage ${currentStage.number} (${currentStage.shortTitle})`,
                        subItemId: currentStage.id,
                      })}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 transition-all flex items-center space-x-1"
                      title={`Practice Question ${qId}`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Q#{qId}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs sm:text-sm">
            
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
                <span className="text-amber-400 uppercase tracking-wider text-xs font-mono font-bold block">
                  Functionality & Capabilities
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {currentStage.description}
                </p>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/40 p-4 sm:p-5 rounded-2xl space-y-2">
                <span className="text-amber-300 uppercase tracking-wider text-xs font-mono font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AIF-C01 High-Yield Exam Clue
                </span>
                <p className="text-amber-100 font-semibold leading-relaxed">
                  {currentStage.examClue}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold border-b border-slate-800 pb-2">
                Core Metrics & Artifacts
              </span>

              <div className="space-y-2.5">
                {currentStage.keyMetrics.map((metric, mIdx) => (
                  <div key={mIdx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-mono text-xs">{metric}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                AWS AI Governance Suite
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Production Model Drift Interactive Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        
        <div className="flex items-center space-x-3 pb-2 border-b border-slate-800">
          <Activity className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Interactive Model Monitor Drift Simulator (4 Drift Types)
            </h3>
            <p className="text-xs text-slate-400">
              Test how SageMaker Model Monitor responds when production data shifts away from baseline distributions
            </p>
          </div>
        </div>

        {/* Drift Type Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'none' as const, label: 'Baseline (Healthy)', desc: 'Distribution matches baseline' },
            { id: 'data-drift' as const, label: 'Data Quality Drift', desc: 'Input features change / missing values' },
            { id: 'concept-drift' as const, label: 'Model Quality Drift', desc: 'Real-world ground truth shifts' },
            { id: 'bias-drift' as const, label: 'Bias Drift', desc: 'Fairness metric degrades' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDriftType(d.id)}
              className={`p-3 rounded-2xl border text-left transition-all text-xs ${
                driftType === d.id
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-bold">{d.label}</div>
              <div className="text-[10px] opacity-75 font-mono truncate">{d.desc}</div>
            </button>
          ))}
        </div>

        {/* Drift Status Banner */}
        <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs sm:text-sm ${
          driftType === 'none'
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
        }`}>
          {driftType === 'none' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div>
            <strong className="font-bold block mb-1">
              {driftType === 'none'
                ? 'Model Endpoint Status: HEALTHY (No Drift Detected)'
                : `Model Monitor Alert: ${driftType.toUpperCase()} DETECTED!`}
            </strong>
            <p className="leading-relaxed opacity-90">
              {driftType === 'none' && 'Continuous monitoring confirms that production inference traffic aligns with the training baseline data.'}
              {driftType === 'data-drift' && 'Incoming features in production have deviated from the baseline distribution. Model Monitor triggers Amazon CloudWatch alarm and sends alert to retraining pipeline.'}
              {driftType === 'concept-drift' && 'Relationship between features and ground-truth target has fundamentally shifted (e.g. consumer purchasing habits after market shift). Retraining required.'}
              {driftType === 'bias-drift' && 'Model predictions have become disproportionately unfavorable toward a protected demographic facet. Clarify alerts team to retrain with balanced data.'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
