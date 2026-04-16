import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RefreshCw, Send } from 'lucide-react';
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
  const submittedRef = useRef(false);

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    setRemaining(questions.length * 60);
    submittedRef.current = false;
  }, [questions.length]);

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

  const updateAnswer = (value) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleSubmit = (auto = false) => {
    if (!questions.length) return;
    if (submittedRef.current) return;
    submittedRef.current = true;
    const completedAt = new Date().toISOString();
    const attempt = {
      ...setup,
      taskId: resolvedTaskId,
      topic: resolvedTopic,
      autoSubmitted: auto,
      completedAt,
      submittedAt: completedAt,
      ...calculateAttempt(questions, answers),
      answers,
      questions,
    };
    sessionStorage.setItem(TEST_ATTEMPT_KEY, JSON.stringify(attempt));
    saveTestAttempt(attempt);
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
  const selectedAnswer = answers[currentQuestion?.id];

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
          <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <ProgressBar value={currentIndex + 1} total={questions.length} />
        </div>

        <QuestionCard question={currentQuestion} selectedAnswer={selectedAnswer} onSelect={updateAnswer} />

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
              onClick={() => handleSubmit(false)}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              {t('test.submit', 'Submit Test')}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => {
              const answered = Boolean(answers[question.id]);
              const active = index === currentIndex;
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-11 w-11 rounded-full text-sm font-semibold transition ${
                    active
                      ? 'bg-blue-600 text-white shadow-glow'
                      : answered
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>{t('test.answeredHint', 'Answered questions stay selected while you navigate.')}</span>
            <TimerBadge remaining={remaining} />
          </div>
        </div>
      </div>
    </section>
  );
}
