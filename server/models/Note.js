import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    summaryPoints: [String],
    keyTerms: [String],
    examples: [String],
    revisionBox: String,
  },
  { timestamps: true },
);

export default mongoose.model('Note', NoteSchema);
