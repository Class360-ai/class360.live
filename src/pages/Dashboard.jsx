import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  Flame,
  History,
  PencilLine,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import StatsStrip from '../components/StatsStrip';
import DailyPlan from '../components/DailyPlan';
import ChapterRevisionPlan from '../components/ChapterRevisionPlan';
import GamificationPanel from '../components/GamificationPanel';
import LeaderboardPreview from '../components/LeaderboardPreview';
import ReferralCard from '../components/ReferralCard';
import { getFriendlySubjectLabel, TEST_SETUP_KEY } from '../utils/testFlow';
import { getStoredUser, updateStoredUser } from '../utils/authStorage';
import { clearTestAttempts, getLatestAttempt, getTestAttempts } from '../utils/testStorage';
import { getStreak, getTodayPlan, getPlanCompletionCount, getStudyCoachSnapshot } from '../utils/planGenerator';
import { useLanguage } from '../context/LanguageContext';
import { getLeaderboardPreview } from '../utils/leaderboard';
import { canTakeFullTestToday, isPremiumUser, requestUpgrade } from '../utils/premium';

const subjectOrder = ['maths', 'science', 'english', 'reasoning', 'gk'];

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

function countTopics(attempts) {
  const counts = new Map();
  attempts.forEach((attempt) => {
    (attempt.weakTopics || []).forEach((topic) => {
      counts.set(topic, (counts.get(topic) || 0) + 1);
    });
  });
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function getRecommendedSetup(attempts) {
  const latest = attempts[0];
  if (!latest) {
    return { subject: 'maths', difficulty: 'easy', label: 'Start with Maths Easy' };
  }

  if ((latest.weakTopics || []).length > 0) {
    return {
      subject: latest.subject,
      difficulty: latest.difficulty,
      label: `Practice ${getFriendlySubjectLabel(latest.subject)} again`,
    };
  }

  if (latest.difficulty === 'easy') {
    return {
      subject: latest.subject,
      difficulty: 'medium',
      label: `Move up to ${getFriendlySubjectLabel(latest.subject)} Medium`,
    };
  }

  if (latest.difficulty === 'medium') {
    return {
      subject: latest.subject,
      difficulty: 'hard',
      label: `Challenge yourself with ${getFriendlySubjectLabel(latest.subject)} Hard`,
    };
  }

  const nextSubject = subjectOrder.find((subject) => subject !== latest.subject) || 'science';
  return {
    subject: nextSubject,
    difficulty: 'medium',
    label: `Try ${getFriendlySubjectLabel(nextSubject)} Medium`,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [attempts, setAttempts] = useState(() => getTestAttempts());
  const [user, setUser] = useState(() => getStoredUser());
  const [premium, setPremium] = useState(() => isPremiumUser());
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(() => {
    const stored = getStoredUser();
    return {
      fullName: stored?.fullName || '',
      classGoal: stored?.classGoal || '',
      boardStream: stored?.boardStream || '',
      preferredLanguage: stored?.preferredLanguage || '',
    };
  });

  useEffect(() => {
    const syncState = () => {
      const storedUser = getStoredUser();
      setUser(storedUser);
      setProfileForm({
        fullName: storedUser?.fullName || '',
        classGoal: storedUser?.classGoal || '',
        boardStream: storedUser?.boardStream || '',
        preferredLanguage: storedUser?.preferredLanguage || '',
      });
      setAttempts(getTestAttempts());
    };

    window.addEventListener('class360-auth-changed', syncState);
    window.addEventListener('class360-storage-changed', syncState);
    window.addEventListener('class360-premium-changed', syncState);
    window.addEventListener('storage', syncState);
    return () => {
      window.removeEventListener('class360-auth-changed', syncState);
      window.removeEventListener('class360-storage-changed', syncState);
      window.removeEventListener('class360-premium-changed', syncState);
      window.removeEventListener('storage', syncState);
    };
  }, []);

  useEffect(() => {
    const syncPremium = () => setPremium(isPremiumUser());
    syncPremium();
    window.addEventListener('class360-premium-changed', syncPremium);
    window.addEventListener('storage', syncPremium);
    return () => {
      window.removeEventListener('class360-premium-changed', syncPremium);
      window.removeEventListener('storage', syncPremium);
    };
  }, []);

  const latestAttempt = attempts[0] || getLatestAttempt();
  const dailyPlan = getTodayPlan();
  const planCounts = getPlanCompletionCount();
  const totalTests = attempts.length;
  const averagePercentage = totalTests
    ? Math.round(attempts.reduce((sum, attempt) => sum + Number(attempt.percentage || 0), 0) / totalTests)
    : 0;
  const bestScore = totalTests ? Math.max(...attempts.map((attempt) => Number(attempt.percentage || 0))) : 0;
  const weakTopicCounts = countTopics(attempts);
  const commonWeakTopics = weakTopicCounts.slice(0, 3);
  const mistakeLeader = weakTopicCounts[0];
  const recentMistakeSubjects = attempts
    .filter((attempt) => (attempt.weakTopics || []).length)
    .slice(0, 3);
  const recommended = getRecommendedSetup(attempts);
  const streakDays = getStreak();
  const studyCoach = getStudyCoachSnapshot(attempts);

  const stats = [
    { value: latestAttempt ? `${latestAttempt.percentage}%` : '—', label: t('dashboard.latestScore', 'Latest test score') },
    { value: `${totalTests}`, label: t('dashboard.totalTests', 'Total tests taken') },
    { value: `${averagePercentage}%`, label: t('dashboard.averagePercentage', 'Average percentage') },
    { value: `${bestScore}%`, label: t('dashboard.bestScore', 'Best score') },
  ];

  const recentChartData = [...attempts]
    .reverse()
    .slice(-8)
    .map((attempt, index) => ({
      name: `T${index + 1}`,
      percentage: Number(attempt.percentage || 0),
    }));

  const displayName = user?.fullName || 'Learner';
  const goalLabel = user?.classGoal || 'Your exam goal';
  const boardLabel = user?.boardStream || 'Board / Stream';
  const languageLabel = user?.preferredLanguage || 'Preferred language';
  const joinLabel = user?.joinedAt ? formatDate(user.joinedAt) : 'Recently joined';

  const practiceRecommended = () => {
    if (!premium && !canTakeFullTestToday()) {
      requestUpgrade('Free users can take one full test per day. Upgrade to Premium for unlimited AI tests.');
      return;
    }
    const nextSetup = { subject: recommended.subject, difficulty: recommended.difficulty };
    sessionStorage.setItem(TEST_SETUP_KEY, JSON.stringify(nextSetup));
    navigate('/test', { state: nextSetup });
  };

  const practiceWeakTopics = () => {
    if (!latestAttempt) {
      navigate('/test-series');
      return;
    }
    if (!premium && !canTakeFullTestToday()) {
      requestUpgrade('You have used your free daily test. Upgrade to Premium for unlimited AI tests and deep weak-topic analysis.');
      return;
    }
    const nextSetup = {
      subject: latestAttempt.subject,
      difficulty: latestAttempt.difficulty,
    };
    sessionStorage.setItem(TEST_SETUP_KEY, JSON.stringify(nextSetup));
    navigate('/test', { state: nextSetup });
  };

  const startStudyCoach = () => {
    if (!latestAttempt) {
      navigate('/test-series');
      return;
    }
    if ((latestAttempt.weakTopics || []).length > 0) {
      practiceWeakTopics();
      return;
    }
    practiceRecommended();
  };

  const clearHistory = () => {
    const confirmed = window.confirm('Clear all saved test history from this browser?');
    if (!confirmed) return;
    clearTestAttempts();
    sessionStorage.removeItem(TEST_SETUP_KEY);
    setAttempts([]);
  };

  const viewLastResult = () => {
    if (!latestAttempt) return;
    navigate('/test-result');
  };

  const saveProfile = () => {
    const nextUser = updateStoredUser({
      fullName: profileForm.fullName.trim(),
      classGoal: profileForm.classGoal.trim(),
      boardStream: profileForm.boardStream.trim(),
      preferredLanguage: profileForm.preferredLanguage.trim(),
    });

    if (nextUser) {
      setUser(nextUser);
      setEditingProfile(false);
    }
  };

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <DailyPlan plan={dailyPlan} />
        <ChapterRevisionPlan
          attempts={attempts}
          onPracticeWeakTopics={practiceWeakTopics}
          onTakeFullTest={() => navigate('/test-series')}
          onStartStudyCoach={startStudyCoach}
        />
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Revision chapters</p>
              <h3 className="mt-1 font-display text-2xl font-bold text-slate-950">What to revise next</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                {studyCoach.slot.label} · {studyCoach.slot.time}
              </div>
              <button
                type="button"
                onClick={startStudyCoach}
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Start Study Coach
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {studyCoach.chapters.map((chapter) => (
              <span key={chapter} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                {chapter}
              </span>
            ))}
          </div>
        </div>
        <GamificationPanel
          attempts={attempts}
          streak={streakDays}
          dailyPlanComplete={planCounts.total > 0 && planCounts.completed >= planCounts.total}
          recentScore={latestAttempt?.percentage || 0}
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <LeaderboardPreview items={getLeaderboardPreview()} />
          <ReferralCard user={user} compact />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-6 text-white shadow-premium sm:p-8"
          >
            <div className="absolute right-[-2rem] top-[-2rem] h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">{t('dashboard.title', 'Student dashboard')}</p>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              {t('dashboard.welcome', 'Welcome back, {name}').replace('{name}', displayName)}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
              Goal: {goalLabel}. Your recent test activity, weak topics, and next best action are all tracked here from your browser history.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-white/90">
              <span className="rounded-full bg-white/15 px-3 py-1">{boardLabel}</span>
              <span className="rounded-full bg-white/15 px-3 py-1">{languageLabel}</span>
              <span className="rounded-full bg-white/15 px-3 py-1">Joined {joinLabel}</span>
              {premium ? <span className="rounded-full bg-amber-300/20 px-3 py-1 font-semibold text-amber-100">Premium</span> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/test-series')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                {t('dashboard.startButton', 'Start New Test')} <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={practiceWeakTopics}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                {t('common.practiceWeakTopics', 'Practice Weak Topics')} <BrainCircuit className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          <div className="grid gap-4">
            <div className="glass-card rounded-[2rem] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t('dashboard.profile', 'Student profile')}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">{displayName}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Goal: {goalLabel}</p>
                <p>Board / Stream: {boardLabel}</p>
                <p>Language: {languageLabel}</p>
                <p>Joined: {joinLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile((value) => !value)}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                {editingProfile ? <X className="h-4 w-4" /> : <PencilLine className="h-4 w-4" />}
                {editingProfile ? 'Close Profile Edit' : 'Edit Profile'}
              </button>

              {editingProfile ? (
                <div className="mt-4 grid gap-3 rounded-[1.5rem] bg-slate-50 p-4">
                  <input
                    value={profileForm.fullName}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, fullName: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                    placeholder="Full name"
                  />
                  <input
                    value={profileForm.classGoal}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, classGoal: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                    placeholder="Class / Exam goal"
                  />
                  <input
                    value={profileForm.boardStream}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, boardStream: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                    placeholder="Board / Stream"
                  />
                  <input
                    value={profileForm.preferredLanguage}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, preferredLanguage: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                    placeholder="Preferred language"
                  />
                  <button
                    type="button"
                    onClick={saveProfile}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Save className="h-4 w-4" />
                    Save Profile
                  </button>
                </div>
              ) : null}
            </div>

            <div className="glass-card rounded-[2rem] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t('dashboard.recommendedSubject', 'Recommended next subject')}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">
                    {getFriendlySubjectLabel(recommended.subject)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{recommended.label}</p>
              <button
                type="button"
                onClick={practiceRecommended}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Practice Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="glass-card rounded-[2rem] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t('dashboard.streak', 'Study streak')}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">
                    {streakDays ? `${streakDays} days` : 'No streak yet'}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {streakDays
                  ? 'A mock streak card to keep your momentum visible while you build consistency.'
                  : 'Complete a few tests to unlock a streak and daily consistency insights.'}
              </p>
            </div>

            {!premium ? (
              <div className="overflow-hidden rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-3 text-amber-600 shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Upgrade to Premium</p>
                    <p className="mt-1 font-display text-2xl font-bold text-slate-950">Unlock unlimited tests</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Get unlimited AI tests, advanced analytics, smart daily plans, and deeper weak-topic reports for faster score growth.
                </p>
                <button
                  type="button"
                  onClick={() => requestUpgrade('Unlock unlimited tests, advanced analytics, and premium weak-topic tracking with Class360 Premium.')}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Upgrade Now
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <StatsStrip items={stats} />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="glass-card rounded-[2rem] p-6">
              <SectionTitle
                eyebrow={t('dashboard.chartTitle', 'Performance chart')}
                title={t('dashboard.chartTitle', 'Recent score trend')}
                subtitle={t('dashboard.chartSub', 'A simple visual of your latest tests so you can spot progress quickly.')}
              />
              <div className="mt-6 h-72 rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                {recentChartData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={recentChartData}>
                      <defs>
                        <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="percentage"
                        stroke="#2563eb"
                        fill="url(#dashboardGradient)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-[1.5rem] bg-slate-50 text-center">
                    <div>
                      <p className="font-display text-2xl font-bold text-slate-950">No test data yet</p>
                      <p className="mt-2 text-sm text-slate-600">Take your first test to unlock analytics and trends.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-6">
              <SectionTitle
                eyebrow={t('dashboard.recentHistory', 'Recent history')}
                title={t('dashboard.recentHistory', 'Recent test attempts')}
                subtitle="See the last few attempts at a glance."
              />
              {attempts.length ? (
                <div className="mt-6 space-y-3">
                  {attempts.slice(0, 6).map((attempt) => (
                    <div
                      key={`${attempt.subject}-${attempt.completedAt}`}
                      className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80 sm:grid-cols-[1.1fr_0.7fr_0.5fr_0.7fr]"
                    >
                      <p className="font-semibold text-slate-950">{getFriendlySubjectLabel(attempt.subject)}</p>
                      <p className="text-sm capitalize text-slate-600">{attempt.difficulty}</p>
                      <p className="text-sm font-semibold text-blue-700">{attempt.percentage}%</p>
                      <p className="text-sm text-slate-500">{formatDate(attempt.completedAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-6 text-center">
                  <p className="font-display text-2xl font-bold text-slate-950">No tests taken yet</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Start a test to unlock history, trends, and weak-topic tracking.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-[2rem] p-6">
              <SectionTitle
                eyebrow={t('dashboard.weakTopics', 'Weak topics')}
                title={t('dashboard.weakCommon', 'Most common weak areas')}
                subtitle="These topics appear most often in the wrong-answer pattern."
              />
              {commonWeakTopics.length ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {commonWeakTopics.map((item) => (
                    <span
                      key={item.topic}
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                    >
                      {item.topic} x{item.count}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.75rem] bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
                  {t('dashboard.weakNone', 'No weak topics yet. Great start. Keep building consistency with more tests.')}
                </div>
              )}
            </div>

            <div className="glass-card rounded-[2rem] p-6">
              <SectionTitle
                eyebrow="Mistake tracker"
                title="Recent error patterns"
                subtitle="A quick look at where the last few misses are clustering."
              />
              {mistakeLeader ? (
                <div className="mt-6 space-y-3">
                  <div className="rounded-[1.5rem] border border-rose-100 bg-rose-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Top mistake topic</p>
                    <h3 className="mt-1 font-display text-xl font-bold text-slate-950">{mistakeLeader.topic}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Appeared in {mistakeLeader.count} wrong answers across your saved attempts.
                    </p>
                  </div>
                  {recentMistakeSubjects.length ? (
                    <div className="space-y-2">
                      {recentMistakeSubjects.map((attempt) => (
                        <div key={`${attempt.subject}-${attempt.completedAt}`} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                          <p className="text-sm font-semibold text-slate-950">{getFriendlySubjectLabel(attempt.subject)}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            {attempt.weakTopics.slice(0, 2).join(', ')}{attempt.weakTopics.length > 2 ? '...' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.75rem] bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
                  No mistake patterns yet. Your history is clean so far.
                </div>
              )}
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-premium">
              <p className="text-sm uppercase tracking-[0.22em] text-white/60">{t('dashboard.nextAction', 'Next action')}</p>
              <h2 className="mt-2 font-display text-3xl font-bold">{t('common.practiceNow', 'Practice Now')}</h2>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {recommended.label}. This keeps your prep focused and your next test aligned with the data you’ve already built.
              </p>
              <button
                type="button"
                onClick={practiceRecommended}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                Practice Now
              </button>
            </div>

            <div className="glass-card rounded-[2rem] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t('dashboard.latestScore', 'Latest test score')}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">
                    {latestAttempt ? `${latestAttempt.percentage}%` : '—'}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {latestAttempt
                  ? `Last subject: ${getFriendlySubjectLabel(latestAttempt.subject)}`
                  : 'Take a test to see your latest score here.'}
              </p>
            </div>

            <div className="glass-card rounded-[2rem] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t('dashboard.history', 'History actions')}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">{attempts.length} saved</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={viewLastResult}
                  disabled={!latestAttempt}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {t('dashboard.resultButton', 'View Last Result')}
                </button>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:text-rose-700"
                >
                  <Trash2 className="h-4 w-4" />
                    {t('dashboard.clearButton', 'Clear History')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/test-series')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  <RotateCcw className="h-4 w-4" />
                    {t('dashboard.startButton', 'Start New Test')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
