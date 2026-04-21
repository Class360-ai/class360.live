const DEFAULT_SERIES_START_DATE = '2026-04-21';
const DEFAULT_YOUTUBE_VIDEO_ID = 'dQw4w9WgXcQ';
const DEFAULT_YOUTUBE_URL = `https://www.youtube.com/watch?v=${DEFAULT_YOUTUBE_VIDEO_ID}`;

export const dailyTradingSeriesSlug = 'trading-from-zero-to-pro-365-days-series';
export const dailyTradingSeriesTitle = 'Trading from Zero to Pro (365 Days Series)';
export const dailyTradingSeriesCategory = 'Business & Market Learning';
export const dailyTradingSeriesStartDate = DEFAULT_SERIES_START_DATE;

const seriesThemes = [
  {
    key: 'money-basics',
    label: 'Money basics',
    focus: 'Learn income, spending, saving and simple money discipline.',
    risk: 'Avoid trying to make fast money before you understand the basics.',
    homework: 'Write a 3-line note on where your money comes from and where it goes.',
  },
  {
    key: 'business-foundation',
    label: 'Business foundation',
    focus: 'See how businesses solve problems and create value for customers.',
    risk: 'Never confuse attention with profit or hype with demand.',
    homework: 'Observe one shop or online business and note the problem it solves.',
  },
  {
    key: 'market-structure',
    label: 'Market structure',
    focus: 'Understand buyers, sellers, price movement and supply-demand ideas.',
    risk: 'Markets are not shortcuts; they reward patience and preparation.',
    homework: 'Track one product price in the market for 3 days.',
  },
  {
    key: 'digital-income',
    label: 'Digital income',
    focus: 'Learn safe online earning ideas and how to avoid fake promises.',
    risk: 'Fast income promises are the biggest scam signal in online learning.',
    homework: 'List two legitimate digital skills you can build this year.',
  },
  {
    key: 'psychology',
    label: 'Psychology',
    focus: 'Build patience, discipline and emotional control.',
    risk: 'Emotional decisions often destroy good plans.',
    homework: 'Write one habit you will repeat daily for 7 days.',
  },
  {
    key: 'stocks-basics',
    label: 'Stocks basics',
    focus: 'See what shares are and why people invest in companies.',
    risk: 'Investing without learning risk is gambling with a cleaner name.',
    homework: 'Explain in simple words what a share represents.',
  },
  {
    key: 'affiliate-marketing',
    label: 'Affiliate marketing',
    focus: 'Understand referrals, commissions and audience trust.',
    risk: 'Spammy promotion breaks trust faster than it builds income.',
    homework: 'Draft one honest value-first recommendation idea.',
  },
  {
    key: 'dropshipping',
    label: 'Dropshipping',
    focus: 'Learn sourcing, pricing, customer support and service flow.',
    risk: 'Low product cost does not mean low business risk.',
    homework: 'Map the order flow from store to delivery in 5 steps.',
  },
  {
    key: 'personal-finance',
    label: 'Personal finance',
    focus: 'Budget, emergency funds, debt awareness and planning.',
    risk: 'High spending without a buffer makes every plan fragile.',
    homework: 'Create a tiny monthly budget with 3 categories.',
  },
  {
    key: 'risk-management',
    label: 'Risk management',
    focus: 'Limit loss, protect capital and avoid emotional overreach.',
    risk: 'One oversized mistake can erase many good decisions.',
    homework: 'Write your own 3-rule risk checklist.',
  },
  {
    key: 'technical-analysis',
    label: 'Technical analysis',
    focus: 'Read charts, trends and levels as a learning exercise.',
    risk: 'Indicators do not predict the future; they only organize probability.',
    homework: 'Mark support and resistance on one simple chart screenshot.',
  },
  {
    key: 'price-action',
    label: 'Price action',
    focus: 'Study candles, structure and momentum without overcomplication.',
    risk: 'A pretty chart is not the same as a good decision.',
    homework: 'Describe the last swing high and swing low you observed.',
  },
  {
    key: 'scaling',
    label: 'Scaling',
    focus: 'See how systems grow when traffic, ops and support improve together.',
    risk: 'Scaling too early usually magnifies mistakes.',
    homework: 'List one bottleneck that would stop a business from growing.',
  },
  {
    key: 'passive-income',
    label: 'Passive income',
    focus: 'Understand what is real and what is myth in passive income stories.',
    risk: 'Nothing truly passive starts passive.',
    homework: 'Write one system that can become easier over time, not overnight.',
  },
];

