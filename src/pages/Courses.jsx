import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CTASection from '../components/CTASection';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import StatsStrip from '../components/StatsStrip';
import { CourseCard, EmptyStateCard, FilterChips } from '../components/catalog';
import { isAuthenticated } from '../utils/authStorage';
import {
  courseBenefits,
  courseFaqItems,
  courseFilters,
  courseTrustStats,
  featuredCourses,
} from '../data/courses';

function HighlightCard({ title, description, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-[2rem] p-6"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </motion.div>
  );
}

export default function Courses() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCourses = useMemo(() => {
    if (activeFilter === 'All') return featuredCourses;
    return featuredCourses.filter((course) => course.exam === activeFilter);
  }, [activeFilter]);

  const handleEnroll = () => {
    navigate(isAuthenticated() ? '/dashboard' : '/signup');
  };

  return (
    <div>
      <HeroBanner
        eyebrow="Premium course catalog"
        title="Choose the right learning track for your target exam"
        subtitle="Structured programs for serious prep, with live teaching, mock tests, and analytics that keep every student moving forward."
        primaryCta={
          <button
            type="button"
            onClick={handleEnroll}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
          >
            Start Learning <ArrowRight className="h-4 w-4" />
          </button>
        }
        secondaryCta={
          <Link
            to="/test-series"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:text-blue-700"
          >
            Explore Test Series <PlayCircle className="h-4 w-4" />
          </Link>
        }
      >
        <div className="glass-card rounded-[2rem] p-6">
          <div className="rounded-[1.6rem] bg-slate-950 p-6 text-white shadow-premium">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white/60">Course planning view</p>
                <h3 className="mt-2 font-display text-3xl font-bold">Study with a clear roadmap</h3>
              </div>
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                4.8 rating
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Live classes and revision loops',
                'Weekly tests and dashboard insights',
                'Hindi + English support',
                'AI-based weak topic guidance',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm text-white/80">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 p-4">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
              <p className="text-sm text-white/80">Trusted by students preparing for school boards and competitive exams.</p>
            </div>
          </div>
        </div>
      </HeroBanner>

      <section className="section-container mt-14">
        <StatsStrip items={courseTrustStats} />
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Filters"
          title="Find the exact course track you need"
          subtitle="Use the exam chips to move quickly from browsing to the most relevant batch."
        />
        <div className="mt-6">
          <FilterChips items={courseFilters} active={activeFilter} onChange={setActiveFilter} />
        </div>
      </section>

      <section className="section-container mt-12">
        <SectionTitle
          eyebrow="Featured courses"
          title="High-conversion programs with premium student support"
          subtitle="Each course is built around live teaching, practice loops, and review systems that improve results over time."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {filteredCourses.length ? (
            filteredCourses.map((course) => <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />)
          ) : (
            <div className="lg:col-span-2">
              <EmptyStateCard
                title="No matching courses right now"
                description="Try another exam filter or go back to the full catalog to explore all premium learning tracks."
                actionLabel="Show all courses"
                onAction={() => setActiveFilter('All')}
              />
            </div>
          )}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Why these courses"
          title="Built to feel premium, structured, and student-friendly"
          subtitle="The experience focuses on clarity, confidence, and a stronger habit loop for Indian students."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courseBenefits.map((item) => (
            <HighlightCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="FAQ"
          title="Questions students usually ask before enrolling"
          subtitle="A quick overview to reduce hesitation and make the next step easier."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {courseFaqItems.map((item) => (
            <motion.article
              key={item.question}
              whileHover={{ y: -4 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-display text-xl font-bold text-slate-950">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <div className="mt-16">
        <CTASection
          title="Ready to start your exam prep with more clarity?"
          subtitle="Join a learning path that feels premium, organized, and built to convert effort into results."
          primary={
            <button
              type="button"
              onClick={handleEnroll}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            >
              Enroll Now <ArrowRight className="h-4 w-4" />
            </button>
          }
          secondary={
            <Link
              to="/test-series"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              Try a Test First <Sparkles className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    </div>
  );
}
