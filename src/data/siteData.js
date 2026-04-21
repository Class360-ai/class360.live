import {
  Atom,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  Calculator,
  GraduationCap,
  Laptop2,
  Microscope,
  Sparkles,
  Target,
  Trophy,
  Users,
} from 'lucide-react';

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Voice Learning', href: '/voice-learning' },
  { label: 'Courses', href: '/courses' },
  { label: 'Business & Market Learning', href: '/business-market-learning' },
  { label: 'Test Series', href: '/test-series' },
  { label: 'Results', href: '/results' },
  { label: 'Educators', href: '/educators' },
  { label: 'App Preview', href: '/app-preview' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const examCategories = [
  { name: 'IIT JEE', icon: Atom, note: 'Physics, Chemistry, Maths mastery' },
  { name: 'NEET', icon: Microscope, note: 'Biology-first medical preparation' },
  { name: 'SSC', icon: BriefcaseBusiness, note: 'Quant, reasoning, English, GK' },
  { name: 'Banking', icon: Calculator, note: 'Prelims, mains and interview prep' },
  { name: 'Board Exams', icon: GraduationCap, note: 'Class 9-12 concept clarity' },
  { name: 'Foundation', icon: BookOpen, note: 'Early competitive exam track' },
  { name: 'Olympiad', icon: Trophy, note: 'Speed, logic and problem solving' },
  { name: 'CUET', icon: Laptop2, note: 'Domain subjects and mock practice' },
];

export const whyChoose = [
  {
    title: 'AI Personalized Learning',
    description:
      'Every learner gets a smart study path based on accuracy, speed, and weak topics.',
    icon: BrainCircuit,
  },
  {
    title: 'Live Classes & Mock Tests',
    description:
      'Structured batches, daily quizzes, full-length tests, and live doubt-solving sessions.',
    icon: Sparkles,
  },
  {
    title: 'Performance Analytics',
    description:
      'Track score trends, concept mastery, time spent, and revision readiness in one dashboard.',
    icon: Target,
  },
  {
    title: 'Expert Educators',
    description:
      'Learn from mentors who combine exam strategy, subject depth, and real student coaching.',
    icon: Users,
  },
  {
    title: 'Hindi + English Support',
    description:
      'Bilingual explanations, practice support, and guidance for students from every background.',
    icon: BookOpen,
  },
  {
    title: 'Mobile-first Smart Dashboard',
    description:
      'Stay on track with bite-sized learning, offline-friendly habits, and clear daily goals.',
    icon: Laptop2,
  },
];

export const stats = [
  { value: '50K+', label: 'students guided' },
  { value: '10K+', label: 'tests taken' },
  { value: '500+', label: 'selections' },
  { value: '95%', label: 'satisfaction' },
];

export const featuredCourses = [
  {
    title: 'JEE 2026 Pro Batch',
    exam: 'IIT JEE',
    price: '₹24,999',
    originalPrice: '₹39,999',
    duration: '12 months',
    features: ['Live classes', 'Chapter tests', 'AI doubt support', 'Rank booster plans'],
  },
  {
    title: 'NEET Mastery Track',
    exam: 'NEET',
    price: '₹22,999',
    originalPrice: '₹36,999',
    duration: '10 months',
    features: ['Bio-focused tests', 'NCERT revision', 'Daily quizzes', 'Mentor feedback'],
  },
  {
    title: 'SSC Selection Series',
    exam: 'SSC',
    price: '₹8,999',
    originalPrice: '₹14,999',
    duration: '6 months',
    features: ['Tier-wise practice', 'Speed drills', 'GK capsules', 'Weekly scorecards'],
  },
  {
    title: 'Banking Rise Program',
    exam: 'Banking',
    price: '₹9,999',
    originalPrice: '₹16,999',
    duration: '6 months',
    features: ['Quant strategy', 'Reasoning labs', 'Mock interviews', 'Live analysis'],
  },
  {
    title: 'Class 10 Board Booster',
    exam: 'Boards',
    price: '₹6,499',
    originalPrice: '₹11,999',
    duration: '5 months',
    features: ['Concept revision', 'Sample papers', 'Doubt sessions', 'Exam writing practice'],
  },
  {
    title: 'Foundation 8-10 Builder',
    exam: 'Foundation',
    price: '₹7,499',
    originalPrice: '₹12,499',
    duration: '8 months',
    features: ['Basics to advanced', 'Weekly quizzes', 'Study planner', 'Mentor support'],
  },
  {
    title: 'CUET Domain Masterclass',
    exam: 'CUET',
    price: '₹8,499',
    originalPrice: '₹13,999',
    duration: '4 months',
    features: ['Domain prep', 'Mock papers', 'Timed practice', 'Rank insights'],
  },
];

export const courseFilters = ['All Exams', 'JEE', 'NEET', 'SSC', 'Banking', 'Boards', 'Foundation'];

export const courseCategories = [
  { title: 'School Excellence', count: '42 courses', note: 'Class 6-12 concept builders' },
  { title: 'Engineering Prep', count: '18 courses', note: 'JEE Main and Advanced pathways' },
  { title: 'Medical Prep', count: '14 courses', note: 'NEET biology and test strategy' },
  { title: 'Government Jobs', count: '21 courses', note: 'SSC, banking, and state exams' },
];

export const testCategories = [
  {
    title: 'JEE Chapter Tests',
    detail: 'Topic-wise timed practice for Physics, Chemistry and Maths.',
    type: 'Mock Tests',
  },
  {
    title: 'NEET Biology Sprints',
    detail: 'High-frequency concept checks with instant explanation videos.',
    type: 'Quizzes',
  },
  {
    title: 'Scholarship Test Series',
    detail: 'Compete for fee waivers and flagship batch scholarships.',
    type: 'Scholarships',
  },
  {
    title: 'SSC Speed Builder',
    detail: 'Short tests designed to sharpen accuracy under pressure.',
    type: 'Practice',
  },
];

export const scholarshipTests = [
  { title: 'Class360 Talent Hunt', date: 'Sunday, 21 April', prize: 'Up to 90% scholarship' },
  { title: 'JEE Jumpstart Scholarship', date: 'Saturday, 27 April', prize: 'Fee waiver + mentoring' },
  { title: 'NEET Future Doctor Test', date: 'Sunday, 5 May', prize: 'Free diagnostic report' },
];

export const results = [
  {
    rank: 'AIR 12',
    name: 'Aditya Sharma',
    exam: 'IIT JEE Advanced',
    title: 'Secured a seat in Mechanical Engineering at IIT Delhi',
  },
  {
    rank: 'AIR 38',
    name: 'Ananya Iyer',
    exam: 'NEET 2025',
    title: 'Crossed 680+ with a focused biology revision plan',
  },
  {
    rank: 'AIR 94',
    name: 'Rahul Verma',
    exam: 'SSC CGL',
    title: 'Selected for Central Tax Inspector through mock test discipline',
  },
  {
    rank: 'AIR 151',
    name: 'Meera Patel',
    exam: 'Banking PO',
    title: 'Placed as Probationary Officer after 8 weeks of speed training',
  },
  {
    rank: 'AIR 19',
    name: 'Sahil Khan',
    exam: 'CUET',
    title: 'Earned admission into BBA at Delhi University',
  },
  {
    rank: 'AIR 67',
    name: 'Nandini Joshi',
    exam: 'Class 12 Boards',
    title: 'Scored 97.4% with daily concept revision',
  },
];

export const resultStats = [
  { value: '50K+', label: 'students' },
  { value: '10K+', label: 'tests taken' },
  { value: '500+', label: 'selections' },
  { value: '95%', label: 'satisfaction' },
];

export const educators = [
  {
    name: 'Dr. Priya Nair',
    subject: 'Physics',
    experience: '14 years',
    highlight: 'IIT JEE strategy and advanced problem solving',
    trust: 'Mentored 120+ under-100 rankers',
  },
  {
    name: 'Prof. Sanjay Mehra',
    subject: 'Chemistry',
    experience: '17 years',
    highlight: 'Concept-first teaching for board and competitive exams',
    trust: 'Known for exam-ready revision notes',
  },
  {
    name: 'Dr. Kavita Reddy',
    subject: 'Biology',
    experience: '12 years',
    highlight: 'NCERT mapping, diagram recall, and retention systems',
    trust: 'Helped students cross 650+ in NEET',
  },
  {
    name: 'Aman Gupta',
    subject: 'Quant & Reasoning',
    experience: '10 years',
    highlight: 'Shortcut methods for SSC, banking, and aptitude tests',
    trust: 'Creates speed drills used by thousands daily',
  },
  {
    name: 'Neha Bhatia',
    subject: 'English',
    experience: '9 years',
    highlight: 'Grammar, comprehension, and interview communication',
    trust: 'Specialist in foundation and exam confidence building',
  },
  {
    name: 'Arjun Das',
    subject: 'Mathematics',
    experience: '15 years',
    highlight: 'Board fundamentals with olympiad-level problem patterns',
    trust: 'Builds from basics to advanced in one track',
  },
];

export const appMetrics = [
  { label: 'Score Improvement', value: '+18.4%' },
  { label: 'Weak Topics', value: 'Vectors, Human Physiology' },
  { label: 'Weekly Test Count', value: '8' },
  { label: 'Accuracy Rate', value: '86%' },
  { label: 'Study Streak', value: '19 days' },
  { label: 'Personalized Suggestions', value: '5 actions today' },
];

export const performanceData = [
  { week: 'W1', score: 42, accuracy: 61 },
  { week: 'W2', score: 54, accuracy: 68 },
  { week: 'W3', score: 63, accuracy: 72 },
  { week: 'W4', score: 71, accuracy: 79 },
  { week: 'W5', score: 77, accuracy: 84 },
  { week: 'W6', score: 86, accuracy: 89 },
];

export const weakTopicData = [
  { subject: 'Physics', progress: 68 },
  { subject: 'Chemistry', progress: 74 },
  { subject: 'Maths', progress: 81 },
  { subject: 'Biology', progress: 88 },
];

export const dashboardTips = [
  'AI highlights low-confidence chapters before each test.',
  'Your next study block is optimized for retention and recall.',
  'Recommendation engine balances revision, practice, and mock tests.',
];

export const aboutPillars = [
  {
    title: 'Vision',
    text: 'To make premium exam preparation accessible, measurable, and deeply personalized for every Indian student.',
  },
  {
    title: 'Mission',
    text: 'To combine great teachers, intelligent analytics, and trustworthy content into one daily learning system.',
  },
  {
    title: 'Why we exist',
    text: 'Students deserve preparation that adapts to their pace, not the other way around.',
  },
];

export const impactStats = [
  { value: '22 states', label: 'students learning across India' },
  { value: '4.9/5', label: 'avg. app satisfaction from test users' },
  { value: '320+', label: 'study plans auto-generated weekly' },
  { value: '96%', label: 'students say the dashboard helps them stay consistent' },
];

export const testimonials = [
  {
    name: 'Shreya Kapoor',
    role: 'Class 12, Delhi',
    quote:
      'The dashboard showed exactly which topics were dragging my score. Within a month, my mock scores became stable and my revision felt much smarter.',
  },
  {
    name: 'Kunal Joshi',
    role: 'NEET Aspirant, Pune',
    quote:
      'The mix of live classes, quizzes, and weekly analytics made it easy to stick to a plan. I finally stopped guessing what to study next.',
  },
  {
    name: 'Farah Siddiqui',
    role: 'SSC Aspirant, Lucknow',
    quote:
      'The speed drills and test reviews were exactly what I needed. Class360 feels practical, polished, and genuinely built for results.',
  },
];

export const homepageTopperHighlights = [
  {
    name: 'Aditya Sharma',
    exam: 'IIT JEE Advanced',
    rank: 'AIR 12',
    score: '99.91 percentile',
    achievement: 'Mechanical Engineering at IIT Delhi',
  },
  {
    name: 'Ananya Iyer',
    exam: 'NEET 2025',
    rank: 'AIR 38',
    score: '684 marks',
    achievement: 'MBBS seat with focused biology revision',
  },
  {
    name: 'Rahul Verma',
    exam: 'SSC CGL',
    rank: 'AIR 94',
    score: '97.2 accuracy',
    achievement: 'Central Tax Inspector selection',
  },
  {
    name: 'Meera Patel',
    exam: 'Banking PO',
    rank: 'AIR 151',
    score: '91.4 percentile',
    achievement: 'Probationary Officer placement',
  },
];

export const faqItems = [
  {
    question: 'How do I choose the right course?',
    answer:
      'Start by selecting your exam, then filter by class or stream. Each course page shows the teaching style, test support, and learning outcomes.',
  },
  {
    question: 'Are live classes available in Hindi and English?',
    answer:
      'Yes. Most flagship batches offer bilingual support so students can learn comfortably in the language they trust most.',
  },
  {
    question: 'Do mock tests come with analytics?',
    answer:
      'Every major test set includes score reports, weak-topic insights, accuracy tracking, and suggested revision actions.',
  },
  {
    question: 'Can I access content on mobile?',
    answer:
      'Yes. The platform is built mobile-first so students can attend class, review analytics, and take quizzes from any screen.',
  },
];
