import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpenText, Headphones, Lock, PlayCircle, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  NOTES_COMPLETION_SECONDS,
  PODCAST_COMPLETION_PERCENT,
  QUIZ_PASS_PERCENT,
  VIDEO_COMPLETION_PERCENT,
  isDayCompleted,
} from '../../utils/sequentialCourseRules';
import { useSequentialCourse } from '../../context/SequentialCourseContext';
import CompletionCelebration from './CompletionCelebration';
import ResultScreen from './ResultScreen';

function RequirementPill({ label, complete }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {complete ? 'Completed' : 'Pending'} | {label}
    </span>
  );
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function getQuizOutcome(quiz, answers, elapsedSeconds) {
  const total = quiz.length || 1;
  const weakAreas = [];
  let correct = 0;

  quiz.forEach((question) => {
    if (answers[question.id] === question.correctAnswer) {
      correct += 1;
    } else {
      weakAreas.push(question.question);
    }
  });

  const score = Math.round((correct / total) * 100);
  return {
    score,
    accuracy: score,
    timeTaken: elapsedSeconds,
    weakAreas: weakAreas.slice(0, 3),
  };
}

export default function DayLessonPage({ day }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const quizStartedAtRef = useRef(Date.now());
  const notesActiveRef = useRef(false);
  const completionTriggeredRef = useRef(false);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [videoProgress, setVideoProgress] = useState(Number(day?.progress?.videoProgress || 0));
  const [notesOpened, setNotesOpened] = useState(Boolean(day?.progress?.notesOpened));
  const [notesTime, setNotesTime] = useState(Number(day?.progress?.notesTime || 0));
  const [podcastProgress, setPodcastProgress] = useState(Number(day?.progress?.podcastProgress || 0));
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [error, setError] = useState('');
  const { dashboard, saving, trackNotes, trackPodcast, trackQuiz, trackVideo } = useSequentialCourse();

  useEffect(() => {
    setVideoProgress(Number(day?.progress?.videoProgress || 0));
    setNotesOpened(Boolean(day?.progress?.notesOpened));
    setNotesTime(Number(day?.progress?.notesTime || 0));
    setPodcastProgress(Number(day?.progress?.podcastProgress || 0));
    setAnswers({});
    setQuizResult(null);
    setShowCelebrate(false);
    setError('');
    notesActiveRef.current = false;
    completionTriggeredRef.current = Boolean(day?.progress?.isCompleted);
    quizStartedAtRef.current = Date.now();
  }, [day?.dayNumber, day?.progress?.isCompleted, day?.progress?.notesOpened, day?.progress?.notesTime, day?.progress?.podcastProgress, day?.progress?.videoProgress]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!notesActiveRef.current) return;
      setNotesTime((current) => current + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [day?.dayNumber]);

  useEffect(() => {
    if (!notesOpened || day?.progress?.isCompleted) return undefined;
    const timeout = window.setTimeout(() => {
      trackNotes({
        dayNumber: day.dayNumber,
        notesOpened: true,
        notesTime,
      }).catch((requestError) => setError(requestError.message || 'Unable to track notes'));
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [day?.dayNumber, day?.progress?.isCompleted, notesOpened, notesTime, trackNotes]);

  const quizScore = quizResult?.score ?? Number(day?.progress?.quizScore || 0);
  const videoComplete = videoProgress >= VIDEO_COMPLETION_PERCENT;
  const notesComplete = notesOpened;
  const podcastComplete = podcastProgress >= PODCAST_COMPLETION_PERCENT;
  const quizPassed = Boolean(quizResult) || Boolean(day?.progress?.quizAttempted);
  const allComplete = isDayCompleted({
    videoProgress,
    notesOpened,
    notesTime,
    podcastProgress,
    quizScore,
    quizAttempted: quizPassed,
  });
  const nextUnlockedDay = Math.min((day?.dayNumber || 1) + 1, dashboard.totalDays || 365);

  useEffect(() => {
    if (!allComplete || completionTriggeredRef.current || day?.progress?.isCompleted) return;
    completionTriggeredRef.current = true;
    setShowCelebrate(true);
    const timeout = window.setTimeout(() => {
      setShowCelebrate(false);
      navigate(day.dayNumber >= 365 ? '/sequential-course' : `/sequential-course/day/${nextUnlockedDay}`);
    }, 1800);
    return () => window.clearTimeout(timeout);
  }, [allComplete, day?.dayNumber, day?.progress?.isCompleted, navigate, nextUnlockedDay]);

  const handleVideoProgress = async () => {
    const player = videoRef.current;
    if (!player?.duration) return;
    const nextProgress = Math.min(100, Math.round((player.currentTime / player.duration) * 100));
    if (nextProgress <= videoProgress) return;
    setVideoProgress(nextProgress);
    if (nextProgress >= VIDEO_COMPLETION_PERCENT || nextProgress % 10 === 0) {
      try {
        await trackVideo({
          dayNumber: day.dayNumber,
          videoProgress: nextProgress,
        });
      } catch (requestError) {
        setError(requestError.message || 'Unable to track video progress');
      }
    }
  };

  const handleNotesOpen = async () => {
    notesActiveRef.current = true;
    setNotesOpened(true);
    window.open(day.notesUrl, '_blank', 'noopener,noreferrer');
    try {
      await trackNotes({
        dayNumber: day.dayNumber,
        notesOpened: true,
        notesTime,
      });
    } catch (requestError) {
      setError(requestError.message || 'Unable to track notes');
    }
  };

  const handlePodcastProgress = async (event) => {
    const player = event.currentTarget;
    if (!player.duration) return;
    const nextProgress = Math.min(100, Math.round((player.currentTime / player.duration) * 100));
    if (nextProgress <= podcastProgress) return;
    setPodcastProgress(nextProgress);
    if (nextProgress >= PODCAST_COMPLETION_PERCENT || nextProgress % 10 === 0) {
      try {
        await trackPodcast({
          dayNumber: day.dayNumber,
          podcastProgress: nextProgress,
        });
      } catch (requestError) {
        setError(requestError.message || 'Unable to track podcast progress');
      }
    }
  };

  const handleSubmitQuiz = async () => {
    const result = getQuizOutcome(day.quiz || [], answers, Math.max(1, Math.round((Date.now() - quizStartedAtRef.current) / 1000)));
    setQuizResult(result);
    try {
      await trackQuiz({
        dayNumber: day.dayNumber,
        quizScore: result.score,
        quizPassed: result.score >= QUIZ_PASS_PERCENT,
        quizAttempted: true,
        quizTimeTaken: result.timeTaken,
        weakAreas: result.weakAreas,
      });
    } catch (requestError) {
      setError(requestError.message || 'Unable to track quiz result');
    }
  };

  if (!day?.isUnlocked) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold text-slate-950">Day {day?.dayNumber} is locked</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">Complete previous day to unlock</p>
        <Link
          to="/sequential-course"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <CompletionCelebration open={showCelebrate} dayNumber={day.dayNumber} />
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2.5rem] border border-blue-100 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-premium sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  Behavior-based course
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">Day {day.dayNumber}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">{day.module}</span>
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">{day.title}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">{day.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <RequirementPill label={`Video ${VIDEO_COMPLETION_PERCENT}%`} complete={videoComplete} />
                <RequirementPill label="PPT opened" complete={notesComplete} />
                <RequirementPill label="Test submitted" complete={quizPassed} />
              </div>
            </div>
            <div className="rounded-[2rem] bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Live tracking</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/65">Video</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{videoProgress}%</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/65">PPT status</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{notesComplete ? 'Open' : 'Pending'}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/65">Test status</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{quizPassed ? 'Done' : 'Pending'}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/65">Quiz score</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{quizScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Video lesson</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Auto-track watched percentage</h2>
                </div>
                <PlayCircle className="h-5 w-5 text-blue-600" />
              </div>
              <video
                ref={videoRef}
                className="mt-5 aspect-video w-full rounded-[1.5rem] bg-slate-950 object-cover"
                poster={day.videoPoster}
                controls
                onTimeUpdate={handleVideoProgress}
              >
                <source src={day.videoUrl} type="video/mp4" />
              </video>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Notes and slides</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Open the PPT for this day</h2>
                </div>
                <BookOpenText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
                <div className="rounded-[1.5rem] bg-slate-50 p-4">
                  {day.notesSummary.map((line) => (
                    <p key={line} className="text-sm leading-7 text-slate-600">
                      {line}
                    </p>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleNotesOpen}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                >
                  Open Notes <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Story podcast</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Optional audio support</h2>
                </div>
                <Headphones className="h-5 w-5 text-blue-600" />
              </div>
              <audio className="mt-5 w-full" controls onTimeUpdate={handlePodcastProgress}>
                <source src={day.podcastUrl} type="audio/mpeg" />
              </audio>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Quiz checkpoint</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Submit the test to unlock next day</h2>
                </div>
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <div className="mt-5 space-y-4">
                {day.quiz.map((question) => (
                  <div key={question.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-950">{question.question}</p>
                    <div className="mt-3 grid gap-2">
                      {question.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                          className={`rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                            answers[question.id] === option
                              ? 'border-blue-300 bg-blue-50 text-blue-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">Test submission unlocks the next day</p>
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Submit Quiz <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {quizResult ? (
              <ResultScreen
                result={quizResult}
                dayNumber={day.dayNumber}
                passed={quizPassed}
                nextDayNumber={nextUnlockedDay}
                onRetry={() => {
                  setAnswers({});
                  setQuizResult(null);
                  quizStartedAtRef.current = Date.now();
                }}
              />
            ) : (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Automatic completion</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">No manual completion button</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  The next day unlocks automatically after the student watches the video, opens the PPT, and submits the test.
                </p>
                {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
                <div className="mt-5 rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600">
                  Status: <span className="font-semibold text-slate-950">{saving ? 'Syncing activity...' : 'Tracking live activity'}</span>
                </div>
                <Link
                  to="/sequential-course"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  Back to dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
