const FALLBACK_SUBJECT_SLUG = 'science';
const DEFAULT_VIDEO_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
const BUSINESS_MARKET_LEARNING_SLUG = 'business-market-learning';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeSubjectSlug(subjectSlug) {
  const normalized = slugify(subjectSlug);
  const aliases = {
    'class-6-science': 'science',
    'class-6-maths': 'maths',
    'class-6-english': 'english',
    'class-6-sst': 'sst',
    'social-science': 'sst',
    'social-studies': 'sst',
  };

  if (aliases[normalized]) return aliases[normalized];
  if (/^class-\d+-/.test(normalized)) {
    return normalized.replace(/^class-\d+-/, '');
  }
  return normalized || FALLBACK_SUBJECT_SLUG;
}

function buildChapter(subject, chapter, index) {
  const progress = Math.max(0, Math.min(100, Number(chapter.progress || 0)));
  const status = chapter.status || (progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started');

  return {
    subjectSlug: subject.slug,
    subjectName: subject.name,
    chapterNumber: chapter.chapterNumber || index + 1,
    title: chapter.title,
    slug: chapter.slug || slugify(chapter.title),
    description: chapter.description,
    estimatedDuration: chapter.estimatedDuration || chapter.duration || '08 min',
    videoUrl: chapter.videoUrl || DEFAULT_VIDEO_URL,
    thumbnail: chapter.thumbnail || null,
    level: chapter.level || 'Core',
    contentLanguage: chapter.contentLanguage || 'English',
    icon: chapter.icon || 'book-open',
    quizFocus: chapter.quizFocus || 'Chapter quiz',
    progress,
    status,
    legacySlugs: chapter.legacySlugs || [],
    objectives: chapter.objectives || [],
    notes:
      chapter.notes || {
        summaryPoints: [
          `${chapter.title} builds a simple understanding of the topic.`,
          'Video, notes and practice stay in one short learning flow.',
          'Use the quick revision box to revisit the main idea fast.',
        ],
        keyTerms: [
          { term: 'Core idea', meaning: `The most important point in ${chapter.title}.` },
          { term: 'Example', meaning: 'A familiar case that makes the idea easier to remember.' },
          { term: 'Revision', meaning: 'A quick review before moving on to practice.' },
        ],
        examples: [
          `${subject.name} example`,
          `${chapter.title} example`,
          'Classroom example',
        ],
        revisionBox: 'Read the bullets, notice the key terms, and then try the questions.',
      },
    practiceQuestions:
      chapter.practiceQuestions || [
        {
          id: `${subject.slug}-${index + 1}-p1`,
          question: `What is the main idea of "${chapter.title}"?`,
          options: [
            'Understand the chapter step by step',
            'Skip the video',
            'Jump straight to the test',
            'Ignore the notes',
          ],
          correctAnswer: 'Understand the chapter step by step',
          explanation: 'A good chapter flow starts with the video and moves forward one step at a time.',
        },
        {
          id: `${subject.slug}-${index + 1}-p2`,
          question: 'What should a student do after the video?',
          options: ['Read notes', 'Close the app', 'Skip practice', 'Move backwards'],
          correctAnswer: 'Read notes',
          explanation: 'Notes help the student quickly review the lesson after watching the video.',
        },
        {
          id: `${subject.slug}-${index + 1}-p3`,
          question: 'Which section gives quick revision support?',
          options: ['Notes', 'Navbar', 'Footer', 'Login page'],
          correctAnswer: 'Notes',
          explanation: 'Notes summarize the lesson and are useful for fast revision.',
        },
        {
          id: `${subject.slug}-${index + 1}-p4`,
          question: 'Which action comes before the chapter test?',
          options: ['Practice and DPP', 'Homepage visit', 'Logout', 'Profile update'],
          correctAnswer: 'Practice and DPP',
          explanation: 'Practice and DPP build confidence before the test.',
        },
        {
          id: `${subject.slug}-${index + 1}-p5`,
          question: 'What should the student ask if something is unclear?',
          options: ['AI doubt box', 'Footer link', 'Browser refresh', 'Skip the topic'],
          correctAnswer: 'AI doubt box',
          explanation: 'The doubt box is where the learner can ask a quick question.',
        },
      ],
    dppQuestions:
      chapter.dppQuestions || [
        {
          id: `${subject.slug}-${index + 1}-d1`,
          question: `Which part of the lesson should be reviewed first in "${chapter.title}"?`,
          options: ['Video summary', 'Random topic', 'Only the test score', 'The footer'],
          correctAnswer: 'Video summary',
          explanation: 'A short summary helps the learner reconnect with the lesson quickly.',
        },
        {
          id: `${subject.slug}-${index + 1}-d2`,
          question: 'Which learning step makes the chapter stick better?',
          options: ['Notes and practice', 'Ignoring the lesson', 'Leaving early', 'Opening settings'],
          correctAnswer: 'Notes and practice',
          explanation: 'Practice after notes improves recall and confidence.',
        },
        {
          id: `${subject.slug}-${index + 1}-d3`,
          question: 'What is the best reason to take the DPP?',
          options: ['To check understanding', 'To change the theme', 'To skip reading', 'To close the page'],
          correctAnswer: 'To check understanding',
          explanation: 'DPP checks if the student can apply the chapter ideas.',
        },
        {
          id: `${subject.slug}-${index + 1}-d4`,
          question: 'Which action helps before the chapter test?',
          options: ['Review weak points', 'Ignore explanations', 'Leave questions blank', 'Close the video'],
          correctAnswer: 'Review weak points',
          explanation: 'Reviewing weak points helps the student improve before the test.',
        },
        {
          id: `${subject.slug}-${index + 1}-d5`,
          question: 'What should the learner do when stuck?',
          options: ['Ask a doubt', 'Skip the page', 'Refresh the route', 'Start over elsewhere'],
          correctAnswer: 'Ask a doubt',
          explanation: 'Asking a doubt is the fastest way to move forward when stuck.',
        },
      ],
    testQuestions:
      chapter.testQuestions || [
        {
          id: `${subject.slug}-${index + 1}-t1`,
          question: `Which step helps most after watching "${chapter.title}"?`,
          options: ['Read notes', 'Close the tab', 'Skip practice', 'Leave the chapter'],
          correctAnswer: 'Read notes',
          explanation: 'Notes help the learner review the main ideas immediately after the video.',
        },
        {
          id: `${subject.slug}-${index + 1}-t2`,
          question: 'What should the student do after notes?',
          options: ['Practice questions', 'Ignore the lesson', 'Change the subject', 'Refresh the page'],
          correctAnswer: 'Practice questions',
          explanation: 'Practice helps check understanding and strengthen recall.',
        },
        {
          id: `${subject.slug}-${index + 1}-t3`,
          question: 'What is the purpose of DPP?',
          options: ['Daily practice and checking understanding', 'Changing the board', 'Skipping revision', 'Watching another homepage video'],
          correctAnswer: 'Daily practice and checking understanding',
          explanation: 'DPP gives a short practice set to check understanding before the test.',
        },
        {
          id: `${subject.slug}-${index + 1}-t4`,
          question: 'What should a learner do if a concept is unclear?',
          options: ['Ask a doubt', 'Skip the chapter', 'Close the app', 'Ignore the answer'],
          correctAnswer: 'Ask a doubt',
          explanation: 'The doubt box is meant for quick help when something is unclear.',
        },
        {
          id: `${subject.slug}-${index + 1}-t5`,
          question: 'When should the chapter test be taken?',
          options: ['After video, notes, practice and DPP', 'Before the video', 'Before notes', 'Only after logout'],
          correctAnswer: 'After video, notes, practice and DPP',
          explanation: 'The test comes at the end of the learning flow.',
        },
      ],
    nextChapterSlug: chapter.nextChapterSlug || null,
  };
}

function buildSubject(subject) {
  const chapters = subject.chapters.map((chapter, index) => buildChapter(subject, chapter, index));
  chapters.forEach((chapter, index) => {
    if (!chapter.nextChapterSlug) {
      chapter.nextChapterSlug = chapters[index + 1]?.slug || null;
    }
  });
  const completedChapters = chapters.filter((chapter) => chapter.progress >= 100).length;
  const currentChapter =
    chapters.find((chapter) => chapter.status === 'in-progress') ||
    chapters.find((chapter) => chapter.progress < 100) ||
    chapters[0] ||
    null;

  return {
    ...subject,
    chapters,
    totalChapters: chapters.length,
    completedChapters,
    progressPercent: chapters.length ? Math.round((completedChapters / chapters.length) * 100) : 0,
    currentChapter,
    recommendedChapter: currentChapter,
  };
}

const subjectDefinitions = [
  {
    slug: 'science',
    legacySlugs: ['class-6-science'],
    name: 'Science',
    classLevel: 'Class 6',
    board: 'CBSE',
    description: 'Story-based lessons, notes, practice and chapter tests.',
    subtitle: 'Story-based lessons, notes, practice and chapter tests',
    chapters: [
      {
        title: 'Food: Where Does It Come From?',
        slug: 'food-where-does-it-come-from',
        legacySlugs: ['food-and-nutrition'],
        description: 'Start with familiar meals, ingredients and the idea of where food actually begins.',
        estimatedDuration: '08 min',
        videoUrl: DEFAULT_VIDEO_URL,
        progress: 100,
        objectives: [
          'Understand common sources of food',
          'Differentiate plant and animal foods',
          'Connect food sources with everyday meals',
        ],
        notes: {
          summaryPoints: [
            'Food comes from plants, animals and other natural sources.',
            'Some foods are eaten raw and some need cooking or processing.',
            'Knowing food sources helps students make simple healthy choices.',
          ],
          keyTerms: [
            { term: 'Source', meaning: 'Where food comes from.' },
            { term: 'Plant food', meaning: 'Food that grows from plants.' },
            { term: 'Animal food', meaning: 'Food that comes from animals.' },
          ],
          examples: ['Rice', 'Milk', 'Egg', 'Fruit'],
          revisionBox: 'Remember the source first, then the food type, then the meal example.',
        },
        practiceQuestions: [
          {
            id: 'science-food-p1',
            question: 'Which of these comes from a plant?',
            options: ['Rice', 'Milk', 'Egg', 'Butter'],
            correctAnswer: 'Rice',
            explanation: 'Rice is a plant-based food grain.',
          },
          {
            id: 'science-food-p2',
            question: 'Milk is mainly obtained from:',
            options: ['Animals', 'Rocks', 'Plastic', 'Paper'],
            correctAnswer: 'Animals',
            explanation: 'Milk comes from animals such as cows and buffaloes.',
          },
          {
            id: 'science-food-p3',
            question: 'Which one is a fruit?',
            options: ['Apple', 'Salt', 'Water', 'Oil'],
            correctAnswer: 'Apple',
            explanation: 'Apple grows on a plant and is eaten as a fruit.',
          },
          {
            id: 'science-food-p4',
            question: 'Which food is usually made from grains?',
            options: ['Bread', 'Juice', 'Honey', 'Curd'],
            correctAnswer: 'Bread',
            explanation: 'Bread is made from grain flour such as wheat flour.',
          },
          {
            id: 'science-food-p5',
            question: 'What should we learn first in this chapter?',
            options: ['Food sources', 'Traffic rules', 'Game scores', 'Weather maps'],
            correctAnswer: 'Food sources',
            explanation: 'The chapter starts by showing where food comes from.',
          },
        ],
        dppQuestions: [
          {
            id: 'science-food-d1',
            question: 'Which of these is a plant product?',
            options: ['Wheat', 'Egg', 'Milk', 'Fish'],
            correctAnswer: 'Wheat',
            explanation: 'Wheat grows on plants and is a plant product.',
          },
          {
            id: 'science-food-d2',
            question: 'Which food comes from animals?',
            options: ['Milk', 'Apple', 'Rice', 'Potato'],
            correctAnswer: 'Milk',
            explanation: 'Milk is obtained from animals.',
          },
          {
            id: 'science-food-d3',
            question: 'A cereal is usually made from:',
            options: ['Grains', 'Stones', 'Clay', 'Glass'],
            correctAnswer: 'Grains',
            explanation: 'Cereals are grain-based foods.',
          },
          {
            id: 'science-food-d4',
            question: 'Which item is commonly eaten raw?',
            options: ['Apple', 'Brick', 'Spoon', 'Cup'],
            correctAnswer: 'Apple',
            explanation: 'An apple is commonly eaten raw as a fruit.',
          },
          {
            id: 'science-food-d5',
            question: 'Why is food source important?',
            options: ['It helps us know what we eat', 'It changes the board', 'It removes learning', 'It updates the footer'],
            correctAnswer: 'It helps us know what we eat',
            explanation: 'Knowing the source helps students understand and choose food better.',
          },
        ],
        testQuestions: [
          {
            id: 'science-food-t1',
            question: 'Which food is a plant product?',
            options: ['Wheat', 'Milk', 'Egg', 'Butter'],
            correctAnswer: 'Wheat',
            explanation: 'Wheat comes from plants.',
          },
          {
            id: 'science-food-t2',
            question: 'Milk is obtained from:',
            options: ['Animals', 'Rocks', 'Plastic', 'Soil'],
            correctAnswer: 'Animals',
            explanation: 'Milk is an animal-based food.',
          },
          {
            id: 'science-food-t3',
            question: 'What should a student read after the video?',
            options: ['Notes', 'Advertisement', 'Footer', 'Navbar'],
            correctAnswer: 'Notes',
            explanation: 'Notes help revise the lesson quickly.',
          },
          {
            id: 'science-food-t4',
            question: 'Why do we do practice questions?',
            options: ['To check understanding', 'To change the board', 'To leave the page', 'To reduce learning'],
            correctAnswer: 'To check understanding',
            explanation: 'Practice checks whether the chapter is understood.',
          },
          {
            id: 'science-food-t5',
            question: 'What comes at the end of the chapter flow?',
            options: ['Test', 'Homepage', 'Logout', 'Footer'],
            correctAnswer: 'Test',
            explanation: 'The chapter test is the final step in this flow.',
          },
        ],
      },
      {
        title: 'Components of Food',
        slug: 'components-of-food',
        description: 'Break food into nutrients, balanced meals and simple examples from the kitchen.',
        estimatedDuration: '10 min',
        progress: 68,
      },
      {
        title: 'Fibre to Fabric',
        slug: 'fibre-to-fabric',
        description: 'Follow the journey from raw fibres to the clothes we wear every day.',
        estimatedDuration: '09 min',
        progress: 0,
      },
      {
        title: 'Sorting Materials Into Groups',
        slug: 'sorting-materials-into-groups',
        description: 'Compare objects by shape, texture, transparency and use.',
        estimatedDuration: '08 min',
        progress: 0,
      },
      {
        title: 'Separation of Substances',
        slug: 'separation-of-substances',
        description: 'Use everyday methods like handpicking, sieving and filtering to separate mixtures.',
        estimatedDuration: '09 min',
        progress: 0,
      },
    ],
  },
  {
    slug: 'maths',
    legacySlugs: ['class-6-maths'],
    name: 'Maths',
    classLevel: 'Class 6',
    board: 'CBSE',
    description: 'Number sense, problem solving, practice and chapter tests.',
    subtitle: 'Number sense, problem solving, practice and chapter tests',
    chapters: [
      {
        title: 'Number System Basics',
        slug: 'number-system-basics',
        description: 'Understand place value, ordering and how numbers behave in real life.',
        estimatedDuration: '08 min',
        progress: 100,
      },
      {
        title: 'Addition and Subtraction',
        slug: 'addition-and-subtraction',
        description: 'Build speed and accuracy with everyday arithmetic practice.',
        estimatedDuration: '09 min',
        progress: 52,
      },
      {
        title: 'Multiplication Basics',
        slug: 'multiplication-basics',
        description: 'Move from repeated addition to confident multiplication tables and patterns.',
        estimatedDuration: '10 min',
        progress: 0,
      },
      {
        title: 'Fractions and Sharing',
        slug: 'fractions-and-sharing',
        description: 'Learn how parts of a whole work in simple visual examples.',
        estimatedDuration: '09 min',
        progress: 0,
      },
      {
        title: 'Shapes and Angles',
        slug: 'shapes-and-angles',
        description: 'Recognize shapes, lines and angles in school and at home.',
        estimatedDuration: '08 min',
        progress: 0,
      },
    ],
  },
  {
    slug: 'english',
    legacySlugs: ['class-6-english'],
    name: 'English',
    classLevel: 'Class 6',
    board: 'CBSE',
    description: 'Reading, grammar, vocabulary and short writing practice.',
    subtitle: 'Reading, grammar, vocabulary and short writing practice',
    chapters: [
      {
        title: 'Reading a Story for Meaning',
        slug: 'reading-a-story-for-meaning',
        description: 'Read a short story and identify the main idea, characters and message.',
        estimatedDuration: '08 min',
        progress: 100,
      },
      {
        title: 'Grammar Basics',
        slug: 'grammar-basics',
        description: 'Focus on nouns, verbs and sentence building with friendly examples.',
        estimatedDuration: '09 min',
        progress: 45,
      },
      {
        title: 'Vocabulary in Context',
        slug: 'vocabulary-in-context',
        description: 'Learn new words by seeing them in real sentences and short passages.',
        estimatedDuration: '08 min',
        progress: 0,
      },
      {
        title: 'Writing Short Answers',
        slug: 'writing-short-answers',
        description: 'Practice clear, complete answers in a simple exam format.',
        estimatedDuration: '09 min',
        progress: 0,
      },
      {
        title: 'Comprehension Practice',
        slug: 'comprehension-practice',
        description: 'Use reading passages to build confidence and accuracy.',
        estimatedDuration: '10 min',
        progress: 0,
      },
    ],
  },
  {
    slug: 'sst',
    legacySlugs: ['social-science', 'social-studies'],
    name: 'SST',
    classLevel: 'Class 6',
    board: 'CBSE',
    description: 'People, places, maps and civic understanding in a simple learning path.',
    subtitle: 'People, places, maps and civic understanding in a simple learning path',
    chapters: [
      {
        title: 'Our Family and Community',
        slug: 'our-family-and-community',
        description: 'See how families, communities and simple roles connect in daily life.',
        estimatedDuration: '08 min',
        progress: 100,
      },
      {
        title: 'Maps, Directions and Places',
        slug: 'maps-directions-and-places',
        description: 'Use directions, symbols and map basics to navigate familiar spaces.',
        estimatedDuration: '09 min',
        progress: 58,
      },
      {
        title: 'India and Its Diversity',
        slug: 'india-and-its-diversity',
        description: 'Explore languages, regions and the rich variety of our country.',
        estimatedDuration: '10 min',
        progress: 0,
      },
      {
        title: 'Weather and Climate',
        slug: 'weather-and-climate',
        description: 'Understand how weather changes and why climate stays more stable.',
        estimatedDuration: '09 min',
        progress: 0,
      },
      {
        title: 'Transport and Communication',
        slug: 'transport-and-communication',
        description: 'Learn how people, goods and messages move across places.',
        estimatedDuration: '08 min',
        progress: 0,
      },
    ],
  },
  {
    slug: BUSINESS_MARKET_LEARNING_SLUG,
    legacySlugs: ['business-market-learning', 'business-market-learn'],
    name: 'Business & Market Learning',
    classLevel: '6',
    board: 'Open Learning',
    description: 'Learn how money works in real life with beginner-friendly business, market and earning pathways.',
    subtitle: 'Learn how money works in real life',
    contentLanguage: 'English + Hinglish',
    category: 'Career Skills',
    chapters: [
      {
        title: 'Money Basics for Students',
        slug: 'money-basics-for-students',
        description: 'Understand saving, spending, income and simple money habits before anything else.',
        estimatedDuration: '07 min',
        progress: 100,
        level: 'Beginner',
        thumbnail:
          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'wallet',
        quizFocus: 'Money habits',
        objectives: [
          'Know the difference between needs and wants',
          'Understand income, expense and saving',
          'Build a safe money mindset',
        ],
        notes: {
          summaryPoints: [
            'Paisa ka flow samajhna is the first step to money confidence.',
            'Spend less than you earn and keep a simple savings habit.',
            'Small money habits matter more than fancy tricks.',
          ],
          keyTerms: [
            { term: 'Income', meaning: 'Money that comes in.' },
            { term: 'Expense', meaning: 'Money that goes out.' },
            { term: 'Saving', meaning: 'Money kept for future use.' },
          ],
          examples: ['Pocket money', 'Monthly allowance', 'Birthday gift'],
          revisionBox: 'Ask: come in, go out, or stay saved? That is the money flow.',
        },
      },
      {
        title: 'How Business Works',
        slug: 'how-business-works',
        description: 'See how businesses solve problems, create value and earn revenue in the real world.',
        estimatedDuration: '08 min',
        progress: 82,
        level: 'Beginner',
        thumbnail:
          'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'store',
        quizFocus: 'Business model basics',
        objectives: [
          'Understand customers, value and pricing',
          'Know why businesses need profit',
          'See how supply and demand connect',
        ],
      },
      {
        title: 'Introduction to Markets',
        slug: 'introduction-to-markets',
        description: 'Learn the idea of markets, buyers, sellers and how prices move in daily life.',
        estimatedDuration: '09 min',
        progress: 66,
        level: 'Beginner',
        thumbnail:
          'https://images.unsplash.com/photo-1518183214770-9cffbec72538?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'line-chart',
        quizFocus: 'Market structure',
        objectives: [
          'Understand what a market is',
          'Recognize price movement and demand',
          'Connect basic market ideas to daily life',
        ],
      },
      {
        title: 'Digital Earning Basics',
        slug: 'digital-earning-basics',
        description: 'Explore online earning ideas with a strong focus on safety, ethics and real effort.',
        estimatedDuration: '08 min',
        progress: 28,
        level: 'Beginner',
        thumbnail:
          'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'laptop',
        quizFocus: 'Safe digital earning',
        objectives: [
          'Identify legitimate online earning paths',
          'Understand why fast-money promises are risky',
          'Learn basic digital work ethics',
        ],
      },
      {
        title: 'Success Mindset',
        slug: 'success-mindset',
        description: 'Build the habits, patience and discipline needed for long-term growth.',
        estimatedDuration: '06 min',
        progress: 72,
        level: 'Beginner',
        thumbnail:
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'sparkles',
        quizFocus: 'Discipline and growth',
        objectives: [
          'Understand consistency over shortcuts',
          'Develop a growth mindset',
          'Learn to manage expectations',
        ],
      },
      {
        title: 'Stock Market Fundamentals',
        slug: 'stock-market-fundamentals',
        description: 'Learn what stocks are, why companies list shares and how market participation works.',
        estimatedDuration: '10 min',
        progress: 58,
        level: 'Intermediate',
        thumbnail:
          'https://images.unsplash.com/photo-1518546305929-5c7b2d09d1f7?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'candlestick-chart',
        quizFocus: 'Stock market basics',
        objectives: [
          'Know what shares and exchanges are',
          'Understand market participants',
          'Separate investing from gambling',
        ],
      },
      {
        title: 'Affiliate Marketing Beginner',
        slug: 'affiliate-marketing-beginner',
        description: 'Understand how referrals, commissions and audience trust work in affiliate marketing.',
        estimatedDuration: '09 min',
        progress: 44,
        level: 'Intermediate',
        thumbnail:
          'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'share-2',
        quizFocus: 'Affiliate structure',
        objectives: [
          'Learn what a referral link does',
          'Understand commission models',
          'Avoid spammy promotion habits',
        ],
      },
      {
        title: 'Dropshipping Starter Guide',
        slug: 'dropshipping-starter-guide',
        description: 'See how product sourcing, customer support and order flow work in a starter model.',
        estimatedDuration: '10 min',
        progress: 36,
        level: 'Intermediate',
        thumbnail:
          'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'package',
        quizFocus: 'Order flow',
        objectives: [
          'Understand sourcing and delivery flow',
          'Recognize margin and service risks',
          'Learn why customer experience matters',
        ],
      },
      {
        title: 'Personal Finance',
        slug: 'personal-finance',
        description: 'Learn budgeting, emergency funds, debt awareness and simple financial planning.',
        estimatedDuration: '08 min',
        progress: 61,
        level: 'Intermediate',
        thumbnail:
          'https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'piggy-bank',
        quizFocus: 'Budgeting',
        objectives: [
          'Plan income and expenses',
          'Build an emergency buffer',
          'Understand debt and interest basics',
        ],
      },
      {
        title: 'Risk Management',
        slug: 'risk-management',
        description: 'Learn how to limit losses, protect capital and make decisions with discipline.',
        estimatedDuration: '09 min',
        progress: 54,
        level: 'Intermediate',
        thumbnail:
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'shield',
        quizFocus: 'Loss control',
        objectives: [
          'Understand risk versus reward',
          'Use position sizing logic',
          'Avoid emotional decisions',
        ],
      },
      {
        title: 'Technical Analysis Basics',
        slug: 'technical-analysis-basics',
        description: 'Read charts, trends and indicators as a learning exercise, not a shortcut to profit.',
        estimatedDuration: '10 min',
        progress: 32,
        level: 'Advanced',
        thumbnail:
          'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'chart-spline',
        quizFocus: 'Chart reading',
        objectives: [
          'Spot trend direction and structure',
          'Understand support and resistance',
          'Use charts as one part of analysis',
        ],
      },
      {
        title: 'Price Action Fundamentals',
        slug: 'price-action-fundamentals',
        description: 'Explore candles, market structure and decision-making from pure price movement.',
        estimatedDuration: '09 min',
        progress: 24,
        level: 'Advanced',
        thumbnail:
          'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'activity',
        quizFocus: 'Candlestick reading',
        objectives: [
          'Read basic candles and swings',
          'Understand structure before entry ideas',
          'Avoid overcomplicating price action',
        ],
      },
      {
        title: 'Online Income Systems',
        slug: 'online-income-systems',
        description: 'See how creator systems, offers, distribution and automation combine in online businesses.',
        estimatedDuration: '10 min',
        progress: 40,
        level: 'Advanced',
        thumbnail:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'workflow',
        quizFocus: 'System thinking',
        objectives: [
          'Connect audience, offer and delivery',
          'Understand repeatable systems',
          'See why trust comes before scale',
        ],
      },
      {
        title: 'E-commerce Scaling',
        slug: 'ecommerce-scaling',
        description: 'Learn how product, operations and customer support change when a store starts growing.',
        estimatedDuration: '09 min',
        progress: 18,
        level: 'Advanced',
        thumbnail:
          'https://images.unsplash.com/photo-1556742209-9b02024ef9c6?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'shopping-cart',
        quizFocus: 'Scaling basics',
        objectives: [
          'Understand fulfillment and operations',
          'Learn why retention matters',
          'Recognize scaling risks',
        ],
      },
      {
        title: 'Passive Income Strategies',
        slug: 'passive-income-strategies',
        description: 'Learn the difference between passive income myths and real systems that take work first.',
        estimatedDuration: '08 min',
        progress: 14,
        level: 'Advanced',
        thumbnail:
          'https://images.unsplash.com/photo-1553729784-e91953dec042?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'infinity',
        quizFocus: 'Reality of passive income',
        objectives: [
          'Separate myth from reality',
          'Understand upfront effort and maintenance',
          'Learn how systems can compound slowly',
        ],
      },
      {
        title: 'Reality Check',
        slug: 'reality-check',
        description: 'Learn the red flags, scams, leverage traps and loss stories before risking money.',
        estimatedDuration: '07 min',
        progress: 100,
        level: 'Special',
        thumbnail:
          'https://images.unsplash.com/photo-1587013251376-2f6b6f8f6e0f?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'triangle-alert',
        quizFocus: 'Scam awareness',
        objectives: [
          'Identify fake promises and unrealistic returns',
          'Understand emotional traps and leverage risks',
          'Build a safety-first mindset',
        ],
      },
      {
        title: 'Psychology & Discipline',
        slug: 'psychology-and-discipline',
        description: 'Build patience, emotional control and a routine that supports long-term learning.',
        estimatedDuration: '08 min',
        progress: 88,
        level: 'Special',
        thumbnail:
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'brain',
        quizFocus: 'Mindset and discipline',
        objectives: [
          'Understand impulse control',
          'Build consistency with small habits',
          'Stay calm during wins and losses',
        ],
      },
      {
        title: 'Case Studies',
        slug: 'case-studies',
        description: 'Review real-world examples of wins, losses and lessons from business and market decisions.',
        estimatedDuration: '09 min',
        progress: 74,
        level: 'Special',
        thumbnail:
          'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'notebook-text',
        quizFocus: 'Learning from examples',
        objectives: [
          'Learn from real situations',
          'Compare strategy, timing and outcome',
          'Turn examples into decision rules',
        ],
      },
      {
        title: 'Practical Assignments',
        slug: 'practical-assignments',
        description: 'Apply the lessons with small assignments, observation tasks and reflection prompts.',
        estimatedDuration: '06 min',
        progress: 68,
        level: 'Special',
        thumbnail:
          'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
        contentLanguage: 'English + Hinglish',
        icon: 'clipboard-list',
        quizFocus: 'Application practice',
        objectives: [
          'Do small tasks after each module',
          'Observe business and market examples',
          'Write simple takeaways in your own words',
        ],
      },
    ],
  },
];

const ADMIN_CONTENT_KEY = 'class360_admin_learning_content';
const baseLearningSubjectCatalog = subjectDefinitions.map(buildSubject);

function readAdminLearningContent() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(ADMIN_CONTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function getAdminSubject(adminContent, subjectSlug) {
  return (
    adminContent?.subjects?.find(
      (subject) => subject.slug === subjectSlug || subject.id === subjectSlug || slugify(subject.name) === subjectSlug,
    ) || null
  );
}

function getAdminChapter(adminContent, chapterSlug) {
  return (
    adminContent?.chapters?.find(
      (chapter) => chapter.slug === chapterSlug || chapter.id === chapterSlug || chapter.subjectSlug === chapterSlug,
    ) || null
  );
}

function getAdminNoteForChapter(adminContent, chapterSlug, chapterId) {
  return (
    adminContent?.notes?.find(
      (note) => note.chapterSlug === chapterSlug || note.chapterId === chapterId || note.chapterId === chapterSlug,
    ) || null
  );
}

function getAdminQuestionsForChapter(adminContent, chapterSlug, type = null) {
  return (adminContent?.questions || []).filter(
    (question) => question.chapterSlug === chapterSlug && (!type || question.type === type),
  );
}

function buildQuestionSet(questions = [], fallback = []) {
  if (!questions.length) return fallback.length ? fallback : undefined;
  return questions.map((question, index) => ({
    id: question.id || `${question.chapterSlug || 'chapter'}-${question.type || 'practice'}-${index + 1}`,
    question: question.question,
    options: Array.isArray(question.options) ? question.options.filter(Boolean).slice(0, 4) : [],
    correctAnswer: question.correctAnswer,
    explanation: question.explanation || '',
    difficulty: question.difficulty || 'easy',
  }));
}

function buildMergedChapter(subject, baseChapter, adminChapter, index, adminContent) {
  const chapterSlug = adminChapter?.slug || baseChapter?.slug || slugify(adminChapter?.title || baseChapter?.title || 'chapter');
  const note = getAdminNoteForChapter(adminContent, chapterSlug, adminChapter?.id || baseChapter?.slug);
  const practiceQuestions = buildQuestionSet(
    getAdminQuestionsForChapter(adminContent, chapterSlug, 'practice'),
    baseChapter?.practiceQuestions || [],
  );
  const dppQuestions = buildQuestionSet(getAdminQuestionsForChapter(adminContent, chapterSlug, 'dpp'), baseChapter?.dppQuestions || []);
  const testQuestions = buildQuestionSet(
    getAdminQuestionsForChapter(adminContent, chapterSlug, 'test'),
    baseChapter?.testQuestions || [],
  );

  return buildChapter(
    subject,
    {
      chapterNumber: adminChapter?.order || baseChapter?.chapterNumber || index + 1,
      title: adminChapter?.title || baseChapter?.title || 'Untitled Chapter',
      slug: chapterSlug,
      description: adminChapter?.description || baseChapter?.description || '',
      estimatedDuration: adminChapter?.duration || baseChapter?.estimatedDuration || '08 min',
      videoUrl: adminChapter?.videoUrl || baseChapter?.videoUrl || DEFAULT_VIDEO_URL,
      thumbnail: adminChapter?.thumbnail || baseChapter?.thumbnail || null,
      level: adminChapter?.level || baseChapter?.level || 'Core',
      contentLanguage: adminChapter?.contentLanguage || baseChapter?.contentLanguage || 'English',
      icon: adminChapter?.icon || baseChapter?.icon || 'book-open',
      quizFocus: adminChapter?.quizFocus || baseChapter?.quizFocus || 'Chapter quiz',
      progress: baseChapter?.progress ?? 0,
      status: baseChapter?.status,
      legacySlugs: baseChapter?.legacySlugs || [],
      objectives: adminChapter?.objectives?.length ? adminChapter.objectives : baseChapter?.objectives || [],
      notes:
        note || baseChapter?.notes || {
          summaryPoints: [
            `${adminChapter?.title || baseChapter?.title || 'This chapter'} introduces the main idea in a simple way.`,
            'Video, notes and practice stay in one short learning flow.',
            'Use the quick revision box to revisit the main idea fast.',
          ],
          keyTerms: [
            { term: 'Core idea', meaning: `The most important point in ${adminChapter?.title || baseChapter?.title || 'this chapter'}.` },
            { term: 'Example', meaning: 'A familiar case that makes the idea easier to remember.' },
            { term: 'Revision', meaning: 'A quick review before moving on to practice.' },
          ],
          examples: [subject.name, adminChapter?.title || baseChapter?.title || 'Classroom example'],
          revisionBox: 'Read the bullets, notice the key terms, and then try the questions.',
        },
      practiceQuestions,
      dppQuestions,
      testQuestions,
      nextChapterSlug: baseChapter?.nextChapterSlug || null,
    },
    index,
  );
}

function buildStandaloneAdminSubject(adminSubject, adminContent) {
  const subject = {
    slug: adminSubject.slug,
    legacySlugs: [],
    name: adminSubject.name,
    classLevel: `Class ${adminSubject.classLevel || '6'}`,
    board: 'CBSE',
    description: adminSubject.description || '',
    subtitle: adminSubject.description || '',
    contentLanguage: adminSubject.contentLanguage || 'English',
    chapters: [],
  };

  const subjectChapters = (adminContent?.chapters || [])
    .filter((chapter) => chapter.subjectId === adminSubject.slug || chapter.subjectSlug === adminSubject.slug)
    .slice()
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

  const chapters = subjectChapters.map((chapter, index) => {
    const note = getAdminNoteForChapter(adminContent, chapter.slug, chapter.id);
    return buildChapter(
      subject,
      {
        chapterNumber: chapter.order || index + 1,
        title: chapter.title || 'Untitled Chapter',
        slug: chapter.slug,
        description: chapter.description || '',
        estimatedDuration: chapter.duration || '08 min',
        videoUrl: chapter.videoUrl || DEFAULT_VIDEO_URL,
        thumbnail: chapter.thumbnail || null,
        level: chapter.level || 'Core',
        contentLanguage: chapter.contentLanguage || 'English',
        icon: chapter.icon || 'book-open',
        quizFocus: chapter.quizFocus || 'Chapter quiz',
        progress: 0,
        objectives: Array.isArray(chapter.objectives) ? chapter.objectives : [],
        notes:
          note || {
            summaryPoints: [
              `${chapter.title || 'This chapter'} introduces the main idea in a simple way.`,
              'Video, notes and practice stay in one short learning flow.',
              'Use the quick revision box to revisit the main idea fast.',
            ],
            keyTerms: [
              { term: 'Core idea', meaning: `The most important point in ${chapter.title || 'this chapter'}.` },
              { term: 'Example', meaning: 'A familiar case that makes the idea easier to remember.' },
            ],
            examples: [adminSubject.name, chapter.title || 'Classroom example'],
            revisionBox: 'Read the bullets, notice the key terms, and then try the questions.',
          },
        practiceQuestions: buildQuestionSet(getAdminQuestionsForChapter(adminContent, chapter.slug, 'practice')),
        dppQuestions: buildQuestionSet(getAdminQuestionsForChapter(adminContent, chapter.slug, 'dpp')),
        testQuestions: buildQuestionSet(getAdminQuestionsForChapter(adminContent, chapter.slug, 'test')),
      },
      index,
    );
  });

  chapters.forEach((chapter, index) => {
    chapter.nextChapterSlug = chapters[index + 1]?.slug || null;
  });

  const completedChapters = chapters.filter((chapter) => chapter.progress >= 100).length;
  const currentChapter =
    chapters.find((chapter) => chapter.status === 'in-progress') ||
    chapters.find((chapter) => chapter.progress < 100) ||
    chapters[0] ||
    null;

  return {
    ...subject,
    chapters,
    totalChapters: chapters.length,
    completedChapters,
    progressPercent: chapters.length ? Math.round((completedChapters / chapters.length) * 100) : 0,
    currentChapter,
    recommendedChapter: currentChapter,
  };
}

function getLearningCatalog() {
  const adminContent = readAdminLearningContent();
  if (!adminContent?.subjects?.length) {
    return baseLearningSubjectCatalog;
  }

  const enhancedSubjects = baseLearningSubjectCatalog.map((subject) => {
    const adminSubject = getAdminSubject(adminContent, subject.slug);
    const subjectChapters = (adminContent.chapters || [])
      .filter((chapter) => chapter.subjectId === subject.slug || chapter.subjectSlug === subject.slug)
      .slice()
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
    const chapterLookup = new Map(subject.chapters.map((chapter) => [chapter.slug, chapter]));
    const mergedChapters = [];

    subject.chapters.forEach((baseChapter, index) => {
      const adminChapter = subjectChapters.find((chapter) => chapter.slug === baseChapter.slug || chapter.id === baseChapter.id);
      mergedChapters.push(buildMergedChapter(subject, baseChapter, adminChapter, index, adminContent));
    });

    subjectChapters
      .filter((chapter) => !chapterLookup.has(chapter.slug))
      .forEach((chapter, index) => {
        mergedChapters.push(buildMergedChapter(subject, null, chapter, subject.chapters.length + index, adminContent));
      });

    mergedChapters.sort((a, b) => Number(a.chapterNumber || a.order || 0) - Number(b.chapterNumber || b.order || 0));
    mergedChapters.forEach((chapter, index) => {
      chapter.nextChapterSlug = mergedChapters[index + 1]?.slug || null;
    });

    const completedChapters = mergedChapters.filter((chapter) => chapter.progress >= 100).length;
    const currentChapter =
      mergedChapters.find((chapter) => chapter.status === 'in-progress') ||
      mergedChapters.find((chapter) => chapter.progress < 100) ||
      mergedChapters[0] ||
      null;

    return {
      ...subject,
      name: adminSubject?.name || subject.name,
      classLevel: adminSubject?.classLevel ? `Class ${adminSubject.classLevel}` : subject.classLevel,
      description: adminSubject?.description || subject.description,
      subtitle: adminSubject?.description || subject.subtitle,
      contentLanguage: adminSubject?.contentLanguage || subject.contentLanguage,
      chapters: mergedChapters,
      totalChapters: mergedChapters.length,
      completedChapters,
      progressPercent: mergedChapters.length ? Math.round((completedChapters / mergedChapters.length) * 100) : 0,
      currentChapter,
      recommendedChapter: currentChapter,
    };
  });

  const baseSubjectSlugs = new Set(baseLearningSubjectCatalog.map((subject) => subject.slug));
  const extraSubjects = (adminContent.subjects || [])
    .filter((subject) => !baseSubjectSlugs.has(subject.slug))
    .map((subject) => buildStandaloneAdminSubject(subject, adminContent));

  return [...enhancedSubjects, ...extraSubjects];
}

export const learningSubjectCatalog = baseLearningSubjectCatalog;

export function getLearningSubjectBySlug(subjectSlug) {
  const normalized = normalizeSubjectSlug(subjectSlug);
  const catalog = getLearningCatalog();
  return (
    catalog.find(
      (subject) =>
        subject.slug === normalized ||
        subject.legacySlugs?.includes(normalized) ||
        slugify(subject.name) === normalized,
    ) || catalog[0]
  );
}

export function getLearningSubjectsForClassLevel() {
  return getLearningCatalog();
}

export function getLearningChaptersForSubjectPage(subjectSlug) {
  return getLearningSubjectBySlug(subjectSlug).chapters;
}

export function getLearningChapterBySlugFromCatalog(chapterSlug) {
  const normalized = slugify(chapterSlug);
  return (
    getLearningCatalog()
      .flatMap((subject) => subject.chapters)
      .find((chapter) => chapter.slug === normalized || chapter.legacySlugs?.includes(normalized)) || null
  );
}

export function getLearningSubjectPageSnapshot(subjectSlug) {
  const subject = getLearningSubjectBySlug(subjectSlug);
  return {
    subject,
    chapters: subject.chapters,
    totalChapters: subject.totalChapters,
    completedChapters: subject.completedChapters,
    progressPercent: subject.progressPercent,
    currentChapter: subject.currentChapter,
    recommendedChapter: subject.recommendedChapter,
  };
}
