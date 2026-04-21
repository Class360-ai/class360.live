import { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import { deleteAdminQuestion, getAdminChapterOptions, getAdminContent, saveAdminQuestion } from '../../utils/adminStorage';

export default function AdminQuestionsPage() {
  const [content, setContent] = useState(() => getAdminContent());
  const [form, setForm] = useState({
    chapterSlug: '',
    type: 'practice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'easy',
  });

  useEffect(() => {
    const sync = () => setContent(getAdminContent());
    sync();
    window.addEventListener('class360-admin-content-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('class360-admin-content-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const chapterOptions = useMemo(() => getAdminChapterOptions(), [content]);

  useEffect(() => {
    if (!form.chapterSlug && chapterOptions[0]) {
      setForm((prev) => ({ ...prev, chapterSlug: chapterOptions[0].slug }));
    }
  }, [chapterOptions, form.chapterSlug]);

  const questionsByChapter = useMemo(() => {
    return (content.questions || []).reduce((acc, question) => {
      if (!acc[question.chapterSlug]) {
        acc[question.chapterSlug] = [];
      }
      acc[question.chapterSlug].push(question);
      return acc;
    }, {});
  }, [content.questions]);

  const handleSubmit = (event) => {
    event.preventDefault();
    saveAdminQuestion({
      chapterSlug: form.chapterSlug,
      type: form.type,
      question: form.question,
      options: form.options,
      correctAnswer: form.correctAnswer,
      explanation: form.explanation,
      difficulty: form.difficulty,
    });
    setContent(getAdminContent());
    setForm((prev) => ({
      ...prev,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
    }));
  };

  const handleDelete = (questionId) => {
    if (!window.confirm('Delete this question?')) return;
    deleteAdminQuestion(questionId);
    setContent(getAdminContent());
  };

  return (
    <AdminShell
      title="Questions"
      subtitle="Manage practice, DPP and test questions for each chapter."
    >
      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Chapter</span>
              <select
                value={form.chapterSlug}
                onChange={(event) => setForm((prev) => ({ ...prev, chapterSlug: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              >
                {chapterOptions.map((chapter) => (
                  <option key={chapter.id || chapter.slug} value={chapter.slug}>
                    {chapter.subjectName} - {chapter.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Type</span>
              <select
                value={form.type}
                onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              >
                {['practice', 'dpp', 'test'].map((type) => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Question</span>
              <textarea
                value={form.question}
                onChange={(event) => setForm((prev) => ({ ...prev, question: event.target.value }))}
                className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                placeholder="Write the question text"
              />
            </label>
            {form.options.map((option, index) => (
              <label key={index} className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Option {index + 1}</span>
                <input
                  value={option}
                  onChange={(event) => {
                    const nextOptions = [...form.options];
                    nextOptions[index] = event.target.value;
                    setForm((prev) => ({ ...prev, options: nextOptions }));
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                />
              </label>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Correct answer</span>
              <input
                value={form.correctAnswer}
                onChange={(event) => setForm((prev) => ({ ...prev, correctAnswer: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                placeholder="Use exact option text"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Difficulty</span>
              <select
                value={form.difficulty}
                onChange={(event) => setForm((prev) => ({ ...prev, difficulty: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              >
                {['easy', 'medium', 'hard'].map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Explanation</span>
            <textarea
              value={form.explanation}
              onChange={(event) => setForm((prev) => ({ ...prev, explanation: event.target.value }))}
              className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="Short explanation"
            />
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Save Question
          </button>
        </form>

        <div className="space-y-4">
          <div className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Saved questions</p>
            <div className="mt-4 space-y-4">
              {chapterOptions.map((chapter) => {
                const chapterQuestions = questionsByChapter[chapter.slug] || [];
                if (!chapterQuestions.length) return null;
                return (
                  <div key={chapter.slug} className="rounded-[1.5rem] bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {chapter.subjectName} - {chapter.title}
                    </p>
                    <div className="mt-3 space-y-3">
                      {chapterQuestions.map((question) => (
                        <div key={question.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{question.type}</p>
                              <p className="mt-1 text-sm font-semibold text-slate-950">{question.question}</p>
                              <p className="mt-1 text-sm text-slate-600">
                                Answer: <span className="font-semibold text-slate-950">{question.correctAnswer}</span>
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDelete(question.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {!content.questions.length ? <p className="text-sm text-slate-600">No questions saved yet.</p> : null}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
