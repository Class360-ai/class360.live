import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, MessageCircle, Sparkles } from 'lucide-react';
import { generateReferralCode, getReferralMessage } from '../utils/leaderboard';

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return success;
}

export default function ReferralCard({ user, compact = false }) {
  const [status, setStatus] = useState('');
  const referralCode = useMemo(() => generateReferralCode(user), [user]);
  const referralMessage = useMemo(() => getReferralMessage(user), [user]);

  const handleCopy = async () => {
    try {
      await copyText(`Use my Class360 referral code ${referralCode}`);
      setStatus('Referral code copied to clipboard.');
    } catch {
      setStatus('Clipboard unavailable. Please copy the code manually.');
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(referralMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm ${compact ? '' : 'sm:p-6'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Invite Friends, Earn Rewards
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold text-slate-950">Invite Friends, Earn Rewards</h3>
        </div>
        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">Code</p>
          <p className="mt-1 font-display text-xl font-bold">{referralCode}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {['Unlock bonus XP', 'Free premium mock test', 'Early access features'].map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/80"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Copy className="h-4 w-4" />
          Copy Referral Code
        </button>
        <button
          type="button"
          onClick={handleWhatsApp}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
        >
          <MessageCircle className="h-4 w-4" />
          Invite on WhatsApp
        </button>
      </div>

      {status ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="mr-2 inline-block h-4 w-4" />
          {status}
        </div>
      ) : null}
    </motion.section>
  );
}
