import { getLatestAttempt } from './testStorage';
import { awardDailyPlanXP } from './gamification';
import { isPremiumUser } from './premium';

const PLAN_DATA_KEY = 'class360_daily_plan';
const PLAN_PROGRESS_KEY = 'class360_daily_plan_progress';
const PLAN_STREAK_KEY = 'class360_daily_plan_streak';
const PLAN_ACTIVITY_KEY = 'class360_daily_plan_activity';
const PLAN_STREAK_STATUS_KEY = 'class360_streak_status';
const PLAN_STREAK_ACTIVITY_KEY = 'class360_streak_activity';
const PLAN_TASK_LINKS_KEY = 'class360_daily_plan_task_links';
const PLAN_MIGRATION_KEY = 'class360_daily_plan_migrated_v3';

function safeDateKey(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10);
}

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function subjectLabel(subject) {
  const labels = {
    maths: 'Maths',
    science: 'Science',
    english: 'English',
    reasoning: 'Reasoning',
    gk: 'General Knowledge',
  };
  return labels[subject] || 'Subject';
}

function normalizeSubjectValue(subject, fallback = 'maths') {
  const raw = String(subject || '').trim().toLowerCase();
  return raw || fallback;
}

function normalizeDifficultyValue(difficulty, fallback = 'easy') {
  const raw = String(difficulty || '').trim().toLowerCase();
  return raw || fallback;
}

function normalizeTaskTypeValue(taskType, fallback = 'practice') {
  const raw = String(taskType || '').trim().toLowerCase();
  const map = {
    practice: 'practice',
    test: 'test',
    revision: 'revision',
  };
  return map[raw] || fallback;
}

function taskTypeLabel(taskType) {
  const labels = {
    practice: 'Practice',
    test: 'Test',
    revision: 'Revision',
  };
  return labels[taskType] || 'Task';
}

function buildTaskTitle(subject, taskType, topic) {
  const subjectName = subjectLabel(subject);
  const taskName = taskTypeLabel(taskType);
  const cleanTopic = String(topic || '').trim();
  return cleanTopic ? `${subjectName} ${taskName} · ${cleanTopic}` : `${subjectName} ${taskName}`;
}

function chapterLabels(subject, weakTopics = []) {
  const defaults = {
    maths: ['Algebra', 'Geometry', 'Arithmetic'],
    science: ['Physics', 'Chemistry', 'Biology'],
    english: ['Grammar', 'Vocabulary', 'Comprehension'],
    reasoning: ['Series', 'Coding-Decoding', 'Syllogism'],
    gk: ['India', 'History', 'Current Affairs'],
  };

  return unique([...(weakTopics || []), ...(defaults[subject] || [])]).slice(0, 3);
}

function getSubjectFocusScore(attempts = []) {
  const latest = attempts?.[0];
  const avg =
    attempts.length > 0
      ? attempts.reduce((sum, attempt) => sum + Number(attempt.percentage || 0), 0) / attempts.length
      : 0;
  const weakCount = unique(attempts.flatMap((attempt) => attempt?.weakTopics || [])).length;
  const streakBonus = Math.min(getRevisionStreakHint(attempts) * 2, 12);
  const base = Number(latest?.percentage || avg || 0);
  return Math.max(20, Math.min(100, Math.round(base + streakBonus - weakCount * 3)));
}

function getRevisionStreakHint(attempts = []) {
  const days = unique(
    attempts
      .filter((attempt) => attempt?.completedAt)
      .map((attempt) => safeDateKey(attempt.completedAt)),
  );
  return Math.min(days.length, 7);
}

export function getRecommendedStudySlot() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    return { label: 'Morning boost', time: '7:00 AM - 8:00 AM', note: 'Best for fresh revision and quick recall.' };
  }
  if (hour >= 11 && hour < 17) {
    return { label: 'Afternoon sprint', time: '4:00 PM - 5:00 PM', note: 'Good for short practice and review.' };
  }
  if (hour >= 17 && hour < 22) {
    return { label: 'Evening focus', time: '8:00 PM - 9:00 PM', note: 'Ideal for a calm test and chapter revision.' };
  }
  return { label: 'Late reset', time: '6:30 AM - 7:00 AM', note: 'A quick starter slot before the day begins.' };
}

