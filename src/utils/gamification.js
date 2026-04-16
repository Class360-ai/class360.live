const XP_KEY = 'class360_xp';
const BADGES_KEY = 'class360_badges';
const ACHIEVEMENT_KEY = 'class360_achievement_events';
const STREAK_BONUS_KEY = 'class360_streak_bonus_day';

export const BADGE_DEFINITIONS = [
  {
    id: 'first-test',
    title: 'First Test Completed',
    description: 'Celebrate your first step into smart practice.',
    emoji: '📝',
  },
  {
    id: 'streak-3',
    title: '3 Day Streak',
    description: 'Keep the momentum alive for three straight days.',
    emoji: '🔥',
  },
  {
    id: 'five-tests',
    title: '5 Tests Completed',
    description: 'Build consistency through repeated testing.',
    emoji: '🏆',
  },
  {
    id: 'score-80',
    title: 'Score 80%+',
    description: 'Reach a strong score milestone in a test.',
    emoji: '⭐',
  },
  {
    id: 'daily-plan',
    title: 'Daily Plan Finisher',
    description: 'Finish your Today\'s Smart Study Plan.',
    emoji: '✅',
  },
  {
    id: 'consistent-learner',
    title: 'Consistent Learner',
    description: 'Show up and keep practicing regularly.',
    emoji: '💡',
  },
];

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function emitChange() {
  window.dispatchEvent(new Event('class360-gamification-changed'));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getXP() {
  return Number(safeRead(XP_KEY, 0) || 0);
}

export function getLevelFromXP(xp) {
  const value = Number(xp || 0);
  if (value >= 1000) return { level: 5, floor: 1000, nextFloor: null };
  if (value >= 500) return { level: 4, floor: 500, nextFloor: 1000 };
  if (value >= 250) return { level: 3, floor: 250, nextFloor: 500 };
  if (value >= 100) return { level: 2, floor: 100, nextFloor: 250 };
  return { level: 1, floor: 0, nextFloor: 100 };
}

export function getBadgeProgress(data = {}) {
  const attempts = Array.isArray(data.attempts) ? data.attempts : [];
  const streak = Number(data.streak || 0);
  const dailyPlan = Boolean(data.dailyPlanComplete);
  const recentScore = Number(data.recentScore || 0);

  return {
    'first-test': attempts.length >= 1,
    'streak-3': streak >= 3,
    'five-tests': attempts.length >= 5,
    'score-80': recentScore >= 80,
    'daily-plan': dailyPlan,
    'consistent-learner': attempts.length >= 3 || streak >= 5,
  };
}

export function getUnlockedBadges(data = {}) {
  const progress = getBadgeProgress(data);
  return BADGE_DEFINITIONS.filter((badge) => progress[badge.id]);
}

export function getBadges() {
  return safeRead(BADGES_KEY, []);
}

export function getAchievementEvents() {
  return safeRead(ACHIEVEMENT_KEY, []);
}

export function saveBadgeUnlocks(nextBadges = [], eventNote = '') {
  const existing = getBadges();
  const existingIds = new Set(existing.map((badge) => badge.id));
  const merged = [
    ...existing,
    ...nextBadges
      .filter((badge) => !existingIds.has(badge.id))
      .map((badge) => ({ ...badge, unlockedAt: new Date().toISOString() })),
  ];

  safeWrite(BADGES_KEY, merged);

  if (eventNote) {
    const events = getAchievementEvents();
    safeWrite(ACHIEVEMENT_KEY, [{ note: eventNote, createdAt: new Date().toISOString() }, ...events].slice(0, 20));
  }

  emitChange();
  return merged;
}

export function addXP(amount, reason = '') {
  const current = getXP();
  const next = Math.max(0, current + Number(amount || 0));
  safeWrite(XP_KEY, next);

  if (reason) {
    const events = getAchievementEvents();
    safeWrite(ACHIEVEMENT_KEY, [{ note: reason, createdAt: new Date().toISOString() }, ...events].slice(0, 20));
  }

  emitChange();
  return next;
}

export function awardDailyStreakBonus(streak, reason = 'Daily streak bonus') {
  const value = Number(streak || 0);
  if (value < 1) return getXP();

  const today = todayKey();
  const lastAwarded = safeRead(STREAK_BONUS_KEY, null);
  if (lastAwarded === today) return getXP();

  addXP(5, reason);
  safeWrite(STREAK_BONUS_KEY, today);
  return getXP();
}

export function getGamificationSnapshot(data = {}) {
  const xp = getXP();
  const levelInfo = getLevelFromXP(xp);
  const badges = getBadges();
  const unlocked = getUnlockedBadges(data);
  return {
    xp,
    level: levelInfo.level,
    floor: levelInfo.floor,
    nextFloor: levelInfo.nextFloor,
    badges,
    unlocked,
  };
}

export function awardTestCompletionXP({ percentage = 0, totalTests = 0, streak = 0 } = {}) {
  const earned = calculateTestXpEarned({ percentage, streak });
  addXP(earned, 'Completed a full test');
  const nextBadges = getUnlockedBadges({
    attempts: Array.from({ length: Number(totalTests || 0) }),
    streak,
    recentScore: percentage,
  });
  saveBadgeUnlocks(nextBadges, nextBadges.length ? 'New test achievement unlocked' : '');
  return getXP();
}

export function awardDailyPlanXP({ taskCompleted = false, streak = 0, totalCompletedTasks = 0 } = {}) {
  const earned = calculateDailyPlanXpEarned({ taskCompleted });
  if (earned) addXP(earned, 'Completed a daily plan task');
  awardDailyStreakBonus(streak, 'Daily streak bonus');
  const nextBadges = getUnlockedBadges({
    attempts: Array.from({ length: Number(totalCompletedTasks || 0) }),
    streak,
    dailyPlanComplete: totalCompletedTasks >= 3,
  });
  saveBadgeUnlocks(nextBadges, nextBadges.length ? 'Daily plan achievement unlocked' : '');
  return getXP();
}

export function clearGamification() {
  localStorage.removeItem(XP_KEY);
  localStorage.removeItem(BADGES_KEY);
  localStorage.removeItem(ACHIEVEMENT_KEY);
  localStorage.removeItem(STREAK_BONUS_KEY);
  emitChange();
}

export function calculateTestXpEarned({ percentage = 0, streak = 0 } = {}) {
  let xp = 30;
  if (Number(percentage || 0) >= 80) xp += 20;
  if (Number(streak || 0) >= 1) xp += 5;
  return xp;
}

export function calculateDailyPlanXpEarned({ taskCompleted = false, streak = 0 } = {}) {
  return taskCompleted ? 10 : 0;
}
