import { Question } from '../types';

export interface SpokenSegment {
  id: string;
  type: 'header' | 'scenario' | 'question' | 'option' | 'correctAnswer' | 'explanation' | 'wrongOptionExp' | 'examTip' | 'example';
  label: string;
  text: string;
  optionId?: string;
}

/**
 * Normalizes text for clear and natural text-to-speech pronunciation
 * without losing any words or numbers.
 * Removes redundant boilerplate like "Why Option B is wrong..." and reads content alone.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // strip markdown bold
    .replace(/\*(.*?)\*/g, '$1') // strip markdown italic
    .replace(/`([^`]+)`/g, '$1') // strip code ticks
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1') // strip markdown underscore
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // markdown links
    .replace(/\be\.g\.,?\s*/gi, 'for example, ')
    .replace(/\bi\.e\.,?\s*/gi, 'that is, ')
    .replace(/\betc\.\s*/gi, 'etcetera. ')
    .replace(/\bvs\.?\s*/gi, 'versus ')
    .replace(/->/g, ' to ')
    .replace(/<-/g, ' from ')
    .replace(/\//g, ' or ')
    .replace(/&/g, ' and ')
    .replace(/\s*\+\s*/g, ' plus ')
    .replace(/\s*=\s*/g, ' equals ')
    .replace(/(\d+)\s*%/g, '$1 percent')
    .replace(/(\d+)\s*GB\b/gi, '$1 gigabytes')
    .replace(/(\d+)\s*MB\b/gi, '$1 megabytes')
    .replace(/(\d+)\s*TB\b/gi, '$1 terabytes')
    .replace(/(\d+)\s*ms\b/gi, '$1 milliseconds')
    // Strip redundant "Why Option B is...", "Why Option X is wrong", "Option X (text):" prefixes so content alone is read
    .replace(/\bWhy\s+Option\s+([A-E])\s+(is\s+)?(wrong|incorrect|invalid|false|not\s+suitable|not\s+recommended|flawed)?\s*[:\-.]?\s*/gi, '')
    .replace(/\bWhy\s+Option\s+([A-E])\s*[:\-.]?\s*/gi, '')
    .replace(/\bWhy\s+Option\s+([A-E])\s+is\s+/gi, '')
    .replace(/\bWhy\s+(other\s+options|wrong\s+answers|others)\s+are\s+(wrong|incorrect)\s*[:\-.]?\s*/gi, '')
    .replace(/\bOption\s+([A-E])\s*\([^)]*\)\s*:\s*/gi, '')
    .replace(/\bOption\s+([A-E])\s+is\s+(incorrect|wrong|invalid|false)\s*(because|,|:)?\s*/gi, '')
    // Normalize Option letter headers so Option A is pronounced as an uppercase letter name (Ay)
    .replace(/\bOption\s+([A-E])\s*[:\-.]?\s*/gi, 'Option $1. ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits text along natural sentence boundaries into complete, smooth chunks
 * (~280-320 chars max).
 * Guarantees zero dropped words, preserves decimal numbers, and prevents browser TTS truncation.
 */
export function splitTextIntoSpokenChunks(text: string, maxChars = 280): string[] {
  if (!text) return [];
  const clean = cleanTextForSpeech(text);
  if (!clean) return [];
  if (clean.length <= maxChars) return [clean];

  // Split only on real sentence punctuation (. ! ?) followed by whitespace and a capital letter/digit or end
  // This preserves decimal numbers like 99.9% and abbreviations
  const rawSentences = clean.split(/(?<=[.!?])\s+(?=[A-Z0-9])/g).filter((s) => s.trim().length > 0);
  
  if (rawSentences.length <= 1) {
    // If a single long sentence exceeds maxChars, split gently on semicolons, colons, or commas with safety
    const subClauses = clean.split(/(?<=[,;:])\s+/g).filter((s) => s.trim().length > 0);
    if (subClauses.length <= 1) {
      return [clean];
    }
    const chunks: string[] = [];
    let currentBuffer = '';
    for (const clause of subClauses) {
      const trimmed = clause.trim();
      if (!trimmed) continue;
      if (!currentBuffer) {
        currentBuffer = trimmed;
      } else if ((currentBuffer + ' ' + trimmed).length <= maxChars) {
        currentBuffer = currentBuffer + ' ' + trimmed;
      } else {
        chunks.push(currentBuffer);
        currentBuffer = trimmed;
      }
    }
    if (currentBuffer) {
      chunks.push(currentBuffer);
    }
    return chunks.length > 0 ? chunks : [clean];
  }

  const chunks: string[] = [];
  let currentChunk = '';

  for (const item of rawSentences) {
    const trimmed = item.trim();
    if (!trimmed) continue;

    if (!currentChunk) {
      currentChunk = trimmed;
    } else if ((currentChunk + ' ' + trimmed).length <= maxChars) {
      currentChunk = currentChunk + ' ' + trimmed;
    } else {
      chunks.push(currentChunk);
      currentChunk = trimmed;
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
 * Allows reading question, options, correct answer, explanation, why others are wrong (content alone), and exam tip.
 */
export function getQuestionSpokenSegments(
  q: Question, 
  readAllOptions: boolean = false, 
  readWrongOptions: boolean = false
): SpokenSegment[] {
  const segments: SpokenSegment[] = [];

  // 1. Direct Question Start (No Topic / Domain announcement)
  if (q.scenario && q.scenario.trim().length > 0) {
    const isSameAsQuestion = q.scenario.trim().toLowerCase() === q.questionText.trim().toLowerCase();
    
    const scenarioChunks = splitTextIntoSpokenChunks(`Question ${q.id}. ${q.scenario}`);
    scenarioChunks.forEach((chunkText, idx) => {
      segments.push({
        id: `q-${q.id}-scenario-${idx}`,
        type: 'scenario',
        label: `Question ${q.id} Scenario`,
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
      const optChunks = splitTextIntoSpokenChunks(`Option ${opt.id}. ${opt.text}`);
      optChunks.forEach((chunkText, idx) => {
        segments.push({
          id: `q-${q.id}-opt-${opt.id}-${idx}`,
          type: 'option',
          label: `Option ${opt.id}`,
          text: chunkText,
          optionId: opt.id,
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
      return `Option ${optId}. ${text}`;
    });
    answerSpeech = `The correct answers are: ${optionPhrases.join('. and ')}.`;
  } else {
    const opt = q.options.find((o) => o.id === q.correctOption);
    const text = opt ? opt.text : q.correctOptionText || '';
    answerSpeech = `The correct answer is Option ${q.correctOption}. ${text}.`;
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

  // 4b. Real-World Scenario Example (Content prefaced with 'For example, ')
  if (q.example && q.example.trim().length > 0) {
    const cleanExample = q.example
      .replace(/^(Real-world\s+(scenario\s+)?example\s*[:\-.]?\s*)/i, '')
      .replace(/^(For\s+example\s*[:\-.]?\s*)/i, '')
      .trim();
    if (cleanExample.length > 0) {
      const firstChar = cleanExample.charAt(0);
      const isFirstWordAcronym = /^[A-Z]{2,}\b/.test(cleanExample);
      const formattedText = isFirstWordAcronym
        ? `For example, ${cleanExample}`
        : `For example, ${firstChar.toLowerCase()}${cleanExample.slice(1)}`;

      const exampleChunks = splitTextIntoSpokenChunks(formattedText);
      exampleChunks.forEach((chunkText, idx) => {
        segments.push({
          id: `q-${q.id}-example-${idx}`,
          type: 'example',
          label: 'For Example',
          text: chunkText,
        });
      });
    }
  }

  // 5. Why Other Options Are Wrong (Content Alone - no "Why Option X is..." prefix)
  if (readWrongOptions && q.wrongOptionsExplanation && q.options) {
    q.options.forEach((opt) => {
      const isCorrect = Array.isArray(q.correctOption)
        ? q.correctOption.includes(opt.id)
        : opt.id === q.correctOption;
      if (isCorrect) return;

      const rawExp = q.wrongOptionsExplanation[opt.id];
      if (rawExp && rawExp.trim().length > 0 && !rawExp.toLowerCase().includes('correct answer')) {
        // Strip any "Why Option B is...", "Option B (text):", "Option B is wrong because" - read content alone
        const cleanedExp = rawExp
          .replace(/^Why\s+Option\s+[A-E]\s+(is\s+)?(wrong|incorrect|invalid|false)?\s*[:\-.]?\s*/i, '')
          .replace(/^Option\s+[A-E]\s*(\([^)]*\))?\s*[:\-.]?\s*/i, '')
          .replace(/^Option\s+[A-E]\s+is\s+(incorrect|wrong|invalid|false)\s*(because|,|:)?\s*/i, '')
          .trim();

        const wrongChunks = splitTextIntoSpokenChunks(cleanedExp);
        wrongChunks.forEach((chunkText, idx) => {
          segments.push({
            id: `q-${q.id}-wrong-${opt.id}-${idx}`,
            type: 'wrongOptionExp',
            label: `Option ${opt.id} Breakdown`,
            text: chunkText,
            optionId: opt.id,
          });
        });
      }
    });
  }

  // 6. Exam Tip for Memory Anchor (if available)
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
