import {
  dailyTradingSeriesLessons,
  dailyTradingSeriesSlug,
  normalizeDailyTradingSeriesLesson,
  getDailyTradingSeriesSnapshot,
} from '../data/dailyTradingSeries';

const DAILY_SERIES_PROGRESS_KEY = 'class360_daily_series_progress';
const DAILY_SERIES_ADMIN_KEY = 'class360_daily_series_admin_content';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('class360-daily-series-changed'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildDefaultAdminContent() {
  return {
    slug: dailyTradingSeriesSlug,
    lessons: dailyTradingSeriesLessons.map((lesson) => normalizeDailyTradingSeriesLesson({
      ...lesson,
      releaseDate: lesson.releaseDate,
    })),
  };
}

function mergeLessons(baseLessons, overrideLessons = []) {
  const overrideMap = new Map(
    overrideLessons.map((lesson) => [lesson.daySlug || `day-${lesson.dayNumber}`, lesson]),
  );
  return baseLessons.map((lesson) => {
    const override = overrideMap.get(lesson.daySlug) || overrideMap.get(lesson.slug);
    return normalizeDailyTradingSeriesLesson(override ? { ...lesson, ...override } : { ...lesson });
  });
}

export function getStoredDailySeriesProgress() {
  return readJson(DAILY_SERIES_PROGRESS_KEY, {});
}

export function saveStoredDailySeriesProgress(daySlug, patch) {
  const current = getStoredDailySeriesProgress();
  const next = {
    ...current,
    [daySlug]: {
      ...(current[daySlug] || {}),
      ...patch,
      updatedAt: new Date().toISOString(),
    },
  };
  writeJson(DAILY_SERIES_PROGRESS_KEY, next);
  return next[daySlug];
}

export function getStoredDailySeriesAdminContent() {
  const existing = readJson(DAILY_SERIES_ADMIN_KEY, null);
  if (existing) return existing;
  const seed = buildDefaultAdminContent();
  writeJson(DAILY_SERIES_ADMIN_KEY, seed);
  return seed;
}

export function saveStoredDailySeriesAdminContent(content) {
  const next = clone(content);
  writeJson(DAILY_SERIES_ADMIN_KEY, next);
  return next;
}

export function saveStoredDailySeriesLesson(lesson) {
  const current = getStoredDailySeriesAdminContent();
  const next = clone(current);
  const existingIndex = next.lessons.findIndex((item) => item.daySlug === lesson.daySlug || item.dayNumber === lesson.dayNumber);
  const normalized = normalizeDailyTradingSeriesLesson({
    ...lesson,
    dayNumber: Number(lesson.dayNumber),
    daySlug: lesson.daySlug || `day-${lesson.dayNumber}`,
    slug: lesson.slug || lesson.daySlug || `day-${lesson.dayNumber}`,
    releaseDate: lesson.releaseDate || new Date().toISOString().slice(0, 10),
  });

  if (existingIndex >= 0) {
    next.lessons[existingIndex] = normalized;
  } else {
    next.lessons.push(normalized);
  }

  next.lessons.sort((a, b) => Number(a.dayNumber || 0) - Number(b.dayNumber || 0));
  return saveStoredDailySeriesAdminContent(next);
}

export function deleteStoredDailySeriesLesson(daySlug) {
  const current = getStoredDailySeriesAdminContent();
  const next = clone(current);
  next.lessons = next.lessons.filter((lesson) => lesson.daySlug !== daySlug && lesson.slug !== daySlug);
  return saveStoredDailySeriesAdminContent(next);
}

export function markDailySeriesLessonCompleted(daySlug, payload = {}) {
  return saveStoredDailySeriesProgress(daySlug, {
    completed: true,
    completedAt: payload.completedAt || new Date().toISOString(),
    notesRead: true,
    quizScore: Number(payload.quizScore || 0),
    homeworkDone: Boolean(payload.homeworkDone),
    lastOpenedAt: payload.lastOpenedAt || new Date().toISOString(),
  });
}

export function touchDailySeriesLesson(daySlug) {
  return saveStoredDailySeriesProgress(daySlug, {
    lastOpenedAt: new Date().toISOString(),
  });
}

export function getDailySeriesLocalSnapshot() {
  const adminContent = getStoredDailySeriesAdminContent();
  const mergedLessons = mergeLessons(dailyTradingSeriesLessons, adminContent.lessons);
  return getDailyTradingSeriesSnapshot(getStoredDailySeriesProgress(), mergedLessons);
}
