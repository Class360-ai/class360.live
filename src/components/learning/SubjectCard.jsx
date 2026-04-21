import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SubjectCard({ subject, progress = 0, to }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-card rounded-[2rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-slate-950">{subject.name}</h3>
            <p className="text-sm text-slate-600">{subject.classLevel}</p>
          </div>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
          {progress}% done
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{subject.description}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" style={{ width: `${progress}%` }} />
      </div>
      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
      >
        Open subject <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
