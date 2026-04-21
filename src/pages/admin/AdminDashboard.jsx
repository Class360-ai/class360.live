import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, FolderPlus, HelpCircle, Layers3, PlusCircle, TrendingUp } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import SectionTitle from '../../components/SectionTitle';
import { getAdminStats } from '../../utils/adminStorage';

export default function AdminDashboard() {
  const [stats, setStats] = useState(() => getAdminStats());

  useEffect(() => {
    const sync = () => setStats(getAdminStats());
    sync();
    window.addEventListener('class360-admin-content-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('class360-admin-content-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const cards = [
    { label: 'Total Subjects', value: stats.totalSubjects, icon: Layers3, note: 'Manage school subject buckets.' },
    { label: 'Total Chapters', value: stats.totalChapters, icon: BookOpen, note: 'Add chapter-wise learning flow.' },
    { label: 'Total Questions', value: stats.totalQuestions, icon: HelpCircle, note: 'Practice, DPP and test banks.' },
    { label: 'Total Notes', value: stats.totalNotes, icon: FileText, note: 'Short revision blocks for chapters.' },
  ];

  const actions = [
    { to: '/admin/subjects/new', label: 'Add Subject', icon: FolderPlus },
    { to: '/admin/chapters/new', label: 'Add Chapter', icon: PlusCircle },
    { to: '/admin/daily-series', label: 'Daily Series', icon: TrendingUp },
    { to: '/admin/notes', label: 'Add Notes', icon: FileText },
    { to: '/admin/questions', label: 'Add Questions', icon: HelpCircle },
  ];

  return (
    <AdminShell
      title="Learning Content Admin"
      subtitle="Manage the school learning content in one place using a simple Class360-style dashboard."
      actions={actions.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-slate-950">{card.value}</p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.note}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card rounded-[2rem] p-5 sm:p-6">
          <SectionTitle
            eyebrow="Quick start"
            title="Common admin actions"
            subtitle="Keep the internal content flow short and easy to manage."
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {actions.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-950 p-3 text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{label}</p>
                    <p className="mt-1 text-sm text-slate-600">Open the content form for this section.</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-5 sm:p-6">
          <SectionTitle
            eyebrow="Access control"
            title="Admin-only panel"
            subtitle="Only the owner email can access these routes in MVP."
          />
          <div className="mt-5 rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Allowed account</p>
            <p className="mt-2 font-display text-2xl font-bold text-slate-950">admin@class360.com</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Non-admin users are redirected back to the homepage to keep the module private.
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
