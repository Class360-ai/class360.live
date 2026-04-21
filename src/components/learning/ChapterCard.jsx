import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const statusMap = {
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700',
  },
  current: {
    icon: PlayCircle,
    label: 'Current',
    className: 'bg-blue-50 text-blue-700',
  },
  locked: {
    icon: Lock,
    label: 'Locked',
    className: 'bg-slate-100 text-slate-600',
  },
  available: {
    icon: PlayCircle,
    label: 'Ready',
    className: 'bg-cyan-50 text-cyan-700',
  },
};

export default function ChapterCard({ chapter, status, progress = 0, to }) {
  const info = statusMap[status] || statusMap.available;
  const Icon = info.icon;

  return (
    <motion.article whileHover={{ y: -4 }} className="glass-card rounded-[2rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Chapter {chapter.order}</p>
            <h3 className="mt-1 font-display text-xl font-bold text-slate-950">{chapter.title}</h3>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${info.className}`}>{info.label}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{chapter.description}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">{chapter.duration}</span>
        <Link to={to} className="font-semibold text-blue-700">
          Open
        </Link>
      </div>
    </motion.article>
  );
}
