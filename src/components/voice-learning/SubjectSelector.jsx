import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';

export default function SubjectSelector({ subjects, activeSubject, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {subjects.map((item, index) => (
        <motion.button
          key={item.subject}
          type="button"
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -2 }}
          onClick={() => onChange(item.subject)}
          className={cn(
            'rounded-full border px-4 py-3 text-sm font-semibold transition',
            activeSubject === item.subject
              ? 'border-blue-200 bg-blue-600 text-white shadow-glow'
              : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700',
          )}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: index * 0.03 }}
        >
          {item.label}
        </motion.button>
      ))}
    </div>
  );
}
