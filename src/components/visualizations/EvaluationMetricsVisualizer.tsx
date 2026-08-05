import React, { useState } from 'react';
import { 
  Calculator, Sparkles, CheckCircle2, AlertTriangle, 
  HelpCircle, Sliders, ArrowRight, BookOpen, Layers
} from 'lucide-react';

interface EvaluationMetricsVisualizerProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const EvaluationMetricsVisualizer: React.FC<EvaluationMetricsVisualizerProps> = ({ onSelectQuestion }) => {
  // State for Confusion Matrix
  const [tp, setTp] = useState<number>(85);
  const [fp, setFp] = useState<number>(15);
  const [fn, setFn] = useState<number>(10);
  const [tn, setTn] = useState<number>(90);

  // Calculations
  const total = tp + fp + fn + tn;
  const precision = (tp + fp) > 0 ? (tp / (tp + fp)) : 0;
  const recall = (tp + fn) > 0 ? (tp / (tp + fn)) : 0;
  const accuracy = total > 0 ? ((tp + tn) / total) : 0;
  const specificity = (tn + fp) > 0 ? (tn / (tn + fp)) : 0;
  const f1Score = (precision + recall) > 0 ? (2 * (precision * recall) / (precision + recall)) : 0;

  const applyPreset = (preset: 'balanced' | 'medical-recall' | 'spam-precision' | 'imbalanced-fraud') => {
    if (preset === 'medical-recall') {
      // High recall needed: minimize FN
      setTp(98);
      setFp(35);
      setFn(2);
      setTn(65);
    } else if (preset === 'spam-precision') {
      // High precision needed: minimize FP (don't send real emails to spam)
      setTp(75);
      setFp(1);
      setFn(24);
      setTn(100);
    } else if (preset === 'imbalanced-fraud') {
      // Severe class imbalance
      setTp(5);
      setFp(2);
      setFn(1);
      setTn(992);
    } else {
      setTp(85);
      setFp(15);
      setFn(10);
      setTn(90);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-md font-bold">
            Evaluation Metrics Simulator
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-md">
            Classical ML & GenAI Text Metrics
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          ML Evaluation Metrics & Confusion Matrix Simulator
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Interact with the live Confusion Matrix simulator to see how Precision, Recall, and F1 change, and review the standard GenAI summarization/translation metrics (ROUGE, BLEU, BERTScore).
        </p>
      </div>

      {/* Part 1: Live Interactive Confusion Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            Interactive Confusion Matrix Calculator
          </h3>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Exam Scenarios:</span>
            <button
              onClick={() => applyPreset('medical-recall')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
            >
              Medical / Disease (High Recall)
            </button>
            <button
              onClick={() => applyPreset('spam-precision')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
            >
              Spam Filter (High Precision)
            </button>
            <button
              onClick={() => applyPreset('imbalanced-fraud')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
            >
              Fraud / Imbalance (F1 Focus)
            </button>
          </div>
        </div>

        {/* Sliders & 2x2 Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 2x2 Matrix Visualizer (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-4">
            <div className="text-center font-bold text-xs sm:text-sm text-slate-400 uppercase tracking-wider mb-2">
              Actual vs Predicted Matrix
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* True Positive (TP) */}
              <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-emerald-400 font-bold">True Positive (TP)</span>
                  <span className="text-xl font-black text-emerald-300 font-mono">{tp}</span>
                </div>
                <p className="text-[11px] text-emerald-200/80">Predicted Positive, Actually Positive</p>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={tp} 
                  onChange={(e) => setTp(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* False Positive (FP) - Type I Error */}
              <div className="bg-rose-950/40 border-2 border-rose-500/60 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-rose-400 font-bold">False Positive (FP)</span>
                  <span className="text-xl font-black text-rose-300 font-mono">{fp}</span>
                </div>
                <p className="text-[11px] text-rose-200/80">Predicted Positive, Actually Negative (Type I)</p>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={fp} 
                  onChange={(e) => setFp(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* False Negative (FN) - Type II Error */}
              <div className="bg-rose-950/40 border-2 border-rose-500/60 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-rose-400 font-bold">False Negative (FN)</span>
                  <span className="text-xl font-black text-rose-300 font-mono">{fn}</span>
                </div>
                <p className="text-[11px] text-rose-200/80">Predicted Negative, Actually Positive (Type II)</p>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={fn} 
                  onChange={(e) => setFn(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* True Negative (TN) */}
              <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-emerald-400 font-bold">True Negative (TN)</span>
                  <span className="text-xl font-black text-emerald-300 font-mono">{tn}</span>
                </div>
                <p className="text-[11px] text-emerald-200/80">Predicted Negative, Actually Negative</p>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  value={tn} 
                  onChange={(e) => setTn(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 font-mono pt-1">
              Total Evaluated Samples: {total}
            </div>
          </div>

          {/* Computed Metrics Dashboard (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
              Live Calculated Metrics
            </h4>

            {/* Precision Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200">Precision (Exactness)</span>
                <span className="text-base font-black font-mono text-amber-400">
                  {(precision * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Formula: TP / (TP + FP) — "When model flags positive, how often is it right?"</p>
            </div>

            {/* Recall Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200">Recall / Sensitivity (Completeness)</span>
                <span className="text-base font-black font-mono text-emerald-400">
                  {(recall * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Formula: TP / (TP + FN) — "Of all actual positive cases, how many did model find?"</p>
            </div>

            {/* F1 Score Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200">F1 Score (Harmonic Mean)</span>
                <span className="text-base font-black font-mono text-sky-400">
                  {(f1Score * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Formula: 2 * (P * R) / (P + R) — Best metric for imbalanced data.</p>
            </div>

            {/* Accuracy Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200">Overall Accuracy</span>
                <span className="text-base font-black font-mono text-slate-300">
                  {(accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Formula: (TP + TN) / Total — Beware accuracy paradox on imbalanced sets.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Generative AI & NLP Text Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            GenAI Text Evaluation Metrics: Summarization, Translation & RAG
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Exam Qs:</span>
            {[437, 443, 426].map((qId) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ROUGE */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-mono font-bold px-2 py-0.5 rounded">
                ROUGE
              </span>
              <span className="text-[10px] text-slate-400">Summarization</span>
            </div>
            <h4 className="text-sm font-bold text-white">Recall-Oriented Overlap</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Measures n-gram overlap between generated summary and human reference text. Focuses on <strong>Recall</strong> (did the summary cover key source points?).
            </p>
            <div className="text-[11px] font-mono text-amber-400 pt-1">
              ROUGE-1 (unigrams), ROUGE-2 (bigrams), ROUGE-L (Longest Common Subsequence).
            </div>
          </div>

          {/* BLEU */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="bg-blue-500/20 text-blue-300 text-xs font-mono font-bold px-2 py-0.5 rounded">
                BLEU
              </span>
              <span className="text-[10px] text-slate-400">Translation</span>
            </div>
            <h4 className="text-sm font-bold text-white">Bilingual Evaluation Understudy</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Measures modified n-gram <strong>Precision</strong> between machine-translated text and human reference translations, with a brevity penalty for short texts.
            </p>
            <div className="text-[11px] font-mono text-blue-300 pt-1">
              Standard benchmark for machine translation (e.g. Amazon Translate).
            </div>
          </div>

          {/* BERTScore */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="bg-purple-500/20 text-purple-300 text-xs font-mono font-bold px-2 py-0.5 rounded">
                BERTScore
              </span>
              <span className="text-[10px] text-slate-400">Semantic Meaning</span>
            </div>
            <h4 className="text-sm font-bold text-white">Embedding Cosine Similarity</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Uses contextual embeddings from pre-trained transformer models to evaluate <strong>semantic similarity</strong> rather than exact word string matches (Q437).
            </p>
            <div className="text-[11px] font-mono text-purple-300 pt-1">
              Captures paraphrases that ROUGE and BLEU miss.
            </div>
          </div>

          {/* Faithfulness / Groundedness */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-2 py-0.5 rounded">
                Faithfulness
              </span>
              <span className="text-[10px] text-slate-400">RAG Grounding</span>
            </div>
            <h4 className="text-sm font-bold text-white">Hallucination Detection</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluates whether every claim in the generated answer can be strictly inferred from the retrieved source context documents (Q443).
            </p>
            <div className="text-[11px] font-mono text-emerald-300 pt-1">
              Low faithfulness = Model is hallucinating outside source docs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
