import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPreview({ items = [] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Leaderboard</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">Top performers</h3>
        </div>
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
        >
          View full leaderboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-5 space-y-3">
        {items.slice(0, 3).map((item) => (
          <div
            key={`${item.rank}-${item.fullName}`}
            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-slate-950">{item.fullName}</p>
              <p className="text-sm text-slate-500">{item.subjectFocus}</p>
            </div>
            <p className="font-semibold text-blue-700">{item.xp} XP</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
