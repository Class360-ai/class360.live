import { motion } from 'framer-motion';
import { Brain, Zap } from 'lucide-react';
import { buildAIInsightMessage } from '../../utils/liveClassesUtils';

export default function AIInsightBox({ studentProfile, liveClass }) {
  const insight = buildAIInsightMessage(studentProfile, liveClass);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[1.5rem] border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-4 shadow-sm"
    >
      {/* Animated background */}
      <motion.div
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-blue-400/10"
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white">
            <Brain className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">AI INSIGHT</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-800">{insight}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-2">
          <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-xs font-bold text-purple-700">
            <Zap className="h-3 w-3" />
            Match: 95%
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-xs font-bold text-blue-700">
            ⭐ Win Rate: 88%
          </div>
        </div>
      </div>
    </motion.div>
  );
}
