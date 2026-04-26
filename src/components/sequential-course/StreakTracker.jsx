import { Flame, CalendarRange } from 'lucide-react';

export default function StreakTracker({ streakDays, highestUnlockedDay }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-[1.75rem] border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Daily streak</p>
            <p className="mt-1 font-display text-3xl font-bold text-slate-950">{streakDays} days</p>
          </div>
        </div>
      </div>
      <div className="rounded-[1.75rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
            <CalendarRange className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Highest unlocked day</p>
            <p className="mt-1 font-display text-3xl font-bold text-slate-950">Day {highestUnlockedDay}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
