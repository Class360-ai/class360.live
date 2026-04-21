import mongoose from 'mongoose';

const StudentProgressSchema = new mongoose.Schema(
  {
    userId: String,
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    watchedPercent: Number,
    notesRead: Boolean,
    practiceScore: Number,
    dppScore: Number,
    testScore: Number,
    completed: Boolean,
    weakAreas: [String],
  },
  { timestamps: true },
);

StudentProgressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

export default mongoose.model('StudentProgress', StudentProgressSchema);
