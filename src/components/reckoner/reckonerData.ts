// AWS Certified AI Practitioner (AIF-C01) Ready Reckoner Dataset
// High-Yield Tables, Differences, Logic Flows, Code Snippets, Exam Traps & Golden Rules

export interface ComparisonTable {
  id: string;
  title: string;
  category: 'core-services' | 'genai-techniques' | 'metrics' | 'governance' | 'security';
  description: string;
  badge: string;
  columns: string[];
  rows: {
    feature: string;
    values: string[];
    highlight?: boolean;
    examTip?: string;
  }[];
  keyTakeaway: string;
}

export interface LogicFlowNode {
  id: string;
  title: string;
  question: string;
  options: {
    label: string;
    description: string;
    nextNodeId?: string;
    recommendation?: {
      service: string;
      reason: string;
      examTip: string;
      targetQuestionIds?: number[];
    };
  }[];
}

export interface LogicFlow {
  id: string;
  title: string;
  description: string;
  badge: string;
  rootNodeId: string;
  nodes: Record<string, LogicFlowNode>;
}

export interface CodeSnippet {
  id: string;
  title: string;
  service: string;
  language: 'python' | 'json';
  category: 'bedrock' | 'rag' | 'guardrails' | 'prebuilt-ai' | 'sagemaker' | 'prompt-eng';
  description: string;
  code: string;
  keyParameters: { param: string; meaning: string; examNote?: string }[];
  commonTrap: string;
}

export interface ExamRule {
  id: string;
  category: 'trap-alert' | 'mnemonic' | 'golden-rule' | 'metric-rule';
  title: string;
  formulaOrRule: string;
  explanation: string;
  whyItMatters: string;
  relatedTopic: string;
}

export interface DomainOverview {
  domainId: number;
  name: string;
  weight: string;
  coreConcepts: string[];
  topExamPatterns: string[];
  keyServices: string[];
}

