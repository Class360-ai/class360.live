import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Medal, Star, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReferralCard from '../components/ReferralCard';
import SectionTitle from '../components/SectionTitle';
import { getStoredUser } from '../utils/authStorage';
import { getCurrentUserRank, getLeaderboardData } from '../utils/leaderboard';
import { getGamificationSnapshot } from '../utils/gamification';
import { getStreak } from '../utils/planGenerator';
import { getTestAttempts } from '../utils/testStorage';

const filters = ['Overall', 'This Week', 'Maths', 'Science', 'Test Toppers'];

function RankPill({ rank }) {
  const styles = {
    1: 'bg-amber-50 text-amber-700',
    2: 'bg-slate-100 text-slate-700',
    3: 'bg-orange-50 text-orange-700',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${styles[rank] || 'bg-blue-50 text-blue-700'}`}>
      #{rank}
    </span>
  );
}

export default function Leaderboard() {
  const [activeFilter, setActiveFilter] = useState('Overall');
  const user = getStoredUser();
  const leaderboard = useMemo(() => getLeaderboardData(activeFilter), [activeFilter]);
  const currentUser = getCurrentUserRank(activeFilter);
  const attempts = getTestAttempts();
  const streak = getStreak();
  const gamification = getGamificationSnapshot({
    attempts,
    streak,
    recentScore: attempts[0]?.percentage || 0,
  });

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-6 text-white shadow-premium sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Leaderboard</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Compete, climb, and stay consistent</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
            See where you stand, compare progress, and turn every test into a move up the leaderboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/test-series"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            >
              Start a Test <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {currentUser ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Your Rank</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-slate-950">
                  {user?.fullName || 'Class360 Learner'}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {currentUser.rank ? `You are ranked #${currentUser.rank} on this view.` : 'Your rank is being calculated from your local progress.'}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[520px]">
                <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">XP</p>
                  <p className="mt-1 font-display text-2xl font-bold">{currentUser.xp || gamification.xp}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-4 ring-1 ring-slate-200/80">
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-700">Streak</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">{currentUser.streak || streak}d</p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-4 ring-1 ring-slate-200/80">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">Tests</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">{currentUser.testsCompleted || attempts.length}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-4 ring-1 ring-slate-200/80">
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-700">Next target</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">
                    {currentUser.gapToNextRank ? `${currentUser.gapToNextRank} XP` : 'Top rank'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveFilter(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeFilter === item
                  ? 'bg-slate-950 text-white shadow-lg'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              eyebrow="Top 3"
              title="Current leaders"
              subtitle="Gold, silver, and bronze styling highlights the strongest performers at a glance."
            />
            <div className="mt-6 grid gap-4">
              {leaderboard.slice(0, 3).map((item, index) => {
                const accent =
                  index === 0
                    ? 'from-amber-400 via-yellow-500 to-orange-500'
                    : index === 1
                      ? 'from-slate-300 via-slate-400 to-slate-500'
                      : 'from-orange-500 via-amber-600 to-red-500';

                return (
                  <motion.div
                    key={`${item.rank}-${item.fullName}`}
                    whileHover={{ y: -4 }}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-white shadow-glow`}>
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700">{item.subjectFocus}</p>
                          <h3 className="font-display text-xl font-bold text-slate-950">{item.fullName}</h3>
                        </div>
                      </div>
                      <RankPill rank={item.rank} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold">{item.xp} XP</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold">{item.streak} day streak</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold">{item.badge}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              eyebrow="All ranks"
              title="Leaderboard rows"
              subtitle="Use filters to compare performance across subjects, weekly activity, and top testers."
            />
            <div className="mt-6 space-y-3">
              {leaderboard.map((item) => (
                <div key={`${item.rank}-${item.fullName}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3">
                  <RankPill rank={item.rank} />
                  <div>
                    <p className="font-semibold text-slate-950">{item.fullName}</p>
                    <p className="text-sm text-slate-500">{item.subjectFocus} • {item.badge}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">{item.xp} XP</p>
                    <p className="text-sm text-slate-500">{item.streak}d streak</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <ReferralCard user={user} />
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              eyebrow="Current user"
              title="How close are you to the next rank?"
              subtitle="A tiny target can be enough to keep the competition motivating and visible."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                <p className="text-sm text-white/60">Current XP</p>
                <p className="mt-2 font-display text-3xl font-bold">{currentUser?.xp || gamification.xp}</p>
              </div>
              <div className="rounded-[1.5rem] bg-blue-50 p-5">
                <p className="text-sm font-semibold text-blue-700">Next rank target</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-950">
                  {currentUser?.gapToNextRank ? `${currentUser.gapToNextRank} XP` : 'Keep climbing'}
                </p>
              </div>
            </div>
            <div className="mt-5 rounded-[1.5rem] bg-cyan-50 p-5 text-sm leading-7 text-slate-700">
              Keep taking tests and finishing your daily plan to climb the leaderboard faster.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
