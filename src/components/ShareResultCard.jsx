import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Share2, Sparkles, Trophy } from 'lucide-react';
import { buildShareText } from '../utils/leaderboard';
import { getGamificationSnapshot } from '../utils/gamification';
import { getStoredUser } from '../utils/authStorage';
import { getStreak } from '../utils/planGenerator';
import { getTestAttempts } from '../utils/testStorage';

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

export default function ShareResultCard({ result, onBack }) {
  const [status, setStatus] = useState('');
  const user = getStoredUser();
  const gamification = getGamificationSnapshot({
    attempts: getTestAttempts(),
    streak: getStreak(),
    recentScore: result?.percentage || 0,
  });

  const shareText = useMemo(() => buildShareText(result, user, gamification), [result, user, gamification]);
  const weakTopics = Array.isArray(result?.weakTopics) ? result.weakTopics.slice(0, 4) : [];

  const handleShare = async () => {
    try {
      await copyText(shareText);
      setStatus('Result summary copied to clipboard.');
    } catch {
      setStatus('Clipboard not available. You can still save or print this card.');
    }
  };

  const handleSave = () => {
    window.print();
    setStatus('Print dialog opened for saving the achievement.');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-premium sm:p-8"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Share Your Result
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold text-slate-950">A polished card for sharing progress</h2>
        </div>
        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">XP earned</p>
          <p className="mt-1 font-display text-2xl font-bold">{Math.max(0, Number(result?.xpEarned || 0))} XP</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Class360</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">{user?.fullName || 'Class360 Student'}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {result?.subject || 'Test'} • {result?.difficulty || 'Practice'}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Score</p>
              <p className="mt-1 font-display text-3xl font-bold text-emerald-700">{Number(result?.percentage || 0)}%</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Streak</p>
              <p className="mt-2 font-display text-2xl font-bold text-slate-950">{getStreak()} days</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">XP</p>
              <p className="mt-2 font-display text-2xl font-bold text-slate-950">{result?.xpEarned || 0}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Badges</p>
              <p className="mt-2 font-display text-2xl font-bold text-slate-950">{gamification?.unlocked?.length || 0}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-[1px]">
            <div className="rounded-[1.45rem] bg-white p-4">
              <p className="text-sm font-semibold text-slate-700">Weak topics improved</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {weakTopics.length ? (
                  weakTopics.map((topic) => (
                    <span key={topic} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Strong performance across this test
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-amber-300" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Motivation</p>
            </div>
            <p className="mt-3 text-base leading-7 text-white/90">
              {Number(result?.percentage || 0) >= 80
                ? 'Excellent work. You are building a strong exam-ready rhythm.'
                : Number(result?.percentage || 0) >= 60
                  ? 'Great momentum. A little more revision will push you higher.'
                  : 'Good start. Keep practicing and the score will rise fast.'}
            </p>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-display text-2xl font-bold text-slate-950">Share options</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Copy a ready-to-share summary, print the card, or go back to your dashboard.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Share2 className="h-4 w-4" />
              Share Progress
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              <Copy className="h-4 w-4" />
              Save Achievement
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
          {status ? <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm text-blue-700">{status}</div> : null}

          <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-700">Share text preview</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{shareText}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
