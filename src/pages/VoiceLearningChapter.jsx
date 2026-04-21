import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import VoiceChapterPlayer from '../components/voice-learning/VoiceChapterPlayer';
import { getVoiceLearningChapterById, getVoiceLearningChapterPath, getVoiceLearningChapters } from '../data/voiceLearning';

export default function VoiceLearningChapter() {
  const { chapterId } = useParams();
  const chapter = useMemo(() => getVoiceLearningChapterById(chapterId), [chapterId]);
  const recommended = getVoiceLearningChapters();

  if (!chapter) {
    return (
      <div className="section-container py-8 sm:py-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
            <AlertCircle className="h-4 w-4" />
            Chapter not found
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-950">We could not load this voice chapter.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The chapter id may be missing or the content file may not have that entry yet. The page stays safe and
            gives you options instead of a blank screen.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/voice-learning"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to learning home
            </Link>
            {recommended[0] ? (
              <Link
                to={getVoiceLearningChapterPath(recommended[0].id)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Open sample chapter
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-8 sm:py-10">
      <VoiceChapterPlayer chapter={chapter} />
    </div>
  );
}
