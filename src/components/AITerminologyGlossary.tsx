import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, Sparkles, HelpCircle, X, ChevronDown, 
  ChevronUp, Brain, Cpu, Layers, ShieldCheck, Activity, BarChart3,
  Lightbulb, CheckCircle2, ArrowRight
} from 'lucide-react';

export interface TermDefinition {
  id: string;
  term: string;
  abbreviation?: string;
  fullExpansion: string;
  category: 'core-genai' | 'ml-weights-training' | 'metrics-eval' | 'safety-governance' | 'aws-services';
  plainEnglishExplanation: string;
  analogyOrMetaphor: string;
  examContext: string;
  keyPoints: string[];
}

export const AI_TERMS_DICTIONARY: TermDefinition[] = [
  {
    id: 'model-weights',
    term: 'Model Weights (Parameters)',
    abbreviation: 'Weights / Params',
    fullExpansion: 'Internal Neural Network Weights & Biases',
    category: 'ml-weights-training',
    plainEnglishExplanation: 'Model weights are the billions of mathematical numbers (coefficients) stored inside the neural network that represent its learned knowledge and memory. When you send a prompt, the model multiplies words by these weights to calculate the probability of the next word.',
    analogyOrMetaphor: 'Think of model weights as billions of tiny tuning dials or knobs inside a musical synthesizer. When training is complete, the knobs are set in place. "Frozen weights" means you leave the knobs locked and only change what sheet music you slide in front of the musician (Prompting/RAG). "Fine-tuning" means slightly turning a few knobs to master a new song style.',
    examContext: 'Critical for Customization questions: Prompt Engineering & RAG do NOT change model weights (weights are frozen). Fine-Tuning, Continued Pre-Training, and Training from Scratch DO change weights.',
    keyPoints: [
      'Weights = The internal learned values (parameters) of the AI.',
      'Frozen Weights = No training needed; zero risk of catastrophic forgetting.',
      'Updated Weights = Model actually modifies its internal brain parameters using GPU training jobs.'
    ]
  },
  {
    id: 'fm',
    term: 'Foundation Model',
    abbreviation: 'FM',
    fullExpansion: 'Foundation Model (FM)',
    category: 'core-genai',
    plainEnglishExplanation: 'A Foundation Model is a massive, versatile deep-learning model (such as Anthropic Claude, Amazon Titan, or Meta Llama) trained on broad, web-scale datasets. Unlike traditional narrow ML models built for only one single task (like predicting house prices), an FM serves as a general-purpose foundation for text, code, images, and complex reasoning.',
    analogyOrMetaphor: 'Think of an FM as a college graduate with broad general knowledge across history, science, language, and math. You can now give them a 1-page instruction guide (Prompt) or a company handbook (RAG) to do a specialized job without sending them back to school for 4 years.',
    examContext: 'Amazon Bedrock is a fully managed service that provides serverless API access to top foundation models (FMs) from Amazon, Anthropic, AI21 Labs, Cohere, Meta, and Mistral.',
    keyPoints: [
      'Trained on massive, unlabeled, heterogeneous data (self-supervised learning).',
      'Adaptable to thousands of downstream tasks with minimal customization.',
      'Accessible via serverless API calls in Amazon Bedrock or deployable in Amazon SageMaker JumpStart.'
    ]
  },
  {
    id: 'llm',
    term: 'Large Language Model',
    abbreviation: 'LLM',
    fullExpansion: 'Large Language Model (LLM)',
    category: 'core-genai',
    plainEnglishExplanation: 'A specific type of Foundation Model trained primarily on textual data with billions of parameters (weights) to understand, summarize, translate, and generate human-like language.',
    analogyOrMetaphor: 'An ultra-advanced statistical word autocomplete engine that has read virtually the entire public internet, allowing it to predict contextually accurate next words with deep linguistic comprehension.',
    examContext: 'Used for text summarization, Q&A, sentiment reasoning, and conversational chatbots.',
    keyPoints: [
      'Processes text tokens through Transformer attention mechanisms.',
      'Examples: Claude 3.5 Sonnet, Amazon Titan Text, Meta Llama 3.'
    ]
  },
  {
    id: 'rag',
    term: 'Retrieval-Augmented Generation',
    abbreviation: 'RAG',
    fullExpansion: 'Retrieval-Augmented Generation (RAG)',
    category: 'core-genai',
    plainEnglishExplanation: 'An architectural pattern where a model retrieves relevant documents from an external company knowledge base (like Amazon S3 indexed in OpenSearch Serverless), inserts those facts into the prompt context, and instructs the Foundation Model to generate an answer grounded strictly in those retrieved facts.',
    analogyOrMetaphor: 'An open-book exam: Instead of asking a student to answer from raw memory (which might cause them to guess or make things up), you hand them the exact textbook pages relevant to the question before they write their answer.',
    examContext: 'The #1 answer when business requirements ask for dynamic/private data, source citations/attributions, access controls (ACLs), and preventing hallucinations—all with ZERO model retraining.',
    keyPoints: [
      'Model weights remain 100% frozen (no fine-tuning).',
      'Eliminates hallucinations by grounding responses in verified source documents.',
      'Native in AWS via Amazon Bedrock Knowledge Bases.'
    ]
  },
  {
    id: 'ocr',
    term: 'Optical Character Recognition',
    abbreviation: 'OCR',
    fullExpansion: 'Optical Character Recognition (OCR)',
    category: 'aws-services',
    plainEnglishExplanation: 'The computer vision technology that converts printed or handwritten text inside scanned documents, PDF forms, invoices, and images into machine-readable digital text.',
    analogyOrMetaphor: 'Giving a blind computer digital "eyes" that can read physical paper documents and type out the words into an editable spreadsheet.',
    examContext: 'Amazon Textract is the specialized AWS OCR service that extracts structured tables, key-value form fields, and identity documents (unlike raw vision OCR which only returns flat text lines).',
    keyPoints: [
      'Amazon Textract = Advanced OCR with Table, Form, and Query extraction.',
      'Amazon Rekognition = General image/video object and facial analysis with basic text-in-image detection.'
    ]
  },
  {
    id: 'embeddings',
    term: 'Vector Embeddings',
    abbreviation: 'Embeddings',
    fullExpansion: 'High-Dimensional Vector Embeddings',
    category: 'core-genai',
    plainEnglishExplanation: 'A mathematical representation of text, images, or audio as a list of numbers (a vector, e.g., 1536 floating-point values) that captures semantic meaning. Words or passages with similar conceptual meanings are positioned close together in geometric vector space.',
    analogyOrMetaphor: 'GPS coordinates for ideas: "King" and "Queen" share very close coordinates on the map of human language, while "Submarine" is located far away.',
    examContext: 'Generated by embedding models (like Amazon Titan Text Embeddings v2). Stored in vector databases (Amazon OpenSearch Serverless, Amazon Aurora pgvector, Amazon Neptune) to power semantic search in RAG.',
    keyPoints: [
      'Converts words into arrays of floating-point numbers.',
      'Enables similarity search based on meaning rather than exact keyword spelling matches.',
      'Distance metrics: Cosine Similarity, Dot Product, Euclidean Distance.'
    ]
  },
  {
    id: 'chunking',
    term: 'Document Chunking',
    abbreviation: 'Chunking',
    fullExpansion: 'Document Semantic Chunking & Overlap',
    category: 'core-genai',
    plainEnglishExplanation: 'The pre-processing step of dividing long documents (like 100-page policy manuals) into smaller, bite-sized passages (e.g. 500 tokens each with a 50-token overlap) so they fit inside context window limits and match user queries precisely.',
    analogyOrMetaphor: 'Cutting a long book into index cards with a 1-sentence overlap between cards so no sentence gets cut in half mid-thought.',
    examContext: 'Configured in Amazon Bedrock Knowledge Bases data ingestion sync. Chunk overlap ensures sentences spanning chunk boundaries preserve full semantic meaning.',
    keyPoints: [
      'Fixed-size chunking (e.g., 300-1000 tokens).',
      'Chunk overlap prevents loss of context at the boundary edges.',
      'Semantic chunking splits text naturally by headers, paragraphs, or markdown sections.'
    ]
  },
  {
    id: 'temperature-top-p',
    term: 'Temperature & Top-P / Top-K',
    abbreviation: 'Inference Parameters',
    fullExpansion: 'Sampling Hyperparameters (Temperature, Top-P, Top-K)',
    category: 'core-genai',
    plainEnglishExplanation: 'Settings that control how creative, random, or predictable a model is when choosing the next word in its response.',
    analogyOrMetaphor: 'Temperature is the "creativity dial": Set to 0.0, the model acts like a strict math professor picking the single most probable word every time. Set to 0.9, it acts like a freewheeling poet exploring unusual, colorful vocabulary.',
    examContext: 'Temperature = 0.0 to 0.2 for factual extraction, math, coding, and compliance tasks. Temperature = 0.7 to 1.0 for creative writing and brainstorming.',
    keyPoints: [
      'Temperature: Controls randomness (lower = deterministic/factual, higher = creative).',
      'Top-P (Nucleus Sampling): Limits candidate words to the top P percentile of cumulative probability (e.g., 0.9 = top 90%).',
      'Top-K: Restricts candidate tokens strictly to the K most likely next words.'
    ]
  },
  {
    id: 'hallucination',
    term: 'AI Hallucination',
    abbreviation: 'Hallucination',
    fullExpansion: 'Generative AI Hallucination / Fact Fabrication',
    category: 'core-genai',
    plainEnglishExplanation: 'When a generative AI model generates plausible-sounding, confident, and grammatically correct answers that are factually false, inaccurate, or fabricated.',
    analogyOrMetaphor: 'A confident student on a trivia show who does not know the answer, but invents a believable-sounding history fact rather than admitting "I do not know".',
    examContext: 'Mitigated using Retrieval-Augmented Generation (RAG) for factual grounding, Amazon Bedrock Guardrails for contextual grounding checks, few-shot prompt constraints, and setting Temperature to 0.0.',
    keyPoints: [
      'Occurs because LLMs are probabilistic word predictors, not factual databases.',
      'Best mitigation: RAG + System prompts instructing "Only answer using provided documents".'
    ]
  },
  {
    id: 'guardrails',
    term: 'Bedrock Guardrails',
    abbreviation: 'Guardrails',
    fullExpansion: 'Amazon Bedrock Multi-Layer Guardrails',
    category: 'safety-governance',
    plainEnglishExplanation: 'A dedicated safety and governance layer that inspects user prompt inputs and model output responses against enterprise policies to block denied topics, redact sensitive personal data (PII), filter profanity, and prevent prompt injection attacks.',
    analogyOrMetaphor: 'A high-security airport security checkpoint that screens both the passenger walking into the plane (user prompt) and the luggage coming out (model response) to ensure no hazardous items pass through.',
    examContext: 'Works across ALL foundation models in Amazon Bedrock (and even custom models). Evaluates 5 layers: Content Filters, Denied Topics, Word Filters, PII Masking/Redaction, and Contextual Grounding.',
    keyPoints: [
      'Independent from foundation models (can attach to any model invocation or RAG flow).',
      'Redacts or blocks Personally Identifiable Information (PII) like SSNs, credit cards, emails.',
      'Blocks prompt injection and jailbreaking attempts.'
    ]
  },
  {
    id: 'pii-phi',
    term: 'PII & PHI',
    abbreviation: 'PII / PHI',
    fullExpansion: 'Personally Identifiable Information (PII) & Protected Health Information (PHI)',
    category: 'safety-governance',
    plainEnglishExplanation: 'Sensitive private information that can identify an individual (PII: Social Security Numbers, names, addresses, credit cards) or medical data (PHI: patient diagnosis, medical record numbers).',
    analogyOrMetaphor: 'Confidential identity papers that must be blacked out with a marker (redacted) before sharing a document publicly.',
    examContext: 'Amazon Comprehend detects and redacts PII/PHI entities. Amazon Comprehend Medical detects specialized clinical entities. Bedrock Guardrails masks or blocks PII in real time.',
    keyPoints: [
      'Comprehend: General PII redaction.',
      'Comprehend Medical: HIPAA-eligible PHI and medical entity extraction.',
      'Guardrails: Real-time PII anonymization and masking during model inference.'
    ]
  },
  {
    id: 'peft-lora',
    term: 'PEFT & LoRA',
    abbreviation: 'PEFT / LoRA',
    fullExpansion: 'Parameter-Efficient Fine-Tuning (PEFT) & Low-Rank Adaptation (LoRA)',
    category: 'ml-weights-training',
    plainEnglishExplanation: 'An efficient technique for fine-tuning massive models where the original billions of base model weights are frozen (locked), and only small, lightweight adapter layers (a tiny fraction of parameters) are trained.',
    analogyOrMetaphor: 'Instead of rebuilding the entire engine of an airplane to fly in cold weather, you just snap on a lightweight winter wing attachment that changes how the plane handles ice without altering the core engine.',
    examContext: 'Saves 80-90% of GPU compute and memory costs during fine-tuning. Prevents catastrophic forgetting of general base knowledge.',
    keyPoints: [
      'Freezes base model weights and trains low-rank adapter matrices.',
      'Dramatic reduction in GPU training cost and storage footprint.',
      'Supported in Amazon Bedrock Custom Model fine-tuning.'
    ]
  },
  {
    id: 'data-drift-concept-drift',
    term: 'Data Drift vs. Concept Drift',
    abbreviation: 'Drift',
    fullExpansion: 'Data (Feature) Drift vs. Concept (Target) Drift',
    category: 'ml-weights-training',
    plainEnglishExplanation: 'Data Drift means the input data distribution received in production has changed compared to training data. Concept Drift means the underlying real-world relationship between inputs and output targets has changed.',
    analogyOrMetaphor: 'Data Drift: A real estate model was trained on suburban houses, but users start submitting downtown luxury condos (inputs look different). Concept Drift: A house pricing model was trained in 2019, but inflation and interest rates tripled in 2023 so the exact same house now sells for 50% more (relationship between features and price changed).',
    examContext: 'Monitored continuously in production using Amazon SageMaker Model Monitor with Amazon CloudWatch alarms trigger automated retraining pipelines.',
    keyPoints: [
      'Data Drift (Feature Drift): P(X) changes. Input distribution shifts over time.',
      'Concept Drift (Prediction Drift): P(Y|X) changes. Target relationship shifts.',
      'Amazon SageMaker Model Monitor detects both types in real time.'
    ]
  },
  {
    id: 'confusion-matrix',
    term: 'Confusion Matrix (TP, FP, TN, FN)',
    abbreviation: 'Confusion Matrix',
    fullExpansion: 'Classification Confusion Matrix (True/False Positives & Negatives)',
    category: 'metrics-eval',
    plainEnglishExplanation: 'A 2x2 performance measurement table comparing actual real-world truth against model predictions to calculate accuracy, precision, and recall.',
    analogyOrMetaphor: 'A scoreboard with 4 boxes: 1) Correctly sounded fire alarm during a real fire (TP), 2) False alarm burned toast (FP / Type I Error), 3) Quiet room when no fire (TN), 4) Dangerous silent detector when real fire is burning (FN / Type II Error).',
    examContext: 'Fundamental for Domain 1 & 2 evaluation questions. High cost of False Positives -> Optimize Precision. High cost of False Negatives (Cancer, Fraud) -> Optimize Recall.',
    keyPoints: [
      'TP (True Positive): Model said Yes, and reality is Yes.',
      'FP (False Positive / Type I): Model said Yes, but reality is No (False Alarm).',
      'TN (True Negative): Model said No, and reality is No (Correct Rejection).',
      'FN (False Negative / Type II): Model said No, but reality is Yes (Dangerous Miss).'
    ]
  },
  {
    id: 'precision-recall-f1',
    term: 'Precision, Recall & F1-Score',
    abbreviation: 'Precision / Recall / F1',
    fullExpansion: 'Evaluation Metrics: Precision, Recall (Sensitivity), and Harmonic F1',
    category: 'metrics-eval',
    plainEnglishExplanation: 'Precision measures how many of the positively predicted items were actually correct. Recall measures what percentage of all actual positive items the model successfully caught. F1-Score is the balanced harmonic mean between both.',
    analogyOrMetaphor: 'Fishing with a net: Precision asks "Out of all fish you caught in the net, how many were edible fish and not old boots?" Recall asks "Out of all edible fish swimming in the entire lake, what percentage did your net catch?"',
    examContext: 'Fraud detection & medical diagnosis require HIGH RECALL (minimize False Negatives / missed fraud). Spam filters & automated account bans require HIGH PRECISION (minimize False Positives / banning innocent users).',
    keyPoints: [
      'Precision = TP / (TP + FP) -> Focus on avoiding false alarms.',
      'Recall = TP / (TP + FN) -> Focus on catching every single positive case.',
      'F1-Score = 2 * (Precision * Recall) / (Precision + Recall) -> Harmonizes both.'
    ]
  },
  {
    id: 'bleu-rouge-bertscore',
    term: 'BLEU, ROUGE & BERTScore',
    abbreviation: 'LLM Evaluation Metrics',
    fullExpansion: 'Bilingual Evaluation Understudy (BLEU), ROUGE, and BERTScore',
    category: 'metrics-eval',
    plainEnglishExplanation: 'Automated evaluation metrics for generative text. BLEU evaluates machine translation accuracy via n-gram precision. ROUGE evaluates text summarization quality via n-gram recall. BERTScore evaluates semantic contextual similarity using transformer embeddings.',
    analogyOrMetaphor: 'A robotic grader that checks if a student summary contains the same key words as the teacher master answer key (ROUGE), or checks if the translation preserved exact phrases (BLEU).',
    examContext: 'ROUGE is the gold standard for text summarization. BLEU is standard for language translation. Amazon Bedrock Model Evaluation supports automated benchmarking with these metrics.',
    keyPoints: [
      'BLEU: N-gram precision for Machine Translation.',
      'ROUGE: N-gram recall for Text Summarization (ROUGE-1, ROUGE-2, ROUGE-L).',
      'BERTScore: Embedding-based semantic similarity (understands synonyms).'
    ]
  },
  {
    id: 'mlops',
    term: 'Machine Learning Operations',
    abbreviation: 'MLOps',
    fullExpansion: 'Machine Learning Operations (MLOps)',
    category: 'ml-weights-training',
    plainEnglishExplanation: 'The engineering discipline and set of practices that automates, tests, deploys, and monitors machine learning models in production reliably and repeatably (DevOps applied to ML pipelines).',
    analogyOrMetaphor: 'The assembly line and maintenance crew that keeps race cars (AI models) built, inspected, fueled, and monitored throughout the entire championship season.',
    examContext: 'Implemented in AWS using Amazon SageMaker Pipelines (CI/CD), Model Registry (versioning & approvals), Model Monitor (drift detection), and Clarify (bias checking).',
    keyPoints: [
      'Automates data prep, model training, model evaluation, and deployment.',
      'Enforces auditability, governance, and automated retraining triggers.'
    ]
  },
  {
    id: 'asr-tts',
    term: 'ASR & TTS',
    abbreviation: 'ASR / TTS',
    fullExpansion: 'Automated Speech Recognition (ASR) & Text-to-Speech (TTS)',
    category: 'aws-services',
    plainEnglishExplanation: 'ASR converts spoken audio speech into written text. TTS converts written digital text into natural, lifelike spoken audio speech.',
    analogyOrMetaphor: 'ASR is a court stenographer listening to speech and typing it out. TTS is an audiobook voice actor reading written words out loud.',
    examContext: 'Amazon Transcribe = Automated Speech Recognition (ASR). Amazon Polly = Text-to-Speech (TTS) with Neural voice synthesis.',
    keyPoints: [
      'Amazon Transcribe: Speech-to-Text with multi-speaker diarization and custom vocabulary.',
      'Amazon Polly: Text-to-Speech with Speech Synthesis Markup Language (SSML) and Neural TTS.'
    ]
  },
  {
    id: 'nlp-nlu-nlg',
    term: 'NLP, NLU & NLG',
    abbreviation: 'NLP / NLU / NLG',
    fullExpansion: 'Natural Language Processing (NLP), Understanding (NLU), and Generation (NLG)',
    category: 'core-genai',
    plainEnglishExplanation: 'NLP is the broad field of computer science enabling machines to process human language. NLU is the subfield focused on understanding intent, sentiment, and entities. NLG is the subfield focused on generating coherent text.',
    analogyOrMetaphor: 'NLP is the overall study of linguistics. NLU is understanding what someone means when they speak. NLG is crafting an eloquent spoken reply.',
    examContext: 'Amazon Comprehend handles NLU (sentiment, syntax, entities, key phrases). Amazon Bedrock LLMs handle advanced NLG & reasoning. Amazon Lex handles conversational NLU bot intent recognition.',
    keyPoints: [
      'NLP = The parent domain of computational linguistics.',
      'NLU = Comprehension (e.g. sentiment analysis, intent classification).',
      'NLG = Generation (e.g. writing articles, code, summaries).'
    ]
  }
];

