export const learningSubject = {
  classLevel: 'Class 6',
  name: 'Science',
  slug: 'class-6-science',
  coverImage:
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
  description:
    'Story-based science learning with videos, notes, practice, DPP, tests, AI doubt support, and progress tracking.',
};

export const learningSubjects = [learningSubject];

const careerLearningSlugs = new Set(['business-market-learning']);

function isCareerLearningSubject(subject) {
  return careerLearningSlugs.has(subject.slug) || String(subject.category || '').toLowerCase().includes('career');
}

export const learningChapters = [
  {
    subjectSlug: learningSubject.slug,
    title: 'Living and Non-Living Things',
    slug: 'living-and-non-living-things',
    description: 'Learn how to tell life from non-life with simple examples from home and school.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '08 min',
    order: 1,
    objectives: [
      'Identify living and non-living things',
      'Understand growth, breathing, and response',
      'Apply a simple yes/no check to classify objects',
    ],
  },
  {
    subjectSlug: learningSubject.slug,
    title: 'Parts of a Plant',
    slug: 'parts-of-a-plant',
    description: 'Explore roots, stems, leaves, flowers, fruits, and seeds through a garden story.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '09 min',
    order: 2,
    objectives: [
      'Name the major parts of a plant',
      'Explain the function of each plant part',
      'Connect flower, fruit, and seed in the cycle',
    ],
  },
  {
    subjectSlug: learningSubject.slug,
    title: 'Food and Nutrition',
    slug: 'food-and-nutrition',
    description: 'Understand nutrients, balanced diet, and digestion with a home-kitchen story.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '10 min',
    order: 3,
    objectives: [
      'Identify nutrients in common foods',
      'Build a balanced plate',
      'Understand why digestion matters',
    ],
  },
  {
    subjectSlug: learningSubject.slug,
    title: 'Matter Around Us',
    slug: 'matter-around-us',
    description: 'Compare solids, liquids, and gases using everyday objects and water.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '08 min',
    order: 4,
    objectives: [
      'Differentiate solids, liquids, and gases',
      'Observe shape and volume changes',
      'Use examples from the classroom and home',
    ],
  },
  {
    subjectSlug: learningSubject.slug,
    title: 'Light, Shadows, and Reflection',
    slug: 'light-shadows-reflection',
    description: 'See how light travels, how shadows form, and how mirrors reflect light.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '09 min',
    order: 5,
    objectives: [
      'Explain shadow formation',
      'Recognize reflection in mirrors',
      'Predict how shadow size changes',
    ],
  },
];

export const learningNotes = {
  'living-and-non-living-things': {
    summaryPoints: [
      'Living things grow, breathe, and respond to changes.',
      'Non-living things do not show life processes.',
      'Movement alone does not always mean life.',
    ],
    keyTerms: ['Living', 'Non-living', 'Growth', 'Response'],
    examples: ['Seed', 'Cat', 'Rock', 'Ball'],
    revisionBox: 'Ask: Does it grow, breathe, and respond? If yes, it is living.',
  },
  'parts-of-a-plant': {
    summaryPoints: [
      'Roots absorb water and hold the plant.',
      'Stems carry water and support the plant.',
      'Leaves help make food for the plant.',
    ],
    keyTerms: ['Root', 'Stem', 'Leaf', 'Flower', 'Seed'],
    examples: ['Radish root', 'Mango leaf', 'Rose flower'],
    revisionBox: 'Roots below, stem in the middle, leaves above.',
  },
  'food-and-nutrition': {
    summaryPoints: [
      'Carbohydrates and fats give energy.',
      'Proteins help growth and repair.',
      'Vitamins and minerals protect the body.',
    ],
    keyTerms: ['Nutrients', 'Balanced diet', 'Protein', 'Energy'],
    examples: ['Rice', 'Dal', 'Milk', 'Fruit'],
    revisionBox: 'A balanced plate includes energy, growth, and protection foods.',
  },
  'matter-around-us': {
    summaryPoints: [
      'Matter has mass and occupies space.',
      'Solids, liquids, and gases are the common states.',
      'Temperature can change the state of matter.',
    ],
    keyTerms: ['Matter', 'Solid', 'Liquid', 'Gas', 'Volume'],
    examples: ['Ice', 'Water', 'Steam', 'Air'],
    revisionBox: 'Fixed shape means solid. Fixed volume but no shape means liquid.',
  },
  'light-shadows-reflection': {
    summaryPoints: [
      'A shadow forms when light is blocked.',
      'Mirror reflection sends light back to our eyes.',
      'Shadow size changes with distance and angle.',
    ],
    keyTerms: ['Light source', 'Shadow', 'Reflection', 'Mirror'],
    examples: ['Torch', 'Wall shadow', 'Hand mirror'],
    revisionBox: 'No light block means no shadow.',
  },
};