// 1. COMPARISON TABLES
export const comparisonTables: ComparisonTable[] = [
  {
    id: 'bedrock-vs-sagemaker-vs-prebuilt',
    title: 'Bedrock vs. SageMaker vs. Pre-built AWS AI Services',
    category: 'core-services',
    badge: 'Exam Core (Domain 3)',
    description: 'The foundational architectural decision tested extensively across AIF-C01.',
    columns: ['Dimension', 'Pre-built AI Services (Comprehend, Rekognition, etc.)', 'Amazon Bedrock', 'Amazon SageMaker'],
    rows: [
      {
        feature: 'Primary Use Case',
        values: [
          'Turnkey AI without training (OCR, vision, sentiment, transcription)',
          'Serverless Foundation Models via unified API (Claude, Titan, Llama)',
          'End-to-end custom ML lifecycle (custom models, full infra control)'
        ],
        highlight: true
      },
      {
        feature: 'Machine Learning Expertise Needed',
        values: ['Zero ML skills required (standard REST API calls)', 'Low / Prompt Eng & API skills (No infra management)', 'High ML / Data Science skills (Hyperparameters, containers, compute)']
      },
      {
        feature: 'Infrastructure Management',
        values: ['100% Fully Managed by AWS', 'Serverless (Zero server/cluster provisioning)', 'Customer provisions/manages instances, clusters, endpoints']
      },
      {
        feature: 'Customization Depth',
        values: ['Custom labels / Custom classification / Custom vocab', 'Prompt Eng, RAG, Fine-Tuning, Continued Pre-training', 'Any framework (PyTorch, TensorFlow, XGBoost, Scikit-learn)']
      },
      {
        feature: 'Pricing Model',
        values: ['Pay-per-unit (per page, per minute, per image, per character)', 'Pay-per-token (On-Demand) or Provisioned Throughput (model units/hour)', 'Pay for EC2/GPU instance uptime + storage + data transfer']
      },
      {
        feature: 'Model Governance Tool',
        values: ['AWS AI Service Cards (AWS-authored transparency)', 'Bedrock Guardrails & Model Evaluation', 'SageMaker Model Cards, Model Monitor, Clarify, Model Registry'],
        examTip: 'Trap: AI Service Cards are ONLY for pre-built AWS AI services. Model Cards are for user-managed custom models!'
      }
    ],
    keyTakeaway: 'Choose Pre-built AI for ready tasks (vision/audio/PII), Bedrock for serverless LLMs & RAG without infra overhead, and SageMaker for full custom ML pipelines & training from scratch.'
  },
  {
    id: 'model-customization-spectrum',
    title: 'Model Customization Spectrum (Cost vs. Effort vs. Accuracy)',
    category: 'genai-techniques',
    badge: 'High Frequency (Domain 2 & 3)',
    description: 'Directly maps to 15+ exam questions asking how to inject proprietary data or adjust tone.',
    columns: ['Customization Method', 'Changes Model Weights?', 'Data Volume Required', 'Cost & Latency', 'Best For', 'Exam Clues / Triggers'],
    rows: [
      {
        feature: 'Prompt Engineering (Zero-Shot / Few-Shot / CoT)',
        values: ['NO', 'None (0 to a few exemplars)', 'Lowest cost, standard latency', 'Formatting, standard tasks, tone guidance', 'Zero training data, rapid iteration, no coding']
      },
      {
        feature: 'Retrieval-Augmented Generation (RAG / Knowledge Bases)',
        values: ['NO', 'Enterprise docs in Vector DB (S3 + OpenSearch / Aurora)', 'Low-Medium cost (DB storage + retrieval latency)', 'Real-time facts, proprietary docs, preventing hallucinations', 'Dynamic knowledge, access control, citations/source attribution'],
        highlight: true,
        examTip: 'RAG is the #1 answer when company documents update frequently or citations are required!'
      },
      {
        feature: 'Fine-Tuning (Instruction Tuning / Domain Adaptation)',
        values: ['YES (Updates weights / adapter layers)', 'Hundreds to thousands of labeled Prompt-Response pairs', 'Medium-High cost (training job + provisioned throughput)', 'Specialized style, niche vocabulary, domain-specific format', 'Consistent output formatting, labeled task dataset, jargon'],
        highlight: true
      },
      {
        feature: 'Continued Pre-training (Domain Adaptation on Raw Text)',
        values: ['YES (Updates base model weights)', 'Gigabytes/Billions of tokens of UNLABELED raw domain text', 'High compute cost + Provisioned Throughput needed', 'Teaching base model an entirely new vocabulary (e.g. Legal, Medical, Finance)', 'Raw unlabeled domain corpora, unique syntax, new jargon']
      },
      {
        feature: 'Pre-training from Scratch',
        values: ['YES (Initializes random weights)', 'Trillions of tokens, massive clusters (Trainium/GPU)', 'Extremely Expensive ($ Millions) + Months of time', 'Creating a proprietary foundational base model', 'Very rarely the right answer unless building a sovereign LLM']
      }
    ],
    keyTakeaway: 'Start with Prompt Eng -> If dynamic external knowledge needed, choose RAG -> If specialized behavior/formatting with labeled pairs, choose Fine-Tuning -> If new domain language from raw text, choose Continued Pretraining.'
  },
  {
    id: 'aws-prebuilt-ai-services-matrix',
    title: 'AWS Pre-Built AI Services Feature Matrix',
    category: 'core-services',
    badge: 'Domain 3 Services',
    description: 'Instant lookup for all pre-trained AI services tested on the exam.',
    columns: ['AWS Service', 'Core Capability', 'Key Features / Sub-services', 'Exam Keyword Triggers', 'What It DOES NOT Do'],
    rows: [
      {
        feature: 'Amazon Textract',
        values: ['OCR & Document Intelligence', 'Extracts tables, forms, key-value pairs, queries, handwritten text', 'Invoices, receipts, PDF forms, tables, W-2 forms, OCR', 'Does NOT analyze sentiment or natural language context']
      },
      {
        feature: 'Amazon Comprehend',
        values: ['Natural Language Processing (NLP)', 'Entity recognition, sentiment analysis, PII detection/redaction, topic modeling', 'PII redaction, customer reviews sentiment, multi-language NLP', 'Does NOT extract structured layout/tables from PDFs (use Textract)']
      },
      {
        feature: 'Amazon Rekognition',
        values: ['Computer Vision (Images & Video)', 'Facial analysis, object/scene detection, PPE detection, content moderation (unsafe imagery)', 'Helmet/PPE safety compliance, inappropriate image moderation, celebrity detection', 'Does NOT generate new images (use Titan Image Generator on Bedrock)']
      },
      {
        feature: 'Amazon Transcribe',
        values: ['Speech-to-Text (Audio to Text)', 'Call analytics, custom vocabulary, PII redaction from audio, speaker diarization', 'Audio recordings, meeting transcripts, contact center calls', 'Does NOT convert text into spoken audio (use Polly)']
      },
      {
        feature: 'Amazon Polly',
        values: ['Text-to-Speech (Text to Audio)', 'Neural & Standard voices, SSML tags, custom pronunciation lexicons, speech marks', 'Voiceover, talking avatars, reading articles aloud', 'Does NOT transcribe audio to text (use Transcribe)']
      },
      {
        feature: 'Amazon Lex',
        values: ['Conversational AI (Chatbots / Voicebots)', 'Intents, utterances, slots, fulfillment via Lambda, connects to Amazon Connect', 'IVR, customer service bot, voice assistants, slot filling', 'Does NOT handle unstructured document Q&A out of the box (use Amazon Q / RAG)']
      },
      {
        feature: 'Amazon Kendra',
        values: ['Intelligent Enterprise Search Engine', 'Natural language search, semantic connectors to SharePoint/Confluence/S3', 'Enterprise search box, indexing internal documents, answering direct FAQ', 'Is a search engine, not a generative creative writing LLM']
      },
      {
        feature: 'Amazon Q Business',
        values: ['Generative AI Assistant for Work', 'Connects to 40+ enterprise data sources, enforces user permissions (ACLs), writes summaries', 'Workplace chatbot, executive briefings, strict user access control', 'Not for training custom neural network weights']
      }
    ],
    keyTakeaway: 'Transcribe = Audio to Text; Polly = Text to Audio; Textract = Document extraction; Comprehend = Text NLP/PII; Rekognition = Vision; Lex = Bot Dialogues.'
  },
  {
    id: 'sagemaker-governance-matrix',
    title: 'SageMaker Governance & Responsible AI Tools Matrix',
    category: 'governance',
    badge: 'Domain 4 & 5',
    description: 'Differentiates the 5 major SageMaker governance services.',
    columns: ['Tool / Service', 'Primary Function', 'Phase of ML Lifecycle', 'Key Deliverables / Metrics', 'Exam Traps to Avoid'],
    rows: [
      {
        feature: 'SageMaker Model Cards',
        values: ['Documenting model metadata, intended uses, training details, evaluation results, risk ratings', 'Post-Training & Pre-Deployment documentation', 'Single source of truth PDF/JSON for model compliance & governance', 'Trap: For custom models created in SageMaker/Bedrock, NOT for AWS pre-built AI services']
      },
      {
        feature: 'AWS AI Service Cards',
        values: ['AWS-published transparency cards for AWS pre-trained AI services (e.g. Rekognition, Comprehend, Textract)', 'Pre-deployment evaluation of AWS services', 'AWS documentation detailing intended use cases, limitations, and fairness testing by AWS', 'Trap: Created by AWS, NOT customizable by users for their own internal models']
      },
      {
        feature: 'SageMaker Clarify',
        values: ['Detecting bias in training data and trained models, and computing SHAP feature importance for explainability', 'Pre-Training (data bias) and Post-Training (model bias & explainability)', 'Class Imbalance (CI), Difference in Positive Proportions (DPL), SHAP values, Disparate Impact', 'Trap: Clarify detects bias & provides explanations; it does NOT automatically rebalance data']
      },
      {
        feature: 'SageMaker Model Monitor',
        values: ['Continuous monitoring of deployed production endpoints for drift and data quality degradation', 'Post-Deployment (Production Monitoring)', 'Data quality drift, Concept drift, Model bias drift, Feature attribution drift', 'Trap: Model Monitor triggers CloudWatch alerts; it does NOT train the model']
      },
      {
        feature: 'SageMaker Model Registry',
        values: ['Cataloging, versioning, approving, and auditing models for production promotion', 'Pre-Deployment & CI/CD Pipeline', 'Model versions, approval status (Approved/Rejected), deployment artifacts', 'Trap: It manages metadata and deployment approvals, not dataset labeling']
      },
      {
        feature: 'Bedrock Guardrails',
        values: ['Real-time filtering of user prompts and model responses for PII, hate speech, denied topics, hallucinations', 'Runtime Inference (Generative AI)', 'Denied topics, content filters (Hate/Insults/Sexual/Violence), PII masking, Grounding Check', 'Trap: Applies to Bedrock Foundation Models at inference, not classical ML training algorithms']
      }
    ],
    keyTakeaway: 'AI Service Cards = AWS Pre-built; Model Cards = Your custom models; Clarify = Bias & SHAP; Model Monitor = Production Drift; Bedrock Guardrails = GenAI Runtime Safety.'
  },
  {
    id: 'evaluation-metrics-matrix',
    title: 'Evaluation Metrics: Classical ML vs. Generative AI',
    category: 'metrics',
    badge: 'Domain 1 & 2 Math',
    description: 'Quick formula and application guide for all exam evaluation questions.',
    columns: ['Metric', 'Formula / Concept', 'When to Prioritize', 'Real-World Example', 'Exam Scenario Clue'],
    rows: [
      {
        feature: 'Recall (Sensitivity)',
        values: ['TP / (TP + FN)', 'When False Negatives (FN) are dangerous / unacceptable', 'Cancer detection, fraud detection, security breaches', 'Must catch all instances of defect or disease; false alarms are acceptable']
      },
      {
        feature: 'Precision (Specificity/PPV)',
        values: ['TP / (TP + FP)', 'When False Positives (FP) are costly / disruptive', 'Spam email filter, video recommendation, automatic loan charge', 'Cannot annoy user with false alarms or block innocent users']
      },
      {
        feature: 'F1 Score',
        values: ['2 * (Precision * Recall) / (Precision + Recall)', 'Imbalanced datasets where both precision and recall matter', 'Fraud detection with 99.9% non-fraud and 0.1% fraud data', 'Accuracy is misleading due to high class imbalance']
      },
      {
        feature: 'ROUGE-1 / ROUGE-2 / ROUGE-L',
        values: ['Overlap of unigrams, bigrams, and Longest Common Subsequence between generated & reference text', 'Summarization tasks & text generation overlap', 'Evaluating Amazon Bedrock summarization output against gold standard summary', 'Summary evaluation, n-gram recall and precision']
      },
      {
        feature: 'BLEU',
        values: ['N-gram precision between machine translation and human reference translations (with brevity penalty)', 'Machine Translation (e.g. English to German)', 'Amazon Translate quality assessment against professional translators', 'Exact word n-gram matching in translation']
      },
      {
        feature: 'BERTScore',
        values: ['Semantic similarity using contextual embeddings rather than exact string matching', 'Paraphrasing and conceptual accuracy where words differ but meaning is identical', 'Evaluating RAG answers where synonyms are used correctly', 'Semantic preservation without requiring exact wording']
      },
      {
        feature: 'Perplexity (PPL)',
        values: ['Exponential of cross-entropy loss; measure of model uncertainty predicting next token', 'Evaluating language model fluency and predictability', 'Lower perplexity = model is more confident and fluent in text generation', 'Language modeling intrinsic evaluation, lower is better']
      }
    ],
    keyTakeaway: 'High Recall = Minimize False Negatives (Medical/Fraud); High Precision = Minimize False Positives (Spam); ROUGE = Summarization; BLEU = Translation; BERTScore = Semantic Similarity.'
  },
  {
    id: 'clarify-bias-metrics-matrix',
    title: 'SageMaker Clarify Bias Metrics (Pre vs. Post-Training)',
    category: 'governance',
    badge: 'Responsible AI (Domain 4)',
    description: 'Detailed breakdown of the specific bias equations tested on AIF-C01.',
    columns: ['Metric Name', 'Type', 'Target Range for Fairness', 'What It Measures', 'How to Mitigate'],
    rows: [
      {
        feature: 'Class Imbalance (CI)',
        values: ['Pre-training', 'Close to 0 ([-1, 1])', 'Measures difference in sample sizes between sensitive facet (a) and non-sensitive facet (d)', 'Resample data, SMOTE, collect more samples for underrepresented group']
      },
      {
        feature: 'Difference in Positive Proportions in Labels (DPL)',
        values: ['Pre-training', 'Close to 0 ([-1, 1])', 'Measures if positive ground truth labels are disproportionately assigned to one demographic', 'Relabel data, re-evaluate historical bias in training records']
      },
      {
        feature: 'Difference in Positive Proportions in Predicted Labels (DPPL)',
        values: ['Post-training', 'Close to 0 ([-1, 1])', 'Measures if the model predictions assign positive outcomes more to one demographic group', 'Adjust classification decision thresholds, retrain with debiased weights']
      },
      {
        feature: 'Disparate Impact (DI)',
        values: ['Post-training', 'Close to 1.0 (US 80% rule: 0.8 to 1.25)', 'Ratio of selection rates for the sensitive group compared to the unconstrained group', 'Check feature correlations, remove proxy variables (e.g. ZIP code)']
      },
      {
        feature: 'SHAP (KernelSHAP / TreeSHAP)',
        values: ['Explainability', 'Feature attribution values', 'Calculates marginal contribution of each feature to the final prediction (Local & Global)', 'Identify discriminatory features acting as indirect proxies']
      }
    ],
    keyTakeaway: 'CI & DPL = Pre-training data checks; DPPL & DI = Post-training prediction checks; SHAP = Feature attribution & explainability.'
  }
];

