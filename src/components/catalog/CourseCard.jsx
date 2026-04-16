import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Clock3, Sparkles } from 'lucide-react';

export default function CourseCard({ course, onEnroll }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
    >
      <div className={`rounded-[1.5rem] bg-gradient-to-r ${course.accent} p-[1px]`}>
        <div className="rounded-[1.45rem] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {course.exam}
              </span>
              <span className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                {course.badge}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 line-through">{course.originalPrice}</p>
              <p className="text-2xl font-bold text-slate-950">{course.price}</p>
            </div>
          </div>

          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-950">
            {course.title}
          </h3>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <Sparkles className="h-4 w-4 text-cyan-600" />
              {course.mode}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <Clock3 className="h-4 w-4 text-indigo-600" />
              {course.duration}
            </span>
          </div>

          <ul className="mt-5 space-y-3">
            {course.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">Premium support included</p>
            <button
              type="button"
              onClick={() => onEnroll(course)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg group-hover:shadow-glow"
            >
              Enroll Now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
