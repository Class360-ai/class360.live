import { motion } from 'framer-motion';

export default function FilterChips({ items, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const isActive = item === active;
        return (
          <motion.button
            key={item}
            type="button"
            whileHover={{ y: -2 }}
            onClick={() => onChange(item)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-slate-950 text-white shadow-lg'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'
            }`}
          >
            {item}
          </motion.button>
        );
      })}
    </div>
  );
}
