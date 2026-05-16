import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BookOpenCheck,
  Brain,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Crown,
  Download,
  Flame,
  Headphones,
  Languages,
  Lightbulb,
  Lock,
  Medal,
  MessageCircle,
  Mic,
  Moon,
  Play,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  buildWeakTopicPlan,
  classifyMistake,
  formatDuration,
  getAttemptInsights,
  getRankSnapshot,
} from '../utils/testIntelligence';
import { getLatestAttempt } from '../utils/testStorage';
import { TEST_ATTEMPT_KEY, getNextAction, getQuestionExplanation, getTopicBreakdown } from '../utils/testFlow';

function loadAttempt(locationState) {
  if (locationState?.questions) return locationState;
  try {
    const saved = sessionStorage.getItem(TEST_ATTEMPT_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    return null;
  }
  return getLatestAttempt();
}

function getRecoveryTopics(attempt, topicBreakdown) {
  const weakTopics = attempt?.weakTopics?.length
    ? attempt.weakTopics
    : topicBreakdown.filter((item) => item.accuracy < 70).map((item) => item.topic);
  const fallback = ['Organic Chemistry - Hydrocarbons', 'Trigonometry', 'Current Electricity'];
  return (weakTopics.length ? weakTopics : fallback).slice(0, 3);
}

function buildRecoveryTopic(topic, index = 0) {
  const plan = buildWeakTopicPlan(topic);
  const teacherNames = ['Ananya Sharma', 'Rohit Verma', 'Meera Iyer'];
  return {
    ...plan,
    weightage: ['High - 8 to 12 marks', 'Medium - 5 to 7 marks', 'High - repeated in PYQs'][index % 3],
    confidenceGain: [18, 14, 21][index % 3],
    videos: [
      {
        title: `${topic} short concept repair`,
        type: 'Short concept video',
        duration: '08:40',
        difficulty: 'Easy',
        teacher: teacherNames[index % teacherNames.length],
        progress: 28,
        reason: 'Recommended because you lost marks here.',
      },
      {
        title: `${topic} full chapter clarity`,
        type: 'Full chapter lecture',
        duration: '42:15',
        difficulty: 'Medium',
        teacher: teacherNames[(index + 1) % teacherNames.length],
        progress: 0,
        reason: 'Builds the missing foundation behind the wrong answer.',
      },
      {
        title: `${topic} topper mistake-solving sprint`,
        type: 'Topper strategy video',
        duration: '13:20',
        difficulty: 'Hard',
        teacher: teacherNames[(index + 2) % teacherNames.length],
        progress: 64,
        reason: 'Shows how high scorers avoid the exact trap.',
      },
    ],
    notes: [
      { title: 'Short Notes PDF', detail: '8 pages with weak concepts highlighted', icon: Download },
      { title: 'One-page Revision Sheet', detail: 'Final-hour memory sheet', icon: BookOpenCheck },
      { title: 'Formula Cheatsheet', detail: 'Daily formula reminders enabled', icon: Lightbulb },
      { title: 'Mind Map + Flowchart', detail: 'Visual path from concept to question', icon: Brain },
    ],
    pyqs: [
      { exam: 'JEE PYQ', difficulty: 'Medium', repeat: 'Most repeated', year: '2024' },
      { exam: 'NEET PYQ', difficulty: 'Easy', repeat: 'High frequency', year: '2023' },
      { exam: 'Olympiad PYQ', difficulty: 'Hard', repeat: 'Concept bridge', year: '2022' },
      { exam: 'Board PYQ', difficulty: 'Easy', repeat: 'Scoring pattern', year: '2025' },
    ],
    flashcards: [
      `Define the core rule of ${topic}.`,
      `What is the most common wrong option trap in ${topic}?`,
      `Which formula or reaction must be recalled first?`,
    ],
    microTasks: [
      '5-question drill',
      'Formula recap',
      'Concept flashcards',
      'Speed challenge',
    ],
    topperStrategy: 'Toppers solve definition-based questions first, mark formula-heavy questions, then return after scoring the easy set.',
    aiExplanation: `Your mistake suggests the concept is partly familiar, but the exam trap changed one condition. Rebuild ${topic} with one solved example, then retest immediately.`,
  };
}

function MetricCard({ icon: Icon, label, value, note, accent = 'text-blue-600' }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
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

function RecoverySection({ eyebrow, title, subtitle, children, action }) {
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

export default function TestResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const attempt = loadAttempt(location.state);
  const [answerMode, setAnswerMode] = useState('beginner');
  const [doubtText, setDoubtText] = useState('');
  const [parentMode, setParentMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [nightMode, setNightMode] = useState(false);

  const insights = useMemo(() => getAttemptInsights(attempt || {}), [attempt]);
  const topicBreakdown = useMemo(
    () => getTopicBreakdown(attempt?.questions || [], attempt?.answers || {}),
    [attempt],
  );
  const ranks = useMemo(() => getRankSnapshot(insights.percentile), [insights.percentile]);
  const recoveryTopics = useMemo(() => getRecoveryTopics(attempt, topicBreakdown).map(buildRecoveryTopic), [attempt, topicBreakdown]);
  const mistakes = useMemo(() => {
    const questions = attempt?.questions || [];
    const answers = attempt?.answers || {};
    return questions
      .map((question, index) => ({
        question,
        selected: answers[question.id],
        label: classifyMistake(question, answers[question.id], index, insights.avgTime),
      }))
      .filter((item) => item.label);
  }, [attempt, insights.avgTime]);
  const wrongQuestionRecovery = useMemo(
    () =>
      mistakes.map((mistake, index) => {
        const kit = buildRecoveryTopic(mistake.question.topic || `Question ${index + 1}`, index);
        return {
          ...mistake,
          index,
          kit,
          questionNumber: (attempt?.questions || []).findIndex((question) => question.id === mistake.question.id) + 1,
        };
      }),
    [attempt, mistakes],
  );

  if (!attempt) {
    return (
      <section className="section-container py-16">
        <div className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-950">Result not found</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Start a test first to unlock the AI learning recovery system.
          </p>
          <Link
            to="/test-series"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
          >
            Start Test
          </Link>
        </div>
      </section>
    );
  }

  const pieData = [
    { name: 'Correct', value: attempt.correct || 0, color: '#10b981' },
    { name: 'Wrong', value: attempt.wrong || 0, color: '#ef4444' },
    { name: 'Unanswered', value: attempt.unanswered || 0, color: '#94a3b8' },
  ];
  const progressData = [
    { name: 'This test', score: attempt.percentage },
    { name: 'After recovery', score: Math.min(100, attempt.percentage + recoveryTopics.length * 8 + 10) },
    { name: 'Retest target', score: Math.min(100, attempt.percentage + recoveryTopics.length * 11 + 16) },
  ];
  const timeline = [
    { when: 'Today', task: 'Weak topic revision, practice set, mini quiz', status: 'Start now' },
    { when: 'Tomorrow', task: 'Mixed concept test with simplified difficulty', status: 'Scheduled' },
    { when: '3 days later', task: 'Retest weak chapters with adaptive difficulty', status: 'Retention' },
    { when: '7 days later', task: 'AI retention check with previously wrong concepts', status: 'Memory lock' },
    { when: '15 days later', task: 'Final spaced repetition check', status: 'Long-term recall' },
  ];
  const missions = [
    { title: 'Fix 2 mistakes', reward: '+60 XP', icon: Target },
    { title: 'Watch 1 repair video', reward: '+40 XP', icon: Video },
    { title: 'Complete mini test', reward: '+90 XP', icon: Zap },
  ];
  const recoveryBadges = [
    { title: 'Mistake Crusher', unlocked: mistakes.length > 0 },
    { title: 'Comeback King', unlocked: attempt.percentage < 70 },
    { title: 'Recovery Warrior', unlocked: false },
    { title: 'Accuracy Builder', unlocked: insights.accuracy >= 60 },
  ];
  const aiDoubtAnswer = doubtText
    ? `${answerMode} mode: The fastest recovery is to compare your selected answer with the condition hidden in the question. Start with the formula, test one example, then solve a similar PYQ.`
    : 'Ask anything about a wrong answer and the AI coach will explain it in beginner mode, topper mode, Hindi, English, or Hinglish.';
  const recoveryMessage =
    attempt.percentage < 50
      ? 'This score is not a verdict. It is a map. Your speed has useful signals, and the recovery plan below can convert the weak topics into score gain.'
      : 'Good attempt. Now we turn every lost mark into a guided recovery task so the next score moves up.';

  return (
    <section className={`${nightMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-950'} py-10`}>
      <div className="section-container">
        <div className="mx-auto max-w-7xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.25rem] bg-slate-950 p-6 text-white shadow-premium sm:p-8 lg:p-10"
          >
            <div className="absolute inset-0 bg-hero-grid bg-[length:34px_34px] opacity-20" />
            <div className="absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
                  <Brain className="h-4 w-4 text-cyan-300" />
                  AI Learning Recovery System
                </div>
                <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Wrong answers are now your recovery plan.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">{recoveryMessage}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate('/test', { state: { subject: attempt.subject, difficulty: attempt.difficulty, isRetake: true } })}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-glow transition hover:-translate-y-0.5"
                  >
                    Start Smart Practice <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFocusMode((value) => !value)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5"
                  >
                    Focus Mode <Target className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNightMode((value) => !value)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5"
                  >
                    Night Revision <Moon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Score', `${attempt.netScore ?? attempt.score}/${attempt.total}`],
                  ['Readiness', `${insights.readiness}%`],
                  ['Next score', `${Math.min(100, attempt.percentage + 14)}%`],
                  ['Recovery streak', `${Math.max(1, mistakes.length)} days`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{label}</p>
                    <p className="mt-2 font-display text-3xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <RecoverySection
            eyebrow="Rank first"
            title="Your ranking snapshot"
            subtitle="Start with the competitive picture: where you stand now, what can improve, and how recovery affects the next rank jump."
            action={
              <button
                type="button"
                onClick={() => navigate('/leaderboard')}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Full leaderboard <ArrowRight className="h-4 w-4" />
              </button>
            }
          >
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {ranks
                .filter((rank) => rank.label !== 'School Rank')
                .map((rank) => (
                  <motion.div
                    key={rank.label}
                    whileHover={{ y: -4 }}
                    className="rounded-[1.5rem] bg-slate-50 p-5"
                  >
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{rank.label}</p>
                    <p className="mt-1 font-display text-3xl font-bold text-slate-950">{rank.value}</p>
                  </motion.div>
                ))}
              <motion.div whileHover={{ y: -4 }} className="rounded-[1.5rem] bg-blue-600 p-5 text-white shadow-glow">
                <Crown className="h-5 w-5 text-cyan-200" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Recovery Rank Boost</p>
                <p className="mt-1 font-display text-3xl font-bold">+{recoveryTopics.length * 7}%</p>
              </motion.div>
            </div>
          </RecoverySection>

          <RecoverySection
            eyebrow="Analytics"
            title="Performance diagnosis before recovery"
            subtitle="Now that rank is clear, see the exact analytics behind it: accuracy, time, readiness, score trend, and wrong-answer split."
          >
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={Target} label="Accuracy" value={`${insights.accuracy}%`} note={`${attempt.correct} correct from ${attempt.attempted} attempted`} />
              <MetricCard icon={Clock3} label="Time spent" value={formatDuration(insights.timeSpentSeconds)} note={`${insights.avgTime}s average per attempted question`} accent="text-cyan-600" />
              <MetricCard icon={Sparkles} label="AI exam readiness" value={`${insights.readiness}%`} note={`Predicted next test score: ${Math.min(100, attempt.percentage + 14)}%`} accent="text-violet-600" />
              <MetricCard icon={Flame} label="Recovery XP" value={`+${attempt.xpEarned || Math.max(20, attempt.percentage)}`} note="Earn more XP by fixing mistakes, not just taking tests." accent="text-orange-600" />
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="h-72 rounded-[1.5rem] bg-slate-50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="topRecoveryTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fill="url(#topRecoveryTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="h-72 rounded-[1.5rem] bg-slate-50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={92} paddingAngle={4}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
              Your accuracy dropped, but your solving speed improved significantly. This is recoverable with targeted concept repair.
            </div>
          </RecoverySection>

          <RecoverySection
            eyebrow="Wrong questions recovery lab"
            title="Every wrong question becomes a personal comeback path"
            subtitle="Class360 does not just show the mistake. It explains why it happened, gives the right concept, and unlocks videos, notes, PYQs, flashcards, formula sheets, micro tests, and doubt support for that exact question."
          >
            <div className="mt-6 grid gap-5">
              {wrongQuestionRecovery.length ? (
                wrongQuestionRecovery.map(({ question, selected, label, kit, questionNumber }, cardIndex) => (
                  <motion.article
                    key={question.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: cardIndex * 0.04 }}
                    className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="bg-slate-950 p-5 text-white">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-100">
                              Wrong Question {questionNumber || cardIndex + 1}
                            </span>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                              {label}
                            </span>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                              {question.topic || 'General'}
                            </span>
                          </div>
                          <h3 className="mt-4 max-w-5xl font-display text-2xl font-bold leading-snug">
                            {question.question}
                          </h3>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                          <p className="text-xs text-white/55">Expected exam weightage</p>
                          <p className="mt-1 font-display text-xl font-bold">{kit.weightage}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-5 p-5 xl:grid-cols-[0.85fr_1.15fr]">
                      <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[1.35rem] bg-rose-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Your answer</p>
                            <p className="mt-2 font-semibold text-rose-900">{selected || 'Not attempted'}</p>
                          </div>
                          <div className="rounded-[1.35rem] bg-emerald-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Correct answer</p>
                            <p className="mt-2 font-semibold text-emerald-900">{question.correctAnswer}</p>
                          </div>
                        </div>
                        <div className="rounded-[1.35rem] bg-blue-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">AI explanation of mistake</p>
                          <p className="mt-2 text-sm leading-7 text-slate-700">{getQuestionExplanation(question)}</p>
                          <p className="mt-3 text-sm leading-7 text-slate-700">{kit.aiExplanation}</p>
                        </div>
                        <div className="rounded-[1.35rem] bg-amber-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Topper strategy for this question</p>
                          <p className="mt-2 text-sm leading-7 text-amber-900">{kit.topperStrategy}</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[
                            ['Formula sheet', 'Open the exact formula/reaction needed here', Lightbulb],
                            ['Mini test', '5 adaptive questions from the same concept', ClipboardList],
                            ['Flashcards', `${kit.flashcards.length} cards for retention`, BookOpen],
                            ['AI doubt', 'Ask why your answer failed', MessageCircle],
                          ].map(([title, detail, Icon]) => (
                            <button
                              key={title}
                              type="button"
                              className="rounded-[1.25rem] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200"
                            >
                              <Icon className="h-5 w-5 text-blue-600" />
                              <p className="mt-3 font-semibold text-slate-950">{title}</p>
                              <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recommended videos for this wrong question</p>
                          <div className="mt-3 grid gap-3 md:grid-cols-3">
                            {kit.videos.map((videoItem) => (
                              <div key={videoItem.title} className="rounded-[1.35rem] bg-slate-50 p-3">
                                <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-3 text-white">
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-400/10" />
                                  <div className="relative flex h-20 flex-col justify-between">
                                    <span className="w-fit rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold">Autoplay preview</span>
                                    <Play className="h-7 w-7 text-cyan-200" />
                                  </div>
                                </div>
                                <p className="mt-3 text-xs font-semibold text-blue-700">{videoItem.type}</p>
                                <p className="mt-1 text-sm font-bold leading-5 text-slate-950">{videoItem.title}</p>
                                <p className="mt-2 text-xs text-slate-500">{videoItem.duration} · {videoItem.teacher}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-2">
                          <div className="rounded-[1.35rem] bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Notes and downloads</p>
                            <div className="mt-3 grid gap-2">
                              {kit.notes.map((note) => {
                                const Icon = note.icon;
                                return (
                                  <button key={note.title} type="button" className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-left text-sm font-semibold text-slate-700">
                                    <span className="inline-flex items-center gap-2">
                                      <Icon className="h-4 w-4 text-blue-600" />
                                      {note.title}
                                    </span>
                                    <Download className="h-4 w-4 text-slate-400" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div className="rounded-[1.35rem] bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Similar PYQs</p>
                            <div className="mt-3 grid gap-2">
                              {kit.pyqs.slice(0, 4).map((pyq) => (
                                <div key={`${pyq.exam}-${pyq.year}`} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm">
                                  <span className="font-semibold text-slate-700">{pyq.exam} {pyq.year}</span>
                                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">{pyq.difficulty}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[1.35rem] bg-slate-950 p-4 text-white">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Recovery action</p>
                              <p className="mt-2 text-sm leading-6 text-white/75">
                                Complete video, formula recap, flashcards, and a micro test. Then Class360 will re-ask this concept in 1, 3, 7, and 15 days.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigate('/test', { state: { subject: attempt.subject, difficulty: attempt.difficulty, topic: question.topic, questionCount: 5 } })}
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"
                            >
                              Fix this now <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <div className="rounded-[2rem] bg-emerald-50 p-6 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                  <h3 className="mt-3 font-display text-2xl font-bold text-emerald-950">No wrong questions in this attempt.</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    Beautiful. Class360 will still schedule retention checks so the concepts stay strong.
                  </p>
                </div>
              )}
            </div>
          </RecoverySection>

          <RecoverySection
            eyebrow="Weak topic recovery engine"
            title="Every weak topic now unlocks a full repair kit"
            subtitle="Videos, PDFs, formula sheets, flashcards, PYQs, mini tests, AI explanations, and topper strategy are generated from the mistakes in this test."
          >
            <div className="mt-6 grid gap-5">
              {recoveryTopics.map((topic, topicIndex) => (
                <motion.article
                  key={topic.topic}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: topicIndex * 0.05 }}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-5 text-white">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Weak topic</p>
                        <h3 className="mt-2 font-display text-3xl font-bold">{topic.topic}</h3>
                        <p className="mt-2 text-sm text-white/75">Expected exam weightage: {topic.weightage}</p>
                      </div>
                      <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
                        <p className="text-xs text-white/60">Potential gain</p>
                        <p className="font-display text-2xl font-bold">+{topic.confidenceGain}% confidence</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 xl:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <div className="grid gap-3 md:grid-cols-3">
                        {topic.videos.map((videoItem) => (
                          <div key={videoItem.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                            <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-4 text-white">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-400/10" />
                              <div className="relative flex h-24 flex-col justify-between">
                                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[11px] font-semibold">
                                  <Radio className="h-3 w-3" /> Preview
                                </span>
                                <Play className="h-8 w-8 text-cyan-200" />
                              </div>
                            </div>
                            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{videoItem.type}</p>
                            <h4 className="mt-2 font-display text-lg font-bold text-slate-950">{videoItem.title}</h4>
                            <p className="mt-2 text-sm text-slate-600">{videoItem.duration} · {videoItem.difficulty} · {videoItem.teacher}</p>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                              <div className="h-full rounded-full bg-blue-600" style={{ width: `${videoItem.progress}%` }} />
                            </div>
                            <p className="mt-3 text-xs leading-5 text-slate-500">{videoItem.reason}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {topic.notes.map((note) => {
                          const Icon = note.icon;
                          return (
                            <button key={note.title} type="button" className="rounded-[1.35rem] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1">
                              <Icon className="h-5 w-5 text-blue-600" />
                              <p className="mt-3 font-semibold text-slate-950">{note.title}</p>
                              <p className="mt-1 text-xs leading-5 text-slate-500">{note.detail}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[1.5rem] bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">AI explanation</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{topic.aiExplanation}</p>
                      </div>
                      <div className="rounded-[1.5rem] bg-amber-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Topper strategy</p>
                        <p className="mt-2 text-sm leading-7 text-amber-900">{topic.topperStrategy}</p>
                      </div>
                      <div className="rounded-[1.5rem] bg-blue-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Micro revision tasks</p>
                        <div className="mt-3 grid gap-2">
                          {topic.microTasks.map((task) => (
                            <div key={task} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                              <span>{task}</span>
                              <span className="text-blue-700">Start</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </RecoverySection>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <RecoverySection
              eyebrow="PYQ recommendation engine"
              title="Previous year questions from your weak topics"
              subtitle="Sorted by easy, medium, hard, and most repeated so recovery starts from the right level."
            >
              <div className="mt-6 grid gap-3">
                {recoveryTopics.flatMap((topic) => topic.pyqs.map((pyq) => ({ ...pyq, topic: topic.topic }))).slice(0, 8).map((pyq) => (
                  <div key={`${pyq.topic}-${pyq.exam}-${pyq.year}`} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
                    <div>
                      <p className="font-semibold text-slate-950">{pyq.topic}</p>
                      <p className="text-sm text-slate-500">{pyq.exam} · {pyq.year}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">{pyq.difficulty}</span>
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">{pyq.repeat}</span>
                    <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Solve</button>
                  </div>
                ))}
              </div>
            </RecoverySection>

            <RecoverySection
              eyebrow="AI micro-revision"
              title="Spend 12 minutes revising these 3 concepts"
              subtitle="Quick tasks designed for immediate recovery after test completion."
            >
              <div className="mt-6 grid gap-3">
                {missions.map((mission) => {
                  const Icon = mission.icon;
                  return (
                    <motion.div key={mission.title} whileHover={{ x: 4 }} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white p-2 text-blue-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">{mission.title}</p>
                          <p className="text-sm text-slate-500">{mission.reward}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                Adaptive rule: improve twice and difficulty increases; struggle twice and the path simplifies gradually.
              </div>
            </RecoverySection>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <RecoverySection
              eyebrow="AI doubt solver"
              title="Ask why the answer was wrong"
              subtitle="Explain simply, give shortcut, show formula, teach like a teacher, or switch to Hindi/Hinglish."
            >
              <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white">
                <div className="flex flex-wrap gap-2">
                  {['beginner', 'topper', 'Hindi', 'English', 'Hinglish'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setAnswerMode(mode)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${answerMode === mode ? 'bg-white text-slate-950' : 'bg-white/10 text-white'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <input
                    value={doubtText}
                    onChange={(event) => setDoubtText(event.target.value)}
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45"
                    placeholder="Why is this answer wrong?"
                  />
                  <button type="button" className="rounded-2xl bg-white px-4 py-3 text-slate-950">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm leading-7 text-white/75">{aiDoubtAnswer}</p>
              </div>
            </RecoverySection>

            <RecoverySection
              eyebrow="Smart study timeline"
              title="Spaced repetition recovery schedule"
              subtitle="The AI re-asks previously wrong concepts after 1, 3, 7, and 15 days."
            >
              <div className="mt-6 grid gap-3">
                {timeline.map((item, index) => (
                  <div key={item.when} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{index + 1}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-lg font-bold text-slate-950">{item.when}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">{item.status}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RecoverySection>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <RecoverySection
              eyebrow="Topper comparison mode"
              title="How toppers solved this test"
              subtitle="Compare your attempt against high-performing solving behavior without making it demotivating."
            >
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ['Average topper time', formatDuration(Math.max(300, insights.timeSpentSeconds - 360)), Clock3],
                  ['Recommended order', 'Easy first, marked later', ClipboardList],
                  ['Skipped analysis', 'Skip traps, return after scoring', Target],
                ].map(([label, value, Icon]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                    <p className="mt-1 font-semibold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
            </RecoverySection>

            <RecoverySection
              eyebrow="Recovery streak"
              title="Earn rewards for fixing mistakes"
              subtitle="Recovery badges reward revision, retests, and corrected weak topics."
            >
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {recoveryBadges.map((badge) => (
                  <div key={badge.title} className={`rounded-2xl border p-4 ${badge.unlocked ? 'border-blue-100 bg-blue-50 shadow-sm shadow-blue-100' : 'border-slate-200 bg-slate-50 opacity-65'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-2 ${badge.unlocked ? 'bg-white text-blue-700' : 'bg-white text-slate-400'}`}>
                        {badge.unlocked ? <BadgeCheck className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950">{badge.title}</p>
                        <p className="text-xs text-slate-500">{badge.unlocked ? 'Unlocked from this attempt' : 'Locked - finish recovery tasks'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RecoverySection>
          </div>

          <RecoverySection
            eyebrow="Advanced AI features"
            title="Recovery coach controls"
            subtitle="The recovery system is designed to become assistant, mentor, planner, analyst, and motivator."
          >
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ['Focus Mode', 'Distraction-free study', Target],
                ['Burnout Detection', 'Break after 42 min', ShieldCheck],
                ['Voice Revision', 'Explain weak concepts', Mic],
                ['Formula Reminders', 'Daily recall prompts', Lightbulb],
                ['Study Battle', 'Compete with friends', Users],
                ['Night Revision', 'Late-night dark UI', Moon],
                ['Prediction', `Next test ${Math.min(100, attempt.percentage + 14)}%`, Sparkles],
                ['Daily XP Missions', 'Quests unlocked', Flame],
                ['Parent Insight', 'Strengths and weak areas', Crown],
                ['Language Coach', 'Hindi, English, Hinglish', Languages],
              ].map(([title, detail, Icon]) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => title === 'Parent Insight' && setParentMode((value) => !value)}
                  className="rounded-2xl bg-slate-50 p-4 text-left transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  <Icon className="h-5 w-5 text-blue-600" />
                  <p className="mt-3 font-semibold text-slate-950">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
                </button>
              ))}
            </div>
            {parentMode ? (
              <div className="mt-5 grid gap-3 rounded-[1.5rem] bg-slate-950 p-5 text-white md:grid-cols-5">
                {[
                  ['Strengths', 'Speed improving'],
                  ['Weak areas', recoveryTopics[0]?.topic || 'Chemistry'],
                  ['Consistency', 'Needs 3-day loop'],
                  ['Attention', 'Drops after hard questions'],
                  ['Suggestion', 'Short revision before retest'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/45">{label}</p>
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </RecoverySection>

          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-premium sm:p-8">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Final AI recommendation</p>
                <h2 className="mt-2 font-display text-3xl font-bold">Your next best move is clear.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
                  Start with {recoveryTopics[0]?.topic || 'your weakest topic'}, watch the short concept repair, complete the 5-question drill, then retake a micro test. You should never have to guess what to study next.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/test', { state: { subject: attempt.subject, difficulty: attempt.difficulty, isRetake: true } })}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retake recovery test
                </button>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Open student dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
