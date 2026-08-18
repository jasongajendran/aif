import React, { useMemo } from 'react';

interface HighlightedExamTextProps {
  text: string;
  clues?: string[];
  topic?: string;
  domain?: string;
  enabled?: boolean;
  className?: string;
}

// Stop words to exclude when extracting sub-keywords
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'which', 'should', 'use', 'using', 'need', 'needs', 'team',
  'company', 'organization', 'application', 'developer', 'system', 'must'
]);

// Common question intent triggers on the AIF-C01 exam
const QUESTION_INTENT_PATTERNS = [
  'evaluation metric',
  'least operational overhead',
  'least operational effort',
  'most cost-effective',
  'lowest cost',
  'lowest latency',
  'sub-second latency',
  'simplest way',
  'most secure',
  'sagemaker deployment option',
  'sagemaker deployment',
  'sagemaker capability',
  'sagemaker feature',
  'machine learning approach',
  'machine learning technique',
  'prompt engineering technique',
  'aws service',
  'aws feature',
  'bedrock feature',
  'bedrock capability',
  'implementation method',
  'deployment option',
  'measure this performance',
  'measure performance',
  'align outputs',
  'private connectivity',
  'offline connectivity',
  'offline-capable'
];

// Common core high-yield exam domain keywords
const HIGH_YIELD_DOMAIN_TERMS = [
  'least operational overhead',
  'least operational effort',
  'most cost-effective',
  'lowest latency',
  'zero data retention',
  'without traversing public internet',
  'without traversing the public internet',
  'isolated vpc',
  'offline-capable',
  'offline capable',
  'human-in-the-loop',
  'human review',
  'data drift',
  'concept drift',
  'data leakage',
  'prompt injection',
  'jailbreak',
  'hallucination',
  'catastrophic forgetting',
  'overfitting',
  'underfitting',
  'high bias',
  'high variance',
  'precision',
  'recall',
  'f1-score',
  'accuracy',
  'rmse',
  'r-squared',
  'confusion matrix',
  'smote',
  'imbalanced dataset',
  'unlabelled',
  'unlabeled',
  'supervised learning',
  'unsupervised learning',
  'reinforcement learning',
  'rlhf',
  'system prompt',
  'few-shot',
  'zero-shot',
  'chain-of-thought',
  'retrieval augmented generation',
  'rag',
  'fine-tuning',
  'peft',
  'lora',
  'provisioned throughput',
  'asynchronous inference',
  'real-time inference',
  'serverless inference',
  'batch transform',
  'feature store',
  'model cards',
  'clarify',
  'ground truth',
  'augmented ai',
  'a2i',
  'bedrock guardrails',
  'knowledge bases',
  'amazon q business',
  'amazon q developer',
  'textract',
  'comprehend',
  'transcribe',
  'polly',
  'rekognition',
  'kendra'
];

interface MatchSpan {
  start: number;
  end: number;
  matchedText: string;
}

/**
 * Intelligent Keyword Highlighter for AWS Certified AI Practitioner (AIF-C01) Exam
 * Scans scenario context and question text to highlight exam trigger keywords in vivid gold/yellow.
 */
