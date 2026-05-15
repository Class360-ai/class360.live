import { motion } from 'framer-motion';
import { getQuestionExplanation } from '../../utils/testFlow';

export default function QuestionCard({ question, selectedAnswer, onSelect, language = 'en' }) {
  if (!question) {
    return (
      <div className="glass-card rounded-[2rem] p-6">
        <p className="text-slate-600">Question data is unavailable.</p>
      </div>
    );
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[2rem] p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">{question.topic}</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">
            {question.question}
          </h2>
          {question.aiTranslationPending ? (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
              Production will call the AI translation API for {language}; this preview preserves the live exam state.
            </p>
          ) : null}
        </div>
        <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-white">
          {question.subject}
        </span>
      </div>

      <div className="mt-6 grid gap-3">
        {question.options.map((option) => {
          const active = selectedAnswer === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                active
                  ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedAnswer ? (
        <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-7 text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Quick explanation</p>
          <p className="mt-2">{getQuestionExplanation(question)}</p>
        </div>
      ) : null}
    </motion.div>
  );
}
