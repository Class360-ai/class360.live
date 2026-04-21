import mongoose from 'mongoose';

const DoubtSchema = new mongoose.Schema(
  {
    userId: String,
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    question: String,
    answer: String,
    status: { type: String, enum: ['open', 'answered'], default: 'open' },
  },
  { timestamps: true },
);

export default mongoose.model('Doubt', DoubtSchema);
