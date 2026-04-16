import { useState } from 'react';
import { ArrowRight, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import SectionTitle from '../components/SectionTitle';
import { faqItems } from '../data/siteData';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  return (
    <div>
      <HeroBanner
        eyebrow="Contact"
        title="Talk to the Class360 team"
        subtitle="Get course guidance, demo class details, and support through a clean, fast contact experience."
        primaryCta={
          <a
            href="https://wa.me/919876543210"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg"
          >
            WhatsApp Us <MessageCircle className="h-4 w-4" />
          </a>
        }
        secondaryCta={
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800"
          >
            Create Account <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        <div className="glass-card rounded-[2rem] p-6">
          <div className="rounded-[1.6rem] bg-slate-950 p-6 text-white">
            <h3 className="font-display text-3xl font-bold">Counsellor support in minutes</h3>
            <div className="mt-6 space-y-4 text-sm text-white/80">
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-cyan-300" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-cyan-300" />
                support@class360.live
              </p>
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-cyan-300" />
                Bengaluru, Karnataka, India
              </p>
            </div>
          </div>
        </div>
      </HeroBanner>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="Contact form"
          title="Tell us what you need"
          subtitle="A counsellor can help with course selection, demo classes, scholarship tests, and app access."
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <form className="glass-card rounded-[2rem] p-6 sm:p-8">
            <div className="grid gap-4">
              <input
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <input
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
              <textarea
                rows="5"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
                placeholder="Tell us about your exam goal"
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              />
              <button
                type="button"
                className="rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Request Callback
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <a
              href="https://wa.me/919876543210"
              className="flex items-center justify-between rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-5 py-4 text-emerald-900 transition hover:-translate-y-1"
            >
              <span className="font-semibold">WhatsApp for fast support</span>
              <MessageCircle className="h-5 w-5" />
            </a>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-display text-xl font-bold text-slate-950">Office address</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Class360 Learning Labs, 4th Floor, Innovation Tower, Indiranagar, Bengaluru, Karnataka 560038
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-display text-xl font-bold text-slate-950">Email support</h3>
              <p className="mt-2 text-sm text-slate-600">support@class360.live</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container mt-16">
        <SectionTitle
          eyebrow="FAQ"
          title="Quick answers before you reach out"
          subtitle="Use this section to resolve common questions and keep the conversion path smooth."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {faqItems.map((faq) => (
            <details key={faq.question} className="glass-card rounded-3xl p-6">
              <summary className="cursor-pointer list-none font-semibold text-slate-950">{faq.question}</summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
