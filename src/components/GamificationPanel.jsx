import { motion } from 'framer-motion';
import { Award, BadgeCheck, Flame, Sparkles, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  BADGE_DEFINITIONS,
  getAchievementEvents,
  getBadgeProgress,
  getGamificationSnapshot,
} from '../utils/gamification';

function latestEventLabel(events) {
  const latest = events?.[0];
  if (!latest) return 'Keep completing tasks and tests to unlock rewards.';
  return latest.note || 'A new achievement was unlocked.';
}

export default function GamificationPanel({ attempts = [], streak = 0, dailyPlanComplete = false, recentScore = 0 }) {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const sync = () => setRefreshKey((value) => value + 1);
    window.addEventListener('storage', sync);
    window.addEventListener('class360-gamification-changed', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('class360-gamification-changed', sync);
    };
  }, []);

  const snapshot = useMemo(
    () => getGamificationSnapshot({ attempts, streak, dailyPlanComplete, recentScore }),
    [attempts, streak, dailyPlanComplete, recentScore, refreshKey],
  );

  const progressRange = snapshot.nextFloor ? snapshot.nextFloor - snapshot.floor : 0;
  const progressValue = snapshot.nextFloor ? Math.max(0, snapshot.xp - snapshot.floor) : 0;
  const progressPercent = snapshot.nextFloor ? Math.min(100, (progressValue / progressRange) * 100) : 100;
  const progress = getBadgeProgress({ attempts, streak, dailyPlanComplete, recentScore });
  const unlockedCount = BADGE_DEFINITIONS.filter((badge) => progress[badge.id]).length;
  const events = getAchievementEvents();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-6 shadow-premium sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Achievement System
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Your XP, level, and badges
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Keep earning XP for completing tests and daily tasks. Unlock badges as your consistency and scores improve.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px] lg:grid-cols-1 xl:grid-cols-3">
          <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white shadow-premium">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Total XP</p>
            <p className="mt-2 font-display text-3xl font-bold">{snapshot.xp}</p>
          </div>
          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Current level</p>
            <p className="mt-2 font-display text-3xl font-bold text-slate-950">Level {snapshot.level}</p>
          </div>
          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Unlocked badges</p>
            <p className="mt-2 font-display text-3xl font-bold text-slate-950">{unlockedCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-600">Progress to next level</p>
            <p className="mt-1 text-sm text-slate-500">
              {snapshot.nextFloor ? `${snapshot.xp}/${snapshot.nextFloor} XP` : 'Maximum level reached'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
            <Award className="h-4 w-4" />
            {snapshot.nextFloor ? `${Math.round(progressPercent)}%` : 'Max level'}
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.05fr]">
        <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-premium">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3 text-amber-300">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-white/60">Achievement summary</p>
              <h3 className="mt-1 font-display text-2xl font-bold">Stay active, keep collecting rewards</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/60">Current streak</p>
              <p className="mt-2 font-display text-2xl font-bold">{streak} days</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/60">Latest score</p>
              <p className="mt-2 font-display text-2xl font-bold">{recentScore ? `${recentScore}%` : '—'}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm leading-7 text-white/80">
            {latestEventLabel(events)}
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Badge grid</p>
              <h3 className="mt-1 font-display text-2xl font-bold text-slate-950">Track every milestone</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {BADGE_DEFINITIONS.map((badge) => {
              const unlocked = Boolean(progress[badge.id]);
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ y: -4 }}
                  className={`rounded-[1.4rem] border p-4 transition ${
                    unlocked
                      ? 'border-emerald-200 bg-emerald-50 shadow-[0_18px_50px_-28px_rgba(16,185,129,0.55)]'
                      : 'border-slate-200 bg-slate-50 opacity-85'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                      {badge.emoji}
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${unlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                      {unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-lg font-bold text-slate-950">{badge.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{badge.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
