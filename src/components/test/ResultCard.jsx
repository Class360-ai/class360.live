export default function ResultCard({ label, value, subtle = false }) {
  return (
    <div
      className={`rounded-3xl p-5 ${
        subtle ? 'bg-white ring-1 ring-slate-200/80' : 'bg-slate-950 text-white'
      }`}
    >
      <p className={`text-sm ${subtle ? 'text-slate-500' : 'text-white/60'}`}>{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${subtle ? 'text-slate-950' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
