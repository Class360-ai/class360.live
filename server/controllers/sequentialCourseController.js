import User from '../models/User.js';
import SequentialCourseProgress from '../models/SequentialCourseProgress.js';
import { isDatabaseReady } from '../config/database.js';
import { getSequentialCourseDay } from '../../src/data/sequentialCourse.js';
import {
  buildSequentialCourseSnapshot,
  checkDayCompletion,
  getSequentialCourseDayPayload,
  getUnlockedDay,
  mapProgressRows,
  normalizeProgressRow,
} from '../utils/sequentialCourseUtils.js';

const inMemoryProgressStore = new Map();
const inMemoryUserStore = new Map();

function buildUserIdentity(payload = {}, query = {}) {
  const email = String(payload.email || query.email || 'student@class360.live').trim().toLowerCase();
  const name = String(payload.name || query.name || 'Demo Student').trim() || 'Demo Student';
  const userId = String(payload.userId || query.userId || email || 'student-001').trim();
  return { userId, email, name };
}

function getLevelFromXp(xp) {
  return Math.max(1, Math.floor(Number(xp || 0) / 300) + 1);
}

function getBadge({ completedDays, streak }) {
  if (completedDays >= 120) return 'Pro Trader';
  if (streak >= 7 || completedDays >= 30) return 'Consistent Learner';
  return 'Beginner';
}

function calculateStreak(previousDate, completionDate, currentStreak) {
  if (!completionDate) return currentStreak || 0;
  if (!previousDate) return 1;

  const previous = new Date(previousDate);
  previous.setHours(0, 0, 0, 0);
  const current = new Date(completionDate);
  current.setHours(0, 0, 0, 0);
  const diffDays = Math.round((current.getTime() - previous.getTime()) / 86400000);

  if (diffDays <= 0) return currentStreak || 1;
  if (diffDays === 1) return (currentStreak || 0) + 1;
  return 1;
}

