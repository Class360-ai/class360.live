import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Brain,
  CalendarClock,
  Crown,
  Flame,
  GraduationCap,
  Languages,
  Medal,
  Radio,
  School,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CTASection from '../components/CTASection';
import SectionTitle from '../components/SectionTitle';
import StatsStrip from '../components/StatsStrip';
import { EmptyStateCard, FilterChips, TestSeriesCard } from '../components/catalog';
import { difficultyBuckets, testSeriesFilters, testSeriesItems, testSeriesStats } from '../data/testSeries';
import { difficultyOptions, subjectOptions } from '../data/questions';
import { TEST_SETUP_KEY } from '../utils/testFlow';
import { canTakeFullTestToday, getUsageLimitMessage, isPremiumUser, requestUpgrade } from '../utils/premium';

const categoryCards = [
  { title: 'JEE', icon: Target, count: '420 tests', difficulty: 'Advanced', subjectKey: 'maths', difficultyKey: 'hard', accent: 'from-blue-600 via-indigo-600 to-cyan-500' },
  { title: 'NEET', icon: Brain, count: '360 tests', difficulty: 'Advanced', subjectKey: 'science', difficultyKey: 'hard', accent: 'from-emerald-500 via-teal-500 to-cyan-500' },
  { title: 'CUET', icon: GraduationCap, count: '190 tests', difficulty: 'Moderate', subjectKey: 'english', difficultyKey: 'medium', accent: 'from-violet-600 via-fuchsia-500 to-pink-500' },
  { title: 'Olympiads', icon: Trophy, count: '150 tests', difficulty: 'Challenge', subjectKey: 'reasoning', difficultyKey: 'hard', accent: 'from-amber-500 via-orange-500 to-rose-500' },
  { title: 'Navodaya', icon: School, count: '110 tests', difficulty: 'Foundation', subjectKey: 'reasoning', difficultyKey: 'medium', accent: 'from-sky-500 via-blue-500 to-indigo-500' },
  { title: 'NDA', icon: ShieldCheck, count: '135 tests', difficulty: 'Mixed', subjectKey: 'gk', difficultyKey: 'medium', accent: 'from-slate-700 via-slate-900 to-blue-900' },
  { title: 'CBSE', icon: BookOpenCheck, count: '260 tests', difficulty: 'Board', subjectKey: 'maths', difficultyKey: 'medium', accent: 'from-cyan-500 via-blue-500 to-indigo-600' },
  { title: 'State Boards', icon: Medal, count: '310 tests', difficulty: 'Board', subjectKey: 'science', difficultyKey: 'easy', accent: 'from-lime-500 via-emerald-500 to-teal-600' },
];

const liveTests = [
  { title: 'JEE Main Rank Booster Live', startsIn: '02:14:08', participants: '18,420', difficulty: 'Hard', subjectKey: 'maths', difficultyKey: 'hard' },
  { title: 'NEET Biology Sunday Mock', startsIn: '05:42:30', participants: '24,810', difficulty: 'Medium', subjectKey: 'science', difficultyKey: 'medium' },
  { title: 'CUET English Speed Test', startsIn: '11:05:44', participants: '8,950', difficulty: 'Medium', subjectKey: 'english', difficultyKey: 'medium' },
  { title: 'Navodaya Mental Ability Battle', startsIn: '23:18:16', participants: '13,670', difficulty: 'Easy', subjectKey: 'reasoning', difficultyKey: 'easy' },
];

const pyqPapers = [
  { exam: 'JEE', years: ['2025', '2024', '2023'], tags: ['Hard', 'Physics + Maths'], subjectKey: 'maths', difficultyKey: 'hard' },
  { exam: 'NEET', years: ['2025', '2024', '2022'], tags: ['Medium', 'Bio heavy'], subjectKey: 'science', difficultyKey: 'medium' },
  { exam: 'Navodaya', years: ['2024', '2023', '2021'], tags: ['Easy', 'Reasoning'], subjectKey: 'reasoning', difficultyKey: 'easy' },
  { exam: 'Olympiads', years: ['2024', '2022', '2020'], tags: ['Challenge', 'Logic'], subjectKey: 'reasoning', difficultyKey: 'hard' },
  { exam: 'CBSE Boards', years: ['2025', '2024', '2023'], tags: ['Board', 'Topic-wise'], subjectKey: 'maths', difficultyKey: 'medium' },
];

