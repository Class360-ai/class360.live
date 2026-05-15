import { motion } from 'framer-motion';

export default function AttendeeAvatars() {
  const attendees = [
    { name: 'Arjun', color: 'bg-blue-500' },
    { name: 'Meera', color: 'bg-purple-500' },
    { name: 'Priya', color: 'bg-green-500' },
    { name: 'Vikram', color: 'bg-pink-500' },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {attendees.map((attendee, idx) => (
        <motion.div
          key={attendee.name}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: idx * 0.1 }}
          className={`flex h-8 w-8 items-center justify-center rounded-full ${attendee.color} text-xs font-bold text-white ring-2 ring-white`}
        >
          {attendee.name[0]}
        </motion.div>
      ))}
      <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 ring-2 ring-white">
        +2.8K
      </div>
    </div>
  );
}
