import { motion } from 'framer-motion';

export default function SectionTitle({ eyebrow, title, subtitle, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-3 ${alignClass}`}
    >
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{subtitle}</p>
      ) : null}
    </motion.div>
  );
}
