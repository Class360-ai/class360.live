import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  BookOpenCheck,
  ChartLine,
  ClipboardList,
  GraduationCap,
  LifeBuoy,
  MessageCircle,
  PlayCircle,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CTASection from '../components/CTASection';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import { TestimonialCard } from '../components/cards';
import { isAuthenticated } from '../utils/authStorage';
import { performanceData, testimonials } from '../data/siteData';

const edtechInfrastructureItems = [
  {
    title: 'School technology partner',
    detail: 'Integrated ERP, digital classrooms, parent portals and operations workflows for schools and coaching.',
    icon: ShieldCheck,
  },
  {
    title: 'Coaching management system',
    detail: 'Batch, fee, exam and mentor workflows designed for coaching institutes and tuition centers.',
    icon: ClipboardList,
  },
  {
    title: 'Teacher panels',
    detail: 'Content uploads, lesson planning, attendance, and teaching analytics in one portal.',
    icon: GraduationCap,
  },
  {
    title: 'Student dashboards',
    detail: 'Personalized progress, AI insights, live schedules and practice pathways for every learner.',
    icon: Smartphone,
  },
  {
    title: 'Parent communication',
    detail: 'Notices, fee alerts, progress updates and real-time messages across devices.',
    icon: MessageCircle,
  },
  {
    title: 'AI-powered analytics',
    detail: 'Weak-topic signals, outcome forecasting, heatmaps and retention triggers for education leaders.',
    icon: BrainCircuit,
  },
  {
    title: 'Result & fee management',
    detail: 'Auto grades, fee tracking, receipts and institution compliance workflows.',
    icon: BadgeCheck,
  },
  {
    title: 'Attendance & notices',
    detail: 'Smart attendance, digital notices and automated reminders for every class.',
    icon: ShieldAlert,
  },
];

const testEcosystemCards = [
  {
    title: 'School Exams',
    highlights: ['Online test series', 'Offline OMR tests', 'AI result analysis'],
    icon: BookOpenCheck,
    gradient: 'from-sky-500 to-indigo-500',
  },
  {
    title: 'Coaching Tests',
    highlights: ['DPPs & live mock tests', 'Auto rank generation', 'Solution-ready analytics'],
    icon: Trophy,
    gradient: 'from-fuchsia-500 to-violet-500',
  },
  {
    title: 'Olympiads',
    highlights: ['Adaptive exam systems', 'Previous year papers', 'Performance heatmaps'],
    icon: Star,
    gradient: 'from-emerald-500 to-cyan-500',
  },
  {
    title: 'Competitive Exams',
    highlights: ['CUET, JEE, NEET readiness', 'Daily practice sheets', 'Auto solution generation'],
    icon: Target,
    gradient: 'from-orange-500 to-rose-500',
  },
];

const liveClassFeatures = [
  { title: 'HD live streaming', icon: PlayCircle },
  { title: 'Whiteboard tools', icon: BookOpenCheck },
  { title: 'Recorded lectures', icon: Smartphone },
  { title: 'AI-generated notes', icon: BrainCircuit },
  { title: 'Live chat & doubt solving', icon: MessageCircle },
  { title: 'Attendance tracking', icon: BadgeCheck },
  { title: 'Timetable scheduling', icon: ClipboardList },
  { title: 'Engagement analytics', icon: ChartLine },
  { title: 'Notifications & reminders', icon: Zap },
];

const notesEcosystemItems = [
  { title: 'AI-generated notes', icon: BrainCircuit },
  { title: 'Teacher-uploaded PDFs', icon: BookOpenCheck },
  { title: 'Topic-wise DPPs', icon: ClipboardList },
  { title: 'Personalized assignments', icon: Target },
  { title: 'Revision sheets', icon: ShieldCheck },
  { title: 'NCERT + PYQ integration', icon: GraduationCap },
  { title: 'Weak-topic recommendations', icon: ChartLine },
  { title: 'Smart bookmarks', icon: Sparkles },
];

const instituteGrowthStats = [
  { value: '10K+', label: 'Students managed' },
  { value: '50+', label: 'Institutes onboarded' },
  { value: '340+', label: 'Live classes hosted' },
  { value: '92%', label: 'Retention uplift' },
];

