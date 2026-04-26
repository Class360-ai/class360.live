import express from 'express';
import cors from 'cors';
import learningRoutes from './routes/learningRoutes.js';
import sequentialCourseRoutes from './routes/sequentialCourseRoutes.js';
import {
  getSequentialCourseUnlockStatus,
  getSequentialCourseUserProgress,
  trackSequentialCourseNotes,
  trackSequentialCoursePodcast,
  trackSequentialCourseQuiz,
  trackSequentialCourseVideo,
  updateSequentialCourseProgress,
} from './controllers/sequentialCourseController.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'class360-learning-api' });
});

app.use('/api', learningRoutes);
app.use('/api/sequential-course', sequentialCourseRoutes);
app.post('/api/update-progress', updateSequentialCourseProgress);
app.post('/api/track/video', trackSequentialCourseVideo);
app.post('/api/track/notes', trackSequentialCourseNotes);
app.post('/api/track/podcast', trackSequentialCoursePodcast);
app.post('/api/track/quiz', trackSequentialCourseQuiz);
app.get('/api/user-progress', getSequentialCourseUserProgress);
app.get('/api/unlock-status', getSequentialCourseUnlockStatus);

export default app;