// 2. LOGIC FLOWS & DECISION TREES
export const logicFlows: LogicFlow[] = [
  {
    id: 'service-selection-flow',
    title: 'AWS AI/ML Service Selection Logic Flow',
    description: 'Interactive decision tree to determine whether to pick Pre-built AI, Bedrock, or SageMaker.',
    badge: 'Architecture Flow',
    rootNodeId: 'node_start',
    nodes: {
      node_start: {
        id: 'node_start',
        title: 'Step 1: Core Problem Type',
        question: 'What type of task is your application trying to solve?',
        options: [
          {
            label: 'Ready-made cognitive task (OCR, Vision, Audio Transcription, Translation, PII Redaction)',
            description: 'Standard vision, speech, document, or NLP task with no custom generative creativity needed.',
            nextNodeId: 'node_prebuilt_branch'
          },
          {
            label: 'Generative AI (Text generation, Chat, Summarization, Code, Multimodal LLM)',
            description: 'Leveraging Foundation Models (LLMs) with natural language prompts or proprietary docs.',
            nextNodeId: 'node_genai_branch'
          },
          {
            label: 'Custom Machine Learning (Predictive models, tabular tabular data, custom algorithms, custom training)',
            description: 'Building, training, and deploying custom models with full infrastructure control.',
            nextNodeId: 'node_sagemaker_branch'
          }
        ]
      },
      node_prebuilt_branch: {
        id: 'node_prebuilt_branch',
        title: 'Step 2: Specific Pre-built Capability',
        question: 'Which specific sensory/language capability is needed?',
        options: [
          {
            label: 'Extract tables, forms, or key-value pairs from PDFs/receipts',
            description: 'Structured OCR from complex documents.',
            recommendation: {
              service: 'Amazon Textract',
              reason: 'Textract handles structured document extraction, tables, forms, and custom queries beyond basic OCR.',
              examTip: 'Exam trigger: "extract tables from invoices" -> Amazon Textract AnalyzeDocument.',
              targetQuestionIds: [12, 45, 108]
            }
          },
          {
            label: 'Detect PII, sentiment, or redact sensitive entities in text',
            description: 'Analyzing text documents or customer tickets for compliance & sentiment.',
            recommendation: {
              service: 'Amazon Comprehend',
              reason: 'Comprehend provides turnkey sentiment analysis, entity extraction, and automated PII redaction.',
              examTip: 'Exam trigger: "redact PII from customer complaints without ML models" -> Amazon Comprehend.',
              targetQuestionIds: [15, 62, 140]
            }
          },
          {
            label: 'Audio transcription / speech to text for contact centers',
            description: 'Transcribing customer calls with speaker identification.',
            recommendation: {
              service: 'Amazon Transcribe',
              reason: 'Transcribe provides speech-to-text, call analytics, custom vocabularies, and speaker diarization.',
              examTip: 'Exam trigger: "transcribe customer phone recordings" -> Amazon Transcribe.',
              targetQuestionIds: [22, 88]
            }
          },
          {
            label: 'Convert written text into natural human speech',
            description: 'Generating voiceovers or interactive audio playback.',
            recommendation: {
              service: 'Amazon Polly',
              reason: 'Polly converts text into lifelike speech using Neural TTS and SSML pronunciation tags.',
              examTip: 'Exam trigger: "generate audio voiceover for training materials" -> Amazon Polly.',
              targetQuestionIds: [30, 95]
            }
          }
        ]
      },
      node_genai_branch: {
        id: 'node_genai_branch',
        title: 'Step 2: Foundation Model Strategy',
        question: 'How do you want to access and customize the Foundation Model?',
        options: [
          {
            label: 'Serverless API access to leading models (Claude, Titan, Llama) with Zero Infrastructure',
            description: 'Standard prompt engineering, Bedrock Guardrails, and managed Knowledge Bases.',
            recommendation: {
              service: 'Amazon Bedrock',
              reason: 'Amazon Bedrock provides unified serverless API access to top FMs with built-in RAG and Guardrails.',
              examTip: 'Exam trigger: "serverless access to FMs with minimal operational overhead" -> Amazon Bedrock.',
              targetQuestionIds: [1, 5, 20, 50]
            }
          },
          {
            label: 'Ready-to-use Generative AI Workplace Assistant with built-in enterprise connectors & permissions',
            description: 'Employees need a turnkey chat assistant connected to SharePoint, Confluence, S3, and Jira.',
            recommendation: {
              service: 'Amazon Q Business',
              reason: 'Amazon Q Business provides an out-of-the-box enterprise GenAI assistant with native identity ACL enforcement.',
              examTip: 'Exam trigger: "workplace AI assistant enforcing existing user permissions across 40+ SaaS tools" -> Amazon Q Business.',
              targetQuestionIds: [34, 112]
            }
          },
          {
            label: 'Deploy open-source LLMs (Falcon, Mistral, Hugging Face) on dedicated GPU instances with full container control',
            description: 'Need custom Docker containers, VPC peering, and customized inference scripts.',
            recommendation: {
              service: 'Amazon SageMaker JumpStart / Endpoints',
              reason: 'SageMaker JumpStart allows deploying open-source and proprietary models onto dedicated SageMaker hosting infrastructure.',
              examTip: 'Exam trigger: "deploy model inside isolated VPC with custom Docker container and specific GPU cluster" -> SageMaker.',
              targetQuestionIds: [40, 98]
            }
          }
        ]
      },
      node_sagemaker_branch: {
        id: 'node_sagemaker_branch',
        title: 'Step 2: SageMaker Sub-service Requirement',
        question: 'What specific capability in the custom ML pipeline is required?',
        options: [
          {
            label: 'Automate model creation for tabular data with zero ML code',
            description: 'Automatically explore algorithms, feature engineering, and hyperparameter tuning.',
            recommendation: {
              service: 'Amazon SageMaker Autopilot',
              reason: 'Autopilot automatically inspects raw tabular data, selects top algorithms, trains, and exposes full Python notebooks.',
              examTip: 'Exam trigger: "automatically build and tune ML models for tabular dataset with transparency" -> SageMaker Autopilot.',
              targetQuestionIds: [18, 77]
            }
          },
          {
            label: 'Audit dataset and model for bias and compute SHAP explainability',
            description: 'Regulatory requirement to explain feature importance and check demographic parity.',
            recommendation: {
              service: 'Amazon SageMaker Clarify',
              reason: 'Clarify provides pre-training data bias detection, post-training prediction bias, and SHAP explainability.',
              examTip: 'Exam trigger: "explain model predictions / detect pre-training bias" -> SageMaker Clarify.',
              targetQuestionIds: [25, 84, 150]
            }
          },
          {
            label: 'Detect data drift and accuracy degradation in live production endpoints',
            description: 'Continuous monitoring of model inputs and predictions over time.',
            recommendation: {
              service: 'Amazon SageMaker Model Monitor',
              reason: 'Model Monitor continuously ingests production endpoint traffic, compares it against baseline, and alerts on drift.',
              examTip: 'Exam trigger: "alert on concept drift or baseline deviation in production" -> SageMaker Model Monitor.',
              targetQuestionIds: [28, 92]
            }
          }
        ]
      }
    }
  },
  {
    id: 'customization-decision-flow',
    title: 'Model Adaptation & Customization Strategy Flow',
    description: 'Pinpoints the exact customization technique required based on data type, cost, and frequency of updates.',
    badge: 'Customization Flow',
    rootNodeId: 'node_cust_start',
    nodes: {
      node_cust_start: {
        id: 'node_cust_start',
        title: 'Step 1: Knowledge & Information Source',
        question: 'Does the application require private company data or real-time information not in the base model?',
        options: [
          {
            label: 'YES - Dynamic, frequently updated company documents, manuals, or databases',
            description: 'Data changes weekly/daily, citations required, must avoid hallucinations.',
            nextNodeId: 'node_rag_choice'
          },
          {
            label: 'NO - General domain knowledge is sufficient, but we need specific style, format, or new vocabulary',
            description: 'Model needs to act in a specific persona, follow strict JSON schemas, or understand specialized jargon.',
            nextNodeId: 'node_fine_tuning_choice'
          },
          {
            label: 'NO - Standard task with standard English; just need the model to follow instructions properly',
            description: 'General summarization, translation, tone adjustment, or reasoning.',
            nextNodeId: 'node_prompting_choice'
          }
        ]
      },
      node_rag_choice: {
        id: 'node_rag_choice',
        title: 'Step 2: RAG Architecture Selection',
        question: 'How should the retrieval pipeline be implemented?',
        options: [
          {
            label: 'Managed Serverless Knowledge Base with S3 sync & Vector Storage',
            description: 'Zero code infrastructure; automatically syncs S3 files to OpenSearch Serverless / Pinecone / Aurora.',
            recommendation: {
              service: 'Amazon Bedrock Knowledge Bases (Managed RAG)',
              reason: 'Bedrock Knowledge Bases manages data chunking, embeddings, vector indexing, and prompt augmentation automatically.',
              examTip: 'Exam trigger: "managed RAG with S3 documents and automatic chunking" -> Bedrock Knowledge Bases.',
              targetQuestionIds: [7, 49, 105]
            }
          },
          {
            label: 'Enterprise Search integration across 40+ SaaS platforms (SharePoint, Salesforce, Confluence)',
            description: 'Searching complex enterprise repositories with document-level security.',
            recommendation: {
              service: 'Amazon Kendra / Amazon Q Business',
              reason: 'Kendra and Q Business provide out-of-the-box enterprise connectors and respect source access control lists (ACLs).',
              examTip: 'Exam trigger: "search SharePoint and Confluence with native user permissions" -> Amazon Kendra / Amazon Q.',
              targetQuestionIds: [38, 120]
            }
          }
        ]
      },
      node_fine_tuning_choice: {
        id: 'node_fine_tuning_choice',
        title: 'Step 2: Training Data Availability',
        question: 'What kind of custom training dataset do you have?',
        options: [
          {
            label: 'Labeled Prompt-Response pairs (Hundreds to Thousands of curated examples)',
            description: 'Teaching the model specific response styling, output schema, or domain persona.',
            recommendation: {
              service: 'Amazon Bedrock Fine-Tuning (Instruction Tuning)',
              reason: 'Fine-tuning modifies model weights using labeled prompt-completion datasets in JSONL format.',
              examTip: 'Exam trigger: "consistently output in proprietary JSON schema using labeled pairs" -> Fine-Tuning.',
              targetQuestionIds: [14, 66, 132]
            }
          },
          {
            label: 'Unlabeled Raw Text Corpora (Gigabytes of raw legal, financial, or medical text)',
            description: 'Teaching the base model new domain vocabulary and syntax before instruction tuning.',
            recommendation: {
              service: 'Amazon Bedrock Continued Pre-training',
              reason: 'Continued Pre-training exposes the foundation model to large volumes of domain-specific unlabeled text.',
              examTip: 'Exam trigger: "teach base model specialized industry jargon from raw unlabeled text" -> Continued Pre-training.',
              targetQuestionIds: [21, 85]
            }
          }
        ]
      },
      node_prompting_choice: {
        id: 'node_prompting_choice',
        title: 'Step 2: Prompting Technique',
        question: 'What complexity of reasoning is required from the prompt?',
        options: [
          {
            label: 'Multi-step reasoning, mathematical calculations, or logical deduction',
            description: 'Model must break down complex problems step-by-step.',
            recommendation: {
              service: 'Chain-of-Thought (CoT) Prompting',
              reason: 'Chain-of-Thought prompts the model to output intermediate reasoning steps ("Let\'s think step by step").',
              examTip: 'Exam trigger: "improve multi-step mathematical or logical problem solving" -> Chain-of-Thought Prompting.',
              targetQuestionIds: [10, 55, 115]
            }
          },
          {
            label: 'Provide 2-5 high quality examples in the prompt to set the pattern',
            description: 'Guiding output format without fine-tuning.',
            recommendation: {
              service: 'Few-Shot Prompting',
              reason: 'Few-shot prompting injects exemplary input-output pairs into the context window to steer the format.',
              examTip: 'Exam trigger: "provide examples in prompt without retraining model" -> Few-Shot Prompting.',
              targetQuestionIds: [8, 52]
            }
          },
          {
            label: 'Dynamic tool execution and API interaction (ReAct framework)',
            description: 'Model needs to reason and take actions via external tools/APIs.',
            recommendation: {
              service: 'Amazon Bedrock Agents (ReAct Pattern)',
              reason: 'Bedrock Agents orchestrate Reason + Action (ReAct) loops, breaking user goals into API calls with Lambda.',
              examTip: 'Exam trigger: "orchestrate multi-step task involving database lookups and API calls" -> Bedrock Agents.',
              targetQuestionIds: [16, 70]
            }
          }
        ]
      }
    }
  },
  {
    id: 'genai-troubleshooting-flow',
    title: 'GenAI Production Issue Troubleshooting Flow',
    description: 'Diagnoses hallucinations, latency, PII leakage, or model drift and prescribes the AWS solution.',
    badge: 'Troubleshooting Flow',
    rootNodeId: 'node_diag_start',
    nodes: {
      node_diag_start: {
        id: 'node_diag_start',
        title: 'Step 1: Primary Symptom in Production',
        question: 'What negative behavior or operational issue is occurring?',
        options: [
          {
            label: 'Hallucinations & Inaccurate Facts (Model makes up plausible-sounding false information)',
            description: 'Model states untrue facts or invents citations.',
            nextNodeId: 'node_diag_hallucination'
          },
          {
            label: 'Security & Safety Violation (Users asking toxic questions or injecting PII/system prompt leakage)',
            description: 'Need guardrails for toxic words, PII masking, or prompt injection attacks.',
            nextNodeId: 'node_diag_safety'
          },
          {
            label: 'High Inference Latency / High Costs (Responses take too long or cost too much per prompt)',
            description: 'Optimizing token usage, throughput, and response time.',
            nextNodeId: 'node_diag_performance'
          }
        ]
      },
      node_diag_hallucination: {
        id: 'node_diag_hallucination',
        title: 'Step 2: Root Cause of Hallucination',
        question: 'Where is the inaccuracy originating?',
        options: [
          {
            label: 'Model is generating answers outside its training knowledge without verifiable source grounding',
            description: 'Model needs access to authoritative verified documents.',
            recommendation: {
              service: 'RAG (Bedrock Knowledge Bases) + Bedrock Guardrails Grounding Check',
              reason: 'RAG supplies verifiable context; Bedrock Guardrails Contextual Grounding Check calculates grounding & relevance score.',
              examTip: 'Exam trigger: "detect if model answer is grounded in retrieved context" -> Bedrock Guardrails Contextual Grounding Check.',
              targetQuestionIds: [11, 58, 125]
            }
          },
          {
            label: 'Temperature / Top-P parameter is set too high, causing excessive randomness',
            description: 'Model is taking creative liberties on deterministic factual queries.',
            recommendation: {
              service: 'Lower Temperature to 0.0 - 0.2 and Top-P to 0.1',
              reason: 'Temperature 0.0 makes model token selection greedy and deterministic, minimizing random hallucinations.',
              examTip: 'Exam trigger: "ensure deterministic, repeatable responses for factual queries" -> Set Temperature to 0.',
              targetQuestionIds: [6, 48]
            }
          }
        ]
      },
      node_diag_safety: {
        id: 'node_diag_safety',
        title: 'Step 2: Safety & Compliance Control',
        question: 'What specific safety mechanism is required?',
        options: [
          {
            label: 'Block denied topics, filter hate/violence, mask PII, and block prompt injection in real time',
            description: 'Enforcing company content policy on both user prompt and model answer.',
            recommendation: {
              service: 'Amazon Bedrock Guardrails',
              reason: 'Bedrock Guardrails enforces content filters, denied topics, word filters, PII masking, and prompt injection filters.',
              examTip: 'Exam trigger: "mask credit card numbers and block harmful topics in Bedrock" -> Bedrock Guardrails.',
              targetQuestionIds: [9, 54, 130]
            }
          },
          {
            label: 'Audit which employees made specific API calls to Bedrock Foundation Models',
            description: 'Compliance log of user identity, timestamp, and API action.',
            recommendation: {
              service: 'AWS CloudTrail',
              reason: 'CloudTrail logs all Bedrock control-plane and data-plane API actions (e.g. InvokeModel, CreateKnowledgeBase) with caller ARN.',
              examTip: 'Exam trigger: "audit who called Bedrock InvokeModel API" -> AWS CloudTrail.',
              targetQuestionIds: [31, 99]
            }
          }
        ]
      },
      node_diag_performance: {
        id: 'node_diag_performance',
        title: 'Step 2: Performance & Cost Optimization',
        question: 'What optimization strategy matches the workload?',
        options: [
          {
            label: 'Predictable high volume traffic needing guaranteed throughput and consistent low latency',
            description: 'Running steady-state production workloads with committed throughput.',
            recommendation: {
              service: 'Bedrock Provisioned Throughput',
              reason: 'Provisioned Throughput provides dedicated Model Units with guaranteed TPS and latency SLAs (1-month or 6-month commitment).',
              examTip: 'Exam trigger: "guarantee throughput and sub-second latency for steady high-traffic Bedrock app" -> Provisioned Throughput.',
              targetQuestionIds: [33, 102]
            }
          },
          {
            label: 'Automatically route simple queries to smaller cheaper models and hard queries to premium models',
            description: 'Optimizing cost and latency dynamically across queries.',
            recommendation: {
              service: 'Bedrock Intelligent Prompt Routing',
              reason: 'Intelligent Prompt Routing automatically dynamically routes prompts to the optimal model within a family to save cost.',
              examTip: 'Exam trigger: "single endpoint that dynamically balances cost and quality across Claude 3.5 Sonnet and Haiku" -> Intelligent Prompt Routing.',
              targetQuestionIds: [42, 118]
            }
          }
        ]
      }
    }
  }
];

