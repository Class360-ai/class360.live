import { useEffect, useMemo, useState } from 'react';
import { Trash2, Save, RotateCcw, Search, CalendarDays, BadgeCheck } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import SectionTitle from '../../components/SectionTitle';
import {
  buildYouTubeEmbedUrl,
  buildYouTubeThumbnailUrl,
  extractYouTubeVideoId,
  isValidYouTubeUrl,
  normalizeDailyTradingSeriesLesson,
} from '../../data/dailyTradingSeries';
import {
  deleteStoredDailySeriesLesson,
  getStoredDailySeriesAdminContent,
  saveStoredDailySeriesLesson,
} from '../../utils/dailySeriesStorage';

function splitLines(value) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(value) {
  return Array.isArray(value) ? value.join('\n') : String(value || '');
}

function quizToForm(quiz = []) {
  const first = quiz[0] || {};
  return {
    quizQuestion: first.question || '',
    quizOptions: Array.isArray(first.options) ? first.options.join('\n') : '',
    quizAnswer: first.correctAnswer || '',
    quizExplanation: first.explanation || '',
  };
}

function formFromLesson(lesson) {
  return {
    dayNumber: lesson?.dayNumber || 1,
    title: lesson?.title || '',
    module: lesson?.module || '',
    specialModule: lesson?.specialModule || '',
    description: lesson?.description || '',
    videoType: lesson?.videoType || 'youtube',
    youtubeURL: lesson?.youtubeURL || lesson?.videoUrl || '',
    thumbnail: lesson?.thumbnail || '',
    notes: lesson?.notes || '',
    keyPoints: joinLines(lesson?.keyPoints || []),
    homeworkTask: lesson?.homeworkTask || '',
    releaseDate: lesson?.releaseDate || '',
    autoPublish: lesson?.autoPublish !== false,
    ...quizToForm(lesson?.quiz || []),
  };
}

function buildLessonPayload(form) {
  const dayNumber = Number(form.dayNumber || 1);
  return normalizeDailyTradingSeriesLesson({
    dayNumber,
    daySlug: `day-${dayNumber}`,
    slug: `day-${dayNumber}`,
    title: String(form.title || `Day ${dayNumber}`).trim(),
    module: String(form.module || '').trim(),
    specialModule: String(form.specialModule || '').trim(),
    description: String(form.description || '').trim(),
    videoType: String(form.videoType || 'youtube').trim(),
    youtubeURL: String(form.youtubeURL || '').trim(),
    thumbnail: String(form.thumbnail || '').trim(),
    notes: String(form.notes || '').trim(),
    keyPoints: splitLines(form.keyPoints),
    homeworkTask: String(form.homeworkTask || '').trim(),
    releaseDate: String(form.releaseDate || '').trim(),
    autoPublish: Boolean(form.autoPublish),
    quiz: form.quizQuestion
      ? [
          {
            id: `day-${dayNumber}-quiz-1`,
            question: String(form.quizQuestion || '').trim(),
            options: splitLines(form.quizOptions).slice(0, 4),
            correctAnswer: String(form.quizAnswer || '').trim(),
            explanation: String(form.quizExplanation || '').trim(),
          },
        ]
      : [],
  });
}

