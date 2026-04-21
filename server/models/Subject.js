import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema(
  {
    classLevel: String,
    name: String,
    slug: { type: String, unique: true, index: true },
    coverImage: String,
  },
  { timestamps: true },
);

export default mongoose.model('Subject', SubjectSchema);
