import { questionExtras } from './questionExtras.js';

export const testQuestions = {
  maths: {
    easy: [
      {
        id: 'maths-e1',
        subject: 'Maths',
        difficulty: 'easy',
        topic: 'Algebra',
        question: 'If x + 7 = 19, what is the value of x?',
        options: ['10', '11', '12', '13'],
        correctAnswer: '12',
      },
      {
        id: 'maths-e2',
        subject: 'Maths',
        difficulty: 'easy',
        topic: 'Percentages',
        question: 'What is 25% of 80?',
        options: ['15', '20', '25', '30'],
        correctAnswer: '20',
      },
      {
        id: 'maths-e3',
        subject: 'Maths',
        difficulty: 'easy',
        topic: 'Arithmetic',
        question: 'What is 14 + 9?',
        options: ['21', '22', '23', '24'],
        correctAnswer: '23',
      },
      {
        id: 'maths-e4',
        subject: 'Maths',
        difficulty: 'easy',
        topic: 'Fractions',
        question: 'What is 1/2 of 18?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '9',
      },
      {
        id: 'maths-e5',
        subject: 'Maths',
        difficulty: 'easy',
        topic: 'Time and Work',
        question: 'If one notebook costs 12 rupees, how much do 3 notebooks cost?',
        options: ['24', '30', '36', '40'],
        correctAnswer: '36',
      },
    ],
    medium: [
      {
        id: 'maths-m1',
        subject: 'Maths',
        difficulty: 'medium',
        topic: 'Geometry',
        question: 'The sum of angles in a triangle is equal to:',
        options: ['90°', '120°', '180°', '360°'],
        correctAnswer: '180°',
      },
      {
        id: 'maths-m2',
        subject: 'Maths',
        difficulty: 'medium',
        topic: 'Number System',
        question: 'What is the LCM of 6 and 8?',
        options: ['12', '18', '24', '48'],
        correctAnswer: '24',
      },
      {
        id: 'maths-m3',
        subject: 'Maths',
        difficulty: 'medium',
        topic: 'Statistics',
        question: 'What is the mean of 4, 6, 8, and 12?',
        options: ['7', '7.5', '8', '9'],
        correctAnswer: '7.5',
      },
      {
        id: 'maths-m4',
        subject: 'Maths',
        difficulty: 'medium',
        topic: 'Algebra',
        question: 'Solve for x: 2x + 5 = 17.',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
      },
      {
        id: 'maths-m5',
        subject: 'Maths',
        difficulty: 'medium',
        topic: 'Profit and Loss',
        question: 'If the cost price is 100 and selling price is 120, what is the profit?',
        options: ['10', '15', '20', '25'],
        correctAnswer: '20',
      },
    ],
    hard: [
      {
        id: 'maths-h1',
        subject: 'Maths',
        difficulty: 'hard',
        topic: 'Quadratic Equations',
        question: 'If the roots of x² - 5x + 6 = 0 are a and b, what is a + b?',
        options: ['3', '5', '6', '8'],
        correctAnswer: '5',
      },
      {
        id: 'maths-h2',
        subject: 'Maths',
        difficulty: 'hard',
        topic: 'Trigonometry',
        question: 'What is the value of sin 30°?',
        options: ['1/2', '1', '√2/2', '√3/2'],
        correctAnswer: '1/2',
      },
      {
        id: 'maths-h3',
        subject: 'Maths',
        difficulty: 'hard',
        topic: 'Mensuration',
        question: 'What is the area of a circle with radius 7 cm?',
        options: ['44 cm²', '98 cm²', '154 cm²', '308 cm²'],
        correctAnswer: '154 cm²',
      },
      {
        id: 'maths-h4',
        subject: 'Maths',
        difficulty: 'hard',
        topic: 'Sequences',
        question: 'What is the next term in the series 3, 6, 12, 24, __?',
        options: ['30', '36', '48', '60'],
        correctAnswer: '48',
      },
      {
        id: 'maths-h5',
        subject: 'Maths',
        difficulty: 'hard',
        topic: 'Trigonometry',
        question: 'What is cos 60°?',
        options: ['1/2', '1', '0', '√3/2'],
        correctAnswer: '1/2',
      },
    ],
  },
  science: {
    easy: [
      {
        id: 'science-e1',
        subject: 'Science',
        difficulty: 'easy',
        topic: 'Physics',
        question: 'Which force pulls objects toward the Earth?',
        options: ['Magnetism', 'Gravity', 'Friction', 'Tension'],
        correctAnswer: 'Gravity',
      },
      {
        id: 'science-e2',
        subject: 'Science',
        difficulty: 'easy',
        topic: 'Chemistry',
        question: 'Water is a compound made of:',
        options: ['Hydrogen and oxygen', 'Carbon and nitrogen', 'Sodium and chlorine', 'Iron and sulfur'],
        correctAnswer: 'Hydrogen and oxygen',
      },
      {
        id: 'science-e3',
        subject: 'Science',
        difficulty: 'easy',
        topic: 'Biology',
        question: 'Humans breathe in oxygen and breathe out:',
        options: ['Carbon dioxide', 'Nitrogen', 'Helium', 'Hydrogen'],
        correctAnswer: 'Carbon dioxide',
      },
      {
        id: 'science-e4',
        subject: 'Science',
        difficulty: 'easy',
        topic: 'Physics',
        question: 'A moving object has:',
        options: ['Mass', 'Speed', 'Force', 'Pressure'],
        correctAnswer: 'Speed',
      },
      {
        id: 'science-e5',
        subject: 'Science',
        difficulty: 'easy',
        topic: 'Chemistry',
        question: 'Which of these is a solid at room temperature?',
        options: ['Oxygen', 'Milk', 'Stone', 'Steam'],
        correctAnswer: 'Stone',
      },
    ],
    medium: [
      {
        id: 'science-m1',
        subject: 'Science',
        difficulty: 'medium',
        topic: 'Biology',
        question: 'The process by which plants make food is called:',
        options: ['Respiration', 'Transpiration', 'Photosynthesis', 'Digestion'],
        correctAnswer: 'Photosynthesis',
      },
      {
        id: 'science-m2',
        subject: 'Science',
        difficulty: 'medium',
        topic: 'Physics',
        question: 'The SI unit of force is:',
        options: ['Watt', 'Newton', 'Joule', 'Pascal'],
        correctAnswer: 'Newton',
      },
      {
        id: 'science-m3',
        subject: 'Science',
        difficulty: 'medium',
        topic: 'Chemistry',
        question: 'Rusting of iron is mainly caused by the reaction with:',
        options: ['Oxygen and moisture', 'Nitrogen', 'Hydrogen', 'Carbon dioxide'],
        correctAnswer: 'Oxygen and moisture',
      },
      {
        id: 'science-m4',
        subject: 'Science',
        difficulty: 'medium',
        topic: 'Biology',
        question: 'The basic unit of life is:',
        options: ['Tissue', 'Cell', 'Organ', 'System'],
        correctAnswer: 'Cell',
      },
      {
        id: 'science-m5',
        subject: 'Science',
        difficulty: 'medium',
        topic: 'Physics',
        question: 'Which of these is a source of light?',
        options: ['Moon', 'Sun', 'Mirror', 'Table'],
        correctAnswer: 'Sun',
      },
    ],
    hard: [
      {
        id: 'science-h1',
        subject: 'Science',
        difficulty: 'hard',
        topic: 'Biology',
        question: 'Which organelle is known as the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'],
        correctAnswer: 'Mitochondria',
      },
      {
        id: 'science-h2',
        subject: 'Science',
        difficulty: 'hard',
        topic: 'Chemistry',
        question: 'The pH of a neutral solution is:',
        options: ['0', '7', '10', '14'],
        correctAnswer: '7',
      },
      {
        id: 'science-h3',
        subject: 'Science',
        difficulty: 'hard',
        topic: 'Physics',
        question: 'Light travels fastest in:',
        options: ['Water', 'Glass', 'Vacuum', 'Air'],
        correctAnswer: 'Vacuum',
      },
      {
        id: 'science-h4',
        subject: 'Science',
        difficulty: 'hard',
        topic: 'Chemistry',
        question: 'Which gas is most abundant in the Earth’s atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
        correctAnswer: 'Nitrogen',
      },
      {
        id: 'science-h5',
        subject: 'Science',
        difficulty: 'hard',
        topic: 'Biology',
        question: 'What is the function of red blood cells?',
        options: ['Fight infection', 'Carry oxygen', 'Digest food', 'Store fat'],
        correctAnswer: 'Carry oxygen',
      },
    ],
  },
  english: {
    easy: [
      {
        id: 'english-e1',
        subject: 'English',
        difficulty: 'easy',
        topic: 'Grammar',
        question: 'Choose the correct article: __ apple a day keeps the doctor away.',
        options: ['A', 'An', 'The', 'No article'],
        correctAnswer: 'An',
      },
      {
        id: 'english-e2',
        subject: 'English',
        difficulty: 'easy',
        topic: 'Vocabulary',
        question: 'Select the synonym of "happy".',
        options: ['Sad', 'Angry', 'Joyful', 'Tired'],
        correctAnswer: 'Joyful',
      },
      {
        id: 'english-e3',
        subject: 'English',
        difficulty: 'easy',
        topic: 'Grammar',
        question: 'Choose the correct verb: He ____ to school every day.',
        options: ['go', 'goes', 'going', 'gone'],
        correctAnswer: 'goes',
      },
      {
        id: 'english-e4',
        subject: 'English',
        difficulty: 'easy',
        topic: 'Vocabulary',
        question: 'Choose the antonym of "big".',
        options: ['Large', 'Huge', 'Small', 'Wide'],
        correctAnswer: 'Small',
      },
      {
        id: 'english-e5',
        subject: 'English',
        difficulty: 'easy',
        topic: 'Grammar',
        question: 'Select the correct punctuation: What time is it__',
        options: ['.', '!', '?', ','],
        correctAnswer: '?',
      },
    ],
    medium: [
      {
        id: 'english-m1',
        subject: 'English',
        difficulty: 'medium',
        topic: 'Comprehension',
        question: 'The main purpose of a summary is to:',
        options: ['Add extra details', 'Shorten the original idea', 'Change the meaning', 'Make it longer'],
        correctAnswer: 'Shorten the original idea',
      },
      {
        id: 'english-m2',
        subject: 'English',
        difficulty: 'medium',
        topic: 'Grammar',
        question: 'Choose the correct sentence.',
        options: [
          'She don’t like tea.',
          'She doesn’t likes tea.',
          'She doesn’t like tea.',
          'She not like tea.',
        ],
        correctAnswer: 'She doesn’t like tea.',
      },
      {
        id: 'english-m3',
        subject: 'English',
        difficulty: 'medium',
        topic: 'Vocabulary',
        question: 'Choose the closest meaning of "rapid".',
        options: ['Slow', 'Fast', 'Tired', 'Quiet'],
        correctAnswer: 'Fast',
      },
      {
        id: 'english-m4',
        subject: 'English',
        difficulty: 'medium',
        topic: 'Comprehension',
        question: 'A paragraph usually contains:',
        options: ['One idea only', 'A few related ideas', 'No meaning', 'Random words'],
        correctAnswer: 'A few related ideas',
      },
      {
        id: 'english-m5',
        subject: 'English',
        difficulty: 'medium',
        topic: 'Grammar',
        question: 'Identify the correct tense: She has finished her homework.',
        options: ['Past continuous', 'Present perfect', 'Simple present', 'Future perfect'],
        correctAnswer: 'Present perfect',
      },
    ],
    hard: [
      {
        id: 'english-h1',
        subject: 'English',
        difficulty: 'hard',
        topic: 'Vocabulary',
        question: 'Choose the word closest in meaning to "resilient".',
        options: ['Weak', 'Flexible', 'Fragile', 'Expensive'],
        correctAnswer: 'Flexible',
      },
      {
        id: 'english-h2',
        subject: 'English',
        difficulty: 'hard',
        topic: 'Comprehension',
        question: 'An inference is best described as:',
        options: ['A direct quote', 'A reasonable conclusion', 'A spelling error', 'A title'],
        correctAnswer: 'A reasonable conclusion',
      },
      {
        id: 'english-h3',
        subject: 'English',
        difficulty: 'hard',
        topic: 'Vocabulary',
        question: 'Choose the word opposite in meaning to "optimistic".',
        options: ['Hopeful', 'Cheerful', 'Pessimistic', 'Active'],
        correctAnswer: 'Pessimistic',
      },
      {
        id: 'english-h4',
        subject: 'English',
        difficulty: 'hard',
        topic: 'Grammar',
        question: 'Choose the correct option: Neither the students nor the teacher ____ ready.',
        options: ['are', 'were', 'is', 'be'],
        correctAnswer: 'is',
      },
      {
        id: 'english-h5',
        subject: 'English',
        difficulty: 'hard',
        topic: 'Comprehension',
        question: 'A tone in writing refers to the writer’s:',
        options: ['Font size', 'Attitude', 'Topic', 'Paragraph count'],
        correctAnswer: 'Attitude',
      },
    ],
  },
  reasoning: {
    easy: [
      {
        id: 'reasoning-e1',
        subject: 'Reasoning',
        difficulty: 'easy',
        topic: 'Series',
        question: 'Find the next number: 2, 4, 6, 8, __',
        options: ['9', '10', '11', '12'],
        correctAnswer: '10',
      },
      {
        id: 'reasoning-e2',
        subject: 'Reasoning',
        difficulty: 'easy',
        topic: 'Analogy',
        question: 'Book is to Read as Fork is to:',
        options: ['Eat', 'Write', 'Cut', 'Hold'],
        correctAnswer: 'Eat',
      },
      {
        id: 'reasoning-e3',
        subject: 'Reasoning',
        difficulty: 'easy',
        topic: 'Series',
        question: 'Find the next number: 1, 3, 5, 7, __',
        options: ['8', '9', '10', '11'],
        correctAnswer: '9',
      },
      {
        id: 'reasoning-e4',
        subject: 'Reasoning',
        difficulty: 'easy',
        topic: 'Odd One Out',
        question: 'Which one is different?',
        options: ['Apple', 'Banana', 'Carrot', 'Orange'],
        correctAnswer: 'Carrot',
      },
      {
        id: 'reasoning-e5',
        subject: 'Reasoning',
        difficulty: 'easy',
        topic: 'Direction',
        question: 'If a person walks north and then south the same distance, where are they from the start?',
        options: ['Far away', 'At the start', 'East', 'West'],
        correctAnswer: 'At the start',
      },
    ],
    medium: [
      {
        id: 'reasoning-m1',
        subject: 'Reasoning',
        difficulty: 'medium',
        topic: 'Direction',
        question: 'A person walks 5 km north and then 5 km east. How far is he from the starting point?',
        options: ['5 km', '7 km', '10 km', '12 km'],
        correctAnswer: '7 km',
      },
      {
        id: 'reasoning-m2',
        subject: 'Reasoning',
        difficulty: 'medium',
        topic: 'Coding-Decoding',
        question: 'If CAT is coded as DBU, how is DOG coded?',
        options: ['EPI', 'EPH', 'EOG', 'FQH'],
        correctAnswer: 'EPH',
      },
      {
        id: 'reasoning-m3',
        subject: 'Reasoning',
        difficulty: 'medium',
        topic: 'Blood Relation',
        question: 'Pointing to a boy, a woman said, "He is the son of my father." Who is the boy to the woman?',
        options: ['Brother', 'Son', 'Cousin', 'Nephew'],
        correctAnswer: 'Brother',
      },
      {
        id: 'reasoning-m4',
        subject: 'Reasoning',
        difficulty: 'medium',
        topic: 'Direction',
        question: 'A person faces east, turns left, then right. Which direction is he facing now?',
        options: ['North', 'South', 'East', 'West'],
        correctAnswer: 'East',
      },
      {
        id: 'reasoning-m5',
        subject: 'Reasoning',
        difficulty: 'medium',
        topic: 'Series',
        question: 'Find the missing number: 2, 6, 12, 20, __',
        options: ['28', '30', '32', '34'],
        correctAnswer: '30',
      },
    ],
    hard: [
      {
        id: 'reasoning-h1',
        subject: 'Reasoning',
        difficulty: 'hard',
        topic: 'Puzzles',
        question: 'If all roses are flowers and some flowers fade quickly, which statement is always true?',
        options: [
          'All roses fade quickly',
          'Some roses may fade quickly',
          'No roses are flowers',
          'All flowers are roses',
        ],
        correctAnswer: 'Some roses may fade quickly',
      },
      {
        id: 'reasoning-h2',
        subject: 'Reasoning',
        difficulty: 'hard',
        topic: 'Syllogism',
        question: 'Statements: Some pens are books. All books are papers. Conclusion: Some pens are papers.',
        options: ['True', 'False', 'Cannot be determined', 'None of these'],
        correctAnswer: 'Cannot be determined',
      },
      {
        id: 'reasoning-h3',
        subject: 'Reasoning',
        difficulty: 'hard',
        topic: 'Puzzles',
        question: 'If five friends sit in a row and A is to the left of B, who is to the right of A?',
        options: ['B', 'C', 'D', 'Cannot be determined'],
        correctAnswer: 'B',
      },
      {
        id: 'reasoning-h4',
        subject: 'Reasoning',
        difficulty: 'hard',
        topic: 'Coding-Decoding',
        question: 'If PEN is coded as QFO, how is CAT coded?',
        options: ['DBU', 'DAU', 'CBT', 'DBV'],
        correctAnswer: 'DBU',
      },
      {
        id: 'reasoning-h5',
        subject: 'Reasoning',
        difficulty: 'hard',
        topic: 'Syllogism',
        question: 'All teachers are educated. Some educated people are athletes. Conclusion: Some teachers are athletes.',
        options: ['True', 'False', 'Cannot be determined', 'None of these'],
        correctAnswer: 'Cannot be determined',
      },
    ],
  },
  gk: {
    easy: [
      {
        id: 'gk-e1',
        subject: 'General Knowledge',
        difficulty: 'easy',
        topic: 'India',
        question: 'What is the capital of India?',
        options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
        correctAnswer: 'New Delhi',
      },
      {
        id: 'gk-e2',
        subject: 'General Knowledge',
        difficulty: 'easy',
        topic: 'Current Affairs',
        question: 'Which day is celebrated as Independence Day in India?',
        options: ['15 August', '26 January', '2 October', '14 November'],
        correctAnswer: '15 August',
      },
      {
        id: 'gk-e3',
        subject: 'General Knowledge',
        difficulty: 'easy',
        topic: 'India',
        question: 'Which city is known as the Pink City?',
        options: ['Jaipur', 'Agra', 'Delhi', 'Pune'],
        correctAnswer: 'Jaipur',
      },
      {
        id: 'gk-e4',
        subject: 'General Knowledge',
        difficulty: 'easy',
        topic: 'Sports',
        question: 'How many players are there in a cricket team on the field?',
        options: ['9', '10', '11', '12'],
        correctAnswer: '11',
      },
      {
        id: 'gk-e5',
        subject: 'General Knowledge',
        difficulty: 'easy',
        topic: 'Current Affairs',
        question: 'Which organ in the body pumps blood?',
        options: ['Lungs', 'Brain', 'Heart', 'Liver'],
        correctAnswer: 'Heart',
      },
    ],
    medium: [
      {
        id: 'gk-m1',
        subject: 'General Knowledge',
        difficulty: 'medium',
        topic: 'Geography',
        question: 'The longest river in India is:',
        options: ['Yamuna', 'Godavari', 'Ganga', 'Narmada'],
        correctAnswer: 'Ganga',
      },
      {
        id: 'gk-m2',
        subject: 'General Knowledge',
        difficulty: 'medium',
        topic: 'Polity',
        question: 'How many Lok Sabha seats are there in India?',
        options: ['543', '545', '552', '560'],
        correctAnswer: '543',
      },
      {
        id: 'gk-m3',
        subject: 'General Knowledge',
        difficulty: 'medium',
        topic: 'History',
        question: 'Who was the first Prime Minister of India?',
        options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'B. R. Ambedkar'],
        correctAnswer: 'Jawaharlal Nehru',
      },
      {
        id: 'gk-m4',
        subject: 'General Knowledge',
        difficulty: 'medium',
        topic: 'Science',
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
      },
      {
        id: 'gk-m5',
        subject: 'General Knowledge',
        difficulty: 'medium',
        topic: 'Awards',
        question: 'The Nobel Prize is awarded for outstanding achievements in:',
        options: ['Science, literature, and peace', 'Sports only', 'Politics only', 'Music only'],
        correctAnswer: 'Science, literature, and peace',
      },
    ],
    hard: [
      {
        id: 'gk-h1',
        subject: 'General Knowledge',
        difficulty: 'hard',
        topic: 'Awards',
        question: 'The Bharat Ratna is India’s highest:',
        options: ['Military award', 'Civilian award', 'Sports award', 'Literary award'],
        correctAnswer: 'Civilian award',
      },
      {
        id: 'gk-h2',
        subject: 'General Knowledge',
        difficulty: 'hard',
        topic: 'Economy',
        question: 'Which organization regulates monetary policy in India?',
        options: ['SEBI', 'RBI', 'NITI Aayog', 'IRDAI'],
        correctAnswer: 'RBI',
      },
      {
        id: 'gk-h3',
        subject: 'General Knowledge',
        difficulty: 'hard',
        topic: 'History',
        question: 'The Indian National Congress was founded in which year?',
        options: ['1857', '1885', '1905', '1947'],
        correctAnswer: '1885',
      },
      {
        id: 'gk-h4',
        subject: 'General Knowledge',
        difficulty: 'hard',
        topic: 'Geography',
        question: 'The Tropic of Cancer passes through how many states in India?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '8',
      },
      {
        id: 'gk-h5',
        subject: 'General Knowledge',
        difficulty: 'hard',
        topic: 'Current Affairs',
        question: 'Which city hosted the G20 Summit in India in 2023?',
        options: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'],
        correctAnswer: 'Delhi',
      },
    ],
  },
};

