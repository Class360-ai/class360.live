import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpenText, Mic, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import ClassSelector from '../components/voice-learning/ClassSelector';
import ChapterCard from '../components/voice-learning/ChapterCard';
import SubjectSelector from '../components/voice-learning/SubjectSelector';
import {
  getVoiceLearningChapterCount,
  getVoiceLearningChapters,
  getVoiceLearningChaptersForClassAndSubject,
  getVoiceLearningClasses,
  getVoiceLearningChapterPath,
  getVoiceLearningSubjects,
  getVoiceLearningSubjectsForClass,
} from '../data/voiceLearning';

const learningSteps = ['Book', 'Teacher Voice', 'Understanding', 'Practice', 'Progress'];

export default function VoiceLearningHome() {
  const classes = getVoiceLearningClasses();
  const allChapters = useMemo(() => getVoiceLearningChapters(), []);
  const [activeClass, setActiveClass] = useState(classes[0]?.className || 'Class 6');
  const initialSubjects = useMemo(() => getVoiceLearningSubjectsForClass(classes[0]?.className || 'Class 6'), []);
  const [activeSubject, setActiveSubject] = useState(initialSubjects[0] || 'English');

  const visibleSubjects = useMemo(() => getVoiceLearningSubjectsForClass(activeClass), [activeClass]);
  const visibleChapters = useMemo(
    () => getVoiceLearningChaptersForClassAndSubject(activeClass, activeSubject),
    [activeClass, activeSubject],
  );
  const totalForClass = getVoiceLearningChapterCount(activeClass);
  const totalForClassSubject = visibleChapters.length;
  const subjects = getVoiceLearningSubjects();

  const handleClassChange = (nextClass) => {
    setActiveClass(nextClass);
    const nextSubjects = getVoiceLearningSubjectsForClass(nextClass);
    setActiveSubject((current) => (nextSubjects.includes(current) ? current : nextSubjects[0] || 'English'));
  };

  return (
    <div className="section-container py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[2.25rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-5 shadow-premium sm:p-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 shadow-sm">
            <Waves className="h-3.5 w-3.5" />
            Voice-first learning
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            A Bharat-friendly study mode where the app teaches class by class, subject by subject.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Class 6 to 8 learners can pick a subject, hear the lesson in simple teacher-like voice, repeat it, and move
            ahead without clutter.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={visibleChapters[0] ? getVoiceLearningChapterPath(visibleChapters[0].id) : '/voice-learning'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Start first lesson <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700">
              <Mic className="h-4 w-4 text-blue-600" />
              Browser TTS ready
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-5">
            {learningSteps.map((step, index) => (
              <div key={step} className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="rounded-[2.25rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">MVP focus</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-950">Built for all major school subjects</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The content model supports English, Hindi, Mathematics, Science, and Social Science from the same player
            shell, so we can add more chapters later without changing the UI.
          </p>
          <div className="mt-5 grid gap-3">
            {[
              'Local JSON content for fast chapter expansion',
              'Line mode for language and theory subjects',
              'Step mode for maths lessons and future solve flows',
              'Future hooks for recording voice and parent summaries',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <p className="text-sm text-white/60">Available chapters</p>
            <p className="mt-2 font-display text-3xl font-bold">{allChapters.length}</p>
            <p className="mt-2 text-sm text-white/70">Across Class 6, Class 7, and Class 8.</p>
          </div>
        </motion.section>
      </div>

      <section className="mt-14">
        <SectionTitle
          eyebrow="Choose class"
          title="Pick the learner's class first"
          subtitle="The player switches content based on class and subject, so the same screen can teach different lessons."
        />
        <div className="mt-7">
          <ClassSelector classes={classes} activeClass={activeClass} onChange={handleClassChange} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Showing {totalForClass} chapter{totalForClass === 1 ? '' : 's'} for {activeClass}.
          </p>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <BookOpenText className="h-3.5 w-3.5" />
            {visibleSubjects.length ? `${visibleSubjects.length} subjects available` : 'No subject yet'}
          </span>
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle
          eyebrow="Choose subject"
          title="Pick the subject before opening a chapter"
          subtitle="This keeps the learning flow simple for students and makes the content structure easy to extend."
        />
        <div className="mt-6">
          <SubjectSelector
            subjects={subjects.filter((item) => visibleSubjects.includes(item.subject))}
            activeSubject={activeSubject}
            onChange={setActiveSubject}
          />
        </div>
        <p className="mt-3 text-sm text-slate-600">
          {activeClass} and {activeSubject} currently show {totalForClassSubject} chapter
          {totalForClassSubject === 1 ? '' : 's'}.
        </p>
      </section>

      <section className="mt-10">
        <SectionTitle
          eyebrow="Chapter library"
          title="Tap a chapter to open the voice player"
          subtitle="Line-based chapters and maths step-based chapters both use the same local content source."
        />
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {visibleChapters.length ? (
            visibleChapters.map((chapter, index) => <ChapterCard key={chapter.id} chapter={chapter} index={index} />)
          ) : (
            <div className="lg:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              No chapters are available for this class and subject yet.
            </div>
          )}
        </div>
      </section>

      <section className="mt-14">
        <SectionTitle
          eyebrow="Content ready"
          title="Where subject content should be added later"
          subtitle="Everything is split away from UI, so new classes and subjects can be added by editing the data file."
        />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            'Add new chapter objects in `src/data/voiceLearning/chapters.json`',
            'Use `contentType: line_player` for language/theory lessons',
            'Use `contentType: step_player` for maths lessons',
            'The player will render based on subject and contentType automatically',
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-premium sm:p-7"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Future-ready hooks</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {['Recording student voice', 'Quiz checkpoints', 'Streak / progress'].map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 px-4 py-4 text-sm font-semibold text-white/85">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {['Offline chapter downloads', 'Parent progress summary'].map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 px-4 py-4 text-sm font-semibold text-white/85">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
