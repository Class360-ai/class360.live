import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function AINotesButton({ onClose }) {
  const [notes] = useState([
    '✅ Key point: Ionic bonds form through complete electron transfer',
    '✅ Covalent bonds involve sharing of electron pairs',
    '⚠️ Remember: Bond strength: Ionic > Covalent > Metallic',
    '💡 Pro tip: Use VSEPR theory to predict molecular geometry',
    '📝 Practice: Classify the bonding in MgCl2, NH3, and O2',
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.5rem] bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-bold text-slate-950">🧠 AI Notes</p>
        <button onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {notes.map((note, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
          >
            {note}
          </motion.div>
        ))}
      </div>

      <button onClick={onClose} className="mt-4 w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
        Close
      </button>
    </motion.div>
  );
}
