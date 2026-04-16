import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import { TestCard } from '../components/cards';
import { scholarshipTests, testCategories } from '../data/siteData';

export default function TestSeriesPage() {
  return (
    <div>
      <HeroBanner
        eyebrow="Test series"
        title="Mock tests and scholarship exams built for real progress"
        subtitle="Practice with pressure, discover weak spots, and build exam rhythm with structured test journeys."
        primaryCta={
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
          >
            Take a Free Test <ArrowRight className="h-4 w-4" />
          </Link>
        }
        secondaryCta={
          <Link
            to="/results"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800"
          >
            See Success Stories
          </Link>
        }
      >
        <div className="glass-card rounded-[2rem] p-6">
          <div className="rounded-[1.6rem] bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white">
            <p className="text-sm text-white/65">Daily practice engine</p>
            <h3 className="mt-2 font-display text-3xl font-bold">Tests that teach, not just score</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Accuracy boost', 'Targeted question logic'],
                ['Rank estimate', 'Compare against cohort'],
                ['Weak topic map', 'Revision becomes obvious'],
                ['Scholarship alert', 'Earn fee waivers'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-white/70">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </HeroBanner>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Test categories"
          title="Practice formats for every prep stage"
          subtitle="Mix quick quizzes, chapter tests, and full mocks to train both speed and endurance."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {testCategories.map((item) => (
            <TestCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Scholarship tests"
          title="Compete for scholarships with real exam-style assessments"
          subtitle="Scholarship events help students discover where they stand and earn support for premium batches."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {scholarshipTests.map((test) => (
            <div key={test.title} className="glass-card rounded-3xl p-6">
              <p className="text-sm font-semibold text-blue-700">{test.date}</p>
              <h3 className="mt-3 font-display text-xl font-bold text-slate-950">{test.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{test.prize}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Quiz cards"
          title="Short bursts that keep the momentum alive"
          subtitle="A premium mix of quick checks, challenge rounds, and diagnostic quizzes for all major exams."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            'Formula Recall Sprint',
            'Current Affairs Quickfire',
            'NCERT Biology Flash Test',
          ].map((title) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Quiz</p>
              <h3 className="mt-3 font-display text-xl font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Timed burst practice with instant explanation and accuracy feedback.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Test benefits"
          title="Why the test engine feels premium"
          subtitle="Every test output is designed to help the learner understand exactly what changed and what to do next."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            'Chapter-wise and syllabus-wise control',
            'Instant scoring with rank comparison',
            'Detailed performance reports',
            'AI recommendations for revision',
          ].map((text) => (
            <div key={text} className="glass-card rounded-3xl p-6 text-sm leading-7 text-slate-700">
              {text}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
