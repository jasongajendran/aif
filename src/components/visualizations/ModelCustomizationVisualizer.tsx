import React, { useState } from 'react';
import { 
  Sliders, Zap, DollarSign, Database, Brain, Sparkles, 
  CheckCircle2, ArrowRight, ArrowLeft, ShieldAlert, Cpu, Layers, HelpCircle,
  BookOpen, Gauge, BarChart3, AlertTriangle, ArrowDown
} from 'lucide-react';

interface ModelCustomizationVisualizerProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const ModelCustomizationVisualizer: React.FC<ModelCustomizationVisualizerProps> = ({ onSelectQuestion }) => {
  const [selectedTierId, setSelectedTierId] = useState<string>('rag');
  const [matchedRequirement, setMatchedRequirement] = useState<string>('rag');

  const tiers = [
    {
      id: 'prompt-eng',
      tierNumber: 1,
      name: '1. Prompt Engineering & In-Context Learning',
      shortName: 'Prompt Engineering',
      cost: 'Lowest ($)',
      costScore: 1,
      dataReq: '0 to 10 Examples (Zero-shot / Few-shot)',
      dataReqScore: 1,
      modifiesWeights: 'No (Weights Frozen 100%)',
      weightsUpdated: false,
      latencyImpact: 'Low to Medium (Prompt token length)',
      computeRequired: 'Standard API Inference Call',
      bestFor: 'Persona steering, output format templates, chain-of-thought reasoning, immediate testing.',
      mechanism: 'Crafting targeted instructions, system messages, and few-shot input/output examples directly in the inference request context window.',
      examRule: 'Always evaluate Prompt Engineering first before considering heavier customization options (lowest effort & cost).',
      exampleCode: `// Prompt Engineering Request\nconst response = await bedrock.invokeModel({\n  modelId: "anthropic.claude-3-haiku",\n  prompt: "You are a customer support agent. Summarize this complaint in 2 bullet points:\\n..."\n});`,
      relatedQuestions: [428],
    },
    {
      id: 'rag',
      tierNumber: 2,
      name: '2. Retrieval-Augmented Generation (RAG)',
      shortName: 'RAG Knowledge Bases',
      cost: 'Low to Medium ($$)',
      costScore: 2,
      dataReq: 'Unstructured Enterprise Docs in S3 (No labeled pairs)',
      dataReqScore: 2,
      modifiesWeights: 'No (Weights Frozen 100%)',
      weightsUpdated: false,
      latencyImpact: 'Adds vector search retrieval overhead (~50-200ms)',
      computeRequired: 'Vector DB Indexing + Standard FM Inference',
      bestFor: 'Dynamic, private, or frequently updated enterprise knowledge with verifiable source citations and minimal hallucinations.',
      mechanism: 'Extracting semantic chunks from Amazon S3, storing vector embeddings in OpenSearch Serverless, and dynamically retrieving Top-K context chunks into the prompt.',
      examRule: 'Choose RAG when the model needs current/private data, factual grounding, or citations without modifying weights.',
      exampleCode: `// Bedrock Knowledge Base RAG Request\nconst result = await bedrockAgentRuntime.retrieveAndGenerate({\n  input: { text: "What is our 2026 expense policy?" },\n  retrieveAndGenerateConfiguration: {\n    type: "KNOWLEDGE_BASE",\n    knowledgeBaseConfiguration: { knowledgeBaseId: "KB-94812" }\n  }\n});`,
      relatedQuestions: [421, 423, 426, 427, 443],
    },
    {
      id: 'fine-tuning',
      tierNumber: 3,
      name: '3. Supervised Fine-Tuning (Instruction Tuning)',
      shortName: 'Supervised Fine-Tuning',
      cost: 'Medium ($$$)',
      costScore: 3,
      dataReq: 'Hundreds to Thousands of Labeled Prompt-Response Pairs (JSONL)',
      dataReqScore: 3,
      modifiesWeights: 'Yes (Updates specific model weights / LoRA adapters)',
      weightsUpdated: true,
      latencyImpact: 'Zero (Model size & architecture unchanged)',
      computeRequired: 'Bedrock Custom Model Training Job',
      bestFor: 'Teaching a specific writing style, domain syntax, strict structured JSON schema, or consistent specialized task behavior.',
      mechanism: 'Supervised fine-tuning (SFT) adjusts the model parameters using high-quality curated prompt-response pairs. Supported natively in Amazon Bedrock Custom Models and SageMaker.',
      examRule: 'Choose Fine-Tuning when you need to change HOW the model responds (tone, style, output schema, specialized task pattern).',
      exampleCode: `// Training Data Format (train.jsonl)\n{"prompt": "Classify claim #892: Patient broke leg skiing", "completion": "CATEGORY: ORTHO_ACCIDENT | SEVERITY: HIGH"}\n{"prompt": "Classify claim #893: Annual dental checkup", "completion": "CATEGORY: DENTAL_ROUTINE | SEVERITY: LOW"}`,
      relatedQuestions: [428, 438],
    },
    {
      id: 'continued-pretraining',
      tierNumber: 4,
      name: '4. Continued Pre-Training (Domain Adaptation)',
      shortName: 'Continued Pre-Training',
      cost: 'High ($$$$)',
      costScore: 4,
      dataReq: 'Gigabytes of Unlabeled Domain Text (Millions of tokens)',
      dataReqScore: 4,
      modifiesWeights: 'Yes (Base weights updated on domain text)',
      weightsUpdated: true,
      latencyImpact: 'Zero (Same base architecture)',
      computeRequired: 'Distributed GPU Clusters (AWS Trainium / P4/P5 instances)',
      bestFor: 'Teaching an existing foundation model deep domain-specific vocabulary, dense jargon, and concepts (e.g. legal case law, clinical medical journals, financial regulations).',
      mechanism: 'Continues the self-supervised pre-training objective on vast unlabeled domain text corpora so the base model internalizes domain knowledge without training from scratch.',
      examRule: 'Choose Continued Pre-Training when a model lacks understanding of specialized domain vocabulary or industry literature (e.g., Q438).',
      exampleCode: `// Raw Unlabeled Domain Text Ingestion\n"Section 14(a)(1) under SEC Rule 14a-8 requires registrant to include shareholder proposal unless excludable under subsection (i)(7)..."`,
      relatedQuestions: [438],
    },
    {
      id: 'pretraining-scratch',
      tierNumber: 5,
      name: '5. Pre-Training from Scratch',
      shortName: 'Pre-Training from Scratch',
      cost: 'Highest ($$$$$ Millions)',
      costScore: 5,
      dataReq: 'Trillions of Unlabeled Tokens (Web-scale corpora)',
      dataReqScore: 5,
      modifiesWeights: 'Yes (Initializes all weights randomly)',
      weightsUpdated: true,
      latencyImpact: 'Requires dedicated GPU clusters (Trainium / SageMaker HyperPod)',
      computeRequired: 'Thousands of Trainium/H100 chips for months',
      bestFor: 'Creating a brand-new foundational architecture for proprietary national languages or highly specialized novel modalities.',
      mechanism: 'Training an entire foundation model from random weight initialization. Requires massive compute clusters (AWS Trainium, EC2 P5/Trn1 instances), multi-million dollar budgets, and months of engineering.',
      examRule: 'Almost NEVER the right choice in AIF-C01 exam scenarios due to extreme cost, compute, and time constraints.',
      exampleCode: `// Random Weight Initialization\nmodel = TransformerModel(vocab_size=64000, hidden_dim=8192, layers=64)\n// Distributed training on 2,048 AWS Trainium accelerators across 90 days...`,
      relatedQuestions: [428, 439],
    },
  ];

