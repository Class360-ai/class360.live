import { ArrowRight, BookOpen, Clock3, PlayCircle, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import { getLearningSubjectBySlug, getLearningSubjectPageSnapshot } from '../data/learningSubjectCatalog';
import { getClassLevelLabel, getStoredUser } from '../utils/authStorage';

function getChapterAction(chapter) {
  if (chapter.progress >= 100) {
    return { label: 'Review', icon: BookOpen };
  }
  if (chapter.status === 'in-progress') {
    return { label: 'Continue', icon: PlayCircle };
  }
  return { label: 'Start Chapter', icon: ArrowRight };
}

function getStatusBadge(chapter) {
  if (chapter.progress >= 100) {
    return { label: 'Completed', className: 'bg-emerald-50 text-emerald-700' };
  }
  if (chapter.status === 'in-progress') {
    return { label: 'In Progress', className: 'bg-blue-50 text-blue-700' };
  }
  return { label: 'Not Started', className: 'bg-slate-100 text-slate-600' };
}

export default function LearningSubjectPage() {
  const { subjectSlug } = useParams();
  const profile = getStoredUser() || {};
  const classLevel = getClassLevelLabel(profile.classLevel || 6);
  const board = String(profile.board || profile.boardStream || 'CBSE').trim() || 'CBSE';
  const language = String(profile.language || profile.preferredLanguage || '').trim();
  const subject = getLearningSubjectBySlug(subjectSlug);
  const snapshot = getLearningSubjectPageSnapshot(subjectSlug);
  const chapters = snapshot.chapters || [];
  const currentChapter = snapshot.currentChapter || chapters[0] || null;
  const totalChapters = snapshot.totalChapters || chapters.length;
  const completedChapters = snapshot.completedChapters || 0;
  const progressPercent = snapshot.progressPercent || 0;
  const contentLanguage = subject.contentLanguage || 'English';

  const summaryCards = [
    { label: 'Total chapters', value: totalChapters, note: 'Everything in one clean subject flow.' },
    { label: 'Completed', value: completedChapters, note: 'Finished chapters stay at hand for revision.' },
    { label: 'Progress', value: `${progressPercent}%`, note: 'A simple subject-wide progress marker.' },
    { label: 'Recommended', value: currentChapter?.title || 'Start here', note: 'Pick up from the next best chapter.' },
  ];

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="space-y-6">
        <div className="glass-card rounded-[2.25rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Learning subject</p>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{classLevel}</span>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">{board}</span>
            {language ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{language}</span>
            ) : null}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-950 sm:text-4xl">{subject.name}</h1>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            {classLevel} - {board}
          </p>
          <p className="mt-2 text-sm font-semibold text-blue-700">{contentLanguage}</p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{subject.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => (
            <div key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-950">{item.value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <SectionTitle
            eyebrow="Chapters"
            title="Pick the next chapter"
            subtitle="Each card shows progress and the next best action so the learning path stays short and clear."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {chapters.map((chapter) => {
              const action = getChapterAction(chapter);
              const status = getStatusBadge(chapter);
              const ActionIcon = action.icon;

              return (
                <article
                  key={chapter.slug}
                  className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-blue-700">
                        {chapter.thumbnail ? (
                          <img src={chapter.thumbnail} alt={chapter.title} className="h-full w-full object-cover" />
                        ) : (
                          <Sparkles className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Chapter {chapter.chapterNumber}
                        </p>
                        <h3 className="mt-1 font-display text-xl font-bold text-slate-950">{chapter.title}</h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                          {chapter.level}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">{chapter.description}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Quiz focus: {chapter.quizFocus || 'Chapter quiz'}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Duration</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{chapter.estimatedDuration}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Progress</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{chapter.progress}%</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{status.label}</p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"
                      style={{ width: `${chapter.progress}%` }}
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 className="h-4 w-4" />
                      <span>{chapter.estimatedDuration}</span>
                    </div>
                    <Link
                      to={`/learning/chapters/${chapter.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      <ActionIcon className="h-4 w-4" />
                      {action.label}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
            <SectionTitle
              eyebrow="Continue where you left off"
              title={currentChapter?.title || 'Start the first chapter'}
              subtitle="Resume the current chapter for this subject without losing the learning sequence."
            />
            <div className="mt-5 rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Current chapter</p>
              <p className="mt-2 font-display text-2xl font-bold text-slate-950">{currentChapter?.title || subject.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{currentChapter?.description || subject.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={currentChapter?.slug || chapters[0]?.slug ? `/learning/chapters/${currentChapter.slug || chapters[0].slug}` : '/learning/dashboard'}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Resume chapter <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
            <SectionTitle
              eyebrow="Quick subject actions"
              title="Keep the flow moving"
              subtitle="These light actions keep the subject page useful without adding extra clutter."
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5"
              >
                <p className="text-sm font-semibold text-slate-950">Open notes</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Quick revision notes for this subject.</p>
              </button>
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5"
              >
                <p className="text-sm font-semibold text-slate-950">Start practice</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">A few practice questions to lock in the lesson.</p>
              </button>
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5"
              >
                <p className="text-sm font-semibold text-slate-950">Take mini test</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">A short checkpoint before the chapter test.</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
