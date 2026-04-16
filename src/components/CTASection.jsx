import { motion } from 'framer-motion';

export default function CTASection({ title, subtitle, primary, secondary }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45 }}
      className="section-container"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 px-6 py-10 text-white shadow-premium sm:px-10 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.28),transparent_26%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-white/90">{subtitle}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            {primary}
            {secondary}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
