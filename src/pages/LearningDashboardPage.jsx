import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, BrainCircuit, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import ProgressStats from '../components/learning/ProgressStats';
import SubjectCard from '../components/learning/SubjectCard';
import {
  getLearningCurrentChapter,
  getLearningDashboardSnapshot,
  getLearningLocalData,
  getLearningProgressMap,
  getLearningRecommendedChapter,
} from '../data/learningData';
import { getLearningSubjectPageSnapshot, getLearningSubjectsForClassLevel } from '../data/learningSubjectCatalog';
import { loadLearningProgress } from '../services/learningApi';
import { getClassLevelLabel, getStoredUser } from '../utils/authStorage';

function getClassNumber(value) {
  const match = String(value || '').match(/\d+/);
  return match ? match[0] : '';
}

export default function LearningDashboardPage() {
  const user = getStoredUser();
  const classLevel = getClassLevelLabel(user?.classLevel || 6);
  const boardLabel = user?.board || user?.boardStream || 'CBSE';
  const displayName = user?.name || user?.fullName || 'Student';
  const [data, setData] = useState(() => getLearningLocalData(classLevel));

  useEffect(() => {
    loadLearningProgress('student-001').then((result) => {
      if (result) {
        setData((prev) => ({ ...prev, ...result }));
      }
    });
  }, []);

  const progressMap = data?.progress || getLearningProgressMap();
  const dashboard = data?.dashboard || getLearningDashboardSnapshot(progressMap, classLevel);
  const recommendedChapter = useMemo(
    () => data?.recommendedChapter || getLearningRecommendedChapter(progressMap, classLevel),
    [data?.recommendedChapter, classLevel, progressMap],
  );
  const currentChapter = useMemo(() => getLearningCurrentChapter(progressMap, classLevel), [classLevel, progressMap]);
  const subjectCards = useMemo(() => {
    const requestedClass = getClassNumber(classLevel);
    const subjects = getLearningSubjectsForClassLevel().filter((subject) => {
      const subjectClass = getClassNumber(subject.classLevel);
      return !requestedClass || !subjectClass || subjectClass === requestedClass;
    });
    const visibleSubjects = subjects.length ? subjects : getLearningSubjectsForClassLevel();

    return visibleSubjects.map((subject) => {
      const snapshot = getLearningSubjectPageSnapshot(subject.slug);
      return {
        ...subject,
        progress: snapshot.progressPercent,
      };
    });
  }, [classLevel]);
  const primarySubject = subjectCards[0] || null;
  const primarySnapshot = primarySubject ? getLearningSubjectPageSnapshot(primarySubject.slug) : null;
  const dynamicTotalChapters = subjectCards.reduce((sum, subject) => sum + Number(subject.totalChapters || 0), 0);
  const dynamicCompletedChapters = subjectCards.reduce((sum, subject) => sum + Number(subject.completedChapters || 0), 0);
  const dynamicCurrentChapter = primarySnapshot?.currentChapter || currentChapter;
  const dynamicRecommendedChapter = primarySnapshot?.recommendedChapter || recommendedChapter;

  const stats = [
    {
      label: 'Chapters completed',
      value: `${dynamicCompletedChapters || dashboard.completedChapters}/${dynamicTotalChapters || dashboard.totalChapters}`,
      note: 'Keep the sequence simple.',
    },
    { label: 'Learning time', value: `${dashboard.learningMinutes}m`, note: 'Video + notes + practice.' },
    { label: 'Average score', value: `${dashboard.averageScore}%`, note: 'Practice and test performance.' },
    { label: 'Badge', value: dashboard.badge, note: `Streak: ${dashboard.streakDays} days` },
  ];

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="space-y-6">
        <div className="glass-card rounded-[2.25rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Learning dashboard</p>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{classLevel}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">{displayName}</p>
          <p className="mt-1 text-sm text-slate-600">
            {classLevel} - {boardLabel}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-950 sm:text-4xl">
            Progress made visible for students and parents.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Track chapter progress, weak topics, badges, and the next best action without changing the main Class360 site.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Continue Learning</p>
            <h2 className="mt-2 font-display text-xl font-bold text-slate-950">
              {dynamicCurrentChapter?.title || 'Start with the first chapter'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Keep one lesson at a time, then move to notes and practice.</p>
          </div>
          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Subjects</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {subjectCards.map((subject) => (
                <span key={subject.slug} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {subject.name}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Today&apos;s Target</p>
            <h2 className="mt-2 font-display text-xl font-bold text-slate-950">1 video + 10 questions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">A small daily goal keeps the flow simple and consistent.</p>
          </div>
        </div>

        <ProgressStats stats={stats} />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="glass-card rounded-[2rem] p-5 sm:p-6">
              <SectionTitle
                eyebrow="Recommended"
                title="What to do next"
                subtitle="Use the chapter flow to keep the work short and focused."
              />
              <div className="mt-5 rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Next action</p>
                <p className="mt-2 font-display text-2xl font-bold text-slate-950">{dynamicRecommendedChapter?.title || dashboard.nextAction}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Continue with the current chapter or move to the next unlocked one.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={
                      dynamicCurrentChapter?.slug || dynamicRecommendedChapter?.slug
                        ? `/learning/chapters/${dynamicCurrentChapter?.slug || dynamicRecommendedChapter?.slug}`
                        : '/learning/dashboard'
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Continue chapter <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-5 sm:p-6">
              <SectionTitle
                eyebrow="Subjects"
                title="Open a learning subject"
                subtitle="Every subject card now links into the new school subject flow."
              />
              <div className="mt-5 grid gap-4">
                {subjectCards.map((subject) => (
                  <SubjectCard
                    key={subject.slug}
                    subject={subject}
                    progress={subject.progress}
                    to={`/learning/subjects/${subject.slug}`}
                  />
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-5 sm:p-6">
              <SectionTitle
                eyebrow="Weak topics"
                title="Focus areas"
                subtitle="Keep the list short so revision stays practical."
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {(dashboard.weakTopics || []).length ? (
                  dashboard.weakTopics.map((topic) => (
                    <span key={topic} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    No weak topics detected
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Learning streak</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">{dashboard.streakDays} days</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Small daily learning blocks help students stay consistent without overload.
              </p>
            </div>

            <div className="glass-card rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-amber-600 shadow-sm">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Badge</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">{dashboard.badge}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Track progress in a simple dashboard card that works well on mobile too.
              </p>
            </div>

            <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Current chapter</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">{dynamicCurrentChapter?.title || 'Start here'}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use this chapter as the next learning stop before moving into notes and practice.
              </p>
              <Link
                to={
                  dynamicCurrentChapter?.slug || dynamicRecommendedChapter?.slug
                    ? `/learning/chapters/${dynamicCurrentChapter?.slug || dynamicRecommendedChapter?.slug}`
                    : '/learning/dashboard'
                }
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Open chapter <BookOpen className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
