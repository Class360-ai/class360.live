import { Clock3 } from 'lucide-react';

export default function TimerBadge({ remaining }) {
  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg">
      <Clock3 className="h-4 w-4 text-cyan-300" />
      {minutes}:{seconds}
    </div>
  );
}