const aiFeatureItems = [
  { title: 'AI Tutor', icon: BrainCircuit },
  { title: 'AI Test Analysis', icon: ChartLine },
  { title: 'AI Study Planner', icon: Target },
  { title: 'AI Weakness Detection', icon: BadgeCheck },
  { title: 'AI Question Generator', icon: Zap },
  { title: 'AI Notes Generator', icon: BookOpenCheck },
  { title: 'AI Parent Insights', icon: MessageCircle },
  { title: 'AI Doubt Solver', icon: ShieldCheck },
  { title: 'AI Career Guidance', icon: GraduationCap },
];

const futureModules = [
  { title: 'School ERP', detail: 'Fees, attendance, timetable, homework, transport and report cards.', icon: ShieldCheck },
  { title: 'Teacher Ecosystem', detail: 'Analytics, content uploads, earnings dashboard and communities.', icon: GraduationCap },
  { title: 'Student Community', detail: 'Leaderboards, study groups, challenges and achievement badges.', icon: Sparkles },
  { title: 'Marketplace', detail: 'Books, courses, test packs and mentorship services.', icon: BookOpenCheck },
  { title: 'Career Ecosystem', detail: 'Counseling, internships, skill tracks and AI programs.', icon: Target },
  { title: 'Parent Dashboard', detail: 'Child progress, attendance, fees and AI reports.', icon: MessageCircle },
  { title: 'Regional Language Support', detail: 'Hindi, English and more Indian languages.', icon: Star },
];

const trustCounters = [
  { value: '10K+', label: 'Students' },
  { value: '50+', label: 'School partners' },
  { value: '340+', label: 'Live sessions weekly' },
  { value: '95%', label: 'Satisfaction' },
];

const heroStats = [
  { label: 'Institutions', value: '150+', icon: ShieldCheck },
  { label: 'AI Sessions', value: '1.5K+', icon: BrainCircuit },
  { label: 'Live Classes', value: '340+ weekly', icon: PlayCircle },
  { label: 'Growth ROI', value: '35%+', icon: ChartLine },
];

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

