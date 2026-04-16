import { getQuestions, normalizeDifficultyKey, normalizeSubjectKey } from '../data/questions';

export const TEST_SETUP_KEY = 'class360_test_setup';
export const TEST_ATTEMPT_KEY = 'class360_test_attempt';
export const NEGATIVE_MARKING = 0.25;

export function getFriendlySubjectLabel(subject) {
  const labels = {
    maths: 'Maths',
    science: 'Science',
    english: 'English',
    reasoning: 'Reasoning',
    gk: 'General Knowledge',
  };

  return labels[subject] || 'Test';
}

export function getPerformanceMessage(percentage) {
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 60) return 'Good progress';
  if (percentage >= 40) return 'Keep practicing';
  return 'Needs improvement';
}

export function calculateAttempt(questions, answers) {
  const total = questions.length;
  const correctQuestions = questions.filter((question) => answers[question.id] === question.correctAnswer);
  const correct = correctQuestions.length;
  const attempted = questions.filter((question) => Boolean(answers[question.id])).length;
  const wrongQuestions = questions.filter(
    (question) => answers[question.id] && answers[question.id] !== question.correctAnswer,
  );
  const wrong = wrongQuestions.length;
  const unanswered = Math.max(0, total - attempted);
  const percentage = total ? Math.round((correct / total) * 100) : 0;
  const netScore = Number((correct - wrong * NEGATIVE_MARKING).toFixed(2));
  const netPercentage = total ? Math.max(0, Math.round((netScore / total) * 100)) : 0;
  const weakTopicCounts = wrongQuestions.reduce((counts, question) => {
    const topic = question.topic || 'General';
    counts[topic] = (counts[topic] || 0) + 1;
    return counts;
  }, {});
  const weakTopics = Object.entries(weakTopicCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic);
  const message = getPerformanceMessage(percentage);

  return {
    total,
    correct,
    wrong,
    attempted,
    unanswered,
    percentage,
    netScore,
    netPercentage,
    weakTopics,
    weakTopicCounts,
    message,
    score: correct,
  };
}

export function getNextAction(percentage, weakTopics = []) {
  if (percentage >= 80) {
    return 'Move to a harder difficulty and continue with mock tests to maintain your momentum.';
  }
  if (percentage >= 60) {
    return weakTopics.length
      ? `Revise ${weakTopics.slice(0, 2).join(' and ')} and take one more timed test today.`
      : 'Continue with one more test and review your explanations carefully.';
  }
  if (percentage >= 40) {
    return weakTopics.length
      ? `Revisit ${weakTopics.slice(0, 2).join(' and ')} before trying the same difficulty again.`
      : 'Study the chapter notes again and take a smaller quiz before retrying.';
  }
  return 'Go back to concept revision, then restart with Easy difficulty for a confidence reset.';
}

export function loadQuestions(subject, difficulty) {
  return getQuestions(subject, difficulty) || [];
}

export function getQuestionExplanation(question) {
  if (!question) return 'Review the concept carefully and compare all options.';
  if (question.explanation) return question.explanation;
  const topic = question.topic ? `${question.topic}` : 'this concept';
  const answer = question.correctAnswer ? `The correct answer is ${question.correctAnswer}.` : 'The correct option is shown.';
  return `${answer} Revisit ${topic} and notice why the other choices do not fit.`;
}

export function getTopicBreakdown(questions = [], answers = {}) {
  const groups = new Map();

  questions.forEach((question) => {
    const topic = question.topic || 'General';
    const entry = groups.get(topic) || { topic, total: 0, correct: 0, wrong: 0 };
    entry.total += 1;
    const answer = answers[question.id];
    if (answer === question.correctAnswer) {
      entry.correct += 1;
    } else if (answer) {
      entry.wrong += 1;
    }
    groups.set(topic, entry);
  });

  return [...groups.values()]
    .map((item) => ({
      ...item,
      accuracy: item.total ? Math.round((item.correct / item.total) * 100) : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function normalizeTestSetup(setup = {}) {
  return {
    subject: normalizeSubjectKey(setup.subject),
    difficulty: normalizeDifficultyKey(setup.difficulty),
  };
}
