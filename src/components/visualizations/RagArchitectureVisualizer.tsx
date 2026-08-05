import React, { useState } from 'react';
import { 
  Database, FileText, Cpu, Search, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, Layers, HelpCircle, BookOpen, AlertTriangle
} from 'lucide-react';

interface RagArchitectureVisualizerProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const RagArchitectureVisualizer: React.FC<RagArchitectureVisualizerProps> = ({ onSelectQuestion }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activePhase, setActivePhase] = useState<'ingestion' | 'inference'>('inference');

  const ingestionSteps = [
    {
      id: 1,
      title: '1. Source Documents & S3 Storage',
      service: 'Amazon S3 / Knowledge Base Data Source',
      description: 'Enterprise documents (PDFs, Markdown, Word, CSV, HTML) stored securely in Amazon S3 buckets with IAM least-privilege access and S3 Lifecycle rules.',
      examClue: 'Knowledge Base documents reside in Amazon S3; sync jobs ingest new or updated files.',
      relatedQuestions: [427, 434, 439],
    },
    {
      id: 2,
      title: '2. Document Parsing & Text Extraction',
      service: 'Amazon Bedrock / Amazon Textract',
      description: 'Parsing engine extracts raw text, tables, and document structure. If documents are scanned PDFs or images, Amazon Textract is used to extract form key-value pairs.',
      examClue: 'First step in Bedrock Knowledge Base ingestion is to Parse documents.',
      relatedQuestions: [427, 433],
    },
    {
      id: 3,
      title: '3. Text Chunking Strategy',
      service: 'Bedrock Chunking (Fixed-size / Hierarchical / Semantic)',
      description: 'Splits large documents into manageable text chunks with configurable token sizes (e.g. 300 tokens) and overlap (e.g. 20%) to preserve context boundaries within model limits.',
      examClue: 'Chunking ensures data fits token context limits while keeping semantic continuity.',
      relatedQuestions: [427],
    },
    {
      id: 4,
      title: '4. Vector Embedding Generation',
      service: 'Amazon Titan Embeddings / Cohere Embed',
      description: 'Each text chunk is converted into a high-dimensional mathematical vector (embedding) that captures deep semantic meaning and conceptual relationships.',
      examClue: 'Embedding models convert text chunks into vector representations.',
      relatedQuestions: [421, 427],
    },
    {
      id: 5,
      title: '5. Vector Store & Indexing',
      service: 'Amazon OpenSearch Serverless / Kendra / Amazon Aurora pgvector',
      description: 'Vector embeddings along with source chunk text and metadata are written into a managed vector database configured for approximate nearest neighbor (k-NN) similarity search.',
      examClue: 'Amazon OpenSearch Serverless is the default managed vector store for Bedrock Knowledge Bases.',
      relatedQuestions: [421, 427],
    },
  ];

  const inferenceSteps = [
    {
      id: 1,
      title: '1. User Prompt & Query Submission',
      service: 'Client Application / Amazon Bedrock API',
      description: 'The end-user enters a natural language question (e.g., "What are our 2026 remote work travel expense limits?").',
      examClue: 'User questions may require fresh, internal, or proprietary knowledge not in pre-training weights.',
      relatedQuestions: [421, 423],
    },
    {
      id: 2,
      title: '2. Query Vectorization',
      service: 'Embedding Model (e.g. Amazon Titan Text Embeddings)',
      description: 'The user\'s query is converted on-the-fly into a dense vector embedding using the EXACT SAME embedding model that indexed the knowledge base.',
      examClue: 'Query and documents MUST be embedded using the same vector dimensions and embedding model.',
      relatedQuestions: [421, 427],
    },
    {
      id: 3,
      title: '3. Vector Similarity Search (Top-K Retrieval)',
      service: 'Vector Database (e.g. OpenSearch Serverless / Kendra)',
      description: 'The vector store executes cosine similarity or dot product search to find the Top-K most semantically relevant text chunks from the enterprise index.',
      examClue: 'Context Relevance evaluates if retrieved chunks actually match the user\'s intent.',
      relatedQuestions: [421, 426],
    },
    {
      id: 4,
      title: '4. Prompt Augmentation & Guardrails',
      service: 'Amazon Bedrock Knowledge Base & Guardrails',
      description: 'The system combines original user prompt + retrieved authoritative context chunks + system instructions + safety guardrails into an augmented prompt payload.',
      examClue: 'RAG grounds the model by providing authoritative context in the prompt payload.',
      relatedQuestions: [421, 423, 443],
    },
    {
      id: 5,
      title: '5. Foundation Model Inference & Grounded Answer',
      service: 'Amazon Bedrock FM (Claude 3.5 / Nova Pro / Llama 3)',
      description: 'The Foundation Model synthesizes the retrieved context and answers the query with source citations, minimizing hallucinations and ensuring enterprise accuracy.',
      examClue: 'Faithfulness metric evaluates whether generated answers are strictly supported by retrieved context.',
      relatedQuestions: [421, 423, 426, 443],
    },
  ];

  const currentSteps = activePhase === 'ingestion' ? ingestionSteps : inferenceSteps;
  const selectedStepData = currentSteps.find((s) => s.id === activeStep) || currentSteps[0];

  return (
    <div className="space-y-6">
      {/* Overview Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-md font-bold">
                AIF-C01 Core Architecture
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-md">
                High-Frequency Topic
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
              Retrieval-Augmented Generation (RAG) Architecture & Flow
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-3xl">
              RAG connects pre-trained foundation models to dynamic, proprietary enterprise data without fine-tuning model weights—significantly reducing hallucinations and keeping answers current.
            </p>
          </div>

          {/* Phase Selector Toggle */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => {
                setActivePhase('inference');
                setActiveStep(1);
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activePhase === 'inference'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phase 2: Runtime Inference Flow
            </button>
            <button
              onClick={() => {
                setActivePhase('ingestion');
                setActiveStep(1);
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activePhase === 'ingestion'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phase 1: Ingestion Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Visual Pipeline Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            {activePhase === 'ingestion' ? 'Document Ingestion & Indexing Flow' : 'Runtime Query & Grounded Generation Flow'}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Click any step to inspect technical details
          </span>
        </div>

        {/* Step Nodes Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
          {currentSteps.map((step) => {
            const isSelected = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 relative flex flex-col justify-between min-h-[130px] group ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`w-7 h-7 rounded-lg text-xs font-mono font-black flex items-center justify-center ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {step.id}
                    </span>
                    {isSelected && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                    )}
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold leading-snug ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                    {step.title.replace(/^\d+\.\s*/, '')}
                  </h4>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-2 truncate">
                  {step.service}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Step Inspector Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm font-mono">
                {selectedStepData.id}
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {selectedStepData.title}
                </h4>
                <p className="text-xs text-amber-400 font-mono font-medium">
                  AWS Service: {selectedStepData.service}
                </p>
              </div>
            </div>
            
            {/* Related Questions Badges */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Related Exam Qs:</span>
              {selectedStepData.relatedQuestions.map((qId) => (
                <button
                  key={qId}
                  onClick={() => onSelectQuestion?.(qId)}
                  className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 transition-colors"
                  title={`Jump to Question ${qId} in Practice Bank`}
                >
                  Q{qId}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Exam Takeaway */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="font-bold text-slate-200 flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-wide text-amber-400">
                <BookOpen className="w-4 h-4" /> Technical Mechanism
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedStepData.description}
              </p>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-400" /> AIF-C01 Exam Rule
              </div>
              <p className="text-amber-100 leading-relaxed font-medium">
                {selectedStepData.examClue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Stage Evaluation Framework for RAG */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Two-Stage RAG Evaluation Framework (Crucial Exam Concept)
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          When an enterprise RAG chatbot provides incomplete or inaccurate answers (as in Question 426), you must evaluate the system in two distinct stages to isolate the root cause:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Stage 1: Retrieval Evaluation */}
          <div className="bg-slate-950 border border-blue-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                Stage 1: Retrieval Quality
              </span>
              <span className="text-xs text-slate-400">Vector Store & Top-K</span>
            </div>
            <h4 className="text-base font-bold text-white">Context Relevance & Context Coverage</h4>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-2 list-disc list-inside">
              <li><strong>Context Relevance:</strong> Are the retrieved chunks actually relevant to the user query, or is noise being fetched?</li>
              <li><strong>Context Coverage / Recall:</strong> Did retrieval retrieve ALL necessary facts required to answer the prompt?</li>
            </ul>
            <div className="text-xs bg-blue-950/60 p-2.5 rounded-lg border border-blue-800 text-blue-200">
              <strong>Fix for Failure:</strong> Adjust chunk size/overlap, switch embedding models, or refine vector search filters.
            </div>
          </div>

          {/* Stage 2: Generation Evaluation */}
          <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                Stage 2: Generation Quality
              </span>
              <span className="text-xs text-slate-400">Foundation Model</span>
            </div>
            <h4 className="text-base font-bold text-white">Faithfulness & Completeness</h4>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-2 list-disc list-inside">
              <li><strong>Faithfulness (Groundedness):</strong> Is every claim in the generated answer strictly supported by the retrieved context? (Low faithfulness = hallucination).</li>
              <li><strong>Answer Completeness:</strong> Did the generated answer fully address the user prompt using the retrieved context?</li>
            </ul>
            <div className="text-xs bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800 text-emerald-200">
              <strong>Fix for Failure:</strong> Refine system prompt instructions, adjust temperature downward, or use Bedrock Guardrails.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
