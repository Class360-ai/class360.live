import { awardTestCompletionXP, calculateTestXpEarned } from './gamification';
import { getStreak } from './planGenerator';
import { recordDailyTestUsage } from './premium';

const TEST_ATTEMPTS_KEY = 'class360_test_attempts';

function emitStorageChange() {
  window.dispatchEvent(new Event('class360-storage-changed'));
}

export function getTestAttempts() {
  try {
    const raw = localStorage.getItem(TEST_ATTEMPTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTestAttempt(attempt) {
  if (!attempt || typeof attempt !== 'object') return [];

  const attempts = getTestAttempts();
  const safeAttempt = {
    subject: attempt.subject ?? '',
    difficulty: attempt.difficulty ?? '',
    taskId: attempt.taskId ?? null,
    taskType: attempt.taskType ?? null,
    topic: attempt.topic ?? null,
    questionCount: Number(attempt.questionCount ?? (Array.isArray(attempt.questions) ? attempt.questions.length : 0)),
    score: Number(attempt.score ?? attempt.correct ?? 0),
    correct: Number(attempt.correct ?? 0),
    wrong: Number(attempt.wrong ?? 0),
    attempted: Number(attempt.attempted ?? 0),
    unanswered: Number(attempt.unanswered ?? 0),
    percentage: Number(attempt.percentage ?? 0),
    netScore: Number(attempt.netScore ?? 0),
    netPercentage: Number(attempt.netPercentage ?? 0),
    weakTopics: Array.isArray(attempt.weakTopics) ? attempt.weakTopics : [],
    weakTopicCounts: attempt.weakTopicCounts && typeof attempt.weakTopicCounts === 'object' ? attempt.weakTopicCounts : {},
    completedAt: attempt.completedAt ?? attempt.submittedAt ?? new Date().toISOString(),
    xpEarned: Number(attempt.xpEarned ?? calculateTestXpEarned({
      percentage: attempt.percentage,
      streak: getStreak(),
    })),
    questions: Array.isArray(attempt.questions) ? attempt.questions : [],
    answers: attempt.answers && typeof attempt.answers === 'object' ? attempt.answers : {},
  };

  const nextAttempts = [safeAttempt, ...attempts].slice(0, 50);
  localStorage.setItem(TEST_ATTEMPTS_KEY, JSON.stringify(nextAttempts));
  recordDailyTestUsage();
  const streak = getStreak();
  awardTestCompletionXP({
    percentage: safeAttempt.percentage,
    totalTests: nextAttempts.length,
    streak,
  });
  emitStorageChange();
  return nextAttempts;
}

export function clearTestAttempts() {
  localStorage.removeItem(TEST_ATTEMPTS_KEY);
  emitStorageChange();
}

export function getLatestAttempt() {
  const attempts = getTestAttempts();
  return attempts[0] ?? null;
}