// 3. PRODUCTION AWS CODE SNIPPETS
export const codeSnippets: CodeSnippet[] = [
  {
    id: 'bedrock-invoke-claude',
    title: 'Amazon Bedrock: Invoke Anthropic Claude 3.5 Sonnet (Boto3)',
    service: 'Amazon Bedrock Runtime',
    language: 'python',
    category: 'bedrock',
    description: 'Standard Boto3 pattern for invoking Anthropic Claude 3 / 3.5 models via the Messages API schema.',
    code: `import boto3
import json

# Initialize Bedrock Runtime client in target AWS Region
bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

# Define request payload adhering to Anthropic Claude Messages API
payload = {
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 1000,
    "temperature": 0.2,       # Low temperature for factual precision
    "top_p": 0.9,
    "system": "You are an AWS Certified AI Practitioner assistant. Provide concise, factual answers.",
    "messages": [
        {
            "role": "user",
            "content": "Explain the difference between Amazon Comprehend and Amazon Textract."
        }
    ]
}

# Invoke the Foundation Model
response = bedrock.invoke_model(
    modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
    contentType="application/json",
    accept="application/json",
    body=json.dumps(payload)
)

# Parse response body
response_body = json.loads(response['body'].read())
completion_text = response_body['content'][0]['text']
print(completion_text)`,
    keyParameters: [
      { param: 'anthropic_version', meaning: 'Required header in payload: "bedrock-2023-05-31"', examNote: 'Anthropic models require anthropic_version in body' },
      { param: 'modelId', meaning: 'Full ARN or model identifier string (e.g. anthropic.claude-3-5-sonnet-*)' },
      { param: 'contentType & accept', meaning: 'Must both be "application/json"' },
      { param: 'response["body"].read()', meaning: 'Returns a StreamingBody object that must be read and json.loads parsed' }
    ],
    commonTrap: 'Exam trap: Do not confuse bedrock (control plane for managing models) with bedrock-runtime (data plane for invoking models via invoke_model).'
  },
  {
    id: 'bedrock-invoke-guardrails',
    title: 'Amazon Bedrock: Invoke Model with Bedrock Guardrails Attached',
    service: 'Amazon Bedrock Runtime',
    language: 'python',
    category: 'guardrails',
    description: 'Enforcing real-time safety, PII redaction, and denied topic filtering on Bedrock model invocations.',
    code: `import boto3
import json

bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

payload = {
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 500,
    "messages": [{"role": "user", "content": "Please analyze this customer account: SSN 123-45-6789."}]
}

# Attach Guardrail Identifier & Version directly in invoke_model
response = bedrock.invoke_model(
    modelId="anthropic.claude-3-haiku-20240307-v1:0",
    contentType="application/json",
    accept="application/json",
    guardrailIdentifier="gr-abc123xyz789", # Guardrail ID or ARN
    guardrailVersion="DRAFT",              # Or numerical version like "1"
    trace="ENABLED",                       # Enables CloudWatch Guardrail execution trace
    body=json.dumps(payload)
)

# Guardrail can mask PII or intervene with fallback message if denied topic detected
result = json.loads(response['body'].read())
print(result)`,
    keyParameters: [
      { param: 'guardrailIdentifier', meaning: 'Unique ID or full ARN of the configured Bedrock Guardrail' },
      { param: 'guardrailVersion', meaning: '"DRAFT" for testing, or published numerical version (e.g., "1") for production' },
      { param: 'trace="ENABLED"', meaning: 'Returns diagnostics detailing if content filters or PII masking were triggered' }
    ],
    commonTrap: 'Exam trap: Guardrails can be applied to both Bedrock Foundation Models AND custom models, but they operate at runtime during invoke_model.'
  },
  {
    id: 'bedrock-retrieve-and-generate',
    title: 'Bedrock Knowledge Bases: Managed RAG (RetrieveAndGenerate)',
    service: 'Amazon Bedrock Agent Runtime',
    language: 'python',
    category: 'rag',
    description: 'One-step end-to-end RAG: retrieves relevant chunks from S3/Vector DB and synthesizes an answer with citations.',
    code: `import boto3

# Use bedrock-agent-runtime client for Knowledge Base queries
agent_runtime = boto3.client('bedrock-agent-runtime', region_name='us-east-1')

response = agent_runtime.retrieve_and_generate(
    input={
        'text': 'What is our corporate policy regarding remote work reimbursement?'
    },
    retrieveAndGenerateConfiguration={
        'type': 'KNOWLEDGE_BASE',
        'knowledgeBaseConfiguration': {
            'knowledgeBaseId': 'KB12345678',
            'modelArn': 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0',
            'retrievalConfiguration': {
                'vectorSearchConfiguration': {
                    'numberOfResults': 5  # Top K relevant chunks
                }
            }
        }
    }
)

# Output includes synthesized answer and source citations (S3 URIs)
output_text = response['output']['text']
citations = response['citations']

print("Answer:", output_text)
print("Source Document URIs:", [c['retrievedReferences'][0]['location']['s3Location']['uri'] for c in citations])`,
    keyParameters: [
      { param: 'retrieve_and_generate', meaning: 'One-step API that retrieves chunks AND generates answer with citations', examNote: 'Use retrieve() if you only want vector search results without text generation' },
      { param: 'knowledgeBaseId', meaning: 'ID of the Bedrock Knowledge Base connected to S3 & OpenSearch Serverless' },
      { param: 'citations', meaning: 'Provides exact S3 document references to eliminate hallucination disputes' }
    ],
    commonTrap: 'Exam trap: retrieve_and_generate is in "bedrock-agent-runtime" SDK, NOT standard "bedrock" client.'
  },
  {
    id: 'textract-analyze-document',
    title: 'Amazon Textract: Extract Tables & Key-Value Forms',
    service: 'Amazon Textract',
    language: 'python',
    category: 'prebuilt-ai',
    description: 'Extracting structured tables and form data from invoice PDFs and scanned receipts.',
    code: `import boto3

textract = boto3.client('textract', region_name='us-east-1')

# Extract structured tables and key-value forms from an S3 document
response = textract.analyze_document(
    Document={
        'S3Object': {
            'Bucket': 'my-corporate-invoices',
            'Name': 'quarterly-invoice.pdf'
        }
    },
    FeatureTypes=['TABLES', 'FORMS', 'QUERIES'],
    QueriesConfig={
        'Queries': [
            {'Text': 'What is the Total Amount Due?', 'Alias': 'TOTAL_DUE'}
        ]
    }
)

# Iterate over blocks (PAGE, LINE, WORD, TABLE, CELL, KEY_VALUE_SET)
for block in response['Blocks']:
    if block['BlockType'] == 'KEY_VALUE_SET' and 'KEY' in block.get('EntityTypes', []):
        print("Detected Form Key Block:", block['Id'])`,
    keyParameters: [
      { param: 'FeatureTypes', meaning: 'Must specify ["TABLES", "FORMS", "QUERIES"] for structured extraction' },
      { param: 'detect_document_text vs analyze_document', meaning: 'detect_document_text is raw OCR (text only); analyze_document extracts tables & forms', examNote: 'High frequency exam differentiator!' }
    ],
    commonTrap: 'Exam trap: detect_document_text only returns raw text/words. To get tables or forms, you MUST use analyze_document with FeatureTypes.'
  },
  {
    id: 'comprehend-detect-pii',
    title: 'Amazon Comprehend: Detect & Redact PII Entities',
    service: 'Amazon Comprehend',
    language: 'python',
    category: 'prebuilt-ai',
    description: 'Detecting sensitive PII (SSN, credit cards, emails, phone numbers) for privacy compliance.',
    code: `import boto3

comprehend = boto3.client('comprehend', region_name='us-east-1')

sample_text = "Customer John Doe (SSN: 000-12-3456) requested password reset for john.doe@example.com."

# Detect PII entities synchronously
response = comprehend.detect_pii_entities(
    Text=sample_text,
    LanguageCode='en'
)

for entity in response['Entities']:
    print(f"Type: {entity['Type']}, Score: {entity['Score']:.2f}, Offset: ({entity['BeginOffset']}, {entity['EndOffset']})")
    
# Or use asynchronous PII Redaction Job for batch S3 document masking
# comprehend.start_pii_entities_detection_job(
#     InputDataConfig={'S3Uri': 's3://inbox/raw/'},
#     OutputDataConfig={'S3Uri': 's3://inbox/redacted/'},
#     Mode='ONLY_REDACTION',
#     RedactionConfig={'PiiEntityTypes': ['SSN', 'EMAIL', 'BANK_ACCOUNT_NUMBER']}
# )`,
    keyParameters: [
      { param: 'detect_pii_entities', meaning: 'Returns entity coordinates and types (SSN, EMAIL, CREDIT_DEBIT_NUMBER, NAME)' },
      { param: 'start_pii_entities_detection_job', meaning: 'Batch job on S3 with Mode="ONLY_REDACTION" to produce masked documents' }
    ],
    commonTrap: 'Exam trap: Comprehend PII detection is fully managed with zero training required. Do NOT build a custom NER model for standard PII.'
  },
  {
    id: 'sagemaker-clarify-bias-config',
    title: 'SageMaker Clarify: Pre-Training Bias & SHAP Explainability',
    service: 'Amazon SageMaker Clarify',
    language: 'python',
    category: 'sagemaker',
    description: 'Configuring SageMaker Clarify to compute Class Imbalance (CI), DPL, and SHAP feature attributions.',
    code: `from sagemaker import clarify
import sagemaker

session = sagemaker.Session()
clarify_processor = clarify.SageMakerClarifyProcessor(
    role='arn:aws:iam::123456789012:role/SageMakerExecutionRole',
    instance_count=1,
    instance_type='ml.c5.xlarge',
    sagemaker_session=session
)

# 1. Configure Data & Bias target
bias_config = clarify.BiasConfig(
    label_values_or_threshold=[1],     # Positive outcome label (e.g. loan approved)
    facet_name='gender',               # Sensitive demographic attribute
    facet_values_or_threshold=['Female'] # Sensitive facet group
)

# 2. Configure SHAP Explainability
shap_config = clarify.SHAPConfig(
    baseline=[[0, 25, 50000, 1]],      # Synthetic or mean baseline record
    num_samples=100,
    agg_method='mean_abs'
)

# Clarify computes CI, DPL, DPPL, DI, and SHAP values automatically`,
    keyParameters: [
      { param: 'facet_name', meaning: 'The column containing the sensitive attribute (e.g., gender, age, ethnicity)' },
      { param: 'label_values_or_threshold', meaning: 'The positive ground truth outcome value' },
      { param: 'shap_config', meaning: 'Generates local and global feature attribution explanations' }
    ],
    commonTrap: 'Exam trap: Clarify analyzes and detects bias/explainability, but it does NOT automatically modify or rebalance your dataset.'
  }
];

