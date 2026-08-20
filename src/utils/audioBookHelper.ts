import { Question } from '../types';

export interface SpokenSegment {
  id: string;
  type: 'header' | 'scenario' | 'question' | 'correctAnswer' | 'explanation' | 'examTip' | 'example';
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
 * Generates the sequential spoken segments for a question,
 * strictly starting directly with Question, then correct answers alone, and explanations alone.
 * Topic and domain preambles are omitted as requested.
 */
export function getQuestionSpokenSegments(q: Question): SpokenSegment[] {
  const segments: SpokenSegment[] = [];

  // 1. Direct Question Start (No Topic / Domain announcement)
  if (q.scenario && q.scenario.trim().length > 0) {
    const isSameAsQuestion = q.scenario.trim().toLowerCase() === q.questionText.trim().toLowerCase();
    
    segments.push({
      id: `q-${q.id}-scenario`,
      type: 'question',
      label: `Question ${q.id}`,
      text: `Question ${q.id}. ${cleanTextForSpeech(q.scenario)}`,
    });

    if (!isSameAsQuestion && q.questionText && q.questionText.trim().length > 0) {
      segments.push({
        id: `q-${q.id}-query`,
        type: 'question',
        label: 'Question Prompt',
        text: cleanTextForSpeech(q.questionText),
      });
    }
  } else {
    segments.push({
      id: `q-${q.id}-question`,
      type: 'question',
      label: `Question ${q.id}`,
      text: `Question ${q.id}. ${cleanTextForSpeech(q.questionText)}`,
    });
  }

  // 2. Correct Answer Alone
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

  segments.push({
    id: `q-${q.id}-answer`,
    type: 'correctAnswer',
    label: 'Correct Answer Alone',
    text: cleanTextForSpeech(answerSpeech),
  });

  // 3. Correct Answer Explanation Alone
  if (q.explanation && q.explanation.trim().length > 0) {
    segments.push({
      id: `q-${q.id}-explanation`,
      type: 'explanation',
      label: 'Explanation Alone',
      text: `Explanation: ${cleanTextForSpeech(q.explanation)}`,
    });
  }

  // 4. Exam Tip for Memory Anchor (if available)
  if (q.examTip && q.examTip.trim().length > 0) {
    segments.push({
      id: `q-${q.id}-examtip`,
      type: 'examTip',
      label: 'Exam Tip',
      text: `Exam Tip: ${cleanTextForSpeech(q.examTip)}`,
    });
  }

  return segments;
}

/**
 * Returns available voices filtered for English
 */
export function getEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const allVoices = window.speechSynthesis.getVoices();
  const englishVoices = allVoices.filter((v) => v.lang.startsWith('en'));
  
  if (englishVoices.length > 0) {
    return englishVoices.sort((a, b) => {
      // Prioritize natural / neural / enhanced voices
      const aScore = (a.name.includes('Natural') || a.name.includes('Google') || a.name.includes('Samantha') || a.name.includes('Enhanced')) ? 2 : 1;
      const bScore = (b.name.includes('Natural') || b.name.includes('Google') || b.name.includes('Samantha') || b.name.includes('Enhanced')) ? 2 : 1;
      return bScore - aScore;
    });
  }
  return allVoices;
}
