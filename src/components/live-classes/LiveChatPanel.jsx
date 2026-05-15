import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile } from 'lucide-react';

export default function LiveChatPanel() {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Dr. Priya', role: 'teacher', message: 'Welcome everyone! Ready to dive into bonding?', time: '2:15' },
    { id: 2, user: 'Arjun', role: 'student', message: 'Yeah! Excited for today', time: '2:20' },
    { id: 3, user: 'Meera', role: 'student', message: 'Can you explain ionic bonding first?', time: '2:22' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, user: 'You', role: 'student', message: input, time: 'now' }]);
      setInput('');
    }
  };

  return (
    <div className="flex h-96 flex-col rounded-[1.5rem] border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-sm font-bold text-slate-950">💬 Live Chat</p>
        <p className="text-xs text-slate-600">{messages.length} messages</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 px-4 py-3">
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              {msg.user[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-slate-950">{msg.user}</p>
                {msg.role === 'teacher' && <span className="text-[9px] font-bold text-orange-600">TEACHER</span>}
                <p className="text-[10px] text-slate-500">{msg.time}</p>
              </div>
              <p className="mt-1 text-xs text-slate-700">{msg.message}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs placeholder:text-slate-500"
          />
          <button onClick={handleSend} className="rounded-full bg-blue-600 p-2 text-white">
            <Send className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
