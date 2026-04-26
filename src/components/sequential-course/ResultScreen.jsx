import { ArrowRight, RotateCcw, Target, TimerReset, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResultScreen({ result, dayNumber, passed, nextDayNumber, onRetry }) {
  if (!result) return null;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Quiz result</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Day Completed!</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Score</p>
          <p className="mt-2 font-display text-3xl font-bold text-slate-950">{result.score}%</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Accuracy</p>
          <p className="mt-2 font-display text-3xl font-bold text-slate-950">{result.accuracy}%</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <TimerReset className="h-4 w-4" />
            <p className="text-sm">Time taken</p>
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-slate-950">{result.timeTaken}s</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Target className="h-4 w-4" />
            <p className="text-sm">Weak areas</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-950">
            {result.weakAreas.length ? result.weakAreas.join(', ') : 'No weak areas detected'}
          </p>
        </div>
      </div>
      <div className="mt-5 rounded-[1.5rem] bg-emerald-50 p-4 text-emerald-700">
        <p className="text-sm font-semibold">Day {nextDayNumber} Unlocked</p>
        <p className="mt-1 text-sm">Your next lesson is now ready automatically.</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={dayNumber >= 365 ? '/sequential-course' : `/sequential-course/day/${nextDayNumber}`}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Start Next Day <ArrowRight className="h-4 w-4" />
        </Link>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
          <TrendingUp className="h-4 w-4" />
          Auto-tracked progression
        </div>
      </div>
    </div>
  );
}
