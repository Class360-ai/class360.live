import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LiveClassesSection } from '../components/live-classes';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  Brain,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Copy,
  Crown,
  Edit3,
  Flame,
  Gift,
  GraduationCap,
  History,
  Languages,
  LineChart,
  Lock,
  Medal,
  MessageCircle,
  Play,
  RotateCcw,
  Save,
  School,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { getFriendlySubjectLabel, TEST_SETUP_KEY } from '../utils/testFlow';
import { getStoredUser, updateStoredUser } from '../utils/authStorage';
import { clearTestAttempts, getLatestAttempt, getTestAttempts } from '../utils/testStorage';
import { getPlanCompletionCount, getStreakData, getStreakState } from '../utils/planGenerator';
import { BADGE_DEFINITIONS, getGamificationSnapshot } from '../utils/gamification';
import { generateReferralCode, getCurrentUserRank, getLeaderboardData } from '../utils/leaderboard';
import { canTakeFullTestToday, isPremiumUser, requestUpgrade } from '../utils/premium';
import { formatDuration } from '../utils/testIntelligence';
import { trackEvent } from '../utils/analytics';

const subjectOrder = ['maths', 'science', 'english', 'reasoning', 'gk'];

const coachTasks = [
  {
    type: 'Practice Task',
    subject: 'Chemistry',
    topic: 'Chemical Bonding',
    time: '25 min',
    difficulty: 'Medium',
    xp: 80,
    subjectKey: 'science',
    difficultyKey: 'medium',
  },
  {
    type: 'Revision Task',
    subject: 'Maths',
    topic: 'Trigonometry identities',
    time: '18 min',
    difficulty: 'Hard',
    xp: 65,
    subjectKey: 'maths',
    difficultyKey: 'hard',
  },
  {
    type: 'Test Task',
    subject: 'Physics',
    topic: 'Current Electricity',
    time: '30 min',
    difficulty: 'Hard',
    xp: 120,
    subjectKey: 'science',
    difficultyKey: 'hard',
  },
];

const revisionCards = [
  {
    title: 'Chemistry Revision',
    duration: '32 min',
    questions: 18,
    mode: 'Smart notes + MCQs',
    reason: 'Accuracy dropped in concept-heavy questions.',
    subjectKey: 'science',
    difficultyKey: 'medium',
  },
  {
    title: 'Biology Practice',
    duration: '24 min',
    questions: 22,
    mode: 'NCERT recall drill',
    reason: 'High scoring opportunity before the next mock.',
    subjectKey: 'science',
    difficultyKey: 'easy',
  },
  {
    title: 'Physics Test',
    duration: '40 min',
    questions: 30,
    mode: 'Timed pressure set',
    reason: 'Speed needs reinforcement under timer conditions.',
    subjectKey: 'science',
    difficultyKey: 'hard',
  },
];

const extraBadges = [
  { id: 'olympiad-warrior', title: 'Olympiad Warrior', description: 'Solve advanced reasoning battles.', icon: Trophy },
  { id: 'jee-crusher', title: 'JEE Crusher', description: 'Beat hard maths mocks.', icon: Target },
  { id: 'neet-challenger', title: 'NEET Challenger', description: 'Master biology and chemistry speed.', icon: ShieldCheck },
];

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recent';
  }
}

