import { getSequentialCourseDay, sequentialCourseDays, TOTAL_SEQUENTIAL_DAYS } from '../../src/data/sequentialCourse.js';
import {
  isDayCompleted as isDayCompletedRule,
  NOTES_COMPLETION_SECONDS,
  PODCAST_COMPLETION_PERCENT,
  QUIZ_PASS_PERCENT,
  VIDEO_COMPLETION_PERCENT,
} from '../../src/utils/sequentialCourseRules.js';

export { NOTES_COMPLETION_SECONDS, PODCAST_COMPLETION_PERCENT, QUIZ_PASS_PERCENT, VIDEO_COMPLETION_PERCENT };

export function checkDayCompletion(dayData = {}) {
  return isDayCompletedRule(dayData);
}

export function normalizeProgressRow(row = {}) {
  const videoProgress = Math.max(0, Math.min(100, Number(row.videoProgress || 0)));
  const notesTime = Math.max(0, Number(row.notesTime || 0));
  const podcastProgress = Math.max(0, Math.min(100, Number(row.podcastProgress || 0)));
  const quizScore = Math.max(0, Math.min(100, Number(row.quizScore || 0)));
  const notesOpened = Boolean(row.notesOpened) || notesTime >= NOTES_COMPLETION_SECONDS;
  const notesCompleted = Boolean(row.notesCompleted) || notesOpened;
  const podcastCompleted = Boolean(row.podcastCompleted) || podcastProgress >= PODCAST_COMPLETION_PERCENT;
  const videoCompleted = Boolean(row.videoCompleted) || videoProgress >= VIDEO_COMPLETION_PERCENT;
  const quizPassed = Boolean(row.quizPassed) || quizScore >= QUIZ_PASS_PERCENT;
  const quizAttempted = Boolean(row.quizAttempted) || quizScore > 0;

  const normalized = {
    dayNumber: Number(row.dayNumber),
    videoCompleted,
    videoProgress,
    notesOpened,
    notesCompleted,
    notesTime,
    podcastCompleted,
    podcastProgress,
    quizPassed,
    quizAttempted,
    quizScore,
    quizTimeTaken: Math.max(0, Number(row.quizTimeTaken || 0)),
    weakAreas: Array.isArray(row.weakAreas) ? row.weakAreas : [],
  };

  return {
    ...normalized,
    isCompleted: checkDayCompletion(normalized),
    completionDate: checkDayCompletion(normalized) ? row.completionDate || new Date().toISOString() : null,
  };
}

export function mapProgressRows(rows = []) {
  return rows.reduce((accumulator, row) => {
    const normalized = normalizeProgressRow(row);
    if (normalized.dayNumber >= 1 && normalized.dayNumber <= TOTAL_SEQUENTIAL_DAYS) {
      accumulator[normalized.dayNumber] = normalized;
    }
    return accumulator;
  }, {});
}

export function getUnlockedDay(progressMap = {}) {
  let unlocked = 1;

  for (let dayNumber = 1; dayNumber <= TOTAL_SEQUENTIAL_DAYS; dayNumber += 1) {
    if (checkDayCompletion(progressMap[dayNumber])) {
      unlocked = dayNumber + 1;
    } else {
      break;
    }
  }

  return Math.min(unlocked, TOTAL_SEQUENTIAL_DAYS);
}

export function calculateDailyStreak(progressMap = {}) {
  const completedDates = Object.values(progressMap)
    .filter((row) => row.isCompleted && row.completionDate)
    .map((row) => new Date(row.completionDate))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => right.getTime() - left.getTime());

  if (!completedDates.length) return 0;

  const normalizedDays = [...new Set(completedDates.map((date) => date.toISOString().slice(0, 10)))];
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  const todayKey = cursor.toISOString().slice(0, 10);
  const yesterday = new Date(cursor);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (normalizedDays[0] !== todayKey && normalizedDays[0] !== yesterdayKey) {
    return 0;
  }

  while (true) {
    const currentKey = cursor.toISOString().slice(0, 10);
    if (normalizedDays.includes(currentKey)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (streak === 0 && normalizedDays[0] === yesterdayKey) {
      streak = 1;
    }
    break;
  }

  return streak;
}

export function buildCourseDaysWithStatus(progressMap = {}) {
  const unlockedDay = getUnlockedDay(progressMap);

  return sequentialCourseDays.map((day) => {
    const progress = progressMap[day.dayNumber] || normalizeProgressRow({ dayNumber: day.dayNumber });
    const isUnlocked = day.dayNumber <= unlockedDay;
    return {
      ...day,
      progress,
      isCompleted: progress.isCompleted,
      isUnlocked,
      isLocked: !isUnlocked,
      status: progress.isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked',
    };
  });
}

export function buildSequentialCourseSnapshot(progressMap = {}) {
  const completedDays = Object.values(progressMap).filter((row) => row.isCompleted).length;
  const highestUnlockedDay = getUnlockedDay(progressMap);
  const days = buildCourseDaysWithStatus(progressMap);
  const attemptedQuizzes = Object.values(progressMap).filter((row) => row.quizAttempted);

  return {
    totalDays: TOTAL_SEQUENTIAL_DAYS,
    completedDays,
    progressPercent: Math.round((completedDays / TOTAL_SEQUENTIAL_DAYS) * 100),
    highestUnlockedDay,
    streakDays: calculateDailyStreak(progressMap),
    nextDay: days.find((day) => !day.isCompleted && day.isUnlocked) || null,
    performanceStats: {
      averageQuizScore: attemptedQuizzes.length
        ? Math.round(attemptedQuizzes.reduce((sum, row) => sum + Number(row.quizScore || 0), 0) / attemptedQuizzes.length)
        : 0,
      strongDays: Object.values(progressMap).filter((row) => Number(row.quizScore || 0) >= 80).length,
      needsReview: Object.values(progressMap).filter((row) => row.quizAttempted && Number(row.quizScore || 0) < QUIZ_PASS_PERCENT).length,
    },
    days,
  };
}

export function getSequentialCourseDayPayload(dayNumber, progressMap = {}) {
  const baseDay = getSequentialCourseDay(dayNumber);
  if (!baseDay) return null;

  const snapshot = buildSequentialCourseSnapshot(progressMap);
  return snapshot.days.find((day) => day.dayNumber === Number(dayNumber)) || baseDay;
}
