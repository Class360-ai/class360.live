import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CTASection from '../components/CTASection';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import StatsStrip from '../components/StatsStrip';
import { EmptyStateCard, FilterChips, TestSeriesCard } from '../components/catalog';
import { difficultyBuckets, testSeriesFilters, testSeriesItems, testSeriesStats } from '../data/testSeries';
import { difficultyOptions, subjectOptions } from '../data/questions';
import { TEST_SETUP_KEY } from '../utils/testFlow';
import { canTakeFullTestToday, getUsageLimitMessage, isPremiumUser, requestUpgrade } from '../utils/premium';

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

  const scholarshipTests = useMemo(
    () => testSeriesItems.filter((item) => item.category === 'Scholarship'),
    [],
  );

  const freePracticeTests = useMemo(
    () => testSeriesItems.filter((item) => item.category === 'Free Practice'),
    [],
  );

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

  const launchTest = (test) => {
    if (!test?.subjectKey || !test?.difficulty) return;
    if (!isPremiumUser() && !canTakeFullTestToday()) {
      requestUpgrade(`${getUsageLimitMessage()} Upgrade to Premium for unlimited AI tests.`);
      return;
    }
    const setup = { subject: test.subjectKey, difficulty: test.difficulty };
    sessionStorage.setItem(TEST_SETUP_KEY, JSON.stringify(setup));
    navigate('/test', { state: setup });
  };

  const startCustomTest = () => {
    if (!selectedSubject || !selectedDifficulty) return;
    if (!isPremiumUser() && !canTakeFullTestToday()) {
      requestUpgrade(`${getUsageLimitMessage()} Upgrade to Premium for unlimited AI tests.`);
      return;
    }
    const setup = { subject: selectedSubject, difficulty: selectedDifficulty };
    sessionStorage.setItem(TEST_SETUP_KEY, JSON.stringify(setup));
    navigate('/test', { state: setup });
  };

  return (
    <div>
      <HeroBanner
        eyebrow="Practice test flow"
        title="Take premium mock tests built for real exam pressure"
        subtitle="Explore scholarship tests, free practice, and difficulty-based mocks designed to sharpen accuracy and confidence."
        primaryCta={
          <button
            type="button"
            onClick={() => scrollToId('featured-tests')}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
          >
            Explore Tests <ArrowRight className="h-4 w-4" />
          </button>
        }
        secondaryCta={
          <button
            type="button"
            onClick={() => scrollToId('practice-builder')}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            Build Custom Test <Sparkles className="h-4 w-4" />
          </button>
        }
      >
        <div className="glass-card rounded-[2rem] p-6">
          <div className="rounded-[1.6rem] bg-slate-950 p-6 text-white shadow-premium">
            <p className="text-sm text-white/60">What students get</p>
            <h3 className="mt-2 font-display text-3xl font-bold">Scholarship, speed, and smart review</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                'Timed questions with one-by-one flow',
                'Weak topic analysis after submit',
                'Clean results and next-step suggestions',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm text-white/80">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 p-4">
              <BadgeCheck className="h-5 w-5 text-cyan-300" />
              <p className="text-sm text-white/80">Premium practice designed for Indian school and competitive exam prep.</p>
            </div>
          </div>
        </div>
      </HeroBanner>

      <section className="section-container mt-14">
        <StatsStrip items={testSeriesStats} />
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
          eyebrow="Test series cards"
          title="A premium catalog of tests students can start instantly"
          subtitle="Each card shows the mode, difficulty, duration, and the kind of pressure it is built to simulate."
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
          eyebrow="Scholarships"
          title="Scholarship tests that feel competitive and rewarding"
          subtitle="Use these tests to benchmark ability, build confidence, and unlock fee support opportunities."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {scholarshipTests.map((test) => (
            <TestSeriesCard key={test.id} test={test} onStart={launchTest} />
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Free practice"
          title="Free practice tests to keep the habit loop alive"
          subtitle="Short, high-signal practice sets that students can use every day without friction."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {freePracticeTests.map((test) => (
            <TestSeriesCard key={test.id} test={test} onStart={launchTest} />
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="By difficulty"
          title="Mock tests by difficulty level"
          subtitle="Pick a level that matches your current readiness and slowly increase pressure."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {difficultyMockCards.map((bucket) => (
            <motion.article
              key={bucket.difficulty}
              whileHover={{ y: -5 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                {bucket.title}
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-slate-950">
                {bucket.sample ? bucket.sample.title : bucket.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{bucket.note}</p>
              {bucket.sample ? (
                <>
                  <div className="mt-5 flex items-center gap-3 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">
                      {bucket.sample.questions} questions
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">{bucket.sample.duration}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => launchTest(bucket.sample)}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Start {bucket.title} <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              ) : null}
            </motion.article>
          ))}
        </div>
      </section>

      <section id="practice-builder" className="section-container mt-16">
        <SectionTitle
          eyebrow="Custom test builder"
          title="Choose a subject and difficulty to launch your own practice test"
          subtitle="This keeps the current test flow fast, simple, and ready for serious revision."
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
                      active
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-slate-200 bg-white hover:border-blue-200'
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
            <h3 className="font-display text-2xl font-bold text-slate-950">2. Choose a difficulty</h3>
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
                      active
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : 'border-slate-200 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                      {difficulty.label}
                    </p>
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

      <div className="mt-16">
        <CTASection
          title="Study anytime. Track everything. Improve daily."
          subtitle="Use premium practice tests to turn daily effort into visible score growth."
          primary={
            <button
              type="button"
              onClick={() => scrollToId('practice-builder')}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            >
              Build a Test
            </button>
          }
          secondary={
            <button
              type="button"
              onClick={() => scrollToId('featured-tests')}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              View All Tests
            </button>
          }
        />
      </div>
    </div>
  );
}