export const learningQuestions = {
  practice: {
    'living-and-non-living-things': [
      {
        id: 'lnt-p1',
        question: 'Which one shows growth on its own?',
        options: ['Rock', 'Seed', 'Chair', 'Bottle'],
        correctAnswer: 'Seed',
        explanation: 'A seed can grow into a plant.',
      },
      {
        id: 'lnt-p2',
        question: 'Which is non-living?',
        options: ['Dog', 'Tree', 'Rock', 'Bird'],
        correctAnswer: 'Rock',
        explanation: 'A rock does not breathe or grow.',
      },
      {
        id: 'lnt-p3',
        question: 'A ball moves when pushed. This means the ball is:',
        options: ['Living', 'Non-living', 'Plant', 'Animal'],
        correctAnswer: 'Non-living',
        explanation: 'Movement caused by outside force does not mean life.',
      },
    ],
    'parts-of-a-plant': [
      {
        id: 'pop-p1',
        question: 'Which part absorbs water from soil?',
        options: ['Leaf', 'Root', 'Flower', 'Fruit'],
        correctAnswer: 'Root',
        explanation: 'Roots take in water and minerals.',
      },
      {
        id: 'pop-p2',
        question: 'Which part makes food for the plant?',
        options: ['Stem', 'Leaf', 'Seed', 'Fruit'],
        correctAnswer: 'Leaf',
        explanation: 'Leaves use sunlight to make food.',
      },
      {
        id: 'pop-p3',
        question: 'The stem mainly helps the plant to:',
        options: ['Eat food', 'Support the plant', 'Make seeds', 'Change color'],
        correctAnswer: 'Support the plant',
        explanation: 'The stem holds the plant upright and carries water.',
      },
    ],
    'food-and-nutrition': [
      {
        id: 'fan-p1',
        question: 'Which food gives energy?',
        options: ['Rice', 'Salt', 'Water', 'Paper'],
        correctAnswer: 'Rice',
        explanation: 'Rice contains carbohydrates which give energy.',
      },
      {
        id: 'fan-p2',
        question: 'Which nutrient helps growth and repair?',
        options: ['Protein', 'Sugar', 'Oil', 'Fiber'],
        correctAnswer: 'Protein',
        explanation: 'Proteins are needed for growth and repair.',
      },
      {
        id: 'fan-p3',
        question: 'A balanced meal should include:',
        options: ['Only sweets', 'Only rice', 'Many food groups', 'Only fruits'],
        correctAnswer: 'Many food groups',
        explanation: 'A balanced meal includes several nutrients.',
      },
    ],
    'matter-around-us': [
      {
        id: 'mau-p1',
        question: 'Which state has a fixed shape?',
        options: ['Solid', 'Liquid', 'Gas', 'Fog'],
        correctAnswer: 'Solid',
        explanation: 'Solids keep a fixed shape.',
      },
      {
        id: 'mau-p2',
        question: 'Which state can flow and take the shape of the container?',
        options: ['Solid', 'Liquid', 'Stone', 'Wood'],
        correctAnswer: 'Liquid',
        explanation: 'Liquids flow and adapt to the container shape.',
      },
      {
        id: 'mau-p3',
        question: 'Air is an example of:',
        options: ['Solid', 'Liquid', 'Gas', 'Metal'],
        correctAnswer: 'Gas',
        explanation: 'Air spreads out and fills space like a gas.',
      },
    ],
    'light-shadows-reflection': [
      {
        id: 'lsr-p1',
        question: 'A shadow is formed when light is:',
        options: ['Blocked', 'Painted', 'Heated', 'Stored'],
        correctAnswer: 'Blocked',
        explanation: 'A shadow appears when an object blocks light.',
      },
      {
        id: 'lsr-p2',
        question: 'Which object reflects light well?',
        options: ['Mirror', 'Book', 'Rope', 'Sponge'],
        correctAnswer: 'Mirror',
        explanation: 'A mirror reflects light clearly.',
      },
      {
        id: 'lsr-p3',
        question: 'Light usually travels in:',
        options: ['Curves', 'Circles', 'Straight lines', 'Squares'],
        correctAnswer: 'Straight lines',
        explanation: 'Light moves in straight lines in a clear medium.',
      },
    ],
  },
  dpp: {
    'living-and-non-living-things': [
      {
        id: 'lnt-d1',
        question: 'Which of these is living?',
        options: ['Sand', 'Seed', 'Bottle', 'Chair'],
        correctAnswer: 'Seed',
        explanation: 'A seed can grow into a new plant.',
      },
      {
        id: 'lnt-d2',
        question: 'Which is a sign of life?',
        options: ['Painting', 'Breathing', 'Breaking', 'Falling'],
        correctAnswer: 'Breathing',
        explanation: 'Breathing is a life process.',
      },
    ],
    'parts-of-a-plant': [
      {
        id: 'pop-d1',
        question: 'Which part protects the seed in a fruit?',
        options: ['Root', 'Stem', 'Fruit', 'Leaf'],
        correctAnswer: 'Fruit',
        explanation: 'Fruit often protects and carries seeds.',
      },
      {
        id: 'pop-d2',
        question: 'Water moves from roots to leaves through the:',
        options: ['Stem', 'Fruit', 'Flower', 'Seed'],
        correctAnswer: 'Stem',
        explanation: 'The stem transports water upward.',
      },
    ],
    'food-and-nutrition': [
      {
        id: 'fan-d1',
        question: 'Which of these is a source of vitamins?',
        options: ['Fruit', 'Oil', 'Salt', 'Sugar'],
        correctAnswer: 'Fruit',
        explanation: 'Fruits are rich in vitamins.',
      },
      {
        id: 'fan-d2',
        question: 'Which food group mostly gives energy?',
        options: ['Carbohydrates', 'Minerals', 'Water', 'Fibre'],
        correctAnswer: 'Carbohydrates',
        explanation: 'Carbohydrates are the main energy source.',
      },
    ],
    'matter-around-us': [
      {
        id: 'mau-d1',
        question: 'Which of these has no fixed shape but fixed volume?',
        options: ['Solid', 'Liquid', 'Gas', 'Wood'],
        correctAnswer: 'Liquid',
        explanation: 'Liquids change shape but keep the same volume.',
      },
      {
        id: 'mau-d2',
        question: 'Which state of matter fills the space available?',
        options: ['Solid', 'Liquid', 'Gas', 'Ice'],
        correctAnswer: 'Gas',
        explanation: 'Gases spread to fill the available space.',
      },
    ],
    'light-shadows-reflection': [
      {
        id: 'lsr-d1',
        question: 'A shadow becomes bigger when the object moves:',
        options: ['Closer to the light', 'Farther from the light', 'Into water', 'Into the dark'],
        correctAnswer: 'Closer to the light',
        explanation: 'Objects near the light source make bigger shadows.',
      },
      {
        id: 'lsr-d2',
        question: 'Reflection happens when light:',
        options: ['Stops', 'Bounces back', 'Burns', 'Disappears'],
        correctAnswer: 'Bounces back',
        explanation: 'Reflection is the bouncing back of light from a surface.',
      },
    ],
  },
  test: {
    'living-and-non-living-things': [
      {
        id: 'lnt-t1',
        question: 'Which feature is found in living things?',
        options: ['Growth', 'Paint', 'Metal', 'Plastic'],
        correctAnswer: 'Growth',
        explanation: 'Living things grow as they develop.',
      },
      {
        id: 'lnt-t2',
        question: 'A car moves when driven. It is:',
        options: ['Living', 'Non-living', 'Plant', 'Seed'],
        correctAnswer: 'Non-living',
        explanation: 'A car needs force from outside to move.',
      },
      {
        id: 'lnt-t3',
        question: 'Which one responds to touch?',
        options: ['Rock', 'Plant', 'Chair', 'Bottle'],
        correctAnswer: 'Plant',
        explanation: 'Plants respond to light, touch, and changes around them.',
      },
      {
        id: 'lnt-t4',
        question: 'Non-living things do not:',
        options: ['Grow', 'Have shape', 'Break', 'Move'],
        correctAnswer: 'Grow',
        explanation: 'Growth is a sign of life.',
      },
    ],
    'parts-of-a-plant': [
      {
        id: 'pop-t1',
        question: 'Which part helps a plant stand upright?',
        options: ['Leaf', 'Stem', 'Seed', 'Root hair'],
        correctAnswer: 'Stem',
        explanation: 'The stem supports the plant body.',
      },
      {
        id: 'pop-t2',
        question: 'Which part takes in water from the soil?',
        options: ['Root', 'Fruit', 'Flower', 'Bud'],
        correctAnswer: 'Root',
        explanation: 'Roots absorb water and minerals.',
      },
      {
        id: 'pop-t3',
        question: 'Leaves prepare food using:',
        options: ['Heat only', 'Sunlight', 'Soil only', 'Wind'],
        correctAnswer: 'Sunlight',
        explanation: 'Leaves use sunlight to make food by photosynthesis.',
      },
      {
        id: 'pop-t4',
        question: 'Seeds usually grow into:',
        options: ['Rocks', 'Plants', 'Water', 'Air'],
        correctAnswer: 'Plants',
        explanation: 'A seed germinates to form a new plant.',
      },
    ],
    'food-and-nutrition': [
      {
        id: 'fan-t1',
        question: 'Which nutrient supports growth and repair?',
        options: ['Protein', 'Salt', 'Sugar', 'Water'],
        correctAnswer: 'Protein',
        explanation: 'Proteins are the building materials of the body.',
      },
      {
        id: 'fan-t2',
        question: 'Which food is a good source of energy?',
        options: ['Rice', 'Glass', 'Stone', 'Wood'],
        correctAnswer: 'Rice',
        explanation: 'Rice is rich in carbohydrates that give energy.',
      },
      {
        id: 'fan-t3',
        question: 'Which item is a protective food?',
        options: ['Carrot', 'Oil', 'Sugar', 'Salt'],
        correctAnswer: 'Carrot',
        explanation: 'Vegetables and fruits are protective foods.',
      },
      {
        id: 'fan-t4',
        question: 'Balanced diet means:',
        options: ['Only one food', 'Several food groups', 'No food', 'Only sweets'],
        correctAnswer: 'Several food groups',
        explanation: 'Different nutrients keep the body healthy.',
      },
    ],
    'matter-around-us': [
      {
        id: 'mau-t1',
        question: 'Which has a fixed volume?',
        options: ['Liquid', 'Gas', 'Smoke', 'Steam'],
        correctAnswer: 'Liquid',
        explanation: 'Liquids keep the same volume.',
      },
      {
        id: 'mau-t2',
        question: 'Which state can be compressed easily?',
        options: ['Solid', 'Liquid', 'Gas', 'Metal'],
        correctAnswer: 'Gas',
        explanation: 'Gas particles are far apart, so gas can be compressed.',
      },
      {
        id: 'mau-t3',
        question: 'Ice is a:',
        options: ['Solid', 'Liquid', 'Gas', 'Mist'],
        correctAnswer: 'Solid',
        explanation: 'Ice has a fixed shape and volume.',
      },
      {
        id: 'mau-t4',
        question: 'Matter occupies:',
        options: ['Only space', 'Only time', 'Space and mass', 'No space'],
        correctAnswer: 'Space and mass',
        explanation: 'Matter has mass and takes up space.',
      },
    ],
    'light-shadows-reflection': [
      {
        id: 'lsr-t1',
        question: 'A shadow forms when:',
        options: ['Light is blocked', 'Mirror is broken', 'Water is poured', 'Sound is heard'],
        correctAnswer: 'Light is blocked',
        explanation: 'An object blocks the path of light.',
      },
      {
        id: 'lsr-t2',
        question: 'The size of a shadow changes with:',
        options: ['Distance from light', 'Color of the wall', 'Taste of the object', 'Shape of the shoe'],
        correctAnswer: 'Distance from light',
        explanation: 'Moving closer or farther changes shadow size.',
      },
      {
        id: 'lsr-t3',
        question: 'A mirror gives us a:',
        options: ['Shadow', 'Reflection', 'Plant', 'Seed'],
        correctAnswer: 'Reflection',
        explanation: 'Mirrors reflect light and show images.',
      },
      {
        id: 'lsr-t4',
        question: 'Light travels in:',
        options: ['Spiral lines', 'Straight lines', 'Circles', 'Triangles'],
        correctAnswer: 'Straight lines',
        explanation: 'This is the simplest model for light travel.',
      },
    ],
  },
};

