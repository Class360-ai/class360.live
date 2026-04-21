import {
  createEmptyLearningProgress,
  getLearningChapterBySlug,
  getLearningChaptersForSubject,
  getLearningChaptersForClassLevel,
  getLearningDashboardSnapshot,
  getLearningNotesByChapterSlug,
  getLearningProgressMap,
  getLearningQuestionsByChapterSlugAndType,
  getLearningRecommendedChapter,
  getLearningSubjectProgress,
  getLearningSubjectsForClassLevel,
  learningProgressSeed,
  learningSubject,
} from '../data/learningData';
import { dailyTradingSeriesSlug } from '../data/dailyTradingSeries';
import { getClassLevelLabel, getStoredUser } from '../utils/authStorage';
import {
  getStoredLearningDoubts,
  getStoredLearningProgress,
  getStoredLearningTests,
  saveStoredLearningDoubt,
  saveStoredLearningProgress,
  saveStoredLearningTest,
} from '../utils/learningStorage';
import {
  getDailySeriesLocalSnapshot,
  markDailySeriesLessonCompleted,
  saveStoredDailySeriesProgress,
} from '../utils/dailySeriesStorage';

const API_BASE_URL = (import.meta.env.VITE_LEARNING_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

function getActiveClassLevel() {
  return getClassLevelLabel(getStoredUser()?.classLevel || 6);
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    return { error };
  } finally {
    window.clearTimeout(timeout);
  }
}

function fallbackFromProgress() {
  const progressMap = getStoredLearningProgress();
  const progressList = Object.keys(progressMap).length
    ? Object.entries(progressMap).map(([chapterSlug, row]) => ({ chapterSlug, ...row }))
    : learningProgressSeed;
  const map = getLearningProgressMap(progressList);
  const classLevel = getActiveClassLevel();
  return {
    subject: learningSubject,
    subjects: getLearningSubjectsForClassLevel(classLevel),
    chapters: getLearningChaptersForClassLevel(classLevel),
    progress: map,
    dashboard: getLearningDashboardSnapshot(map, classLevel),
    subjectProgress: getLearningSubjectProgress(learningSubject.slug, map),
    recommendedChapter: getLearningRecommendedChapter(map, classLevel),
    tests: getStoredLearningTests(),
    doubts: getStoredLearningDoubts(),
  };
}

export async function loadLearningHome() {
  const classLevel = getActiveClassLevel();
  const remote = await request(`/subjects?classLevel=${encodeURIComponent(classLevel)}`);
  if (remote && !remote.error) {
    const fallback = fallbackFromProgress();
    return {
      ...fallback,
      ...remote,
      subjects: remote.subjects || fallback.subjects,
      subject: remote.subject || fallback.subject,
      chapters: remote.chapters || fallback.chapters,
      progress: remote.progress || fallback.progress,
      dashboard: remote.dashboard || fallback.dashboard,
      subjectProgress: remote.subjectProgress || fallback.subjectProgress,
      recommendedChapter: remote.recommendedChapter || fallback.recommendedChapter,
      tests: remote.tests || fallback.tests,
      doubts: remote.doubts || fallback.doubts,
    };
  }
  return fallbackFromProgress();
}

export async function loadLearningSubject(subjectSlug) {
  const classLevel = getActiveClassLevel();
  const remote = await request(`/subjects/${subjectSlug}/chapters?classLevel=${encodeURIComponent(classLevel)}`);
  const fallbackProgress = getLearningProgressMap(learningProgressSeed);
  const fallback = {
    subject: learningSubject,
    chapters: getLearningChaptersForClassLevel(classLevel),
    progress: fallbackProgress,
    subjectProgress: getLearningSubjectProgress(subjectSlug, fallbackProgress),
  };
  return remote && !remote.error
    ? {
        ...fallback,
        ...remote,
        chapters: remote.chapters || fallback.chapters,
        progress: remote.progress || fallback.progress,
        subjectProgress: remote.subjectProgress || fallback.subjectProgress,
      }
    : fallback;
}

export async function loadLearningChapter(chapterSlug) {
  const classLevel = getActiveClassLevel();
  const remote = await request(`/chapters/${chapterSlug}?classLevel=${encodeURIComponent(classLevel)}`);
  return remote && !remote.error
    ? remote
    : {
        chapter: getLearningChapterBySlug(chapterSlug),
        notes: getLearningNotesByChapterSlug(chapterSlug),
        practiceQuestions: getLearningQuestionsByChapterSlugAndType(chapterSlug, 'practice'),
        dppQuestions: getLearningQuestionsByChapterSlugAndType(chapterSlug, 'dpp'),
        testQuestions: getLearningQuestionsByChapterSlugAndType(chapterSlug, 'test'),
      };
}

export async function loadLearningQuestions(chapterSlug, type) {
  const classLevel = getActiveClassLevel();
  const remote = await request(
    `/chapters/${chapterSlug}/questions?type=${encodeURIComponent(type)}&classLevel=${encodeURIComponent(classLevel)}`,
  );
  return remote && !remote.error
    ? remote
    : getLearningQuestionsByChapterSlugAndType(chapterSlug, type);
}