// 4. EXAM GOLDEN RULES & MNEMONICS
export const examGoldenRules: ExamRule[] = [
  {
    id: 'rule-ai-cards-vs-model-cards',
    category: 'trap-alert',
    title: 'AI Service Cards vs. SageMaker Model Cards',
    formulaOrRule: 'AI Service Cards = AWS Pre-Built | Model Cards = Custom/Customer-Trained Models',
    explanation: 'AWS AI Service Cards provide transparency documentation published by AWS for AWS pre-built services (e.g. Rekognition, Comprehend). SageMaker Model Cards are created by YOU for documenting custom models trained on SageMaker/Bedrock.',
    whyItMatters: 'Appears in 5+ questions testing model documentation and governance.',
    relatedTopic: 'Responsible AI & Governance'
  },
  {
    id: 'rule-recall-vs-precision',
    category: 'mnemonic',
    title: 'Recall (Can\'t Miss) vs. Precision (Can\'t Cry Wolf)',
    formulaOrRule: 'High Recall = Minimize False Negatives | High Precision = Minimize False Positives',
    explanation: 'Recall (Sensitivity): Use when missing a positive is catastrophic (Cancer screening, fraud alerts, earthquake alarms). Precision: Use when false alarms are disruptive (Spam filter, blocking legitimate credit transactions, automated account banning).',
    whyItMatters: 'Classic ML metric selection questions are guaranteed on AIF-C01.',
    relatedTopic: 'Fundamentals of AI/ML'
  },
  {
    id: 'rule-temperature-top-p',
    category: 'golden-rule',
    title: 'Temperature & Top-P Decoding Dial',
    formulaOrRule: 'Temperature 0.0 = Deterministic/Greedy | Temperature 1.0 = Highly Creative/Random',
    explanation: 'Temperature scales the logit distribution before softmax. Low temperature (0.0 - 0.2) concentrates probability on the highest-probability token (best for coding, math, legal facts). High temperature (0.8 - 1.0) flattens distribution for creative brainstorming. Top-P (nucleus sampling) limits token pool to cumulative probability threshold P.',
    whyItMatters: 'Essential for prompt engineering and model parameter tuning questions.',
    relatedTopic: 'Generative AI & Prompt Engineering'
  },
  {
    id: 'rule-bedrock-data-privacy',
    category: 'golden-rule',
    title: 'Customer Data Privacy in Amazon Bedrock',
    formulaOrRule: 'Customer data is NEVER used to train base FMs, NEVER leaves your AWS Region, and is NOT shared with model providers.',
    explanation: 'Prompts and completions processed in Amazon Bedrock remain entirely encrypted in your AWS account and are not accessible by third-party model providers (e.g. Anthropic, Meta) or used by AWS to train base foundation models.',
    whyItMatters: 'Major compliance question pattern for enterprise security.',
    relatedTopic: 'Security, Compliance & Governance'
  },
  {
    id: 'rule-clarify-ci-vs-dpl',
    category: 'metric-rule',
    title: 'Clarify Bias: Class Imbalance (CI) vs. Difference in Positive Proportions (DPL)',
    formulaOrRule: 'CI = Sample Count Imbalance (Pre-training) | DPL = Outcome Distribution Imbalance (Pre-training)',
    explanation: 'Class Imbalance (CI) checks if one demographic has far fewer training examples. Difference in Positive Proportions in Labels (DPL) checks if positive historical labels were awarded unfairly to one group in historical data.',
    whyItMatters: 'Differentiates pre-training dataset bias metrics on the exam.',
    relatedTopic: 'Responsible AI'
  },
  {
    id: 'rule-intelligent-prompt-routing',
    category: 'trap-alert',
    title: 'Bedrock Intelligent Prompt Routing',
    formulaOrRule: 'Single Endpoint -> Automatically routes between models in same family (e.g. Claude 3.5 Sonnet & Haiku)',
    explanation: 'Instead of manually building an API router, Bedrock Intelligent Prompt Routing dynamically evaluates prompt complexity and sends simple prompts to smaller/cheaper models and complex prompts to larger models, optimizing both latency and cost.',
    whyItMatters: 'Top new AIF-C01 concept for GenAI cost optimization.',
    relatedTopic: 'Applications of AI'
  }
];