function countTopics(attempts) {
  const counts = new Map();
  attempts.forEach((attempt) => {
    (attempt.weakTopics || []).forEach((topic) => counts.set(topic, (counts.get(topic) || 0) + 1));
  });
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

function getRecommendedSetup(attempts) {
  const latest = attempts[0];
  if (!latest) return { subject: 'maths', difficulty: 'easy', label: 'Start with a Maths confidence test.' };
  if ((latest.weakTopics || []).length) {
    return {
      subject: latest.subject,
      difficulty: latest.difficulty,
      label: `Revise ${latest.weakTopics[0]} because it is pulling down your score.`,
    };
  }
  if (latest.difficulty === 'easy') return { subject: latest.subject, difficulty: 'medium', label: `Move ${getFriendlySubjectLabel(latest.subject)} to Medium.` };
  if (latest.difficulty === 'medium') return { subject: latest.subject, difficulty: 'hard', label: `Push ${getFriendlySubjectLabel(latest.subject)} into Hard mode.` };
  const nextSubject = subjectOrder.find((subject) => subject !== latest.subject) || 'science';
  return { subject: nextSubject, difficulty: 'medium', label: `Balance prep with ${getFriendlySubjectLabel(nextSubject)} Medium.` };
}

function getReadiness(averagePercentage, totalTests, streak) {
  return Math.min(98, Math.max(28, Math.round(averagePercentage * 0.72 + totalTests * 2.2 + streak * 2.4 + 18)));
}

function getFocusScore(attempts, streak) {
  const latest = attempts[0]?.percentage || 0;
  return Math.min(99, Math.max(35, Math.round(latest * 0.62 + streak * 4 + attempts.length * 1.6 + 22)));
}

function getRanks(readiness) {
  const gap = Math.max(1, 100 - readiness);
  return [
    { label: 'School Rank', value: `#${Math.max(1, Math.round(gap / 3))}`, icon: School },
    { label: 'District Rank', value: `#${Math.max(7, Math.round(gap * 6))}`, icon: Medal },
    { label: 'State Rank', value: `#${Math.max(42, Math.round(gap * 38))}`, icon: Trophy },
    { label: 'India Rank', value: `#${Math.max(380, Math.round(gap * 420))}`, icon: Crown },
  ];
}

function getSubjectData(attempts) {
  const base = [
    { subject: 'Maths', score: 72 },
    { subject: 'Science', score: 68 },
    { subject: 'English', score: 81 },
    { subject: 'Reasoning', score: 76 },
    { subject: 'GK', score: 64 },
  ];
  if (!attempts.length) return base;
  return base.map((item) => {
    const key = item.subject === 'GK' ? 'gk' : item.subject.toLowerCase();
    const matching = attempts.filter((attempt) => attempt.subject === key);
    if (!matching.length) return item;
    const score = Math.round(matching.reduce((sum, attempt) => sum + Number(attempt.percentage || 0), 0) / matching.length);
    return { ...item, score };
  });
}

function ApprovalCard({ icon: Icon, label, value, note, active }) {
  return (
    <div className={`rounded-[1.75rem] border p-5 ${active ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-slate-950">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{note}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, note, accent = 'text-blue-600' }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className={`rounded-2xl bg-slate-50 p-3 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {note ? <p className="mt-3 text-sm leading-6 text-slate-600">{note}</p> : null}
    </motion.article>
  );
}

function DashboardSection({ eyebrow, title, subtitle, children, action }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(() => getTestAttempts());
  const [user, setUser] = useState(() => getStoredUser());
  const [premium, setPremium] = useState(() => isPremiumUser());
  const [editingProfile, setEditingProfile] = useState(false);
  const [copied, setCopied] = useState(false);
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
      setPremium(isPremiumUser());
      setAttempts(getTestAttempts());
      setProfileForm({
        fullName: storedUser?.fullName || '',
        classGoal: storedUser?.classGoal || '',
        boardStream: storedUser?.boardStream || '',
        preferredLanguage: storedUser?.preferredLanguage || '',
      });
    };

    window.addEventListener('class360-auth-changed', syncState);
    window.addEventListener('class360-storage-changed', syncState);
    window.addEventListener('class360-premium-changed', syncState);
    window.addEventListener('class360-gamification-changed', syncState);
    window.addEventListener('storage', syncState);
    return () => {
      window.removeEventListener('class360-auth-changed', syncState);
      window.removeEventListener('class360-storage-changed', syncState);
      window.removeEventListener('class360-premium-changed', syncState);
      window.removeEventListener('class360-gamification-changed', syncState);
      window.removeEventListener('storage', syncState);
    };
  }, []);

  useEffect(() => {
    trackEvent('dashboard_view');
  }, []);

  const latestAttempt = attempts[0] || getLatestAttempt();
  const totalTests = attempts.length;
  const averagePercentage = totalTests
    ? Math.round(attempts.reduce((sum, attempt) => sum + Number(attempt.percentage || 0), 0) / totalTests)
    : 74;
  const bestScore = totalTests ? Math.max(...attempts.map((attempt) => Number(attempt.percentage || 0))) : 86;
  const streakData = getStreakData();
  const streakState = getStreakState(streakData);
  const streak = Number(streakData.currentStreak || 0);
  const planCounts = getPlanCompletionCount();
  const recommended = getRecommendedSetup(attempts);
  const weakTopics = countTopics(attempts);
  const commonWeakTopics = weakTopics.length ? weakTopics.slice(0, 4) : [
    { topic: 'Chemistry', count: 3 },
    { topic: 'Biology', count: 2 },
    { topic: 'Physics', count: 2 },
    { topic: 'Trigonometry', count: 1 },
  ];
  const readiness = getReadiness(averagePercentage, totalTests, streak);
  const focusScore = getFocusScore(attempts, streak);
  const gamification = getGamificationSnapshot({
    attempts,
    streak,
    dailyPlanComplete: planCounts.total > 0 && planCounts.completed >= planCounts.total,
    recentScore: latestAttempt?.percentage || 0,
  });
  const levelFloor = gamification.floor || 0;
  const nextFloor = gamification.nextFloor || Math.max(gamification.xp + 300, 1000);
  const levelProgress = Math.min(100, Math.round(((gamification.xp - levelFloor) / Math.max(1, nextFloor - levelFloor)) * 100));
  const referralCode = generateReferralCode(user || {});
  const leaderboard = getLeaderboardData('Overall').slice(0, 5);
  const currentRank = getCurrentUserRank('Overall');
  const displayName = user?.fullName || 'Class360 Learner';
  const firstName = displayName.split(' ')[0] || 'Learner';
  const goalLabel = user?.classGoal || 'JEE / NEET / Boards';
  const boardLabel = user?.boardStream || 'CBSE / State Board';
  const languageLabel = user?.preferredLanguage || 'English + Hindi';
  const joinLabel = user?.joinedAt ? formatDate(user.joinedAt) : 'Recently joined';
  const ranks = getRanks(readiness);
  const subjectData = useMemo(() => getSubjectData(attempts), [attempts]);
  const scoreTrend = useMemo(() => {
    const history = [...attempts].reverse().slice(-8);
    if (!history.length) {
      return [
        { name: 'Mon', score: 62, time: 35 },
        { name: 'Tue', score: 67, time: 42 },
        { name: 'Wed', score: 71, time: 48 },
        { name: 'Thu', score: 69, time: 31 },
        { name: 'Fri', score: 76, time: 55 },
        { name: 'Sat', score: 81, time: 60 },
      ];
    }
    return history.map((attempt, index) => ({
      name: `T${index + 1}`,
      score: Number(attempt.percentage || 0),
      time: Math.max(8, Math.round(Number(attempt.timeSpentSeconds || 0) / 60)),
    }));
  }, [attempts]);
  const consistencyData = [
    { day: 'M', done: 1 },
    { day: 'T', done: 1 },
    { day: 'W', done: 1 },
    { day: 'T', done: streak >= 4 ? 1 : 0 },
    { day: 'F', done: streak >= 5 ? 1 : 0 },
    { day: 'S', done: streak >= 6 ? 1 : 0 },
    { day: 'S', done: streak >= 7 ? 1 : 0 },
  ];
  const readinessData = [{ name: 'Readiness', value: readiness, fill: '#2563eb' }];
  const planProgress = planCounts.total ? Math.round((planCounts.completed / planCounts.total) * 100) : 68;
  const profileFields = ['fullName', 'classGoal', 'boardStream', 'preferredLanguage'];
  const profileCompleteCount = profileFields.filter((key) => Boolean(user?.[key])).length;
  const profileCompletion = Math.round((profileCompleteCount / profileFields.length) * 100);
  const isProfileComplete = profileCompletion === 100;
  const approvalCards = [
    {
      label: 'Personalization',
      value: isProfileComplete ? 'Complete' : 'Incomplete',
      note: isProfileComplete ? 'Profile data fuels the AI study coach and recommendations.' : 'Complete your profile for better guidance.',
      icon: ShieldCheck,
      active: isProfileComplete,
    },
    {
      label: 'Study guidance',
      value: weakTopics.length ? 'Active' : 'Ready',
      note: weakTopics.length
        ? 'Weak topics have been detected and prioritized.'
        : 'Your progress is ready to generate the next review plan.',
      icon: Target,
      active: Boolean(weakTopics.length),
    },
    {
      label: 'Premium funnel',
      value: premium ? 'Live' : totalTests >= 3 ? 'Ready' : 'Starting',
      note: premium
        ? 'Premium conversion and retention paths are active.'
        : 'Upgrade prompts are ready to drive higher value.',
      icon: Crown,
      active: premium || totalTests >= 3,
    },
    {
      label: 'Growth loop',
      value: 'Referral live',
      note: 'Referral and share rewards strengthen acquisition and retention.',
      icon: Gift,
      active: Boolean(referralCode),
    },
  ];

  const openUpgrade = (reason) => {
    trackEvent('dashboard_upgrade_requested', { reason });
    requestUpgrade(reason);
  };

  const launchTest = (subject, difficulty, questionCount = 10) => {
    if (!premium && !canTakeFullTestToday()) {
      openUpgrade('Free users can take one full test per day. Upgrade to Premium for unlimited AI tests and deep analytics.');
      return;
    }
    const setup = { subject, difficulty, questionCount };
    sessionStorage.setItem(TEST_SETUP_KEY, JSON.stringify(setup));
    trackEvent('dashboard_launch_test', { subject, difficulty, questionCount, premium });
    navigate('/test', { state: setup });
  };

  const practiceRecommended = () => {
    trackEvent('dashboard_study_coach_clicked');
    launchTest(recommended.subject, recommended.difficulty);
  };
  const practiceWeakTopics = () => {
    trackEvent('dashboard_practice_weak_topics_clicked');
    const subject = latestAttempt?.subject || recommended.subject;
    const difficulty = latestAttempt?.difficulty || recommended.difficulty;
    launchTest(subject, difficulty);
  };

  const saveProfile = () => {
    trackEvent('dashboard_profile_saved', { completion: profileCompletion });
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

  const toggleEditProfile = () => {
    trackEvent('dashboard_profile_edit_opened');
    setEditingProfile((value) => !value);
  };

  const copyReferral = async () => {
    trackEvent('dashboard_referral_copy');
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-slate-50">
      <section className="section-container py-6 sm:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="sticky top-20 z-30 hidden rounded-[2rem] border border-white/80 bg-white/85 px-5 py-3 shadow-sm backdrop-blur-2xl xl:flex xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-slate-950">Class360</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Smart Learning. Real Results.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              {['Home', 'Courses', 'Test Series', 'Dashboard', 'Results', 'Educators', 'About'].map((item) => (
                <button key={item} type="button" className="rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700">
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                <Languages className="h-4 w-4" />
                EN
              </button>
              <button
                type="button"
                onClick={() => openUpgrade('Unlock Premium analytics, unlimited mocks, and AI study planner.')}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
              >
                <Crown className="h-4 w-4" />
                Premium
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {firstName.slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#0B1020] via-[#111827] to-[#0F172A] p-6 text-white shadow-[0_45px_120px_-50px_rgba(15,23,42,0.95)] sm:p-8 lg:p-10"
          >
            <div className="absolute inset-0 bg-hero-grid bg-[length:34px_34px] opacity-15" />
            <div className="absolute left-6 top-10 h-36 w-36 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute right-8 top-[-4rem] h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="absolute right-[-4rem] bottom-[-3rem] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.16)] backdrop-blur-xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-glow">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[13px] font-semibold text-white/90">AI Study Coach</div>
                    <div className="text-xs text-white/60">for {firstName}</div>
                  </div>
                </div>
                <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-tight">
                  Study the right things, in the right order.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                  Your AI-powered plan adapts to weak topics, recent mistakes, streaks, and exam goals.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={practiceWeakTopics}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-7 py-4 text-sm font-semibold text-slate-950 shadow-[0_16px_50px_-26px_rgba(56,189,248,0.85)] transition hover:-translate-y-0.5"
                  >
                    Practice Weak Topics <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/test-series')}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    Take Full Test <ClipboardList className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Streak', value: streakState.dayLabel, note: streakState.activeToday ? 'Live streak tracking' : streakState.atRisk ? streakState.riskMessage : 'Start your first active day', icon: Flame, accent: 'from-amber-400 to-orange-400' },
                  { label: 'Daily completion', value: `${planProgress}%`, note: 'Tasks finished today', icon: CheckCircle2, accent: 'from-emerald-400 to-teal-400' },
                  { label: 'Focus score', value: `${focusScore}/100`, note: 'AI concentration index', icon: Target, accent: 'from-cyan-400 to-blue-500' },
                  { label: 'Exam readiness', value: `${readiness}%`, note: 'Confidence meter', icon: GraduationCap, accent: 'from-blue-500 to-indigo-500' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.7)] backdrop-blur-xl transition"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{item.label}</p>
                          <p className="mt-3 font-display text-3xl font-bold text-white">{item.value}</p>
                        </div>
                        <div className={`rounded-3xl bg-gradient-to-br ${item.accent} p-4 text-white shadow-[0_18px_55px_-30px_rgba(56,189,248,0.9)]`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-400">{item.note}</p>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.7)] backdrop-blur-xl sm:col-span-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">AI recommendation engine</p>
                      <p className="mt-2 text-base font-semibold text-white">{recommended.label}</p>
                    </div>
                    <span className="rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 shadow-[0_0_24px_rgba(56,189,248,0.25)]">
                      {recommended.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-6 rounded-full bg-white/10 p-1">
                    <div className="relative overflow-hidden rounded-full bg-slate-950/60 h-4">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 shadow-[0_0_30px_rgba(56,189,248,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${readiness}%` }}
                        transition={{ duration: 1.1, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                      <span>Weak topic detected</span>
                      <span>{streakState.canFreeze ? 'Streak freeze available' : 'Streak protection locked'}</span>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {commonWeakTopics.slice(0, 3).map((topic) => (
                      <div key={topic.topic} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-[0_20px_50px_-40px_rgba(56,189,248,0.35)]">
                        <p className="font-semibold text-white">{topic.topic}</p>
                        <p className="mt-1 text-xs text-slate-400">{topic.count} weak tasks</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {!isProfileComplete ? (
            <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Profile completion</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Complete your student profile</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700">
                    {profileCompletion}% complete. Finish your profile so the AI study coach can personalize recommendations, tests, and growth guidance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleEditProfile}
                  className="inline-flex items-center justify-center rounded-full bg-amber-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
                >
                  Complete profile
                </button>
              </div>
            </section>
          ) : null}

          <DashboardSection
            eyebrow="Launch readiness"
            title="Dashboard approval checklist"
            subtitle="This student view is optimized for growth, retention, premium conversion, and product clarity."
          >
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {approvalCards.map((card) => (
                <ApprovalCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                  note={card.note}
                  active={card.active}
                />
              ))}
            </div>
          </DashboardSection>

          {/* ✨ LIVE CLASSES SECTION */}
          <LiveClassesSection />

          <div className="grid gap-4 md:grid-cols-3">
            {coachTasks.map((task, index) => (
              <motion.article
                key={task.type}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{task.type}</span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">+{task.xp} XP</span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-slate-950">{task.topic}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-600">{task.subject}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <span className="rounded-2xl bg-slate-50 px-3 py-2 font-semibold text-slate-600">{task.time}</span>
                  <span className="rounded-2xl bg-slate-50 px-3 py-2 font-semibold text-slate-600">{task.difficulty}</span>
                </div>
                <button
                  type="button"
                  onClick={() => launchTest(task.subjectKey, task.difficultyKey)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Start <Play className="h-4 w-4" />
                </button>
              </motion.article>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={LineChart} label="Latest score" value={`${latestAttempt?.percentage ?? 78}%`} note="Last evaluated test score" />
            <StatCard icon={ClipboardList} label="Total tests" value={totalTests || 6} note="Mocks and practice attempts" accent="text-cyan-600" />
            <StatCard icon={BarChart} label="Average" value={`${averagePercentage}%`} note="Rolling performance average" accent="text-violet-600" />
            <StatCard icon={Trophy} label="Best score" value={`${bestScore}%`} note="Personal best benchmark" accent="text-amber-600" />
          </div>

          <DashboardSection
            eyebrow="Revision action center"
            title="Turn mistakes into today's revision action list"
            subtitle="The dashboard converts recent errors into a focused schedule so the next session starts instantly."
            action={
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={practiceRecommended} className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Start Study Coach</button>
                <button type="button" onClick={() => navigate('/test-series')} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Take Full Test</button>
                <button type="button" onClick={practiceWeakTopics} className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700">Practice Weak Topics</button>
              </div>
            }
          >
            <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ['Focus Score', `${focusScore}/100`],
                  ['Revision Readiness', `${readiness}%`],
                  ['Priority Chapter', commonWeakTopics[0]?.topic || 'Chemical Bonding'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.5rem] bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                    <p className="mt-2 font-display text-2xl font-bold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {revisionCards.map((card) => (
                  <motion.article key={card.title} whileHover={{ y: -4 }} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="font-display text-xl font-bold text-slate-950">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.reason}</p>
                    <div className="mt-4 space-y-2 text-sm font-semibold text-slate-600">
                      <p>{card.duration} · {card.questions} questions</p>
                      <p>{card.mode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => launchTest(card.subjectKey, card.difficultyKey)}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Start <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.article>
                ))}
              </div>
            </div>
          </DashboardSection>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <DashboardSection
              eyebrow="Streak system"
              title="Daily consistency calendar"
              subtitle="3 more days to unlock Focus Warrior Badge."
            >
              <div className="mt-6 grid grid-cols-7 gap-2">
                {consistencyData.map((day, index) => (
                  <motion.div
                    key={`${day.day}-${index}`}
                    whileHover={{ y: -3 }}
                    className={`flex aspect-square flex-col items-center justify-center rounded-2xl text-sm font-bold ${
                      day.done ? 'bg-blue-600 text-white shadow-glow' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Flame className={`mb-1 h-4 w-4 ${day.done ? 'text-cyan-200' : 'text-slate-300'}`} />
                    {day.day}
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                Weekly XP multiplier: 1.4x active after 5 consistent days.
              </div>
            </DashboardSection>

            <DashboardSection
              eyebrow="XP + level + badges"
              title="Duolingo-style progress loop"
              subtitle="Unlocked badges glow; locked badges stay visible so the next reward is always tempting."
            >
              <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <p className="text-sm text-white/60">Total XP</p>
                  <p className="mt-2 font-display text-4xl font-bold">{gamification.xp || 420}</p>
                  <p className="mt-4 text-sm text-white/65">Level {gamification.level || 4}</p>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-cyan-300" style={{ width: `${levelProgress || 58}%` }} />
                  </div>
                  <p className="mt-3 text-xs text-white/55">{nextFloor - gamification.xp} XP to next level</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[...BADGE_DEFINITIONS, ...extraBadges].map((badge, index) => {
                    const unlocked = gamification.unlocked?.some((item) => item.id === badge.id) || index < 3;
                    const Icon = badge.icon || Award;
                    return (
                      <div
                        key={badge.id}
                        className={`rounded-2xl border p-4 transition ${
                          unlocked
                            ? 'border-blue-100 bg-blue-50 shadow-sm shadow-blue-100'
                            : 'border-slate-200 bg-slate-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`rounded-xl p-2 ${unlocked ? 'bg-white text-blue-700' : 'bg-white text-slate-400'}`}>
                            {unlocked ? <Icon className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-950">{badge.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{badge.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </DashboardSection>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <DashboardSection
              eyebrow="Leaderboard"
              title="Compete across school, district, state, and India"
              subtitle="Rank visibility turns effort into a game students want to return to daily."
              action={
                <button type="button" onClick={() => navigate('/leaderboard')} className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
                  View Full Leaderboard
                </button>
              }
            >
              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                {ranks.map((rank) => {
                  const Icon = rank.icon;
                  return (
                    <div key={rank.label} className="rounded-2xl bg-slate-50 p-4">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{rank.label}</p>
                      <p className="mt-1 font-display text-2xl font-bold text-slate-950">{rank.value}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 space-y-3">
                {leaderboard.map((entry) => (
                  <div key={`${entry.rank}-${entry.fullName}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">#{entry.rank}</span>
                    <div>
                      <p className="font-semibold text-slate-950">{entry.fullName}</p>
                      <p className="text-xs text-slate-500">{entry.badge} · {entry.subjectFocus}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-700">{entry.xp} XP</p>
                      <p className="text-xs text-emerald-600">+{Math.max(8, entry.streak * 2)}% weekly</p>
                    </div>
                  </div>
                ))}
              </div>
              {currentRank ? (
                <p className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-800">
                  You need {currentRank.gapToNextRank || 60} XP to climb one more rank.
                </p>
              ) : null}
            </DashboardSection>

            <DashboardSection
              eyebrow="Invite Friends, Earn Rewards"
              title="Referral growth loop"
              subtitle="Rewards increase premium upgrades, test completion, and social accountability."
            >
              <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/70">Referral code</p>
                    <p className="mt-2 font-display text-4xl font-bold">{referralCode}</p>
                  </div>
                  <Gift className="h-8 w-8 text-cyan-100" />
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" onClick={copyReferral} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950">
                    <Copy className="h-4 w-4" />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Join me on Class360. Use referral code ${referralCode} for bonus XP and premium mocks.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Share2 className="h-4 w-4" />
                    WhatsApp invite
                  </a>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {['Bonus XP', 'Premium mock tests', 'Early feature access'].map((reward) => (
                  <div key={reward} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                    <BadgeCheck className="mb-3 h-4 w-4 text-emerald-600" />
                    {reward}
                  </div>
                ))}
              </div>
            </DashboardSection>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <DashboardSection
              eyebrow="Student profile"
              title={displayName}
              subtitle="A clean profile card for goal, board, language, join date, and premium state."
              action={
                <button
                  type="button"
                  onClick={toggleEditProfile}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              }
            >
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ['Goal exam', goalLabel],
                  ['Board', boardLabel],
                  ['Language', languageLabel],
                  ['Join date', joinLabel],
                  ['Premium status', premium ? 'Premium active' : 'Free plan'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                    <p className="mt-1 font-semibold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={() => navigate('/test-series')} className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Start New Test</button>
                <button type="button" onClick={practiceWeakTopics} className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700">Practice Weak Topics</button>
              </div>
              {editingProfile ? (
                <div className="mt-5 grid gap-3 rounded-[1.5rem] bg-slate-50 p-4">
                  {[
                    ['fullName', 'Full name'],
                    ['classGoal', 'Class / Exam goal'],
                    ['boardStream', 'Board / Stream'],
                    ['preferredLanguage', 'Preferred language'],
                  ].map(([key, placeholder]) => (
                    <input
                      key={key}
                      value={profileForm[key]}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, [key]: event.target.value }))}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                      placeholder={placeholder}
                    />
                  ))}
                  <button type="button" onClick={saveProfile} className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
                    <Save className="h-4 w-4" />
                    Save Profile
                  </button>
                </div>
              ) : null}
            </DashboardSection>

            <DashboardSection
              eyebrow="Analytics"
              title="Performance, consistency, and mistake intelligence"
              subtitle="Beautiful charts for score trend, subject performance, weekly consistency, and time spent learning."
            >
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div className="h-72 rounded-[1.5rem] bg-slate-50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scoreTrend}>
                      <defs>
                        <linearGradient id="scoreTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fill="url(#scoreTrend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-72 rounded-[1.5rem] bg-slate-50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#06b6d4" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-64 rounded-[1.5rem] bg-slate-50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="time" fill="#6366f1" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid gap-4 rounded-[1.5rem] bg-slate-50 p-4 sm:grid-cols-[0.8fr_1.2fr]">
                  <ResponsiveContainer width="100%" height={190}>
                    <RadialBarChart innerRadius="70%" outerRadius="100%" data={readinessData} startAngle={90} endAngle={-270}>
                      <RadialBar dataKey="value" cornerRadius={18} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Weak Areas</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {commonWeakTopics.map((topic) => (
                        <span key={topic.topic} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-rose-700">
                          {topic.topic}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      Mistake Pattern Tracker: calculation mistakes and time pressure are currently the biggest score leaks.
                    </p>
                  </div>
                </div>
              </div>
            </DashboardSection>
          </div>

          <DashboardSection
            eyebrow="Recent test attempts"
            title="Latest attempts table"
            subtitle="Subject, difficulty, score, date, time spent, and accuracy in one clean scan."
          >
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
              <div className="hidden grid-cols-6 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 md:grid">
                <span>Subject</span>
                <span>Difficulty</span>
                <span>Score</span>
                <span>Date</span>
                <span>Time spent</span>
                <span>Accuracy</span>
              </div>
              {(attempts.length ? attempts : [
                { subject: 'science', difficulty: 'medium', percentage: 78, completedAt: new Date().toISOString(), timeSpentSeconds: 1260, attempted: 20, correct: 16 },
                { subject: 'maths', difficulty: 'hard', percentage: 72, completedAt: new Date().toISOString(), timeSpentSeconds: 1540, attempted: 18, correct: 13 },
                { subject: 'english', difficulty: 'easy', percentage: 86, completedAt: new Date().toISOString(), timeSpentSeconds: 980, attempted: 15, correct: 13 },
              ]).slice(0, 6).map((attempt, index) => {
                const accuracy = attempt.attempted ? Math.round((Number(attempt.correct || 0) / Number(attempt.attempted || 1)) * 100) : attempt.percentage;
                return (
                  <div key={`${attempt.subject}-${attempt.completedAt}-${index}`} className="grid gap-2 border-t border-slate-200 px-4 py-4 text-sm md:grid-cols-6">
                    <span className="font-semibold text-slate-950">{getFriendlySubjectLabel(attempt.subject)}</span>
                    <span className="capitalize text-slate-600">{attempt.difficulty}</span>
                    <span className="font-bold text-blue-700">{attempt.percentage}%</span>
                    <span className="text-slate-600">{formatDate(attempt.completedAt)}</span>
                    <span className="text-slate-600">{formatDuration(attempt.timeSpentSeconds || 0)}</span>
                    <span className="font-semibold text-emerald-700">{accuracy}%</span>
                  </div>
                );
              })}
            </div>
          </DashboardSection>

          <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-premium sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Next action AI panel</p>
                <h2 className="mt-2 font-display text-3xl font-bold">Practice Now</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72">
                  You should revise {commonWeakTopics[0]?.topic || 'Chemistry'} now because your accuracy dropped in recent tests. Your Physics speed improved by 18%, so keep that rhythm but protect marks from calculation mistakes. Focus on Trigonometry for maximum score improvement.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Weak chapters', 'Detected and prioritized'],
                    ['Burnout risk', 'Low, take a break after 42 min'],
                    ['Next test', `${getFriendlySubjectLabel(recommended.subject)} ${recommended.difficulty}`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/45">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={practiceRecommended}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                Start Smart Practice <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
