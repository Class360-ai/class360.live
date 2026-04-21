import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Note from '../models/Note.js';
import Question from '../models/Question.js';
import StudentProgress from '../models/StudentProgress.js';
import Doubt from '../models/Doubt.js';
import {
  learningSubject,
  learningChapters,
  learningNotes,
  learningQuestions,
  learningProgressSeed,
  getLearningProgressMap,
  getLearningSubjectProgress,
  getLearningDashboardSnapshot,
  getLearningChapterBySlug,
  getLearningChaptersForSubject,
  getLearningChaptersForClassLevel,
  getLearningSubjectsForClassLevel,
  getLearningNotesByChapterSlug,
  getLearningQuestionsByChapterSlugAndType,
} from '../../src/data/learningData.js';
import {
  dailyTradingSeriesSlug,
  getDailyTradingSeriesDays,
  getDailyTradingSeriesLessonByDay,
  getDailyTradingSeriesProgressMap,
  getDailyTradingSeriesSnapshot,
} from '../../src/data/dailyTradingSeries.js';

const dailySeriesProgressStore = new Map();

function progressMapFromRows(rows) {
  const map = {};
  rows.forEach((row) => {
    if (row.chapterSlug) map[row.chapterSlug] = row;
  });
  return map;
}

function dailyProgressMap() {
  return getDailyTradingSeriesProgressMap(Array.from(dailySeriesProgressStore.values()));
}

async function getSeedOrDbSubjects() {
  const subjects = await Subject.find().lean();
  return subjects.length ? subjects : [learningSubject];
}

export async function getSubjects(req, res) {
  const { classLevel } = req.query;
  const subjects = await getSeedOrDbSubjects();
  const filtered = classLevel ? getLearningSubjectsForClassLevel(classLevel) : subjects;
  res.json({ subjects: filtered.length ? filtered : subjects });
}

export async function getSubjectChapters(req, res) {
  const { slug } = req.params;
  const { classLevel } = req.query;
  const subject = await Subject.findOne({ slug }).lean();
  if (!subject) {
    return res.json({
      subject: learningSubject,
      chapters: classLevel ? getLearningChaptersForClassLevel(classLevel) : getLearningChaptersForSubject(slug),
    });
  }
  const chapters = await Chapter.find({ subjectId: subject._id }).sort({ order: 1 }).lean();
  res.json({ subject, chapters: classLevel ? chapters.filter((chapter) => chapter.classLevel === classLevel || !chapter.classLevel) : chapters });
}

export async function getChapter(req, res) {
  const { slug } = req.params;
  const { classLevel } = req.query;
  const chapter = await Chapter.findOne({ slug }).lean();
  if (!chapter) {
    return res.json({
      chapter: getLearningChapterBySlug(slug),
      notes: getLearningNotesByChapterSlug(slug),
      practiceQuestions: getLearningQuestionsByChapterSlugAndType(slug, 'practice'),
      dppQuestions: getLearningQuestionsByChapterSlugAndType(slug, 'dpp'),
      testQuestions: getLearningQuestionsByChapterSlugAndType(slug, 'test'),
    });
  }

  const notes = await Note.findOne({ chapterId: chapter._id }).lean();
  const questions = await Question.find({ chapterId: chapter._id }).lean();
  res.json({
    chapter,
    notes,
    practiceQuestions: questions.filter((item) => item.type === 'practice' && (!classLevel || item.classLevel === classLevel || !item.classLevel)),
    dppQuestions: questions.filter((item) => item.type === 'dpp' && (!classLevel || item.classLevel === classLevel || !item.classLevel)),
    testQuestions: questions.filter((item) => item.type === 'test' && (!classLevel || item.classLevel === classLevel || !item.classLevel)),
  });
}

export async function getChapterNotes(req, res) {
  const { slug } = req.params;
  const { classLevel } = req.query;
  const chapter = await Chapter.findOne({ slug }).lean();
  if (!chapter) {
    return res.json({ notes: getLearningNotesByChapterSlug(slug) });
  }
  const notes = await Note.findOne({ chapterId: chapter._id }).lean();
  res.json({ notes: !classLevel || notes?.classLevel === classLevel || !notes?.classLevel ? notes : null });
}

