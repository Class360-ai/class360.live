import { motion } from 'framer-motion';
import { Play, TrendingUp } from 'lucide-react';
import { getDifficultyColors } from '../../utils/liveClassesUtils';

export default function RecommendationCard({ className, onJoin, showReason }) {
  const colors = getDifficultyColors(className.difficulty);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-[1.5rem] border-2 ${colors.border} ${colors.bg} p-4 transition`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="flex-1 font-display text-sm font-bold text-slate-950">{className.title}</h4>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-700"
            >
              <TrendingUp className="h-3 w-3" />
              {className.personalizedScore}%
            </motion.div>
          </div>

          {showReason && (
            <p className="mt-2 text-xs italic text-slate-600">💡 {className.reason}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-1">
            {className.topics.slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] font-semibold text-slate-600">
                #{t.split(' ')[0]}
              </span>
            ))}
            {className.topics.length > 2 && (
              <span className="text-[10px] font-semibold text-slate-600">+{className.topics.length - 2} more</span>
            )}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={onJoin}
        className="mt-3 w-full flex items-center justify-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
      >
        <Play className="h-3 w-3" />
        Join
      </motion.button>
    </motion.div>
  );
}
