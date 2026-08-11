import React, { useState, useEffect } from 'react';
import { 
  Sliders, Zap, DollarSign, Database, Brain, Sparkles, 
  CheckCircle2, ArrowRight, ArrowLeft, ShieldAlert, Cpu, Layers, HelpCircle,
  BookOpen, Gauge, BarChart3, AlertTriangle, ArrowDown, Info
} from 'lucide-react';
import { NavigationOrigin } from '../../types';

interface ModelCustomizationVisualizerProps {
  onSelectQuestion?: (questionId: number, origin?: NavigationOrigin) => void;
  initialTierId?: string;
}

export const ModelCustomizationVisualizer: React.FC<ModelCustomizationVisualizerProps> = ({ 
  onSelectQuestion,
  initialTierId,
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>(initialTierId || 'prompt-eng');
  const [matchedRequirement, setMatchedRequirement] = useState<string>(initialTierId || 'prompt-eng');
  const [showWeightsExplainer, setShowWeightsExplainer] = useState<boolean>(true);

  useEffect(() => {
    if (initialTierId) {
      setSelectedTierId(initialTierId);
      setMatchedRequirement(initialTierId);
    }
  }, [initialTierId]);

  const tiers = [
    {
      id: 'prompt-eng',
      tierNumber: 1,
      name: '1. Prompt Engineering & In-Context Learning',
      shortName: 'Prompt Engineering',
      cost: 'Lowest ($)',
      costScore: 1,
      dataReq: '0 to 10 Examples (Zero-shot / Few-shot in prompt)',
      dataReqScore: 1,
      modifiesWeights: 'No (Model Weights are 100% FROZEN)',
      weightsUpdated: false,
      latencyImpact: 'Low to Medium (Depends on prompt token length)',
      computeRequired: 'Standard API Inference Call (No GPU training)',
      bestFor: 'Persona steering, output format templates, chain-of-thought (CoT) step-by-step reasoning, immediate testing.',
      mechanism: 'Crafting targeted instructions, system messages, and few-shot input/output examples directly in the inference request context window. The foundation model (FM) neural network weights remain completely unchanged.',
      examRule: 'Always evaluate Prompt Engineering first before considering heavier customization options (lowest effort, zero training cost, and fastest iteration).',
      exampleCode: `// Prompt Engineering API Request\nconst response = await bedrock.invokeModel({\n  modelId: "anthropic.claude-3-haiku",\n  prompt: "You are a customer support agent. Summarize this complaint in 2 bullet points:\\n..."\n});`,
      relatedQuestions: [8, 37, 78, 122, 428],
    },
    {
      id: 'rag',
      tierNumber: 2,
      name: '2. Retrieval-Augmented Generation (RAG)',
      shortName: 'RAG Knowledge Bases',
      cost: 'Low to Medium ($$)',
      costScore: 2,
      dataReq: 'Unstructured Enterprise Docs in Amazon S3 (No labeled training pairs)',
      dataReqScore: 2,
      modifiesWeights: 'No (Model Weights are 100% FROZEN)',
      weightsUpdated: false,
      latencyImpact: 'Adds vector similarity search retrieval overhead (~50-200ms)',
      computeRequired: 'Vector Database Indexing + Standard FM Inference',
      bestFor: 'Dynamic, private, or frequently updated enterprise knowledge with verifiable source citations and minimal hallucinations.',
      mechanism: 'Extracting semantic text chunks from Amazon Simple Storage Service (Amazon S3), generating vector embeddings via an embedding model (like Amazon Titan Text Embeddings), storing them in Amazon OpenSearch Serverless, and dynamically retrieving Top-K context chunks into the prompt.',
      examRule: 'Choose Retrieval-Augmented Generation (RAG) when the model needs current/private company data, factual grounding, or citations without modifying weights.',
      exampleCode: `// Bedrock Knowledge Base RAG Request\nconst result = await bedrockAgentRuntime.retrieveAndGenerate({\n  input: { text: "What is our 2026 expense policy?" },\n  retrieveAndGenerateConfiguration: {\n    type: "KNOWLEDGE_BASE",\n    knowledgeBaseConfiguration: { knowledgeBaseId: "KB-94812" }\n  }\n});`,
      relatedQuestions: [1, 10, 45, 421, 423, 426, 427, 443],
    },
    {
      id: 'fine-tuning',
      tierNumber: 3,
      name: '3. Supervised Fine-Tuning (Instruction Tuning / PEFT / LoRA)',
      shortName: 'Supervised Fine-Tuning',
      cost: 'Medium ($$$)',
      costScore: 3,
      dataReq: 'Hundreds to Thousands of Labeled Prompt-Response Pairs (JSON Lines / JSONL format)',
      dataReqScore: 3,
      modifiesWeights: 'Yes (Updates specific model weights or trains LoRA adapter layers)',
      weightsUpdated: true,
      latencyImpact: 'Zero additional latency (Model size & architecture unchanged)',
      computeRequired: 'Amazon Bedrock Custom Model Training Job',
      bestFor: 'Teaching a specific writing style, domain syntax, strict structured JSON schema, or consistent specialized task behavior.',
      mechanism: 'Supervised Fine-Tuning (SFT) adjusts the mathematical parameters (weights) of the neural network using curated prompt-completion pairs. With Parameter-Efficient Fine-Tuning (PEFT) and Low-Rank Adaptation (LoRA), base weights are frozen while lightweight adapter layers are trained, reducing GPU memory and compute by ~85%.',
      examRule: 'Choose Fine-Tuning when you need to change HOW the model responds (tone, style, output schema, specialized task pattern).',
      exampleCode: `// Training Data Format (train.jsonl)\n{"prompt": "Classify claim #892: Patient broke leg skiing", "completion": "CATEGORY: ORTHO_ACCIDENT | SEVERITY: HIGH"}\n{"prompt": "Classify claim #893: Annual dental checkup", "completion": "CATEGORY: DENTAL_ROUTINE | SEVERITY: LOW"}`,
      relatedQuestions: [5, 49, 110, 428, 438],
    },
    {
      id: 'continued-pretraining',
      tierNumber: 4,
      name: '4. Continued Pre-Training (Domain Adaptation Fine-Tuning / DAFT)',
      shortName: 'Continued Pre-Training',
      cost: 'High ($$$$)',
      costScore: 4,
      dataReq: 'Gigabytes of Unlabeled Domain Text (Millions of raw tokens)',
      dataReqScore: 4,
      modifiesWeights: 'Yes (Base foundation model weights are updated on raw domain text)',
      weightsUpdated: true,
      latencyImpact: 'Zero additional latency (Same base model architecture)',
      computeRequired: 'Distributed GPU/Trainium Clusters (AWS Trainium / P4/P5 EC2 instances)',
      bestFor: 'Teaching an existing foundation model deep domain-specific vocabulary, dense jargon, and concepts (e.g. legal case law, clinical medical journals, financial regulations).',
      mechanism: 'Continues the self-supervised pre-training objective on vast unlabeled domain text corpora so the base model internalizes domain knowledge into its internal parameters without training from scratch.',
      examRule: 'Choose Continued Pre-Training (DAFT) when an existing foundation model lacks understanding of specialized domain vocabulary or industry literature (e.g., Q438).',
      exampleCode: `// Raw Unlabeled Domain Text Ingestion\n"Section 14(a)(1) under SEC Rule 14a-8 requires registrant to include shareholder proposal unless excludable under subsection (i)(7)..."`,
      relatedQuestions: [50, 112, 438],
    },
    {
      id: 'pretraining-scratch',
      tierNumber: 5,
      name: '5. Pre-Training from Scratch',
      shortName: 'Pre-Training from Scratch',
      cost: 'Highest ($$$$$ Millions of Dollars)',
      costScore: 5,
      dataReq: 'Trillions of Unlabeled Tokens (Web-scale corpora across multiple languages)',
      dataReqScore: 5,
      modifiesWeights: 'Yes (Initializes all neural network weights randomly from scratch)',
      weightsUpdated: true,
      latencyImpact: 'Requires dedicated GPU clusters (Trainium / SageMaker HyperPod)',
      computeRequired: 'Thousands of AWS Trainium / NVIDIA H100 accelerators for months',
      bestFor: 'Creating a brand-new foundational architecture for proprietary national languages or highly specialized novel modalities.',
      mechanism: 'Training an entire foundation model from random weight initialization. Requires massive compute clusters (AWS Trainium, Amazon EC2 P5/Trn1 instances), multi-million dollar budgets, and months of engineering.',
      examRule: 'Almost NEVER the right choice in AIF-C01 exam scenarios due to extreme cost, compute, and time constraints.',
      exampleCode: `// Random Weight Initialization\nmodel = TransformerModel(vocab_size=64000, hidden_dim=8192, layers=64)\n// Distributed training on 2,048 AWS Trainium accelerators across 90 days...`,
      relatedQuestions: [51, 428, 439],
    },
  ];

  const currentTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];
  const currentTierIndex = tiers.findIndex((t) => t.id === currentTier.id);

  const handleSelectTier = (tierId: string) => {
    setSelectedTierId(tierId);
    setMatchedRequirement(tierId);
  };

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
            The 5 Foundation Model (FM) Customization Tiers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            AWS categorizes foundation model (FM) customization into 5 progressive tiers ranging from lightweight prompt engineering to pre-training from scratch. On the AWS Certified AI Practitioner exam, always select the lowest-complexity approach that satisfies the functional requirement.
          </p>
        </div>
      </div>

      {/* JARGON EXPLAINER: What are Model Weights & What is an FM? */}
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div 
          onClick={() => setShowWeightsExplainer(!showWeightsExplainer)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  Concept Breakdown for Beginners & Practitioners
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Exam Essential
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                What does "Model Weights" mean? And what is a "Foundation Model (FM)"?
              </h3>
            </div>
          </div>

          <button className="text-xs text-amber-300 font-bold px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">
            {showWeightsExplainer ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showWeightsExplainer && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
            
            {/* Box 1: What is a Foundation Model (FM)? */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="text-sm font-bold text-amber-300">
                  1. What is a Foundation Model (FM)?
                </h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                A <strong>Foundation Model (FM)</strong> is a massive, multi-purpose AI brain (like Anthropic Claude, Amazon Titan, or Meta Llama) pre-trained on billions of words from across the web.
              </p>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                <span className="text-amber-400 font-bold block">💡 Intuitive Analogy:</span>
                <p className="italic">
                  Instead of building an AI that only does one narrow math formula, an FM is like a university graduate with broad general reading, coding, translation, and reasoning skills. You can give them new instructions or reference books without having to send them back to university.
                </p>
              </div>
            </div>

            {/* Box 2: What are Model Weights? */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <h4 className="text-sm font-bold text-cyan-300">
                  2. What are "Model Weights" (Parameters)?
                </h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>Model Weights</strong> are the billions of internal mathematical coefficients (numbers) stored in neural network layers. They represent the AI's internal knowledge and determine how strongly one concept connects to another.
              </p>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 space-y-1.5">
                <span className="text-cyan-400 font-bold block">🎛️ The Sound Mixing Console Metaphor:</span>
                <p className="italic leading-relaxed">
                  Imagine a music studio soundboard with <strong>billions of microscopic volume sliders</strong>. 
                  Inputs (data/prompts) are multiplied by these sliders to produce the final song (prediction).
                </p>
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] not-italic font-mono">
                  <div className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-slate-300">
                    <span className="text-emerald-400 font-bold block">🔒 100% Frozen Weights:</span>
                    Prompt Eng & RAG (Sliders stay locked; model references facts in prompt).
                  </div>
                  <div className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-slate-300">
                    <span className="text-amber-400 font-bold block">⚙️ Updated Weights:</span>
                    Fine-Tuning (Sliders physically adjusted via GPU gradient descent).
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Weights vs Biases vs Hyperparameters */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
                  <h4 className="text-sm font-bold text-purple-300">
                    3. Quick Reference: Weights ($w$) vs. Biases ($b$) vs. Hyperparameters
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-purple-400/80">Domain 1 & 2 Core Distinction</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">Model Weights ($w$)</span>
                    <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded">Learned</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Multipliers that define connection strength between artificial neurons. Learned automatically during training backpropagation.
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300">Biases ($b$)</span>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Learned</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Baseline offset added to weighted sums $(\sum w \cdot x + b)$ to shift the neuron activation threshold. Also learned automatically.
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">Hyperparameters</span>
                    <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">Pre-set by Humans</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    External tuning knobs set <em>before</em> training/inference (e.g. Temperature, Top-P, Learning Rate, Batch Size, Epochs).
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
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
                onClick={() => handleSelectTier(t.id)}
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
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3 min-w-0">
              <span className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm font-mono flex-shrink-0 shadow-md shadow-amber-500/20">
                T{currentTier.tierNumber}
              </span>
              <div className="min-w-0">
                <h4 className="text-base sm:text-lg font-black text-white truncate">
                  {currentTier.name}
                </h4>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  Weight Modification: {currentTier.modifiesWeights}
                </span>
              </div>
            </div>

            {/* Prev / Next Tier Buttons & Linked Questions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center space-x-1.5 shrink-0">
                {currentTierIndex > 0 && (
                  <button
                    onClick={() => handleSelectTier(tiers[currentTierIndex - 1].id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1 shadow-sm"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Prev Tier</span>
                  </button>
                )}
                {currentTierIndex < tiers.length - 1 && (
                  <button
                    onClick={() => handleSelectTier(tiers[currentTierIndex + 1].id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1 shadow-sm"
                  >
                    <span>Next Tier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {currentTier.relatedQuestions && currentTier.relatedQuestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-semibold px-1">Practice:</span>
                  {currentTier.relatedQuestions.map((qId) => (
                    <button
                      key={qId}
                      onClick={() => onSelectQuestion?.(qId, {
                        view: 'visualizations',
                        tabId: 'model-customization',
                        sectionTitle: `Customization: Tier ${currentTier.tierNumber} (${currentTier.shortName})`,
                        subItemId: currentTier.id,
                      })}
                      className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 text-xs font-mono font-bold border border-amber-500/30 transition-all flex items-center space-x-1 shadow-sm"
                      title={`Test in MCQ: Question ${qId}`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Q#{qId}</span>
                    </button>
                  ))}
                </div>
              )}
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
