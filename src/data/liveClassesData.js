// 🎬 Live Classes Mock Data & AI Recommendation Engine
// This data structure enables immediate testing without backend API

export const studentProfile = {
  id: 'stu_001',
  name: 'Ananya Kumar',
  class: '12th',
  board: 'CBSE',
  targetExams: ['JEE Main', 'NEET'],
  language: 'en',
  weakTopics: ['Chemical Bonding', 'Electromagnetism', 'Organic Chemistry'],
  recentMistakes: 8,
  lastTestAccuracy: 68,
  streakDays: 4,
};

export const liveClassesPool = [
  {
    id: 'live_001',
    title: 'Chemical Bonding Masterclass',
    teacher: { name: 'Dr. Priya Sharma', avatar: '👨‍🏫' },
    subject: 'Chemistry',
    difficulty: 'Intermediate',
    duration: '45 min',
    studentCount: 2847,
    isLive: true,
    liveStarted: '5 min ago',
    countdownMinutes: 40,
    topics: ['Ionic Bonding', 'Covalent Bonding', 'VSEPR Theory'],
    description: 'Master the fundamentals of chemical bonding with interactive problem-solving.',
    relevanceScore: 95,
    reason: 'Your #1 weak topic',
  },
  {
    id: 'live_002',
    title: 'Electromagnetism Deep Dive',
    teacher: { name: 'Prof. Vikram Singh', avatar: '👨‍🏫' },
    subject: 'Physics',
    difficulty: 'Advanced',
    duration: '60 min',
    studentCount: 1923,
    isLive: true,
    premiumOnly: true,
    liveStarted: '12 min ago',
    countdownMinutes: 48,
    topics: ['Magnetic Fields', 'Electromagnetic Induction', 'AC Circuits'],
    description: 'Advanced concepts in electromagnetism with real-world applications.',
    relevanceScore: 88,
    reason: 'Matches your exam goals (JEE Main)',
  },
  {
    id: 'live_003',
    title: 'Organic Chemistry Reaction Mechanism',
    teacher: { name: 'Dr. Anjali Patel', avatar: '👨‍🏫' },
    subject: 'Chemistry',
    difficulty: 'Advanced',
    duration: '75 min',
    studentCount: 3124,
    isLive: false,
    startsIn: '22 min',
    countdownMinutes: 22,
    topics: ['SNi/SN2 Reactions', 'Elimination', 'Rearrangement'],
    description: 'Comprehensive guide to organic reaction mechanisms for competitive exams.',
    relevanceScore: 82,
    reason: 'Your recent mistakes: 3 wrong answers on organic reactions',
  },
  {
    id: 'live_004',
    title: 'Calculus Integration Techniques',
    teacher: { name: 'Mr. Rajesh Kumar', avatar: '👨‍🏫' },
    subject: 'Maths',
    difficulty: 'Intermediate',
    duration: '50 min',
    studentCount: 2156,
    isLive: true,
    liveStarted: '8 min ago',
    countdownMinutes: 42,
    topics: ['Substitution', 'Integration by Parts', 'Partial Fractions'],
    description: 'Master integration techniques with step-by-step solutions.',
    relevanceScore: 76,
    reason: 'Trending with high performers in your class',
  },
  {
    id: 'live_005',
    title: 'Biology Genetics Masterclass',
    teacher: { name: 'Dr. Meera Gupta', avatar: '👨‍🏫' },
    subject: 'Biology',
    difficulty: 'Beginner',
    duration: '55 min',
    studentCount: 4521,
    isLive: false,
    premiumOnly: true,
    startsIn: '45 min',
    countdownMinutes: 45,
    topics: ['Mendelian Inheritance', 'Chromosomal Theory', 'Genetic Code'],
    description: 'Foundation concepts in genetics for NEET preparation.',
    relevanceScore: 65,
    reason: 'Complements your NEET goal',
  },
];

// AI Recommendation Engine: Personalize based on student profile
export const getPersonalizedLiveClasses = (studentData = studentProfile) => {
  // Score each class based on student profile
  const scoredClasses = liveClassesPool.map((cls) => {
    let score = cls.relevanceScore || 50;

    // Boost if weak topic
    if (studentData.weakTopics?.some((t) => cls.topics?.some((ct) => ct.toLowerCase().includes(t.toLowerCase())))) {
      score += 20;
    }

    // Boost if exam matches
    if (studentData.targetExams?.some((exam) => cls.description?.includes(exam))) {
      score += 15;
    }

    // Boost live classes
    if (cls.isLive) score += 10;

    // Reduce if too advanced
    if (cls.difficulty === 'Advanced' && studentData.lastTestAccuracy < 70) {
      score -= 8;
    }

    return { ...cls, personalizedScore: Math.min(score, 100) };
  });

  // Sort by personalized score
  const sorted = scoredClasses.sort((a, b) => b.personalizedScore - a.personalizedScore);

  return {
    featured: sorted[0],
    recommendations: sorted.slice(1, 4),
    allClasses: sorted,
  };
};

// Post-class data for replay section
export const replayData = [
  {
    id: 'replay_001',
    title: 'Trigonometric Identities Deep Dive',
    teacher: 'Prof. Sunil Sharma',
    completedAt: '2 hours ago',
    duration: '60 min',
    watchedDuration: '42 min',
    topics: ['Pythagorean Identities', 'Sum & Difference Formulas', 'Double Angle Formulas'],
    keystones: [
      { time: '3:15', title: 'Introduction to identities', watched: true },
      { time: '12:40', title: 'Proof of Pythagorean identities', watched: true },
      { time: '28:20', title: 'Sum formulas explained', watched: true },
      { time: '45:30', title: 'Practice problems', watched: false },
      { time: '58:15', title: 'Advanced applications', watched: false },
    ],
    aiNotes: 'You mastered sum formulas but struggled with double angle proofs. Review the proof technique before the next live class. Your accuracy: 78%.',
    performanceScore: 78,
    rewardsEarned: { xp: 150, badge: 'Focus Master', points: 45 },
  },
];

// Gamification rewards structure
export const classCompletionRewards = {
  xp: 150,
  streak: 1,
  badges: [
    { id: 'live_attender', title: 'Live Attendee', description: 'Attended your first live class', icon: 'Sparkles' },
    { id: 'streak_5', title: '5-Day Streak', description: 'Attended 5 days in a row', icon: 'Flame' },
  ],
  leaderboardPoints: 50,
  nextStreakMilestone: 7,
};

// Mock student gamification state
export const gamificationState = {
  xp: 420,
  level: 4,
  streak: 4,
  unlocked: [
    { id: 'live_attender', unlockedAt: '1 week ago' },
    { id: 'focus_master', unlockedAt: '3 days ago' },
  ],
  leaderboardRank: 47,
};
