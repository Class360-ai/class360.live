const LEARNING_PROGRESS_KEY = 'class360_learning_progress';
const LEARNING_TESTS_KEY = 'class360_learning_tests';
const LEARNING_DOUBTS_KEY = 'class360_learning_doubts';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('class360-storage-changed'));
}

export function getStoredLearningProgress() {
  return readJson(LEARNING_PROGRESS_KEY, {});
}

export function saveStoredLearningProgress(chapterSlug, patch) {
  const current = getStoredLearningProgress();
  const next = {
    ...current,
    [chapterSlug]: {
      ...(current[chapterSlug] || {}),
      ...patch,
      updatedAt: new Date().toISOString(),
    },
  };
  writeJson(LEARNING_PROGRESS_KEY, next);
  return next[chapterSlug];
}

export function getStoredLearningTests() {
  return readJson(LEARNING_TESTS_KEY, []);
}

export function saveStoredLearningTest(test) {
  const next = [test, ...getStoredLearningTests()].slice(0, 20);
  writeJson(LEARNING_TESTS_KEY, next);
  return test;
}

export function getStoredLearningDoubts() {
  return readJson(LEARNING_DOUBTS_KEY, []);
}

export function saveStoredLearningDoubt(doubt) {
  const next = [doubt, ...getStoredLearningDoubts()].slice(0, 20);
  writeJson(LEARNING_DOUBTS_KEY, next);
  return doubt;
}
