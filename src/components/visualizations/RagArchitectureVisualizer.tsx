import React, { useState } from 'react';
import { 
  Database, FileText, Cpu, Search, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, Layers, HelpCircle, BookOpen, AlertTriangle,
  Server, ArrowDown, HardDrive, RefreshCw, Filter, Zap, Activity
} from 'lucide-react';

interface RagArchitectureVisualizerProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const RagArchitectureVisualizer: React.FC<RagArchitectureVisualizerProps> = ({ onSelectQuestion }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activePhase, setActivePhase] = useState<'ingestion' | 'inference'>('ingestion');
  const [simulationPrompt, setSimulationPrompt] = useState<string>(
    'What is our enterprise remote work travel expense policy?'
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const ingestionSteps = [
    {
      id: 1,
      title: '1. Source Documents in S3',
      shortTitle: 'S3 Documents',
      service: 'Amazon S3 Bucket',
      icon: HardDrive,
      accentColor: 'from-amber-500 to-orange-600',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Enterprise documents (PDFs, Markdown, Word, CSV, HTML) stored securely in Amazon S3 buckets with IAM least-privilege access, KMS encryption, and S3 Lifecycle rules.',
      examClue: 'Knowledge Base documents reside in Amazon S3; sync jobs ingest new or updated files.',
      payloadExample: `s3://enterprise-kb-docs-prod/policies/\n├── 2026_Travel_Expenses_Policy.pdf\n├── HR_Remote_Work_Guidelines.docx\n└── Compliance_Code_of_Conduct.md`,
      relatedQuestions: [427, 434, 439],
    },
    {
      id: 2,
      title: '2. Document Parsing & Extraction',
      shortTitle: 'Text Parsing',
      service: 'Amazon Bedrock / Amazon Textract',
      icon: FileText,
      accentColor: 'from-blue-500 to-cyan-600',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Parsing engine extracts raw text, tables, and document structure. If documents are scanned PDFs or images, Amazon Textract is used to extract form key-value pairs and tabular layouts.',
      examClue: 'First step in Bedrock Knowledge Base ingestion is to Parse documents.',
      payloadExample: `// Parsed Document Stream\n{\n  "doc_id": "doc_travel_2026",\n  "raw_text": "Section 4.2: Maximum per diem for meals is $85...",\n  "metadata": { "department": "Finance", "year": 2026 }\n}`,
      relatedQuestions: [427, 433],
    },
    {
      id: 3,
      title: '3. Text Chunking Strategy',
      shortTitle: 'Text Chunking',
      service: 'Bedrock Chunking Engine',
      icon: Layers,
      accentColor: 'from-purple-500 to-indigo-600',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'Splits large documents into manageable text chunks with configurable token sizes (e.g. 300 tokens) and overlap (e.g. 20%) to preserve context boundaries within model limits.',
      examClue: 'Chunking ensures data fits token context limits while keeping semantic continuity.',
      payloadExample: `Chunk 1 (Tokens: 300, Overlap: 20%):\n"...eligible for meal reimbursement up to $85/day with receipts..."\n\nChunk 2 (Tokens: 300, Overlap: 20%):\n"...with receipts. Hotel lodging is capped at $220/night in Tier-1 cities..."`,
      relatedQuestions: [427],
    },
    {
      id: 4,
      title: '4. Vector Embedding Generation',
      shortTitle: 'Vector Embeddings',
      service: 'Amazon Titan Embeddings / Cohere Embed',
      icon: Cpu,
      accentColor: 'from-emerald-500 to-teal-600',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Each text chunk is converted into a high-dimensional mathematical vector (e.g., 1536 floating point numbers) that captures deep semantic meaning and conceptual relationships.',
      examClue: 'Embedding models convert text chunks into vector representations.',
      payloadExample: `// Titan Text Embeddings V2\n[\n  0.02451, -0.08912, 0.31450, -0.11420,\n  0.00541, 0.45120, -0.09124, ... (1536 dimensions)\n]`,
      relatedQuestions: [421, 427],
    },
    {
      id: 5,
      title: '5. Vector Store & Indexing',
      shortTitle: 'Vector Index Store',
      service: 'Amazon OpenSearch Serverless / Kendra / pgvector',
      icon: Database,
      accentColor: 'from-amber-500 to-rose-600',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'Vector embeddings along with source chunk text and metadata are written into a managed vector database configured for approximate nearest neighbor (k-NN) similarity search.',
      examClue: 'Amazon OpenSearch Serverless is the default managed vector store for Bedrock Knowledge Bases.',
      payloadExample: `// OpenSearch Serverless Vector Document\n{\n  "id": "chunk_9841",\n  "vector": [0.02451, -0.08912, ...],\n  "text": "Hotel lodging is capped at $220/night...",\n  "source_uri": "s3://enterprise-kb-docs-prod/policies/2026_Travel.pdf"\n}`,
      relatedQuestions: [421, 427],
    },
  ];

  const inferenceSteps = [
    {
      id: 1,
      title: '1. User Prompt & Query Submission',
      shortTitle: 'User Prompt',
      service: 'Client Application / Amazon Bedrock API',
      icon: Search,
      accentColor: 'from-amber-500 to-orange-600',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'The end-user enters a natural language question (e.g., "What are our 2026 remote work travel expense limits?").',
      examClue: 'User questions may require fresh, internal, or proprietary knowledge not in pre-training weights.',
      payloadExample: `{\n  "query": "What are our 2026 remote work travel expense limits?",\n  "sessionId": "sess-94812",\n  "userId": "emp-4821"\n}`,
      relatedQuestions: [421, 423],
    },
    {
      id: 2,
      title: '2. Query Vectorization',
      shortTitle: 'Query Vector',
      service: 'Embedding Model (Amazon Titan Embeddings)',
      icon: Cpu,
      accentColor: 'from-blue-500 to-cyan-600',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'The user\'s query is converted on-the-fly into a dense vector embedding using the EXACT SAME embedding model that indexed the knowledge base.',
      examClue: 'Query and documents MUST be embedded using the same vector dimensions and embedding model.',
      payloadExample: `query_vector = titan_client.generate_embedding(\n  text="What are our 2026 remote work travel expense limits?"\n)\n// Output: [0.02381, -0.08845, 0.31502, ...]`,
      relatedQuestions: [421, 427],
    },
    {
      id: 3,
      title: '3. Vector Similarity Search (Top-K Retrieval)',
      shortTitle: 'Top-K Retrieval',
      service: 'Vector Database (OpenSearch Serverless / Kendra)',
      icon: Database,
      accentColor: 'from-purple-500 to-indigo-600',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'The vector store executes cosine similarity or dot product search to find the Top-K most semantically relevant text chunks from the enterprise index.',
      examClue: 'Context Relevance evaluates if retrieved chunks actually match the user\'s intent.',
      payloadExample: `// Top-2 Retrieved Authoritative Chunks (Score: 0.94)\n1. "Policy 2026 Sec 4: Meal limit $85/day, Hotel max $220/night."\n2. "Policy 2026 Sec 7: Mileage reimbursement is $0.67 per mile."`,
      relatedQuestions: [421, 426],
    },
    {
      id: 4,
      title: '4. Prompt Augmentation & Guardrails',
      shortTitle: 'Prompt Augmenter',
      service: 'Bedrock Knowledge Bases & Guardrails',
      icon: ShieldCheck,
      accentColor: 'from-emerald-500 to-teal-600',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'The system combines original user prompt + retrieved authoritative context chunks + system instructions + safety guardrails into an augmented prompt payload.',
      examClue: 'RAG grounds the model by providing authoritative context in the prompt payload.',
      payloadExample: `System: You are an enterprise policy assistant. Answer ONLY using the context below. If not found, say you do not know.\n\nContext:\n[Chunk 1] "Meal limit $85/day, Hotel max $220/night."\n\nUser Question:\n"What are our 2026 remote work travel expense limits?"`,
      relatedQuestions: [421, 423, 443],
    },
    {
      id: 5,
      title: '5. Foundation Model Inference & Grounded Answer',
      shortTitle: 'Grounded Output',
      service: 'Amazon Bedrock FM (Claude 3.5 / Nova Pro / Llama 3)',
      icon: Sparkles,
      accentColor: 'from-amber-500 to-rose-600',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'The Foundation Model synthesizes the retrieved context and answers the query with source citations, minimizing hallucinations and ensuring enterprise accuracy.',
      examClue: 'Faithfulness metric evaluates whether generated answers are strictly supported by retrieved context.',
      payloadExample: `{\n  "answer": "According to the 2026 Travel Expense Policy (Section 4), meal expenses are reimbursed up to $85/day, and lodging is capped at $220/night.",\n  "citations": ["s3://enterprise-kb-docs-prod/policies/2026_Travel.pdf#page=4"]\n}`,
      relatedQuestions: [421, 423, 426, 443],
    },
  ];

  const currentSteps = activePhase === 'ingestion' ? ingestionSteps : inferenceSteps;
  const selectedStepData = currentSteps.find((s) => s.id === activeStep) || currentSteps[0];
  const StepIcon = selectedStepData.icon;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    let step = 1;
    setActiveStep(1);
    const interval = setInterval(() => {
      step += 1;
      if (step <= 5) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 900);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-xl font-black">
                AIF-C01 Architecture Visualizer
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-xl">
                High-Yield RAG Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Retrieval-Augmented Generation (RAG) Flow & Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              RAG connects pre-trained foundation models to dynamic, proprietary enterprise data in Amazon S3 without fine-tuning model weights—significantly eliminating hallucinations and keeping answers current with verifiable source citations.
            </p>
          </div>

          {/* Phase Switcher Toggle */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto shrink-0 shadow-lg">
            <button
              onClick={() => {
                setActivePhase('ingestion');
                setActiveStep(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                activePhase === 'ingestion'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Phase 1: Ingestion Pipeline</span>
            </button>
            <button
              onClick={() => {
                setActivePhase('inference');
                setActiveStep(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                activePhase === 'inference'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Phase 2: Runtime Inference</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Visual Flowchart & Architecture Diagram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {activePhase === 'ingestion' 
                  ? 'Knowledge Base Document Ingestion Flow' 
                  : 'Runtime Query Retrieval & Augmentation Flow'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Click any step to inspect the underlying payload, AWS mechanism, and exam tips
              </p>
            </div>
          </div>

          {activePhase === 'inference' && (
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                isSimulating
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/20'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulating Query Flow...' : 'Simulate Live Query'}</span>
            </button>
          )}
        </div>

        {/* Connected Step Pipeline Flowchart */}
        <div className="relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-slate-800 -translate-y-6 z-0">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${((activeStep - 1) / 4) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10">
            {currentSteps.map((step, idx) => {
              const isSelected = activeStep === step.id;
              const isPassed = activeStep > step.id;
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`text-left p-4 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between min-h-[145px] group ${
                    isSelected
                      ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/10 transform -translate-y-1'
                      : isPassed
                      ? 'bg-slate-950/90 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  {/* Top Row: Step Index & Status */}
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-black transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                    </div>

                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Step Title */}
                  <div className="space-y-1 my-1">
                    <h4 className={`text-xs sm:text-sm font-bold leading-snug ${
                      isSelected ? 'text-amber-300 font-extrabold' : 'text-white'
                    }`}>
                      {step.shortTitle}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400 truncate">
                      {step.service.split('/')[0]}
                    </p>
                  </div>

                  {/* Flow Arrow (Mobile / Tablet indicator) */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Step {step.id} of 5</span>
                    {idx < 4 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Step Inspector & Live Payload Preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-inner">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                <StepIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-white">
                  {selectedStepData.title}
                </h4>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  Primary AWS Service: {selectedStepData.service}
                </span>
              </div>
            </div>

            {/* Linked Exam Questions */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-semibold">Practice Questions:</span>
              {selectedStepData.relatedQuestions.map((qId) => (
                <button
                  key={qId}
                  onClick={() => onSelectQuestion?.(qId)}
                  className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 transition-all flex items-center space-x-1"
                  title={`Open Question ${qId} in MCQ Bank`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Q#{qId}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Info & Code Box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs sm:text-sm">
            
            {/* Left: Mechanism & Exam Clue */}
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="font-bold text-amber-400 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Architectural Mechanism</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedStepData.description}
                </p>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="font-bold text-amber-300 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AIF-C01 High-Yield Exam Clue</span>
                </div>
                <p className="text-amber-100 leading-relaxed font-semibold">
                  {selectedStepData.examClue}
                </p>
              </div>
            </div>

            {/* Right: Technical Payload / Code Representation */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Runtime Payload & Vector Structure</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  JSON / API Representation
                </span>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed border border-slate-800/80">
                <code>{selectedStepData.payloadExample}</code>
              </pre>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Phase: {activePhase === 'ingestion' ? 'Batch Ingestion / Sync' : 'Real-time Inference'}</span>
                <span className="text-amber-400 font-mono font-bold">AWS Bedrock Managed</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Two-Stage Evaluation Framework for RAG */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Two-Stage RAG Evaluation Framework (Crucial Exam Concept)
            </h3>
            <p className="text-xs text-slate-400">
              When an enterprise RAG chatbot provides incomplete, hallucinated, or irrelevant answers (as tested in Q426), you must isolate the root cause into two distinct evaluation stages:
            </p>
          </div>
        </div>

        {/* 2-Stage Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          
          {/* Stage 1: Retrieval Quality */}
          <div className="bg-slate-950 border border-sky-500/40 rounded-2xl p-5 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono font-black px-2.5 py-1 rounded-lg">
                Stage 1: Retrieval Quality
              </span>
              <span className="text-xs font-mono text-slate-400">Vector Store & Embedding</span>
            </div>
            
            <h4 className="text-base font-bold text-white">Context Relevance & Context Coverage</h4>
            
            <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <strong className="text-sky-300 block mb-1">1. Context Relevance (Precision):</strong>
                Are the retrieved chunks actually relevant to the user query, or is noise/irrelevant context being fetched?
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <strong className="text-sky-300 block mb-1">2. Context Coverage (Recall):</strong>
                Did the vector search retrieve ALL required facts necessary to answer the prompt completely?
              </div>
            </div>

            <div className="text-xs bg-sky-950/50 p-3 rounded-xl border border-sky-800/80 text-sky-200 leading-relaxed">
              <strong>🛠️ Remediation If Failed:</strong> Adjust chunk size/overlap, switch embedding models, or add vector metadata filters.
            </div>
          </div>

          {/* Stage 2: Generation Quality */}
          <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-black px-2.5 py-1 rounded-lg">
                Stage 2: Generation Quality
              </span>
              <span className="text-xs font-mono text-slate-400">Foundation Model Inference</span>
            </div>

            <h4 className="text-base font-bold text-white">Faithfulness & Answer Completeness</h4>

            <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <strong className="text-emerald-300 block mb-1">1. Faithfulness (Groundedness):</strong>
                Is every factual claim in the generated answer strictly backed by the retrieved context? (Low faithfulness = hallucination).
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <strong className="text-emerald-300 block mb-1">2. Answer Completeness:</strong>
                Did the model fully address the prompt using the context without omitting critical instructions?
              </div>
            </div>

            <div className="text-xs bg-emerald-950/50 p-3 rounded-xl border border-emerald-800/80 text-emerald-200 leading-relaxed">
              <strong>🛠️ Remediation If Failed:</strong> Strengthen system prompt constraints ("answer strictly from context"), lower Temperature, or apply Bedrock Guardrails.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
