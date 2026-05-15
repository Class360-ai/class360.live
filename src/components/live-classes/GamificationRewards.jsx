import { motion } from 'framer-motion';
import { Trophy, Zap, Gift, Star } from 'lucide-react';

export default function GamificationRewards({ onClose }) {
  const rewards = [
    { icon: Zap, label: 'XP Earned', value: '+150', color: 'text-yellow-500' },
    { icon: Trophy, label: 'Streak', value: '+1 day', color: 'text-orange-500' },
    { icon: Gift, label: 'Badge', value: 'Live Attender', color: 'text-purple-500' },
    { icon: Star, label: 'Leaderboard', value: '+45 pts', color: 'text-cyan-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="rounded-[2rem] bg-white p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-3xl"
        >
          ✨
        </motion.div>

        <h3 className="font-display text-2xl font-bold text-slate-950">Class Complete!</h3>
        <p className="mt-2 text-sm text-slate-600">Great session! Here's what you earned:</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {rewards.map((reward, idx) => {
            const Icon = reward.icon;
            return (
              <motion.div
                key={reward.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="rounded-xl bg-slate-50 p-3"
              >
                <Icon className={`mx-auto mb-2 h-5 w-5 ${reward.color}`} />
                <p className="text-xs font-semibold text-slate-600">{reward.label}</p>
                <p className="mt-1 font-display text-lg font-bold text-slate-950">{reward.value}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