export const subjectOptions = [
  { key: 'maths', label: 'Maths', accent: 'from-blue-600 to-cyan-500' },
  { key: 'science', label: 'Science', accent: 'from-indigo-600 to-blue-500' },
  { key: 'english', label: 'English', accent: 'from-cyan-600 to-teal-500' },
  { key: 'reasoning', label: 'Reasoning', accent: 'from-violet-600 to-indigo-500' },
  { key: 'gk', label: 'General Knowledge', accent: 'from-sky-600 to-blue-500' },
];

export const difficultyOptions = [
  { key: 'easy', label: 'Easy', note: 'Warm-up practice' },
  { key: 'medium', label: 'Medium', note: 'Balanced challenge' },
  { key: 'hard', label: 'Hard', note: 'Exam pressure mode' },
];

export function getQuestions(subject, difficulty) {
  const subjectKey = normalizeSubjectKey(subject);
  const difficultyKey = normalizeDifficultyKey(difficulty);
  const bucket = normalizedQuestionBank[subjectKey];
  if (!bucket) return [];
  return bucket[difficultyKey] ?? [];
}

export function normalizeSubjectKey(subject) {
  const raw = String(subject || '').trim().toLowerCase();
  const map = {
    maths: 'maths',
    math: 'maths',
    mathematics: 'maths',
    science: 'science',
    english: 'english',
    reasoning: 'reasoning',
    gk: 'gk',
    'general knowledge': 'gk',
    generalknowledge: 'gk',
  };
  return map[raw] || raw;
}

