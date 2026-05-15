import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function QuizPopup({ onClose }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    { q: 'What is ionic bonding?', options: ['Transfer of electrons', 'Sharing electrons', 'Overlap of orbitals', 'Van der Waals forces'], correct: 0 },
    { q: 'Example of covalent bond?', options: ['NaCl', 'H2O', 'MgO', 'CaCl2'], correct: 1 },
    { q: 'Bond angle in tetrahedral?', options: ['90°', '109.5°', '120°', '180°'], correct: 1 },
    { q: 'Strongest bond type?', options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], correct: 0 },
    { q: 'Which is polar covalent?', options: ['O2', 'N2', 'H2O', 'CO2'], correct: 2 },
  ];

  const handleAnswer = (idx) => {
    setAnswers({ ...answers, [currentQ]: idx });
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
    }
  };

  const correct = Object.entries(answers).filter(([q, ans]) => questions[parseInt(q)].correct === ans).length;

  if (showResults) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[1.5rem] bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center">
        <div className="text-4xl font-bold text-emerald-600">{Math.round((correct / questions.length) * 100)}%</div>
        <p className="mt-2 text-sm font-semibold text-slate-700">
          {correct}/{questions.length} correct
        </p>
        <button onClick={onClose} className="mt-4 w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
          Close
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[1.5rem] bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-bold text-slate-950">📝 Quiz</p>
        <button onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <motion.div className="h-full bg-blue-600" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-600">
        Question {currentQ + 1}/{questions.length}
      </p>

      <h3 className="mt-3 font-display text-base font-bold text-slate-950">{questions[currentQ].q}</h3>

      <div className="mt-4 space-y-2">
        {questions[currentQ].options.map((option, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleAnswer(idx)}
            className={`w-full rounded-lg border-2 p-3 text-left text-sm font-semibold transition ${
              answers[currentQ] === idx
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