export async function loadLearningNotes(chapterSlug) {
  const classLevel = getActiveClassLevel();
  const remote = await request(`/chapters/${chapterSlug}/notes?classLevel=${encodeURIComponent(classLevel)}`);
  return remote && !remote.error ? remote : getLearningNotesByChapterSlug(chapterSlug);
}

export async function saveLearningProgress(payload) {
  const remote = await request('/progress/update', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (remote && !remote.error) return remote;
  return saveStoredLearningProgress(payload.chapterSlug, payload);
}

export async function loadLearningProgress(userId = 'student-001') {
  const classLevel = getActiveClassLevel();
  const remote = await request(`/progress/${userId}?classLevel=${encodeURIComponent(classLevel)}`);
  const fallback = fallbackFromProgress();
  return remote && !remote.error
    ? {
        ...fallback,
        ...remote,
        progress: remote.progress || fallback.progress,
        dashboard: remote.dashboard || fallback.dashboard,
        subjectProgress: remote.subjectProgress || fallback.subjectProgress,
      }
    : {
        progress: getStoredLearningProgress(),
        dashboard: getLearningDashboardSnapshot(getLearningProgressMap(learningProgressSeed), classLevel),
      };
}

export async function saveLearningTest(test) {
  const remote = await request('/tests', {
    method: 'POST',
    body: JSON.stringify(test),
  });
  if (remote && !remote.error) return remote;
  return saveStoredLearningTest(test);
}

export async function sendLearningDoubt(payload) {
  const remote = await request('/ai/doubt', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (remote && !remote.error) return remote;
  return saveStoredLearningDoubt(payload);
}

export async function saveLearningDoubt(payload) {
  return sendLearningDoubt(payload);
}

export function getLearningLocalData() {
  return fallbackFromProgress();
}

function fallbackDailySeries() {
  return getDailySeriesLocalSnapshot();
}

function mergeDailySeriesSnapshots(base, remote) {
  if (!remote || remote.error) return base;

  const remoteLessons = Array.isArray(remote.lessons) ? remote.lessons : Array.isArray(remote.days) ? remote.days : [];
  const lessonMap = new Map(remoteLessons.map((lesson) => [lesson.daySlug || lesson.slug, lesson]));

  return {
    ...base,
    ...remote,
    lessons: base.lessons.map((lesson) => ({
      ...lesson,
      ...(lessonMap.get(lesson.daySlug) || {}),
    })),
    overview: remote.overview || base.overview,
    realityCheck: remote.realityCheck || base.realityCheck,
    mistakesToAvoid: remote.mistakesToAvoid || base.mistakesToAvoid,
    studentProgressDashboard: remote.studentProgressDashboard || base.studentProgressDashboard,
  };
}

export async function loadDailyTradingSeries() {
  const fallback = fallbackDailySeries();
  const remote = await request(`/daily-series/${encodeURIComponent(dailyTradingSeriesSlug)}`);
  return remote && !remote.error ? mergeDailySeriesSnapshots(fallback, remote) : fallback;
}

export async function loadDailyTradingSeriesDay(dayNumber) {
  const fallback = fallbackDailySeries();
  const remote = await request(`/daily-series/${encodeURIComponent(dailyTradingSeriesSlug)}/days/${encodeURIComponent(dayNumber)}`);
  if (remote && !remote.error) {
    const lesson = remote.lesson || remote;
    const localLesson = fallback.lessons?.find((item) => item.dayNumber === Number(dayNumber));
    return localLesson ? { ...localLesson, ...lesson } : lesson;
  }
  return fallback.lessons?.find((lesson) => lesson.dayNumber === Number(dayNumber)) || null;
}

export async function loadDailyTradingSeriesProgress(userId = 'student-001') {
  const fallback = fallbackDailySeries();
  const remote = await request(`/daily-series/progress/${userId}`);
  return remote && !remote.error ? mergeDailySeriesSnapshots(fallback, remote) : fallback;
}

export async function saveDailyTradingSeriesProgress(daySlug, payload) {
  const local = markDailySeriesLessonCompleted(daySlug, payload);
  const remote = await request('/daily-series/progress/update', {
    method: 'POST',
    body: JSON.stringify({ daySlug, ...payload }),
  });
  if (remote && !remote.error) {
    return mergeDailySeriesSnapshots(fallbackDailySeries(), remote);
  }
  return local;
}

export async function touchDailyTradingSeriesLesson(daySlug) {
  const local = saveStoredDailySeriesProgress(daySlug, { lastOpenedAt: new Date().toISOString() });
  const remote = await request('/daily-series/progress/update', {
    method: 'POST',
    body: JSON.stringify({ daySlug, lastOpenedAt: new Date().toISOString() }),
  });
  if (remote && !remote.error) {
    return mergeDailySeriesSnapshots(fallbackDailySeries(), remote);
  }
  return local;
}
