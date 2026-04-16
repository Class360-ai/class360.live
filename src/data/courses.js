import {
  BadgeCheck,
  BrainCircuit,
  Languages,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';

export const courseFilters = ['All', 'IIT JEE', 'NEET', 'SSC', 'Banking', 'Board Exams', 'Foundation', 'CUET'];

export const courseTrustStats = [
  { value: '50K+', label: 'learners guided' },
  { value: '10K+', label: 'tests taken' },
  { value: '500+', label: 'selections' },
  { value: '4.8', label: 'average rating' },
];

export const featuredCourses = [
  {
    id: 'jee-pro-batch',
    title: 'JEE 2026 Pro Batch',
    exam: 'IIT JEE',
    mode: 'Live + Hybrid',
    duration: '12 months',
    price: 'Rs. 24,999',
    originalPrice: 'Rs. 39,999',
    badge: 'Popular',
    accent: 'from-blue-600 via-indigo-600 to-cyan-500',
    features: [
      'Daily live classes with structured DPPs',
      'Chapter tests, rank analysis, and revision loops',
      'AI doubt support with bilingual explanations',
    ],
  },
  {
    id: 'jee-revision-lab',
    title: 'JEE Revision + DPP Lab',
    exam: 'IIT JEE',
    mode: 'Recorded',
    duration: '6 months',
    price: 'Rs. 12,999',
    originalPrice: 'Rs. 19,999',
    badge: 'Top Rated',
    accent: 'from-indigo-600 via-blue-600 to-sky-500',
    features: [
      'Formula recall playlists and weekly recap sheets',
      'Chapter-wise drill sets for faster practice',
      'Performance dashboard for every mock attempt',
    ],
  },
  {
    id: 'neet-complete-track',
    title: 'NEET Complete 2026 Track',
    exam: 'NEET',
    mode: 'Live',
    duration: '10 months',
    price: 'Rs. 22,999',
    originalPrice: 'Rs. 34,999',
    badge: 'Best Value',
    accent: 'from-cyan-600 via-blue-600 to-indigo-600',
    features: [
      'Biology-first concept mastery and NCERT mapping',
      'Daily MCQs with instant answer review',
      'Mentor support for score recovery and planning',
    ],
  },
  {
    id: 'ssc-selection-series',
    title: 'SSC Selection Series',
    exam: 'SSC',
    mode: 'Hybrid',
    duration: '6 months',
    price: 'Rs. 8,999',
    originalPrice: 'Rs. 14,999',
    badge: 'Fast Track',
    accent: 'from-sky-600 via-indigo-600 to-blue-500',
    features: [
      'Quant, reasoning, English and GK sprint modules',
      'Speed drills for Tier 1 and Tier 2 patterns',
      'Weekly scorecards to improve accuracy quickly',
    ],
  },
  {
    id: 'banking-rise-program',
    title: 'Banking Rise Program',
    exam: 'Banking',
    mode: 'Live',
    duration: '6 months',
    price: 'Rs. 9,999',
    originalPrice: 'Rs. 16,999',
    badge: 'Recommended',
    accent: 'from-blue-600 via-sky-500 to-cyan-500',
    features: [
      'Quant strategy and reasoning speed labs',
      'Mock tests designed for prelims pressure',
      'Live analysis after every weekly test',
    ],
  },
  {
    id: 'board-topper-plan',
    title: 'Class 10 Board Topper Plan',
    exam: 'Board Exams',
    mode: 'Recorded',
    duration: '5 months',
    price: 'Rs. 6,499',
    originalPrice: 'Rs. 10,999',
    badge: 'Focused',
    accent: 'from-indigo-500 via-blue-600 to-cyan-500',
    features: [
      'Concept revision with chapter summaries',
      'Sample paper practice and writing strategy',
      'Doubt clearing sessions before exams',
    ],
  },
  {
    id: 'foundation-builder',
    title: 'Foundation 8-10 Builder',
    exam: 'Foundation',
    mode: 'Live',
    duration: '8 months',
    price: 'Rs. 7,499',
    originalPrice: 'Rs. 11,999',
    badge: 'Early Start',
    accent: 'from-cyan-500 via-blue-600 to-indigo-600',
    features: [
      'Maths and science fundamentals with pace control',
      'Weekly quizzes and parent-friendly progress reports',
      'Habit-building support for long-term consistency',
    ],
  },
  {
    id: 'cuet-domain-masterclass',
    title: 'CUET UG Domain Masterclass',
    exam: 'CUET',
    mode: 'Hybrid',
    duration: '4 months',
    price: 'Rs. 8,499',
    originalPrice: 'Rs. 12,999',
    badge: 'High Demand',
    accent: 'from-blue-500 via-indigo-600 to-sky-500',
    features: [
      'Domain subject prep with timed practice',
      'English and current affairs booster tests',
      'Rank insights to improve mock confidence',
    ],
  },
];

export const courseBenefits = [
  {
    title: 'AI Personalized Learning',
    description: 'Every learner gets a sharper path based on accuracy, speed, and weak chapters.',
    icon: BrainCircuit,
  },
  {
    title: 'Live Classes & Mock Tests',
    description: 'Structured batches with live doubt-solving and mock reviews that keep momentum high.',
    icon: Sparkles,
  },
  {
    title: 'Performance Analytics',
    description: 'Track score trends, revision readiness, and test consistency in one dashboard.',
    icon: Target,
  },
  {
    title: 'Expert Educators',
    description: 'Learn from mentors who combine subject depth with proven exam strategy.',
    icon: BadgeCheck,
  },
  {
    title: 'Hindi + English Support',
    description: 'Bilingual explanations and support so every student can learn comfortably.',
    icon: Languages,
  },
  {
    title: 'Smart Progress Tracking',
    description: 'See weekly growth, streaks, and next-step suggestions without any guesswork.',
    icon: ShieldCheck,
  },
];

export const courseFaqItems = [
  {
    question: 'How do I choose the right course?',
    answer:
      'Start with your exam goal, then compare the course mode, duration, and test support. If you are unsure, pick the track that matches your current class and study pace.',
  },
  {
    question: 'Do these courses include tests and analytics?',
    answer:
      'Yes. Premium batches include practice loops, mock tests, score analysis, and weak-topic reviews so students know exactly what to revise next.',
  },
  {
    question: 'Is bilingual support available?',
    answer:
      'Most flagship courses include Hindi and English support to help students learn in the language they are most comfortable with.',
  },
  {
    question: 'Can I study on mobile?',
    answer:
      'Absolutely. The learning flow is mobile-friendly so students can attend class, revise notes, and track progress from any screen.',
  },
];
