import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import DashboardMockup from '../components/DashboardMockup';
import { appMetrics, dashboardTips } from '../data/siteData';

export default function AppPreviewPage() {
  return (
    <div>
      <HeroBanner
        eyebrow="App preview"
        title="A student dashboard that turns data into action"
        subtitle="See how Class360 combines performance charts, weak-topic detection, and AI suggestions in a clean premium interface."
        primaryCta={
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
          >
            Try the Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        }
        secondaryCta={
          <Link
            to="/courses"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800"
          >
            Browse Courses
          </Link>
        }
      >
        <DashboardMockup />
      </HeroBanner>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Performance stats"
          title="Everything important in one glance"
          subtitle="The dashboard highlights progress, consistency, weak areas, and the next best action for the student."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {appMetrics.map((metric) => (
            <div key={metric.label} className="glass-card rounded-3xl p-6">
              <p className="text-sm font-semibold text-blue-700">{metric.label}</p>
              <p className="mt-3 font-display text-3xl font-bold text-slate-950">{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="AI highlights"
          title="Personalized guidance that feels useful, not noisy"
          subtitle="AI support emphasizes weak spots, test rhythm, and revision timing instead of generic messages."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {dashboardTips.map((tip) => (
            <div key={tip} className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-700">
              {tip}
            </div>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <div className="glass-card rounded-[2rem] p-6 sm:p-10">
          <SectionTitle
            eyebrow="Weak topic analysis"
            title="Know what to fix before the next test"
            subtitle="Students can see their low-confidence topics and get a guided path to improvement."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { topic: 'Vectors', status: 'Needs revision', bar: 'w-2/3' },
              { topic: 'Human Physiology', status: 'Moderate confidence', bar: 'w-3/4' },
              { topic: 'Chemical Bonding', status: 'Strong', bar: 'w-[88%]' },
              { topic: 'Permutation & Combination', status: 'Practice more', bar: 'w-1/2' },
            ].map((item) => (
              <div key={item.topic} className="rounded-3xl bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{item.topic}</h3>
                  <span className="text-sm text-white/70">{item.status}</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className={`h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 ${item.bar}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
