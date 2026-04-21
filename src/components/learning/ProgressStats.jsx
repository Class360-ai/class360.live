export default function ProgressStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-slate-950">{item.value}</p>
          {item.note ? <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p> : null}
        </div>
      ))}
    </div>
  );
}
