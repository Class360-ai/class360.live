import { useEffect, useMemo, useState } from 'react';
import AdminShell from '../../components/admin/AdminShell';
import { getAdminChapterOptions, getAdminContent, saveAdminNotes } from '../../utils/adminStorage';

function parseSummaryPoints(text) {
  return String(text || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseKeyTerms(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [term, ...rest] = line.split('|');
      return {
        term: String(term || '').trim(),
        meaning: String(rest.join('|') || '').trim(),
      };
    })
    .filter((item) => item.term || item.meaning);
}

export default function AdminNotesPage() {
  const [content, setContent] = useState(() => getAdminContent());
  const [form, setForm] = useState({
    chapterSlug: '',
    summaryPoints: '',
    keyTerms: '',
    examples: '',
    revisionBox: '',
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

  const selectedNote = content.notes.find((note) => note.chapterSlug === form.chapterSlug) || null;

  useEffect(() => {
    if (!selectedNote) return;
    setForm((prev) => ({
      ...prev,
      summaryPoints: (selectedNote.summaryPoints || []).join('\n'),
      keyTerms: (selectedNote.keyTerms || [])
        .map((item) => `${item.term || ''} | ${item.meaning || ''}`.trim())
        .join('\n'),
      examples: (selectedNote.examples || []).join('\n'),
      revisionBox: selectedNote.revisionBox || '',
    }));
  }, [selectedNote?.chapterSlug]);

  const handleSubmit = (event) => {
    event.preventDefault();
    saveAdminNotes(form.chapterSlug, {
      summaryPoints: parseSummaryPoints(form.summaryPoints),
      keyTerms: parseKeyTerms(form.keyTerms),
      examples: parseSummaryPoints(form.examples),
      revisionBox: form.revisionBox,
    });
    setContent(getAdminContent());
  };

  return (
    <AdminShell
      title="Notes"
      subtitle="Store short revision notes for each chapter in a clean, structured format."
    >
      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
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
            <span className="text-sm font-semibold text-slate-700">Summary points</span>
            <textarea
              value={form.summaryPoints}
              onChange={(event) => setForm((prev) => ({ ...prev, summaryPoints: event.target.value }))}
              className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="One bullet per line"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Key terms</span>
            <textarea
              value={form.keyTerms}
              onChange={(event) => setForm((prev) => ({ ...prev, keyTerms: event.target.value }))}
              className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="Term | Meaning"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Examples</span>
            <textarea
              value={form.examples}
              onChange={(event) => setForm((prev) => ({ ...prev, examples: event.target.value }))}
              className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="One example per line"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Revision box</span>
            <textarea
              value={form.revisionBox}
              onChange={(event) => setForm((prev) => ({ ...prev, revisionBox: event.target.value }))}
              className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="Short quick revision note"
            />
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Save Notes
          </button>
        </form>

        <div className="space-y-4">
          <div className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Saved notes</p>
            <div className="mt-4 grid gap-3">
              {content.notes.length ? (
                content.notes.map((note) => {
                  const chapter = chapterOptions.find((item) => item.slug === note.chapterSlug);
                  return (
                    <div key={note.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-950">{chapter ? chapter.title : note.chapterSlug}</p>
                      <p className="mt-1 text-sm text-slate-600">{note.summaryPoints.length} summary points</p>
                      <p className="mt-1 text-sm text-slate-600">{note.keyTerms.length} key terms</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-600">No notes saved yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
