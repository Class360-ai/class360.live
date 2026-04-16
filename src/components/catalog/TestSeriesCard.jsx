import { motion } from 'framer-motion';
import { ArrowRight, Clock3, BadgeCheck, CheckCircle2 } from 'lucide-react';

export default function TestSeriesCard({ test, onStart }) {
  const isFree = test.access === 'Free';

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              isFree ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
            }`}
          >
            {test.access}
          </span>
          <span className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
            {test.badge}
          </span>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          {test.difficulty}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-slate-950">{test.title}</h3>
      <p className="mt-2 text-sm font-semibold text-blue-700">{test.exam}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{test.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
          <CheckCircle2 className="h-4 w-4 text-cyan-600" />
          {test.questions} questions
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
          <Clock3 className="h-4 w-4 text-indigo-600" />
          {test.duration}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
          <BadgeCheck className="h-4 w-4 text-emerald-600" />
          {test.price}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {test.topics.slice(0, 3).map((topic) => (
          <span key={topic} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {topic}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onStart(test)}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        {isFree ? 'Start Free Test' : 'Start Test'} <ArrowRight className="h-4 w-4" />
      </button>
    </motion.article>
  );
}
