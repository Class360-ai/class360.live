import { Router } from 'express';
import {
  askDoubt,
  getDailySeries,
  getDailySeriesDay,
  getDailySeriesProgressByUser,
  getChapter,
  getChapterNotes,
  getChapterQuestions,
  getDashboard,
  getProgressByUser,
  getSubjectChapters,
  getSubjects,
  updateProgress,
  updateDailySeriesProgress,
  getLiveClasses,
  joinLiveClass,
  setLiveClassReminder,
} from '../controllers/learningController.js';

const router = Router();

router.get('/subjects', getSubjects);
router.get('/subjects/:slug/chapters', getSubjectChapters);
router.get('/chapters/:slug', getChapter);
router.get('/chapters/:slug/notes', getChapterNotes);
router.get('/chapters/:slug/questions', getChapterQuestions);
router.post('/progress/update', updateProgress);
router.get('/progress/:userId', getProgressByUser);
router.post('/ai/doubt', askDoubt);
router.get('/dashboard', getDashboard);
router.get('/live-classes', getLiveClasses);
router.post('/live-classes/:id/join', joinLiveClass);
router.post('/live-classes/:id/reminder', setLiveClassReminder);
router.get('/daily-series/progress/:userId', getDailySeriesProgressByUser);
router.post('/daily-series/progress/update', updateDailySeriesProgress);
router.get('/daily-series/:slug/days/:dayNumber', getDailySeriesDay);
router.get('/daily-series/:slug', getDailySeries);

export default router;