export function getStudyCoachSnapshot(attempts = []) {
  const latest = attempts?.[0];
  const subject = latest?.subject || 'maths';
  const weakTopics = unique(
    attempts.flatMap((attempt) => attempt?.weakTopics || []),
  );
  const chapters = chapterLabels(subject, weakTopics);
  const focusScore = getSubjectFocusScore(attempts);
  const slot = getRecommendedStudySlot();

  return {
    subject,
    subjectLabel: subjectLabel(subject),
    focusScore,
    slot,
    chapters,
    primaryChapter: chapters[0] || 'Core concepts',
  };
}

function getDefaultPlan() {
  return {
    generatedFor: safeDateKey(),
    subject: 'maths',
    source: 'default',
    sourceSignature: 'default',
    tasks: [
      {
        id: 'default-practice-1',
        type: 'Practice',
        taskType: 'practice',
        title: 'Maths Practice · Basic concepts',
        subject: 'maths',
        difficulty: 'easy',
        topic: 'Basic concepts',
        questionCount: 10,
        questions: 10,
        completed: false,
      },
      {
        id: 'default-revision-1',
        type: 'Revision',
        taskType: 'revision',
        title: 'Maths Revision · Important formulas',
        subject: 'maths',
        difficulty: 'easy',
        topic: 'Important formulas',
        questionCount: 5,
        questions: 5,
        completed: false,
      },
      {
        id: 'default-mini-test-1',
        type: 'Test',
        taskType: 'test',
        title: 'Maths Test · Mixed mini test',
        subject: 'maths',
        difficulty: 'easy',
        topic: 'Mixed mini test',
        questionCount: 15,
        questions: 15,
        completed: false,
      },
    ],
  };
}

export function generateDailyPlan(testData) {
  const subject = normalizeSubjectValue(testData?.subject);
  const difficulty = normalizeDifficultyValue(testData?.difficulty);
  const weakTopics = unique(testData?.weakTopics);
  const sourceSignature = `${subject}:${difficulty}:${weakTopics.join('|')}:${testData?.completedAt || ''}`;
  const baseTopics = [
    ...weakTopics.slice(0, 2),
    'Mixed revision',
    'Timed practice',
  ].filter(Boolean);

  if (!testData) {
    return getDefaultPlan();
  }

  const primaryTopic = weakTopics[0] || `${subject} basics`;
  const secondaryTopic = weakTopics[1] || baseTopics[2] || `${subject} revision`;

  return {
    generatedFor: safeDateKey(),
    subject,
    source: 'latest-test',
    sourceSignature,
    tasks: [
      {
        id: `${subject}-${safeDateKey()}-practice`,
        type: 'Practice',
        taskType: 'practice',
        title: buildTaskTitle(subject, 'practice', primaryTopic),
        subject,
        difficulty,
        topic: primaryTopic,
        questionCount: 10,
        questions: 10,
        completed: false,
      },
      {
        id: `${subject}-${safeDateKey()}-revision`,
        type: 'Revision',
        taskType: 'revision',
        title: buildTaskTitle(subject, 'revision', secondaryTopic),
        subject,
        difficulty,
        topic: secondaryTopic,
        questionCount: 5,
        questions: 5,
        completed: false,
      },
      {
        id: `${subject}-${safeDateKey()}-mini-test`,
        type: 'Test',
        taskType: 'test',
        title: buildTaskTitle(subject, 'test', `${subject} mini test`),
        subject,
        difficulty,
        topic: `${subject} mini test`,
        questionCount: 1,
        questions: 1,
        completed: false,
      },
    ],
  };
}

