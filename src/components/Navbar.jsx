import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Sparkles, LogOut, LayoutDashboard, Languages } from 'lucide-react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../utils/classNames';
import { navLinks } from '../data/siteData';
import { getStoredUser, isAuthenticated, logoutUser } from '../utils/authStorage';
import { useLanguage } from '../context/LanguageContext';
import { isPremiumUser } from '../utils/premium';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(() => getStoredUser());
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());
  const [premium, setPremium] = useState(() => isPremiumUser());
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const navKeyForHref = (href) => {
    const map = {
      '/': 'home',
      '/courses': 'courses',
      '/test-series': 'testSeries',
      '/results': 'results',
      '/educators': 'educators',
      '/dashboard': 'dashboard',
      '/about': 'about',
      '/contact': 'contact',
    };
    return map[href] || 'home';
  };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      setUser(getStoredUser());
      setAuthenticated(isAuthenticated());
    };
    const syncPremium = () => setPremium(isPremiumUser());
    window.addEventListener('class360-auth-changed', syncAuth);
    window.addEventListener('storage', syncAuth);
    window.addEventListener('class360-premium-changed', syncPremium);
    return () => {
      window.removeEventListener('class360-auth-changed', syncAuth);
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('class360-premium-changed', syncPremium);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-white/80 bg-white/82 shadow-[0_10px_40px_-22px_rgba(15,23,42,0.32)] backdrop-blur-2xl'
          : 'border-white/70 bg-white/65 backdrop-blur-xl'
      }`}
    >
      <div className="section-container flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-bold leading-none text-slate-950">Class360</p>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              {t('brand.tagline', 'Smart Learning. Real Results.')}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.slice(0, 9).map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'text-sm font-semibold transition-colors hover:text-blue-700',
                  isActive ? 'text-blue-700' : 'text-slate-600',
                )
              }
            >
              {t(`nav.${navKeyForHref(item.href)}`, item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            {language === 'en' ? t('common.en', 'EN') : t('common.hi', 'हिन्दी')}
          </button>
          {premium ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              <Sparkles className="h-4 w-4" />
              Premium
            </span>
          ) : null}
          {authenticated ? (
            <>
              <span className="hidden rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 xl:inline-flex">
                Hi, {user?.fullName?.split(' ')?.[0] || 'Student'}
              </span>
              <NavLink
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                <LayoutDashboard className="h-4 w-4" />
                {t('nav.dashboard', 'Dashboard')}
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                {t('nav.logout', 'Logout')}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {t('nav.login', 'Log in')}
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {t('nav.signup', 'Get Started')}
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.22 }}
            className="border-t border-slate-100 bg-white lg:hidden"
          >
            <div className="section-container grid gap-2 py-4">
              {navLinks.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50',
                    )
                  }
                >
                  {t(`nav.${navKeyForHref(item.href)}`, item.label)}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={toggleLanguage}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                <Languages className="h-4 w-4" />
                {language === 'en' ? t('common.hi', 'हिन्दी') : t('common.en', 'EN')}
              </button>
              {premium ? (
                <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                  <Sparkles className="mr-2 inline-block h-4 w-4" />
                  Premium
                </div>
              ) : null}
              <div className="mt-2 grid grid-cols-2 gap-3">
                {authenticated ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                    >
                      {t('nav.dashboard', 'Dashboard')}
                    </NavLink>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      {t('nav.logout', 'Logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                    >
                      {t('nav.login', 'Log in')}
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      {t('nav.signup', 'Sign up')}
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
