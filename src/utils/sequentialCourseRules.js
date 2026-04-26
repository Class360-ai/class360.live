export const VIDEO_COMPLETION_PERCENT = 90;
export const NOTES_COMPLETION_SECONDS = 0;
export const PODCAST_COMPLETION_PERCENT = 80;
export const QUIZ_PASS_PERCENT = 60;

export function isDayCompleted(day = {}) {
  return (
    Number(day.videoProgress || 0) >= VIDEO_COMPLETION_PERCENT &&
    day.notesOpened === true &&
    Boolean(day.quizAttempted) === true
  );
}
