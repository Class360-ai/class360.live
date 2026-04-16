import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Star } from 'lucide-react';

export function CourseCard({ course }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="glass-card group rounded-3xl p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {course.exam}
          </span>
          <h3 className="mt-3 font-display text-xl font-bold text-slate-950">{course.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 line-through">{course.originalPrice}</p>
          <p className="text-2xl font-bold text-slate-950">{course.price}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <BadgeCheck className="h-4 w-4 text-emerald-500" />
        <span>{course.duration} structured program</span>
      </div>
      <ul className="mt-5 space-y-3">
        {course.features.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
            <Star className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:shadow-glow">
        Enroll Now <ArrowRight className="h-4 w-4" />
      </button>
    </motion.article>
  );
}

export function TestCard({ item, subtle = false }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className={`rounded-3xl border ${subtle ? 'border-slate-200 bg-white' : 'border-blue-100 bg-white/90'} p-6 shadow-sm`}
    >
      <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
        {item.type}
      </span>
      <h3 className="mt-4 font-display text-xl font-bold text-slate-950">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
    </motion.article>
  );
}

export function ResultCard({ result }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="glass-card rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">{result.exam}</p>
          <h3 className="mt-2 font-display text-xl font-bold text-slate-950">{result.name}</h3>
        </div>
        <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-white">
          {result.rank}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{result.title}</p>
    </motion.article>
  );
}

export function EducatorCard({ educator }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="glass-card rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-slate-950">{educator.name}</h3>
          <p className="mt-1 text-sm font-semibold text-blue-700">{educator.subject}</p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
          {educator.experience}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{educator.highlight}</p>
      <p className="mt-4 text-sm font-semibold text-slate-800">{educator.trust}</p>
    </motion.article>
  );
}

export function TestimonialCard({ testimonial }) {
  return (
    <motion.article whileHover={{ y: -4 }} className="glass-card rounded-3xl p-6">
      <div className="flex items-center gap-2 text-amber-500">
        {[...Array(5)].map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">"{testimonial.quote}"</p>
      <div className="mt-5">
        <h4 className="font-semibold text-slate-950">{testimonial.name}</h4>
        <p className="text-sm text-slate-500">{testimonial.role}</p>
      </div>
    </motion.article>
  );
}
