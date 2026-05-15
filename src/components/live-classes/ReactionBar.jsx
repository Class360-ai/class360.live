import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ReactionBar() {
  const [reactions, setReactions] = useState({ '👍': 124, '🔥': 89, '🎯': 56, '💪': 34 });
  const [userReaction, setUserReaction] = useState(null);

  const toggleReaction = (emoji) => {
    if (userReaction === emoji) {
      setReactions({ ...reactions, [emoji]: reactions[emoji] - 1 });
      setUserReaction(null);
    } else {
      if (userReaction) setReactions({ ...reactions, [userReaction]: reactions[userReaction] - 1 });
      setReactions({ ...reactions, [emoji]: reactions[emoji] + 1 });
      setUserReaction(emoji);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-2">
      {Object.entries(reactions).map(([emoji, count]) => (
        <motion.button
          key={emoji}
          whileHover={{ scale: 1.1 }}
          onClick={() => toggleReaction(emoji)}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition ${
            userReaction === emoji ? 'bg-blue-100 ring-1 ring-blue-400' : 'bg-slate-100 hover:bg-slate-200'
          }`}
        >
          {emoji}
          <span className="min-w-[1.25rem]">{count}</span>
        </motion.button>
      ))}
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="rounded-full bg-slate-100 px-2 py-1.5 text-xs font-bold hover:bg-slate-200"
      >
        +
      </motion.button>
    </div>
  );
}
