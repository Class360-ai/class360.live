import { motion } from 'framer-motion';

export default function StatsStrip({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
          className="glass-card card-hover rounded-3xl p-6"
        >
          <p className="font-display text-3xl font-bold text-slate-950">{item.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