export async function getChapterQuestions(req, res) {
  const { slug } = req.params;
  const { type } = req.query;
  const { classLevel } = req.query;
  const chapter = await Chapter.findOne({ slug }).lean();
  if (!chapter) {
    return res.json({
      questions: getLearningQuestionsByChapterSlugAndType(slug, type || 'test'),
    });
  }
  const questions = await Question.find({ chapterId: chapter._id, ...(type ? { type } : {}) }).lean();
  res.json({
    questions: questions.filter((item) => !classLevel || item.classLevel === classLevel || !item.classLevel),
  });
}

export async function updateProgress(req, res) {
  const { userId = 'student-001', chapterSlug, ...patch } = req.body || {};
  const chapter = await Chapter.findOne({ slug: chapterSlug }).lean();
  if (!chapter) {
    return res.status(404).json({ message: 'Chapter not found' });
  }

  const updated = await StudentProgress.findOneAndUpdate(
    { userId, chapterId: chapter._id },
    { userId, chapterId: chapter._id, ...patch },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();

  res.json({ ok: true, progress: updated });
}

export async function getProgressByUser(req, res) {
  const { userId } = req.params;
  const { classLevel } = req.query;
  const rows = await StudentProgress.find({ userId }).lean();
  if (!rows.length) {
    const seedMap = getLearningProgressMap(learningProgressSeed);
    return res.json({
      userId,
      progress: seedMap,
      dashboard: getLearningDashboardSnapshot(seedMap, classLevel),
      subjectProgress: getLearningSubjectProgress(learningSubject.slug, seedMap),
    });
  }
  const map = progressMapFromRows(rows);
  res.json({
    userId,
    progress: map,
    dashboard: getLearningDashboardSnapshot(map, classLevel),
    subjectProgress: getLearningSubjectProgress(learningSubject.slug, map),
  });
}

export async function askDoubt(req, res) {
  const { userId = 'student-001', chapterSlug, question } = req.body || {};
  const chapter = await Chapter.findOne({ slug: chapterSlug }).lean();
  if (!chapter) {
    return res.status(404).json({ message: 'Chapter not found' });
  }

  const record = await Doubt.create({
    userId,
    chapterId: chapter._id,
    question,
    answer: 'This is a placeholder AI response. Connect your AI service here later.',
    status: 'answered',
  });

  res.json({ ok: true, answer: record.answer, doubt: record });
}

export async function getDashboard(req, res) {
  const rows = await StudentProgress.find().lean();
  const map = rows.length ? progressMapFromRows(rows) : getLearningProgressMap(learningProgressSeed);
  const { classLevel } = req.query;
  res.json({
    dashboard: getLearningDashboardSnapshot(map, classLevel),
    progress: map,
    subjectProgress: getLearningSubjectProgress(learningSubject.slug, map),
  });
}

export async function getDailySeries(req, res) {
  const snapshot = getDailyTradingSeriesSnapshot(dailyProgressMap());
  res.json({
    seriesSlug: dailyTradingSeriesSlug,
    ...snapshot,
    days: snapshot.lessons || getDailyTradingSeriesDays(),
  });
}

export async function getDailySeriesDay(req, res) {
  const { dayNumber } = req.params;
  const lesson = getDailyTradingSeriesLessonByDay(dayNumber);
  if (!lesson) {
    return res.status(404).json({ message: 'Daily lesson not found' });
  }

  const snapshot = getDailyTradingSeriesSnapshot(dailyProgressMap());
  const merged = snapshot.lessons.find((item) => item.dayNumber === Number(dayNumber)) || lesson;
  res.json({ seriesSlug: dailyTradingSeriesSlug, lesson: merged });
}

export async function getDailySeriesProgressByUser(req, res) {
  const { userId } = req.params;
  const rows = Array.from(dailySeriesProgressStore.values()).filter((row) => row.userId === userId);
  const map = getDailyTradingSeriesProgressMap(rows);
  const snapshot = getDailyTradingSeriesSnapshot(map);
  res.json({
    userId,
    progress: map,
    ...snapshot,
  });
}

export async function updateDailySeriesProgress(req, res) {
  const { userId = 'student-001', daySlug, ...patch } = req.body || {};
  if (!daySlug) {
    return res.status(400).json({ message: 'daySlug is required' });
  }

  const key = `${userId}:${daySlug}`;
  const current = dailySeriesProgressStore.get(key) || {};
  const next = {
    userId,
    daySlug,
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  dailySeriesProgressStore.set(key, next);
  res.json({
    ok: true,
    progress: next,
    snapshot: getDailyTradingSeriesSnapshot(dailyProgressMap()),
  });
}
