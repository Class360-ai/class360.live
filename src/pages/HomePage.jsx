import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  ClipboardList,
  GraduationCap,
  PlayCircle,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CTASection from '../components/CTASection';
import DashboardMockup from '../components/DashboardMockup';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import StatsStrip from '../components/StatsStrip';
import { TestimonialCard, TestCard } from '../components/cards';
import CourseCard from '../components/catalog/CourseCard';
import { isAuthenticated } from '../utils/authStorage';
import { featuredCourses, courseTrustStats } from '../data/courses';
import {
  appMetrics,
  examCategories,
  homepageTopperHighlights,
  performanceData,
  stats,
  testCategories,
  testimonials,
  whyChoose,
} from '../data/siteData';

const sectionGap = 'mt-20';

const educatorCards = [
  {
    name: 'Dr. Priya Nair',
    subject: 'Physics',
    experience: '14 years',
    credibility: 'Mentored 120+ under-100 rankers',
    initials: 'PN',
  },
  {
    name: 'Prof. Sanjay Mehra',
    subject: 'Chemistry',
    experience: '17 years',
    credibility: 'Known for exam-ready revision notes',
    initials: 'SM',
  },
  {
    name: 'Dr. Kavita Reddy',
    subject: 'Biology',
    experience: '12 years',
    credibility: 'Helped students cross 650+ in NEET',
    initials: 'KR',
  },
  {
    name: 'Aman Gupta',
    subject: 'Quant & Reasoning',
    experience: '10 years',
    credibility: 'Creates speed drills used by thousands daily',
    initials: 'AG',
  },
];

