import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginUser, isAuthenticated } from '../utils/authStorage';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setError('');

    if (!form.email.trim() || !form.password.trim()) {
      setError(t('auth.validation.loginFail', 'Please enter your email and password.'));
      return;
    }

    const result = loginUser(form.email, form.password);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate('/dashboard', { replace: true, state: { from: location.state?.from || '/login' } });
  };

  return (
    <section className="section-container py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-premium"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            {t('auth.login.welcome', 'Welcome back')}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold">{t('auth.login.panelTitle', 'Log in to continue your preparation')}</h1>
          <p className="mt-4 text-sm leading-7 text-white/75">
            {t(
              'auth.login.panelSubtitle',
              'Pick up your test history, dashboard insights, and practice recommendations in one clean view.',
            )}
          </p>
          <div className="mt-8 rounded-[1.5rem] bg-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <p className="font-semibold">{t('auth.login.secureSession', 'Secure browser session')}</p>
                <p className="text-sm text-white/70">
                  {t('auth.login.secureSessionSub', 'Auth persists locally until you log out.')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="glass-card rounded-[2rem] p-8"
        >
          <h2 className="font-display text-3xl font-bold text-slate-950">{t('auth.login.title', 'Login')}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t('auth.login.subtitle', 'Use the student account you created on Class360.')}
          </p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('auth.login.email', 'Email')}</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-400"
                  placeholder={t('auth.login.emailPlaceholder', 'student@example.com')}
                  type="email"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('auth.login.password', 'Password')}</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-400"
                  placeholder={t('auth.login.passwordPlaceholder', 'Enter your password')}
                  type="password"
                />
              </div>
            </label>

            {submitted && error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              {t('auth.login.submit', 'Log In')} <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-5 text-sm text-slate-600">
            {t('auth.login.createAccount', 'New here?')}{' '}
            <Link to="/signup" className="font-semibold text-blue-700 hover:text-blue-800">
              {t('auth.signup.submit', 'Create your account')}
            </Link>
          </p>
        </motion.form>
      </div>
    </section>
  );
}