// 5. DOMAIN-BY-DOMAIN CHEAT SHEETS
export const domainOverviews: DomainOverview[] = [
  {
    domainId: 1,
    name: 'Domain 1: Fundamentals of AI and ML',
    weight: '20% of Exam (~13 Questions)',
    coreConcepts: [
      'Supervised vs. Unsupervised vs. Reinforcement Learning',
      'Underfitting (High Bias) vs. Overfitting (High Variance)',
      'Train / Validation / Test data split rules',
      'Evaluation Metrics: Accuracy, Precision, Recall, F1 Score, ROC-AUC, RMSE, MAE',
      'Confusion Matrix terms: TP, TN, FP (Type I Error), FN (Type II Error)',
      'Feature Engineering & Normalization (StandardScaler, MinMaxScaler, One-Hot Encoding)'
    ],
    topExamPatterns: [
      'Scenario with imbalanced dataset -> Choose F1-score over Accuracy',
      'Scenario where missing fraud is critical -> Maximize Recall',
      'Scenario where training loss is low but validation loss is high -> Overfitting (Apply L1/L2 regularization, dropout, or early stopping)'
    ],
    keyServices: ['SageMaker Autopilot', 'SageMaker Data Wrangler', 'SageMaker Feature Store']
  },
  {
    domainId: 2,
    name: 'Domain 2: Fundamentals of Generative AI',
    weight: '24% of Exam (~16 Questions)',
    coreConcepts: [
      'Transformer Architecture: Self-Attention Mechanism, Encoders (BERT) vs Decoders (GPT/Claude)',
      'Tokens vs Words (~100 tokens = 75 words)',
      'Inference Parameters: Temperature, Top-P, Top-K, Max Tokens, Stop Sequences, Frequency/Presence Penalty',
      'Prompt Engineering Strategies: Zero-Shot, Few-Shot, Chain-of-Thought (CoT), Directional Stimulus, ReAct',
      'Hallucinations & Context Drift root causes',
      'GenAI Evaluation: ROUGE (1/2/L), BLEU, BERTScore, Perplexity'
    ],
    topExamPatterns: [
      'Need deterministic factual output -> Set Temperature to 0.0',
      'Multi-step math problem fails -> Apply Chain-of-Thought prompting',
      'Summarization accuracy evaluation -> ROUGE-L metric'
    ],
    keyServices: ['Amazon Bedrock', 'Bedrock Playgrounds', 'Titan Text Models']
  },
  {
    domainId: 3,
    name: 'Domain 3: Applications of Foundation Models',
    weight: '28% of Exam (~18 Questions)',
    coreConcepts: [
      'Customization Continuum: Prompt Eng -> RAG -> Fine-Tuning -> Continued Pretraining -> From Scratch',
      'Amazon Bedrock Knowledge Bases Architecture (S3 -> Embedding Model -> Vector Index -> Augmentation)',
      'Amazon Bedrock Agents (Action Groups, OpenAPI Schema, Lambda invocation, Session Memory)',
      'Bedrock Provisioned Throughput vs. On-Demand Pricing',
      'Pre-built AI Services: Comprehend, Textract, Rekognition, Transcribe, Polly, Translate, Lex, Kendra, Q Business',
      'Vector Databases on AWS: OpenSearch Serverless, Aurora PostgreSQL pgvector, Neptune Analytics'
    ],
    topExamPatterns: [
      'Frequently updating private company documentation -> Amazon Bedrock Knowledge Bases (RAG)',
      'Extracting tables and key-value forms from invoices -> Amazon Textract AnalyzeDocument',
      'Workplace assistant with enterprise ACLs -> Amazon Q Business',
      'Guaranteed TPS and sub-second latency under high load -> Bedrock Provisioned Throughput'
    ],
    keyServices: ['Amazon Bedrock', 'Bedrock Knowledge Bases', 'Amazon Q Business', 'Amazon Textract', 'Amazon Comprehend']
  },
  {
    domainId: 4,
    name: 'Domain 4: Guidelines for Responsible AI',
    weight: '14% of Exam (~9 Questions)',
    coreConcepts: [
      'Six Dimensions of Responsible AI: Fairness, Explainability, Privacy & Security, Transparency, Robustness, Governance',
      'Types of Bias: Historical bias, Representation bias, Measurement bias, Evaluation bias',
      'SageMaker Clarify Metrics: Class Imbalance (CI), DPL, DPPL, Disparate Impact (DI)',
      'Explainability: SHAP (Shapley Additive Explanations) vs. LIME, Global vs Local attributions',
      'Human-in-the-Loop (HITL): Amazon Augmented AI (A2I) for low-confidence review',
      'AI Service Cards (AWS-authored) vs. Model Cards (Customer-authored)'
    ],
    topExamPatterns: [
      'Detect bias in dataset before model training -> SageMaker Clarify Pre-Training Bias (CI, DPL)',
      'Human review workflow for low-confidence Textract/Rekognition predictions -> Amazon A2I',
      'Documenting custom model intended use and evaluation results -> SageMaker Model Cards'
    ],
    keyServices: ['SageMaker Clarify', 'Amazon Augmented AI (A2I)', 'SageMaker Model Cards', 'AWS AI Service Cards']
  },
  {
    domainId: 5,
    name: 'Domain 5: Security, Compliance, and Governance',
    weight: '14% of Exam (~9 Questions)',
    coreConcepts: [
      'AWS Shared Responsibility Model for AI (AWS manages FM security & physical infra; Customer manages data, prompts, IAM, output validation)',
      'Amazon Bedrock Guardrails: Denied Topics, Content Filters, Sensitive Information Filters (PII), Contextual Grounding Check',
      'Data Encryption: AWS KMS Customer Managed Keys (CMK) for custom models and S3 vectors',
      'Network Isolation: AWS PrivateLink / VPC Endpoints for Bedrock & SageMaker (traffic never traverses public internet)',
      'Auditing & Compliance: AWS CloudTrail (API logs), AWS CloudWatch (metrics & alarms), AWS Audit Manager (compliance reporting)',
      'SageMaker Model Monitor: Data Drift, Concept Drift, Model Quality Drift'
    ],
    topExamPatterns: [
      'Prevent prompt injection and mask credit card numbers in real time -> Amazon Bedrock Guardrails',
      'Invoke Bedrock without exposing traffic to public internet -> AWS PrivateLink / VPC Interface Endpoint',
      'Log who invoked Bedrock Foundation Models for security audit -> AWS CloudTrail'
    ],
    keyServices: ['Amazon Bedrock Guardrails', 'AWS KMS', 'AWS PrivateLink', 'AWS CloudTrail', 'SageMaker Model Monitor']
  }
];
