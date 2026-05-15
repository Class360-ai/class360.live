import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PollCard() {
  const [voted, setVoted] = useState(null);
  const [votes] = useState({ A: 340, B: 210, C: 89, D: 45 });
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-600">📊 Live Poll</p>
      <p className="mt-2 font-display text-sm font-bold text-slate-950">Which bonding is strongest?</p>

      <div className="mt-3 space-y-2">
        {['A) Ionic', 'B) Covalent', 'C) Metallic', 'D) Hydrogen'].map((option, idx) => {
          const key = ['A', 'B', 'C', 'D'][idx];
          const percentage = (votes[key] / totalVotes) * 100;
          const isSelected = voted === key;

          return (
            <motion.button
              key={option}
              onClick={() => setVoted(key)}
              className={`relative w-full overflow-hidden rounded-lg p-2 text-left text-xs font-semibold transition ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <motion.div
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400"
              />
              <div className="relative flex items-center justify-between gap-2">
                <span>{option}</span>
                <span className="font-bold text-slate-950">{votes[key]} ({percentage.toFixed(0)}%)</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-600">{totalVotes} total responses</p>
    </motion.div>
  );
}
