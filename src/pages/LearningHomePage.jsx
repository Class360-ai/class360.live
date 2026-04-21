import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles, Target, Trophy } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import SubjectCard from '../components/learning/SubjectCard';
import ProgressStats from '../components/learning/ProgressStats';
import { learningSubject, getLearningDashboardSnapshot, getLearningCurrentChapter, getLearningLocalData } from '../data/learningData';
import { loadLearningHome } from '../services/learningApi';
import { getClassLevelLabel, getStoredUser } from '../utils/authStorage';

export default function LearningHomePage() {
  const classLevel = getClassLevelLabel(getStoredUser()?.classLevel || 6);
  const [data, setData] = useState(() => getLearningLocalData(classLevel));

  useEffect(() => {
    loadLearningHome().then((result) => {
      if (result) setData(result);
    });
  }, []);

  const progressMap = data?.progress || {};
  const dashboard = data?.dashboard || getLearningDashboardSnapshot(progressMap, classLevel);
  const currentChapter = useMemo(
    () => data?.recommendedChapter || getLearningCurrentChapter(progressMap, classLevel),
    [data?.recommendedChapter, classLevel, progressMap],
  );

  const stats = [
    { label: 'Chapters completed', value: `${dashboard.completedChapters}/${dashboard.totalChapters}`, note: 'Keep the learning path short and clear.' },
    { label: 'Learning time', value: `${dashboard.learningMinutes}m`, note: 'Video + notes + practice combined.' },
    { label: 'Average score', value: `${dashboard.averageScore}%`, note: 'Practice and test scores.' },
    { label: 'Badge', value: dashboard.badge, note: `Streak: ${dashboard.streakDays} days` },
  ];

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="glass-card rounded-[2.25rem] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Learning System</p>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{classLevel}</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold text-slate-950 sm:text-4xl">
              Class 6 learning that moves from video to progress.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Follow the learning loop: Video, Notes, Practice, DPP, Test, AI Doubt, Progress.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">Hindi + English</span>
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">Mobile friendly</span>
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">Class 6 Science</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/learning/subjects/${learningSubject.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Start learning <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={`/learning/chapters/${currentChapter?.slug || 'living-and-non-living-things'}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Resume chapter <BookOpen className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <ProgressStats stats={stats} />
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Continue learning</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">{currentChapter?.title}</h2>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{currentChapter?.description}</p>
            <div className="mt-5 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-700">Daily target</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">1 video + 10 questions</p>
              <p className="mt-2 text-sm text-slate-600">A small daily block keeps the learning momentum steady.</p>
            </div>
          </div>

          <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Subject</p>
                <h3 className="font-display text-2xl font-bold text-slate-950">{learningSubject.name}</h3>
              </div>
            </div>
            <SubjectCard
              subject={learningSubject}
              progress={dashboard.completedChapters ? Math.round((dashboard.completedChapters / dashboard.totalChapters) * 100) : 0}
              to={`/learning/subjects/${learningSubject.slug}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