  const currentTier = tiers.find((t) => t.id === selectedTierId) || tiers[1];
  const currentTierIndex = tiers.findIndex((t) => t.id === currentTier.id);

  const requirements = [
    {
      id: 'prompt-eng',
      label: 'Persona & Tone Adjustment (No Budget)',
      tierTarget: 'prompt-eng',
      badge: 'Tier 1',
    },
    {
      id: 'rag',
      label: 'Fresh Private Company Docs + Citations',
      tierTarget: 'rag',
      badge: 'Tier 2',
    },
    {
      id: 'fine-tuning',
      label: 'Strict Custom JSON Schema & Style Output',
      tierTarget: 'fine-tuning',
      badge: 'Tier 3',
    },
    {
      id: 'continued-pretraining',
      label: 'Dense Industry Jargon (Legal / Medical)',
      tierTarget: 'continued-pretraining',
      badge: 'Tier 4',
    },
    {
      id: 'pretraining-scratch',
      label: 'Brand New Language Model Architecture',
      tierTarget: 'pretraining-scratch',
      badge: 'Tier 5',
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
              Model Customization Continuum
            </span>
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold px-2.5 py-1 rounded-xl">
              Cost & Complexity Spectrum
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            The 5 Foundation Model Customization Tiers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            AWS categorizes model customization into 5 progressive tiers ranging from lightweight prompt engineering to pre-training from scratch. On the exam, always select the lowest-complexity approach that satisfies the functional requirement.
          </p>
        </div>
      </div>

      {/* Interactive Requirement Matcher Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Interactive Scenario Matcher: Select a Business Need
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {requirements.map((req) => (
            <button
              key={req.id}
              onClick={() => {
                setMatchedRequirement(req.id);
                setSelectedTierId(req.tierTarget);
              }}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between min-h-[80px] ${
                selectedTierId === req.tierTarget
                  ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-[10px] font-mono uppercase opacity-75">{req.badge}</span>
              <span className="leading-snug">{req.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Connected 5-Tier Continuum Flowchart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Customization Spectrum (Left to Right: Lowest to Highest Cost & Compute)
          </h3>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Tier {currentTier.tierNumber} of 5 Active
          </span>
        </div>

        {/* 5 Stepped Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {tiers.map((t, idx) => {
            const isSelected = t.id === selectedTierId;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTierId(t.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[155px] ${
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
                      T{t.tierNumber}
                    </span>
                    <span className={`text-[11px] font-mono font-bold ${
                      isSelected ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      {t.cost}
                    </span>
                  </div>

                  <h4 className={`text-xs sm:text-sm font-bold leading-snug ${
                    isSelected ? 'text-amber-300 font-extrabold' : 'text-slate-200'
                  }`}>
                    {t.shortName}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-800/80 mt-2 space-y-1 text-[10px] font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Weights:</span>
                    <span className={t.weightsUpdated ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {t.weightsUpdated ? 'UPDATED' : 'FROZEN'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Deep-Dive Details */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-inner">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm font-mono">
                T{currentTier.tierNumber}
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-black text-white">
                  {currentTier.name}
                </h4>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  Weight Modification: {currentTier.modifiesWeights}
                </span>
              </div>
            </div>

            {/* Prev / Next Tier Buttons & Linked Questions */}
            <div className="flex items-center space-x-2">
              {currentTierIndex > 0 && (
                <button
                  onClick={() => setSelectedTierId(tiers[currentTierIndex - 1].id)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev Tier</span>
                </button>
              )}
              {currentTierIndex < tiers.length - 1 && (
                <button
                  onClick={() => setSelectedTierId(tiers[currentTierIndex + 1].id)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1"
                >
                  <span className="hidden sm:inline">Next Tier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {currentTier.relatedQuestions.map((qId) => (
                <button
                  key={qId}
                  onClick={() => onSelectQuestion?.(qId)}
                  className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 transition-all flex items-center space-x-1"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Q#{qId}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Metric Comparison Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Relative Cost</span>
              <div className="text-sm font-black text-amber-400">{currentTier.cost}</div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: `${(currentTier.costScore / 5) * 100}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Data Volume</span>
              <div className="text-xs font-bold text-slate-200 truncate">{currentTier.dataReq.split('(')[0]}</div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full" style={{ width: `${(currentTier.dataReqScore / 5) * 100}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Compute Complexity</span>
              <div className="text-xs font-bold text-purple-300 truncate">{currentTier.computeRequired.split('(')[0]}</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Model Weights</span>
              <div className={`text-xs font-bold ${currentTier.weightsUpdated ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentTier.weightsUpdated ? 'Weights Modified' : 'Weights Frozen'}
              </div>
            </div>
          </div>

          {/* 2-Column Mechanism and Code Box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs sm:text-sm">
            
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
                <strong className="text-amber-400 uppercase tracking-wider text-xs font-mono block">
                  Detailed Operational Mechanism
                </strong>
                <p className="text-slate-300 leading-relaxed">
                  {currentTier.mechanism}
                </p>
                <div className="pt-2 text-slate-300">
                  <strong className="text-white">Optimal Use Cases: </strong>
                  {currentTier.bestFor}
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-2">
                <strong className="text-amber-300 uppercase tracking-wider text-xs font-mono block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AIF-C01 Exam Decision Rule
                </strong>
                <p className="text-amber-100 font-semibold leading-relaxed">
                  {currentTier.examRule}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Code & Data Sample
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  AWS Implementation
                </span>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed border border-slate-800/80">
                <code>{currentTier.exampleCode}</code>
              </pre>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Latency Impact: {currentTier.latencyImpact}</span>
                <span className="text-amber-400 font-mono font-bold">Tier {currentTier.tierNumber}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
