const HINDI_DICTIONARY = {
  Maths: 'गणित',
  Science: 'विज्ञान',
  English: 'अंग्रेजी',
  Reasoning: 'रीजनिंग',
  'General Knowledge': 'सामान्य ज्ञान',
  Algebra: 'बीजगणित',
  Percentages: 'प्रतिशत',
  Arithmetic: 'अंकगणित',
  Fractions: 'भिन्न',
  'Time and Work': 'समय और कार्य',
  Geometry: 'ज्यामिति',
  'Number System': 'संख्या पद्धति',
  Statistics: 'सांख्यिकी',
  'Profit and Loss': 'लाभ और हानि',
  'Quadratic Equations': 'द्विघात समीकरण',
  Trigonometry: 'त्रिकोणमिति',
  Mensuration: 'क्षेत्रमिति',
  Sequences: 'अनुक्रम',
  Physics: 'भौतिकी',
  Chemistry: 'रसायन विज्ञान',
  Biology: 'जीव विज्ञान',
  Gravity: 'गुरुत्वाकर्षण',
  Photosynthesis: 'प्रकाश संश्लेषण',
  Mitochondria: 'माइटोकॉन्ड्रिया',
  Grammar: 'व्याकरण',
  Vocabulary: 'शब्दावली',
  Comprehension: 'बोधगम्यता',
  Series: 'श्रृंखला',
  Analogy: 'समानता',
  Direction: 'दिशा',
  Puzzles: 'पहेलियां',
  Syllogism: 'न्याय-वाक्य',
  India: 'भारत',
  Geography: 'भूगोल',
  History: 'इतिहास',
  Polity: 'राजव्यवस्था',
  Economy: 'अर्थव्यवस्था',
  Awards: 'पुरस्कार',
  'Current Affairs': 'समसामयिक घटनाएं',
};

const HINDI_QUESTION_OVERRIDES = {
  'maths-e1': {
    question: 'यदि x + 7 = 19 है, तो x का मान क्या होगा?',
    options: ['10', '11', '12', '13'],
  },
  'maths-e2': {
    question: '80 का 25% कितना है?',
    options: ['15', '20', '25', '30'],
  },
  'maths-h2': {
    question: 'sin 30° का मान क्या है?',
    options: ['1/2', '1', '√2/2', '√3/2'],
  },
  'science-e1': {
    question: 'कौन-सा बल वस्तुओं को पृथ्वी की ओर खींचता है?',
    options: ['चुंबकत्व', 'गुरुत्वाकर्षण', 'घर्षण', 'तनाव'],
    optionMap: { चुंबकत्व: 'Magnetism', गुरुत्वाकर्षण: 'Gravity', घर्षण: 'Friction', तनाव: 'Tension' },
  },
  'science-m1': {
    question: 'पौधे जिस प्रक्रिया से भोजन बनाते हैं, उसे क्या कहते हैं?',
    options: ['श्वसन', 'वाष्पोत्सर्जन', 'प्रकाश संश्लेषण', 'पाचन'],
    optionMap: {
      श्वसन: 'Respiration',
      वाष्पोत्सर्जन: 'Transpiration',
      'प्रकाश संश्लेषण': 'Photosynthesis',
      पाचन: 'Digestion',
    },
  },
  'gk-e1': {
    question: 'भारत की राजधानी क्या है?',
    options: ['मुंबई', 'नई दिल्ली', 'कोलकाता', 'चेन्नई'],
    optionMap: { मुंबई: 'Mumbai', 'नई दिल्ली': 'New Delhi', कोलकाता: 'Kolkata', चेन्नई: 'Chennai' },
  },
};

export const supportedTestLanguages = [
  { key: 'en', label: 'English', shortLabel: 'EN' },
  { key: 'hi', label: 'Hindi', shortLabel: 'हिंदी' },
  { key: 'hinglish', label: 'Hinglish', shortLabel: 'Hinglish' },
  { key: 'mr', label: 'Marathi', shortLabel: 'मराठी' },
  { key: 'ta', label: 'Tamil', shortLabel: 'தமிழ்' },
  { key: 'bn', label: 'Bengali', shortLabel: 'বাংলা' },
];

function translateToken(value, language) {
  if (language !== 'hi') return value;
  return HINDI_DICTIONARY[value] || value;
}

