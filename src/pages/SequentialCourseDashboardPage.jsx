import { Link } from 'react-router-dom';
import { ArrowRight, Award, Sparkles, TrendingUp, Zap } from 'lucide-react';
import CourseDashboard from '../components/sequential-course/CourseDashboard';
import SequentialProgressBar from '../components/sequential-course/SequentialProgressBar';
import StreakTracker from '../components/sequential-course/StreakTracker';
import { useSequentialCourse } from '../context/SequentialCourseContext';

export default function SequentialCourseDashboardPage() {
  const { dashboard, loading, error } = useSequentialCourse();

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[2.5rem] border border-blue-100 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-premium sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                <Sparkles className="h-4 w-4" />
                Sequential course unlock system
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
                Move one day at a time, with every checkpoint tracked.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                Each day unlocks only after the previous one is completed. Students watch the lesson, open the PPT, and submit the test before moving forward.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={dashboard.nextDay ? `/sequential-course/day/${dashboard.nextDay.dayNumber}` : '/sequential-course/day/1'}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                >
                  {dashboard.nextDay ? `Open Day ${dashboard.nextDay.dayNumber}` : 'Start Day 1'} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.8rem] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/65">Completed days</p>
                <p className="mt-2 font-display text-3xl font-bold text-white">{dashboard.completedDays}</p>
              </div>
              <div className="rounded-[1.8rem] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/65">Total sequence</p>
                <p className="mt-2 font-display text-3xl font-bold text-white">{dashboard.totalDays}</p>
              </div>
              <div className="rounded-[1.8rem] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/65">Unlocked through</p>
                <p className="mt-2 font-display text-3xl font-bold text-white">Day {dashboard.highestUnlockedDay}</p>
              </div>
              <div className="rounded-[1.8rem] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/65">Daily streak</p>
                <p className="mt-2 font-display text-3xl font-bold text-white">{dashboard.streakDays} days</p>
              </div>
            </div>
          </div>
        </div>

        <SequentialProgressBar
          value={dashboard.progressPercent}
          completedDays={dashboard.completedDays}
          totalDays={dashboard.totalDays}
        />
        <StreakTracker streakDays={dashboard.streakDays} highestUnlockedDay={dashboard.highestUnlockedDay} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.9rem] border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white p-3 text-amber-600 shadow-sm">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">XP</p>
                <p className="mt-1 font-display text-3xl font-bold text-slate-950">{dashboard.user?.xp || 0}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.9rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white p-3 text-cyan-700 shadow-sm">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Level</p>
                <p className="mt-1 font-display text-3xl font-bold text-slate-950">{dashboard.user?.level || 1}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.9rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Badge</p>
                <p className="mt-1 font-display text-3xl font-bold text-slate-950">{dashboard.user?.badge || 'Beginner'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Average quiz score</p>
            <p className="mt-2 font-display text-3xl font-bold text-slate-950">{dashboard.performanceStats?.averageQuizScore || 0}%</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Strong days</p>
            <p className="mt-2 font-display text-3xl font-bold text-slate-950">{dashboard.performanceStats?.strongDays || 0}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Needs review</p>
            <p className="mt-2 font-display text-3xl font-bold text-slate-950">{dashboard.performanceStats?.needsReview || 0}</p>
          </div>
        </div>

        {error ? <div className="rounded-[1.75rem] bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">{error}</div> : null}
        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center text-sm font-medium text-slate-500 shadow-sm">
            Loading sequential course dashboard...
          </div>
        ) : (
          <CourseDashboard days={dashboard.days} />
        )}
      </div>
    </section>
  );
}
