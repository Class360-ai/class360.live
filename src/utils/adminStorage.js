import { learningSubjectCatalog } from '../data/learningSubjectCatalog';

const ADMIN_CONTENT_KEY = 'class360_admin_learning_content';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueSlug(base, existing = []) {
  const normalized = slugify(base);
  if (!existing.includes(normalized)) return normalized;
  let index = 2;
  while (existing.includes(`${normalized}-${index}`)) {
    index += 1;
  }
  return `${normalized}-${index}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildDefaultContent() {
  const subjects = learningSubjectCatalog.map((subject) => ({
    id: subject.slug,
    name: subject.name,
    classLevel: String(subject.classLevel || '6').replace(/^\D+/g, '') || '6',
    description: subject.description,
    slug: subject.slug,
    contentLanguage: subject.contentLanguage || 'English',
    category: subject.category || '',
  }));

  const chapters = [];
  const notes = [];
  const questions = [];

  learningSubjectCatalog.forEach((subject) => {
    subject.chapters.forEach((chapter, index) => {
      const chapterId = chapter.slug;
      const chapterNotes = chapter.notes || {
        summaryPoints: [
          `${chapter.title} introduces the main idea in a simple way.`,
          'Use the notes to revise quickly before practice.',
          'Short bullets are easier to remember on mobile too.',
        ],
        keyTerms: [
          { term: 'Core idea', meaning: `The main concept in ${chapter.title}.` },
          { term: 'Example', meaning: 'A familiar example that makes the chapter easier to remember.' },
        ],
        examples: [subject.name, chapter.title, 'Classroom example'],
        revisionBox: 'Read once, revise once, and then try the questions.',
      };

      chapters.push({
        id: chapterId,
        subjectId: subject.slug,
        subjectSlug: subject.slug,
        subjectName: subject.name,
        title: chapter.title,
        slug: chapter.slug,
        description: chapter.description,
        videoUrl: chapter.videoUrl || '',
        duration: chapter.estimatedDuration || chapter.duration || '08 min',
        order: chapter.chapterNumber || index + 1,
        objectives: chapter.objectives || [],
        thumbnail: chapter.thumbnail || '',
        level: chapter.level || 'Core',
        contentLanguage: chapter.contentLanguage || 'English',
        icon: chapter.icon || '',
        quizFocus: chapter.quizFocus || '',
      });

      notes.push({
        id: `${chapterId}-notes`,
        chapterId,
        chapterSlug: chapter.slug,
        summaryPoints: chapterNotes.summaryPoints || [],
        keyTerms: chapterNotes.keyTerms || [],
        examples: chapterNotes.examples || [],
        revisionBox: chapterNotes.revisionBox || '',
      });

      ['practice', 'dpp', 'test'].forEach((type) => {
        const sourceQuestions = chapter[`${type}Questions`] || [];
        sourceQuestions.forEach((question, questionIndex) => {
          questions.push({
            id: question.id || `${chapterId}-${type}-${questionIndex + 1}`,
            chapterId,
            chapterSlug: chapter.slug,
            type,
            question: question.question,
            options: question.options || [],
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || '',
            difficulty: question.difficulty || (type === 'test' ? 'medium' : 'easy'),
          });
        });
      });
    });
  });

  return { subjects, chapters, notes, questions };
}

function getDefaultAdminContent() {
  return buildDefaultContent();
}

export function getAdminContent() {
  try {
    const raw = localStorage.getItem(ADMIN_CONTENT_KEY);
    if (!raw) {
      const seed = getDefaultAdminContent();
      localStorage.setItem(ADMIN_CONTENT_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : getDefaultAdminContent();
  } catch {
    return getDefaultAdminContent();
  }
}

export function saveAdminContent(content) {
  const next = clone(content);
  localStorage.setItem(ADMIN_CONTENT_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('class360-admin-content-changed'));
  return next;
}

function updateAdminContent(mutator) {
  const current = getAdminContent();
  const next = clone(current);
  mutator(next);
  return saveAdminContent(next);
}

export function getAdminStats() {
  const content = getAdminContent();
  return {
    totalSubjects: content.subjects.length,
    totalChapters: content.chapters.length,
    totalNotes: content.notes.length,
    totalQuestions: content.questions.length,
  };
}

export function getAdminSubjectById(subjectId) {
  return getAdminContent().subjects.find((subject) => subject.id === subjectId || subject.slug === subjectId) || null;
}

export function getAdminChapterById(chapterId) {
  return getAdminContent().chapters.find((chapter) => chapter.id === chapterId || chapter.slug === chapterId) || null;
}

export function getAdminNoteByChapterSlug(chapterSlug) {
  return getAdminContent().notes.find((note) => note.chapterSlug === chapterSlug || note.chapterId === chapterSlug) || null;
}

export function getAdminQuestionsByChapterSlug(chapterSlug, type = null) {
  return getAdminContent().questions.filter(
    (question) => question.chapterSlug === chapterSlug && (!type || question.type === type),
  );
}

export function getAdminSubjectOptions() {
  return getAdminContent().subjects.map((subject) => ({ ...subject }));
}

export function getAdminChapterOptions() {
  return getAdminContent().chapters
    .slice()
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((chapter) => ({ ...chapter }));
}

export function saveAdminSubject(subject) {
  return updateAdminContent((content) => {
    const existingIndex = content.subjects.findIndex((item) => item.id === subject.id || item.slug === subject.slug);
    const nextSubject = {
      id: subject.id || subject.slug,
      name: String(subject.name || '').trim(),
      classLevel: String(subject.classLevel || '6').trim(),
      description: String(subject.description || '').trim(),
      slug: slugify(subject.slug || subject.name),
      contentLanguage: String(subject.contentLanguage || 'English').trim(),
      category: String(subject.category || '').trim(),
    };

    if (existingIndex >= 0) {
      content.subjects[existingIndex] = nextSubject;
    } else {
      content.subjects.push(nextSubject);
    }
  });
}

export function deleteAdminSubject(subjectId) {
  return updateAdminContent((content) => {
    const subject = content.subjects.find((item) => item.id === subjectId || item.slug === subjectId);
    if (!subject) return;
    content.subjects = content.subjects.filter((item) => item.id !== subject.id && item.slug !== subject.slug);
    const relatedChapterIds = new Set(
      content.chapters.filter((chapter) => chapter.subjectId === subject.slug).map((chapter) => chapter.id),
    );
    content.chapters = content.chapters.filter((chapter) => chapter.subjectId !== subject.slug);
    content.notes = content.notes.filter((note) => !relatedChapterIds.has(note.chapterId));
    content.questions = content.questions.filter((question) => !relatedChapterIds.has(question.chapterId));
  });
}

export function saveAdminChapter(chapter) {
  return updateAdminContent((content) => {
    const subject = content.subjects.find((item) => item.id === chapter.subjectId || item.slug === chapter.subjectId);
    if (!subject) return;

    const nextSlug = slugify(chapter.slug || chapter.title);
    const existingIndex = content.chapters.findIndex((item) => item.id === chapter.id || item.slug === chapter.slug);
    const nextChapter = {
      id: chapter.id || nextSlug,
      subjectId: subject.slug,
      subjectSlug: subject.slug,
      subjectName: subject.name,
      title: String(chapter.title || '').trim(),
      slug: nextSlug,
      description: String(chapter.description || '').trim(),
      videoUrl: String(chapter.videoUrl || '').trim(),
      duration: String(chapter.duration || '').trim(),
      order: Number(chapter.order || 0),
      objectives: Array.isArray(chapter.objectives) ? chapter.objectives.filter(Boolean) : [],
      thumbnail: String(chapter.thumbnail || '').trim(),
      level: String(chapter.level || 'Core').trim(),
      contentLanguage: String(chapter.contentLanguage || 'English').trim(),
      icon: String(chapter.icon || '').trim(),
      quizFocus: String(chapter.quizFocus || '').trim(),
    };

    if (existingIndex >= 0) {
      content.chapters[existingIndex] = nextChapter;
    } else {
      content.chapters.push(nextChapter);
    }

    const notesIndex = content.notes.findIndex((item) => item.chapterId === nextChapter.id || item.chapterSlug === nextSlug);
    if (notesIndex >= 0) {
      content.notes[notesIndex] = {
        ...content.notes[notesIndex],
        chapterId: nextChapter.id,
        chapterSlug: nextSlug,
      };
    }

    content.questions = content.questions.map((question) =>
      question.chapterId === nextChapter.id || question.chapterSlug === chapter.slug
        ? { ...question, chapterId: nextChapter.id, chapterSlug: nextSlug }
        : question,
    );
  });
}

export function deleteAdminChapter(chapterId) {
  return updateAdminContent((content) => {
    const chapter = content.chapters.find((item) => item.id === chapterId || item.slug === chapterId);
    if (!chapter) return;
    content.chapters = content.chapters.filter((item) => item.id !== chapter.id && item.slug !== chapter.slug);
    content.notes = content.notes.filter((note) => note.chapterId !== chapter.id && note.chapterSlug !== chapter.slug);
    content.questions = content.questions.filter(
      (question) => question.chapterId !== chapter.id && question.chapterSlug !== chapter.slug,
    );
  });
}

export function saveAdminNotes(chapterSlug, payload) {
  return updateAdminContent((content) => {
    const chapter = content.chapters.find((item) => item.slug === chapterSlug || item.id === chapterSlug);
    if (!chapter) return;
    const next = {
      id: `${chapter.id}-notes`,
      chapterId: chapter.id,
      chapterSlug: chapter.slug,
      summaryPoints: Array.isArray(payload.summaryPoints) ? payload.summaryPoints.filter(Boolean) : [],
      keyTerms: Array.isArray(payload.keyTerms) ? payload.keyTerms.filter((item) => item.term || item.meaning) : [],
      examples: Array.isArray(payload.examples) ? payload.examples.filter(Boolean) : [],
      revisionBox: String(payload.revisionBox || '').trim(),
    };
    const existingIndex = content.notes.findIndex((item) => item.chapterId === chapter.id || item.chapterSlug === chapter.slug);
    if (existingIndex >= 0) {
      content.notes[existingIndex] = next;
    } else {
      content.notes.push(next);
    }
  });
}

export function saveAdminQuestion(payload) {
  return updateAdminContent((content) => {
    const chapter = content.chapters.find((item) => item.slug === payload.chapterSlug || item.id === payload.chapterId);
    if (!chapter) return;
    const next = {
      id: payload.id || `${chapter.id}-${payload.type}-${Date.now()}`,
      chapterId: chapter.id,
      chapterSlug: chapter.slug,
      type: payload.type,
      question: String(payload.question || '').trim(),
      options: Array.isArray(payload.options) ? payload.options.filter(Boolean).slice(0, 4) : [],
      correctAnswer: String(payload.correctAnswer || '').trim(),
      explanation: String(payload.explanation || '').trim(),
      difficulty: String(payload.difficulty || 'easy').trim(),
    };

    const existingIndex = content.questions.findIndex((item) => item.id === next.id);
    if (existingIndex >= 0) {
      content.questions[existingIndex] = next;
    } else {
      content.questions.push(next);
    }
  });
}

export function deleteAdminQuestion(questionId) {
  return updateAdminContent((content) => {
    content.questions = content.questions.filter((question) => question.id !== questionId);
  });
}

export function buildAdminSlug(base, existing = []) {
  return uniqueSlug(base, existing);
}
