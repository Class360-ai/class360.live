import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <section className="section-container flex min-h-[calc(100vh-5rem)] items-center py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-premium">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Welcome back</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Continue your preparation journey</h1>
          <p className="mt-4 text-sm leading-7 text-white/75">
            Pick up where you left off with personalized analytics, live classes, and your latest test insights.
          </p>
        </div>
        <form className="glass-card rounded-[2rem] p-8">
          <h2 className="font-display text-3xl font-bold text-slate-950">Log in</h2>
          <div className="mt-6 space-y-4">
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400" placeholder="Email or phone" />
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-400" placeholder="Password" type="password" />
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white">
              Log In <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-5 text-sm text-slate-600">
            New to Class360?{' '}
            <Link to="/signup" className="font-semibold text-blue-700">
              Create your account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