export default function HomePage() {
  const navigate = useNavigate();
  const handleEnroll = () => navigate(isAuthenticated() ? '/dashboard' : '/signup');

  return (
    <div className="overflow-hidden bg-slate-50 text-slate-900">
      <HeroBanner
        eyebrow="India’s Future Education Operating System"
        title="Powering the future of education for schools, coaching and students."
        subtitle="From live classes and AI tests to school management, coaching support, DPPs, analytics and smart learning tools — Class360 is India’s education infrastructure platform."
        primaryCta={
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-600 to-cyan-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_24px_60px_-24px_rgba(168,85,247,0.85)] transition hover:-translate-y-0.5"
          >
            Start Learning Free <ArrowRight className="h-4 w-4" />
          </Link>
        }
        secondaryCta={
          <Link
            to="/live-classes"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            Join Live Classes <PlayCircle className="h-4 w-4" />
          </Link>
        }
        footerContent={
          <div className="grid gap-4 sm:grid-cols-4">
            {heroStats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-fuchsia-500 via-violet-600 to-cyan-500 px-5 py-6 text-white shadow-xl backdrop-blur"
              >
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/80">
                  <item.icon className="h-4 w-4 text-white" />
                  {item.label}
                </div>
                <p className="mt-4 text-2xl font-semibold">{item.value}</p>
              </motion.div>
            ))}
          </div>
        }
      >
        <div className="relative mt-10">
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-4"
          >
            {heroStats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-[1.8rem] border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 p-5 text-white shadow-xl"
              >
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-slate-300">
                  <item.icon className="h-4 w-4 text-cyan-300" />
                  {item.label}
                </div>
                <p className="mt-4 text-3xl font-semibold">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </HeroBanner>

      <section className="section-container mt-20">
        <SectionTitle
          eyebrow="Smart testing"
          title="Smart Testing for Every Institution"
          subtitle="Online and offline exams, AI analysis, rank generation and performance heatmaps for schools, coaching and Olympiads."
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            {testEcosystemCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${card.gradient} p-6 text-white shadow-[0_40px_80px_-50px_rgba(15,23,42,0.85)]`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white shadow-[0_20px_50px_-30px_rgba(255,255,255,0.25)]">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{card.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-100/90">
                  {card.highlights.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white/80" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_45px_90px_-40px_rgba(15,23,42,0.85)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Performance heatmap</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">AI-driven result analysis in one view.</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white">Insights</span>
            </div>
            <div className="mt-8 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '0.75rem' }} />
                  <Area type="monotone" dataKey="score" stroke="#38bdf8" fill="url(#scoreGradient)" strokeWidth={3} fillOpacity={0.25} />
                  <Area type="monotone" dataKey="accuracy" stroke="#a855f7" fill="url(#accuracyGradient)" strokeWidth={3} fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-container mt-20">
        <SectionTitle
          eyebrow="Live class infrastructure"
          title="Run Professional Live Classes Effortlessly"
          subtitle="HD streaming, whiteboard tools, recorded playback, AI notes and engagement analytics for every batch."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {liveClassFeatures.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="group rounded-[2rem] border border-white/10 bg-slate-950/95 p-7 text-white shadow-[0_40px_80px_-50px_rgba(15,23,42,0.85)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-[0_20px_50px_-30px_rgba(56,189,248,0.45)]">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
              <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-200">LIVE</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-container mt-20">
        <div className="grid gap-12 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-2xl">
            <SectionTitle
              eyebrow="EdTech infrastructure"
              title="Complete Technical Support for Modern Education"
              subtitle="Class360 provides the technology backbone schools, coaching institutes, tuition centres, teachers and education organisations need to run online and offline learning together."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {edtechInfrastructureItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-6 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.75)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500 text-white shadow-[0_20px_60px_-30px_rgba(56,189,248,0.5)]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_45px_90px_-40px_rgba(15,23,42,0.8)]"
          >
            <div className="absolute -right-10 top-10 h-28 w-28 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute -left-10 bottom-12 h-28 w-28 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Education operating system</p>
                  <h3 className="mt-3 text-3xl font-semibold text-white">Connected institution panels for every team.</h3>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-200">Live</span>
              </div>

              <div className="mt-8 grid gap-4">
                {['School ERP', 'Coaching CRM', 'Teacher Portal', 'Parent Connect'].map((label) => (
                  <div key={label} className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 text-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.75)]">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
                    <p className="mt-4 text-lg font-semibold">{label} workflows, dashboards and automation.</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-container mt-20">
        <SectionTitle
          eyebrow="DPP & notes"
          title="Smart Notes & Practice Engine"
          subtitle="AI-generated notes, DPPs, assignments, revision sheets and weak-topic practice on one platform."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {notesEcosystemItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 text-white shadow-[0_40px_80px_-50px_rgba(15,23,42,0.8)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-lg font-semibold">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-container mt-20">
        <div className="grid gap-12 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 text-white shadow-[0_45px_90px_-40px_rgba(15,23,42,0.8)]">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Helping institutions scale faster</p>
            <h2 className="mt-4 text-3xl font-semibold">Manage students, improve retention and automate operations.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
              Class360 turns every institution into a digital education enterprise with operations, analytics, exams and engagement in one platform.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                'Student management at scale',
                'Retention and outcome growth',
                'Digital operations automation',
                'Hybrid class & exam workflows',
              ].map((item) => (
                <div key={item} className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {instituteGrowthStats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-xl"
              >
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">{item.label}</p>
                <p className="mt-4 text-4xl font-bold">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container mt-20">
        <SectionTitle
          eyebrow="AI features"
          title="AI Built for Education"
          subtitle="Every institution gets intelligent tutoring, diagnostics, recommendations and growth support."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {aiFeatureItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 text-white shadow-[0_40px_80px_-50px_rgba(15,23,42,0.8)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-[0_20px_50px_-30px_rgba(56,189,248,0.45)]">
                <item.icon className="h-6 w-6" />
              </div>
              <p className="mt-5 text-lg font-semibold">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-container mt-20">
        <SectionTitle
          eyebrow="Future-ready modules"
          title="Built to scale from classrooms to campuses"
          subtitle="Class360 is structured for future expansion across ERP, teacher ecosystems, student communities, marketplaces, career services and multilingual support."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {futureModules.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 text-white shadow-[0_40px_80px_-50px_rgba(15,23,42,0.8)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_20px_50px_-30px_rgba(56,189,248,0.45)]">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <CTASection
        title="Move beyond a student app. Build India’s education operating system."
        subtitle="Class360 unifies school operations, coaching management, AI learning, assessments, notes, parent engagement and future-ready modules in one premium platform."
        primary={
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
          >
            Start your platform
          </Link>
        }
        secondary={
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            Book a demo
          </Link>
        }
      />
    </div>
  );
}
