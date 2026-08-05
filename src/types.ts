export type OptionId = 'A' | 'B' | 'C' | 'D' | 'E' | string;

export type DomainType = 
  | 'Fundamentals of AI/ML'
  | 'Generative AI & Prompt Engineering'
  | 'AWS AI/ML Services'
  | 'Security, Compliance & Governance'
  | 'Applications of AI';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  part: number;
  questionNumber: number;
  topic: string;
  domain: DomainType;
  scenario: string;
  questionText: string;
  options: Option[];
  correctOption: string | string[];
  correctOptionText: string;
  explanation: string;
  wrongOptionsExplanation: Record<string, string>;
  example: string;
  examTip: string;
  keywordClues: string[];
}

export interface UserAnswer {
  selectedOption: OptionId;
  isCorrect: boolean;
  timestamp: number;
}

export interface UserProgress {
  answers: Record<number, UserAnswer>;
  bookmarks: number[];
}

export type ViewMode = 'practice' | 'visualizations' | 'ready-reckoner';

export type ReckonerTab = 
  | 'comparison-tables'
  | 'logic-flows'
  | 'code-snippets'
  | 'exam-golden-rules'
  | 'domain-cheat-sheets';

export type VisualizationTab = 
  | 'rag-architecture'
  | 'model-customization'
  | 'bedrock-guardrails'
  | 'sagemaker-lifecycle'
  | 'service-decision-tree'
  | 'confusion-matrix'
  | 'exam-domain-analytics';

