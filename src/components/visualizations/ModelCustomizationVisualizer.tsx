import React, { useState } from 'react';
import { 
  Sliders, Zap, DollarSign, Database, Brain, Sparkles, 
  Check, ArrowRight, ShieldAlert, Cpu, Layers, HelpCircle
} from 'lucide-react';

interface ModelCustomizationVisualizerProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const ModelCustomizationVisualizer: React.FC<ModelCustomizationVisualizerProps> = ({ onSelectQuestion }) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('rag');

  const methods = [
    {
      id: 'prompt-engineering',
      name: '1. Prompt Engineering',
      cost: 'Lowest ($)',
      dataReq: 'Zero to Few Examples (0-10)',
      modifiesWeights: 'No (Weights Frozen)',
      latencyImpact: 'Low to Medium (Depends on Prompt length)',
      bestFor: 'Formatting instructions, persona steering, zero-shot/few-shot tasks, chain-of-thought reasoning.',
      description: 'Crafting targeted instructions, system messages, few-shot examples, or chain-of-thought templates directly in the inference request without touching model weights or external vector databases.',
      examRule: 'Always start with Prompt Engineering before considering heavier customization options.',
      relatedQuestions: [428],
    },
    {
      id: 'rag',
      name: '2. Retrieval-Augmented Generation (RAG)',
      cost: 'Low to Medium ($$)',
      dataReq: 'Unstructured Enterprise Docs in S3 (No labeled pairs)',
      modifiesWeights: 'No (Weights Frozen)',
      latencyImpact: 'Adds vector search retrieval overhead (~50-200ms)',
      bestFor: 'Providing dynamic, proprietary, or frequently changing factual enterprise knowledge with verifiable source citations and minimal hallucinations.',
      description: 'Querying an external vector database (OpenSearch Serverless / Kendra) to retrieve authoritative source chunks at runtime and passing them in the prompt context window to the foundation model.',
      examRule: 'Choose RAG when the model needs current/private data, factual grounding, or source citations without modifying weights.',
      relatedQuestions: [421, 423, 426, 427, 443],
    },
    {
      id: 'fine-tuning',
      name: '3. Fine-Tuning (Instruction Tuning)',
      cost: 'Medium ($$$)',
      dataReq: 'Hundreds to Thousands of Labeled Prompt-Response Pairs (JSONL)',
      modifiesWeights: 'Yes (Updates specific model weights / LoRA adapters)',
      latencyImpact: 'None (Model size remains identical)',
      bestFor: 'Teaching a specific writing style, domain syntax, structured JSON output format, or highly consistent task behavior.',
      description: 'Supervised fine-tuning (SFT) adjusts the model parameters using high-quality prompt-response pairs. Supported natively in Amazon Bedrock Custom Models and SageMaker.',
      examRule: 'Choose Fine-Tuning when you need to change HOW the model responds (tone, style, output schema, specialized task pattern).',
      relatedQuestions: [428, 438],
    },
    {
      id: 'continued-pretraining',
      name: '4. Continued Pre-Training (Domain Adaptation)',
      cost: 'High ($$$$)',
      dataReq: 'Gigabytes of Unlabeled Domain Text (Millions of tokens)',
      modifiesWeights: 'Yes (Base weights updated on domain text)',
      latencyImpact: 'None (Same architecture)',
      bestFor: 'Teaching an existing foundation model deep domain-specific vocabulary, dense jargon, and concepts (e.g. legal case law, clinical medical journals, financial regulations).',
      description: 'Continues the self-supervised pre-training objective on vast unlabeled domain text corpora so the base model internalizes domain knowledge without training from scratch.',
      examRule: 'Choose Continued Pre-Training when a model lacks understanding of specialized domain vocabulary or industry literature (e.g., Q438).',
      relatedQuestions: [438],
    },
    {
      id: 'pretraining-scratch',
      name: '5. Pre-Training from Scratch',
      cost: 'Highest ($$$$$ Millions)',
      dataReq: 'Trillions of Unlabeled Tokens (Web-scale corpora)',
      modifiesWeights: 'Yes (Initializes all weights randomly)',
      latencyImpact: 'Requires dedicated GPU clusters (Trainium / SageMaker HyperPod)',
      bestFor: 'Creating a brand-new foundational architecture for proprietary national languages or highly specialized novel modalities.',
      description: 'Training an entire foundation model from random weight initialization. Requires massive compute clusters (AWS Trainium, EC2 P5/Trn1 instances), multi-million dollar budgets, and months of engineering.',
      examRule: 'Almost NEVER the right choice in AIF-C01 exam scenarios due to extreme cost, compute, and time constraints.',
      relatedQuestions: [428, 439],
    },
  ];

  const currentMethod = methods.find((m) => m.id === selectedMethodId) || methods[1];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-md font-bold">
            Model Customization Continuum
          </span>
          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold px-2.5 py-1 rounded-md">
            Cost & Effort Spectrum
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          The Foundation Model Customization Spectrum
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          AWS categorizes model customization into 5 distinct tiers. In the exam, always select the lowest-complexity approach that satisfies the functional requirement.
        </p>
      </div>

      {/* Visual Continuum Spectrum Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Customization Spectrum (Left to Right: Lowest to Highest Cost & Effort)
          </h3>
        </div>

        {/* 5 Spectrum Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          {methods.map((m, idx) => {
            const isSelected = m.id === selectedMethodId;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMethodId(m.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[120px] ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 mb-1">
                    <span>Tier {idx + 1}</span>
                    <span className={isSelected ? 'text-amber-400' : 'text-slate-400'}>{m.cost}</span>
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold leading-snug ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                    {m.name.replace(/^\d+\.\s*/, '')}
                  </h4>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80 mt-2 truncate">
                  Weights: {m.modifiesWeights.startsWith('Yes') ? 'UPDATED' : 'FROZEN'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Deep-Dive Details */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-400" />
                {currentMethod.name}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{currentMethod.description}</p>
            </div>

            {/* Related Questions */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Exam Practice Qs:</span>
              {currentMethod.relatedQuestions.map((qId) => (
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

          {/* Matrix Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-medium">Cost & Compute:</span>
              <p className="font-bold text-amber-300">{currentMethod.cost}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-medium">Data Requirements:</span>
              <p className="font-bold text-emerald-300">{currentMethod.dataReq}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-medium">Model Weights:</span>
              <p className="font-bold text-sky-300">{currentMethod.modifiesWeights}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-medium">Latency Impact:</span>
              <p className="font-bold text-slate-200">{currentMethod.latencyImpact}</p>
            </div>
          </div>

          {/* Best For & Exam Golden Rule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-wide">
                <Check className="w-4 h-4" /> Ideal Use Case
              </div>
              <p className="text-slate-200 leading-relaxed">
                {currentMethod.bestFor}
              </p>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-400" /> AIF-C01 Decision Rule
              </div>
              <p className="text-amber-100 leading-relaxed font-medium">
                {currentMethod.examRule}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Cheat Sheet Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          Exam Quick Reference: Fine-Tuning vs RAG vs Continued Pre-Training
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-300">
                <th className="p-3 font-bold">Goal / Need</th>
                <th className="p-3 font-bold">Best Technique</th>
                <th className="p-3 font-bold">Modifies Weights?</th>
                <th className="p-3 font-bold">Primary AWS Service</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-sans">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-medium">Provide real-time or private internal enterprise facts with source citations</td>
                <td className="p-3 text-amber-400 font-bold">RAG (Knowledge Bases)</td>
                <td className="p-3 text-emerald-400 font-mono">No (Frozen)</td>
                <td className="p-3 text-slate-300">Bedrock Knowledge Bases + OpenSearch Serverless</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-medium">Teach custom writing tone, structured JSON schema, or domain task syntax</td>
                <td className="p-3 text-amber-400 font-bold">Fine-Tuning (SFT)</td>
                <td className="p-3 text-sky-400 font-mono">Yes (Weights)</td>
                <td className="p-3 text-slate-300">Amazon Bedrock Custom Models / SageMaker</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-medium">Inject dense domain jargon (legal case law, medical terminology) from large text corpora</td>
                <td className="p-3 text-amber-400 font-bold">Continued Pre-Training</td>
                <td className="p-3 text-sky-400 font-mono">Yes (Base weights)</td>
                <td className="p-3 text-slate-300">Amazon Bedrock Continued Pre-training / SageMaker</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-medium">Quick formatting, persona instruction, or zero-shot classification</td>
                <td className="p-3 text-amber-400 font-bold">Prompt Engineering</td>
                <td className="p-3 text-emerald-400 font-mono">No (Frozen)</td>
                <td className="p-3 text-slate-300">Bedrock Prompt Management</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
