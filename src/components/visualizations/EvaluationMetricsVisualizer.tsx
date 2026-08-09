import React, { useState } from 'react';
import { 
  Calculator, Sparkles, CheckCircle2, AlertTriangle, 
  HelpCircle, Sliders, ArrowRight, BookOpen, Layers, 
  BarChart3, Activity, PieChart
} from 'lucide-react';
import { NavigationOrigin } from '../../types';

interface EvaluationMetricsVisualizerProps {
  onSelectQuestion?: (questionId: number, origin?: NavigationOrigin) => void;
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

  const genAiMetrics = [
    {
      name: 'ROUGE-1 / ROUGE-2 / ROUGE-L',
      primaryUse: 'Text Summarization',
      measurement: 'N-gram overlap (unigrams, bigrams, and Longest Common Subsequence) between generated summary and human reference.',
      examRule: 'Use ROUGE for evaluating automated text summarization models.',
      relatedQuestions: [428, 434],
    },
    {
      name: 'BLEU (Bilingual Evaluation Understudy)',
      primaryUse: 'Machine Translation',
      measurement: 'Modified n-gram precision with brevity penalty comparing candidate translation to one or more reference translations.',
      examRule: 'Use BLEU for evaluating language translation accuracy.',
      relatedQuestions: [428],
    },
    {
      name: 'BERTScore',
      primaryUse: 'Semantic Text Quality',
      measurement: 'Computes cosine similarity between contextual BERT embeddings of tokens in candidate and reference, capturing semantic meaning rather than exact word matches.',
      examRule: 'Captures synonyms and paraphrasing that lexical n-gram metrics (ROUGE/BLEU) miss.',
      relatedQuestions: [434],
    },
    {
      name: 'Perplexity',
      primaryUse: 'Model Uncertainty & Fluency',
      measurement: 'Exponentiated cross-entropy loss measuring how surprised a language model is by a sequence of test tokens. Lower is better.',
      examRule: 'Lower perplexity means the model predicts text with higher confidence and natural grammar.',
      relatedQuestions: [428],
    },
    {
      name: 'Faithfulness & Answer Relevance',
      primaryUse: 'RAG Systems & Grounding',
      measurement: 'Checks if generated claims are 100% supported by retrieved source context chunks (Faithfulness) and address the user prompt (Relevance).',
      examRule: 'Low faithfulness indicates hallucination in RAG applications.',
      relatedQuestions: [421, 426, 443],
    },
    {
      name: 'TTFT & Token Throughput (Latency)',
      primaryUse: 'Inference Performance',
      measurement: 'Time to First Token (TTFT in ms) measures initial response latency; Tokens/second measures generation speed across concurrent users.',
      examRule: 'Streaming responses and Bedrock Provisioned Throughput optimize TTFT and sustained throughput.',
      relatedQuestions: [425, 435],
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-xl font-black">
              Evaluation Metrics Simulator
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-xl">
              Classical ML & GenAI Text Metrics
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            Machine Learning Evaluation Metrics & Confusion Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Master the mathematical trade-offs between Precision, Recall, F1 Score, Specificity, and Accuracy, as well as GenAI NLP text generation metrics (ROUGE, BLEU, BERTScore, and Perplexity).
          </p>
        </div>
      </div>

      {/* Part 1: Interactive Confusion Matrix & Formula Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Interactive 2×2 Confusion Matrix & Metric Calculator
            </h3>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Exam Scenarios:</span>
            <button
              onClick={() => applyPreset('medical-recall')}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
            >
              Medical (High Recall)
            </button>
            <button
              onClick={() => applyPreset('spam-precision')}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
            >
              Spam (High Precision)
            </button>
            <button
              onClick={() => applyPreset('imbalanced-fraud')}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
            >
              Fraud (Severe Imbalance)
            </button>
            <button
              onClick={() => applyPreset('balanced')}
              className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold font-mono"
            >
              Reset
            </button>
          </div>
        </div>

        {/* 2x2 Matrix & Sliders Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: 2x2 Matrix Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Confusion Matrix Layout</span>
                <span>Total Samples: {total}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                
                {/* True Positive (TP) */}
                <div className="bg-emerald-950/30 border border-emerald-500/50 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">True Positive (TP)</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      {((tp / total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">{tp}</div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Actual Positive correctly predicted as Positive.
                  </p>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={tp}
                    onChange={(e) => setTp(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                {/* False Positive (FP) - Type I Error */}
                <div className="bg-rose-950/30 border border-rose-500/50 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-400">False Positive (FP)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                      Type I Error
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">{fp}</div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Actual Negative falsely predicted as Positive.
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fp}
                    onChange={(e) => setFp(Number(e.target.value))}
                    className="w-full accent-rose-400"
                  />
                </div>

                {/* False Negative (FN) - Type II Error */}
                <div className="bg-amber-950/30 border border-amber-500/50 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">False Negative (FN)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                      Type II Error
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">{fn}</div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Actual Positive missed / predicted as Negative.
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fn}
                    onChange={(e) => setFn(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* True Negative (TN) */}
                <div className="bg-sky-950/30 border border-sky-500/50 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400">True Negative (TN)</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">
                      {((tn / total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">{tn}</div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Actual Negative correctly predicted as Negative.
                  </p>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={tn}
                    onChange={(e) => setTn(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* Right: Calculated Metrics Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* Precision Card */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold block">Precision</span>
                  <span className="text-[10px] text-slate-400 font-mono">TP / (TP + FP)</span>
                </div>
                <span className="text-xl font-black text-cyan-400 font-mono">
                  {(precision * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Of all items predicted Positive, how many were truly positive? (Crucial for spam filters).
              </p>
            </div>

            {/* Recall Card */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold block">Recall (Sensitivity)</span>
                  <span className="text-[10px] text-slate-400 font-mono">TP / (TP + FN)</span>
                </div>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {(recall * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Of all truly positive items, how many did we catch? (Crucial for medical disease screening).
              </p>
            </div>

            {/* F1 Score Card */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold block">F1-Score</span>
                  <span className="text-[10px] text-slate-400 font-mono">2 × (P × R) / (P + R)</span>
                </div>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {(f1Score * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Harmonic mean balancing precision and recall. Best metric for imbalanced datasets.
              </p>
            </div>

            {/* Accuracy Card */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-300 font-bold block">Accuracy</span>
                  <span className="text-[10px] text-slate-400 font-mono">(TP + TN) / Total</span>
                </div>
                <span className="text-xl font-black text-slate-200 font-mono">
                  {(accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Percentage of all predictions that were correct. Misleading under severe class imbalance.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Part 2: GenAI & LLM Text Evaluation Metrics Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-800">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Generative AI & LLM Text Evaluation Metrics Reference
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genAiMetrics.map((gm, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-md hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                  {gm.primaryUse}
                </span>
                <h4 className="text-base font-bold text-white">
                  {gm.name}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {gm.measurement}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-xs text-amber-300/90 font-medium">
                  <strong className="text-amber-400">Exam Trigger: </strong>
                  {gm.examRule}
                </div>
                {gm.relatedQuestions && gm.relatedQuestions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">Practice:</span>
                    {gm.relatedQuestions.map((qId) => (
                      <button
                        key={qId}
                        onClick={() => onSelectQuestion?.(qId, {
                          view: 'visualizations',
                          tabId: 'confusion-matrix',
                          sectionTitle: `Evaluation Metrics: ${gm.name}`,
                          subItemId: gm.name,
                        })}
                        className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30 transition-all flex items-center space-x-1"
                      >
                        <BookOpen className="w-2.5 h-2.5" />
                        <span>Q#{qId}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