const specialModuleNames = ['Reality Check', 'Mistakes to Avoid', 'Student Progress Dashboard'];

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(dateKey, offset) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + offset);
  return getDateKey(date);
}

function dateDiffInDays(fromDateKey, toDateKey) {
  const from = new Date(`${fromDateKey}T00:00:00`);
  const to = new Date(`${toDateKey}T00:00:00`);
  return Math.floor((to.getTime() - from.getTime()) / 86400000);
}

function safeUrl(value) {
  try {
    return new URL(String(value || '').trim());
  } catch {
    return null;
  }
}

function isAllowedYouTubeHost(hostname = '') {
  return (
    hostname === 'youtube.com' ||
    hostname.endsWith('.youtube.com') ||
    hostname === 'youtu.be' ||
    hostname.endsWith('.youtu.be')
  );
}

export function extractYouTubeVideoId(value) {
  const url = safeUrl(value);
  if (!url || !isAllowedYouTubeHost(url.hostname)) return '';

  if (url.hostname.includes('youtu.be')) {
    return url.pathname.split('/').filter(Boolean)[0] || '';
  }

  if (url.pathname.startsWith('/embed/') || url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/live/')) {
    return url.pathname.split('/').filter(Boolean)[1] || '';
  }

  return url.searchParams.get('v') || '';
}

export function buildYouTubeEmbedUrl(videoId) {
  const id = String(videoId || '').trim();
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : '';
}

