import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    type: { type: String, enum: ['practice', 'dpp', 'test'] },
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
    difficulty: String,
  },
  { timestamps: true },
);

export default mongoose.model('Question', QuestionSchema);