const liveLearningCards = [
  {
    title: 'Live Classes',
    detail: 'Structured batches with bilingual teaching and instant doubt support.',
    type: 'Class Room',
  },
  {
    title: 'Quizzes',
    detail: 'Short practice bursts that keep recall active every single day.',
    type: 'Daily Practice',
  },
  {
    title: 'Mock Tests',
    detail: 'Pressure-style tests with analytics that show exactly where to improve.',
    type: 'Exam Simulation',
  },
  {
    title: 'Suno & Repeat',
    detail: 'Voice-first lessons across English, Hindi, Maths, Science, and Social Science.',
    type: 'Voice Learning',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate(isAuthenticated() ? '/dashboard' : '/signup');
  };

  return (
    <div>
      <HeroBanner
        eyebrow="Free AI Test - Limited Time"
        title="Stop Studying Hard. Start Studying Smart."
        subtitle="Take a free AI-powered test, identify your weak topics, and improve your score in just 30 days."
        primaryCta={
          <Link
            to="/test-series"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(37,99,235,0.85)]"
          >
            Take Free AI Test <ArrowRight className="h-4 w-4" />
          </Link>
        }
        secondaryCta={
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
          >
            Explore Courses <PlayCircle className="h-4 w-4" />
          </Link>
        }
        footerContent={
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {['50,000+ students', '10,000+ tests taken', '500+ selections'].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { name: 'Rahul', before: '52%', after: '84%' },
                { name: 'Sneha', before: '61%', after: '89%' },
                { name: 'Aman', before: '48%', after: '78%' },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-[1.5rem] border border-emerald-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Improved
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm font-semibold text-rose-500">{item.before}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-semibold text-emerald-600">{item.after}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: item.after }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        }
      >
        <div className="space-y-4 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-4 shadow-premium">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            Your AI Study Coach
          </div>
          <div className="rounded-[1.8rem] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_-30px_rgba(37,99,235,0.6)] backdrop-blur">
            <DashboardMockup />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['Weak Topic Detection', 'Smart Suggestions', 'Daily Plan'].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </HeroBanner>

      <section className="section-container mt-8">
        <div className="glass-card rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Learning System</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Class 6 Science learning path</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Start the new study flow with video lessons, notes, practice, DPP, tests, and AI doubt solving.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/learning"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Start Learning <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/learning/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
              >
                Learning Dashboard <Sparkles className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container mt-16">
        <StatsStrip items={stats} />
      </section>

      <section className={`${sectionGap} section-container`}>
        <SectionTitle
          eyebrow="Exam categories"
          title="Built for every serious learner"
          subtitle="From school foundations to top competitive exams, Class360 keeps the learning path structured and measurable."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {examCategories.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-[2rem] p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-slate-950">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className={`${sectionGap} section-container`}>
        <SectionTitle
          eyebrow="Live learning"
          title="Practice, quiz, and test in a way that feels intentional"
          subtitle="Students move through learning loops that keep the experience active, structured, and conversion-friendly."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testCategories.map((item) => (
            <TestCard key={item.title} item={item} />
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {liveLearningCards.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -4 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">{item.type}</p>
              <h3 className="mt-3 font-display text-2xl font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex justify-start">
          <Link
            to="/voice-learning"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Open Suno & Repeat <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className={`${sectionGap} section-container`}>
        <SectionTitle
          eyebrow="Why Class360"
          title="Everything a modern exam prep student expects"
          subtitle="Premium content, strong mentorship, and AI-powered clarity reduce confusion and build consistency."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {whyChoose.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-[2rem] p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className={`${sectionGap} section-container`}>
        <SectionTitle
          eyebrow="Featured courses"
          title="High-converting courses for every target exam"
          subtitle="Programs are structured around live teaching, practice loops, and review systems that make progress visible."
        />
        <div className="mt-6">
          <StatsStrip items={courseTrustStats} />
        </div>
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id || course.title} course={course} onEnroll={handleEnroll} />
          ))}
        </div>
      </section>

      <section className={`${sectionGap} section-container`}>
        <SectionTitle
          eyebrow="Results and toppers"
          title="Trust built through real outcomes"
          subtitle="These sample wins reflect the kind of progress students expect when practice, mentoring, and analytics work together."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {homepageTopperHighlights.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-[2rem] p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700">{item.exam}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-slate-950">{item.name}</h3>
                </div>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-white">
                  {item.rank}
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-700">{item.score}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.achievement}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { value: '50K+', label: 'students' },
            { value: '10K+', label: 'tests taken' },
            { value: '500+', label: 'selections' },
            { value: '95%', label: 'satisfaction' },
          ].map((item) => (
            <div key={item.label} className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
              <p className="font-display text-3xl font-bold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${sectionGap} section-container`}>
        <SectionTitle
          eyebrow="Educators"
          title="Faculty students trust for results"
          subtitle="Experienced mentors, subject depth, and credibility points help convert interest into confidence."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {educatorCards.map((educator, index) => (
            <motion.div
              key={educator.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-[2rem] p-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-lg font-bold text-white shadow-glow">
                  {educator.initials}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-950">{educator.name}</h3>
                  <p className="text-sm font-semibold text-blue-700">{educator.subject}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <GraduationCap className="h-4 w-4 text-cyan-600" />
                <span>{educator.experience} experience</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{educator.credibility}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={`${sectionGap} section-container`}>
        <SectionTitle
          eyebrow="Student dashboard preview"
          title="A modern analytics view that makes progress obvious"
          subtitle="See your learning rhythm, weak topics, and improvement trend in a clean visual preview."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {appMetrics.map((metric) => (
              <div key={metric.label} className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-600">{metric.label}</p>
                  <BadgeCheck className="h-4 w-4 text-blue-600" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-slate-950">{metric.value}</p>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-[2rem] p-5">
            <div className="rounded-[1.6rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Weekly performance</p>
                  <h3 className="font-display text-2xl font-bold">Score trend preview</h3>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
                  Improving
                </span>
              </div>
              <div className="mt-5 h-64 rounded-[1.5rem] bg-white p-4 text-slate-900">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="homeScoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.34} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#2563eb" fill="url(#homeScoreGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">Weak topics</p>
                  <p className="mt-2 text-lg font-semibold">Vectors, Human Physiology</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">Recommendation</p>
                  <p className="mt-2 text-lg font-semibold">Revise today + 1 diagnostic test</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${sectionGap} section-container`}>
        <SectionTitle
          eyebrow="Testimonials"
          title="Students feel the difference fast"
          subtitle="Authentic stories from Indian learners who wanted structure, speed, and better outcomes."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} testimonial={item} />
          ))}
        </div>
      </section>

      <section className={`${sectionGap} section-container`}>
        <CTASection
          title="Study Anytime. Track Everything. Improve Daily."
          subtitle="Download the app experience or start with a free test and get the Class360 learning rhythm in your pocket."
          primary={
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            >
              Download App
            </Link>
          }
          secondary={
            <Link
              to="/test-series"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Start Free Test
            </Link>
          }
        />
      </section>
    </div>
  );
}
