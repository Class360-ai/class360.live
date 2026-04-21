import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TestCard({ chapterSlug, score, total, to }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-card rounded-[2rem] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Test</p>
      <h3 className="mt-2 font-display text-xl font-bold text-slate-950">Chapter test</h3>
      <p className="mt-2 text-sm text-slate-600">
        {total} MCQs, explanations, and progress tracking.
      </p>
      {typeof score === 'number' ? (
        <p className="mt-4 text-sm font-semibold text-slate-700">Latest score: {score}%</p>
      ) : null}
      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
      >
        Start test <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