export function getTranslatedQuestion(question, language = 'en') {
  if (!question || language === 'en') return question;

  if (language === 'hi') {
    const override = HINDI_QUESTION_OVERRIDES[question.id];
    return {
      ...question,
      subject: translateToken(question.subject, language),
      topic: translateToken(question.topic, language),
      question: override?.question || `[हिंदी अनुवाद] ${question.question}`,
      options: override?.options || question.options,
      optionMap: override?.optionMap || null,
    };
  }

  const languageLabel = supportedTestLanguages.find((item) => item.key === language)?.label || 'Selected language';
  return {
    ...question,
    question: `[${languageLabel} AI preview] ${question.question}`,
    aiTranslationPending: true,
  };
}

export function toCanonicalAnswer(question, displayedAnswer) {
  if (!question?.optionMap) return displayedAnswer;
  return question.optionMap[displayedAnswer] || displayedAnswer;
}

export function fromCanonicalAnswer(question, canonicalAnswer) {
  if (!question?.optionMap) return canonicalAnswer;
  const match = Object.entries(question.optionMap).find(([, value]) => value === canonicalAnswer);
  return match?.[0] || canonicalAnswer;
}

export function formatDuration(seconds = 0) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  if (minutes <= 0) return `${remainder}s`;
  return `${minutes}m ${String(remainder).padStart(2, '0')}s`;
}

export function getAttemptInsights(attempt = {}) {
  const total = Number(attempt.total || attempt.questionCount || attempt.questions?.length || 0);
  const percentage = Number(attempt.percentage || 0);
  const attempted = Number(attempt.attempted || 0);
  const wrong = Number(attempt.wrong || 0);
  const timeSpentSeconds = Number(attempt.timeSpentSeconds || Math.max(0, total * 60 - Number(attempt.remainingSeconds || 0)));
  const accuracy = attempted ? Math.round((Number(attempt.correct || 0) / attempted) * 100) : 0;
  const avgTime = attempted ? Math.round(timeSpentSeconds / attempted) : 0;
  const percentile = Math.min(99, Math.max(35, Math.round(percentage * 0.72 + attempted * 1.6 - wrong * 1.8 + 24)));
  const readiness = Math.min(100, Math.max(12, Math.round(percentage * 0.68 + accuracy * 0.22 + (avgTime <= 55 ? 10 : 4))));
  const attemptQuality =
    percentage >= 80 ? 'Topper rhythm' : percentage >= 60 ? 'Strong attempt' : percentage >= 40 ? 'Patchy but recoverable' : 'Concept reset needed';
  const speedAnalysis =
    avgTime <= 40 ? 'Fast pace. Review silly mistakes before speeding up further.' : avgTime <= 70 ? 'Balanced pace. Keep this rhythm in mocks.' : 'Slow pace. Use timed topic drills.';

  return {
    accuracy,
    percentile,
    readiness,
    attemptQuality,
    speedAnalysis,
    timeSpentSeconds,
    avgTime,
    predictedAir: Math.max(450, Math.round(120000 - percentile * 1030 - readiness * 95)),
  };
}

export function classifyMistake(question, selectedAnswer, index = 0, avgTime = 0) {
  if (!selectedAnswer || selectedAnswer === question?.correctAnswer) return null;
  const topic = question?.topic || '';
  if (avgTime > 70) return 'Time pressure';
  if (/formula|trigonometry|mensuration|physics|chemistry/i.test(topic)) return 'Formula confusion';
  if (/arithmetic|percent|number|profit|calculation/i.test(topic)) return 'Calculation mistake';
  if (index % 3 === 0) return 'Conceptual mistake';
  return 'Silly mistake';
}

export function buildWeakTopicPlan(topic) {
  return {
    topic,
    quickNotes: [
      `Revise the core definition and 2 solved examples from ${topic}.`,
      'Write the formula or rule once before attempting practice.',
      'Compare every wrong option with the correct one to catch the trap.',
    ],
    videos: [`${topic} one-shot revision`, `${topic} PYQ shortcut method`],
    doubts: [`Ask: Why did my chosen option fail in ${topic}?`],
    practice: ['10 easy questions', '10 timed mixed questions', '1 mini mock after revision'],
  };
}

export function getRankSnapshot(percentile = 50) {
  const base = Math.max(1, 100 - percentile);
  return [
    { label: 'Class Rank', value: `#${Math.max(1, Math.round(base / 4))}` },
    { label: 'School Rank', value: `#${Math.max(2, Math.round(base / 2))}` },
    { label: 'District Rank', value: `#${Math.max(8, Math.round(base * 7))}` },
    { label: 'State Rank', value: `#${Math.max(45, Math.round(base * 42))}` },
    { label: 'India Rank', value: `#${Math.max(380, Math.round(base * 410))}` },
  ];
}