export const learningProgressSeed = [
  {
    userId: 'student-001',
    chapterSlug: 'living-and-non-living-things',
    watchedPercent: 100,
    notesRead: true,
    practiceScore: 83,
    dppScore: 80,
    testScore: 88,
    completed: true,
    weakAreas: ['Classifying edge cases'],
    learningMinutes: 22,
  },
  {
    userId: 'student-001',
    chapterSlug: 'parts-of-a-plant',
    watchedPercent: 92,
    notesRead: true,
    practiceScore: 79,
    dppScore: 77,
    testScore: 82,
    completed: true,
    weakAreas: ['Root functions'],
    learningMinutes: 26,
  },
  {
    userId: 'student-001',
    chapterSlug: 'food-and-nutrition',
    watchedPercent: 64,
    notesRead: false,
    practiceScore: 72,
    dppScore: 69,
    testScore: 0,
    completed: false,
    weakAreas: ['Balanced diet'],
    learningMinutes: 18,
  },
];

export function getLearningChapterBySlug(slug) {
  return learningChapters.find((chapter) => chapter.slug === slug) || null;
}

export function getLearningChaptersForSubject(subjectSlug) {
  return learningChapters
    .filter((chapter) => chapter.subjectSlug === subjectSlug)
    .sort((a, b) => a.order - b.order);
}

