import React, { useState } from 'react';
import { 
  Compass, CheckCircle2, ArrowRight, Sparkles, AlertTriangle, 
  Layers, Search, FileText, Eye, Mic, Volume2, MessageSquare, 
  Code2, Shield, Brain, Cpu
} from 'lucide-react';

interface ServiceDecisionTreeVisualizerProps {
  onSelectQuestion?: (questionId: number) => void;
}

export const ServiceDecisionTreeVisualizer: React.FC<ServiceDecisionTreeVisualizerProps> = ({ onSelectQuestion }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('document');

  const serviceCategories = [
    {
      id: 'document',
      name: 'Document & OCR',
      icon: FileText,
      service: 'Amazon Textract',
      tagline: 'Scanned PDFs, forms, invoices, and structured tables.',
      triggerKeywords: ['scanned PDF', 'key-value pairs', 'extract tables', 'forms', 'OCR with structure'],
      description: 'Automatically extracts printed text, handwriting, forms (key-value pairs like Name, Income), and structured tables from scanned documents and PDFs.',
      commonDistractors: ['Amazon Comprehend (does NLP on raw text, cannot parse PDF layout/tables)', 'Amazon Rekognition (for general photos/objects)'],
      relatedQuestions: [433],
    },
    {
      id: 'developer',
      name: 'IDE Coding Assistant',
      icon: Code2,
      service: 'Amazon Q Developer',
      tagline: 'Code suggestions, legacy code explanation, unit tests.',
      triggerKeywords: ['IDE assistant', 'generate unit tests', 'explain legacy code', 'code generation in VS Code', 'MCP servers CLI'],
      description: 'Generative AI assistant purpose-built for software engineering teams. Integrates directly into IDEs (VS Code, JetBrains, Cloud9) to write code, generate tests, explain logic, and upgrade versions.',
      commonDistractors: ['Amazon CodeCatalyst (DevOps workflow management, not AI coding assistant)', 'Amazon Kendra (enterprise search)'],
      relatedQuestions: [424, 430],
    },
    {
      id: 'genai-api',
      name: 'Multi-Model GenAI API',
      icon: Sparkles,
      service: 'Amazon Bedrock',
      tagline: 'Serverless API for Claude, Nova, Llama, Mistral, Cohere.',
      triggerKeywords: ['multi-provider foundation models', 'serverless API', 'no infrastructure management', 'Claude, Llama, Nova'],
      description: 'Fully managed service offering unified API access to leading foundation models from Amazon, Anthropic, Meta, Mistral, and Cohere, plus Knowledge Bases, Guardrails, and Agents.',
      commonDistractors: ['Amazon SageMaker JumpStart (model hub requiring endpoint deployment management)', 'Amazon Lex (chatbots only)'],
      relatedQuestions: [441, 429, 443],
    },
    {
      id: 'nlp-analytics',
      name: 'Text & NLP Analytics',
      icon: MessageSquare,
      service: 'Amazon Comprehend',
      tagline: 'Sentiment analysis, entity recognition, PII detection in text.',
      triggerKeywords: ['sentiment analysis', 'detect entities in raw text', 'key phrases', 'language detection', 'Comprehend Medical'],
      description: 'Natural Language Processing (NLP) service that uses machine learning to uncover insights, relationships, sentiment, and PII in unstructured text.',
      commonDistractors: ['Amazon Textract (for OCR/document layout parsing)', 'Amazon Transcribe (for audio speech)'],
      relatedQuestions: [433, 441],
    },
    {
      id: 'vision',
      name: 'Computer Vision',
      icon: Eye,
      service: 'Amazon Rekognition',
      tagline: 'Object detection, facial analysis, content moderation.',
      triggerKeywords: ['detect objects in images', 'facial analysis', 'content moderation', 'custom labels', 'video stream analysis'],
      description: 'Automates image and video analysis to identify objects, people, text, scenes, activities, and inappropriate content.',
      commonDistractors: ['Amazon Textract (for text & tables in PDF documents)', 'SageMaker (if pre-built vision API is sufficient)'],
      relatedQuestions: [433],
    },
    {
      id: 'speech-to-text',
      name: 'Speech-to-Text',
      icon: Mic,
      service: 'Amazon Transcribe',
      tagline: 'Convert spoken audio and meetings into text transcripts.',
      triggerKeywords: ['speech to text', 'audio transcription', 'call center audio', 'subtitles', 'speaker identification'],
      description: 'Uses automatic speech recognition (ASR) to convert speech in audio and video files into accurate, time-stamped text transcripts.',
      commonDistractors: ['Amazon Polly (converts text to speech, opposite direction)', 'Amazon Comprehend (analyzes text after transcription)'],
      relatedQuestions: [433],
    },
    {
      id: 'text-to-speech',
      name: 'Text-to-Speech',
      icon: Volume2,
      service: 'Amazon Polly',
      tagline: 'Turn written text into lifelike spoken audio.',
      triggerKeywords: ['text to speech', 'synthesize lifelike speech', 'neural TTS', 'audio narration for articles'],
      description: 'Converts written text into natural-sounding spoken audio in multiple languages and accents using advanced deep learning technologies.',
      commonDistractors: ['Amazon Transcribe (converts audio to text)', 'Amazon Lex (conversational bot engine)'],
      relatedQuestions: [],
    },
    {
      id: 'compliance-evidence',
      name: 'Compliance Auditing',
      icon: Shield,
      service: 'AWS Audit Manager',
      tagline: 'Automated evidence collection for Generative AI Frameworks.',
      triggerKeywords: ['Audit Manager', 'Generative AI Best Practices Framework', 'continuous compliance evidence', 'audit documentation'],
      description: 'Continuously audits AWS usage to simplify risk assessment and compliance with regulations and generative AI best practice frameworks.',
      commonDistractors: ['AWS Artifact (provides AWS on-demand compliance reports, not evidence on customer workloads)', 'Amazon Macie (PII in S3)'],
      relatedQuestions: [432],
    },
  ];

  const currentCategory = serviceCategories.find((c) => c.id === selectedCategoryId) || serviceCategories[0];
  const IconComp = currentCategory.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono uppercase px-2.5 py-1 rounded-md font-bold">
            Service Selection Guide
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-md">
            Exam Decision Tree
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          AWS AI/ML Service Selection Wizard
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
          Select a functional requirement below to instantly see the purpose-built AWS service, keyword clues, and distractor traps to avoid on the AIF-C01 exam.
        </p>
      </div>

      {/* Interactive Service Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            Select Your Functional AI Task:
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {serviceCategories.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[105px] ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CatIcon className={`w-5 h-5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                    {cat.service.replace('Amazon ', '').replace('AWS ', '')}
                  </span>
                </div>
                <div className="mt-2">
                  <h4 className={`text-xs sm:text-sm font-bold leading-tight ${isSelected ? 'text-slate-950' : 'text-slate-100'}`}>
                    {cat.name}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Service Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                <IconComp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">
                  Recommended AWS Service
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {currentCategory.service}
                </h3>
              </div>
            </div>

            {/* Related Questions */}
            {currentCategory.relatedQuestions.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-medium">Practice in Bank:</span>
                {currentCategory.relatedQuestions.map((qId) => (
                  <button
                    key={qId}
                    onClick={() => onSelectQuestion?.(qId)}
                    className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 transition-colors"
                  >
                    Q{qId}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {currentCategory.description}
          </p>

          {/* Trigger Keywords Callout */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              Exam Scenario Trigger Keywords:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentCategory.triggerKeywords.map((kw, i) => (
                <span key={i} className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 rounded-md font-mono font-bold">
                  "{kw}"
                </span>
              ))}
            </div>
          </div>

          {/* Distractor Traps */}
          <div className="bg-rose-950/25 border border-rose-500/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs sm:text-sm uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Watch Out For These Exam Distractor Traps:</span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 list-disc list-inside">
              {currentCategory.commonDistractors.map((dis, i) => (
                <li key={i}>{dis}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
