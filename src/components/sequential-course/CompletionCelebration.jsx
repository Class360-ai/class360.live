import { motion, AnimatePresence } from 'framer-motion';

export default function CompletionCelebration({ open, dayNumber }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-[1.75rem] border border-emerald-200 bg-white p-5 shadow-premium"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Progress updated</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">🎉 Day Completed!</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Day {dayNumber} is complete. Redirecting you to the next unlocked lesson.
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
