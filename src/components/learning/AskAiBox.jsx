import { useState } from 'react';
import { MessageCircleQuestion, Sparkles } from 'lucide-react';

function buildMockResponse(question, context) {
  const normalized = String(question || '').toLowerCase();
  const chapterTitle = String(context?.chapterTitle || '').trim();
  const subjectName = String(context?.subjectName || '').trim();
  const classLevel = String(context?.classLevel || 'Class 6').trim();

  if (normalized.includes('herbivore')) {
    return 'Herbivore wo jaanwar hote hain jo paudhe khate hain, jaise gai aur hiran.';
  }

  if (normalized.includes('food source') || normalized.includes('food sources') || normalized.includes('food kahan se')) {
    return 'Food sources ka matlab hota hai khana kahan se aata hai. Yeh plants, animals aur other natural sources se aa sakta hai.';
  }

  if (normalized.includes('explanation') || normalized.includes('matlab') || normalized.includes('meaning')) {
    return `Is topic ko simple tareeke se dekho: ${chapterTitle || subjectName || 'yeh concept'} ka main idea step by step samajhna hai.`;
  }

  if (normalized.includes('class')) {
    return `${classLevel} level par hum simple examples aur real-life cases se concept samajhte hain.`;
  }

  return `Good question! ${chapterTitle || subjectName || 'Is topic'} ko simple tarike se samjho: video dekho, notes padho, phir practice karo.`;
}

async function askAiDoubt(question, context) {
  // Future-ready placeholder for a real API call like POST /api/ai/doubt
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(buildMockResponse(question, context));
    }, 1200);
  });
}

export default function AskAiBox({ chapterTitle, subjectName, classLevel }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async () => {
    const question = value.trim();
    if (!question || loading) return;

    setLoading(true);
    setResponse('');

    const answer = await askAiDoubt(question, { chapterTitle, subjectName, classLevel });
    const nextEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      question,
      answer,
    };

    setHistory((prev) => [nextEntry, ...prev].slice(0, 3));
    setResponse(answer);
    setValue('');
    setLoading(false);
  };

  return (
    <div className="rounded-[2.25rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-premium sm:p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-white/10 p-3 text-white">
          <MessageCircleQuestion className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Ask AI Teacher</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
              Friendly doubt support
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold">Ask your doubt</h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            Type your doubt in simple language. We&apos;ll answer like a friendly teacher using this chapter context.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Type your doubt... (e.g., Herbivore ka matlab kya hai?)"
              className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Thinking...' : 'Ask AI'}
              <Sparkles className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 min-h-[4.5rem] rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/85">
            {loading ? 'Thinking...' : response ? (
              <>
                <p className="font-semibold text-white/90">AI Teacher:</p>
                <p className="mt-1">{response}</p>
              </>
            ) : (
              <p className="text-white/60">Your answer will appear here.</p>
            )}
          </div>

          {history.length ? (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Recent doubts</p>
              {history.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/85">
                  <p className="font-semibold text-white/90">Student: {item.question}</p>
                  <p className="mt-1">AI Teacher: {item.answer}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
