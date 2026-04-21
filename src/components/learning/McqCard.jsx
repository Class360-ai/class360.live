import { CheckCircle2 } from 'lucide-react';

export default function McqCard({ question, selectedAnswer, onSelect, showAnswer = false }) {
  if (!question) return null;

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-semibold text-slate-950">{question.question}</h4>
        {showAnswer && selectedAnswer === question.correctAnswer ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Correct
          </span>
        ) : null}
      </div>
      <div className="mt-4 grid gap-2">
        {question.options.map((option) => {
          const active = selectedAnswer === option;
          const isCorrect = showAnswer && option === question.correctAnswer;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                active
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50'
              } ${isCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showAnswer ? <p className="mt-4 text-sm leading-6 text-slate-600">{question.explanation}</p> : null}
    </div>
  );
}
