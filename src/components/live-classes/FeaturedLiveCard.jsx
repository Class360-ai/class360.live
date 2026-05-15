import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Clock, Users, AlertCircle, Smile } from 'lucide-react';
import { formatCountdown, formatLargeNumber } from '../../utils/liveClassesUtils';

export default function FeaturedLiveCard({ liveClass, onJoin, onReminder }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 p-6 text-white shadow-lg"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute right-[-4rem] top-[-4rem] h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-[-3rem] left-[-3rem] h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Live Badge */}
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex h-3 w-3 rounded-full bg-red-500"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-red-300">LIVE NOW</span>
        </div>

        {/* Title & Teacher */}
        <div>
          <h3 className="font-display text-3xl font-bold leading-tight">{liveClass.title}</h3>
          <p className="mt-2 text-sm text-white/70">{liveClass.teacher.name}</p>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
            <Clock className="mb-2 h-4 w-4 text-cyan-300" />
            <p className="text-xs text-white/60">Duration</p>
            <p className="mt-1 font-semibold">{liveClass.duration}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
            <Users className="mb-2 h-4 w-4 text-emerald-300" />
            <p className="text-xs text-white/60">Attendees</p>
            <p className="mt-1 font-semibold">{formatLargeNumber(liveClass.studentCount)}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
            <Zap className="mb-2 h-4 w-4 text-yellow-300" />
            <p className="text-xs text-white/60">Ends in</p>
            <p className="mt-1 font-semibold">{formatCountdown(liveClass.countdownMinutes)}</p>
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2">
          {liveClass.topics.map((topic) => (
            <span key={topic} className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-cyan-200">
              {topic}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-white/80">{liveClass.description}</p>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onJoin}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-xl"
          >
            <Play className="h-4 w-4" />
            Join Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onReminder}
            className="flex-1 rounded-full border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Set Reminder
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex-1 rounded-full border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            📝 Notes
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
