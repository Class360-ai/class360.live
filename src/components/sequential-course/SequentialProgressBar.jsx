export default function SequentialProgressBar({ value, completedDays, totalDays }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Progress</p>
          <h3 className="mt-2 font-display text-3xl font-bold text-slate-950">{value}%</h3>
        </div>
        <p className="text-sm font-medium text-slate-500">
          {completedDays}/{totalDays} days completed
        </p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
