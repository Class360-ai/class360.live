import { motion } from 'framer-motion';
import { Play, BookOpen, CheckCircle2 } from 'lucide-react';

export default function ReplayCard({ replay, detailed }) {
  const watchPercentage = (replay.watchedDuration / replay.duration) * 100;

  if (detailed) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-950">{replay.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{replay.teacher} • Completed {replay.completedAt}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-xs font-semibold uppercase text-slate-600">Duration watched</p>
            <p className="mt-2 font-display text-xl font-bold text-slate-950">
              {replay.watchedDuration}/{replay.duration} min
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <motion.div className="h-full bg-blue-600" style={{ width: `${watchPercentage}%` }} />
            </div>
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-xs font-semibold uppercase text-slate-600">Performance</p>
            <p className="mt-2 font-display text-xl font-bold text-emerald-600">{replay.performanceScore}%</p>
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-xs font-semibold uppercase text-slate-600">XP Earned</p>
            <p className="mt-2 font-display text-xl font-bold text-yellow-600">+{replay.rewardsEarned.xp}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-950">Key Moments</p>
          {replay.keystones.map((stone) => (
            <div key={stone.time} className="flex items-center gap-3 rounded-lg bg-slate-100 p-3">
              {stone.watched ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-950">{stone.title}</p>
                <p className="text-xs text-slate-600">{stone.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <p className="font-semibold text-slate-950">AI Notes</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{replay.aiNotes}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">REPLAY</p>
          <h4 className="mt-1 font-display text-sm font-bold text-slate-950 line-clamp-2">{replay.title}</h4>
          <p className="mt-1 text-xs text-slate-600">{replay.teacher}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Play className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <BookOpen className="h-3 w-3 text-slate-400" />
        <p className="text-xs text-slate-600">{replay.topics.join(' • ')}</p>
      </div>

      <div className="mt-3">
        <p className="mb-1 text-xs font-semibold text-slate-600">Watched: {watchPercentage.toFixed(0)}%</p>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${watchPercentage}%` }} />
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="flex-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white">Watch</button>
        <button className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">Notes</button>
      </div>
    </motion.div>
  );
}
