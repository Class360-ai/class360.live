import { Router } from 'express';
import {
  getSequentialCourseDayByNumber,
  getSequentialCourseDays,
  getSequentialCourseUnlockStatus,
  getSequentialCourseUserProgress,
  trackSequentialCourseNotes,
  trackSequentialCoursePodcast,
  trackSequentialCourseQuiz,
  trackSequentialCourseVideo,
  updateSequentialCourseProgress,
} from '../controllers/sequentialCourseController.js';

const router = Router();

router.get('/days', getSequentialCourseDays);
router.get('/days/:dayNumber', getSequentialCourseDayByNumber);
router.post('/update-progress', updateSequentialCourseProgress);
router.post('/track/video', trackSequentialCourseVideo);
router.post('/track/notes', trackSequentialCourseNotes);
router.post('/track/podcast', trackSequentialCoursePodcast);
router.post('/track/quiz', trackSequentialCourseQuiz);
router.get('/user-progress', getSequentialCourseUserProgress);
router.get('/unlock-status', getSequentialCourseUnlockStatus);

export default router;
