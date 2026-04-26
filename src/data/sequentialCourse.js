export const TOTAL_SEQUENTIAL_DAYS = 365;

const modulePalette = [
  'Foundation Sprint',
  'Concept Builder',
  'Revision Loop',
  'Applied Practice',
  'Confidence Booster',
  'Exam Readiness',
];

function buildQuiz(dayNumber) {
  const answerIndex = dayNumber % 4;
  const strategyIndex = (dayNumber + 1) % 4;

  return [
    {
      id: `day-${dayNumber}-q1`,
      question: `Day ${dayNumber}: what is the main goal of this lesson block?`,
      options: ['Memorize everything', 'Build one reliable concept', 'Skip to the next topic', 'Avoid practice'],
      correctAnswer: 'Build one reliable concept',
      explanation: 'Each day is designed around one core idea and one small action loop.',
    },
    {
      id: `day-${dayNumber}-q2`,
      question: `Which action keeps a daily learning sequence effective?`,
      options: ['Watching without notes', 'Doing only quizzes', 'Completing all four checkpoints', 'Jumping ahead'],
      correctAnswer: 'Completing all four checkpoints',
      explanation: 'The unlock system works when the student closes the full loop: video, notes, audio, and quiz.',
    },
    {
      id: `day-${dayNumber}-q3`,
      question: `Choose the best reflection habit for Day ${dayNumber}.`,
      options: [
        'Write one key takeaway',
        'Ignore doubts',
        'Pause progress for a week',
        'Repeat wrong answers only',
      ],
      correctAnswer: 'Write one key takeaway',
      explanation: 'A short reflection helps retention and makes the streak easier to sustain.',
    },
    {
      id: `day-${dayNumber}-q4`,
      question: `What should happen after Day ${dayNumber} is passed?`,
      options: [
        'The sequence resets',
        `Day ${Math.min(dayNumber + 1, TOTAL_SEQUENTIAL_DAYS)} unlocks`,
        'All days unlock',
        'Quiz marks are erased',
      ],
      correctAnswer: `Day ${Math.min(dayNumber + 1, TOTAL_SEQUENTIAL_DAYS)} unlocks`,
      explanation: 'Sequential unlocking keeps the learner focused and prevents skipping.',
    },
  ].map((question, index) => ({
    ...question,
    options:
      index === 0
        ? question.options.map((option, optionIndex) => question.options[(optionIndex + answerIndex) % 4])
        : index === 3
          ? question.options.map((option, optionIndex) => question.options[(optionIndex + strategyIndex) % 4])
          : question.options,
  }));
}

function buildNotes(dayNumber, moduleName) {
  return [
    `Day ${dayNumber} belongs to the ${moduleName} module and focuses on one digestible learning outcome.`,
    'Watch the full lesson, open the notes, listen to the audio recap, and finish the quiz before moving ahead.',
    'Use the reflection prompt at the end of the day to capture one concept, one example, and one doubt.',
  ];
}

export function createSequentialCourseDays() {
  return Array.from({ length: TOTAL_SEQUENTIAL_DAYS }, (_, index) => {
    const dayNumber = index + 1;
    const moduleName = modulePalette[Math.floor(index / 61) % modulePalette.length];

    return {
      dayNumber,
      slug: `day-${dayNumber}`,
      title: `Day ${dayNumber}: ${moduleName} Session`,
      module: moduleName,
      description: `A focused lesson for Day ${dayNumber} with video, notes, story podcast, and a quiz checkpoint.`,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      videoPoster: `https://picsum.photos/seed/class360-day-${dayNumber}/960/540`,
      notesUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      notesSummary: buildNotes(dayNumber, moduleName),
      podcastUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      podcastTitle: `Day ${dayNumber} Audio Story`,
      durationLabel: `${12 + (dayNumber % 9)} min`,
      quiz: buildQuiz(dayNumber),
    };
  });
}

export const sequentialCourseDays = createSequentialCourseDays();

export function getSequentialCourseDay(dayNumber) {
  return sequentialCourseDays.find((day) => day.dayNumber === Number(dayNumber)) || null;
}
