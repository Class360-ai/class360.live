import { getAllQuestionsForSubject, normalizeDifficultyKey, normalizeSubjectKey } from '../data/questions';
import { getLatestAttempt } from './testStorage';

function uniqueById(questions = []) {
  const seen = new Set();
  return questions.filter((question) => {
    if (!question?.id || seen.has(question.id)) return false;
    seen.add(question.id);
    return true;
  });
}

export function shuffleQuestions(questions = []) {
  const next = [...questions];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function filterByTopic(questions = [], topic) {
  const topicQuery = String(topic || '').trim().toLowerCase();
  if (!topicQuery) return [];
  return questions.filter((question) => {
    const questionTopic = String(question.topic || '').trim().toLowerCase();
    return questionTopic.includes(topicQuery) || topicQuery.includes(questionTopic);
  });
}

function normalizePreviousQuestionIds(previousAttempt) {
  if (!previousAttempt) return [];
  if (Array.isArray(previousAttempt.questionIds)) return previousAttempt.questionIds.filter(Boolean);
  if (Array.isArray(previousAttempt.questions)) {
    return previousAttempt.questions.map((question) => question?.id).filter(Boolean);
  }
  return [];
}

export function getQuestionsForTest(config = {}) {
  const subject = normalizeSubjectKey(config.subject);
  const difficulty = normalizeDifficultyKey(config.difficulty);
  const topic = String(config.topic || '').trim();
  const requestedCount = Number(config.questionCount || 0);
  const subjectPool = getAllQuestionsForSubject(subject);
  const subjectDifficultyPool = subjectPool.filter((question) => normalizeDifficultyKey(question.difficulty) === difficulty);
  const topicDifficultyPool = topic ? filterByTopic(subjectDifficultyPool, topic) : [];
  const topicOnlyPool = topic ? filterByTopic(subjectPool, topic) : [];

  let selected = [];
  let fallbackPath = 'topic + subject + difficulty';
  let usedFallback = false;

  if (topicDifficultyPool.length) {
    selected = topicDifficultyPool;
  } else if (subjectDifficultyPool.length) {
    selected = subjectDifficultyPool;
    fallbackPath = 'subject + difficulty';
    usedFallback = Boolean(topic);
  } else if (topicOnlyPool.length) {
    selected = topicOnlyPool;
    fallbackPath = 'subject only';
    usedFallback = true;
  } else {
    selected = subjectPool;
    fallbackPath = 'subject only';
    usedFallback = true;
  }

  const previousAttempt = getLatestAttempt();
  const previousIds = new Set(normalizePreviousQuestionIds(previousAttempt));
  const freshQuestions = selected.filter((question) => !previousIds.has(question.id));
  const pool = freshQuestions.length >= (requestedCount || freshQuestions.length) ? freshQuestions : selected;
  const shuffled = shuffleQuestions(uniqueById(pool));
  const questions = requestedCount > 0 ? shuffled.slice(0, requestedCount) : shuffled;

  return {
    questions,
    subject,
    difficulty,
    topic: topic || null,
    fallbackPath,
    usedFallback,
    totalAvailable: selected.length,
    previousCount: previousIds.size,
  };
}

export function getWeakTopicSummary(attempt = {}) {
  const counts = new Map();
  const questions = Array.isArray(attempt.questions) ? attempt.questions : [];
  const answers = attempt.answers || {};

  questions.forEach((question) => {
    if (!question?.id) return;
    const answer = answers[question.id];
    if (!answer || answer === question.correctAnswer) return;
    const topic = String(question.topic || 'General').trim() || 'General';
    counts.set(topic, (counts.get(topic) || 0) + 1);
  });

  const summary = [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);

  return {
    summary,
    topics: summary.map((item) => item.topic),
    counts: Object.fromEntries(summary.map((item) => [item.topic, item.count])),
  };
}
