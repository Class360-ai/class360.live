import mongoose from 'mongoose';

const sequentialCourseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },
    videoCompleted: {
      type: Boolean,
      default: false,
    },
    videoProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    notesOpened: {
      type: Boolean,
      default: false,
    },
    notesCompleted: {
      type: Boolean,
      default: false,
    },
    notesTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    podcastCompleted: {
      type: Boolean,
      default: false,
    },
    podcastProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    quizPassed: {
      type: Boolean,
      default: false,
    },
    quizAttempted: {
      type: Boolean,
      default: false,
    },
    quizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    quizTimeTaken: {
      type: Number,
      default: 0,
      min: 0,
    },
    weakAreas: {
      type: [String],
      default: [],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

sequentialCourseProgressSchema.index({ userId: 1, dayNumber: 1 }, { unique: true });

export default mongoose.models.SequentialCourseProgress ||
  mongoose.model('SequentialCourseProgress', sequentialCourseProgressSchema);
