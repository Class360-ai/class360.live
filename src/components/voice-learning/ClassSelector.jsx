import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';

export default function ClassSelector({ classes, activeClass, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {classes.map((item, index) => (
        <motion.button
          key={item.className}
          type="button"
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -2 }}
          onClick={() => onChange(item.className)}
          className={cn(
            'rounded-[1.75rem] border px-4 py-4 text-left transition',
            activeClass === item.className
              ? 'border-blue-200 bg-blue-50 shadow-sm'
              : 'border-slate-200 bg-white shadow-sm hover:border-blue-200',
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.04 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">Select class</p>
              <p className="mt-1 font-display text-2xl font-bold text-slate-950">{item.className}</p>
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold',
                activeClass === item.className ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600',
              )}
            >
              {activeClass === item.className ? 'Active' : 'Tap'}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
