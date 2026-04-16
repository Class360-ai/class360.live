import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Target } from 'lucide-react';
import { getRevisionCalendar, getRevisionPlan, getStudyCoachSnapshot } from '../utils/planGenerator';

export default function ChapterRevisionPlan({
  attempts = [],
  onPracticeWeakTopics,
  onTakeFullTest,
  onStartStudyCoach,
}) {
  const plan = getRevisionPlan(attempts);
  const calendar = getRevisionCalendar(attempts);
  const coach = getStudyCoachSnapshot(attempts);

  const handleStartTask = (task) => {
    if (task.type === 'Test') {
      onTakeFullTest?.();
      return;
    }
    onPracticeWeakTopics?.();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-premium sm:p-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            <Target className="h-4 w-4" />
            Chapter-wise revision plan
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950">
            Turn mistakes into today&apos;s revision action list
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {plan.focusTopics.length
              ? 'This plan is built from your latest weak topics so the next session stays highly focused.'
              : 'No mistake pattern is visible yet, so we are giving you a strong default revision routine.'}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Study slot</p>
              <p className="mt-2 font-display text-xl font-bold text-slate-950">{coach.slot.label}</p>
              <p className="mt-1 text-sm text-slate-600">{coach.slot.time}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Focus score</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-950">{coach.focusScore}%</p>
              <p className="mt-1 text-sm text-slate-600">Your current revision readiness</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Primary chapter</p>
              <p className="mt-2 font-display text-xl font-bold text-slate-950">{coach.primaryChapter}</p>
              <p className="mt-1 text-sm text-slate-600">Start with the highest-impact topic</p>
            </div>
          </div>
        </div>
        <div className="rounded-[1.5rem] bg-slate-950 px-4 py-3 text-white shadow-premium">
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">Focus subject</p>
          <p className="mt-1 font-display text-2xl font-bold">{plan.subject}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {plan.tasks.map((task) => (
          <motion.article
            key={task.id}
            whileHover={{ y: -4 }}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{task.type}</p>
                <h3 className="mt-2 font-display text-xl font-bold text-slate-950">{task.topic}</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {task.questions} Qs
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{task.focus}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <Clock3 className="h-3.5 w-3.5" />
              {task.estimateMinutes || 15} min estimate
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <BookOpen className="h-4 w-4 text-cyan-600" />
              <span>Study, solve, and review</span>
            </div>
            <button
              type="button"
              onClick={() => handleStartTask(task)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Start task <ArrowRight className="h-4 w-4" />
            </button>
          </motion.article>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onStartStudyCoach}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
        >
          Start Study Coach <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onPracticeWeakTopics}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5"
        >
          Practice weak topics <CheckCircle2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onTakeFullTest}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
        >
          Take a full test <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">7-day rhythm</p>
            <h3 className="mt-1 font-display text-xl font-bold text-slate-950">Recent study streak strip</h3>
          </div>
          <p className="text-sm text-slate-500">Filled days mean you showed up</p>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {calendar.map((day) => (
            <div
              key={day.key}
              className={`rounded-2xl p-3 text-center transition ${
                day.active ? 'bg-blue-600 text-white shadow-glow' : 'bg-slate-50 text-slate-500'
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">{day.label}</p>
              <div className="mt-2 flex h-9 items-center justify-center rounded-xl bg-white/15 text-xs font-semibold">
                {day.active ? 'Done' : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
