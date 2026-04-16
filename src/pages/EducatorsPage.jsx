import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import { EducatorCard } from '../components/cards';
import { educators } from '../data/siteData';

export default function EducatorsPage() {
  return (
    <div>
      <HeroBanner
        eyebrow="Faculty excellence"
        title="Learn from educators who bring authority and momentum"
        subtitle="The Class360 faculty mix subject depth, strategy, and support so students feel confident during every prep phase."
        primaryCta={
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
          >
            View Courses <ArrowRight className="h-4 w-4" />
          </Link>
        }
        secondaryCta={
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800"
          >
            Request Demo Class
          </Link>
        }
      >
        <div className="glass-card rounded-[2rem] p-6">
          <div className="rounded-[1.6rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-6 text-white">
            <p className="text-sm text-white/70">Teaching outcomes matter</p>
            <h3 className="mt-2 font-display text-3xl font-bold">Expert guidance with classroom discipline</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['14+ yrs', 'Average faculty experience'],
                ['Live doubt support', 'Responsive learning help'],
                ['Rank-focused', 'Outcome-led teaching'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-4">
                  <p className="font-display text-2xl font-bold">{value}</p>
                  <p className="mt-1 text-sm text-white/75">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </HeroBanner>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Educators"
          title="Subject experts students keep coming back to"
          subtitle="Each mentor is selected for clarity, empathy, and the ability to convert effort into exam-ready confidence."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {educators.map((educator) => (
            <EducatorCard key={educator.name} educator={educator} />
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Subject expertise"
          title="Breadth across the most important exam areas"
          subtitle="From physics problem solving to banking speed, every core subject is covered by experienced mentors."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Quant', 'Reasoning', 'English', 'General Studies'].map(
            (subject) => (
              <div key={subject} className="glass-card rounded-3xl p-5 text-sm font-semibold text-slate-800">
                {subject}
              </div>
            ),
          )}
        </div>
      </section>

      <section className="section-container mt-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <SectionTitle
            eyebrow="Student trust points"
            title="Why learners trust the faculty experience"
            subtitle="The teaching style is designed to simplify complexity, keep momentum high, and make revision feel manageable."
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              'Clear explanations with exam-oriented shortcuts',
              'Consistent doubt clearing and revision checkpoints',
              'Balanced teaching for board confidence and competitive speed',
            ].map((text) => (
              <div key={text} className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
