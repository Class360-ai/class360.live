import { getStoredUser } from './authStorage';
import { getGamificationSnapshot, getLevelFromXP, getXP } from './gamification';
import { getLatestAttempt, getTestAttempts } from './testStorage';
import { getStreak } from './planGenerator';

const LEADERBOARD_SEED = [
  {
    rank: 1,
    fullName: 'Aarav Mehta',
    xp: 1480,
    streak: 14,
    badge: 'Consistent Learner',
    subjectFocus: 'Maths',
    timeframe: 'overall',
  },
  {
    rank: 2,
    fullName: 'Sneha Singh',
    xp: 1360,
    streak: 11,
    badge: 'Score 80%+',
    subjectFocus: 'Science',
    timeframe: 'overall',
  },
  {
    rank: 3,
    fullName: 'Ravi Kumar',
    xp: 1295,
    streak: 9,
    badge: '5 Tests Completed',
    subjectFocus: 'Maths',
    timeframe: 'overall',
  },
  {
    rank: 4,
    fullName: 'Priya Nair',
    xp: 1210,
    streak: 8,
    badge: 'Daily Plan Finisher',
    subjectFocus: 'Science',
    timeframe: 'this-week',
  },
  {
    rank: 5,
    fullName: 'Aman Verma',
    xp: 1175,
    streak: 7,
    badge: 'First Test Completed',
    subjectFocus: 'Reasoning',
    timeframe: 'this-week',
  },
  {
    rank: 6,
    fullName: 'Kunal Joshi',
    xp: 1120,
    streak: 6,
    badge: 'Consistent Learner',
    subjectFocus: 'Science',
    timeframe: 'maths',
  },
  {
    rank: 7,
    fullName: 'Farah Siddiqui',
    xp: 1090,
    streak: 5,
    badge: 'Score 80%+',
    subjectFocus: 'Science',
    timeframe: 'science',
  },
  {
    rank: 8,
    fullName: 'Meera Patel',
    xp: 1050,
    streak: 4,
    badge: 'Daily Plan Finisher',
    subjectFocus: 'SSC',
    timeframe: 'test-toppers',
  },
  {
    rank: 9,
    fullName: 'Rahul Sharma',
    xp: 1015,
    streak: 4,
    badge: '5 Tests Completed',
    subjectFocus: 'Maths',
    timeframe: 'test-toppers',
  },
];

function safeName(name) {
  return String(name || 'Class360 Learner').trim() || 'Class360 Learner';
}

function normalizeFilter(filter) {
  const value = String(filter || 'overall').toLowerCase();
  if (value === 'overall') return 'overall';
  if (value === 'this week') return 'this-week';
  if (value === 'maths') return 'maths';
  if (value === 'science') return 'science';
  if (value === 'test toppers') return 'test-toppers';
  return 'overall';
}

function buildCurrentUserEntry() {
  const user = getStoredUser();
  const attempts = getTestAttempts();
  const latest = getLatestAttempt();
  const streak = getStreak();
  const xp = getXP();
  const level = getLevelFromXP(xp);
  const snapshot = getGamificationSnapshot({
    attempts,
    streak,
    recentScore: latest?.percentage || 0,
  });

  if (!user && !attempts.length && !snapshot.xp) {
    return null;
  }

  const name = safeName(user?.fullName);
  const subjectFocus = latest?.subject ? String(latest.subject).toUpperCase() : 'Smart Prep';
  const badge = snapshot.unlocked?.[0]?.title || (attempts.length ? 'Building Momentum' : 'Getting Started');

  return {
    rank: null,
    fullName: name,
    xp: snapshot.xp || xp,
    streak,
    badge,
    subjectFocus,
    timeframe: 'current-user',
    testsCompleted: attempts.length,
    level: level.level,
    latestScore: latest?.percentage ?? 0,
    weakTopics: latest?.weakTopics || [],
  };
}

export function getLeaderboardData(filter = 'Overall') {
  const normalized = normalizeFilter(filter);
  const currentUser = buildCurrentUserEntry();
  const merged = [...LEADERBOARD_SEED];

  if (currentUser) {
    merged.push({
      ...currentUser,
      fullName: `${currentUser.fullName} (You)`,
      timeframe: normalized === 'overall' ? 'overall' : currentUser.timeframe,
    });
  }

  const filtered = merged.filter((entry) => {
    if (normalized === 'overall') return true;
    if (normalized === 'this-week') return entry.timeframe === 'this-week' || entry.timeframe === 'current-user';
    if (normalized === 'maths') return String(entry.subjectFocus).toLowerCase().includes('math');
    if (normalized === 'science') return String(entry.subjectFocus).toLowerCase().includes('science');
    if (normalized === 'test-toppers') return entry.timeframe === 'test-toppers' || entry.xp >= 1200;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => Number(b.xp || 0) - Number(a.xp || 0));
  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

export function getCurrentUserRank(filter = 'Overall') {
  const data = getLeaderboardData(filter);
  const current = data.find((entry) => String(entry.fullName || '').endsWith('(You)'));
  if (!current) return null;

  const nextHigher = data
    .filter((entry) => entry.rank < current.rank)
    .sort((a, b) => b.xp - a.xp)[0];
  const nextRankTarget = nextHigher ? Math.max(0, Number(nextHigher.xp || 0) + 1) : null;

  return {
    ...current,
    nextRankTarget,
    gapToNextRank: nextHigher ? Math.max(0, Number(nextHigher.xp || 0) - Number(current.xp || 0) + 1) : 0,
  };
}

export function buildShareText(result = {}, user = {}, gamification = {}) {
  const name = safeName(user?.fullName);
  const subject = result?.subject || 'Test';
  const score = Number(result?.percentage ?? result?.score ?? 0);
  const streak = Number(gamification?.streak || 0);
  const xp = Number(gamification?.xp || 0);
  const weakTopics = Array.isArray(result?.weakTopics) ? result.weakTopics.slice(0, 3) : [];
  const weakLine = weakTopics.length ? `Weak topics: ${weakTopics.join(', ')}.` : 'Weak topics are under control.';
  return [
    `Class360 result update`,
    `${name} just scored ${score}% in ${subject}.`,
    weakLine,
    `Streak: ${streak} days | XP: ${xp}`,
    'Smart Learning. Real Results.',
  ].join(' ');
}

export function generateReferralCode(user = {}) {
  const name = safeName(user?.fullName)
    .replace(/[^a-zA-Z ]/g, '')
    .trim()
    .split(/\s+/)
    .map((part) => part.slice(0, 2).toUpperCase())
    .join('');
  const fallback = 'CLASS360';
  const prefix = name || fallback;
  return `${prefix.slice(0, 6)}360`;
}

export function getReferralMessage(user = {}) {
  const code = generateReferralCode(user);
  const name = safeName(user?.fullName);
  return `Join me on Class360, ${name}! Use my referral code ${code} to unlock bonus XP, a free premium mock test, and early access features.`;
}

export function getLeaderboardPreview() {
  return getLeaderboardData('Overall').slice(0, 3);
}