export const HighlightedExamText: React.FC<HighlightedExamTextProps> = ({
  text,
  clues = [],
  topic,
  domain,
  enabled = true,
  className = ''
}) => {
  const renderedContent = useMemo(() => {
    if (!enabled || !text || typeof text !== 'string') {
      return text;
    }

    const lowerText = text.toLowerCase();
    const candidateTerms = new Set<string>();

    // 1. Add provided keyword clues
    clues.forEach((clue) => {
      if (!clue || typeof clue !== 'string') return;
      
      const cleanClue = clue.trim();
      if (cleanClue.length < 3) return;

      // Extract raw clue without parentheses
      const cleanNoParen = cleanClue.replace(/\s*\([^)]*\)/g, '').trim();
      if (cleanNoParen.length >= 3) {
        candidateTerms.add(cleanNoParen.toLowerCase());
      }

      // Also extract content inside parentheses if present (e.g. "(classification)" -> "classification")
      const insideParen = cleanClue.match(/\(([^)]+)\)/)?.[1]?.trim();
      if (insideParen && insideParen.length >= 3 && !STOP_WORDS.has(insideParen.toLowerCase())) {
        candidateTerms.add(insideParen.toLowerCase());
      }

      // Also extract meaningful 2-3 word n-grams from longer clues
      const words = cleanNoParen.split(/[\s,]+/);
      if (words.length > 3) {
        for (let i = 0; i < words.length - 1; i++) {
          const bigram = `${words[i]} ${words[i + 1]}`.toLowerCase();
          const trigram = i < words.length - 2 ? `${words[i]} ${words[i + 1]} ${words[i + 2]}`.toLowerCase() : null;
          
          if (!STOP_WORDS.has(words[i].toLowerCase()) && !STOP_WORDS.has(words[i + 1].toLowerCase())) {
            candidateTerms.add(bigram);
          }
          if (trigram) {
            candidateTerms.add(trigram);
          }
        }
      }
    });

    // 2. Add question intent patterns if present in this specific text
    QUESTION_INTENT_PATTERNS.forEach((pattern) => {
      if (lowerText.includes(pattern)) {
        candidateTerms.add(pattern);
      }
    });

    // 3. Add high-yield domain terms if present in this specific text
    HIGH_YIELD_DOMAIN_TERMS.forEach((term) => {
      if (lowerText.includes(term)) {
        candidateTerms.add(term);
      }
    });

    // 4. Add topic if present
    if (topic && topic.length > 3) {
      const topicLower = topic.toLowerCase();
      if (lowerText.includes(topicLower)) {
        candidateTerms.add(topicLower);
      } else {
        // Try topic words
        topic.split(/[\s/]+/).forEach((word) => {
          const w = word.toLowerCase();
          if (w.length > 4 && !STOP_WORDS.has(w) && lowerText.includes(w)) {
            candidateTerms.add(w);
          }
        });
      }
    }

    if (candidateTerms.size === 0) {
      return text;
    }

    // 5. Sort candidate terms by length descending (longest match wins)
    const sortedTerms = Array.from(candidateTerms)
      .filter((term) => term.length >= 3)
      .sort((a, b) => b.length - a.length);

    // 6. Find all non-overlapping match positions in the text
    const matches: MatchSpan[] = [];

    const isOverlapping = (start: number, end: number) => {
      return matches.some((m) => Math.max(m.start, start) < Math.min(m.end, end));
    };

    sortedTerms.forEach((term) => {
      let startIndex = 0;
      while (startIndex < lowerText.length) {
        const foundIndex = lowerText.indexOf(term, startIndex);
        if (foundIndex === -1) break;

        const endIndex = foundIndex + term.length;

        // Check word boundary: ensure we don't match in the middle of a word (unless hyphenated)
        const charBefore = foundIndex > 0 ? lowerText[foundIndex - 1] : ' ';
        const charAfter = endIndex < lowerText.length ? lowerText[endIndex] : ' ';
        
        const isWordStart = /[\s\(\)\[\]"':;,.\-—]/.test(charBefore) || foundIndex === 0;
        const isWordEnd = /[\s\(\)\[\]"':;,.\-—\?!]/.test(charAfter) || endIndex === lowerText.length;

        if (isWordStart && isWordEnd && !isOverlapping(foundIndex, endIndex)) {
          matches.push({
            start: foundIndex,
            end: endIndex,
            matchedText: text.substring(foundIndex, endIndex)
          });
        }

        startIndex = foundIndex + Math.max(1, term.length);
      }
    });

    if (matches.length === 0) {
      return text;
    }

    // 7. Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // 8. Construct highlighted React elements
    const elements: React.ReactNode[] = [];
    let currentIndex = 0;

    matches.forEach((m, idx) => {
      // Add text before match
      if (m.start > currentIndex) {
        elements.push(text.substring(currentIndex, m.start));
      }

      // Add highlighted keyword span with sleek, subtle typography and no bulky boxes
      elements.push(
        <span
          key={`kw-hl-${idx}-${m.start}`}
          className="text-amber-300 font-semibold underline decoration-amber-400/80 decoration-[2px] underline-offset-[3px] hover:text-amber-200 transition-colors cursor-help inline"
          title={`Exam Trigger: "${m.matchedText}"`}
        >
          {m.matchedText}
        </span>
      );

      currentIndex = m.end;
    });

    // Add remaining text after last match
    if (currentIndex < text.length) {
      elements.push(text.substring(currentIndex));
    }

    return elements;
  }, [text, clues, topic, domain, enabled]);

  return <span className={className}>{renderedContent}</span>;
};