export function getLearningSubjectsForClassLevel(classLevel = learningSubject.classLevel) {
  const normalized = String(classLevel || learningSubject.classLevel).trim();
  const matched = learningSubjects.filter(
    (subject) => String(subject.classLevel || '').trim() === normalized && !isCareerLearningSubject(subject),
  );
  return matched.length
    ? matched
    : learningSubjects.filter(
        (subject) => String(subject.classLevel || '').trim() === learningSubject.classLevel && !isCareerLearningSubject(subject),
      );
}

export function getLearningChaptersForClassLevel(classLevel = learningSubject.classLevel) {
  const subjects = getLearningSubjectsForClassLevel(classLevel);
  const subjectSlugs = new Set(subjects.map((subject) => subject.slug));
  const matched = learningChapters
    .filter((chapter) => subjectSlugs.has(chapter.subjectSlug))
    .sort((a, b) => a.order - b.order);
  if (matched.length) return matched;
  return learningChapters
    .filter((chapter) => chapter.subjectSlug === learningSubject.slug)
    .sort((a, b) => a.order - b.order);
}

export function getLearningNotesByChapterSlug(slug) {
  return learningNotes[slug] || null;
}

export function getLearningQuestionsByChapterSlugAndType(slug, type = 'test') {
  return learningQuestions?.[type]?.[slug] || [];
}

