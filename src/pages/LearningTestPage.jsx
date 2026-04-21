import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, RotateCcw, Send } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import McqCard from '../components/learning/McqCard';
import {
  getLearningChapterBySlugFromCatalog,
  getLearningSubjectBySlug,
} from '../data/learningSubjectCatalog';
import { saveLearningProgress, saveLearningTest } from '../services/learningApi';
import { getClassLevelLabel, getStoredUser } from '../utils/authStorage';

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function getPerformanceLabel(percent) {
  if (percent >= 80) return 'Excellent';
  if (percent >= 60) return 'Good';
  return 'Needs improvement';
}

export default function LearningTestPage() {
  const navigate = useNavigate();
  const { chapterSlug } = useParams();
  const profile = getStoredUser() || {};
  const classLevel = getClassLevelLabel(profile.classLevel || 6);
  const board = String(profile.board || profile.boardStream || 'CBSE').trim() || 'CBSE';

  const chapter = getLearningChapterBySlugFromCatalog(chapterSlug);
  const subject = getLearningSubjectBySlug(chapter?.subjectSlug || 'science');
  const questions = chapter?.testQuestions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(questions.length ? 420 : 0);
  const [submitted, setSubmitted] = useState(false);
  const [submitSource, setSubmitSource] = useState('manual');
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setSubmitSource('manual');
    setRemainingSeconds(questions.length ? 420 : 0);
    setRunKey((value) => value + 1);
  }, [chapterSlug, questions.length]);

  const results = useMemo(() => {
    const correctCount = questions.filter((item) => answers[item.id] === item.correctAnswer).length;
    const scorePercent = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
    return {
      correctCount,
      scorePercent,
      performance: getPerformanceLabel(scorePercent),
      details: questions.map((item) => ({
        id: item.id,
        question: item.question,
        userAnswer: answers[item.id] || 'Not answered',
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        isCorrect: answers[item.id] === item.correctAnswer,
      })),
    };
  }, [answers, questions]);

  const submitTest = async (source = 'manual') => {
    if (submitted || !questions.length) return;
    setSubmitted(true);
    setSubmitSource(source);
    const completedAt = new Date().toISOString();
    const payload = {
      userId: 'student-001',
      chapterSlug,
      completedAt,
      autoSubmitted: source === 'auto',
      score: results.scorePercent,
      answers,
      questions,
    };

    await saveLearningTest(payload);
    await saveLearningProgress({
      chapterSlug,
      watchedPercent: 100,
      notesRead: true,
      practiceScore: results.scorePercent,
      dppScore: results.scorePercent,
      testScore: results.scorePercent,
      completed: true,
      weakAreas: results.details.filter((item) => !item.isCorrect).map((item) => item.question).slice(0, 3),
      learningMinutes: 45,
    });
  };

  useEffect(() => {
    if (submitted || !questions.length) return undefined;
    if (remainingSeconds <= 0) {
      submitTest('auto');
      return undefined;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [runKey, remainingSeconds, submitted, questions.length]);

  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  if (!chapter) {
    return (
      <section className="section-container py-16">
        <div className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-950">Test not ready</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Open a chapter first, then take its test.
          </p>
          <Link
            to="/learning/dashboard"
            className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to learning
          </Link>
        </div>
      </section>
    );
  }

  if (!questions.length) {
    return (
      <section className="section-container py-16">
        <div className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-950">No questions yet</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This chapter does not have test questions loaded.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="glass-card rounded-[2.25rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Chapter test</p>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{classLevel}</span>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">{board}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{subject.name}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-950 sm:text-4xl">
            Chapter Test: {chapter.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Question-by-question MCQ test with timer, navigation, and instant review after submission.
          </p>
        </div>

        {!submitted ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Timer</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-950">{formatTime(remainingSeconds)}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Submit before time ends.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Question</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-950">
                  {currentIndex + 1} / {questions.length}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Move at your own pace.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Answered</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-950">{answeredCount}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Questions answered so far.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Progress</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-950">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Current question position.</p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
                <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
                  <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
                    <span>
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% complete</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"
                      style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <McqCard
                  key={question?.id}
                  question={question}
                  selectedAnswer={answers[question.id]}
                  onSelect={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
                  showAnswer={false}
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((value) => Math.min(questions.length - 1, value + 1))}
                    disabled={currentIndex === questions.length - 1}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswers({})}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => submitTest('manual')}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-glow"
                  >
                    <Send className="h-4 w-4" />
                    Submit Test
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
                  <p className="text-sm font-semibold text-slate-900">Question Palette</p>
                  <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10 xl:grid-cols-5">
                    {questions.map((item, index) => {
                      const answered = Boolean(answers[item.id]);
                      const active = index === currentIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCurrentIndex(index)}
                          className={`flex h-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                            active
                              ? 'bg-blue-600 text-white shadow-glow'
                              : answered
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Current question</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">{question.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Choose one option. You can change your answer before submitting.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Score</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-950">
                  {results.correctCount} / {questions.length}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{results.scorePercent}% correct</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Performance</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-950">{results.performance}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {submitSource === 'auto' ? 'Auto submitted when timer ended.' : 'Submitted manually.'}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Timer</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-950">{formatTime(remainingSeconds)}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Captured at submission time.</p>
              </div>
            </div>

            <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
              <SectionTitle
                eyebrow="Result review"
                title="Answer review"
                subtitle="See what you picked, what was correct, and the explanation for each question."
              />
              <div className="mt-5 grid gap-4">
                {results.details.map((item, index) => (
                  <div key={item.id} className="rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Question {index + 1}</p>
                        <p className="mt-2 font-semibold text-slate-950">{item.question}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          item.isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {item.isCorrect ? 'Correct' : 'Review'}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm leading-6 text-slate-600 sm:grid-cols-2">
                      <p>
                        Your answer: <span className="font-semibold text-slate-900">{item.userAnswer}</span>
                      </p>
                      <p>
                        Correct answer: <span className="font-semibold text-slate-900">{item.correctAnswer}</span>
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setCurrentIndex(0);
                  setSubmitted(false);
                  setSubmitSource('manual');
                  setRemainingSeconds(questions.length ? 420 : 0);
                  setRunKey((value) => value + 1);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Retry Test
              </button>
              <Link
                to={`/learning/chapters/${chapter.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Back to Chapter
              </Link>
              <Link
                to={`/learning/subjects/${subject.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Continue Learning
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
