import express from 'express';
import cors from 'cors';
import learningRoutes from './routes/learningRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'class360-learning-api' });
});

app.use('/api', learningRoutes);

export default app;
