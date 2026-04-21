import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminShell from '../../components/admin/AdminShell';
import { buildAdminSlug, getAdminContent, getAdminSubjectById, saveAdminSubject } from '../../utils/adminStorage';

export default function AdminAddSubjectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [content, setContent] = useState(() => getAdminContent());
  const [form, setForm] = useState({
    name: '',
    classLevel: '6',
    description: '',
    slug: '',
    category: '',
    contentLanguage: 'English',
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
      setForm({ name: '', classLevel: '6', description: '', slug: '', category: '', contentLanguage: 'English' });
      return;
    }
    const subject = getAdminSubjectById(editId);
    if (subject) {
      setForm({
        name: subject.name || '',
        classLevel: String(subject.classLevel || '6'),
        description: subject.description || '',
        slug: subject.slug || '',
        category: subject.category || '',
        contentLanguage: subject.contentLanguage || 'English',
      });
    }
  }, [editId]);

  const existingSlugs = useMemo(
    () => content.subjects.filter((subject) => subject.id !== editId && subject.slug !== editId).map((subject) => subject.slug),
    [content.subjects, editId],
  );

  useEffect(() => {
    if (editId) return;
    setForm((prev) => ({
      ...prev,
      slug: prev.name ? buildAdminSlug(prev.name, existingSlugs) : '',
    }));
  }, [editId, existingSlugs, form.name]);

  const handleSubmit = (event) => {
    event.preventDefault();
    saveAdminSubject({
      id: editId || form.slug,
      name: form.name,
      classLevel: form.classLevel,
      description: form.description,
      slug: form.slug,
      category: form.category,
      contentLanguage: form.contentLanguage,
    });
    navigate('/admin/subjects');
  };

  return (
    <AdminShell
      title={editId ? 'Edit Subject' : 'Add Subject'}
      subtitle="Keep subject setup simple so the learning flow stays clean for students."
    >
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="Science"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Class level</span>
            <select
              value={form.classLevel}
              onChange={(event) => setForm((prev) => ({ ...prev, classLevel: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
            >
              {['6', '7', '8'].map((level) => (
                <option key={level} value={level}>
                  Class {level}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
            placeholder="Short subject description"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Category</span>
            <input
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="Career Skills"
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

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Slug</span>
          <input
            value={form.slug}
            readOnly
            className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            {editId ? 'Update Subject' : 'Save Subject'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/subjects')}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Back
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
