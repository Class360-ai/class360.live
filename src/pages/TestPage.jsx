import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Expand,
  Languages,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TestHeader from '../components/test/TestHeader';
import QuestionCard from '../components/test/QuestionCard';
import ProgressBar from '../components/test/ProgressBar';
import TimerBadge from '../components/test/TimerBadge';
import { saveTestAttempt } from '../utils/testStorage';
import { useLanguage } from '../context/LanguageContext';
import {
  TEST_ATTEMPT_KEY,
  TEST_SETUP_KEY,
  calculateAttempt,
  getFriendlySubjectLabel,
} from '../utils/testFlow';
import { normalizeDifficultyKey, normalizeSubjectKey } from '../data/questions';
import { clearPlanTaskLinks, savePlanProgress } from '../utils/planGenerator';
import { getQuestionsForTest } from '../utils/questionSelector';
import {
  formatDuration,
  fromCanonicalAnswer,
  getTranslatedQuestion,
  supportedTestLanguages,
  toCanonicalAnswer,
} from '../utils/testIntelligence';

const TEST_AUTOSAVE_KEY = 'class360_test_autosave';

function loadSetup(locationState) {
  if (locationState?.subject && locationState?.difficulty) return locationState;
  try {
    const saved = sessionStorage.getItem(TEST_SETUP_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    return null;
  }
  return null;
}

export default function TestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { subject, difficulty, topic, taskId, taskType, fromDailyPlan, isRetake } = location.state || {};
  const setup = loadSetup(location.state);
  const normalizedSubject = normalizeSubjectKey(subject ?? setup?.subject);
  const normalizedDifficulty = normalizeDifficultyKey(difficulty ?? setup?.difficulty);
  const resolvedTaskId = taskId || setup?.taskId || null;
  const resolvedTopic = topic || setup?.topic || null;
  const resolvedTaskType = taskType || setup?.taskType || null;
  const subjectLabel = getFriendlySubjectLabel(normalizedSubject);
  const difficultyLabel = normalizedDifficulty
    ? normalizedDifficulty.charAt(0).toUpperCase() + normalizedDifficulty.slice(1)
    : '';
  const questions = useMemo(() => {
    if (!normalizedSubject || !normalizedDifficulty) return [];
    const selection = getQuestionsForTest({
      subject: normalizedSubject,
      difficulty: normalizedDifficulty,
      topic: resolvedTopic,
      questionCount: setup?.questionCount,
    });
    console.log('TestPage route state', {
      subject: normalizedSubject,
      difficulty: normalizedDifficulty,
      topic: resolvedTopic,
      taskId: resolvedTaskId,
      taskType: resolvedTaskType,
      fromDailyPlan,
      isRetake,
      questionCount: setup?.questionCount || null,
    });
    console.log('Filtered question count', selection.questions.length, 'fallback path used', selection.fallbackPath, 'usedFallback', selection.usedFallback);
    return selection.questions;
  }, [normalizedSubject, normalizedDifficulty, resolvedTopic, resolvedTaskId, resolvedTaskType, fromDailyPlan, isRetake, setup?.questionCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(questions.length * 60);
  const [testLanguage, setTestLanguage] = useState('en');
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [bookmarks, setBookmarks] = useState({});
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    setCurrentIndex(0);
    setRemaining(questions.length * 60);
    setStartedAt(Date.now());
    setBookmarks({});
    submittedRef.current = false;
    try {
      const saved = JSON.parse(localStorage.getItem(TEST_AUTOSAVE_KEY) || '{}');
      const sameTest = saved.subject === normalizedSubject && saved.difficulty === normalizedDifficulty;
      setAnswers(sameTest && saved.answers ? saved.answers : {});
      setBookmarks(sameTest && saved.bookmarks ? saved.bookmarks : {});
      setLastSavedAt(sameTest && saved.savedAt ? saved.savedAt : null);
    } catch {
      setAnswers({});
    }
  }, [questions.length, normalizedSubject, normalizedDifficulty]);

  useEffect(() => {
    if (!questions.length || submittedRef.current) return;
    const payload = {
      subject: normalizedSubject,
      difficulty: normalizedDifficulty,
      answers,
      bookmarks,
      currentIndex,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(TEST_AUTOSAVE_KEY, JSON.stringify(payload));
      setLastSavedAt(payload.savedAt);
    } catch {
      // Autosave is best-effort for private browsing or storage limits.
    }
  }, [answers, bookmarks, currentIndex, normalizedDifficulty, normalizedSubject, questions.length]);

  useEffect(() => {
    if (!questions.length || submittedRef.current) return undefined;
    if (remaining <= 0) {
      submittedRef.current = true;
      handleSubmit(true);
      return undefined;
    }
    const timer = window.setInterval(() => {
      setRemaining((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length, remaining]);

  const currentQuestion = questions[currentIndex];
  const translatedQuestion = useMemo(
    () => getTranslatedQuestion(currentQuestion, testLanguage),
    [currentQuestion, testLanguage],
  );
  const sections = useMemo(() => {
    const grouped = questions.reduce((acc, question, index) => {
      const key = question.topic || 'General';
      if (!acc[key]) acc[key] = { title: key, start: index, count: 0 };
      acc[key].count += 1;
      return acc;
    }, {});
    return Object.values(grouped);
  }, [questions]);
  const answeredCount = useMemo(
    () => questions.filter((question) => Boolean(answers[question.id])).length,
    [answers, questions],
  );
  const bookmarkedCount = useMemo(
    () => Object.values(bookmarks).filter(Boolean).length,
    [bookmarks],
  );

  const updateAnswer = (value) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: toCanonicalAnswer(translatedQuestion, value) }));
  };

  const requestFullscreen = () => {
    const node = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    node.requestFullscreen?.();
  };

  const toggleBookmark = () => {
    if (!currentQuestion) return;
    setBookmarks((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }));
  };

  const handleSubmit = (auto = false) => {
    if (!questions.length) return;
    if (submittedRef.current) return;
    submittedRef.current = true;
    const completedAt = new Date().toISOString();
    const totalSeconds = questions.length * 60;
    const elapsed = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    const attempt = {
      ...setup,
      taskId: resolvedTaskId,
      topic: resolvedTopic,
      autoSubmitted: auto,
      completedAt,
      submittedAt: completedAt,
      timeSpentSeconds: Math.min(totalSeconds, elapsed || totalSeconds - remaining),
      remainingSeconds: remaining,
      language: testLanguage,
      ...calculateAttempt(questions, answers),
      answers,
      questions,
    };
    sessionStorage.setItem(TEST_ATTEMPT_KEY, JSON.stringify(attempt));
    saveTestAttempt(attempt);
    try {
      localStorage.removeItem(TEST_AUTOSAVE_KEY);
    } catch {
      // ignore cleanup failure
    }
    if (resolvedTaskId) {
      console.log('Saving completion for task', resolvedTaskId);
      savePlanProgress(resolvedTaskId, true);
      clearPlanTaskLinks();
    }
    navigate('/test-result', { state: attempt, replace: true });
  };

  if (!normalizedSubject || !normalizedDifficulty) {
    return (
      <section className="section-container py-16">
        <div className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-950">
            Please select subject and difficulty first
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Choose a subject and difficulty from the test series page before starting a test.
          </p>
          <button
            type="button"
            onClick={() => navigate('/test-series')}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
          >
            {t('test.backToSeries', 'Back to Test Series')}
          </button>
        </div>
      </section>
    );
  }

  if (!questions.length) {
    return (
      <section className="section-container py-16">
        <div className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-950">No questions available for this task yet</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This task cannot open a live question set right now. You can return to the dashboard and try another task.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const selectedAnswer = fromCanonicalAnswer(translatedQuestion, answers[currentQuestion?.id]);
  const currentBookmarked = Boolean(bookmarks[currentQuestion?.id]);

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <TestHeader
          subjectLabel={subjectLabel}
          difficultyLabel={difficultyLabel}
          remaining={remaining}
          total={questions.length}
        />

        <div className="glass-card rounded-[2rem] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                Fullscreen exam mode ready
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                Time spent {formatDuration(Math.max(0, Math.round((Date.now() - startedAt) / 1000)))}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Save className="h-4 w-4" />
                Autosaved {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTestLanguage((value) => (value === 'hi' ? 'en' : 'hi'))}
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
              >
                <Languages className="h-4 w-4" />
                🇮🇳 Translate to Hindi
              </button>
              <select
                value={testLanguage}
                onChange={(event) => setTestLanguage(event.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
                aria-label="Choose test language"
              >
                {supportedTestLanguages.map((language) => (
                  <option key={language.key} value={language.key}>
                    {language.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={requestFullscreen}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                <Expand className="h-4 w-4" />
                Fullscreen
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <ProgressBar value={currentIndex + 1} total={questions.length} />
        </div>

        <QuestionCard
          question={translatedQuestion}
          selectedAnswer={selectedAnswer}
          onSelect={updateAnswer}
          language={testLanguage}
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('test.previous', 'Previous')}
            </button>
              <button
              type="button"
              onClick={() => setCurrentIndex((value) => Math.min(questions.length - 1, value + 1))}
              disabled={currentIndex === questions.length - 1}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('test.next', 'Next')}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleBookmark}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                currentBookmarked
                  ? 'bg-amber-100 text-amber-800'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-amber-200 hover:text-amber-700'
              }`}
            >
              {currentBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              Bookmark
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              {t('test.reset', 'Reset Answers')}
            </button>
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              {t('test.submit', 'Submit Test')}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.title}
                type="button"
                onClick={() => setCurrentIndex(section.start)}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {section.title} · {section.count}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => {
              const answered = Boolean(answers[question.id]);
              const active = index === currentIndex;
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`relative h-11 w-11 rounded-full text-sm font-semibold transition ${
                    active
                      ? 'bg-blue-600 text-white shadow-glow'
                      : answered
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {index + 1}
                  {bookmarks[question.id] ? (
                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-amber-400 ring-2 ring-white" />
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>
              {answeredCount}/{questions.length} answered · {bookmarkedCount} bookmarked
            </span>
            <TimerBadge remaining={remaining} />
          </div>
        </div>
      </div>

      {showSubmitConfirm ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm sm:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-premium"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Submit confirmation</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Finish this test?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  You answered {answeredCount} of {questions.length} questions. Your saved answers and bookmarks are ready for analysis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                aria-label="Close submit confirmation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                <p className="font-display text-2xl font-bold text-emerald-700">{answeredCount}</p>
                <p className="text-xs font-semibold text-emerald-700">Answered</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4 text-center">
                <p className="font-display text-2xl font-bold text-slate-700">{questions.length - answeredCount}</p>
                <p className="text-xs font-semibold text-slate-600">Left</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4 text-center">
                <p className="font-display text-2xl font-bold text-amber-700">{bookmarkedCount}</p>
                <p className="text-xs font-semibold text-amber-700">Marked</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Continue test
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-glow"
              >
                Submit and see analytics <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}
