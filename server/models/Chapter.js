import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema(
  {
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    title: String,
    slug: { type: String, unique: true, index: true },
    description: String,
    videoUrl: String,
    duration: String,
    order: Number,
  },
  { timestamps: true },
);

export default mongoose.model('Chapter', ChapterSchema);