export default function AdminDailySeriesPage() {
  const [content, setContent] = useState(() => getStoredDailySeriesAdminContent());
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(() => formFromLesson(getStoredDailySeriesAdminContent().lessons?.[0]));

  useEffect(() => {
    const sync = () => setContent(getStoredDailySeriesAdminContent());
    sync();
    window.addEventListener('class360-daily-series-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('class360-daily-series-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const lessons = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (content.lessons || []).filter((lesson) => {
      if (!query) return true;
      return String(lesson.dayNumber).includes(query) || String(lesson.title || '').toLowerCase().includes(query);
    });
  }, [content.lessons, search]);

  const selectedLesson = useMemo(
    () => (content.lessons || []).find((lesson) => Number(lesson.dayNumber) === Number(selectedDay)) || content.lessons?.[0] || null,
    [content.lessons, selectedDay],
  );

  const previewVideoId = useMemo(() => extractYouTubeVideoId(form.youtubeURL), [form.youtubeURL]);
  const previewEmbedUrl = useMemo(
    () => (previewVideoId ? buildYouTubeEmbedUrl(previewVideoId) : ''),
    [previewVideoId],
  );
  const previewThumbnail = useMemo(
    () => (previewVideoId ? buildYouTubeThumbnailUrl(previewVideoId) : ''),
    [previewVideoId],
  );
  const youtubeValidationMessage = useMemo(() => {
    if (form.videoType !== 'youtube') return '';
    if (!String(form.youtubeURL || '').trim()) return 'YouTube URL is required when video type is YouTube.';
    if (!isValidYouTubeUrl(form.youtubeURL)) return 'Only youtube.com and youtu.be links are allowed.';
    return '';
  }, [form.videoType, form.youtubeURL]);

  useEffect(() => {
    if (!selectedLesson) return;
    setForm(formFromLesson(selectedLesson));
  }, [selectedLesson]);

  const stats = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const published = (content.lessons || []).filter((lesson) => String(lesson.releaseDate || '') <= todayKey).length;
    const scheduled = (content.lessons || []).length - published;
    return {
      total: (content.lessons || []).length,
      published,
      scheduled,
    };
  }, [content.lessons]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (youtubeValidationMessage) {
      setFormError(youtubeValidationMessage);
      return;
    }
    setFormError('');
    saveStoredDailySeriesLesson(buildLessonPayload(form));
    setContent(getStoredDailySeriesAdminContent());
  };

  const handleDelete = () => {
    if (!window.confirm(`Reset Day ${form.dayNumber} back to the default generated lesson?`)) return;
    deleteStoredDailySeriesLesson(`day-${Number(form.dayNumber || 1)}`);
    setContent(getStoredDailySeriesAdminContent());
    setSelectedDay(Number(form.dayNumber || 1));
  };

  return (
    <AdminShell
      title="Daily Learning Series"
      subtitle="Manage the 365-day trading series, release schedule, video links, notes and quiz content."
      actions={[
        <div key="meta" className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
          <BadgeCheck className="h-4 w-4" />
          Daily auto publish enabled
        </div>,
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total lessons', value: stats.total },
          { label: 'Published', value: stats.published },
          { label: 'Scheduled', value: stats.scheduled },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            eyebrow="Lesson picker"
            title="Find a day"
            subtitle="Search by day number or title and open it in the editor."
          />
          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search Day 1, Day 120, psychology..."
            />
          </label>

          <div className="mt-5 max-h-[680px] space-y-3 overflow-auto pr-1">
            {lessons.map((lesson) => (
              <button
                key={lesson.daySlug}
                type="button"
                onClick={() => setSelectedDay(lesson.dayNumber)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  Number(selectedDay) === Number(lesson.dayNumber)
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Day {lesson.dayNumber}</p>
                    <p className="mt-1 font-semibold text-slate-950">{lesson.title}</p>
                    <p className="mt-1 text-xs font-semibold text-blue-700">{lesson.releaseDate}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {lesson.module}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            eyebrow="Editor"
            title={`Edit Day ${form.dayNumber}`}
            subtitle="Update the daily video, notes, quiz and scheduled release."
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Day number</span>
              <input
                type="number"
                min="1"
                max="365"
                value={form.dayNumber}
                onChange={(event) => setForm((prev) => ({ ...prev, dayNumber: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Release date</span>
              <input
                type="date"
                value={form.releaseDate}
                onChange={(event) => setForm((prev) => ({ ...prev, releaseDate: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Title</span>
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                placeholder="Day 1: Money Basics"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Module</span>
              <input
                value={form.module}
                onChange={(event) => setForm((prev) => ({ ...prev, module: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                placeholder="Money basics"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Video type</span>
              <select
                value={form.videoType}
                onChange={(event) => setForm((prev) => ({ ...prev, videoType: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              >
                <option value="youtube">youtube</option>
                <option value="upload">upload</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">YouTube URL</span>
              <input
                value={form.youtubeURL}
                onChange={(event) => setForm((prev) => ({ ...prev, youtubeURL: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                placeholder="https://www.youtube.com/watch?v=EZUyYwde_DI"
              />
              <p className="text-xs text-slate-500">Required when video type is YouTube. Only youtube.com and youtu.be are allowed.</p>
            </label>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                placeholder="Short lesson description"
              />
            </label>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Instant preview</p>
              <p className="mt-1 text-xs text-slate-500">The preview updates as soon as a valid YouTube URL is pasted.</p>
              {previewEmbedUrl ? (
                <div className="mt-4 overflow-hidden rounded-[1.25rem] bg-slate-950 shadow-sm">
                  <div className="aspect-video">
                    <iframe
                      className="h-full w-full"
                      src={previewEmbedUrl}
                      title={form.title || 'YouTube preview'}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : previewThumbnail ? (
                <div className="mt-4 overflow-hidden rounded-[1.25rem] bg-slate-950 shadow-sm">
                  <div className="aspect-video">
                    <img src={previewThumbnail} alt={form.title || 'YouTube preview'} className="h-full w-full object-cover" />
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-[1.25rem] border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
                  Paste a valid YouTube link to see the preview.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Thumbnail preview</span>
              <input
                value={form.thumbnail}
                onChange={(event) => setForm((prev) => ({ ...prev, thumbnail: event.target.value }))}
                readOnly={form.videoType === 'youtube'}
                className={`rounded-2xl border px-4 py-3 text-sm outline-none ${
                  form.videoType === 'youtube'
                    ? 'border-slate-200 bg-slate-100 text-slate-600'
                    : 'border-slate-200 bg-slate-50 focus:border-blue-400'
                }`}
                placeholder="Auto-generated from the YouTube URL"
              />
              <p className="text-xs text-slate-500">
                {form.videoType === 'youtube'
                  ? 'Generated automatically from the YouTube video ID.'
                  : 'Optional thumbnail for future upload-based lessons.'}
              </p>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Generated embed URL</span>
              <input
                value={previewEmbedUrl}
                readOnly
                className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none"
                placeholder="https://www.youtube.com/embed/..."
              />
              <p className="text-xs text-slate-500">This is created automatically from the YouTube URL.</p>
            </label>
          </div>

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="Write the lesson notes here"
            />
          </label>

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Key points</span>
            <textarea
              value={form.keyPoints}
              onChange={(event) => setForm((prev) => ({ ...prev, keyPoints: event.target.value }))}
              className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="One point per line"
            />
          </label>

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Homework task</span>
            <textarea
              value={form.homeworkTask}
              onChange={(event) => setForm((prev) => ({ ...prev, homeworkTask: event.target.value }))}
              className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
              placeholder="Homework task for the learner"
            />
          </label>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Quiz question</span>
              <textarea
                value={form.quizQuestion}
                onChange={(event) => setForm((prev) => ({ ...prev, quizQuestion: event.target.value }))}
                className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                placeholder="Simple quiz question"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Quiz options</span>
              <textarea
                value={form.quizOptions}
                onChange={(event) => setForm((prev) => ({ ...prev, quizOptions: event.target.value }))}
                className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Correct answer</span>
              <input
                value={form.quizAnswer}
                onChange={(event) => setForm((prev) => ({ ...prev, quizAnswer: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                placeholder="Type the correct option exactly"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Quiz explanation</span>
              <input
                value={form.quizExplanation}
                onChange={(event) => setForm((prev) => ({ ...prev, quizExplanation: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                placeholder="Short explanation"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.autoPublish}
                onChange={(event) => setForm((prev) => ({ ...prev, autoPublish: event.target.checked }))}
              />
              Auto publish on release date
            </label>
          </div>

          {formError ? (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{formError}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              <Save className="h-4 w-4" />
              Save Day
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" />
              Reset Day
            </button>
            <button
              type="button"
              onClick={() => setForm(formFromLesson(selectedLesson))}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4" />
              Reload selected
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
