import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import StatsStrip from '../components/StatsStrip';
import { aboutPillars, impactStats } from '../data/siteData';

export default function AboutPage() {
  return (
    <div>
      <HeroBanner
        eyebrow="About Class360"
        title="A brand built to make serious preparation feel clear"
        subtitle="We exist to help students study with confidence, visibility, and a premium experience that supports every step of the journey."
        primaryCta={
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
          >
            Join Class360 <ArrowRight className="h-4 w-4" />
          </Link>
        }
        secondaryCta={
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800"
          >
            Speak to Team
          </Link>
        }
      >
        <div className="glass-card rounded-[2rem] p-6">
          <div className="rounded-[1.6rem] bg-white p-6">
            <p className="text-sm font-semibold text-blue-700">Brand story</p>
            <h3 className="mt-2 font-display text-3xl font-bold text-slate-950">
              From fragmented prep to one intelligent system
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Class360 was designed for students who want a premium study stack without the confusion of
              juggling multiple tools, random notes, and inconsistent coaching.
            </p>
          </div>
        </div>
      </HeroBanner>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Impact stats"
          title="Evidence that the platform is helping learners stay on track"
          subtitle="We focus on practical gains: consistency, accuracy, and better decision-making during preparation."
        />
        <div className="mt-8">
          <StatsStrip items={impactStats} />
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Our pillars"
          title="Why Class360 exists"
          subtitle="The brand is anchored in a simple belief: intelligent preparation should be accessible and measurable."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {aboutPillars.map((pillar) => (
            <div key={pillar.title} className="glass-card rounded-3xl p-6">
              <h3 className="font-display text-2xl font-bold text-slate-950">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container mt-16">
        <div className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-sm sm:p-10">
          <SectionTitle
            eyebrow="Premium positioning"
            title="Built like a modern Indian EdTech startup"
            subtitle="Clear outcomes, strong mentoring, app-style analytics, and conversion-focused journeys define the experience."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              'Trust-building result stories',
              'AI-powered study planning',
              'Mobile-first dashboard experience',
              'Strong academic and exam credibility',
            ].map((text) => (
              <div key={text} className="rounded-3xl bg-blue-50 p-5 text-sm leading-7 text-slate-700">
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
