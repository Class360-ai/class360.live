import { Facebook, Instagram, Linkedin, Sparkles, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { navLinks } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-white/70">
      <div className="section-container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl font-bold">Class360</p>
                <p className="text-sm text-slate-600">{t('brand.tagline', 'Smart Learning. Real Results.')}</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              An AI-powered learning platform built for ambitious school students and exam aspirants
              who want smarter practice, reliable mentoring, and measurable growth.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              {t('footer.quickLinks', 'Quick Links')}
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link to="/dashboard" className="text-sm text-slate-600 hover:text-blue-700">
                {t('nav.dashboard', 'Dashboard')}
              </Link>
              {navLinks.slice(0, 8).map((link) => (
                <Link key={link.href} to={link.href} className="text-sm text-slate-600 hover:text-blue-700">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              {t('footer.examLinks', 'Exam Links')}
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {['IIT JEE', 'NEET', 'SSC', 'Banking', 'Boards', 'CUET'].map((item) => (
                <span key={item} className="text-sm text-slate-600">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
              {t('footer.contact', 'Contact')}
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                support@class360.live
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Bengaluru, Karnataka, India
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-5 border-t border-slate-200/70 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Class360. Designed for serious learning.</p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="rounded-full border border-slate-200 p-2 hover:border-blue-200 hover:text-blue-700"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="rounded-full border border-slate-200 p-2 hover:border-blue-200 hover:text-blue-700"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="rounded-full border border-slate-200 p-2 hover:border-blue-200 hover:text-blue-700"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="rounded-full border border-slate-200 p-2 hover:border-blue-200 hover:text-blue-700"
              aria-label="YouTube"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
