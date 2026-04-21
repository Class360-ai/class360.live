import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Languages, Mail, Lock, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPostAuthRoute, getStoredUser, signupUser, isAuthenticated, updateStoredUser } from '../utils/authStorage';
import { useLanguage } from '../context/LanguageContext';

const classGoals = ['IIT JEE', 'NEET', 'SSC', 'Banking', 'Board Exams', 'Foundation', 'Olympiad', 'CUET'];
const boardStreams = ['CBSE', 'ICSE', 'State Board', 'Science', 'Commerce', 'Arts'];
const languages = ['Hindi', 'English'];

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    classGoal: '',
    boardStream: '',
    preferredLanguage: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showClassStep, setShowClassStep] = useState(false);
  const [selectedClassLevel, setSelectedClassLevel] = useState('6');
  const [pendingSchoolUser, setPendingSchoolUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(getPostAuthRoute(getStoredUser()), { replace: true });
    }
  }, [navigate]);

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = t('auth.validation.fullName', 'Please enter your full name.');
    if (!form.email.trim()) nextErrors.email = t('auth.validation.emailRequired', 'Please enter your email address.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = t('auth.validation.emailInvalid', 'Please enter a valid email address.');
    if (!form.password.trim()) nextErrors.password = t('auth.validation.passwordRequired', 'Please create a password.');
    if (!form.confirmPassword.trim()) nextErrors.confirmPassword = t('auth.validation.confirmPasswordRequired', 'Please confirm your password.');
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = t('auth.validation.passwordMismatch', 'Passwords do not match.');
    if (!form.classGoal) nextErrors.classGoal = t('auth.validation.classGoal', 'Please choose your class or exam goal.');
    if (!form.boardStream) nextErrors.boardStream = t('auth.validation.boardStream', 'Please select your board or stream.');
    if (!form.preferredLanguage) nextErrors.preferredLanguage = t('auth.validation.preferredLanguage', 'Please select a preferred language.');
    return nextErrors;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const user = signupUser({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      classGoal: form.classGoal,
      boardStream: form.boardStream,
      preferredLanguage: form.preferredLanguage,
    });

    if (user.studentType === 'school') {
      setPendingSchoolUser(user);
      setSelectedClassLevel(String(user.classLevel || 6));
      setShowClassStep(true);
      return;
    }

    navigate(getPostAuthRoute(user), { replace: true });
  };

  const finalizeSchoolSignup = () => {
    const classLevel = Number(selectedClassLevel) || 6;
    const updatedUser = updateStoredUser({ classLevel });
    setShowClassStep(false);
    setPendingSchoolUser(null);
    navigate(getPostAuthRoute(updatedUser || pendingSchoolUser), { replace: true });
  };

  const fieldClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400';

  return (
    <section className="section-container py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="glass-card rounded-[2rem] p-8"
        >
          <h1 className="font-display text-4xl font-bold text-slate-950">{t('auth.signup.title', 'Create your Class360 profile')}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {t(
              'auth.signup.subtitle',
              'Set up your student profile to personalize the dashboard and unlock protected practice flows.',
            )}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('auth.signup.fullName', 'Full Name')}</span>
              <div className="relative">
                <UserPlus className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  className={`${fieldClass} pl-11`}
                  placeholder="Your full name"
                />
              </div>
              {submitted && errors.fullName ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.fullName}</p> : null}
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('auth.signup.email', 'Email')}</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className={`${fieldClass} pl-11`}
                  placeholder="student@example.com"
                  type="email"
                />
              </div>
              {submitted && errors.email ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.email}</p> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('auth.signup.password', 'Password')}</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  className={`${fieldClass} pl-11`}
                  placeholder={t('auth.signup.password', 'Create a password')}
                  type="password"
                />
              </div>
              {submitted && errors.password ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.password}</p> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('auth.signup.confirmPassword', 'Confirm Password')}</span>
              <input
                value={form.confirmPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                className={fieldClass}
                placeholder={t('auth.signup.confirmPassword', 'Confirm your password')}
                type="password"
              />
              {submitted && errors.confirmPassword ? (
                <p className="mt-2 text-xs font-medium text-rose-600">{errors.confirmPassword}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('auth.signup.classGoal', 'Class / Exam Goal')}</span>
              <select
                value={form.classGoal}
                onChange={(event) => setForm((prev) => ({ ...prev, classGoal: event.target.value }))}
                className={fieldClass}
              >
                <option value="">{t('auth.validation.classGoal', 'Select goal')}</option>
                {classGoals.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
              {submitted && errors.classGoal ? <p className="mt-2 text-xs font-medium text-rose-600">{errors.classGoal}</p> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('auth.signup.boardStream', 'Board / Stream')}</span>
              <select
                value={form.boardStream}
                onChange={(event) => setForm((prev) => ({ ...prev, boardStream: event.target.value }))}
                className={fieldClass}
              >
                <option value="">{t('auth.validation.boardStream', 'Select board / stream')}</option>
                {boardStreams.map((stream) => (
                  <option key={stream} value={stream}>
                    {stream}
                  </option>
                ))}
              </select>
              {submitted && errors.boardStream ? (
                <p className="mt-2 text-xs font-medium text-rose-600">{errors.boardStream}</p>
              ) : null}
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t('auth.signup.preferredLanguage', 'Preferred Language')}</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {languages.map((language) => {
                  const active = form.preferredLanguage === language;
                  return (
                    <button
                      key={language}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, preferredLanguage: language }))}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        active
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{language}</span>
                        <Languages className="h-4 w-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
              {submitted && errors.preferredLanguage ? (
                <p className="mt-2 text-xs font-medium text-rose-600">{errors.preferredLanguage}</p>
              ) : null}
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            {t('auth.signup.submit', 'Create Account')} <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-5 text-sm text-slate-600">
            {t('auth.signup.loginLink', 'Already have an account?')}{' '}
            <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              {t('auth.login.submit', 'Log in')}
            </Link>
          </p>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-8 text-white shadow-premium"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Student profile</p>
          <h2 className="mt-4 font-display text-4xl font-bold">{t('auth.signup.panelTitle', 'Your dashboard starts personalized')}</h2>
          <p className="mt-4 text-sm leading-7 text-white/85">
            {t(
              'auth.signup.panelSubtitle',
              'We save your student profile locally for a smooth login experience, personalized dashboard cards, and protected test access.',
            )}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              'Full student profile storage',
              'Protected dashboard and test access',
              'Language and goal preferences',
              'Login persistence in the browser',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/85">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[1.5rem] bg-white/10 p-5">
            <p className="text-sm text-white/70">Ready for the next step?</p>
            <p className="mt-2 font-display text-2xl font-bold">{t('auth.signup.optionHint', 'Sign up, log in, and start practicing.')}</p>
          </div>
        </motion.div>
      </div>

      {showClassStep ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-premium"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">School student</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">Select class</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose the class for this student profile. If you skip this step, Class 6 will be used for the MVP.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {['6', '7', '8'].map((classValue) => {
                const active = selectedClassLevel === classValue;
                return (
                  <button
                    key={classValue}
                    type="button"
                    onClick={() => setSelectedClassLevel(classValue)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                    }`}
                  >
                    Class {classValue}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={finalizeSchoolSignup}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={finalizeSchoolSignup}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                Use Class 6
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}
