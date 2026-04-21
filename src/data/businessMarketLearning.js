export const businessMarketLearningSlug = 'business-market-learning';

export const businessMarketLevels = [
  {
    key: 'Beginner',
    title: 'Beginner Courses',
    description: 'Start with money habits, business basics and a safe introduction to market thinking.',
  },
  {
    key: 'Intermediate',
    title: 'Intermediate Courses',
    description: 'Move into investing concepts, affiliate models, personal finance and risk control.',
  },
  {
    key: 'Advanced',
    title: 'Advanced Courses',
    description: 'Explore technical analysis, system building and scaling ideas with a reality-first lens.',
  },
];

export const businessMarketSpecialModules = [
  {
    key: 'Reality Check',
    title: 'Reality Check',
    description: 'Risks, scams, losses and the red flags every learner should know before touching money.',
  },
  {
    key: 'Psychology & Discipline',
    title: 'Psychology & Discipline',
    description: 'Build emotional control, patience and daily consistency for long-term growth.',
  },
  {
    key: 'Case Studies',
    title: 'Case Studies',
    description: 'Review real examples to see what worked, what failed and why the outcome mattered.',
  },
  {
    key: 'Practical Assignments',
    title: 'Practical Assignments',
    description: 'Turn lessons into action with small tasks and simple reflection prompts.',
  },
];

export function getBusinessMarketChapterGroups(subject) {
  const chapters = subject?.chapters || [];
  const levelMap = new Map(businessMarketLevels.map((level) => [level.key, []]));
  const special = [];

  chapters.forEach((chapter) => {
    const levelKey = chapter.level || 'Beginner';
    if (levelMap.has(levelKey)) {
      levelMap.get(levelKey).push(chapter);
      return;
    }
    special.push(chapter);
  });

  return {
    levels: businessMarketLevels.map((level) => ({
      ...level,
      chapters: levelMap.get(level.key) || [],
    })),
    specialModules: businessMarketSpecialModules.map((module) => ({
      ...module,
      chapters: special.filter((chapter) => chapter.title === module.key),
    })),
  };
}

export function getBusinessMarketOverview(subject) {
  const chapters = subject?.chapters || [];
  const grouped = getBusinessMarketChapterGroups(subject);
  return {
    title: subject?.name || 'Business & Market Learning',
    subtitle: subject?.subtitle || 'Learn how money works in real life',
    description:
      subject?.description ||
      'Learn how money works in real life with beginner-friendly business, market and earning pathways.',
    contentLanguage: subject?.contentLanguage || 'English + Hinglish',
    totalCourses: chapters.length,
    beginnerCount: grouped.levels[0]?.chapters.length || 0,
    intermediateCount: grouped.levels[1]?.chapters.length || 0,
    advancedCount: grouped.levels[2]?.chapters.length || 0,
    specialCount: grouped.specialModules.reduce((sum, module) => sum + module.chapters.length, 0),
    progressPercent: chapters.length
      ? Math.round(chapters.reduce((sum, chapter) => sum + Number(chapter.progress || 0), 0) / chapters.length)
      : 0,
  };
}
