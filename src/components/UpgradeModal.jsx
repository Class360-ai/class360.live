import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Crown, X } from 'lucide-react';
import { activatePremium } from '../utils/premium';

export default function UpgradeModal({ open, onClose, reason = 'Unlock advanced learning features' }) {
  const [success, setSuccess] = useState(false);

  const benefits = useMemo(
    () => [
      'Unlimited AI Tests',
      'Advanced Weak Topic Analysis',
      'Smart Daily Plans',
      'Faster Score Improvement',
    ],
    [],
  );

  const handleUpgrade = () => {
    activatePremium();
    setSuccess(true);
    window.dispatchEvent(new Event('class360-premium-unlocked'));
    setTimeout(() => {
      setSuccess(false);
      onClose?.(true);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_-28px_rgba(15,23,42,0.45)]"
          >
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                    <Crown className="h-4 w-4" />
                    Premium Upgrade
                  </div>
                  <h2 className="mt-4 font-display text-3xl font-bold">Unlock Your Full Potential</h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/85">{reason}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onClose?.(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                  aria-label="Close upgrade modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                    <Check className="mr-2 inline-block h-4 w-4 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Pricing</p>
                <div className="mt-2 flex items-end gap-3">
                  <p className="font-display text-4xl font-bold text-slate-950">₹99/month</p>
                  <p className="pb-1 text-sm text-slate-500 line-through">₹199/month</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Keep all premium learning tools active with a simple monthly plan.
                </p>
              </div>

              {success ? (
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  Welcome to Premium 🎉
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade Now
                </button>
                <button
                  type="button"
                  onClick={() => onClose?.(false)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
