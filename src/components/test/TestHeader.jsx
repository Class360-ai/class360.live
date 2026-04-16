import { Clock3, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function TestHeader({ subjectLabel, difficultyLabel, remaining, total }) {
  const { t } = useLanguage();
  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[2rem] p-4 sm:p-5"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">AI Practice Test</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-slate-950 sm:text-3xl">
            {subjectLabel} · {difficultyLabel}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {t('test.headerSub', 'Answer carefully, track your pace, and submit when you are done.')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">{t('test.timeLeft', 'Time left')}</p>
            <div className="mt-1 flex items-center gap-2 font-display text-2xl font-bold">
              <Clock3 className="h-5 w-5 text-cyan-300" />
              {minutes}:{seconds}
            </div>
          </div>
          <div className="rounded-2xl bg-blue-50 px-4 py-3 text-blue-800">
            <p className="text-[11px] uppercase tracking-[0.2em] text-blue-600">{t('test.questions', 'Questions')}</p>
            <div className="mt-1 flex items-center gap-2 font-display text-2xl font-bold">
              <Flame className="h-5 w-5 text-blue-600" />
              {total}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
