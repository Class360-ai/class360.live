import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, PlusCircle, Trash2 } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import { deleteAdminChapter, getAdminContent } from '../../utils/adminStorage';

export default function AdminChaptersPage() {
  const [content, setContent] = useState(() => getAdminContent());

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

  const handleDelete = (chapterId) => {
    if (!window.confirm('Delete this chapter and its related notes and questions?')) return;
    deleteAdminChapter(chapterId);
    setContent(getAdminContent());
  };

  return (
    <AdminShell
      title="Chapters"
      subtitle="Manage chapter titles, video links, order and learning objectives."
      actions={[
        <Link
          key="new"
          to="/admin/chapters/new"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          <PlusCircle className="h-4 w-4" />
          Add Chapter
        </Link>,
      ]}
    >
      <div className="grid gap-4">
        {(content.chapters || []).length ? (
          content.chapters
            .slice()
            .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
            .map((chapter) => (
              <div key={chapter.id || chapter.slug} className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{chapter.subjectName}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">{chapter.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{chapter.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Order {chapter.order || 0}
                      </span>
                      {chapter.level ? (
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                          {chapter.level}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {chapter.duration || '08 min'}
                      </span>
                      {chapter.contentLanguage ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {chapter.contentLanguage}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {chapter.slug}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/admin/chapters/new?edit=${encodeURIComponent(chapter.id || chapter.slug)}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(chapter.id || chapter.slug)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="rounded-[1.9rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            No chapters found yet.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
