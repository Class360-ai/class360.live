import { CheckCircle2, Lock, PlayCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function DayCard({ day }) {
  const cardClass = day.isCompleted
    ? 'border-emerald-200 bg-emerald-50/80'
    : day.isUnlocked
      ? 'border-blue-200 bg-white hover:-translate-y-0.5 hover:shadow-premium'
      : 'border-slate-200 bg-slate-50/80 opacity-90 blur-[0.2px]';

  return (
    <Link
      to={day.isUnlocked ? `/sequential-course/day/${day.dayNumber}` : '/sequential-course'}
      className={`rounded-[1.5rem] border p-4 shadow-sm transition ${cardClass}`}
      aria-disabled={!day.isUnlocked}
      onClick={(event) => {
        if (!day.isUnlocked) event.preventDefault();
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Day {day.dayNumber}</p>
          <h3 className="mt-2 font-display text-lg font-bold text-slate-950">{day.title}</h3>
        </div>
        {day.isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : day.isUnlocked ? (
          <PlayCircle className="h-5 w-5 text-blue-600" />
        ) : (
          <Lock className="h-5 w-5 text-slate-500" />
        )}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{day.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            day.isCompleted
              ? 'bg-emerald-100 text-emerald-700'
              : day.isUnlocked
                ? 'bg-blue-50 text-blue-700'
                : 'bg-slate-200 text-slate-600'
          }`}
        >
          {day.isCompleted ? 'Completed' : day.isUnlocked ? 'Unlocked' : 'Locked'}
        </span>
        {!day.isUnlocked ? <span className="text-xs font-medium text-slate-500">🔒 Complete previous day to unlock</span> : null}
      </div>
    </Link>
  );
}

export default function CourseDashboard({ days }) {
  const blocks = [];
  for (let index = 0; index < days.length; index += 30) {
    blocks.push(days.slice(index, index + 30));
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <section key={`dashboard-block-${index + 1}`} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Day sequence</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">
                Day {block[0]?.dayNumber} to Day {block[block.length - 1]?.dayNumber}
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {block.length} lessons
            </span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {block.map((day) => (
              <DayCard key={day.dayNumber} day={day} />
            ))}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            Locked days stay gated until the previous day is behavior-complete.
          </div>
        </section>
      ))}
    </div>
  );
}