function buildRevisionTasks(weakTopics = [], subject = 'maths') {
  const topics = chapterLabels(subject, weakTopics);
  const primaryTopic = topics[0] || `${subject} basics`;
  const secondaryTopic = topics[1] || `${subject} revision`;
  const tertiaryTopic = topics[2] || 'Mixed timed practice';

  return [
    {
      id: `revise-${safeDateKey()}-1`,
      type: 'Revision',
      taskType: 'revision',
      title: buildTaskTitle(subject, 'revision', primaryTopic),
      subject,
      difficulty: 'easy',
      topic: primaryTopic,
      questionCount: 8,
      questions: 8,
      completed: false,
      focus: 'Revisit the most repeated mistake area',
      estimateMinutes: 20,
    },
    {
      id: `revise-${safeDateKey()}-2`,
      type: 'Practice',
      taskType: 'practice',
      title: buildTaskTitle(subject, 'practice', secondaryTopic),
      subject,
      difficulty: 'easy',
      topic: secondaryTopic,
      questionCount: 10,
      questions: 10,
      completed: false,
      focus: 'Solve targeted questions with full review',
      estimateMinutes: 25,
    },
    {
      id: `revise-${safeDateKey()}-3`,
      type: 'Test',
      taskType: 'test',
      title: buildTaskTitle(subject, 'test', tertiaryTopic),
      subject,
      difficulty: 'easy',
      topic: tertiaryTopic,
      questionCount: 1,
      questions: 1,
      completed: false,
      focus: 'Check improvement with a quick timed check',
      estimateMinutes: 12,
    },
  ];
}

export function getRevisionPlan(attempts = []) {
  const latest = attempts?.[0];
  const subject = latest?.subject || 'maths';
  const weakTopics = unique(
    attempts.flatMap((attempt) => attempt?.weakTopics || []),
  );

  if (!latest || weakTopics.length === 0) {
    return {
      generatedFor: safeDateKey(),
      subject,
      focusTopics: [],
      source: 'default-revision',
      tasks: [
        {
          id: `revise-${safeDateKey()}-default-1`,
          type: 'Revision',
          taskType: 'revision',
          title: buildTaskTitle(subject, 'revision', 'Core concepts'),
          subject,
          difficulty: 'easy',
          topic: 'Core concepts',
          questionCount: 8,
          questions: 8,
          completed: false,
          focus: 'Refresh formulas, definitions, and chapter notes',
          estimateMinutes: 20,
        },
        {
          id: `revise-${safeDateKey()}-default-2`,
          type: 'Practice',
          taskType: 'practice',
          title: buildTaskTitle(subject, 'practice', 'Mixed practice'),
          subject,
          difficulty: 'easy',
          topic: 'Mixed practice',
          questionCount: 10,
          questions: 10,
          completed: false,
          focus: 'Build accuracy with a small mixed question set',
          estimateMinutes: 25,
        },
        {
          id: `revise-${safeDateKey()}-default-3`,
          type: 'Test',
          taskType: 'test',
          title: buildTaskTitle(subject, 'test', 'Mini diagnostic'),
          subject,
          difficulty: 'easy',
          topic: 'Mini diagnostic',
          questionCount: 1,
          questions: 1,
          completed: false,
          focus: "Measure the day's learning in a quick check",
          estimateMinutes: 12,
        },
      ],
    };
  }

  return {
    generatedFor: safeDateKey(),
    subject,
    focusTopics: weakTopics,
    source: 'mistake-patterns',
    tasks: buildRevisionTasks(weakTopics, subject),
  };
}