async function upsertUser(identity) {
  if (isDatabaseReady()) {
    return User.findOneAndUpdate(
      { email: identity.email },
      { name: identity.name, email: identity.email },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const current = inMemoryUserStore.get(identity.userId) || {};
  const next = { streak: 0, xp: 0, level: 1, badge: 'Beginner', ...current, ...identity };
  inMemoryUserStore.set(identity.userId, next);
  return next;
}

async function getUserProfile(identity) {
  if (isDatabaseReady()) {
    return User.findOne({ email: identity.email }).lean();
  }

  return inMemoryUserStore.get(identity.userId) || null;
}

async function getUserProgressRows(userId) {
  if (isDatabaseReady()) {
    return SequentialCourseProgress.find({ userId }).sort({ dayNumber: 1 }).lean();
  }

  return Array.from(inMemoryProgressStore.values())
    .filter((row) => row.userId === userId)
    .sort((left, right) => left.dayNumber - right.dayNumber);
}

async function saveUserProgress(identity, payload) {
  const normalized = normalizeProgressRow(payload);

  if (isDatabaseReady()) {
    return SequentialCourseProgress.findOneAndUpdate(
      { userId: identity.userId, dayNumber: normalized.dayNumber },
      { userId: identity.userId, ...normalized },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();
  }

  const key = `${identity.userId}:${normalized.dayNumber}`;
  const next = { userId: identity.userId, ...normalized };
  inMemoryProgressStore.set(key, next);
  return next;
}

async function updateGamification(identity, progressMap, completionDate, wasAlreadyCompleted) {
  const completedDays = Object.values(progressMap).filter((row) => row.isCompleted).length;
  const currentUser = await getUserProfile(identity);
  const streak = wasAlreadyCompleted
    ? currentUser?.streak || 0
    : calculateStreak(currentUser?.lastCompletedAt, completionDate, currentUser?.streak || 0);
  const xp = completedDays * 50;
  const level = getLevelFromXp(xp);
  const badge = getBadge({ completedDays, streak });

  if (isDatabaseReady()) {
    return User.findOneAndUpdate(
      { email: identity.email },
      {
        name: identity.name,
        email: identity.email,
        streak,
        xp,
        level,
        badge,
        lastCompletedAt: completionDate || currentUser?.lastCompletedAt || null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
  }

  const updated = {
    ...(currentUser || identity),
    streak,
    xp,
    level,
    badge,
    lastCompletedAt: completionDate || currentUser?.lastCompletedAt || null,
  };
  inMemoryUserStore.set(identity.userId, updated);
  return updated;
}

function buildResponse(identity, progressMap, user) {
  const snapshot = buildSequentialCourseSnapshot(progressMap);
  const xp = user?.xp || snapshot.completedDays * 50;
  const streak = user?.streak || snapshot.streakDays || 0;

  return {
    user: {
      ...identity,
      streak,
      xp,
      level: user?.level || getLevelFromXp(xp),
      badge: user?.badge || getBadge({ completedDays: snapshot.completedDays, streak }),
    },
    ...snapshot,
  };
}

async function applyProgressPatch(identity, req, res, patchBuilder = {}) {
  const dayNumber = Number(req.body?.dayNumber);
  if (!dayNumber || dayNumber < 1 || dayNumber > 365) {
    return res.status(400).json({ message: 'Valid dayNumber is required' });
  }

  const courseDay = getSequentialCourseDay(dayNumber);
  if (!courseDay) {
    return res.status(404).json({ message: 'Course day not found' });
  }

  await upsertUser(identity);
  const currentRows = await getUserProgressRows(identity.userId);
  const currentMap = mapProgressRows(currentRows);
  const highestUnlockedDay = getUnlockedDay(currentMap);

  if (dayNumber > highestUnlockedDay) {
    return res.status(403).json({ message: 'Complete previous day to unlock' });
  }

  const existingRow = currentMap[dayNumber] || { dayNumber };
  const patch = typeof patchBuilder === 'function' ? patchBuilder(existingRow) : patchBuilder;
  const candidateRow = normalizeProgressRow({
    ...existingRow,
    ...req.body,
    ...patch,
    dayNumber,
    completionDate: existingRow.completionDate,
  });

  const wasAlreadyCompleted = Boolean(existingRow.isCompleted);
  if (candidateRow.isCompleted && !wasAlreadyCompleted) {
    candidateRow.completionDate = new Date().toISOString();
  }
  if (!candidateRow.isCompleted) {
    candidateRow.completionDate = null;
  }

  const saved = await saveUserProgress(identity, candidateRow);
  const nextRows = await getUserProgressRows(identity.userId);
  const progressMap = mapProgressRows(nextRows);
  const user = await updateGamification(identity, progressMap, candidateRow.completionDate, wasAlreadyCompleted);

  return res.json({
    ok: true,
    message: checkDayCompletion(candidateRow) ? 'Day completed successfully' : 'Progress updated',
    progress: saved,
    ...buildResponse(identity, progressMap, user),
  });
}

export async function getSequentialCourseDays(req, res) {
  const identity = buildUserIdentity({}, req.query);
  const rows = await getUserProgressRows(identity.userId);
  const progressMap = mapProgressRows(rows);
  const user = await getUserProfile(identity);
  res.json(buildResponse(identity, progressMap, user));
}

export async function getSequentialCourseDayByNumber(req, res) {
  const identity = buildUserIdentity({}, req.query);
  const dayNumber = Number(req.params.dayNumber);
  const baseDay = getSequentialCourseDay(dayNumber);

  if (!baseDay) {
    return res.status(404).json({ message: 'Course day not found' });
  }

  const rows = await getUserProgressRows(identity.userId);
  const progressMap = mapProgressRows(rows);
  res.json({
    user: await getUserProfile(identity),
    day: getSequentialCourseDayPayload(dayNumber, progressMap),
    highestUnlockedDay: getUnlockedDay(progressMap),
  });
}

export async function updateSequentialCourseProgress(req, res) {
  return applyProgressPatch(buildUserIdentity(req.body, req.query), req, res, {});
}

export async function trackSequentialCourseVideo(req, res) {
  return applyProgressPatch(buildUserIdentity(req.body, req.query), req, res, {});
}

export async function trackSequentialCourseNotes(req, res) {
  return applyProgressPatch(buildUserIdentity(req.body, req.query), req, res, (existingRow) => ({
    notesOpened: req.body?.notesOpened ?? true,
    notesTime: Math.max(Number(existingRow.notesTime || 0), Number(req.body?.notesTime || 0)),
  }));
}

export async function trackSequentialCoursePodcast(req, res) {
  return applyProgressPatch(buildUserIdentity(req.body, req.query), req, res, (existingRow) => ({
    podcastProgress: Math.max(Number(existingRow.podcastProgress || 0), Number(req.body?.podcastProgress || 0)),
  }));
}

export async function trackSequentialCourseQuiz(req, res) {
  return applyProgressPatch(buildUserIdentity(req.body, req.query), req, res, {
    quizAttempted: true,
  });
}

export async function getSequentialCourseUserProgress(req, res) {
  const identity = buildUserIdentity({}, req.query);
  const rows = await getUserProgressRows(identity.userId);
  const progressMap = mapProgressRows(rows);
  const user = await getUserProfile(identity);
  res.json({
    ...buildResponse(identity, progressMap, user),
    progress: Object.values(progressMap).sort((left, right) => left.dayNumber - right.dayNumber),
  });
}

export async function getSequentialCourseUnlockStatus(req, res) {
  const identity = buildUserIdentity({}, req.query);
  const rows = await getUserProgressRows(identity.userId);
  const progressMap = mapProgressRows(rows);
  const highestUnlockedDay = getUnlockedDay(progressMap);

  res.json({
    user: await getUserProfile(identity),
    highestUnlockedDay,
    nextLockedDay: highestUnlockedDay < 365 ? highestUnlockedDay + 1 : null,
  });
}
