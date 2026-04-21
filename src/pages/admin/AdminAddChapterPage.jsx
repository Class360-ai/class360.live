import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminShell from '../../components/admin/AdminShell';
import { buildAdminSlug, getAdminChapterById, getAdminContent, saveAdminChapter } from '../../utils/adminStorage';

function parseObjectives(value) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminAddChapterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [content, setContent] = useState(() => getAdminContent());
  const [form, setForm] = useState({
    subjectId: '',
    title: '',
    slug: '',
    description: '',
    videoUrl: '',
    duration: '',
    order: 1,
    objectivesText: '',
    thumbnail: '',
    level: 'Core',
    contentLanguage: 'English',
    quizFocus: '',
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

  useEffect(() => {
    if (!editId) {
        setForm({
          subjectId: content.subjects[0]?.slug || '',
          title: '',
          slug: '',
          description: '',
          videoUrl: '',
          duration: '',
          order: 1,
          objectivesText: '',
          thumbnail: '',
          level: 'Core',
          contentLanguage: 'English',
          quizFocus: '',
        });
        return;
      }

    const chapter = getAdminChapterById(editId);
    if (chapter) {
        setForm({
          subjectId: chapter.subjectId || chapter.subjectSlug || content.subjects[0]?.slug || '',
          title: chapter.title || '',
          slug: chapter.slug || '',
          description: chapter.description || '',
          videoUrl: chapter.videoUrl || '',
          duration: chapter.duration || '',
          order: Number(chapter.order || 1),
          objectivesText: (chapter.objectives || []).join('\n'),
          thumbnail: chapter.thumbnail || '',
          level: chapter.level || 'Core',
          contentLanguage: chapter.contentLanguage || 'English',
          quizFocus: chapter.quizFocus || '',
        });
      }
  }, [content.subjects, editId]);

  const existingSlugs = useMemo(
    () => content.chapters.filter((chapter) => chapter.id !== editId && chapter.slug !== editId).map((chapter) => chapter.slug),
    [content.chapters, editId],
  );

  useEffect(() => {
    if (editId) return;
    setForm((prev) => ({
      ...prev,
      slug: prev.title ? buildAdminSlug(prev.title, existingSlugs) : '',
    }));
  }, [editId, existingSlugs, form.title]);

  const handleSubmit = (event) => {
    event.preventDefault();
    saveAdminChapter({
      id: editId || form.slug,
      subjectId: form.subjectId,
      title: form.title,
      slug: form.slug,
      description: form.description,
      videoUrl: form.videoUrl,
      duration: form.duration,
      order: form.order,
      objectives: parseObjectives(form.objectivesText),
      thumbnail: form.thumbnail,
      level: form.level,
      contentLanguage: form.contentLanguage,
      quizFocus: form.quizFocus,
    });
    navigate('/admin/chapters');
  };

  return (
    <AdminShell
      title={editId ? 'Edit Chapter' : 'Add Chapter'}
      subtitle="Keep the chapter form simple so the learning flow remains easy to maintain."
    >
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Subject</span>
            <select
              value={form.subjectId}
              onChange={(event) => setForm((prev) => ({ ...prev, subjectId: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
            >
              {(content.subjects || []).map((subject) => (
                <option key={subject.id || subject.slug} value={subject.slug}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="Food: Where Does It Come From?"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Slug</span>
            <input
              value={form.slug}
              readOnly
              className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Duration</span>
            <input
              value={form.duration}
              onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="08 min"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Video URL</span>
            <input
              value={form.videoUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="https://www.youtube.com/embed/..."
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Order</span>
            <input
              type="number"
              min="1"
              value={form.order}
              onChange={(event) => setForm((prev) => ({ ...prev, order: Number(event.target.value || 1) }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Thumbnail URL</span>
            <input
              value={form.thumbnail}
              onChange={(event) => setForm((prev) => ({ ...prev, thumbnail: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="https://images.unsplash.com/..."
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Content language</span>
            <input
              value={form.contentLanguage}
              onChange={(event) => setForm((prev) => ({ ...prev, contentLanguage: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="English + Hinglish"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Level</span>
            <input
              value={form.level}
              onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="Beginner"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Quiz focus</span>
            <input
              value={form.quizFocus}
              onChange={(event) => setForm((prev) => ({ ...prev, quizFocus: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="Money habits"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
            placeholder="Short chapter description"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Learning objectives</span>
          <textarea
            value={form.objectivesText}
            onChange={(event) => setForm((prev) => ({ ...prev, objectivesText: event.target.value }))}
            className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
            placeholder="One objective per line"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            {editId ? 'Update Chapter' : 'Save Chapter'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/chapters')}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Back
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
