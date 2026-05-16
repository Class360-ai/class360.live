import { motion } from 'framer-motion';

export default function HeroBanner({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  children,
  footerContent,
}) {
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-14">
      <div className="absolute inset-0 -z-10 bg-hero-grid bg-[length:32px_32px] opacity-[0.35]" />
      <div className="absolute left-1/2 top-6 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl animate-glowPulse" />
      <div className="absolute right-0 top-20 -z-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl animate-glowPulse" />
      <div className="section-container">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            {eyebrow ? (
              <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 shadow-sm">
                {eyebrow}
              </span>
            ) : null}
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryCta}
              {secondaryCta}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">Trusted by 50K+ learners</span>
              <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">Live classes + smart analytics</span>
            </div>
            {footerContent ? <div className="mt-7">{footerContent}</div> : null}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