const aiInsights = [
  'You lose marks mainly in calculation mistakes.',
  'Your Physics speed improved by 18%.',
  'Focus on Trigonometry for maximum score improvement.',
];

function scrollToId(id) {
  const node = document.getElementById(id);
  if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function TestSeries() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTests = useMemo(() => {
    if (activeFilter === 'All') return testSeriesItems;
    return testSeriesItems.filter(
      (item) => item.category === activeFilter || item.exam === activeFilter,
    );
  }, [activeFilter]);

  const difficultyMockCards = useMemo(
    () =>
      difficultyBuckets.map((bucket) => {
        const matching = testSeriesItems.find(
          (item) => item.category === 'Mock Tests' && item.difficulty === bucket.difficulty,
        );
        return { ...bucket, sample: matching };
      }),
    [],
  );

  const launchSetup = ({ subjectKey, difficultyKey, subject, difficulty, questionCount }) => {
    const resolvedSubject = subjectKey || subject;
    const resolvedDifficulty = difficultyKey || difficulty;
    if (!resolvedSubject || !resolvedDifficulty) return;
    if (!isPremiumUser() && !canTakeFullTestToday()) {
      requestUpgrade(`${getUsageLimitMessage()} Upgrade to Premium for unlimited AI tests.`);
      return;
    }
    const setup = { subject: resolvedSubject, difficulty: resolvedDifficulty, questionCount };
    sessionStorage.setItem(TEST_SETUP_KEY, JSON.stringify(setup));
    navigate('/test', { state: setup });
  };

  const launchTest = (test) => {
    launchSetup({ subjectKey: test.subjectKey, difficultyKey: test.difficulty, questionCount: Math.min(15, test.questions || 10) });
  };

  const startCustomTest = () => {
    launchSetup({ subjectKey: selectedSubject, difficultyKey: selectedDifficulty, questionCount: 10 });
  };

  return (
    <div className="overflow-hidden">
      <section className="relative bg-slate-950 text-white">
        <div className="absolute inset-0 bg-hero-grid bg-[length:34px_34px] opacity-25" />
        <motion.div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="section-container relative py-12 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
                <Radio className="h-4 w-4 text-cyan-300" />
                42,318 students practicing live
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Crack every exam with AI-powered test series.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
                Free mocks, live battles, PYQs, AI insights, rank prediction, weak-topic repair, and rewards built for serious Indian learners.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => launchSetup({ subjectKey: 'maths', difficultyKey: 'easy', questionCount: 10 })}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-glow transition hover:-translate-y-0.5"
                >
                  Start Free Test <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId('pyq-zone')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Explore PYQs <BookOpenCheck className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  ['1.2M+', 'attempts'],
                  ['98K+', 'daily learners'],
                  ['92%', 'better recall'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="font-display text-2xl font-bold">{value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.article
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="rounded-[2rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">Topper highlight</span>
                  <Trophy className="h-5 w-5 text-amber-300" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold">AIR Predictor</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">Riya improved from 61% to 84% after 21 adaptive mocks.</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full rounded-full bg-cyan-300" initial={{ width: '30%' }} animate={{ width: '84%' }} transition={{ duration: 1.1 }} />
                </div>
              </motion.article>
              <article className="rounded-[2rem] border border-white/12 bg-white p-5 text-slate-950 shadow-premium">
                <p className="text-sm font-semibold text-blue-700">Live rank pulse</p>
                <div className="mt-5 space-y-3">
                  {['JEE Sprint', 'NEET Mock', 'CBSE Boards'].map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="text-sm font-semibold">{item}</span>
                      <span className="text-sm font-bold text-blue-700">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="rounded-[2rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl sm:col-span-2">
                <div className="grid gap-3 sm:grid-cols-3">
                  {aiInsights.map((insight) => (
                    <div key={insight} className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/75">
                      <Sparkles className="mb-3 h-4 w-4 text-cyan-300" />
                      {insight}
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container mt-10">
        <StatsStrip items={testSeriesStats} />
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Exam categories"
          title="One test engine for every Indian exam goal"
          subtitle="Tap a category and jump directly into the right practice mode."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryCards.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.title}
                type="button"
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => launchSetup(category)}
                className={`relative min-h-48 overflow-hidden rounded-[2rem] bg-gradient-to-br ${category.accent} p-5 text-left text-white shadow-sm`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-white/18 p-3 backdrop-blur">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-semibold backdrop-blur">{category.difficulty}</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold">{category.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{category.count}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Free vs Pro"
          title="Start free, unlock the serious AI edge when you are ready"
          subtitle="Clear value tiers for daily practice, deep analytics, and premium doubt support."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {[
            {
              title: 'Free',
              icon: Zap,
              price: 'Rs. 0',
              accent: 'from-cyan-500 to-blue-600',
              features: ['Daily quizzes', 'Weekly mock tests', 'Basic analytics', 'Limited rankings'],
            },
            {
              title: 'Pro',
              icon: Crown,
              price: 'AI Max',
              accent: 'from-slate-950 via-indigo-950 to-blue-900',
              features: ['AI analytics', 'AIR prediction', 'Advanced weak-topic analysis', 'Unlimited PYQs', 'AI study planner', 'Premium doubt sessions'],
            },
          ].map((plan) => {
            const Icon = plan.icon;
            return (
              <motion.article
                key={plan.title}
                whileHover={{ y: -5 }}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
              >
                <div className={`bg-gradient-to-r ${plan.accent} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <Icon className="h-7 w-7" />
                    <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold">{plan.price}</span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-bold">{plan.title}</h3>
                </div>
                <div className="grid gap-3 p-6 sm:grid-cols-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                      <BadgeCheck className="h-4 w-4 text-emerald-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Live tests"
          title="Compete in live mocks with countdown pressure"
          subtitle="Countdown timers, participant counts, difficulty badges, and glow states make every mock feel alive."
        />
        <div className="mt-8 flex gap-4 overflow-x-auto pb-3">
          {liveTests.map((test) => (
            <motion.article
              key={test.title}
              whileHover={{ y: -5 }}
              className="min-w-[280px] rounded-[2rem] border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/60 sm:min-w-[340px]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  Live soon
                </span>
                <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">{test.difficulty}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-slate-950">{test.title}</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <CalendarClock className="h-4 w-4 text-blue-600" />
                  <p className="mt-2 font-display text-xl font-bold text-slate-950">{test.startsIn}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <p className="mt-2 font-display text-xl font-bold text-slate-950">{test.participants}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => launchSetup(test)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
              >
                Start <ArrowRight className="h-4 w-4" />
              </button>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="pyq-zone" className="section-container mt-16">
        <SectionTitle
          eyebrow="Previous year papers"
          title="PYQs as interactive tests, not static PDFs"
          subtitle="Filter by year, start test mode, translate to Hindi, or jump into topic analysis."
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {['All years', '2025', '2024', '2023', '2022'].map((year) => (
            <button key={year} type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">
              {year}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {pyqPapers.map((paper) => (
            <motion.article key={paper.exam} whileHover={{ y: -5 }} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-700">PYQ vault</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">{paper.exam}</h3>
                </div>
                <Languages className="h-5 w-5 text-orange-500" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {paper.years.map((year) => (
                  <span key={year} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{year}</span>
                ))}
                {paper.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{tag}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => launchSetup(paper)} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
                  Start Test <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
                  Topic Analysis <BarChart3 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-sm font-semibold text-orange-600">Hindi Translate support ready inside exam mode.</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Categories"
          title="Filter by test type or exam focus"
          subtitle="Move quickly between scholarship, free practice, and exam-specific mock tests."
        />
        <div className="mt-6">
          <FilterChips items={testSeriesFilters} active={activeFilter} onChange={setActiveFilter} />
        </div>
      </section>

      <section id="featured-tests" className="section-container mt-12">
        <SectionTitle
          eyebrow="Test catalog"
          title="Premium test cards students can start instantly"
          subtitle="Each card shows mode, difficulty, duration, and the pressure it simulates."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {filteredTests.length ? (
            filteredTests.map((test) => <TestSeriesCard key={test.id} test={test} onStart={launchTest} />)
          ) : (
            <div className="lg:col-span-2">
              <EmptyStateCard
                title="No test series match this filter"
                description="Try another chip or go back to the full catalog to explore scholarship, free practice, and mock tests."
                actionLabel="Show all tests"
                onAction={() => setActiveFilter('All')}
              />
            </div>
          )}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Difficulty ladder"
          title="Mock tests that scale pressure gradually"
          subtitle="Start with confidence, then move into serious exam pressure."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {difficultyMockCards.map((bucket) => (
            <motion.article
              key={bucket.difficulty}
              whileHover={{ y: -5 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">{bucket.title}</p>
              <h3 className="mt-3 font-display text-2xl font-bold text-slate-950">
                {bucket.sample ? bucket.sample.title : bucket.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{bucket.note}</p>
              {bucket.sample ? (
                <button
                  type="button"
                  onClick={() => launchTest(bucket.sample)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Start {bucket.title} <ArrowRight className="h-4 w-4" />
                </button>
              ) : null}
            </motion.article>
          ))}
        </div>
      </section>

      <section id="practice-builder" className="section-container mt-16">
        <SectionTitle
          eyebrow="Custom builder"
          title="Build your own focused practice test"
          subtitle="Choose one subject and one difficulty to launch a fast diagnostic."
        />
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-display text-2xl font-bold text-slate-950">1. Choose a subject</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {subjectOptions.map((subject) => {
                const active = selectedSubject === subject.key;
                return (
                  <motion.button
                    key={subject.key}
                    type="button"
                    whileHover={{ y: -3 }}
                    onClick={() => setSelectedSubject(subject.key)}
                    className={`rounded-3xl border p-4 text-left transition ${
                      active ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-slate-200 bg-white hover:border-blue-200'
                    }`}
                  >
                    <div className={`h-2 w-14 rounded-full bg-gradient-to-r ${subject.accent}`} />
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <h4 className="font-display text-lg font-bold text-slate-950">{subject.label}</h4>
                      {active ? <BadgeCheck className="h-5 w-5 text-blue-600" /> : null}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-display text-2xl font-bold text-slate-950">2. Choose difficulty</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {difficultyOptions.map((difficulty) => {
                const active = selectedDifficulty === difficulty.key;
                return (
                  <motion.button
                    key={difficulty.key}
                    type="button"
                    whileHover={{ y: -3 }}
                    onClick={() => setSelectedDifficulty(difficulty.key)}
                    className={`rounded-3xl border p-4 text-left transition ${
                      active ? 'border-indigo-500 bg-indigo-50 shadow-lg' : 'border-slate-200 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">{difficulty.label}</p>
                    <h4 className="mt-3 font-display text-xl font-bold text-slate-950">{difficulty.label}</h4>
                    <p className="mt-2 text-sm text-slate-600">{difficulty.note}</p>
                  </motion.button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={startCustomTest}
              disabled={!selectedSubject || !selectedDifficulty}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Start Test <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="section-container mt-16">
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-premium sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Gamification loop</p>
              <h2 className="mt-3 font-display text-3xl font-bold">Streaks, XP, levels, and animated rewards</h2>
              <p className="mt-3 text-sm leading-7 text-white/68">Designed to make revision feel like daily progress, not a punishment.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ['7 days', 'streak'],
                ['2,450', 'XP'],
                ['Level 12', 'focus'],
                ['18/25', 'badges'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-4">
                  <Flame className="h-5 w-5 text-orange-300" />
                  <p className="mt-3 font-display text-2xl font-bold">{value}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-16">
        <CTASection
          title="Practice daily. Repair weak topics. Rise on the leaderboard."
          subtitle="Class360 turns tests into a habit loop: attempt, analyze, revise, compete, repeat."
          primary={
            <button
              type="button"
              onClick={() => launchSetup({ subjectKey: 'science', difficultyKey: 'medium', questionCount: 10 })}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            >
              Start Smart Mock
            </button>
          }
          secondary={
            <button
              type="button"
              onClick={() => scrollToId('pyq-zone')}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              Open PYQ Vault
            </button>
          }
        />
      </div>
    </div>
  );
}
