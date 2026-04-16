import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  return (
    <section className="section-container flex min-h-[calc(100vh-5rem)] items-center py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_0.95fr]">
        <form className="glass-card rounded-[2rem] p-8">
          <h1 className="font-display text-4xl font-bold text-slate-950">Create your Class360 account</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Start with a premium learning flow designed to match your exam goal and study pace.
          </p>
          <div className="mt-6 grid gap-4">
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400" placeholder="Full name" />
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400" placeholder="Email" />
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400" placeholder="Phone number" />
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400" placeholder="Create password" type="password" />
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow">
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-700">
              Log in
            </Link>
          </p>
        </form>
        <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-8 text-white shadow-premium">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Why students join</p>
          <h2 className="mt-4 font-display text-4xl font-bold">Every account starts with a clear plan</h2>
          <ul className="mt-6 space-y-3 text-sm text-white/85">
            <li className="rounded-2xl bg-white/10 px-4 py-3">Personalized learning path from day one</li>
            <li className="rounded-2xl bg-white/10 px-4 py-3">Access to live classes, quizzes, and tests</li>
            <li className="rounded-2xl bg-white/10 px-4 py-3">Analytics that show what to do next</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
