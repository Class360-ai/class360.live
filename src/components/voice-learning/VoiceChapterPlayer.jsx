import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Calculator,
  MessagesSquare,
  Mic,
  Pause,
  Play,
  Repeat,
  SkipBack,
  Volume2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/classNames';
import { cancelSpeech, hasBrowserSpeech, pauseSpeech, resumeSpeech, speakText } from '../../services/ttsService';
import { normalizeVoiceLearningChapter } from '../../data/voiceLearning';

function PlayerButton({ onClick, icon: Icon, label, tone = 'soft', disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-semibold transition',
        tone === 'dark'
          ? 'bg-slate-950 text-white shadow-lg hover:bg-slate-800'
          : tone === 'blue'
            ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
            : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700',
        disabled && 'cursor-not-allowed opacity-50 hover:translate-y-0',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export default function VoiceChapterPlayer({ chapter }) {
  const normalizedChapter = useMemo(() => normalizeVoiceLearningChapter(chapter), [chapter]);
  const contentType = normalizedChapter?.contentType || 'line_player';
  const contentItems = useMemo(() => {
    if (contentType === 'step_player') return normalizedChapter?.steps || [];
    return normalizedChapter?.lines || [];
  }, [normalizedChapter, contentType]);

  const supportsSpeech = hasBrowserSpeech();
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [announcement, setAnnouncement] = useState('Tap play to start the lesson.');
  const [error, setError] = useState('');
  const [repeatReady, setRepeatReady] = useState(false);
  const timerRef = useRef(null);
  const activeSpeechRef = useRef(null);
  const activeItem = contentItems[activeIndex] || null;

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopCurrentPlayback = () => {
    clearTimer();
    activeSpeechRef.current?.cancel?.();
    cancelSpeech();
    activeSpeechRef.current = null;
  };

  useEffect(() => {
    stopCurrentPlayback();
    setActiveIndex(0);
    setPhase('idle');
    setAnnouncement('Tap play to start the lesson.');
    setError('');
    setRepeatReady(false);

    return () => stopCurrentPlayback();
  }, [chapter?.id]);

  const progress = useMemo(() => {
    if (!contentItems.length) return 0;
    return ((activeIndex + 1) / contentItems.length) * 100;
  }, [activeIndex, contentItems.length]);

  const isCheckpointItem = contentType === 'line_player' && activeItem?.type === 'checkpoint';

  const currentExplanation =
    contentType === 'step_player'
      ? activeItem?.explanation || 'Explain this step in a simple way.'
      : activeItem?.explanation || activeItem?.hint || '';

  const currentLineText = isCheckpointItem ? activeItem?.prompt : activeItem?.text;

  const scheduleRepeatReady = (item) => {
    clearTimer();
    const delay = Math.max(500, Math.round((item.pause || 2) * 1000));
    setAnnouncement(contentType === 'step_player' ? 'Step complete. Repeat or continue.' : 'Line complete. Repeat once before moving ahead.');
    setPhase('ready');
    setRepeatReady(true);

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setAnnouncement(contentType === 'step_player' ? 'Ready for repeat or next step.' : 'Ready for repeat or next line.');
    }, delay);
  };

  const playCurrent = (index = activeIndex, options = {}) => {
    const item = contentItems[index];
    if (!item) return;

    stopCurrentPlayback();
    setActiveIndex(index);
    setError('');
    setRepeatReady(false);

    if (contentType === 'line_player' && item.type === 'checkpoint') {
      setPhase('ready');
      setAnnouncement(item.hint || item.prompt || 'Take a quick pause and think.');
      return;
    }

    setPhase('speaking');
    setAnnouncement(
      options.reason === 'repeat'
        ? contentType === 'step_player'
          ? 'Repeating this step.'
          : 'Repeating the same line.'
        : contentType === 'step_player'
          ? 'Teacher is explaining the step.'
          : 'Teacher voice is speaking now.',
    );

    const speechText =
      contentType === 'step_player'
        ? item.stepText || item.question || item.explanation || ''
        : item.type === 'checkpoint'
          ? item.hint || item.prompt || ''
          : item.text || '';

    activeSpeechRef.current = speakText(
      speechText,
      {
        onStart: () => setPhase('speaking'),
        onEnd: () => {
          activeSpeechRef.current = null;
          scheduleRepeatReady(item);
        },
        onError: () => {
          activeSpeechRef.current = null;
          setPhase('ready');
          setRepeatReady(true);
          setError(
            contentType === 'step_player'
              ? 'Voice is not available right now. Read the step aloud and continue.'
              : 'Voice is not available right now. Tap repeat or read the line aloud and continue.',
          );
          setAnnouncement('Fallback mode is active.');
        },
      },
      { rate: contentType === 'step_player' ? 0.86 : 0.82, pitch: 1, volume: 1, lang: 'en-IN' },
    );

    if (!supportsSpeech) {
      setAnnouncement(
        contentType === 'step_player'
          ? 'Browser voice is unavailable. Use fallback step mode.'
          : 'Browser voice is unavailable. Use the fallback reading mode.',
      );
      setPhase('ready');
      setRepeatReady(true);
    }
  };

  const resumeCurrent = () => {
    if (phase === 'paused') {
      resumeSpeech();
      setPhase('speaking');
      setAnnouncement(contentType === 'step_player' ? 'Resuming the explanation.' : 'Resuming the teacher voice.');
      return;
    }

    playCurrent(activeIndex);
  };

  const pauseCurrent = () => {
    if (phase === 'speaking') {
      pauseSpeech();
      setPhase('paused');
      setAnnouncement(contentType === 'step_player' ? 'Step paused. Tap play to continue.' : 'Voice paused. Tap play to continue.');
      return;
    }

    if (phase === 'ready') {
      stopCurrentPlayback();
      setPhase('idle');
      setRepeatReady(false);
      setAnnouncement(contentType === 'step_player' ? 'Paused. Tap play to hear the step again.' : 'Paused. Tap play to hear the line again.');
    }
  };

  const goToIndex = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= contentItems.length) return;
    playCurrent(nextIndex);
  };

  const goNext = () => {
    if (!contentItems.length) return;
    if (activeIndex >= contentItems.length - 1) {
      stopCurrentPlayback();
      setPhase('finished');
      setRepeatReady(false);
      setAnnouncement(contentType === 'step_player' ? 'Lesson complete. Try another math lesson.' : 'Chapter complete. Choose another chapter or review a line.');
      return;
    }

    goToIndex(activeIndex + 1);
  };

  const goPrev = () => {
    if (!contentItems.length) return;
    goToIndex(Math.max(activeIndex - 1, 0));
  };

  const repeatCurrent = () => {
    if (!contentItems.length) return;
    playCurrent(activeIndex, { reason: 'repeat' });
  };

  if (!chapter) return null;

  if (!contentItems.length) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Empty lesson</p>
        <h2 className="mt-3 font-display text-2xl font-bold text-slate-950">No lesson content found</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This chapter exists, but the line or step data is missing. Add content in the local JSON file and the player
          will pick it up automatically.
        </p>
        <div className="mt-5">
          <Link to="/voice-learning" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to learning home
          </Link>
        </div>
      </div>
    );
  }

  const isMath = contentType === 'step_player';

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2.25rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/voice-learning"
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            {chapter.className}
          </span>
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            {isMath ? 'Step player' : 'Suno & Repeat'}
          </span>
        </div>

        <div className="mt-5 rounded-[1.75rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-premium sm:p-6">
          <p className="text-sm text-white/65">{chapter.subject}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{chapter.chapter}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">{chapter.description}</p>
        </div>

        <div className="mt-5 rounded-[1.75rem] border border-blue-100 bg-blue-50/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-blue-900">
              {isMath ? `Step ${activeIndex + 1} of ${contentItems.length}` : `Item ${activeIndex + 1} of ${contentItems.length}`}
            </p>
            <p className="text-sm font-semibold text-blue-800">{Math.round(progress)}% done</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isMath ? (
          <div className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Question</p>
            <p className="mt-3 font-display text-3xl font-bold leading-tight text-slate-950 sm:text-[2.2rem]">
              {activeItem?.question}
            </p>
            <div className="mt-5 rounded-[1.5rem] border border-blue-100 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current step</p>
              <p className="mt-2 text-lg font-semibold leading-8 text-slate-900">{activeItem?.stepText}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 shadow-sm ring-1 ring-emerald-100">
                {repeatReady ? 'Samjha?' : phase === 'speaking' ? 'Teaching' : 'Ready'}
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">Big text</span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">Step-by-step</span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">Practice ready</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {isCheckpointItem ? 'Checkpoint' : 'Current line'}
            </p>
            {isCheckpointItem ? (
              <div className="mt-3">
                <p className="font-display text-3xl font-bold leading-tight text-slate-950 sm:text-[2.2rem]">
                  {activeItem?.prompt}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{activeItem?.hint}</p>
              </div>
            ) : (
              <p className="mt-3 font-display text-3xl font-bold leading-tight text-slate-950 sm:text-[2.2rem]">
                {currentLineText}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 shadow-sm ring-1 ring-emerald-100">
                {repeatReady ? 'Repeat now' : phase === 'speaking' ? 'Listening' : 'Ready'}
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">Big text</span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">Slow voice</span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">Repeat friendly</span>
            </div>
          </div>
        )}

        <div className={`mt-5 grid gap-3 ${isMath ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-4'}`}>
          <PlayerButton onClick={goPrev} icon={SkipBack} label="Previous" tone="soft" disabled={!contentItems.length || activeIndex === 0} />
          <PlayerButton onClick={pauseCurrent} icon={Pause} label="Pause" tone="soft" disabled={!contentItems.length} />
          <PlayerButton onClick={resumeCurrent} icon={Play} label={phase === 'paused' ? 'Resume' : isMath ? 'Play step' : 'Play'} tone="blue" disabled={!contentItems.length} />
          <PlayerButton onClick={goNext} icon={ArrowRight} label={isMath ? 'Next step' : 'Next'} tone="dark" disabled={!contentItems.length} />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={repeatCurrent}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            <Repeat className="h-4 w-4" />
            {isMath ? 'Repeat step' : 'Repeat line'}
          </button>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            <BookOpenCheck className="h-4 w-4" />
            {isMath ? 'Ab khud try karo' : 'Move ahead'}
          </button>
        </div>

        <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            {isMath ? <Calculator className="h-4 w-4 text-blue-600" /> : <Volume2 className="h-4 w-4 text-blue-600" />}
            Teacher guidance
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">{announcement}</p>
          {error ? <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
          {!supportsSpeech ? (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              Browser voice is not supported here. The player stays usable in fallback mode, and you can plug in Google
              TTS or Azure Speech later through the service wrapper.
            </p>
          ) : null}
        </div>

        {contentType === 'line_player' && activeItem?.type === 'checkpoint' ? (
          <div className="mt-5 rounded-[1.75rem] border border-amber-100 bg-amber-50/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{activeItem.prompt}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{activeItem.hint}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => goToIndex(Math.max(activeIndex - 1, 0))}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
              >
                <Repeat className="h-4 w-4" />
                Repeat again
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-amber-800"
              >
                Next line
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {isMath ? (
          <div className="mt-5 rounded-[1.75rem] border border-blue-100 bg-blue-50/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
              {(activeIndex + 1) % 3 === 0 || activeIndex === contentItems.length - 1 ? 'Checkpoint' : 'Practice reminder'}
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold text-slate-950">
              {activeIndex + 1 === contentItems.length ? 'Ab khud try karo' : 'Samjha?'}
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {activeIndex + 1 === contentItems.length
                ? 'Aap next example ko khud solve karne ki koshish karo.'
                : 'Short pause lo, explanation repeat karo, aur next step par badho.'}
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-5">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
            <MessagesSquare className="h-4 w-4" />
            {isMath ? 'Simple Hinglish explanation' : 'Hinglish explanation'}
          </div>
          <p className="mt-4 text-lg font-semibold leading-8 text-slate-950">{currentExplanation}</p>
          <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">How to use</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {isMath
                ? 'Listen to the step, repeat it, then try the next step. The structure is ready for future solve-and-practice interaction.'
                : 'Listen to the line, repeat it, then read the meaning below in simple Hinglish. This keeps the flow teacher-like without making the screen busy.'}
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Mic className="h-4 w-4 text-blue-600" />
            Future-ready hooks
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              'Record student voice',
              'Quiz checkpoints',
              'Streak tracking',
              'Offline chapter packs',
              'Parent progress summary',
              'Practice playback review',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