export function normalizeDifficultyKey(difficulty) {
  return String(difficulty || '').trim().toLowerCase();
}

function normalizeQuestion(question, subjectKey, difficultyKey, index) {
  if (!question || typeof question !== 'object') {
    return {
      id: `${subjectKey}-${difficultyKey}-${index + 1}`,
      subject: subjectKey,
      difficulty: difficultyKey,
      topic: 'General',
      question: 'Question unavailable',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      explanation: 'This question is a safe fallback.',
      type: 'mcq',
      tags: [],
    };
  }

  return {
    ...question,
    id: question.id || `${subjectKey}-${difficultyKey}-${index + 1}`,
    subject: question.subject || subjectKey,
    difficulty: question.difficulty || difficultyKey,
    topic: question.topic || 'General',
    question: question.question || 'Question unavailable',
    options: Array.isArray(question.options) ? question.options : ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: question.correctAnswer || (Array.isArray(question.options) ? question.options[0] : 'Option A'),
    explanation: question.explanation || 'Review the concept and compare the options carefully.',
    type: question.type || 'mcq',
    tags: Array.isArray(question.tags) ? question.tags : [],
  };
}

function mergeQuestionBanks(base, extras) {
  const merged = {};
  const subjects = new Set([...Object.keys(base || {}), ...Object.keys(extras || {})]);

  subjects.forEach((subjectKey) => {
    merged[subjectKey] = {};
    const difficulties = new Set([
      ...Object.keys(base?.[subjectKey] || {}),
      ...Object.keys(extras?.[subjectKey] || {}),
    ]);
    difficulties.forEach((difficultyKey) => {
      const baseQuestions = (base?.[subjectKey]?.[difficultyKey] || []).map((question, index) =>
        normalizeQuestion(question, subjectKey, difficultyKey, index),
      );
      const extraQuestions = (extras?.[subjectKey]?.[difficultyKey] || []).map((question, index) =>
        normalizeQuestion(question, subjectKey, difficultyKey, baseQuestions.length + index),
      );
      merged[subjectKey][difficultyKey] = [...baseQuestions, ...extraQuestions];
    });
  });

  return merged;
}

export const normalizedQuestionBank = mergeQuestionBanks(testQuestions, questionExtras);

export function getAllQuestionsForSubject(subject) {
  const subjectKey = normalizeSubjectKey(subject);
  return Object.values(normalizedQuestionBank[subjectKey] || {}).flat();
}

export function getQuestionCountsBySubject() {
  return Object.fromEntries(
    Object.entries(normalizedQuestionBank).map(([subject, bucket]) => [
      subject,
      Object.values(bucket).reduce((sum, list) => sum + list.length, 0),
    ]),
  );
}
