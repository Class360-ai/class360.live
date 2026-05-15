// 🎨 Live Classes Utilities & Animation Variants
import { Flame, Zap, Brain, Trophy, Users } from 'lucide-react';

// Format countdown time display
export const formatCountdown = (minutes) => {
  if (minutes < 1) return 'Starting now';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Format large numbers (12400 → "12.4K")
export const formatLargeNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Difficulty-based styling
export const getDifficultyColors = (difficulty) => {
  const map = {
    Beginner: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100' },
    Intermediate: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100' },
    Advanced: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100' },
  };
  return map[difficulty] || map.Intermediate;
};

// Subject-based styling & icons
export const getSubjectColors = (subject) => {
  const map = {
    Chemistry: { icon: '⚗️', gradient: 'from-emerald-500 to-teal-500', text: 'text-emerald-700' },
    Physics: { icon: '⚡', gradient: 'from-blue-500 to-cyan-500', text: 'text-blue-700' },
    Maths: { icon: '📐', gradient: 'from-purple-500 to-indigo-500', text: 'text-purple-700' },
    Biology: { icon: '🧬', gradient: 'from-pink-500 to-rose-500', text: 'text-pink-700' },
    English: { icon: '📚', gradient: 'from-amber-500 to-orange-500', text: 'text-amber-700' },
  };
  return map[subject] || map.Maths;
};

// Framer Motion animation configurations
export const animationVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  pulseGlow: {
    animate: {
      boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 12px rgba(59, 130, 246, 0)'],
    },
    transition: { duration: 2, repeat: Infinity },
  },
};

// Build AI personalization message
export const buildAIInsightMessage = (studentData, liveClass) => {
  const insights = [];

  if (studentData.weakTopics?.some((t) => liveClass.topics?.some((ct) => ct.includes(t)))) {
    insights.push(`This class covers ${liveClass.topics[0]}, your #1 weak topic.`);
  }

  if (studentData.lastTestAccuracy < 70) {
    insights.push(`Your recent accuracy is ${studentData.lastTestAccuracy}%. This class will boost your confidence.`);
  }

  if (studentData.streakDays >= 3) {
    insights.push(`You're on a ${studentData.streakDays}-day streak. Attending will unlock a milestone badge!`);
  }

  if (liveClass.studentCount > 2500) {
    insights.push(`${formatLargeNumber(liveClass.studentCount)} students are attending. High-quality discussion guaranteed.`);
  }

  return insights.length > 0 ? insights[0] : 'Personalized for your learning goals.';
};

// Generate badge icons from string
export const getBadgeIcon = (badgeName) => {
  const iconMap = {
    focus_master: Flame,
    streak_5: Zap,
    brain_boost: Brain,
    leaderboard: Trophy,
    social_butterfly: Users,
  };
  return iconMap[badgeName] || Trophy;
};
