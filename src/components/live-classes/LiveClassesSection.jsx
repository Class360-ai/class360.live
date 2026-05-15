import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users } from 'lucide-react';
import { FeaturedLiveCard, RecommendationCard, AIInsightBox, ReplayCard, GamificationRewards } from './index';
import { getPersonalizedLiveClasses, replayData, studentProfile } from '../../data/liveClassesData';
import { animationVariants } from '../../utils/liveClassesUtils';
import { loadLiveClasses, joinLiveClass, setLiveClassReminder } from '../../services/liveClassesApi';
import { isPremiumUser, requestUpgrade } from '../../utils/premium';

export default function LiveClassesSection() {
  const [showGamification, setShowGamification] = useState(false);
  const [selectedReplay, setSelectedReplay] = useState(null);
  const [liveClassesData, setLiveClassesData] = useState({ featured: null, recommendations: [], replayData: [], activeUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPremium = isPremiumUser();

  const fallbackData = useMemo(() => getPersonalizedLiveClasses(studentProfile), []);

  useEffect(() => {
    async function fetchLiveData() {
      const response = await loadLiveClasses();
      if (response.error) {
        setError(response.error);
        setLiveClassesData({
          featured: fallbackData.featured,
          recommendations: fallbackData.recommendations,
          replayData,
          activeUsers: 6453,
        });
      } else {
        setLiveClassesData({
          featured: response.featured,
          recommendations: response.recommendations,
          replayData: response.replayData,
          activeUsers: response.activeUsers || 6453,
        });
      }
      setLoading(false);
    }
    fetchLiveData();
  }, [fallbackData]);

  const handleJoinClass = async (liveClass) => {
    if (liveClass?.premiumOnly && !isPremium) {
      requestUpgrade('Unlock premium live classes with expert coaching and exclusive replays.');
      return;
    }

    const response = await joinLiveClass(liveClass?.id);
    if (!response.error) {
      setShowGamification(true);
      setTimeout(() => setShowGamification(false), 3000);
    }
  };

  const handleReminder = async (liveClass) => {
    if (!liveClass) return;
    if (liveClass?.premiumOnly && !isPremium) {
      requestUpgrade('Upgrade to receive reminders for premium sessions.');
      return;
    }
    await setLiveClassReminder(liveClass.id);
  };

  return (
    <>
      {/* Main Live Classes Container */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-950">Live Classes Now</h2>
              <p className="text-sm text-slate-600">Join peers learning right now • AI-picked for you</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            <Users className="h-4 w-4" />
            {loading ? 'Loading...' : `${liveClassesData.activeUsers.toLocaleString()} active`}
          </div>
        </div>

        {/* Featured + AI Insight + Recommendations Grid */}
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Featured Card (Left Column) */}
          <motion.div {...animationVariants.fadeInUp}>
            {loading ? (
              <div className="flex h-72 items-center justify-center rounded-[2rem] bg-slate-100 text-slate-500">Loading live classes...</div>
            ) : (
              liveClassesData.featured && (
                <FeaturedLiveCard
                  liveClass={liveClassesData.featured}
                  onJoin={() => handleJoinClass(liveClassesData.featured)}
                  onReminder={() => handleReminder(liveClassesData.featured)}
                />
              )
            )}
          </motion.div>

          {/* Right Column: AI Insight + Recommendations */}
          <motion.div className="space-y-6" variants={animationVariants.staggerContainer} initial="initial" animate="animate">
            {/* AI Insight Box */}
            <motion.div variants={animationVariants.fadeInUp}>
              <AIInsightBox studentProfile={studentProfile} liveClass={liveClassesData.featured || fallbackData.featured} />
            </motion.div>

            {/* Recommendations Stack */}
            <motion.div className="space-y-3" variants={animationVariants.staggerContainer} initial="initial" animate="animate">
              {(liveClassesData.recommendations || fallbackData.recommendations).slice(0, 3).map((cls, idx) => (
                <motion.div key={cls.id} variants={animationVariants.fadeInUp}>
                  <RecommendationCard className={cls} onJoin={() => handleJoinClass(cls)} showReason={idx === 0} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Replay Cards */}
        {(liveClassesData.replayData || replayData).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6"
          >
            <h3 className="font-display text-lg font-bold text-slate-950">📺 Replays & Recordings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {(liveClassesData.replayData || replayData).map((replay) => (
                <div key={replay.id} onClick={() => setSelectedReplay(replay)} role="button" tabIndex={0} className="cursor-pointer">
                  <ReplayCard replay={replay} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* Gamification Modal */}
      {showGamification && <GamificationRewards onClose={() => setShowGamification(false)} />}

      {/* Replay Detail Modal */}
      {selectedReplay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedReplay(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-[1.5rem] bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <ReplayCard replay={selectedReplay} detailed />
            <button onClick={() => setSelectedReplay(null)} className="mt-4 w-full rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
