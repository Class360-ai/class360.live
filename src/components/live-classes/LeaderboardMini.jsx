import { motion } from 'framer-motion';
import { Medal, TrendingUp } from 'lucide-react';

export default function LeaderboardMini() {
  const leaderboard = [
    { rank: 1, name: 'Arjun Kumar', xp: 5240, badge: '👑' },
    { rank: 2, name: 'Meera Sharma', xp: 4890, badge: '🌟' },
    { rank: 3, name: 'Priya Singh', xp: 4560, badge: '🔥' },
    { rank: 4, name: 'You', xp: 3920, badge: '⭐', isUser: true },
    { rank: 5, name: 'Vikram Patel', xp: 3750, badge: '💪' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-bold text-slate-950">🏆 Leaderboard</p>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All →</button>
      </div>

      <div className="mt-4 space-y-2">
        {leaderboard.map((entry) => (
          <motion.div
            key={entry.rank}
            whileHover={{ x: 4 }}
            className={`flex items-center gap-3 rounded-lg p-2 ${entry.isUser ? 'bg-blue-50 ring-1 ring-blue-200' : 'bg-slate-50'}`}
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' : entry.rank === 2 ? 'bg-slate-300 text-slate-800' : entry.rank === 3 ? 'bg-orange-400 text-orange-900' : 'bg-slate-200 text-slate-700'}`}>
              #{entry.rank}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-950">{entry.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-950">{entry.xp} XP</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        className="mt-4 w-full rounded-full border-2 border-blue-600 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700"
      >
        Climb the Leaderboard 📈
      </motion.button>
    </motion.div>
  );
}