export function getLearningProgressMap(progressRows = learningProgressSeed) {
  const map = {};
  progressRows.forEach((row) => {
    if (row?.chapterSlug) {
      map[row.chapterSlug] = row;
    }
  });
  return map;
}

export function getLearningChapterStatus(chapter, progressMap = {}) {
  const progress = progressMap[chapter.slug];
  if (progress?.completed) return 'completed';
  const current = getLearningCurrentChapter(progressMap);
  if (current?.slug === chapter.slug) return 'current';
  if (current && chapter.order > current.order) return 'locked';
  return 'available';
}

export function getLearningCurrentChapter(progressMap = {}, classLevel = learningSubject.classLevel) {
  const chapters = getLearningChaptersForClassLevel(classLevel);
  const current = chapters.find((chapter) => {
    const progress = progressMap[chapter.slug];
    return progress?.watchedPercent > 0 && !progress?.completed;
  });
  return current || getLearningRecommendedChapter(progressMap, classLevel) || chapters[0] || null;
}

export function getLearningRecommendedChapter(progressMap = {}, classLevel = learningSubject.classLevel) {
  const chapters = getLearningChaptersForClassLevel(classLevel);
  return chapters.find((chapter) => !progressMap[chapter.slug]?.completed) || chapters[0] || null;
}

