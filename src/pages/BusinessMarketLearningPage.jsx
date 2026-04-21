import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Brain,
  CandlestickChart,
  ClipboardList,
  BookOpen,
  Infinity,
  Laptop,
  LineChart,
  NotebookText,
  Package,
  PiggyBank,
  PlayCircle,
  Share2,
  Shield,
  ShoppingCart,
  Sparkles,
  Store,
  Target,
  TriangleAlert,
  Wallet,
  Workflow,
} from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { getLearningSubjectBySlug } from '../data/learningSubjectCatalog';
import {
  businessMarketLearningSlug,
  getBusinessMarketChapterGroups,
  getBusinessMarketOverview,
} from '../data/businessMarketLearning';

const iconMap = {
  wallet: Wallet,
  store: Store,
  'line-chart': LineChart,
  laptop: Laptop,
  sparkles: Sparkles,
  'candlestick-chart': CandlestickChart,
  'chart-spline': CandlestickChart,
  'share-2': Share2,
  package: Package,
  'piggy-bank': PiggyBank,
  shield: Shield,
  'triangle-alert': TriangleAlert,
  brain: Brain,
  'notebook-text': NotebookText,
  'clipboard-list': ClipboardList,
  activity: Activity,
  workflow: Workflow,
  'shopping-cart': ShoppingCart,
  infinity: Infinity,
};

function ChapterCard({ chapter }) {
  const Icon = iconMap[chapter.icon] || BookOpen;

  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-premium"
    >
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-48 overflow-hidden bg-slate-950">
          {chapter.thumbnail ? (
            <img src={chapter.thumbnail} alt={chapter.title} className="absolute inset-0 h-full w-full object-cover opacity-85" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/30 via-slate-950/40 to-indigo-950/75" />
          <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                {chapter.level}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Thumbnail</p>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight">{chapter.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">{chapter.quizFocus}</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {chapter.contentLanguage || 'English + Hinglish'}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Quiz included
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {chapter.progress}% progress
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">{chapter.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Chapter flow</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">Video + text + quiz</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Duration</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">{chapter.estimatedDuration}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span>Progress tracking</span>
              <span>{chapter.progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"
                style={{ width: `${chapter.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to={`/learning/chapters/${chapter.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Open chapter <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              Safe learning
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function LevelBlock({ title, description, chapters }) {
  const totalProgress = chapters.length
    ? Math.round(chapters.reduce((sum, chapter) => sum + Number(chapter.progress || 0), 0) / chapters.length)
    : 0;

  return (
    <section className="glass-card rounded-[2.25rem] p-5 sm:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{title}</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">{chapters.length} courses</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Average progress</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-950">{totalProgress}%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.slug} chapter={chapter} />
        ))}
      </div>
    </section>
  );
}

export default function BusinessMarketLearningPage() {
  const subject = getLearningSubjectBySlug(businessMarketLearningSlug);
  const overview = getBusinessMarketOverview(subject);
  const groups = getBusinessMarketChapterGroups(subject);

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[2.5rem] border border-blue-100 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-premium">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                <Sparkles className="h-4 w-4" />
                Business & Market Learning
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">{overview.title}</h1>
              <p className="max-w-2xl text-base leading-8 text-white/78 sm:text-lg">{overview.subtitle}</p>
              <p className="max-w-2xl text-sm leading-7 text-white/68">{overview.description}</p>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
                  {overview.contentLanguage}
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
                  Safe, educational, beginner friendly
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
                  Hinglish support ready
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/learning/subjects/${subject.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  Open full learning path <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={`/learning/chapters/${subject.chapters?.[0]?.slug || 'money-basics-for-students'}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Start with the first chapter <PlayCircle className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Total courses', value: overview.totalCourses },
                { label: 'Beginner', value: overview.beginnerCount },
                { label: 'Intermediate', value: overview.intermediateCount },
                { label: 'Advanced', value: overview.advancedCount },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.8rem] bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm text-white/65">{item.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{item.value}</p>
                </div>
              ))}
              <div className="rounded-[1.8rem] bg-white/10 p-5 backdrop-blur sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/65">Average progress</p>
                    <p className="mt-2 font-display text-3xl font-bold text-white">{overview.progressPercent}%</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-200">
                    <Target className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300" style={{ width: `${overview.progressPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'Reality-first',
              text: 'The content shows risks, losses and scam patterns before encouraging action.',
              icon: TriangleAlert,
            },
            {
              title: 'Hinglish friendly',
              text: 'Lessons can be read and managed in simple Hinglish for easier beginner onboarding.',
              icon: NotebookText,
            },
            {
              title: 'Progress tracking',
              text: 'Every course shows a progress bar so the learner always knows where they stand.',
              icon: Activity,
            },
            {
              title: 'Quiz ready',
              text: 'Each chapter has practice, DPP and test flow for learning with feedback.',
              icon: ClipboardList,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                whileHover={{ y: -4 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </motion.div>
            );
          })}
        </div>

        <section className="rounded-[2.25rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Daily learning series</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">
                Trading from Zero to Pro (365 Days Series)
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                A day-wise lecture path inside this category with video, notes, quiz, homework and a locked-to-unlocked timeline.
              </p>
            </div>
            <Link
              to="/business-market-learning/trading-from-zero-to-pro"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Open 365-day series <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {groups.levels.map((level) => (
          <LevelBlock
            key={level.key}
            title={level.title}
            description={level.description}
            chapters={level.chapters}
          />
        ))}

        <section className="space-y-4">
          <SectionTitle
            eyebrow="Special modules"
            title="Modules that keep the learning honest"
            subtitle="Reality Check, Psychology & Discipline, Case Studies and Practical Assignments are separate modules so the learner does not miss the safety layer."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {groups.specialModules.map((module) => (
              <motion.div
                key={module.key}
                whileHover={{ y: -4 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Special module</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">{module.title}</h3>
                  </div>
                  <div className="rounded-2xl bg-slate-950 p-3 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{module.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {module.chapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      to={`/learning/chapters/${chapter.slug}`}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      {chapter.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
            <SectionTitle
              eyebrow="Admin coverage"
              title="Editable in the existing admin panel"
              subtitle="Subjects, chapters, video URLs, descriptions, notes and quiz content all flow through the current admin storage."
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                'Add/Edit/Delete subject entries',
                'Upload or replace video URLs',
                'Update descriptions and order',
                'Edit notes and quiz questions',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
            <SectionTitle
              eyebrow="Safety note"
              title="Built to educate, not hype"
              subtitle="We keep this section clear about risk, discipline and realistic expectations."
            />
            <div className="mt-5 rounded-[1.75rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                <Shield className="h-4 w-4" />
                Reality first
              </div>
              <p className="mt-3 text-sm leading-7 text-white/80">
                The category is intended for learning only. It highlights risks, avoids fake promises and encourages careful decision-making.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
