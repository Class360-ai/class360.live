import { Link, useLocation } from 'react-router-dom';
import SectionTitle from '../SectionTitle';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/subjects', label: 'Subjects' },
  { to: '/admin/chapters', label: 'Chapters' },
  { to: '/admin/daily-series', label: 'Daily Series' },
  { to: '/admin/notes', label: 'Notes' },
  { to: '/admin/questions', label: 'Questions' },
];

export default function AdminShell({ eyebrow = 'Admin panel', title, subtitle, actions, children }) {
  const location = useLocation();

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="space-y-6">
        <div className="glass-card rounded-[2.25rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{eyebrow}</p>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Internal</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-950 sm:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{subtitle}</p> : null}
          {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        <div className="rounded-[1.9rem] border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>{children}</div>
      </div>
    </section>
  );
}
