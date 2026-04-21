import existingChapters from './chapters.json';

const classOrder = ['Class 6', 'Class 7', 'Class 8'];
const subjectOrder = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science'];

const subjectAliases = {
  maths: 'Mathematics',
  math: 'Mathematics',
  mathematics: 'Mathematics',
  sst: 'Social Science',
  socialscience: 'Social Science',
  social_science: 'Social Science',
};

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '');
}

function normalizeClassName(value) {
  const normalized = String(value || '').trim();
  return classOrder.find((className) => normalizeKey(className) === normalizeKey(normalized)) || normalized;
}

function normalizeSubject(value) {
  const normalized = String(value || '').trim();
  const alias = subjectAliases[normalizeKey(normalized)];
  return alias || subjectOrder.find((subject) => normalizeKey(subject) === normalizeKey(normalized)) || normalized;
}

function matchesClass(chapterClassName, className) {
  return normalizeKey(chapterClassName) === normalizeKey(className);
}

function matchesSubject(chapterSubject, subject) {
  return normalizeKey(normalizeSubject(chapterSubject)) === normalizeKey(normalizeSubject(subject));
}

export function getVoiceLearningChapters() {
  return [...existingChapters].sort((left, right) => {
    const classDelta = classOrder.indexOf(left.className) - classOrder.indexOf(right.className);
    if (classDelta !== 0) return classDelta;
    const subjectDelta = subjectOrder.indexOf(left.subject) - subjectOrder.indexOf(right.subject);
    if (subjectDelta !== 0) return subjectDelta;
    return left.chapter.localeCompare(right.chapter);
  });
}

export function getVoiceLearningClasses() {
  return classOrder.map((className) => ({ className, label: className }));
}

export function getVoiceLearningSubjects() {
  return subjectOrder.map((subject) => ({ subject, label: subject }));
}

export function getVoiceLearningChapterById(chapterId) {
  const normalizedId = safeDecodeChapterId(chapterId);
  return getVoiceLearningChapters().find((chapter) => chapter.id === normalizedId) || null;
}

export function getVoiceLearningChaptersForClass(className) {
  const targetClass = normalizeClassName(className);
  return getVoiceLearningChapters().filter((chapter) => matchesClass(chapter.className, targetClass));
}

export function getVoiceLearningChaptersForClassAndSubject(className, subject) {
  const targetClass = normalizeClassName(className);
  const targetSubject = normalizeSubject(subject);
  return getVoiceLearningChapters().filter(
    (chapter) => matchesClass(chapter.className, targetClass) && matchesSubject(chapter.subject, targetSubject),
  );
}

export function getVoiceLearningSubjectsForClass(className) {
  const subjects = new Set(
    getVoiceLearningChaptersForClass(className).map((chapter) => normalizeSubject(chapter.subject)),
  );
  return subjectOrder.filter((subject) => subjects.has(subject));
}

export function getVoiceLearningChapterCount(className) {
  return getVoiceLearningChaptersForClass(className).length;
}

export function getVoiceLearningDefaultChapterId() {
  return getVoiceLearningChapters()[0]?.id || '';
}

export function getVoiceLearningChapterPath(chapterId) {
  const normalizedId = String(chapterId || '').trim();
  return normalizedId ? `/voice-learning/${encodeURIComponent(normalizedId)}` : '/voice-learning';
}

export function normalizeVoiceLearningChapter(chapter) {
  if (!chapter) return null;

  const contentType = normalizeContentType(chapter.contentType, chapter);
  const lines = Array.isArray(chapter.lines) ? chapter.lines.map(normalizeLineItem).filter(Boolean) : [];
  const steps = Array.isArray(chapter.steps) ? chapter.steps.map(normalizeStepItem).filter(Boolean) : [];

  return {
    ...chapter,
    className: String(chapter.className || '').trim(),
    subject: normalizeSubject(chapter.subject),
    chapter: String(chapter.chapter || '').trim(),
    description: String(chapter.description || '').trim(),
    contentType,
    lines,
    steps,
  };
}

function safeDecodeChapterId(chapterId) {
  const rawId = String(chapterId || '').trim();
  if (!rawId) return '';

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
}

function normalizeContentType(contentType, chapter) {
  const normalized = String(contentType || '').trim().toLowerCase();
  if (normalized === 'step_player') return 'step_player';
  if (normalized === 'line_player') return 'line_player';
  if (Array.isArray(chapter?.steps) && chapter.steps.length) return 'step_player';
  return 'line_player';
}

function normalizeLineItem(item) {
  if (!item || typeof item !== 'object') return null;

  if (item.type === 'checkpoint') {
    const prompt = String(item.prompt || '').trim();
    const hint = String(item.hint || '').trim();
    if (!prompt && !hint) return null;
    return {
      type: 'checkpoint',
      prompt: prompt || 'Meaning samjha?',
      hint,
    };
  }

  const text = String(item.text || '').trim();
  if (!text) return null;

  return {
    type: 'line',
    text,
    pause: Number.isFinite(Number(item.pause)) ? Math.max(0, Number(item.pause)) : 2,
    explanation: String(item.explanation || '').trim(),
  };
}

function normalizeStepItem(item) {
  if (!item || typeof item !== 'object') return null;

  const question = String(item.question || '').trim();
  const stepText = String(item.stepText || '').trim();
  const explanation = String(item.explanation || '').trim();

  if (!question && !stepText && !explanation) return null;

  return {
    question: question || 'Solve this step',
    stepText: stepText || explanation || 'Read the step carefully.',
    explanation: explanation || 'Simple Hinglish explanation yahan aayegi.',
  };
}
