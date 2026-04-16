import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

export default function EmptyStateCard({ title, description, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <SearchX className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold text-slate-950">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {actionLabel}
        </button>
      ) : null}
    </motion.div>
  );
}
