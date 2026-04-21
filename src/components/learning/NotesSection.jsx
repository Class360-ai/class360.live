export default function NotesSection({ notes }) {
  if (!notes) return null;

  return (
    <div className="glass-card rounded-[2rem] p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Notes</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h4 className="font-semibold text-slate-950">Summary points</h4>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {notes.summaryPoints.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h4 className="font-semibold text-slate-950">Key terms</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {notes.keyTerms.map((item) => (
              <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{notes.revisionBox}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Examples</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{notes.examples.join(', ')}</p>
      </div>
    </div>
  );
}
