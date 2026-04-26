import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CircleCheckBig,
  Clock3,
  Lock,
  NotebookText,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Target,
  TriangleAlert,
  TrendingUp,
} from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import {
  loadDailyTradingSeriesProgress,
  saveDailyTradingSeriesProgress,
  touchDailyTradingSeriesLesson,
} from '../services/learningApi';
import { getDailySeriesLocalSnapshot } from '../utils/dailySeriesStorage';

function getScore(quizAnswers, quiz = []) {
  if (!quiz.length) return 0;
  const correct = quiz.filter((question) => quizAnswers[question.id] === question.correctAnswer).length;
  return Math.round((correct / quiz.length) * 100);
}

function statusConfig(status) {
  if (status === 'completed') return { label: 'Completed', className: 'bg-emerald-50 text-emerald-700' };
  if (status === 'available') return { label: 'Unlocked', className: 'bg-blue-50 text-blue-700' };
  return { label: 'Locked', className: 'bg-slate-100 text-slate-500' };
}

function LessonTile({ lesson, selected, onSelect }) {
  const config = statusConfig(lesson.status);

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson)}
      disabled={lesson.locked}
      className={`group rounded-2xl border p-4 text-left shadow-sm transition ${
        selected
          ? 'border-blue-300 bg-blue-50/70'
          : lesson.completed
            ? 'border-emerald-200 bg-emerald-50/50'
            : lesson.locked
              ? 'border-slate-200 bg-slate-50 opacity-75'
              : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-premium'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Day {lesson.dayNumber}</p>
          <h3 className="mt-1 font-display text-lg font-bold text-slate-950">{lesson.title}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{lesson.module}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}>{config.label}</span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{lesson.notes}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          {lesson.autoPublish ? lesson.releaseDate : 'Scheduled'}
        </span>
        {lesson.locked ? (
          <span className="inline-flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" />
            Unlocks next
          </span>
        ) : (
          <span className="inline-flex items-center gap-1">
            <CircleCheckBig className="h-3.5 w-3.5" />
            Ready
          </span>
        )}
      </div>
    </button>
  );
}

function QuizSection({ lesson, answers, onAnswer }) {
  const questions = lesson?.quiz || [];

  return (
    <div className="grid gap-3">
      {questions.map((question) => {
        const selected = answers[question.id] || '';
        const answered = Boolean(selected);
        const isCorrect = selected === question.correctAnswer;

        return (
          <div key={question.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">{question.question}</p>
            <div className="mt-3 grid gap-2">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onAnswer(question.id, option)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                    selected === option
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {answered ? (
              <p
                className={`mt-3 rounded-xl px-3 py-2 text-sm font-semibold ${
                  isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {isCorrect ? 'Correct' : 'Not quite'} - {question.explanation}
              </p>
            ) : (
              <p className="mt-3 text-xs text-slate-500">Pick an answer to get instant feedback.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LessonVideoPlayer({ lesson, onProgress }) {
  const [playerReady, setPlayerReady] = useState(false);
  const [apiReady, setApiReady] = useState(Boolean(window.YT?.Player));
  const [watchProgress, setWatchProgress] = useState(0);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    setPlayerReady(false);
    setWatchProgress(0);
  }, [lesson?.daySlug]);

  useEffect(() => {
    if (watchProgress > 0) {
      onProgress?.(watchProgress);
    }
  }, [onProgress, watchProgress]);

  useEffect(() => {
    if (window.YT?.Player) {
      setApiReady(true);
      return undefined;
    }

    let cancelled = false;
    const existingScript = document.querySelector('script[data-youtube-iframe-api="true"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.dataset.youtubeIframeApi = 'true';
      document.body.appendChild(script);
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (!cancelled) {
        setApiReady(true);
      }
    };

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!playerReady || !apiReady || !lesson?.videoID || !containerRef.current) return undefined;

    const updateProgress = () => {
      const player = playerRef.current;
      if (!player?.getCurrentTime || !player?.getDuration) return;
      const duration = Number(player.getDuration() || 0);
      if (!duration) return;
      const currentTime = Number(player.getCurrentTime() || 0);
      const nextProgress = Math.min(100, Math.round((currentTime / duration) * 100));
      setWatchProgress((previous) => (nextProgress > previous ? nextProgress : previous));
    };

    const handleStateChange = (event) => {
      const playingState = window.YT?.PlayerState?.PLAYING;
      if (event.data === playingState) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(updateProgress, 1500);
      } else {
        window.clearInterval(intervalRef.current);
        updateProgress();
      }
    };

    playerRef.current?.destroy?.();
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: lesson.videoID,
      playerVars: {
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: updateProgress,
        onStateChange: handleStateChange,
      },
    });

    return () => {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [apiReady, lesson?.videoID, playerReady]);

  const isYouTubeLesson = lesson?.videoType !== 'upload';
  const embedUrl = isYouTubeLesson ? (lesson?.embedURL || lesson?.videoUrl || '') : '';
  const thumbnail = lesson?.thumbnail || '';

  if (!isYouTubeLesson) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
        Upload-based playback is reserved for the future. This lesson is ready for a YouTube embed.
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-sm text-slate-500">
        Video content will be added here soon.
      </div>
    );
  }

  if (!playerReady) {
    return (
      <button
        type="button"
        onClick={() => setPlayerReady(true)}
        className="group relative block w-full overflow-hidden rounded-[1.75rem] bg-slate-950 text-left shadow-premium"
      >
        <div className="aspect-video">
          {thumbnail ? (
            <img src={thumbnail} alt={lesson?.title || 'Lesson video'} className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-[1.01]" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 to-slate-800" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition group-hover:scale-105">
            <PlayCircle className="h-5 w-5" />
            Load video
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Tap to load</p>
          <p className="mt-1 text-lg font-semibold text-white">{lesson?.title}</p>
        </div>
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-slate-950 shadow-premium">
      <div className="aspect-video">
        {apiReady ? (
          <div ref={containerRef} className="h-full w-full" />
        ) : (
          <iframe
            className="h-full w-full"
            src={embedUrl}
            title={lesson?.title || 'Daily lesson video'}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      <div className="border-t border-white/10 px-4 py-3 text-sm text-white/80">
        Video progress: {watchProgress}%
      </div>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? 'bg-slate-950 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function SlidesTab({ lesson }) {
  const slides = (lesson?.keyPoints || []).map((point, index) => ({
    title: `Slide ${index + 1}`,
    text: point,
  }));

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {slides.length ? (
        slides.map((slide) => (
          <div key={slide.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{slide.title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{slide.text}</p>
          </div>
        ))
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-500 sm:col-span-2">
          Slides will appear here as key points from the lesson.
        </div>
      )}
    </div>
  );
}

export default function DailyTradingSeriesPage() {
  const [snapshot, setSnapshot] = useState(() => getDailySeriesLocalSnapshot());
  const [selectedDaySlug, setSelectedDaySlug] = useState(() => snapshot.resumeLesson?.daySlug || snapshot.nextLesson?.daySlug || 'day-1');
  const [selectedTab, setSelectedTab] = useState('video');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [lessonActivity, setLessonActivity] = useState({});

  const selectedLesson = useMemo(
    () => snapshot.lessons.find((lesson) => lesson.daySlug === selectedDaySlug) || snapshot.resumeLesson || snapshot.nextLesson || snapshot.lessons[0],
    [selectedDaySlug, snapshot.lessons, snapshot.nextLesson, snapshot.resumeLesson],
  );

  const selectedScore = useMemo(
    () => getScore(quizAnswers, selectedLesson?.quiz || []),
    [quizAnswers, selectedLesson],
  );
  const selectedProgress = useMemo(() => {
    if (!selectedLesson) return { videoProgress: 0, materialsOpened: false, quizAttempted: false, quizScore: 0 };
    return snapshot.lessons.find((lesson) => lesson.daySlug === selectedLesson.daySlug) || {
      videoProgress: 0,
      materialsOpened: false,
      quizAttempted: false,
      quizScore: 0,
    };
  }, [selectedLesson, snapshot.lessons]);
  const selectedCompletionPercent = useMemo(() => {
    const checks = [
      Number(selectedProgress.videoProgress || 0) >= 90,
      Boolean(selectedProgress.materialsOpened),
      Boolean(selectedProgress.quizAttempted),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [selectedProgress]);

  const blocks = useMemo(() => {
    const list = snapshot.lessons || [];
    const grouped = [];
    for (let index = 0; index < list.length; index += 30) {
      grouped.push(list.slice(index, index + 30));
    }
    return grouped;
  }, [snapshot.lessons]);

  useEffect(() => {
    let alive = true;
    loadDailyTradingSeriesProgress().then((result) => {
      if (alive && result) {
        setSnapshot(result);
      }
    });

    const sync = () => {
      loadDailyTradingSeriesProgress().then((result) => {
        if (result) setSnapshot(result);
      });
    };

    window.addEventListener('class360-daily-series-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      alive = false;
      window.removeEventListener('class360-daily-series-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!selectedLesson) return;
    setSelectedDaySlug((current) => current || selectedLesson.daySlug);
  }, [selectedLesson]);

  useEffect(() => {
    if (!selectedLesson) return;
    setQuizAnswers({});
    setLessonActivity((current) => ({
      ...current,
      [selectedLesson.daySlug]: current[selectedLesson.daySlug] || { quizSubmitted: false },
    }));
  }, [selectedLesson?.daySlug]);

  const refreshSnapshot = async () => {
    const refreshed = await loadDailyTradingSeriesProgress();
    if (refreshed) {
      setSnapshot(refreshed);
      return refreshed;
    }
    return null;
  };

  const persistLessonProgress = async (daySlug, patch) => {
    await saveDailyTradingSeriesProgress(daySlug, {
      ...patch,
      lastOpenedAt: new Date().toISOString(),
    });
    return refreshSnapshot();
  };

  const handleSelectLesson = async (lesson) => {
    if (lesson.locked) return;
    setSelectedDaySlug(lesson.daySlug);
    setSelectedTab('video');
    await touchDailyTradingSeriesLesson(lesson.daySlug);
  };

  const handleVideoProgress = async (progress) => {
    if (!selectedLesson || selectedLesson.locked) return;
    const normalizedProgress = Math.max(Number(selectedProgress.videoProgress || 0), Number(progress || 0));
    if (normalizedProgress <= Number(selectedProgress.videoProgress || 0)) return;
    await persistLessonProgress(selectedLesson.daySlug, {
      videoProgress: normalizedProgress,
    });
  };

  const handleOpenMaterials = async () => {
    if (!selectedLesson || selectedLesson.locked || selectedProgress.materialsOpened) return;
    await persistLessonProgress(selectedLesson.daySlug, {
      materialsOpened: true,
      notesRead: true,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!selectedLesson || selectedLesson.locked) return;
    setLessonActivity((current) => ({
      ...current,
      [selectedLesson.daySlug]: {
        ...(current[selectedLesson.daySlug] || {}),
        quizSubmitted: true,
      },
    }));
    await persistLessonProgress(selectedLesson.daySlug, {
      quizAttempted: true,
      quizScore: selectedScore,
    });
  };

  const resumeLesson = snapshot.resumeLesson || snapshot.nextLesson || selectedLesson;
  const isQuizSubmitted = Boolean(lessonActivity[selectedLesson?.daySlug || '']?.quizSubmitted);

  useEffect(() => {
    if (selectedTab === 'slides' || selectedTab === 'notes') {
      handleOpenMaterials();
    }
  }, [selectedTab]);

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[2.5rem] border border-blue-100 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-premium">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                <Sparkles className="h-4 w-4" />
                Daily Learning Series
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
                Trading from Zero to Pro (365 Days Series)
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                A day-wise learning path where each next day unlocks after the student watches the lesson, opens the PPT and submits the test.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
                  {snapshot.completedDays}/{snapshot.overview?.totalDays || 365} completed
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
                  {snapshot.streakDays} day streak
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
                  {snapshot.progressPercent}% progress
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => resumeLesson && handleSelectLesson(resumeLesson)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  Resume last lesson <PlayCircle className="h-4 w-4" />
                </button>
                <Link
                  to="/business-market-learning"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Back to category <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Resume lesson', value: resumeLesson ? `Day ${resumeLesson.dayNumber}` : 'Start Day 1' },
                { label: 'Next unlock', value: snapshot.nextLesson ? `Day ${snapshot.nextLesson.dayNumber}` : 'All open' },
                { label: 'Locked days', value: snapshot.lockedDays },
                { label: 'Streak', value: `${snapshot.streakDays} days` },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.8rem] bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm text-white/65">{item.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{item.value}</p>
                </div>
              ))}
              <div className="rounded-[1.8rem] bg-white/10 p-5 backdrop-blur sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/65">Learning progress</p>
                    <p className="mt-2 font-display text-3xl font-bold text-white">{snapshot.progressPercent}%</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-200">
                    <Target className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300"
                    style={{ width: `${snapshot.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: CalendarDays, label: 'Timeline', text: 'Day 1 to Day 365 in a clean daily sequence.' },
            { icon: Lock, label: 'Unlock rules', text: 'Each next day opens after completion and release.' },
            { icon: NotebookText, label: 'Homework', text: 'A small assignment keeps each lesson practical.' },
            { icon: BarChart3, label: 'Dashboard', text: 'Track streak, completion and resume progress.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold text-slate-950">{item.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            );
          })}
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
            <SectionTitle
              eyebrow="Selected lesson"
              title={selectedLesson?.title || 'Day 1'}
              subtitle="Open any unlocked day, read the notes, take the quiz and mark it complete."
            />

            {selectedLesson ? (
              <div className="mt-5 space-y-5">
                <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Day {selectedLesson.dayNumber}
                      </span>
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                        {selectedLesson.module}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusConfig(selectedLesson.status).className}`}>
                        {statusConfig(selectedLesson.status).label}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-bold text-slate-950">{selectedLesson.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{selectedLesson.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {selectedLesson.videoType === 'youtube' ? 'YouTube embed' : 'Upload ready'}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {selectedLesson.keyPoints.length} slides
                      </span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300"
                        style={{ width: `${selectedCompletionPercent}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Day unlock progress: {selectedCompletionPercent}% complete
                    </p>
                  </div>

                  <div className="grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Day number</p>
                      <p className="mt-2 font-display text-3xl font-bold text-slate-950">{selectedLesson.dayNumber}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Unlock rule</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">Video 90% + PPT opened + test submitted</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Lesson tabs</p>
                      <h3 className="mt-1 font-display text-xl font-bold text-slate-950">Video, slides, notes, quiz and homework</h3>
                      <p className="mt-2 text-sm text-slate-500">Open slides or notes to count the PPT step. Submit the quiz to unlock the next day.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        ['video', 'Video'],
                        ['slides', 'Slides'],
                        ['notes', 'Notes'],
                        ['quiz', 'Quiz'],
                        ['homework', 'Homework'],
                      ].map(([key, label]) => (
                        <TabButton key={key} active={selectedTab === key} onClick={() => setSelectedTab(key)}>
                          {label}
                        </TabButton>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    {selectedTab === 'video' ? (
                      <div className="space-y-4">
                        <LessonVideoPlayer lesson={selectedLesson} onProgress={handleVideoProgress} />
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-950">Watch progress</p>
                            <p className="text-sm font-semibold text-blue-700">{selectedProgress.videoProgress || 0}%</p>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">The next day unlocks after this reaches at least 90%.</p>
                        </div>
                      </div>
                    ) : null}
                    {selectedTab === 'slides' ? <SlidesTab lesson={selectedLesson} /> : null}
                    {selectedTab === 'notes' ? (
                      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <h4 className="text-sm font-semibold text-slate-950">Notes</h4>
                          <p className="mt-3 text-sm leading-7 text-slate-600">{selectedLesson.notes}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                          <h4 className="text-sm font-semibold text-slate-950">Key points</h4>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                            {selectedLesson.keyPoints.map((point) => (
                              <li key={point}>- {point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                    {selectedTab === 'quiz' ? (
                      <div className="space-y-4">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm font-semibold text-slate-950">Quiz score: {selectedScore}%</p>
                          <p className="mt-2 text-sm text-slate-600">Answer the questions, then submit the test to count this step.</p>
                        </div>
                        <QuizSection
                          lesson={selectedLesson}
                          answers={quizAnswers}
                          onAnswer={(questionId, value) => setQuizAnswers((prev) => ({ ...prev, [questionId]: value }))}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-950">Test submission</p>
                            <p className="mt-1 text-sm text-slate-600">
                              Submitting the test marks the quiz step complete for this day.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleSubmitQuiz}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                          >
                            Submit test <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                        {isQuizSubmitted ? (
                          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                            Test submitted. If the video and PPT steps are done, the next day is now unlocked automatically.
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {selectedTab === 'homework' ? (
                      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                          <h4 className="text-sm font-semibold text-slate-950">Homework task</h4>
                          <p className="mt-3 text-sm leading-7 text-slate-600">{selectedLesson.homeworkTask}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-4 text-blue-700">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em]">Finish step</p>
                          <p className="mt-2 text-sm leading-6">
                            This page now unlocks the next day automatically after video, PPT and test activity.
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Unlock rule for this page: watch at least 90% of the video, open slides or notes, and submit the test.
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
              <SectionTitle
                eyebrow="Student progress dashboard"
                title="Stay on track every day"
                subtitle="This mini dashboard shows consistency, completion and the next lesson to unlock."
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Completed', value: snapshot.completedDays },
                  { label: 'Streak', value: `${snapshot.streakDays} days` },
                  { label: 'Unlocked', value: `${snapshot.lessons.filter((lesson) => !lesson.locked).length}` },
                  { label: 'Locked', value: snapshot.lockedDays },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
              <SectionTitle
                eyebrow="Resume"
                title={resumeLesson ? `Day ${resumeLesson.dayNumber}` : 'Start today'}
                subtitle="Pick up from the last opened or last completed day."
              />
              <div className="mt-5 rounded-[1.75rem] bg-slate-950 p-5 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  <PlayCircle className="h-4 w-4" />
                  Resume point
                </div>
                <p className="mt-3 text-xl font-semibold">{resumeLesson?.title || 'Day 1'}</p>
                <p className="mt-2 text-sm leading-7 text-white/75">{resumeLesson?.notes || 'Open the first lesson and start the streak.'}</p>
                <button
                  type="button"
                  onClick={() => resumeLesson && handleSelectLesson(resumeLesson)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"
                >
                  Resume now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
              <SectionTitle
                eyebrow="Special sections"
                title="Reality-first learning support"
                subtitle="These modules keep the daily series grounded, practical and safe for beginners."
              />
              <div className="mt-5 grid gap-4">
                {[
                  {
                    title: 'Reality Check',
                    text: 'Scams, leverage traps, losses and other red flags every learner should understand early.',
                    icon: TriangleAlert,
                  },
                  {
                    title: 'Mistakes to Avoid',
                    text: 'Common beginner errors around impatience, overconfidence and poor risk handling.',
                    icon: BookOpen,
                  },
                  {
                    title: 'Student Progress Dashboard',
                    text: 'A quick view of streak, completion and the next unlock so students can stay consistent.',
                    icon: TrendingUp,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-950">{item.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle
            eyebrow="Timeline"
            title="Day 1 to Day 365"
            subtitle="Unlocked days are active, completed days stay checked, and future days remain locked until they are released."
          />
          <div className="space-y-6">
            {blocks.map((block, index) => (
              <div key={`block-${index + 1}`} className="rounded-[2.25rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Timeline block</p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-slate-950">
                      Day {block[0]?.dayNumber} - Day {block[block.length - 1]?.dayNumber}
                    </h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {block.length} lessons
                  </span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {block.map((lesson) => (
                    <LessonTile
                      key={lesson.daySlug}
                      lesson={lesson}
                      selected={selectedLesson?.daySlug === lesson.daySlug}
                      onSelect={handleSelectLesson}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
