import React, { useState, useMemo } from 'react';
import { 
  Compass, Search, ArrowRight, CheckCircle2, AlertTriangle, 
  Sparkles, BookOpen, Layers, GitBranch, Cpu, FileText, 
  Mic, Eye, MessageSquare, Shield, HelpCircle, Server, Code, Volume2,
  UserCheck, Users
} from 'lucide-react';

interface ServiceDecisionTreeVisualizerProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const ServiceDecisionTreeVisualizer: React.FC<ServiceDecisionTreeVisualizerProps> = ({ onSelectQuestion }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('ocr-tables');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const examScenarios = [
    {
      id: 'ocr-tables',
      title: 'Extract structured tables & key-value pairs from scanned PDFs',
      category: 'Document & OCR',
      winningService: 'Amazon Textract',
      serviceIcon: FileText,
      serviceColor: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
      reasoning: 'Amazon Textract goes beyond simple optical character recognition (OCR) to extract tabular layouts, form relationships, and query values from scanned documents without manual ML training.',
      distractorTrap: 'Amazon Rekognition is for general images/faces/objects, NOT structured document form parsing. Amazon Comprehend extracts sentiment/entities from raw text, not PDF layouts.',
      examTrigger: 'Key-value pairs, tables from PDFs, scanned forms ➔ Textract',
      relatedQuestions: [433, 441],
    },
    {
      id: 'pii-redaction',
      title: 'Redact social security numbers and PII from customer chat logs',
      category: 'NLP & Language',
      winningService: 'Amazon Comprehend (or Bedrock Guardrails)',
      serviceIcon: MessageSquare,
      serviceColor: 'text-sky-400 border-sky-500/40 bg-sky-950/20',
      reasoning: 'Amazon Comprehend natively identifies and masks Personally Identifiable Information (PII) entities in unstructured text. (If using Foundation Models, Amazon Bedrock Guardrails Layer 3 also masks PII).',
      distractorTrap: 'Do not train a custom SageMaker NER model when Amazon Comprehend provides pre-trained PII detection APIs.',
      examTrigger: 'PII detection, sentiment analysis, entity extraction in raw text ➔ Comprehend',
      relatedQuestions: [425, 431],
    },
    {
      id: 'audio-transcribe',
      title: 'Convert recorded customer service phone calls into text transcripts',
      category: 'Speech & Audio',
      winningService: 'Amazon Transcribe',
      serviceIcon: Mic,
      serviceColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
      reasoning: 'Amazon Transcribe uses automatic speech recognition (ASR) to convert speech-to-text with multi-channel audio support, custom vocabularies, and speaker diarization.',
      distractorTrap: 'Amazon Polly is text-to-speech (synthesizing voice), whereas Amazon Transcribe is speech-to-text.',
      examTrigger: 'Call center audio to text, speaker diarization ➔ Transcribe',
      relatedQuestions: [437],
    },
    {
      id: 'text-to-speech',
      title: 'Synthesize natural, human-like voice audio from written blog articles',
      category: 'Speech & Audio',
      winningService: 'Amazon Polly',
      serviceIcon: Volume2,
      serviceColor: 'text-purple-400 border-purple-500/40 bg-purple-950/20',
      reasoning: 'Amazon Polly uses deep learning speech synthesis to convert text into lifelike spoken audio with Neural TTS (NTTS) and SSML tag support.',
      distractorTrap: 'Amazon Transcribe converts audio to text; Polly converts text to audio.',
      examTrigger: 'Text to lifelike voice, neural speech synthesis ➔ Polly',
      relatedQuestions: [437],
    },
    {
      id: 'computer-vision-moderation',
      title: 'Detect inappropriate user uploads, facial attributes, and objects in images',
      category: 'Computer Vision',
      winningService: 'Amazon Rekognition',
      serviceIcon: Eye,
      serviceColor: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/20',
      reasoning: 'Amazon Rekognition offers pre-trained computer vision APIs for automated content moderation, facial analysis, text-in-image extraction, and custom labels without deep learning model training.',
      distractorTrap: 'Amazon Textract is specialized for text/tables in documents/PDFs, not general computer vision, moderation, or face recognition.',
      examTrigger: 'Image moderation, face comparison, object/label detection in photos ➔ Amazon Rekognition',
      relatedQuestions: [433, 441],
    },
    {
      id: 'rag-knowledge',
      title: 'Answer user queries from enterprise PDFs with source citations',
      category: 'GenAI & LLMs',
      winningService: 'Amazon Bedrock Knowledge Bases',
      serviceIcon: Sparkles,
      serviceColor: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
      reasoning: 'Bedrock Knowledge Bases provides a fully managed RAG pipeline that handles document parsing, chunking, embedding, vector store synchronization, and model augmentation.',
      distractorTrap: 'Do not build a custom embedding cluster on EC2 or fine-tune model weights when RAG satisfies the dynamic knowledge requirement.',
      examTrigger: 'Dynamic internal data, source citations, zero model weight modification ➔ Bedrock Knowledge Bases',
      relatedQuestions: [421, 423, 426, 427, 443],
    },
    {
      id: 'ide-coding',
      title: 'Generate unit tests, explain code, and transform legacy Java in IDE',
      category: 'Developer Tools',
      winningService: 'Amazon Q Developer',
      serviceIcon: Code,
      serviceColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20',
      reasoning: 'Amazon Q Developer is the generative AI developer assistant integrated directly into VS Code, JetBrains IDEs, and AWS Console for code generation, vulnerability scanning, and code transformation.',
      distractorTrap: 'Amazon CodeGuru is for automated static code review and profiling; Amazon Q Developer is the conversational generative coding assistant.',
      examTrigger: 'In-IDE code generation, unit test creation, legacy upgrade ➔ Amazon Q Developer',
      relatedQuestions: [432],
    },
    {
      id: 'model-governance',
      title: 'Document ML model business purpose, assumptions, and risk ratings',
      category: 'Governance',
      winningService: 'SageMaker Model Cards',
      serviceIcon: Shield,
      serviceColor: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
      reasoning: 'SageMaker Model Cards are standardized digital fact sheets that centralize metadata, intended uses, risk ratings, and evaluation metrics for custom ML models throughout their lifecycle.',
      distractorTrap: 'AWS AI Service Cards document pre-trained AWS services (like Rekognition/Textract), whereas SageMaker Model Cards document CUSTOM models.',
      examTrigger: 'Standardized fact sheet for custom ML models ➔ SageMaker Model Cards',
      relatedQuestions: [440, 444],
    },
    {
      id: 'human-in-the-loop-review',
      title: 'Route low-confidence ML predictions to human reviewers for validation',
      category: 'Governance & HITL',
      winningService: 'Amazon Augmented AI (Amazon A2I)',
      serviceIcon: UserCheck,
      serviceColor: 'text-teal-400 border-teal-500/40 bg-teal-950/20',
      reasoning: 'Amazon Augmented AI (A2I) provides built-in human review workflows for machine learning models (Textract, Rekognition, or custom SageMaker models) whenever prediction confidence falls below a configured threshold.',
      distractorTrap: 'SageMaker Ground Truth is for building and labeling initial training datasets, whereas Amazon A2I is for human review of runtime production model predictions.',
      examTrigger: 'Human-in-the-loop (HITL) review for low confidence predictions ➔ Amazon Augmented AI (A2I)',
      relatedQuestions: [424, 440],
    },
    {
      id: 'endpoint-drift',
      title: 'Continuously detect feature attribution drift and data drift in production',
      category: 'MLOps & Monitoring',
      winningService: 'SageMaker Model Monitor',
      serviceIcon: Server,
      serviceColor: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
      reasoning: 'SageMaker Model Monitor automatically inspects incoming inference requests and compares statistical baselines to detect data drift, model quality drift, and feature attribution drift.',
      distractorTrap: 'CloudWatch alarms monitor server CPU/latency, but Model Monitor detects mathematical statistical data drift.',
      examTrigger: 'Detect data drift or concept drift on deployed endpoints ➔ SageMaker Model Monitor',
      relatedQuestions: [425, 440],
    },
  ];

  const categories = ['all', 'Document & OCR', 'NLP & Language', 'Speech & Audio', 'Computer Vision', 'GenAI & LLMs', 'Developer Tools', 'Governance', 'Governance & HITL', 'MLOps & Monitoring'];

  const filteredScenarios = useMemo(() => {
    return examScenarios.filter((s) => {
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      const qLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        s.title.toLowerCase().includes(qLower) ||
        s.winningService.toLowerCase().includes(qLower) ||
        s.reasoning.toLowerCase().includes(qLower) ||
        s.examTrigger.toLowerCase().includes(qLower);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeScenario = examScenarios.find((s) => s.id === selectedScenarioId) || examScenarios[0];
  const ActiveServiceIcon = activeScenario.serviceIcon;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-xl font-black">
              Service Decision Engine
            </span>
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold px-2.5 py-1 rounded-xl">
              AIF-C01 Architecture Selector
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            AWS AI & Machine Learning Service Decision Tree
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The AWS Certified AI Practitioner exam frequently tests your ability to select the exact right AWS service with the lowest operational overhead and cost. Use this interactive decision tree and scenario solver.
          </p>
        </div>
      </div>

      {/* Visual Top-Level Branching Hierarchy Flowchart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-800">
          <GitBranch className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Primary Architectural Decision Branches
          </h3>
        </div>

        {/* 3 Main Pillars Flowchart Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Branch 1 */}
          <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-3 shadow-lg flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pillar 1: Pre-Built AI Services
              </span>
              <h4 className="text-base font-bold text-white">Zero ML Training Required</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard REST APIs ready for immediate consumption. Ideal when standard modalities match the task.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>• Textract:</span>
                <span className="text-amber-400">PDFs / Tables</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>• Comprehend:</span>
                <span className="text-amber-400">NLP & PII</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>• Transcribe / Polly:</span>
                <span className="text-amber-400">Audio & Voice</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>• Rekognition:</span>
                <span className="text-amber-400">Images & Video</span>
              </div>
            </div>
          </div>

          {/* Branch 2 */}
          <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-5 space-y-3 shadow-lg flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Pillar 2: Amazon Bedrock
              </span>
              <h4 className="text-base font-bold text-white">Serverless GenAI & LLMs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unified serverless API to Claude, Nova, Llama with managed RAG, Guardrails, and Agents.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>• Knowledge Bases:</span>
                <span className="text-cyan-400">Managed RAG</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>• Guardrails:</span>
                <span className="text-cyan-400">5-Layer Safety</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>• Agents:</span>
                <span className="text-cyan-400">Autonomous ReAct</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>• Prompt Router:</span>
                <span className="text-cyan-400">Cost Optimizer</span>
              </div>
            </div>
          </div>

          {/* Branch 3 */}
          <div className="bg-slate-950 border border-purple-500/40 rounded-2xl p-5 space-y-3 shadow-lg flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Pillar 3: Amazon SageMaker
              </span>
              <h4 className="text-base font-bold text-white">Full Custom MLOps Lifecycle</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete control over compute infrastructure, training loops, bias audit, and production endpoints.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>• Clarify:</span>
                <span className="text-purple-400">Bias & SHAP</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>• Model Cards:</span>
                <span className="text-purple-400">Governance</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>• Model Monitor:</span>
                <span className="text-purple-400">Drift Detection</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>• JumpStart:</span>
                <span className="text-purple-400">Open-weight Hub</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Scenario Solver & Decision Inspector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              Exam Scenario Decision Solver
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Click any common exam problem statement to evaluate the winning service and avoid distractor traps
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter scenarios or triggers..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Scenarios' : cat}
            </button>
          ))}
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredScenarios.map((scenario) => {
            const isSelected = scenario.id === activeScenario.id;
            const Icon = scenario.serviceIcon;
            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[140px] ${
                  isSelected
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {scenario.category}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  </div>
                  <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${
                    isSelected ? 'text-amber-300' : 'text-slate-200'
                  }`}>
                    {scenario.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-800/80 mt-2 flex items-center justify-between text-[11px] font-mono">
                  <span className={isSelected ? 'text-amber-400 font-black' : 'text-slate-400'}>
                    ➔ {scenario.winningService.split('(')[0].trim()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Scenario Detailed Breakdown */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-inner">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                <ActiveServiceIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                  Prescribed Architectural Winner
                </span>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  {activeScenario.winningService}
                </h4>
              </div>
            </div>

            {/* Linked Questions */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-semibold">Test In MCQ:</span>
              {activeScenario.relatedQuestions.map((qId) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
            
            {/* Box 1: Why this service */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Why This Service Wins</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {activeScenario.reasoning}
              </p>
            </div>

            {/* Box 2: Exam Distractor Trap */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Avoid This Distractor Trap</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {activeScenario.distractorTrap}
              </p>
            </div>

            {/* Box 3: Exam Trigger Clue */}
            <div className="bg-amber-950/20 border border-amber-500/40 p-4 sm:p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-amber-300 font-bold uppercase tracking-wider text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>High-Yield Trigger Keyword</span>
              </div>
              <p className="text-amber-100 font-mono leading-relaxed font-bold">
                {activeScenario.examTrigger}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
