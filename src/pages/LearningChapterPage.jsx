import { useMemo, useState } from 'react';
import { ArrowRight, Clock3, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import VideoSection from '../components/learning/VideoSection';
import McqCard from '../components/learning/McqCard';
import AskAiBox from '../components/learning/AskAiBox';
import {
  getLearningChapterBySlugFromCatalog,
  getLearningSubjectBySlug,
  learningSubjectCatalog,
} from '../data/learningSubjectCatalog';
import { getClassLevelLabel, getStoredUser } from '../utils/authStorage';

function QuestionList({ title, questions, answers, onAnswer, typeLabel }) {
  return (
    <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle
          eyebrow={typeLabel}
          title={title}
          subtitle="Select one answer for each question and get instant feedback."
        />
      </div>
      <div className="mt-5 grid gap-4">
        {questions.map((question) => {
          const selectedAnswer = answers[question.id] || '';
          const isAnswered = Boolean(selectedAnswer);
          const isCorrect = selectedAnswer === question.correctAnswer;

          return (
            <div key={question.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
              <McqCard
                question={question}
                selectedAnswer={selectedAnswer}
                onSelect={(value) => onAnswer(question.id, value)}
                showAnswer={false}
              />
              {isAnswered ? (
                <div
                  className={`mt-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                    isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {isCorrect ? 'Correct' : 'Incorrect'} - {question.explanation}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Choose an answer to see instant feedback.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotesGrid({ notes }) {
  if (!notes) return null;

  return (
    <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
      <SectionTitle
        eyebrow="Notes"
        title="Quick revision notes"
        subtitle="Short bullets, key terms, examples and a revision reminder."
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-sm font-semibold text-slate-950">Summary points</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {notes.summaryPoints.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-sm font-semibold text-slate-950">Key terms</h3>
          <div className="mt-3 grid gap-3">
            {notes.keyTerms.map((item) => (
              <div key={item.term} className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-950">{item.term}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
          <h3 className="text-sm font-semibold text-slate-950">Examples</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {notes.examples.map((item) => (
              <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-950 p-4 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            <Sparkles className="h-4 w-4" />
            Quick revision
          </div>
          <p className="mt-3 text-sm leading-6 text-white/85">{notes.revisionBox}</p>
        </div>
      </div>
    </div>
  );
}

export default function LearningChapterPage() {
  const { chapterSlug } = useParams();
  const profile = getStoredUser() || {};
  const classLevel = getClassLevelLabel(profile.classLevel || 6);
  const board = String(profile.board || profile.boardStream || 'CBSE').trim() || 'CBSE';
  const chapter = getLearningChapterBySlugFromCatalog(chapterSlug);
  const subject = getLearningSubjectBySlug(chapter?.subjectSlug || 'science');
  const subjectChapters = subject?.chapters || learningSubjectCatalog[0]?.chapters || [];
  const currentIndex = subjectChapters.findIndex((item) => item.slug === chapter?.slug || item.legacySlugs?.includes(chapterSlug));
  const nextChapter = subjectChapters[currentIndex + 1] || null;
  const chapterNumber = chapter?.chapterNumber || currentIndex + 1 || 1;
  const displayChapter = chapter || {
    slug: chapterSlug,
    chapterNumber,
    subjectSlug: subject.slug,
    subjectName: subject.name,
    title: 'Chapter not found',
    description: 'This chapter is not available yet.',
    videoUrl: '',
    objectives: [],
    notes: null,
    practiceQuestions: [],
    dppQuestions: [],
  };
  const chapterLevel = displayChapter.level || 'Core';
  const contentLanguage = subject.contentLanguage || 'English';

  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [dppAnswers, setDppAnswers] = useState({});

  const headerLine = `${subject.name} - ${classLevel} - ${board}`;
  const chapterTitle = `Chapter ${chapterNumber}: ${displayChapter.title}`;
  const practiceQuestions = displayChapter.practiceQuestions || [];
  const dppQuestions = displayChapter.dppQuestions || [];

  if (!chapter) {
    return (
      <section className="section-container py-16">
        <div className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-950">Chapter not found</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Try opening the subject page and choose a chapter again.
          </p>
          <Link
            to={`/learning/subjects/${subject.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to subject <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-container py-8 sm:py-10">
      <div className="space-y-6">
        <div className="glass-card rounded-[2.25rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Learning chapter</p>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{classLevel}</span>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">{board}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{subject.name}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-950 sm:text-4xl">{chapterTitle}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{headerLine}</p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{displayChapter.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{contentLanguage}</span>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">{chapterLevel}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Quiz focus: {displayChapter.quizFocus || 'Chapter quiz'}
            </span>
          </div>
        </div>

        <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Video</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">{displayChapter.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start with the video, then move through the notes and questions in the same order.
              </p>
            </div>
            <div className="hidden rounded-2xl bg-blue-50 p-3 text-blue-700 sm:flex">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
          {displayChapter.thumbnail ? (
            <div className="mt-5 overflow-hidden rounded-[1.75rem] bg-slate-950 shadow-premium">
              <div className="aspect-[16/8.5]">
                <img src={displayChapter.thumbnail} alt={displayChapter.title} className="h-full w-full object-cover" />
              </div>
            </div>
          ) : null}
          {displayChapter.videoUrl ? (
            <div className="mt-5 overflow-hidden rounded-[1.75rem] bg-slate-950 shadow-premium">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={displayChapter.videoUrl}
                  title={displayChapter.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.75rem] bg-slate-100 p-6 text-sm text-slate-600">
              Video content will be added here soon.
            </div>
          )}
        </div>

        <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
          <SectionTitle
            eyebrow="Learning objectives"
            title="What the student will learn"
            subtitle="Keep the learning goals short and simple so the chapter feels easy to follow."
          />
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {(displayChapter.objectives || []).map((item) => (
              <li key={item} className="rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm ring-1 ring-slate-200">
                - {item}
              </li>
            ))}
          </ul>
        </div>

        <NotesGrid notes={displayChapter.notes} />

        <SectionTitle
          eyebrow="Quiz section"
          title="Practice, DPP and test"
          subtitle="Every chapter includes a quiz path so the learner can check understanding after the video and notes."
        />

        <div className="space-y-4">
          <QuestionList
            typeLabel="Practice"
            title="Practice questions"
            questions={practiceQuestions}
            answers={practiceAnswers}
            onAnswer={(questionId, value) => setPracticeAnswers((prev) => ({ ...prev, [questionId]: value }))}
          />
        </div>

        <div className="space-y-4">
          <QuestionList
            typeLabel="DPP"
            title="Daily Practice Problems (DPP)"
            questions={dppQuestions}
            answers={dppAnswers}
            onAnswer={(questionId, value) => setDppAnswers((prev) => ({ ...prev, [questionId]: value }))}
          />
        </div>

        <AskAiBox chapterTitle={displayChapter.title} subjectName={subject.name} classLevel={classLevel} />

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
            <SectionTitle
              eyebrow="Test"
              title="Ready for the chapter test?"
              subtitle="Move to the test when the video, notes, practice and DPP feel clear."
            />
            <Link
              to={`/learning/chapters/${displayChapter.slug}/test`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Take Chapter Test <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="glass-card rounded-[2.25rem] p-5 sm:p-6">
            <SectionTitle
              eyebrow="Next chapter"
              title={nextChapter?.title || 'Chapter complete'}
              subtitle="Continue in the same subject flow without losing momentum."
            />
            {nextChapter ? (
              <Link
                to={`/learning/chapters/${nextChapter.slug}`}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Next Chapter <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to={`/learning/subjects/${subject.slug}`}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Back to subject <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
