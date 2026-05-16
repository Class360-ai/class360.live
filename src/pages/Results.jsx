import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Medal, Star, TrendingUp, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTASection from '../components/CTASection';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import {
  highlightedTopers,
  improvements,
  partnerInstitutions,
  resultStats,
  successStories,
  testimonials,
  toppers,
  topperFilters,
} from '../data/results';

function Avatar({ initials, size = 'h-16 w-16', accent = 'from-blue-600 via-indigo-600 to-cyan-500' }) {
  return (
    <div
      className={`${size} flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${accent} text-lg font-bold text-white shadow-glow`}
    >
      {initials}
    </div>
  );
}

function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {[...Array(count)].map((_, index) => (
        <Star key={index} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

export default function Results() {
  const [active, setActive] = useState('All');
  const filteredToppers = useMemo(() => {
    if (active === 'All') return toppers;
    return toppers.filter((item) => item.exam === active);
  }, [active]);

  return (
    <div>
      <HeroBanner
        eyebrow="Results that build trust"
        title="Results That Build Trust"
        subtitle="Thousands of students improving every day with Class360."
        primaryCta={
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
          >
            Start Your Journey <ArrowRight className="h-4 w-4" />
          </Link>
        }
        secondaryCta={
          <Link
            to="/courses"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:text-blue-700"
          >
            Explore Courses
          </Link>
        }
      >
        <div className="glass-card rounded-[2rem] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {resultStats.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -4 }}
                className="rounded-[1.5rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-700 p-5 text-white shadow-glow"
              >
                <p className="font-display text-3xl font-bold">{item.value}</p>
                <p className="mt-2 text-sm text-slate-200">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </HeroBanner>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Stats"
          title="Big numbers that make the story believable"
          subtitle="Clear, premium metrics help students and parents understand the scale of the platform."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {resultStats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 shadow-xl ring-1 ring-white/10"
            >
              <p className="font-display text-3xl font-bold text-white">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-cyan-200">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Partners"
          title="Trusted by leading schools, institutes, and coaching brands"
          subtitle="Strategic partnerships with premium education organizations show our enterprise-grade scale and credibility."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {partnerInstitutions.map((partner, index) => (
            <motion.article
              key={partner.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              whileHover={{ y: -5 }}
              className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 shadow-glow ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{partner.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{partner.type}</p>
                </div>
                <span className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-sm">
                  Partner
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-200">{partner.detail}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Top 3 students"
          title="The standout success stories"
          subtitle="Gold, silver, and bronze highlight cards help the best outcomes feel special and memorable."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {highlightedTopers.map((student) => (
            <motion.article
              key={student.name}
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className={`h-2 bg-gradient-to-r ${student.accent}`} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar initials={student.image} accent={student.accent} />
                    <div>
                      <p className="text-sm font-semibold text-blue-700">{student.exam}</p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-slate-950">{student.name}</h3>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                      student.medal === 'Gold'
                        ? 'bg-amber-50 text-amber-700'
                        : student.medal === 'Silver'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-orange-50 text-orange-700'
                    }`}
                  >
                    {student.medal}
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <p className="text-lg font-semibold text-slate-950">{student.rank}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{student.achievement}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{student.story}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Topper grid"
          title="More students making serious progress"
          subtitle="Filter by exam to browse a wider set of results and compare outcomes across categories."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          {topperFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === filter
                  ? 'bg-slate-950 text-white shadow-lg'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredToppers.map((student, index) => (
            <motion.article
              key={student.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              whileHover={{ y: -5 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <Avatar initials={student.image} size="h-14 w-14" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-blue-700">{student.exam}</p>
                      <h3 className="mt-1 font-display text-xl font-bold text-slate-950">{student.name}</h3>
                    </div>
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                      {student.rank}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{student.achievement}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Success stories"
          title="Detailed journeys that show real momentum"
          subtitle="These stories make the progress feel human, not just numerical."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {successStories.map((story) => (
            <motion.article
              key={story.name}
              whileHover={{ y: -5 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Avatar initials={story.name.split(' ').map((part) => part[0]).join('').slice(0, 2)} />
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-950">{story.name}</h3>
                  <p className="text-sm font-semibold text-blue-700">{story.background}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{story.journey}</p>
              <div className="mt-5 rounded-2xl bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Final result</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{story.result}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Performance improvement"
          title="Before and after cards that make growth obvious"
          subtitle="Show measurable change so visitors can immediately understand the value of consistent practice."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {improvements.map((item) => (
            <motion.article
              key={item.title}
              whileHover={{ y: -5 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-display text-xl font-bold text-slate-950">{item.title}</h3>
              <div className="mt-5 flex items-center gap-3">
                <div className="rounded-2xl bg-rose-50 px-4 py-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Before</p>
                  <p className="mt-1 text-2xl font-bold text-rose-700">{item.before}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">After</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700">{item.after}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.note}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Testimonials"
          title="Strong trust from real students"
          subtitle="Star ratings and concise feedback help the page feel credible and conversion-ready."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.name}
              whileHover={{ y: -4 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Stars count={testimonial.rating} />
              <p className="mt-4 text-sm leading-7 text-slate-600">"{testimonial.quote}"</p>
              <div className="mt-5">
                <h4 className="font-semibold text-slate-950">{testimonial.name}</h4>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <CTASection
          title="You could be the next success story"
          subtitle="Start with a free test or explore the course catalog to build your own result journey."
          primary={
            <Link
              to="/test-series"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            >
              Start Free Test
            </Link>
          }
          secondary={
            <Link
              to="/courses"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Explore Courses
            </Link>
          }
        />
      </section>
    </div>
  );
}
