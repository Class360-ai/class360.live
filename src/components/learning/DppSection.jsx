import McqCard from './McqCard';

export default function DppSection({ questions, answers, onAnswer, revealed, onRevealAll }) {
  return (
    <div className="glass-card rounded-[2rem] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">DPP</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">Daily practice set</h3>
        </div>
        <button
          type="button"
          onClick={onRevealAll}
          className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          Check DPP
        </button>
      </div>
      <div className="mt-5 grid gap-4">
        {questions.map((question) => (
          <McqCard
            key={question.id}
            question={question}
            selectedAnswer={answers[question.id]}
            onSelect={(value) => onAnswer(question.id, value)}
            showAnswer={Boolean(revealed[question.id])}
          />
        ))}
      </div>
    </div>
  );
}