export function getLearningSubjectProgress(subjectSlug, progressMap = {}) {
  const chapters = getLearningChaptersForSubject(subjectSlug);
  const completed = chapters.filter((chapter) => progressMap[chapter.slug]?.completed).length;
  return {
    completed,
    total: chapters.length,
    percent: chapters.length ? Math.round((completed / chapters.length) * 100) : 0,
  };
}

export function getLearningDashboardSnapshot(progressMap = {}, classLevel = learningSubject.classLevel) {
  const chapters = getLearningChaptersForClassLevel(classLevel);
  const completedChapters = chapters.filter((chapter) => progressMap[chapter.slug]?.completed);
  const learningMinutes = Object.values(progressMap).reduce(
    (sum, row) => sum + Number(row.learningMinutes || 0),
    0,
  );
  const scores = Object.values(progressMap)
    .flatMap((row) => [row.practiceScore, row.dppScore, row.testScore])
    .filter((score) => Number(score) > 0);
  const weakTopics = [...new Set(Object.values(progressMap).flatMap((row) => row.weakAreas || []))];

  return {
    totalChapters: chapters.length,
    completedChapters: completedChapters.length,
    learningMinutes,
    averageScore: scores.length
      ? Math.round(scores.reduce((sum, score) => sum + Number(score), 0) / scores.length)
      : 0,
    weakTopics,
    streakDays: Math.max(2, completedChapters.length + 1),
    badge: completedChapters.length >= 2 ? 'Consistency Builder' : 'Getting Started',
    nextAction: getLearningRecommendedChapter(progressMap, classLevel)?.title || 'Open the next chapter',
  };
}

export function createEmptyLearningProgress(chapterSlug) {
  return {
    userId: 'student-001',
    chapterSlug,
    watchedPercent: 0,
    notesRead: false,
    practiceScore: 0,
    dppScore: 0,
    testScore: 0,
    completed: false,
    weakAreas: [],
    learningMinutes: 0,
  };
}

export function getLearningLocalData(classLevel = learningSubject.classLevel) {
  const progress = getLearningProgressMap(learningProgressSeed);
  const subjects = getLearningSubjectsForClassLevel(classLevel);
  const chapters = getLearningChaptersForClassLevel(classLevel);
  const subject = subjects[0] || learningSubject;
  return {
    subject,
    subjects,
    chapters,
    progress,
    dashboard: getLearningDashboardSnapshot(progress, classLevel),
    subjectProgress: getLearningSubjectProgress(subject.slug, progress),
    recommendedChapter: getLearningRecommendedChapter(progress, classLevel),
    notes: null,
    practiceQuestions: [],
    dppQuestions: [],
    testQuestions: [],
    tests: [],
    doubts: [],
  };
}