export function buildYouTubeThumbnailUrl(videoId) {
  const id = String(videoId || '').trim();
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

export function isValidYouTubeUrl(value) {
  return Boolean(extractYouTubeVideoId(value));
}

export function normalizeDailyTradingSeriesLesson(lesson = {}) {
  const dayNumber = Number(lesson.dayNumber || 1);
  const daySlug = lesson.daySlug || lesson.slug || `day-${dayNumber}`;
  const id = lesson.id || daySlug;
  const videoType = lesson.videoType === 'upload' ? 'upload' : 'youtube';
  const youtubeURL = String(lesson.youtubeURL || lesson.videoUrl || DEFAULT_YOUTUBE_URL).trim();
  const extractedVideoId = videoType === 'youtube' ? extractYouTubeVideoId(youtubeURL) || lesson.videoID || DEFAULT_YOUTUBE_VIDEO_ID : '';
  const embedURL = videoType === 'youtube' ? buildYouTubeEmbedUrl(extractedVideoId) : String(lesson.embedURL || lesson.videoUrl || '').trim();
  const thumbnail = videoType === 'youtube' ? buildYouTubeThumbnailUrl(extractedVideoId) : String(lesson.thumbnail || '').trim();
  const description = String(lesson.description || '').trim();

  return {
    ...lesson,
    id,
    dayNumber,
    daySlug,
    slug: lesson.slug || daySlug,
    videoType,
    youtubeURL: videoType === 'youtube' ? youtubeURL : String(lesson.youtubeURL || '').trim(),
    videoID: extractedVideoId,
    embedURL,
    thumbnail,
    videoUrl: embedURL || String(lesson.videoUrl || '').trim(),
    description,
  };
}

function getThemeForDay(dayNumber) {
  return seriesThemes[(dayNumber - 1) % seriesThemes.length];
}

function buildQuiz(dayNumber, theme) {
  return [
    {
      id: `${dailyTradingSeriesSlug}-day-${dayNumber}-q1`,
      question: `Day ${dayNumber}: what is the main idea of ${theme.label}?`,
      options: [
        theme.focus,
        'Ignore the lesson and jump ahead',
        'Copy random tips from social media',
        'Focus only on profit screenshots',
      ],
      correctAnswer: theme.focus,
      explanation: 'The lesson should always teach one safe, practical idea first.',
    },
    {
      id: `${dailyTradingSeriesSlug}-day-${dayNumber}-q2`,
      question: 'What is the safest next step after this lesson?',
      options: [
        'Take a small note and practice once',
        'Risk money immediately',
        'Trust any online promise',
        'Skip notes and move on',
      ],
      correctAnswer: 'Take a small note and practice once',
      explanation: 'Small repetition is much safer than rushing into action.',
    },
    {
      id: `${dailyTradingSeriesSlug}-day-${dayNumber}-q3`,
      question: 'Which warning should the learner remember?',
      options: [theme.risk, 'Every shortcut is guaranteed', 'Profit is instant', 'Experience is optional'],
      correctAnswer: theme.risk,
      explanation: 'The series keeps the risk conversation honest and practical.',
    },
  ];
}

function buildLesson(dayNumber) {
  const theme = getThemeForDay(dayNumber);
  const moduleProgress = Math.round(((dayNumber - 1) % 30) / 29 * 100);
  const isCheckpoint = dayNumber % 30 === 0;
  const specialModule = specialModuleNames[(Math.floor((dayNumber - 1) / 120)) % specialModuleNames.length];
  const titleSuffix = isCheckpoint ? 'Checkpoint' : theme.label;
  const releaseDate = addDays(DEFAULT_SERIES_START_DATE, dayNumber - 1);

  return {
    id: `day-${dayNumber}`,
    dayNumber,
    daySlug: `day-${dayNumber}`,
    slug: `day-${dayNumber}`,
    title: `Day ${dayNumber}: ${titleSuffix}`,
    module: theme.label,
    specialModule,
    description: `A daily step inside ${dailyTradingSeriesTitle} with safe, beginner-friendly learning.`,
    videoType: 'youtube',
    youtubeURL: DEFAULT_YOUTUBE_URL,
    videoID: DEFAULT_YOUTUBE_VIDEO_ID,
    embedURL: buildYouTubeEmbedUrl(DEFAULT_YOUTUBE_VIDEO_ID),
    thumbnail: buildYouTubeThumbnailUrl(DEFAULT_YOUTUBE_VIDEO_ID),
    videoUrl: buildYouTubeEmbedUrl(DEFAULT_YOUTUBE_VIDEO_ID),
    notes: `Day ${dayNumber} focuses on ${theme.focus} Keep the explanation simple, practical and reality-first.`,
    keyPoints: [
      `Focus: ${theme.focus}`,
      `Checkpoint: ${isCheckpoint ? 'Revision day with reflection' : 'Keep moving with one small improvement'}`,
      `Risk note: ${theme.risk}`,
    ],
    homeworkTask: theme.homework,
    quiz: buildQuiz(dayNumber, theme),
    releaseDate,
    autoPublish: true,
    statusHint: moduleProgress >= 95 ? 'checkpoint' : 'daily',
    moduleProgress,
  };
}

export const dailyTradingSeriesLessons = Array.from({ length: 365 }, (_, index) => buildLesson(index + 1));

export const dailyTradingSeriesSpecialSections = [
  {
    title: 'Reality Check',
    description: 'A dedicated space for risks, scams, loss stories and emotional traps.',
    note: 'This section keeps the series grounded and protects beginners from hype.',
  },
  {
    title: 'Mistakes to Avoid',
    description: 'A practical list of common beginner errors around timing, leverage and impatience.',
    note: 'Students should revisit this before taking any real-world step.',
  },
  {
    title: 'Student Progress Dashboard',
    description: 'A simple dashboard that shows streak, completed days, resume point and unlock status.',
    note: 'The dashboard helps students stay consistent without losing their place.',
  },
];

export function getDailyTradingSeriesLessonByDay(dayNumber) {
  const lesson = dailyTradingSeriesLessons.find((item) => item.dayNumber === Number(dayNumber)) || null;
  return lesson ? normalizeDailyTradingSeriesLesson(lesson) : null;
}

export function getDailyTradingSeriesLessonBySlug(daySlug) {
  const lesson = dailyTradingSeriesLessons.find((item) => item.slug === slugify(daySlug)) || null;
  return lesson ? normalizeDailyTradingSeriesLesson(lesson) : null;
}

export function getDailyTradingSeriesDays(lessons = dailyTradingSeriesLessons) {
  return lessons.map((lesson) => normalizeDailyTradingSeriesLesson({ ...lesson }));
}

export function getDailyTradingSeriesOverview() {
  return {
    slug: dailyTradingSeriesSlug,
    title: dailyTradingSeriesTitle,
    category: dailyTradingSeriesCategory,
    startDate: dailyTradingSeriesStartDate,
    totalDays: dailyTradingSeriesLessons.length,
    specialSections: dailyTradingSeriesSpecialSections,
  };
}

export function getDailyTradingSeriesProgressMap(rows = []) {
  const map = {};
  rows.forEach((row) => {
    if (row?.daySlug) {
      map[row.daySlug] = row;
    }
  });
  return map;
}

export function getDailyTradingSeriesStreak(progressMap = {}, todayKey = getDateKey()) {
  const completedDates = Object.values(progressMap)
    .filter((row) => row?.completed && row.completedAt)
    .map((row) => getDateKey(new Date(row.completedAt)))
    .sort();
  if (!completedDates.length) return 0;

  const uniqueDates = [...new Set(completedDates)];
  let streak = 0;
  let cursor = todayKey;
  for (let i = uniqueDates.length - 1; i >= 0; i -= 1) {
    if (uniqueDates[i] === cursor) {
      streak += 1;
      cursor = addDays(cursor, -1);
    } else if (dateDiffInDays(uniqueDates[i], cursor) > 1) {
      break;
    }
  }
  return streak;
}

export function getDailyTradingSeriesResumeLesson(progressMap = {}, todayKey = getDateKey()) {
  const lessons = getDailyTradingSeriesDays();
  const trackedLessons = lessons
    .map((lesson) => {
      const progress = progressMap[lesson.daySlug] || {};
      return {
        ...lesson,
        completed: Boolean(progress.completed),
        completedAt: progress.completedAt || null,
        lastOpenedAt: progress.lastOpenedAt || null,
      };
    })
    .filter((lesson) => lesson.completed || lesson.lastOpenedAt);

  if (!trackedLessons.length) {
    return lessons[0] || null;
  }

  trackedLessons.sort((a, b) => {
    const aTime = new Date(a.lastOpenedAt || a.completedAt || 0).getTime();
    const bTime = new Date(b.lastOpenedAt || b.completedAt || 0).getTime();
    return bTime - aTime;
  });

  return trackedLessons[0];
}

export function getDailyTradingSeriesSnapshot(progressMap = {}, lessonsInput = dailyTradingSeriesLessons, todayKey = getDateKey()) {
  const lessons = getDailyTradingSeriesDays(lessonsInput).map((lesson) => {
    const progress = progressMap[lesson.daySlug] || {};
    const dayIndex = lesson.dayNumber - 1;
    const isReleased = dateDiffInDays(dailyTradingSeriesStartDate, todayKey) >= dayIndex;
    const previous = lesson.dayNumber > 1 ? progressMap[`day-${lesson.dayNumber - 1}`] : null;
    const unlocked = lesson.dayNumber === 1 || Boolean(previous?.completed);
    const status = progress.completed ? 'completed' : isReleased && unlocked ? 'available' : 'locked';
    return {
      ...lesson,
      completed: Boolean(progress.completed),
      completedAt: progress.completedAt || null,
      notesRead: Boolean(progress.notesRead),
      quizScore: Number(progress.quizScore || 0),
      status,
      locked: status === 'locked',
      released: isReleased,
      unlocked,
      lastOpenedAt: progress.lastOpenedAt || null,
    };
  });

  const completedDays = lessons.filter((lesson) => lesson.completed).length;
  const progressPercent = Math.round((completedDays / lessons.length) * 100);
  const nextLesson = lessons.find((lesson) => lesson.status === 'available') || lessons[0] || null;
  const resumeLesson = getDailyTradingSeriesResumeLesson(progressMap, todayKey) || nextLesson;
  const streakDays = getDailyTradingSeriesStreak(progressMap, todayKey);
  const lockedDays = lessons.filter((lesson) => lesson.status === 'locked').length;

  return {
    overview: getDailyTradingSeriesOverview(),
    lessons,
    completedDays,
    progressPercent,
    streakDays,
    lockedDays,
    resumeLesson,
    nextLesson,
    realityCheck: dailyTradingSeriesSpecialSections[0],
    mistakesToAvoid: dailyTradingSeriesSpecialSections[1],
    studentProgressDashboard: dailyTradingSeriesSpecialSections[2],
  };
}