export function getRevisionCalendar(attempts = []) {
  const days = [];
  const attemptMap = new Map();

  attempts.forEach((attempt) => {
    if (!attempt?.completedAt) return;
    const day = safeDateKey(attempt.completedAt);
    if (!attemptMap.has(day)) {
      attemptMap.set(day, attempt);
    }
  });

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = safeDateKey(date);
    const attempt = attemptMap.get(key);
    days.push({
      key,
      label: key.slice(5),
      active: Boolean(attempt),
      subject: attempt?.subject || null,
    });
  }

  return days;
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeTask(task, index = 0) {
  if (!task || typeof task !== 'object') {
    return {
      id: `task-${safeDateKey()}-${index + 1}`,
      type: 'Practice',
      taskType: 'practice',
      title: 'Untitled task',
      subject: 'maths',
      difficulty: 'easy',
      topic: 'Untitled topic',
      questionCount: 0,
      questions: 0,
      completed: false,
    };
  }

  const taskType = normalizeTaskTypeValue(task.taskType || task.type);
  const subject = normalizeSubjectValue(task.subject);
  const difficulty = normalizeDifficultyValue(task.difficulty);
  const topic = String(task.topic || '').trim() || 'Untitled topic';
  const questionCount = Number(task.questionCount ?? task.questions ?? 0);

  return {
    ...task,
    id: task.id || `task-${safeDateKey()}-${index + 1}`,
    type: task.type || taskTypeLabel(taskType),
    taskType,
    title: String(task.title || '').trim() || buildTaskTitle(subject, taskType, topic),
    subject,
    difficulty,
    topic,
    questionCount,
    questions: questionCount,
    completed: task.completed === true,
  };
}

function normalizePlan(plan) {
  if (!plan || typeof plan !== 'object') return getDefaultPlan();
  return {
    ...plan,
    tasks: Array.isArray(plan.tasks) ? plan.tasks.map(normalizeTask) : [],
  };
}

function runLegacyPlanMigration() {
  try {
    if (localStorage.getItem(PLAN_MIGRATION_KEY) === 'true') return;
    const savedPlan = readJSON(PLAN_DATA_KEY, null);
    if (savedPlan) {
      const normalized = normalizePlan(savedPlan);
      writeJSON(PLAN_DATA_KEY, normalized);
    }
    localStorage.removeItem(PLAN_PROGRESS_KEY);
    localStorage.setItem(PLAN_MIGRATION_KEY, 'true');
  } catch {
    // Ignore migration failures and keep the app usable.
  }
}

function loadActivity() {
  return readJSON(PLAN_ACTIVITY_KEY, {});
}

function saveActivity(activity) {
  writeJSON(PLAN_ACTIVITY_KEY, activity);
}

function loadStreakActivity() {
  return readJSON(PLAN_STREAK_ACTIVITY_KEY, {});
}

function saveStreakActivity(activity) {
  writeJSON(PLAN_STREAK_ACTIVITY_KEY, activity);
}

function todayKey(date = new Date()) {
  return safeDateKey(date);
}

function previousDateKey(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return safeDateKey(date);
}

function dateKeyToDate(key) {
  return new Date(`${key}T00:00:00`);
}

function daysBetween(dateA, dateB) {
  return Math.round((dateA.getTime() - dateB.getTime()) / 86400000);
}

function getDefaultStreakData() {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDay: null,
    lastUpdatedAt: null,
    totalStudyDays: 0,
    streakFreezeCount: 1,
    lastFreezeUsedAt: null,
  };
}

export function getStreakData() {
  return readJSON(PLAN_STREAK_STATUS_KEY, getDefaultStreakData());
}

export function getStreakState(streakData = getStreakData()) {
  const today = todayKey();
  const yesterday = previousDateKey(today);
  const activeToday = streakData.lastActiveDay === today;
  const activeYesterday = streakData.lastActiveDay === yesterday;
  const lastActiveDate = streakData.lastActiveDay ? dateKeyToDate(streakData.lastActiveDay) : null;
  const gapDays = lastActiveDate ? daysBetween(dateKeyToDate(today), lastActiveDate) - 1 : null;
  const atRisk = !activeToday && activeYesterday;
  const broken = !activeToday && streakData.lastActiveDay && gapDays >= 1 && !atRisk;
  const canFreeze = isPremiumUser() && Number(streakData.streakFreezeCount || 0) > 0 && gapDays === 1;
  let riskMessage = null;
  const currentStreak = Number(streakData.currentStreak || 0);

  if (atRisk) {
    riskMessage = 'Complete one task today to keep your streak alive.';
  } else if (broken) {
    riskMessage = 'Your streak has cooled off. Resume consistent activity to rebuild.';
  } else if (currentStreak === 0) {
    riskMessage = 'Start today and build a winning streak.';
  }

  return {
    ...streakData,
    activeToday,
    atRisk,
    broken,
    canFreeze,
    riskMessage,
    dayLabel: currentStreak > 0 ? `Day ${currentStreak}` : 'No streak yet',
  };
}