interface AITerminologyGlossaryProps {
  onSelectQuestion?: (questionId: number) => void;
  isOpenDefault?: boolean;
  compactMode?: boolean;
}

export const AITerminologyGlossary: React.FC<AITerminologyGlossaryProps> = ({
  isOpenDefault = false,
  compactMode = false
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(isOpenDefault);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Terms' },
    { id: 'ml-weights-training', label: 'Weights & Training' },
    { id: 'core-genai', label: 'GenAI & RAG' },
    { id: 'safety-governance', label: 'Guardrails & Safety' },
    { id: 'metrics-eval', label: 'Evaluation & Metrics' },
    { id: 'aws-services', label: 'AWS AI Services' },
  ];

  const filteredTerms = useMemo(() => {
    return AI_TERMS_DICTIONARY.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' ||
        item.term.toLowerCase().includes(q) ||
        (item.abbreviation && item.abbreviation.toLowerCase().includes(q)) ||
        item.fullExpansion.toLowerCase().includes(q) ||
        item.plainEnglishExplanation.toLowerCase().includes(q) ||
        item.analogyOrMetaphor.toLowerCase().includes(q) ||
        item.examContext.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-xl overflow-hidden transition-all">
      {/* Header Banner Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-800/80 transition-all select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Exam Readiness Glossary
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                {AI_TERMS_DICTIONARY.length} Key Terms Explained
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
              <span>Plain-English AI Terminology & Acronym Explainer</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline text-xs text-amber-300 font-semibold">
            {isOpen ? 'Collapse Glossary' : 'Click to Expand & Learn Terms'}
          </span>
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-400">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expandable Body Content */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-slate-800 space-y-4 bg-slate-950/60">
          
          {/* Quick Context Subhead */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200/90 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Why this matters for AIF-C01:</strong> Machine learning and generative AI use specific terms like <em>Model Weights</em>, <em>Foundation Models (FM)</em>, <em>Embeddings</em>, and acronyms like <em>OCR</em> or <em>RAG</em> that can be confusing. Browse or search any term below for intuitive analogies and exam-specific takeaways.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search terms (e.g. Model Weights, FM, OCR, RAG, LoRA, Precision, Drift)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {filteredTerms.map((term) => {
              const isExpanded = expandedTermId === term.id;
              return (
                <div
                  key={term.id}
                  className={`border rounded-xl transition-all ${
                    isExpanded 
                      ? 'bg-slate-900 border-amber-500/60 shadow-lg ring-1 ring-amber-500/20' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div 
                    onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                    className="p-4 cursor-pointer flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        {term.abbreviation && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/30">
                            {term.abbreviation}
                          </span>
                        )}
                        <h4 className="text-sm font-black text-white">
                          {term.term}
                        </h4>
                      </div>
                      <div className="text-xs text-amber-400/90 font-medium">
                        {term.fullExpansion}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1 line-clamp-2">
                        {term.plainEnglishExplanation}
                      </p>
                    </div>

                    <div className="p-1 rounded-lg bg-slate-800/80 text-slate-400 shrink-0 mt-1">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Expanded In-Depth View */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3 text-xs animate-in fade-in duration-200">
                      
                      {/* Intuitive Analogy */}
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/90 space-y-1">
                        <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                          <Lightbulb className="w-3.5 h-3.5" />
                          Intuitive Analogy / Metaphor:
                        </span>
                        <p className="text-slate-200 leading-relaxed italic">
                          "{term.analogyOrMetaphor}"
                        </p>
                      </div>

                      {/* Exam Relevance */}
                      <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-800/30 space-y-1">
                        <span className="text-amber-300 font-bold flex items-center gap-1 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          AIF-C01 Exam Context:
                        </span>
                        <p className="text-amber-100 leading-relaxed">
                          {term.examContext}
                        </p>
                      </div>

                      {/* Key Bullet Points */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                          Key Memory Points:
                        </span>
                        <ul className="space-y-1">
                          {term.keyPoints.map((kp, idx) => (
                            <li key={idx} className="text-slate-300 flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};
