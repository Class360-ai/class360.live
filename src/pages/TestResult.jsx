import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw, Home, Trophy, Share2, Lock, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ResultCard from '../components/test/ResultCard';
import ShareResultCard from '../components/ShareResultCard';
import { TEST_ATTEMPT_KEY, TEST_SETUP_KEY, getNextAction } from '../utils/testFlow';
import { getFriendlySubjectLabel } from '../utils/testFlow';
import { getLatestAttempt } from '../utils/testStorage';
import { calculateTestXpEarned, getGamificationSnapshot } from '../utils/gamification';
import { getStreak } from '../utils/planGenerator';
import { useLanguage } from '../context/LanguageContext';
import { isPremiumUser, requestUpgrade } from '../utils/premium';
import { getQuestionExplanation, getTopicBreakdown, NEGATIVE_MARKING } from '../utils/testFlow';
import { getWeakTopicSummary } from '../utils/questionSelector';

function loadAttempt(locationState) {
  if (locationState?.questions?.length) return locationState;
  try {
    const saved = sessionStorage.getItem(TEST_ATTEMPT_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    return null;
  }
  return getLatestAttempt();
}

export default function TestResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const attempt = loadAttempt(location.state);

  const weakTopics = attempt?.weakTopics ?? [];
  const weakTopicSummary = getWeakTopicSummary(attempt).summary;
  const nextAction = getNextAction(attempt?.percentage ?? 0, weakTopics);
  const performanceMessage = attempt?.message || 'Keep going';
  const subjectLabel = getFriendlySubjectLabel(attempt?.subject);
  const difficultyLabel = attempt?.difficulty ? attempt.difficulty.charAt(0).toUpperCase() + attempt.difficulty.slice(1) : '';
  const streak = getStreak();
  const premium = isPremiumUser();
  const wrongQuestions = Array.isArray(attempt?.questions)
    ? attempt.questions.filter(
        (question) =>
          attempt.answers?.[question.id] &&
          attempt.answers?.[question.id] !== question.correctAnswer,
      )
    : [];
  const topicBreakdown = getTopicBreakdown(attempt?.questions || [], attempt?.answers || {});
  const xpEarned = Number(
    attempt?.xpEarned ??
      calculateTestXpEarned({
        percentage: attempt?.percentage || 0,
        streak,
      }),
  );
  const gamification = getGamificationSnapshot({
    attempts: [],
    streak,
    recentScore: attempt?.percentage || 0,
  });

  const retryTest = () => {
    if (!attempt?.subject || !attempt?.difficulty) {
      navigate('/test-series');
      return;
    }
    sessionStorage.setItem(
      TEST_SETUP_KEY,
      JSON.stringify({ subject: attempt.subject, difficulty: attempt.difficulty }),
    );
    navigate('/test', { state: { subject: attempt.subject, difficulty: attempt.difficulty } });
  };

  const tryAnotherSubject = () => {
    sessionStorage.removeItem(TEST_SETUP_KEY);
    navigate('/test-series');
  };

  const backToDashboard = () => navigate('/dashboard');

  const scoreColor = useMemo(() => {
    const pct = attempt?.percentage ?? 0;
    if (pct >= 80) return 'from-emerald-500 to-cyan-500';
    if (pct >= 60) return 'from-blue-500 to-cyan-500';
    if (pct >= 40) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  }, [attempt?.percentage]);

  if (!attempt?.questions?.length && !attempt?.subject) {
    return (
      <section className="section-container py-16">
        <div className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-950">
            {t('result.resultNotFound', 'Result not found')}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {t(
              'result.resultNotFoundSub',
              'We could not find a test result yet. Please start a new test to see your score summary.',
            )}
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

  const completedAt = attempt?.completedAt || attempt?.submittedAt;

  return (
    <section className="section-container py-8 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl space-y-6"
      >
        <div className="glass-card rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
                {t('result.title', 'Test completed')}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-slate-950 sm:text-4xl">
                {subjectLabel} • {difficultyLabel}
              </h1>
              <p className="mt-3 text-sm text-slate-600">
                {performanceMessage} - your session has been evaluated from the submitted answers.
              </p>
            </div>
            <div className={`rounded-[1.5rem] bg-gradient-to-r ${scoreColor} p-5 text-white shadow-premium`}>
              <p className="text-sm text-white/70">{t('result.score', 'Score')}</p>
              <p className="mt-2 font-display text-4xl font-bold">
                {attempt.correct}/{attempt.total}
              </p>
              <p className="mt-3 text-sm text-white/75">+{xpEarned} XP earned</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <ResultCard label={t('result.correct', 'Correct Answers')} value={attempt.correct} />
          <ResultCard label={t('result.wrong', 'Wrong Answers')} value={attempt.wrong} />
          <ResultCard label="Unanswered" value={attempt.unanswered ?? 0} />
          <ResultCard label={t('result.percentage', 'Percentage')} value={`${attempt.percentage}%`} />
          <ResultCard label="Net score" value={attempt.netScore ?? attempt.correct ?? 0} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-card rounded-[2rem] p-6">
            <h2 className="font-display text-2xl font-bold text-slate-950">
              {t('result.weakTopics', 'Weak topics')}
            </h2>
            {weakTopics.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {weakTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                {t('result.noWeakTopics', 'No weak topics detected. Great consistency.')}
              </p>
            )}
            {weakTopicSummary.length ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {weakTopicSummary.map((item) => (
                  <div key={item.topic} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
                    <p className="text-sm font-semibold text-slate-950">{item.topic}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.count} missed answer{item.count > 1 ? 's' : ''}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-6 rounded-3xl bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-700">
                {t('result.suggestion', 'Suggested next action')}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{nextAction}</p>
            </div>
            <div className="mt-4 rounded-3xl bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-700">Negative marking</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Every wrong answer reduces the net score by {NEGATIVE_MARKING} marks, just like many competitive exams.
              </p>
            </div>
            <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                  {premium ? <Sparkles className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                    {premium ? 'Premium analytics' : 'Locked report'}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-slate-950">
                    {premium ? 'Full weak topic report' : 'Unlock the full weak topic report'}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {premium
                  ? 'See deeper topic-level patterns, accuracy by chapter, and smart recommendations for your next test.'
                  : 'Upgrade to Premium to unlock deeper analytics, stronger topic breakdowns, and unlimited AI tests.'}
              </p>
              {!premium ? (
                <button
                  type="button"
                  onClick={() => requestUpgrade('Unlock the full weak topic report, advanced analytics, and unlimited AI tests with Premium.')}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Upgrade Now
                </button>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-premium">
            <p className="text-sm text-white/60">{t('result.summary', 'Performance summary')}</p>
            <h2 className="mt-2 font-display text-3xl font-bold">{performanceMessage}</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              <li className="rounded-2xl bg-white/10 px-4 py-3">Accuracy: {attempt.percentage}%</li>
              <li className="rounded-2xl bg-white/10 px-4 py-3">Net score: {attempt.netScore ?? attempt.correct ?? 0}</li>
              <li className="rounded-2xl bg-white/10 px-4 py-3">XP earned: +{xpEarned}</li>
              <li className="rounded-2xl bg-white/10 px-4 py-3">
                {t('result.submittedOn', 'Submitted on')}:{' '}
                {completedAt ? new Date(completedAt).toLocaleString() : 'Just now'}
              </li>
              <li className="rounded-2xl bg-white/10 px-4 py-3">
                {attempt.autoSubmitted
                  ? t('result.autoSubmitted', 'Auto-submitted when the timer ended.')
                  : t('result.manualSubmitted', 'Submitted manually before timer end.')}
              </li>
            </ul>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Section-wise score</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-slate-950">Topic accuracy breakdown</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {topicBreakdown.map((topic) => (
              <div key={topic.topic} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{topic.topic}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {topic.correct} correct, {topic.wrong} wrong
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {topic.accuracy}%
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"
                    style={{ width: `${topic.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={retryTest}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <RotateCcw className="h-4 w-4" />
            {t('common.retryTest', 'Retry Test')}
          </button>
          <button
            type="button"
            onClick={backToDashboard}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            <Home className="h-4 w-4" />
            {t('common.backToDashboard', 'Back to Dashboard')}
          </button>
          <button
            type="button"
            onClick={tryAnotherSubject}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            <ArrowRight className="h-4 w-4" />
            {t('common.tryAnotherSubject', 'Try Another Subject')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/leaderboard')}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            <Trophy className="h-4 w-4" />
            View Leaderboard
          </button>
        </div>

        {wrongQuestions.length ? (
          <div className="glass-card rounded-[2rem] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Review mistakes</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-slate-950">Why the correct answer works</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {wrongQuestions.map((question) => (
                <div key={question.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-blue-700">{question.topic}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-slate-950">{question.question}</h3>
                  <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <p className="rounded-2xl bg-rose-50 px-4 py-3">
                      Your answer: {attempt.answers?.[question.id] || 'Not answered'}
                    </p>
                    <p className="rounded-2xl bg-emerald-50 px-4 py-3">
                      Correct answer: {question.correctAnswer}
                    </p>
                  </div>
                  <p className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm leading-7 text-slate-700">
                    {getQuestionExplanation(question)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => document.getElementById('share-result-card')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <Share2 className="h-4 w-4" />
            Share Your Result
          </button>
        </div>

        <div id="share-result-card">
          <ShareResultCard
            result={{ ...attempt, xpEarned, streak }}
            onBack={() => navigate('/dashboard')}
          />
        </div>
      </motion.div>
    </section>
  );
}
