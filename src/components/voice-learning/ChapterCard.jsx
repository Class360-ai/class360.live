import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Headphones, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getVoiceLearningChapterPath } from '../../data/voiceLearning';

export default function ChapterCard({ chapter, index = 0 }) {
  const navigate = useNavigate();
  const lineCount = chapter.lines?.filter((item) => item.type === 'line').length ?? 0;
  const checkpointCount = chapter.lines?.filter((item) => item.type === 'checkpoint').length ?? 0;
  const stepCount = chapter.steps?.length ?? 0;
  const chapterPath = getVoiceLearningChapterPath(chapter.id);

  const openChapter = () => {
    navigate(chapterPath);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openChapter();
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      role="link"
      tabIndex={0}
      onClick={openChapter}
      onKeyDown={handleKeyDown}
      className="cursor-pointer rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {chapter.className}
          </span>
          <h3 className="mt-3 font-display text-2xl font-bold text-slate-950">{chapter.chapter}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-glow">
          {chapter.contentType === 'step_player' ? <span className="text-lg font-bold">∑</span> : <Headphones className="h-5 w-5" />}
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{chapter.description}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Subject</p>
          <p className="mt-1 text-sm font-semibold text-slate-950">{chapter.subject}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {chapter.contentType === 'step_player' ? 'Steps' : 'Lines'}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-950">{chapter.contentType === 'step_player' ? stepCount : lineCount}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Checkpoints</p>
          <p className="mt-1 text-sm font-semibold text-slate-950">{checkpointCount}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <Sparkles className="h-3.5 w-3.5" />
          Suno & Repeat
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
          <BookOpen className="h-3.5 w-3.5" />
          {chapter.contentType === 'step_player' ? 'Step-by-step' : 'Hinglish meaning'}
        </span>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          openChapter();
        }}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        Start chapter <ArrowRight className="h-4 w-4" />
      </button>
    </motion.article>
  );
}