export function recordDailyActivity(activityType = 'study', count = 1, timestamp = new Date()) {
  const day = todayKey(timestamp);
  const normalizedType = String(activityType || 'study').trim().toLowerCase();
  const streakActivity = loadStreakActivity();
  const dayEntry = streakActivity[day] || { types: [], events: 0, updatedAt: null };
  if (!dayEntry.types.includes(normalizedType)) {
    dayEntry.types.push(normalizedType);
  }
  dayEntry.events = Number(dayEntry.events || 0) + Number(count || 1);
  dayEntry.updatedAt = timestamp.toISOString();
  streakActivity[day] = dayEntry;
  saveStreakActivity(streakActivity);

  const streakData = getStreakData();
  const todayDate = dateKeyToDate(day);
  const lastActiveDay = streakData.lastActiveDay;
  const yesterday = previousDateKey(day);
  const isSameDay = lastActiveDay === day;
  const isContinueStreak = lastActiveDay === yesterday;
  const gapDays = lastActiveDay ? daysBetween(todayDate, dateKeyToDate(lastActiveDay)) - 1 : null;
  let currentStreak = Number(streakData.currentStreak || 0);
  let longestStreak = Number(streakData.longestStreak || 0);
  let totalStudyDays = Number(streakData.totalStudyDays || 0);
  let streakFreezeCount = Number(streakData.streakFreezeCount || 1);
  let lastFreezeUsedAt = streakData.lastFreezeUsedAt || null;

  if (!isSameDay) {
    if (!lastActiveDay) {
      currentStreak = 1;
    } else if (isContinueStreak) {
      currentStreak += 1;
    } else if (gapDays === 1 && isPremiumUser() && streakFreezeCount > 0) {
      currentStreak += 1;
      streakFreezeCount -= 1;
      lastFreezeUsedAt = day;
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    totalStudyDays = Object.keys(streakActivity).length;
  }

  const nextData = {
    currentStreak,
    longestStreak,
    lastActiveDay: day,
    lastUpdatedAt: timestamp.toISOString(),
    totalStudyDays,
    streakFreezeCount,
    lastFreezeUsedAt,
  };
  writeJSON(PLAN_STREAK_STATUS_KEY, nextData);
  return nextData;
}

function readTaskLinks() {
  return readJSON(PLAN_TASK_LINKS_KEY, {});
}

function saveTaskLinks(links) {
  writeJSON(PLAN_TASK_LINKS_KEY, links);
}

export function getTodayPlan() {
  runLegacyPlanMigration();
  const latestAttempt = getLatestAttempt();
  const today = safeDateKey();
  const savedPlan = readJSON(PLAN_DATA_KEY, null);
  const latestSignature = latestAttempt
    ? `${latestAttempt.subject || 'maths'}:${latestAttempt.difficulty || 'easy'}:${unique(latestAttempt.weakTopics).join('|')}:${latestAttempt.completedAt || ''}`
    : 'default';

  if (savedPlan && savedPlan.generatedFor === today && savedPlan.sourceSignature === latestSignature) {
    return normalizePlan(savedPlan);
  }

  const nextPlan = generateDailyPlan(latestAttempt);
  const normalizedNextPlan = normalizePlan(nextPlan);
  writeJSON(PLAN_DATA_KEY, normalizedNextPlan);

  const existingProgress = readJSON(PLAN_PROGRESS_KEY, {});
  const nextProgress = {};
  (normalizedNextPlan.tasks || []).forEach((task) => {
    nextProgress[task.id] = Boolean(existingProgress[task.id] && savedPlan?.generatedFor === today);
  });
  writeJSON(PLAN_PROGRESS_KEY, nextProgress);

  return normalizedNextPlan;
}

export function savePlanProgress(taskId, completed = true) {
  const plan = getTodayPlan();
  const progress = readJSON(PLAN_PROGRESS_KEY, {});
  const wasCompleted = Boolean(progress[taskId]);
  progress[taskId] = completed;
  writeJSON(PLAN_PROGRESS_KEY, progress);

  const activity = loadActivity();
  const today = safeDateKey();
  const todayActivity = unique([...(activity[today] || []), taskId]);
  activity[today] = todayActivity;
  saveActivity(activity);

  const completionDays = Object.keys(activity)
    .filter((date) => (activity[date] || []).length > 0)
    .sort();

  let streak = 0;
  let cursor = new Date(`${today}T00:00:00`);
  while (completionDays.includes(safeDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  writeJSON(PLAN_STREAK_KEY, {
    streak,
    updatedAt: new Date().toISOString(),
    lastCompletedDay: today,
    subject: plan.subject,
  });

  if (completed && !wasCompleted) {
    recordDailyActivity('study');
    awardDailyPlanXP({
      taskCompleted: true,
      streak,
      totalCompletedTasks: Object.values(progress).filter(Boolean).length,
    });
  }

  return getTodayPlan();
}

export function normalizeStoredDailyPlans() {
  runLegacyPlanMigration();
  const plan = readJSON(PLAN_DATA_KEY, null);
  if (!plan) return getTodayPlan();
  const normalized = normalizePlan(plan);
  writeJSON(PLAN_DATA_KEY, normalized);
  const progress = readJSON(PLAN_PROGRESS_KEY, {});
  const nextProgress = {};
  normalized.tasks.forEach((task) => {
    nextProgress[task.id] = progress[task.id] === true;
  });
  writeJSON(PLAN_PROGRESS_KEY, nextProgress);
  return normalized;
}

export function linkPlanTaskToTest(taskId, setup) {
  if (!taskId) return null;
  const links = readTaskLinks();
  links[taskId] = {
    taskId,
    subject: setup?.subject || null,
    difficulty: setup?.difficulty || null,
    topic: setup?.topic || null,
    taskType: setup?.taskType || null,
    fromDailyPlan: Boolean(setup?.fromDailyPlan),
    isRetake: Boolean(setup?.isRetake),
    linkedAt: new Date().toISOString(),
  };
  saveTaskLinks(links);
  return links[taskId];
}

export function getLinkedPlanTask(taskId) {
  const links = readTaskLinks();
  return links[taskId] || null;
}

export function clearPlanTaskLinks() {
  localStorage.removeItem(PLAN_TASK_LINKS_KEY);
}

export function getPlanProgress() {
  return readJSON(PLAN_PROGRESS_KEY, {});
}

export function getStreak() {
  const streakStatus = readJSON(PLAN_STREAK_STATUS_KEY, null);
  if (streakStatus && typeof streakStatus.currentStreak === 'number') {
    return Number(streakStatus.currentStreak || 0);
  }

  const streakData = readJSON(PLAN_STREAK_KEY, {
    streak: 0,
    updatedAt: null,
    lastCompletedDay: null,
  });
  return Number(streakData?.streak || 0);
}

export function getPlanCompletionCount() {
  const plan = getTodayPlan();
  const progress = getPlanProgress();
  const completed = (plan.tasks || []).filter((task) => progress[task.id]).length;
  return { completed, total: (plan.tasks || []).length };
}

export function resetPlanProgress() {
  localStorage.removeItem(PLAN_PROGRESS_KEY);
  localStorage.removeItem(PLAN_DATA_KEY);
}
