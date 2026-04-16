export default function ProgressBar({ value, total }) {
  const percent = total ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div className="rounded-full bg-slate-200 p-1">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
