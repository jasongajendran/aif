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
    title: 'Amazon Bedrock vs. Amazon SageMaker vs. Pre-built AWS AI Services',
    category: 'core-services',
    badge: 'Exam Core (Domain 3)',
    description: 'The foundational architectural decision tested extensively across AIF-C01.',
    columns: ['Dimension', 'Pre-built AI Services (Amazon Comprehend, Amazon Rekognition, etc.)', 'Amazon Bedrock', 'Amazon SageMaker'],
    rows: [
      {
        feature: 'Primary Use Case',
        values: [
          'Turnkey AI without model training (Optical Character Recognition [OCR], Computer Vision, sentiment analysis, speech transcription)',
          'Serverless Foundation Models (FMs) via unified Application Programming Interface (API) (Claude, Titan, Llama, Nova)',
          'End-to-end custom Machine Learning (ML) lifecycle (custom neural networks, full infrastructure container control)'
        ],
        highlight: true,
        examTip: 'Pre-built = Zero model management; Bedrock = Serverless API for Foundation Models (FMs) and Retrieval-Augmented Generation (RAG); SageMaker = Full ML container & training control.'
      },
      {
        feature: 'Machine Learning (ML) Expertise Needed',
        values: ['Zero ML skills required (standard REST API calls)', 'Low / Prompt Engineering & API integration skills (No server or compute management)', 'High ML / Data Science skills (Hyperparameters, Docker containers, GPU compute sizing)'],
        examTip: 'Exam trap: Choosing SageMaker for standard sentiment analysis or text extraction when pre-built Comprehend or Bedrock requires zero ML expertise.'
      },
      {
        feature: 'Infrastructure Management',
        values: ['100% Fully Managed by AWS', 'Serverless (Zero server/cluster provisioning)', 'Customer provisions/manages instances, clusters, endpoints'],
        examTip: 'Bedrock is 100% serverless with no EC2/EKS management. SageMaker requires choosing instance types (e.g. ml.g5.2xlarge).'
      },
      {
        feature: 'Customization Depth',
        values: ['Custom labels / Custom classification / Custom vocabulary', 'Prompt Engineering, Retrieval-Augmented Generation (RAG), Fine-Tuning, Continued Pre-training', 'Any framework (PyTorch, TensorFlow, XGBoost, Scikit-learn)'],
        examTip: 'Custom Labels = Pre-built AI; Fine-Tuning & RAG = Bedrock; Custom Python training scripts & algorithms = SageMaker.'
      },
      {
        feature: 'Pricing Model',
        values: ['Pay-per-unit (per document page, per audio minute, per image, per text character)', 'Pay-per-token (On-Demand) or Provisioned Throughput (model units/hour)', 'Pay for EC2/GPU instance uptime + storage + data transfer'],
        examTip: 'Bedrock uses on-demand token pricing or Provisioned Throughput. SageMaker charges for running instance hours even when idle.'
      },
      {
        feature: 'Model Governance Tool',
        values: ['AWS AI Service Cards (AWS-authored transparency fact sheets)', 'Amazon Bedrock Guardrails & Automated Model Evaluation', 'Amazon SageMaker Model Cards, Model Monitor, Clarify, Model Registry'],
        examTip: 'Trap: AI Service Cards are ONLY for pre-built AWS AI services. Model Cards are for user-managed custom models!'
      }
    ],
    keyTakeaway: 'Choose Pre-built AI for ready tasks (vision/audio/PII), Bedrock for serverless LLMs & RAG without infra overhead, and SageMaker for full custom ML pipelines & training from scratch.'
  },
  {
    id: 'model-customization-spectrum',
    title: 'Foundation Model (FM) Customization Spectrum (Cost vs. Effort vs. Accuracy)',
    category: 'genai-techniques',
    badge: 'High Frequency (Domain 2 & 3)',
    description: 'Directly maps to 15+ exam questions asking how to inject proprietary data or adjust model behavior and weights.',
    columns: ['Customization Method', 'Changes Model Weights (Internal Numbers)?', 'Data Volume Required', 'Cost & Latency', 'Best For', 'Exam Clues / Triggers'],
    rows: [
      {
        feature: 'Prompt Engineering (Zero-Shot / Few-Shot / Chain-of-Thought [CoT])',
        values: ['NO (Weights stay frozen)', 'None (0 to a few exemplars in prompt)', 'Lowest cost, standard latency', 'Formatting, standard tasks, tone guidance', 'Zero training data, rapid iteration, no coding'],
        examTip: 'Cheapest & fastest iteration. Zero weight changes. Best when general knowledge suffices with clear instructions.'
      },
      {
        feature: 'Retrieval-Augmented Generation (RAG / Knowledge Bases)',
        values: ['NO (Weights stay frozen; facts injected into context window)', 'Enterprise docs in Vector Database (Amazon S3 + OpenSearch / Aurora)', 'Low-Medium cost (DB storage + retrieval latency)', 'Real-time facts, proprietary docs, preventing hallucinations', 'Dynamic knowledge, access control (ACLs), citations/source attribution'],
        highlight: true,
        examTip: 'RAG is the #1 answer when company documents update frequently or citations and access control (ACLs) are required!'
      },
      {
        feature: 'Fine-Tuning (Instruction Tuning / Domain Adaptation / PEFT & LoRA)',
        values: ['YES (Updates weights or low-rank adapter layers)', 'Hundreds to thousands of labeled Prompt-Response pairs (JSON Lines [JSONL])', 'Medium-High cost (training job + provisioned throughput)', 'Specialized style, niche vocabulary, domain-specific format', 'Consistent output formatting, labeled task dataset, jargon'],
        highlight: true,
        examTip: 'Updates model weights using labeled prompt-completion pairs (JSONL). Choose when tone, style, or specific output syntax must be enforced.'
      },
      {
        feature: 'Continued Pre-training (Domain Adaptation on Raw Text)',
        values: ['YES (Updates base foundation model weights)', 'Gigabytes/Billions of tokens of UNLABELED raw domain text', 'High compute cost + Provisioned Throughput needed', 'Teaching base model an entirely new vocabulary (e.g. Legal, Medical, Finance)', 'Raw unlabeled domain corpora, unique syntax, new jargon'],
        examTip: 'Exposes base model to gigabytes of raw UNLABELED domain text (legal/medical) to teach new vocabulary prior to fine-tuning.'
      },
      {
        feature: 'Pre-training from Scratch',
        values: ['YES (Initializes brand-new random weights)', 'Trillions of tokens, massive compute clusters (AWS Trainium / Nvidia GPUs)', 'Extremely Expensive ($ Millions) + Months of time', 'Creating a proprietary foundational base model', 'Very rarely the right answer unless building a sovereign LLM'],
        examTip: 'Exam trap: Almost NEVER the right answer due to multimillion-dollar costs and months of compute on Trainium/GPU clusters.'
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
        values: ['Optical Character Recognition (OCR) & Document Intelligence', 'Extracts tables, forms, key-value pairs, queries, handwritten text from PDFs & images', 'Invoices, receipts, PDF forms, tables, W-2 forms, OCR', 'Does NOT analyze sentiment or natural language context (use Amazon Comprehend)'],
        examTip: 'Keyword triggers: Tables, forms, invoices, receipts, W-2s, AnalyzeDocument API. Trap: Textract does NOT do sentiment analysis.'
      },
      {
        feature: 'Amazon Comprehend',
        values: ['Natural Language Processing (NLP) & Named Entity Recognition (NER)', 'Named Entity Recognition (NER) for Persons/Locations/Dates, sentiment analysis, Personally Identifiable Information (PII) detection/redaction, topic modeling', 'Personally Identifiable Information (PII) redaction, customer reviews sentiment analysis, multi-language NLP', 'Does NOT extract structured layout/tables from PDFs (use Amazon Textract)'],
        examTip: 'Keyword triggers: Named Entity Recognition (NER), Detect Personally Identifiable Information (PII), customer review sentiment analysis, syntax, entity recognition. Trap: Comprehend does NOT extract layout from PDFs.'
      },
      {
        feature: 'Amazon Rekognition',
        values: ['Computer Vision (Images & Video)', 'Facial analysis, object/scene detection, Personal Protective Equipment (PPE) detection, content moderation (unsafe imagery)', 'Helmet/PPE safety compliance, inappropriate image moderation, celebrity detection', 'Does NOT generate new images (use Amazon Titan Image Generator on Bedrock)'],
        examTip: 'Keyword triggers: PPE detection (helmets), facial analysis, content moderation. Trap: Rekognition detects images; it does NOT generate images (Titan does).'
      },
      {
        feature: 'Amazon Transcribe',
        values: [
          'Speech-to-Text (Automated Speech Recognition [ASR])',
          'Call analytics, Custom Vocabularies (teaches technical jargon/brand names), PII audio redaction, Speaker Diarization (automated partitioning of audio to determine "who spoke when" e.g., Agent vs Customer)',
          'Audio recordings, meeting transcripts, contact center multi-speaker calls',
          'Does NOT convert text into spoken audio (use Amazon Polly)'
        ],
        examTip: 'Keyword triggers: Audio speech-to-text, call center analytics, speaker diarization ("who spoke when"), custom vocabulary for specialized jargon.'
      },
      {
        feature: 'Amazon Polly',
        values: [
          'Text-to-Speech (TTS [Written Text to Audio])',
          'Neural & Standard voices, Speech Synthesis Markup Language (SSML tags for pauses, whispering, prosody, and phonemes), custom Pronunciation Lexicons (PLS format for brand names), speech marks',
          'Voiceover, talking avatars, reading articles aloud, accessibility audio',
          'Does NOT transcribe audio to text (use Amazon Transcribe)'
        ],
        examTip: 'Keyword triggers: Text-to-speech, Speech Synthesis Markup Language (SSML tags like <break>, <phoneme>, <whisper>), Neural voice, custom pronunciation lexicons. Trap: Transcribe = Audio->Text, Polly = Text->Audio.'
      },
      {
        feature: 'Amazon Lex',
        values: ['Conversational AI (Chatbots & Voicebots)', 'Intents (user goals), utterances (phrases), slots (parameters), fulfillment via AWS Lambda, connects to Amazon Connect Interactive Voice Response (IVR)', 'IVR, customer service bot, voice assistants, slot filling', 'Does NOT handle unstructured document Q&A out of the box (use Amazon Q Business or Bedrock RAG)'],
        examTip: 'Keyword triggers: Chatbot, voicebot, intents, utterances, slots, Lambda fulfillment, Amazon Connect IVR.'
      },
      {
        feature: 'Amazon Kendra',
        values: ['Intelligent Enterprise Search Engine', 'Natural language search, semantic connectors to Microsoft SharePoint/Confluence/Amazon S3', 'Enterprise search box, indexing internal documents, answering direct FAQ', 'Is a search engine, not a generative creative writing Foundation Model (FM)'],
        examTip: 'Keyword triggers: Enterprise search engine, natural language semantic search across SharePoint, Confluence, S3.'
      },
      {
        feature: 'Amazon Q Business',
        values: ['Generative AI Assistant for Work', 'Connects to 40+ enterprise data sources, enforces user permissions and Access Control Lists (ACLs), writes summaries', 'Workplace chatbot, executive briefings, strict user access control', 'Not for training custom neural network weights'],
        examTip: 'Keyword triggers: Turnkey workplace generative AI assistant respecting source ACL permissions across 40+ enterprise data sources.'
      }
    ],
    keyTakeaway: 'Amazon Transcribe = Speech-to-Text (ASR); Amazon Polly = Text-to-Speech (TTS); Amazon Textract = Document extraction & Optical Character Recognition (OCR); Amazon Comprehend = Text Natural Language Processing (NLP) & Named Entity Recognition (NER) / PII; Amazon Rekognition = Computer Vision; Amazon Lex = Chatbot Dialogues.'
  },
  {
    id: 'sagemaker-governance-matrix',
    title: 'SageMaker Governance & Responsible AI Tools Matrix',
    category: 'governance',
    badge: 'Domain 4 & 5',
    description: 'Differentiates the 5 major SageMaker governance services.',
    columns: ['Tool / Service', 'Primary Function', 'Phase of Machine Learning (ML) Lifecycle', 'Key Deliverables / Metrics', 'Exam Traps to Avoid'],
    rows: [
      {
        feature: 'SageMaker Model Cards',
        values: ['Documenting model metadata, intended uses, training details, evaluation results, risk ratings', 'Post-Training & Pre-Deployment documentation', 'Single source of truth PDF/JSON for model compliance & governance', 'Trap: For custom models created in SageMaker/Bedrock, NOT for AWS pre-built AI services'],
        examTip: 'Single source of truth PDF/JSON documenting model purpose, training data, metrics, and risks for custom models.'
      },
      {
        feature: 'AWS AI Service Cards',
        values: ['AWS-published transparency cards for AWS pre-trained AI services (e.g. Amazon Rekognition, Amazon Comprehend, Amazon Textract)', 'Pre-deployment evaluation of AWS services', 'AWS documentation detailing intended use cases, limitations, and fairness testing by AWS', 'Trap: Created by AWS, NOT customizable by users for their own internal models'],
        examTip: 'Exam Trap: Created by AWS for AWS pre-built services (Amazon Rekognition, Amazon Textract). NOT customizable by customers for their own models!'
      },
      {
        feature: 'SageMaker Clarify',
        values: ['Detecting bias in training data and trained models, and computing Shapley Additive exPlanations (SHAP) feature importance for explainability', 'Pre-Training (data bias) and Post-Training (model bias & explainability)', 'Class Imbalance (CI), Difference in Positive Proportions in Labels (DPL), Shapley Additive exPlanations (SHAP) values, Disparate Impact (DI)', 'Trap: Clarify detects bias & provides explanations; it does NOT automatically rebalance data'],
        examTip: 'Pre-training data bias (Class Imbalance [CI], Difference in Positive Proportions in Labels [DPL]) + Post-training model bias (DPPL, Disparate Impact [DI]) + SHAP explainability. Trap: Clarify identifies bias; it does not clean data.'
      },
      {
        feature: 'SageMaker Model Monitor',
        values: ['Continuous monitoring of deployed production endpoints for drift and data quality degradation', 'Post-Deployment (Production Monitoring)', 'Data quality drift, Concept drift, Model bias drift, Feature attribution drift', 'Trap: Model Monitor triggers CloudWatch alerts; it does NOT train the model'],
        examTip: 'Detects data drift, concept drift, bias drift in live endpoints. Emits CloudWatch metrics; does NOT retrain models automatically.'
      },
      {
        feature: 'SageMaker Model Registry',
        values: ['Cataloging, versioning, approving, and auditing models for production promotion', 'Pre-Deployment & Continuous Integration / Continuous Deployment (CI/CD) Pipeline', 'Model versions, approval status (Approved/Rejected), deployment artifacts', 'Trap: It manages metadata and deployment approvals, not dataset labeling'],
        examTip: 'Model version catalog, approval workflows (Pending/Approved/Rejected), and CI/CD deployment tracking.'
      },
      {
        feature: 'Bedrock Guardrails',
        values: ['Real-time filtering of user prompts and model responses for Personally Identifiable Information (PII), hate speech, denied topics, hallucinations', 'Runtime Inference (Generative AI)', 'Denied topics, content filters (Hate/Insults/Sexual/Violence), PII masking, Grounding Check', 'Trap: Applies to Bedrock Foundation Models (FMs) at inference, not classical ML training algorithms'],
        examTip: 'Runtime safety filters for Bedrock Large Language Models (LLMs): PII masking, denied topics, toxic content, and hallucination grounding checks.'
      }
    ],
    keyTakeaway: 'AWS AI Service Cards = AWS Pre-built; SageMaker Model Cards = Your custom models; SageMaker Clarify = Bias & Shapley Additive exPlanations (SHAP); SageMaker Model Monitor = Production Drift; Amazon Bedrock Guardrails = Generative AI Runtime Safety.'
  },
  {
    id: 'evaluation-metrics-matrix',
    title: 'Evaluation Metrics: Classical Machine Learning (ML) vs. Generative AI',
    category: 'metrics',
    badge: 'Domain 1 & 2 Math',
    description: 'Quick formula and application guide for all exam evaluation questions.',
    columns: ['Metric', 'Formula / Concept', 'When to Prioritize', 'Real-World Example', 'Exam Scenario Clue'],
    rows: [
      {
        feature: 'Recall (Sensitivity / True Positive Rate)',
        values: ['True Positives / (True Positives + False Negatives) [TP / (TP + FN)]', 'When False Negatives (FN) are dangerous / unacceptable (Missing a true disease or fraud)', 'Cancer detection, fraud detection, security threat breaches', 'Must catch all instances of defect or disease; false alarms are acceptable'],
        examTip: 'Formula: TP/(TP+FN). Prioritize when missing a positive case (False Negative) has severe consequences (e.g. Cancer, Fraud).'
      },
      {
        feature: 'Precision (Positive Predictive Value [PPV])',
        values: ['True Positives / (True Positives + False Positives) [TP / (TP + FP)]', 'When False Positives (FP) are costly / disruptive (False alarms)', 'Spam email filter, video recommendation, automatic bank account charge', 'Cannot annoy user with false alarms or block innocent users'],
        examTip: 'Formula: TP/(TP+FP). Prioritize when False Positives are costly or disruptive (e.g. Spam filters, user-facing recommendations).'
      },
      {
        feature: 'F1 Score (Balanced Harmonic Mean)',
        values: ['2 * (Precision * Recall) / (Precision + Recall)', 'Imbalanced datasets where both precision and recall matter', 'Fraud detection with 99.9% non-fraud and 0.1% fraud data', 'Accuracy is misleading due to high class imbalance'],
        examTip: 'Harmonic mean of Precision & Recall: 2*(P*R)/(P+R). Essential metric when evaluating severe class imbalance datasets.'
      },
      {
        feature: 'ROUGE-1 / ROUGE-2 / ROUGE-L (Recall-Oriented Understudy for Gisting Evaluation)',
        values: ['Overlap of unigrams (single words), bigrams (word pairs), and Longest Common Subsequence (LCS) between generated & reference text', 'Summarization tasks & text generation overlap', 'Evaluating Amazon Bedrock summarization output against gold standard summary', 'Summary evaluation, n-gram recall and precision'],
        examTip: 'Measures n-gram overlap & longest common subsequence. Gold standard metric for evaluating Bedrock text summarization quality.'
      },
      {
        feature: 'BLEU (Bilingual Evaluation Understudy)',
        values: ['N-gram precision between machine translation and human reference translations (with brevity penalty)', 'Machine Translation (e.g. English to German)', 'Amazon Translate quality assessment against professional translators', 'Exact word n-gram matching in translation'],
        examTip: 'N-gram precision with brevity penalty. Primary metric for evaluating Machine Translation (Amazon Translate quality).'
      },
      {
        feature: 'BERTScore (Bidirectional Encoder Representations from Transformers Score)',
        values: ['Semantic similarity using contextual vector embeddings rather than exact string matching', 'Paraphrasing and conceptual accuracy where words differ but meaning is identical', 'Evaluating Retrieval-Augmented Generation (RAG) answers where synonyms are used correctly', 'Semantic preservation without requiring exact wording'],
        examTip: 'Semantic embedding similarity. Best for Retrieval-Augmented Generation (RAG) & paraphrase evaluation where wording differs but meaning is identical.'
      },
      {
        feature: 'Perplexity (PPL)',
        values: ['Exponential of cross-entropy loss; measure of model uncertainty predicting next token', 'Evaluating language model fluency and predictability', 'Lower perplexity = model is more confident and fluent in text generation', 'Language modeling intrinsic evaluation, lower is better'],
        examTip: 'Lower is better! Measures model uncertainty predicting the next token; indicates language fluency and confidence.'
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
        values: ['Pre-training', 'Close to 0 ([-1, 1])', 'Measures difference in sample sizes between sensitive facet (a) and non-sensitive facet (d)', 'Resample data, Synthetic Minority Over-sampling Technique (SMOTE), collect more samples for underrepresented group'],
        examTip: 'Pre-training metric. Measures imbalance in sample counts between protected and unprotected groups. Target value: close to 0.'
      },
      {
        feature: 'Difference in Positive Proportions in Labels (DPL)',
        values: ['Pre-training', 'Close to 0 ([-1, 1])', 'Measures if positive ground truth labels are disproportionately assigned to one demographic', 'Relabel data, re-evaluate historical bias in training records'],
        examTip: 'Pre-training metric. Tests if training labels favor one group over another before model training. Target: close to 0.'
      },
      {
        feature: 'Difference in Positive Proportions in Predicted Labels (DPPL)',
        values: ['Post-training', 'Close to 0 ([-1, 1])', 'Measures if the model predictions assign positive outcomes more to one demographic group', 'Adjust classification decision thresholds, retrain with debiased weights'],
        examTip: 'Post-training metric. Tests if model predictions disproportionately favor one group. Target: close to 0.'
      },
      {
        feature: 'Disparate Impact (DI)',
        values: ['Post-training', 'Close to 1.0 (US 80% rule: 0.8 to 1.25)', 'Ratio of selection rates for the sensitive group compared to the unconstrained group', 'Check feature correlations, remove proxy variables (e.g. ZIP code)'],
        examTip: 'Post-training metric. Selection rate ratio: Sensitive / Unconstrained. Target: close to 1.0 (80% rule: 0.8 to 1.25).'
      },
      {
        feature: 'Shapley Additive exPlanations (SHAP [KernelSHAP / TreeSHAP])',
        values: ['Explainability', 'Feature attribution values', 'Calculates marginal contribution of each feature to the final prediction (Local & Global)', 'Identify discriminatory features acting as indirect proxies'],
        examTip: 'Explainability game-theory metric. Quantifies each feature marginal contribution to predictions to identify proxy bias.'
      }
    ],
    keyTakeaway: 'Class Imbalance (CI) & Difference in Positive Proportions in Labels (DPL) = Pre-training data checks; DPPL & Disparate Impact (DI) = Post-training prediction checks; Shapley Additive exPlanations (SHAP) = Feature attribution & explainability.'
  },
  {
    id: 'storage-vector-databases-matrix',
    title: 'AWS Vector Storage & Databases Comparison (Retrieval-Augmented Generation [RAG])',
    category: 'core-services',
    badge: 'Vector Storage (Domain 3)',
    description: 'Detailed architectural comparison of AWS vector stores used with Amazon Bedrock Knowledge Bases.',
    columns: ['Vector Store Option', 'Type & Server Model', 'Best Fit Use Case', 'Key Strengths & Limitations'],
    rows: [
      {
        feature: 'Amazon OpenSearch Serverless (AOSS)',
        values: ['Fully Serverless Vector Engine', 'Default recommended vector store for Amazon Bedrock Knowledge Bases', 'Zero cluster management, auto-scaling OpenSearch Compute Units (OCUs), native Bedrock console integration'],
        examTip: 'Default, turnkey serverless vector store automatically provisioned when creating Bedrock Knowledge Bases.'
      },
      {
        feature: 'Amazon Aurora PostgreSQL (pgvector)',
        values: ['Managed Relational Database (DB) [Provisioned or Serverless v2]', 'Workloads combining structured relational data with vector embeddings in the same SQL DB', 'Atomicity, Consistency, Isolation, Durability (ACID) compliance, SQL queries, enterprise DB features, requires DB provisioning and maintenance'],
        examTip: 'Choose when enterprise already uses Aurora PostgreSQL and wants vector similarity alongside relational tables in standard SQL.'
      },
      {
        feature: 'Amazon Neptune Analytics',
        values: ['Graph Analytics Engine with Vector Search', 'Graph-RAG: queries combining knowledge graphs (relationships) and vector similarity', 'Uncovers deep entity relationships and network graph paths together with semantic similarity'],
        examTip: 'Choose when scenario mentions Knowledge Graphs, fraud networks, or multi-hop entity relationships + vectors.'
      },
      {
        feature: 'Amazon DocumentDB (with vector search)',
        values: ['Managed MongoDB-compatible Document Database', 'JSON document workloads requiring semantic search over JSON schemas', 'Native JSON document storage + vector embeddings, ideal for MongoDB migrations'],
        examTip: 'Choose for MongoDB/JSON document-centric architectures adding vector search capability.'
      },
      {
        feature: 'Pinecone / Redis Enterprise on AWS',
        values: ['Third-Party Managed Vector DBs (AWS Marketplace)', 'Dedicated ultra-low latency vector search and specialized indexing algorithms', 'High throughput, sub-millisecond retrieval, managed outside AWS native control plane'],
        examTip: 'Supported external vector databases in Bedrock Knowledge Bases via AWS Secrets Manager & API keys.'
      }
    ],
    keyTakeaway: 'Amazon OpenSearch Serverless = Default Bedrock RAG vector store; Amazon Aurora pgvector = SQL + Vectors; Amazon Neptune Analytics = Graph-RAG; Amazon DocumentDB = JSON + Vectors.'
  },
  {
    id: 'security-compliance-matrix',
    title: 'AWS AI Security, Privacy & Governance Controls',
    category: 'security',
    badge: 'Security & Compliance (Domain 5)',
    description: 'Mapping AWS security mechanisms to generative AI risks (data leakage, prompt injection, compliance).',
    columns: ['Security Mechanism', 'Layer & Scope', 'Primary Threat / Protection', 'Exam Key Takeaway'],
    rows: [
      {
        feature: 'Amazon Bedrock Guardrails',
        values: ['Runtime Inference (Prompt & Output)', 'Personally Identifiable Information (PII) redaction, prompt injection attacks, denied business topics, toxic content', 'Real-time safety firewall applied across all Bedrock foundation models with configurable sensitivity thresholds'],
        examTip: 'The #1 answer for masking Personally Identifiable Information (PII) [credit cards/SSN], blocking harmful topics, and filtering prompt injection in Bedrock.'
      },
      {
        feature: 'AWS PrivateLink / Virtual Private Cloud (VPC) Interface Endpoints',
        values: ['Network Transport Layer', 'Data traversing public internet; compliance with HIPAA/PCI-DSS', 'Keeps all Bedrock and SageMaker API calls securely inside your private VPC without internet gateways'],
        examTip: 'Ensures API traffic to Bedrock/SageMaker never leaves the private AWS network backbone.'
      },
      {
        feature: 'AWS Key Management Service (AWS KMS) [Customer Managed Keys - CMK]',
        values: ['Data at Rest Encryption', 'Unauthorized access to fine-tuned model artifacts and Amazon S3 vector embeddings', 'Enables envelope encryption using customer-controlled keys for Bedrock custom models and Knowledge Bases'],
        examTip: 'Required when compliance dictates customer full control over key rotation and cryptographic access policies.'
      },
      {
        feature: 'AWS CloudTrail',
        values: ['Application Programming Interface (API) Auditing & Governance', 'Unauthorized model invocations, lack of compliance audit trails', 'Logs all management (control plane) and data plane API calls (InvokeModel, CreateAgent) with caller Identity and Access Management (IAM) identity'],
        examTip: 'Answers: "Who invoked which Bedrock model and at what time?" for regulatory audit requirements.'
      },
      {
        feature: 'Amazon Macie',
        values: ['Data Ingestion Discovery & S3 Security', 'Unintended Personally Identifiable Information (PII) stored in raw Amazon S3 training or RAG data buckets', 'Uses pattern matching and Machine Learning (ML) to discover, classify, and alert on sensitive PII stored in S3 data sources'],
        examTip: 'Discovers and flags unencrypted sensitive PII sitting in S3 buckets BEFORE ingesting into Bedrock Knowledge Bases.'
      }
    ],
    keyTakeaway: 'Amazon Bedrock Guardrails = Runtime prompt/output safety; AWS PrivateLink = Private Virtual Private Cloud (VPC) network; AWS Key Management Service (KMS) = Encryption at rest; AWS CloudTrail = API audit trail; Amazon Macie = Amazon S3 Personally Identifiable Information (PII) discovery.'
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
            label: 'Ready-made cognitive task (Optical Character Recognition [OCR], Computer Vision, Audio Transcription [ASR], Translation, PII [Personally Identifiable Information] Redaction)',
            description: 'Standard vision, speech, document, or NLP [Natural Language Processing] task with no custom generative creativity needed.',
            nextNodeId: 'node_prebuilt_branch'
          },
          {
            label: 'Generative AI (Text generation, Chat, Summarization, Code, Multimodal LLM [Large Language Model])',
            description: 'Leveraging Foundation Models (FMs / LLMs) with natural language prompts or proprietary docs.',
            nextNodeId: 'node_genai_branch'
          },
          {
            label: 'Custom Machine Learning (Predictive models, tabular data, custom algorithms, custom training)',
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
            description: 'Structured Optical Character Recognition (OCR) from complex documents.',
            recommendation: {
              service: 'Amazon Textract',
              reason: 'Textract handles structured document extraction, tables, forms, and custom queries beyond basic Optical Character Recognition (OCR).',
              examTip: 'Exam trigger: "extract tables from invoices" -> Amazon Textract AnalyzeDocument.',
              targetQuestionIds: [12, 45, 108]
            }
          },
          {
            label: 'Detect PII (Personally Identifiable Information), sentiment, or redact sensitive entities in text',
            description: 'Analyzing text documents or customer tickets for compliance & sentiment using Named Entity Recognition (NER).',
            recommendation: {
              service: 'Amazon Comprehend',
              reason: 'Comprehend provides turnkey sentiment analysis, Named Entity Recognition (NER), and automated Personally Identifiable Information (PII) redaction.',
              examTip: 'Exam trigger: "redact PII from customer complaints without ML models" -> Amazon Comprehend.',
              targetQuestionIds: [15, 62, 140]
            }
          },
          {
            label: 'Audio transcription / speech to text for contact centers (Automated Speech Recognition [ASR])',
            description: 'Transcribing customer calls with speaker diarization (separating "who spoke when" e.g., Agent vs Customer).',
            recommendation: {
              service: 'Amazon Transcribe',
              reason: 'Transcribe provides speech-to-text (ASR [Automated Speech Recognition]), call analytics, custom vocabularies (technical terms/acronyms), and speaker diarization (identifying who spoke when in multi-speaker audio).',
              examTip: 'Exam trigger: "transcribe customer phone recordings with speaker identification" -> Amazon Transcribe with Speaker Diarization.',
              targetQuestionIds: [22, 88]
            }
          },
          {
            label: 'Convert written text into natural human speech (Text-to-Speech [TTS])',
            description: 'Generating voiceovers or interactive audio playback with customized pauses and emotion.',
            recommendation: {
              service: 'Amazon Polly',
              reason: 'Polly converts text into lifelike speech using Neural Text-to-Speech (TTS), Speech Synthesis Markup Language (SSML tags for pauses, whispering, and phonemes), and custom Pronunciation Lexicons (PLS format for brand names).',
              examTip: 'Exam trigger: "generate audio voiceover with custom pauses or whispering" -> Amazon Polly with Speech Synthesis Markup Language (SSML tags such as <break>, <phoneme>, <whisper>).',
              targetQuestionIds: [30, 95]
            }
          }
        ]
      },
      node_genai_branch: {
        id: 'node_genai_branch',
        title: 'Step 2: Foundation Model Strategy',
        question: 'How do you want to access and customize the Foundation Model (FM)?',
        options: [
          {
            label: 'Serverless API access to leading models (Claude, Titan, Llama) with Zero Infrastructure',
            description: 'Standard prompt engineering, Bedrock Guardrails, and managed Knowledge Bases (RAG [Retrieval-Augmented Generation]).',
            recommendation: {
              service: 'Amazon Bedrock',
              reason: 'Amazon Bedrock provides unified serverless API access to top Foundation Models (FMs) with built-in RAG (Retrieval-Augmented Generation) and Guardrails.',
              examTip: 'Exam trigger: "serverless access to FMs with minimal operational overhead" -> Amazon Bedrock.',
              targetQuestionIds: [1, 5, 20, 50]
            }
          },
          {
            label: 'Ready-to-use Generative AI Workplace Assistant with built-in enterprise connectors & permissions',
            description: 'Employees need a turnkey chat assistant connected to SharePoint, Confluence, S3, and Jira.',
            recommendation: {
              service: 'Amazon Q Business',
              reason: 'Amazon Q Business provides an out-of-the-box enterprise GenAI assistant with native identity ACL (Access Control List) enforcement.',
              examTip: 'Exam trigger: "workplace AI assistant enforcing existing user permissions across 40+ SaaS tools" -> Amazon Q Business.',
              targetQuestionIds: [34, 112]
            }
          },
          {
            label: 'Deploy open-source LLMs (Falcon, Mistral, Hugging Face) on dedicated GPU instances with full container control',
            description: 'Need custom Docker containers, VPC (Virtual Private Cloud) peering, and customized inference scripts.',
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
            label: 'Automate model creation for tabular data with zero ML code (AutoML)',
            description: 'Automatically explore algorithms, feature engineering, and hyperparameter tuning.',
            recommendation: {
              service: 'Amazon SageMaker Autopilot',
              reason: 'Autopilot automatically inspects raw tabular data, selects top algorithms, trains, and exposes full Python notebooks.',
              examTip: 'Exam trigger: "automatically build and tune ML models for tabular dataset with transparency" -> SageMaker Autopilot.',
              targetQuestionIds: [18, 77]
            }
          },
          {
            label: 'Audit dataset and model for bias and compute SHAP (Shapley Additive exPlanations) explainability',
            description: 'Regulatory requirement to explain feature importance and check demographic parity.',
            recommendation: {
              service: 'Amazon SageMaker Clarify',
              reason: 'Clarify provides pre-training data bias detection (CI [Class Imbalance], DPL [Difference in Positive Proportions in Labels]), post-training prediction bias, and SHAP (Shapley Additive exPlanations) explainability.',
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
  },
  {
    id: 'security-compliance-decision-flow',
    title: 'Security, Privacy & Governance Decision Flow',
    description: 'Pinpoints the exact AWS security control for PII redaction, encryption, private networking, or model audits.',
    badge: 'Security Flow (Domain 5)',
    rootNodeId: 'node_sec_start',
    nodes: {
      node_sec_start: {
        id: 'node_sec_start',
        title: 'Step 1: Primary Security & Governance Requirement',
        question: 'Which AI security, privacy, or compliance dimension must be addressed?',
        options: [
          {
            label: 'Runtime Guardrails (Mask PII, prevent prompt injection, block harmful topics)',
            description: 'Protecting LLM prompts and completions in real-time during user interactions.',
            nextNodeId: 'node_sec_guardrail_branch'
          },
          {
            label: 'Data at Rest & Transit Encryption (KMS Customer Managed Keys & Private Networking)',
            description: 'Ensuring model weights, embeddings, and API calls never traverse public networks.',
            nextNodeId: 'node_sec_encryption_branch'
          },
          {
            label: 'Model Governance & Regulatory Auditing (CloudTrail API logs, Model Cards, A2I Human Review)',
            description: 'Meeting regulatory audit standards for model lineage, approvals, and human oversight.',
            nextNodeId: 'node_sec_governance_branch'
          }
        ]
      },
      node_sec_guardrail_branch: {
        id: 'node_sec_guardrail_branch',
        title: 'Step 2: Specific Runtime Threat Protection',
        question: 'What specific safety mechanism must be configured?',
        options: [
          {
            label: 'Mask sensitive PII entities (SSN, credit cards, bank accounts) in Bedrock prompts and completions',
            description: 'Anonymizing customer data in real time before processing.',
            recommendation: {
              service: 'Amazon Bedrock Guardrails (Sensitive Information Filters)',
              reason: 'Bedrock Guardrails provides turnkey PII entity masking (anonymization) for over 30+ standard PII types with zero custom code.',
              examTip: 'Exam trigger: "mask credit card numbers in Bedrock model inputs and responses" -> Bedrock Guardrails.',
              targetQuestionIds: [9, 54, 130]
            }
          },
          {
            label: 'Verify that generative responses are strictly grounded in retrieved reference documents',
            description: 'Preventing hallucinations by scoring context grounding and relevance.',
            recommendation: {
              service: 'Bedrock Guardrails Contextual Grounding Check',
              reason: 'Contextual Grounding Check calculates grounding and relevance confidence scores between retrieved chunks and model outputs.',
              examTip: 'Exam trigger: "detect hallucinated claims not supported by RAG source docs" -> Contextual Grounding Check.',
              targetQuestionIds: [11, 58, 125]
            }
          }
        ]
      },
      node_sec_encryption_branch: {
        id: 'node_sec_encryption_branch',
        title: 'Step 2: Encryption & Isolation Strategy',
        question: 'What network or cryptographic control is required?',
        options: [
          {
            label: 'Encrypt Bedrock custom models, fine-tuning jobs, and Knowledge Bases with Customer Managed Keys',
            description: 'Company policy requires full ownership of encryption key rotation and revocation policies.',
            recommendation: {
              service: 'AWS Key Management Service (AWS KMS CMK)',
              reason: 'AWS KMS Customer Managed Keys provide envelope encryption with granular IAM key policies and automated annual rotation.',
              examTip: 'Exam trigger: "regulatory requirement for customer to control and audit key rotation for AI models" -> AWS KMS CMK.',
              targetQuestionIds: [29, 94]
            }
          },
          {
            label: 'Access Bedrock and SageMaker APIs privately from VPC without traversing the public internet',
            description: 'Strict network isolation complying with HIPAA and PCI-DSS standards.',
            recommendation: {
              service: 'AWS PrivateLink (VPC Interface Endpoints)',
              reason: 'VPC Interface Endpoints create private ENIs inside your subnets, routing all API calls across AWS private network fiber.',
              examTip: 'Exam trigger: "prevent Bedrock API traffic from traversing the public internet" -> AWS PrivateLink / VPC Interface Endpoint.',
              targetQuestionIds: [26, 91]
            }
          }
        ]
      },
      node_sec_governance_branch: {
        id: 'node_sec_governance_branch',
        title: 'Step 2: Governance & Human Oversight Tool',
        question: 'Which governance workflow is needed?',
        options: [
          {
            label: 'Route low-confidence AI predictions (Textract/Rekognition) to human reviewers before final approval',
            description: 'Establishing a Human-in-the-Loop (HITL) quality control workflow.',
            recommendation: {
              service: 'Amazon Augmented AI (Amazon A2I)',
              reason: 'Amazon A2I integrates directly with Textract, Rekognition, and custom SageMaker models to route low-confidence inferences to human review teams.',
              examTip: 'Exam trigger: "human review workflow for low-confidence ML predictions" -> Amazon Augmented AI (A2I).',
              targetQuestionIds: [17, 72, 145]
            }
          },
          {
            label: 'Log and audit every API request made to foundation models with user identity and timestamp',
            description: 'Security forensics and regulatory compliance monitoring.',
            recommendation: {
              service: 'AWS CloudTrail (Bedrock Data Plane & Management Events)',
              reason: 'CloudTrail captures all Bedrock InvokeModel and control-plane API calls, logging caller ARN, IP address, and request time.',
              examTip: 'Exam trigger: "audit which IAM user invoked Bedrock models for compliance" -> AWS CloudTrail.',
              targetQuestionIds: [31, 99]
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
  },
  {
    id: 'bedrock-agents-action-group',
    title: 'Amazon Bedrock: Agents Action Group Lambda Handler',
    service: 'Amazon Bedrock Agents',
    language: 'python',
    category: 'bedrock',
    description: 'Python Lambda handler executing business actions for Bedrock Agents defined by OpenAPI 3.0 schema.',
    code: `import json

def lambda_handler(event, context):
    # Bedrock Agents passes agent, actionGroup, apiPath, httpMethod, and parameters
    action_group = event.get('actionGroup')
    api_path = event.get('apiPath')
    http_method = event.get('httpMethod')
    parameters = event.get('parameters', [])
    
    # Extract query parameters parsed from user prompt by FM
    param_dict = {p['name']: p['value'] for p in parameters}
    
    if api_path == '/check-flight-status':
        flight_id = param_dict.get('flightId', 'FL-100')
        result = {'flightId': flight_id, 'status': 'ON_TIME', 'gate': 'B14'}
    else:
        result = {'error': f'Unsupported API path: {api_path}'}
        
    # Return structured Bedrock Agent response body
    response_body = {
        'application/json': {
            'body': json.dumps(result)
        }
    }
    
    return {
        'messageVersion': '1.0',
        'response': {
            'actionGroup': action_group,
            'apiPath': api_path,
            'httpMethod': http_method,
            'httpStatusCode': 200,
            'responseBody': response_body
        }
    }`,
    keyParameters: [
      { param: 'actionGroup', meaning: 'The logical group of APIs defined in Bedrock Agent console' },
      { param: 'apiPath', meaning: 'The OpenAPI operation route (e.g. /check-flight-status) invoked by the FM reasoning loop' },
      { param: 'messageVersion: "1.0"', meaning: 'Required protocol version for Bedrock Agent Lambda responses' }
    ],
    commonTrap: 'Exam trap: Bedrock Agents require BOTH an OpenAPI schema (JSON/YAML) and an AWS Lambda function to execute external actions.'
  },
  {
    id: 'sagemaker-async-inference',
    title: 'Amazon SageMaker: Asynchronous Inference Endpoint (Boto3)',
    service: 'Amazon SageMaker Runtime',
    language: 'python',
    category: 'sagemaker',
    description: 'Invoking SageMaker Asynchronous endpoint for large payload processing (up to 1GB) and auto-scaling to zero.',
    code: `import boto3

sm_runtime = boto3.client('sagemaker-runtime', region_name='us-east-1')

# Async inference takes S3 input location instead of direct HTTP payload
response = sm_runtime.invoke_endpoint_async(
    EndpointName='large-vision-transformer-async-ep',
    InputLocation='s3://model-payload-bucket/inputs/heavy-video-clip.mp4',
    ContentType='video/mp4',
    Accept='application/json',
    InvocationTimeoutSeconds=3600  # Up to 1 hour max processing time
)

# Returns output S3 URI immediately without blocking client
output_location = response['OutputLocation']
print("Asynchronous job queued. Result will be written to:", output_location)
# Optional: Subscribe Amazon SNS topic to receive notification upon completion`,
    keyParameters: [
      { param: 'invoke_endpoint_async', meaning: 'Non-blocking invocation that queues requests in Amazon S3 and supports up to 1GB payloads' },
      { param: 'InvocationTimeoutSeconds', meaning: 'Maximum processing duration before timeout (up to 3600 seconds / 1 hour)' },
      { param: 'Scale to zero', meaning: 'Async endpoints automatically scale instance count down to 0 when queue is empty to save cost' }
    ],
    commonTrap: 'Exam trap: Real-time endpoints have a 6MB payload limit and 60s timeout. For large files (video/audio/large docs) or long jobs, use Asynchronous Inference.'
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
  },
  {
    id: 'rule-human-in-the-loop-a2i',
    category: 'golden-rule',
    title: 'Amazon Augmented AI (A2I) for Human-in-the-Loop',
    formulaOrRule: 'Model Confidence < Configured Threshold -> Automatically route inference to human review team',
    explanation: 'Amazon A2I provides built-in human review workflows for Amazon Textract (document extraction), Amazon Rekognition (content moderation), and custom SageMaker models. When prediction confidence falls below a configured threshold, the task is sent to internal or external workforce reviewers.',
    whyItMatters: 'Guaranteed exam scenario when high accuracy is legally required and low-confidence predictions cannot be automated.',
    relatedTopic: 'Responsible AI & Operations'
  },
  {
    id: 'rule-sagemaker-inference-types',
    category: 'metric-rule',
    title: 'SageMaker 4 Inference Options Matrix',
    formulaOrRule: 'Real-Time (<60s, <=6MB) | Async (<=1hr, <=1GB, SNS) | Serverless (Intermittent) | Batch Transform (Offline)',
    explanation: 'Real-Time: sub-second latency, 24/7 endpoint. Asynchronous: queues large payloads up to 1GB, scales down to 0 when idle. Serverless: auto-scales for intermittent traffic, pays only per inference duration. Batch Transform: processes non-real-time datasets in bulk on S3 without keeping endpoints running.',
    whyItMatters: 'Core architecture question on cost-optimized model deployment.',
    relatedTopic: 'Applications of AI'
  },
  {
    id: 'rule-shared-responsibility-bedrock',
    category: 'golden-rule',
    title: 'AWS Shared Responsibility Model for Generative AI',
    formulaOrRule: 'AWS manages: FM infrastructure, base weights, physical data centers | Customer manages: Prompts, data encryption, IAM permissions, output validation',
    explanation: 'For Amazon Bedrock (managed serverless service), AWS is responsible for securing the base model weights, underlying compute clusters, and multi-tenant isolation. The customer is responsible for data encryption (KMS), IAM access policies, prompt safety (Guardrails), and validating generated responses.',
    whyItMatters: 'Critical boundary question in Domain 5 (Security and Compliance).',
    relatedTopic: 'Security & Compliance'
  },
  {
    id: 'rule-rouge-metrics-breakdown',
    category: 'mnemonic',
    title: 'ROUGE Metrics Breakdown (1, 2, and L)',
    formulaOrRule: 'ROUGE-1 = Unigrams (single words) | ROUGE-2 = Bigrams (word pairs) | ROUGE-L = Longest Common Subsequence',
    explanation: 'ROUGE measures overlap between generated text and reference text. ROUGE-1 evaluates vocabulary overlap. ROUGE-2 evaluates adjacent word-pair order. ROUGE-L evaluates the longest matching word sequence while preserving sentence structure.',
    whyItMatters: 'High-frequency GenAI text summarization evaluation metric on AIF-C01.',
    relatedTopic: 'Generative AI Fundamentals'
  },
  {
    id: 'rule-underfitting-vs-overfitting',
    category: 'mnemonic',
    title: 'Underfitting (High Bias) vs. Overfitting (High Variance)',
    formulaOrRule: 'High Bias = Model too simple (Underfitting) | High Variance = Model memorizes noise (Overfitting)',
    explanation: 'Underfitting: Low training accuracy & low test accuracy. Fix: Increase model capacity, add features, reduce regularization. Overfitting: High training accuracy & low test accuracy. Fix: Add L1/L2 regularization, dropout, early stopping, gather more training data.',
    whyItMatters: 'Fundamental ML diagnostic questions appear across multiple domains.',
    relatedTopic: 'Fundamentals of AI/ML'
  },
  {
    id: 'rule-privatelink-vpc-endpoints',
    category: 'trap-alert',
    title: 'AWS PrivateLink Interface VPC Endpoints',
    formulaOrRule: 'VPC Endpoint = Zero Public Internet Traversal for Bedrock and SageMaker API calls',
    explanation: 'To satisfy strict regulatory compliance (HIPAA, PCI-DSS, FedRAMP), configure AWS PrivateLink interface endpoints to keep Bedrock and SageMaker traffic within the private AWS network backbone without requiring Internet Gateways or NAT Gateways.',
    whyItMatters: 'Top enterprise security pattern for financial and healthcare compliance.',
    relatedTopic: 'Security, Compliance & Governance'
  },
  {
    id: 'rule-data-drift-vs-concept-drift',
    category: 'metric-rule',
    title: 'Data Drift vs. Concept Drift in SageMaker Model Monitor',
    formulaOrRule: 'Data Drift: Input distribution P(X) changes | Concept Drift: Target relationship P(Y|X) changes',
    explanation: 'Data Drift (Feature Drift): Statistical distribution of incoming inputs changes over time (e.g. average applicant age shifts). Concept Drift: Statistical relationship between features and target changes (e.g. consumer purchasing habits change fundamentally after an economic shock).',
    whyItMatters: 'Model Monitor monitoring types tested in Domain 4.',
    relatedTopic: 'Governance & Monitoring'
  },
  {
    id: 'rule-bedrock-agents-openapi',
    category: 'trap-alert',
    title: 'Bedrock Agents Architecture: OpenAPI 3.0 + AWS Lambda',
    formulaOrRule: 'Bedrock Agent = Foundation Model Reasoning (ReAct) + Action Groups (OpenAPI Schema + Lambda)',
    explanation: 'Bedrock Agents break down complex multi-step user tasks into logical steps using ReAct prompting. To invoke external business systems or APIs, you define Action Groups containing an OpenAPI 3.0 schema that specifies API parameters, mapped to an AWS Lambda function that executes the action.',
    whyItMatters: 'Key architecture question on autonomous agents and API orchestration.',
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
      'Supervised vs. Unsupervised vs. Reinforcement Learning (RL)',
      'Model Weights (w) vs. Biases (b) vs. Hyperparameters (Internal learned multipliers vs human-tuned knobs)',
      'Underfitting (High Bias) vs. Overfitting (High Variance)',
      'Train / Validation / Test data split rules (e.g. 70/15/15)',
      'Evaluation Metrics: Accuracy, Precision, Recall (Sensitivity), F1 Score, ROC-AUC (Receiver Operating Characteristic - Area Under Curve), RMSE (Root Mean Squared Error), MAE (Mean Absolute Error)',
      'Confusion Matrix terms: TP (True Positive), TN (True Negative), FP (False Positive / Type I Error), FN (False Negative / Type II Error)',
      'Feature Engineering & Normalization (StandardScaler, MinMaxScaler, One-Hot Encoding)'
    ],
    topExamPatterns: [
      'Scenario with imbalanced dataset -> Choose F1-score over Accuracy',
      'Scenario where missing fraud is critical -> Maximize Recall (Sensitivity)',
      'Weights are learned parameters adjusted automatically via backpropagation; Hyperparameters (e.g. Learning Rate) are set before training',
      'Scenario where training loss is low but validation loss is high -> Overfitting (Apply L1/L2 regularization, dropout, or early stopping)'
    ],
    keyServices: ['Amazon SageMaker Autopilot (AutoML)', 'Amazon SageMaker Data Wrangler', 'Amazon SageMaker Feature Store']
  },
  {
    domainId: 2,
    name: 'Domain 2: Fundamentals of Generative AI',
    weight: '24% of Exam (~16 Questions)',
    coreConcepts: [
      'Model Customization Weight Spectrum: Prompting (100% Frozen) ➔ RAG (100% Frozen) ➔ PEFT/LoRA (Adapters ~1%) ➔ Fine-Tuning (Updated 100%)',
      'Transformer Architecture: Self-Attention Mechanism, Encoders (BERT [Bidirectional Encoder Representations from Transformers]) vs Decoders (GPT / Claude)',
      'Tokens vs Words (~100 tokens = 75 words / ~0.75 words per token)',
      'Inference Parameters: Temperature (Randomness), Top-P (Nucleus Sampling), Top-K (Candidate Pool), Max Tokens, Stop Sequences',
      'Prompt Engineering Strategies: Zero-Shot, Few-Shot (In-Context Learning), Chain-of-Thought (CoT), Directional Stimulus, ReAct (Reason + Action)',
      'Hallucinations & Context Drift root causes (Mitigation: RAG [Retrieval-Augmented Generation], Guardrails, Low Temperature)',
      'GenAI Evaluation: ROUGE (Recall-Oriented Understudy for Gisting Evaluation 1/2/L), BLEU (Bilingual Evaluation Understudy), BERTScore, Perplexity (PPL)'
    ],
    topExamPatterns: [
      'Need deterministic factual output -> Set Temperature to 0.0',
      'Customizing FM with private company docs without retraining weights -> Amazon Bedrock Knowledge Bases (RAG)',
      'Multi-step math problem fails -> Apply Chain-of-Thought (CoT) prompting',
      'Summarization accuracy evaluation -> ROUGE-L (Longest Common Subsequence [LCS]) metric'
    ],
    keyServices: ['Amazon Bedrock', 'Amazon Bedrock Playgrounds', 'Amazon Titan Text Models']
  },
  {
    domainId: 3,
    name: 'Domain 3: Applications of Foundation Models',
    weight: '28% of Exam (~18 Questions)',
    coreConcepts: [
      'Customization Continuum: Prompt Engineering -> RAG (Retrieval-Augmented Generation) -> Fine-Tuning (PEFT [Parameter-Efficient Fine-Tuning] / LoRA [Low-Rank Adaptation]) -> Continued Pre-training -> Pre-training from Scratch',
      'Amazon Bedrock Knowledge Bases Architecture (S3 [Simple Storage Service] -> Embedding Model -> Vector Index -> Grounded Prompt Augmentation)',
      'Amazon Bedrock Agents (Action Groups, OpenAPI 3.0 Schema, AWS Lambda invocation, Session Memory)',
      'Bedrock Provisioned Throughput (Dedicated Model Units [MUs]) vs. On-Demand Serverless Pricing',
      'Pre-built AI Services: Comprehend (NLP/NER [Named Entity Recognition] & PII), Textract (OCR [Optical Character Recognition] Tables/Forms), Rekognition (Computer Vision), Transcribe (ASR [Automated Speech Recognition], Speaker Diarization ["Who spoke when"], Custom Vocabularies), Polly (TTS [Text-to-Speech], SSML [Speech Synthesis Markup Language], Custom Lexicons), Translate, Lex (Chatbot NLU), Kendra, Q Business',
      'Vector Databases on AWS: Amazon OpenSearch Serverless, Amazon Aurora PostgreSQL pgvector, Amazon Neptune Analytics'
    ],
    topExamPatterns: [
      'Frequently updating private company documentation -> Amazon Bedrock Knowledge Bases (RAG [Retrieval-Augmented Generation])',
      'Extracting tables and key-value forms from invoices -> Amazon Textract AnalyzeDocument',
      'Contact center audio with speaker separation -> Amazon Transcribe with Speaker Diarization ("Who spoke when")',
      'Synthesizing speech with custom pauses/whispering -> Amazon Polly with Speech Synthesis Markup Language (SSML tags such as <break>, <phoneme>, <whisper>)',
      'Workplace assistant with enterprise ACLs (Access Control Lists) -> Amazon Q Business',
      'Guaranteed TPS (Transactions Per Second) and sub-second latency under high load -> Bedrock Provisioned Throughput'
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
      'SageMaker Clarify Metrics: Class Imbalance (CI), Difference in Positive Proportions in Labels (DPL), DPPL (Difference in Positive Proportions in Predicted Labels), Disparate Impact (DI)',
      'Explainability: SHAP (Shapley Additive exPlanations) vs. LIME (Local Interpretable Model-agnostic Explanations), Global Feature Importance vs Local Prediction Attributions',
      'Human-in-the-Loop (HITL): Amazon Augmented AI (Amazon A2I) for low-confidence review workflows',
      'AI Service Cards (AWS-authored for pre-built AI) vs. Model Cards (Customer-authored for custom SageMaker models)'
    ],
    topExamPatterns: [
      'Detect bias in dataset before model training -> SageMaker Clarify Pre-Training Bias (CI [Class Imbalance], DPL [Difference in Positive Proportions in Labels])',
      'Human review workflow for low-confidence Textract/Rekognition predictions -> Amazon A2I (Augmented AI [HITL])',
      'Documenting custom model intended use and evaluation results -> Amazon SageMaker Model Cards'
    ],
    keyServices: ['Amazon SageMaker Clarify', 'Amazon Augmented AI (Amazon A2I)', 'Amazon SageMaker Model Cards', 'AWS AI Service Cards']
  },
  {
    domainId: 5,
    name: 'Domain 5: Security, Compliance, and Governance',
    weight: '14% of Exam (~9 Questions)',
    coreConcepts: [
      'AWS Shared Responsibility Model for AI (AWS manages Foundation Model security & physical infra; Customer manages data, prompts, IAM [Identity and Access Management], output validation)',
      'Amazon Bedrock Guardrails: Denied Topics, Content Filters, Sensitive Information Filters (PII [Personally Identifiable Information] & PHI [Protected Health Information]), Contextual Grounding Check (Hallucination Detection)',
      'Data Encryption: AWS KMS (Key Management Service) Customer Managed Keys (CMK) for custom models and S3 vectors',
      'Network Isolation: AWS PrivateLink / VPC (Virtual Private Cloud) Endpoints for Bedrock & SageMaker (traffic never traverses public internet)',
      'Auditing & Compliance: AWS CloudTrail (API logs & caller identity), AWS CloudWatch (metrics & alarms), AWS Audit Manager (compliance reporting)',
      'SageMaker Model Monitor: Data (Feature) Drift, Concept (Target) Drift, Model Quality Drift'
    ],
    topExamPatterns: [
      'Prevent prompt injection and mask credit card numbers in real time -> Amazon Bedrock Guardrails',
      'Invoke Bedrock without exposing traffic to public internet -> AWS PrivateLink / VPC (Virtual Private Cloud) Interface Endpoint',
      'Log who invoked Bedrock Foundation Models for security audit -> AWS CloudTrail'
    ],
    keyServices: ['Amazon Bedrock Guardrails', 'AWS KMS (Key Management Service)', 'AWS PrivateLink', 'AWS CloudTrail', 'Amazon SageMaker Model Monitor']
  }
];
