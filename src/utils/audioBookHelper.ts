import { Question } from '../types';

export interface SpokenSegment {
  id: string;
  type: 'header' | 'scenario' | 'question' | 'option' | 'correctAnswer' | 'explanation' | 'examTip' | 'example';
  label: string;
  text: string;
}

/**
 * Normalizes text for clear and natural text-to-speech pronunciation
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // strip markdown bold
    .replace(/\*(.*?)\*/g, '$1') // strip markdown italic
    .replace(/`([^`]+)`/g, '$1') // strip code ticks
    .replace(/->/g, ' to ')
    .replace(/<-/g, ' from ')
    .replace(/\//g, ' or ')
    .replace(/&/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits long text into short, natural sentence/clause chunks (max ~160 chars)
 * to prevent Mobile Safari (iOS) and Android Chrome speech engines from stalling.
 * Uses a safe non-destructive tokenization so NO words, clauses, or numbers are dropped.
 */
export function splitTextIntoSpokenChunks(text: string, maxChars = 160): string[] {
  if (!text) return [];
  const clean = cleanTextForSpeech(text);
  if (!clean || clean.length <= maxChars) return clean ? [clean] : [];

  // Match full sentences ending in . ! ? or major boundaries while keeping everything
  // Non-destructive regex to keep all punctuation and words
  const sentences = clean.match(/[^.!?\n]+[.!?\n]*/g) || [clean];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const item of sentences) {
    const trimmed = item.trim();
    if (!trimmed) continue;

    if (!currentChunk) {
      if (trimmed.length <= maxChars) {
        currentChunk = trimmed;
      } else {
        // Break long sentence by comma / semicolons / spaces
        const subParts = trimmed.match(/[^,;:]+[,;:]*/g) || [trimmed];
        let tempSub = '';
        for (const part of subParts) {
          const pTrimmed = part.trim();
          if (!pTrimmed) continue;
          if (!tempSub) {
            tempSub = pTrimmed;
          } else if ((tempSub + ' ' + pTrimmed).length <= maxChars) {
            tempSub = tempSub + ' ' + pTrimmed;
          } else {
            chunks.push(tempSub);
            tempSub = pTrimmed;
          }
        }
        if (tempSub) {
          currentChunk = tempSub;
        }
      }
    } else if ((currentChunk + ' ' + trimmed).length <= maxChars) {
      currentChunk = currentChunk + ' ' + trimmed;
    } else {
      chunks.push(currentChunk);
      if (trimmed.length <= maxChars) {
        currentChunk = trimmed;
      } else {
        const subParts = trimmed.match(/[^,;:]+[,;:]*/g) || [trimmed];
        let tempSub = '';
        for (const part of subParts) {
          const pTrimmed = part.trim();
          if (!pTrimmed) continue;
          if (!tempSub) {
            tempSub = pTrimmed;
          } else if ((tempSub + ' ' + pTrimmed).length <= maxChars) {
            tempSub = tempSub + ' ' + pTrimmed;
          } else {
            chunks.push(tempSub);
            tempSub = pTrimmed;
          }
        }
        currentChunk = tempSub;
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks.length > 0 ? chunks : [clean];
}

/**
 * Generates the sequential spoken segments for a question.
 * Uses sentence chunking so mobile devices read smoothly without stalling.
 */
export function getQuestionSpokenSegments(q: Question, readAllOptions: boolean = false): SpokenSegment[] {
  const segments: SpokenSegment[] = [];

  // 1. Direct Question Start (No Topic / Domain announcement)
  if (q.scenario && q.scenario.trim().length > 0) {
    const isSameAsQuestion = q.scenario.trim().toLowerCase() === q.questionText.trim().toLowerCase();
    
    const scenarioChunks = splitTextIntoSpokenChunks(`Question ${q.id}. ${q.scenario}`);
    scenarioChunks.forEach((chunkText, idx) => {
      segments.push({
        id: `q-${q.id}-scenario-${idx}`,
        type: 'question',
        label: `Question ${q.id}`,
        text: chunkText,
      });
    });

    if (!isSameAsQuestion && q.questionText && q.questionText.trim().length > 0) {
      const qChunks = splitTextIntoSpokenChunks(q.questionText);
      qChunks.forEach((chunkText, idx) => {
        segments.push({
          id: `q-${q.id}-query-${idx}`,
          type: 'question',
          label: 'Question Prompt',
          text: chunkText,
        });
      });
    }
  } else {
    const qChunks = splitTextIntoSpokenChunks(`Question ${q.id}. ${q.questionText}`);
    qChunks.forEach((chunkText, idx) => {
      segments.push({
        id: `q-${q.id}-question-${idx}`,
        type: 'question',
        label: `Question ${q.id}`,
        text: chunkText,
      });
    });
  }

  // 2. Read All Answer Options (if toggle is enabled)
  if (readAllOptions && q.options && q.options.length > 0) {
    q.options.forEach((opt) => {
      const optChunks = splitTextIntoSpokenChunks(`Option ${opt.id}: ${opt.text}`);
      optChunks.forEach((chunkText, idx) => {
        segments.push({
          id: `q-${q.id}-opt-${opt.id}-${idx}`,
          type: 'option',
          label: `Option ${opt.id}`,
          text: chunkText,
        });
      });
    });
  }

  // 3. Correct Answer
  let answerSpeech = '';
  if (Array.isArray(q.correctOption)) {
    const optionPhrases = q.correctOption.map((optId) => {
      const opt = q.options.find((o) => o.id === optId);
      const text = opt ? opt.text : '';
      return `Option ${optId}: ${text}`;
    });
    answerSpeech = `The correct answers are: ${optionPhrases.join('. and ')}.`;
  } else {
    const opt = q.options.find((o) => o.id === q.correctOption);
    const text = opt ? opt.text : q.correctOptionText || '';
    answerSpeech = `The correct answer is Option ${q.correctOption}: ${text}.`;
  }

  const answerChunks = splitTextIntoSpokenChunks(answerSpeech);
  answerChunks.forEach((chunkText, idx) => {
    segments.push({
      id: `q-${q.id}-answer-${idx}`,
      type: 'correctAnswer',
      label: readAllOptions ? 'Correct Answer' : 'Correct Answer Alone',
      text: chunkText,
    });
  });

  // 4. Correct Answer Explanation
  if (q.explanation && q.explanation.trim().length > 0) {
    const expChunks = splitTextIntoSpokenChunks(`Explanation: ${q.explanation}`);
    expChunks.forEach((chunkText, idx) => {
      segments.push({
        id: `q-${q.id}-exp-${idx}`,
        type: 'explanation',
        label: 'Explanation',
        text: chunkText,
      });
    });
  }

  // 5. Exam Tip for Memory Anchor (if available)
  if (q.examTip && q.examTip.trim().length > 0) {
    const tipChunks = splitTextIntoSpokenChunks(`Exam Tip: ${q.examTip}`);
    tipChunks.forEach((chunkText, idx) => {
      segments.push({
        id: `q-${q.id}-tip-${idx}`,
        type: 'examTip',
        label: 'Exam Tip',
        text: chunkText,
      });
    });
  }

  return segments;
}

/**
 * Calculates a voice quality score prioritizing natural/enhanced voices for iOS, Android & Desktop
 */
function getVoiceQualityScore(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let score = 0;

  // High quality natural / neural / online voices
  if (name.includes('google') && (name.includes('uk') || name.includes('us') || name.includes('english'))) score += 50;
  if (name.includes('natural') || name.includes('enhanced') || name.includes('premium') || name.includes('neural')) score += 40;
  if (name.includes('siri') || name.includes('samantha') || name.includes('karen') || name.includes('serena') || name.includes('oliver') || name.includes('daniel')) score += 20;

  // Prefer UK English (en-GB) or US English (en-US)
  if (v.lang === 'en-GB' || v.lang === 'en_GB') score += 15;
  else if (v.lang === 'en-US' || v.lang === 'en_US') score += 10;
  else if (v.lang.startsWith('en')) score += 5;

  // Penalize robotic compact / offline voices
  if (name.includes('compact') || name.includes('local') || name.includes('offline') || name.includes('mobile')) score -= 25;

  return score;
}

/**
 * Returns available voices filtered for English and sorted by acoustic quality
 */
export function getEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const allVoices = window.speechSynthesis.getVoices();
  const englishVoices = allVoices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
  
  if (englishVoices.length > 0) {
    return englishVoices.sort((a, b) => getVoiceQualityScore(b) - getVoiceQualityScore(a));
  }
  return allVoices;
}
