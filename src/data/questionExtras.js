function q(spec) {
  return {
    ...spec,
    type: 'mcq',
    tags: spec.tags || [],
  };
}

export const questionExtras = {
  maths: { easy: [], medium: [], hard: [] },
  science: { easy: [], medium: [], hard: [] },
  english: { easy: [], medium: [], hard: [] },
  reasoning: { easy: [], medium: [], hard: [] },
  gk: { easy: [], medium: [], hard: [] },
};

questionExtras.maths.easy = [
  q({ id: 'maths-e11', subject: 'Maths', difficulty: 'easy', topic: 'Number System', question: 'What is the place value of 8 in 4,582?', options: ['8', '80', '800', '8000'], correctAnswer: '80', explanation: '8 is in the tens place.', tags: ['number-system'] }),
  q({ id: 'maths-e12', subject: 'Maths', difficulty: 'easy', topic: 'Number System', question: 'Which number is even?', options: ['13', '17', '24', '31'], correctAnswer: '24', explanation: '24 is divisible by 2.', tags: ['number-system'] }),
  q({ id: 'maths-e13', subject: 'Maths', difficulty: 'easy', topic: 'Algebra', question: 'If y - 4 = 9, what is y?', options: ['10', '11', '12', '13'], correctAnswer: '13', explanation: 'Add 4 to both sides.', tags: ['algebra'] }),
  q({ id: 'maths-e14', subject: 'Maths', difficulty: 'easy', topic: 'Geometry', question: 'How many vertices does a cube have?', options: ['6', '8', '10', '12'], correctAnswer: '8', explanation: 'A cube has 8 vertices.', tags: ['geometry'] }),
  q({ id: 'maths-e15', subject: 'Maths', difficulty: 'easy', topic: 'Mensuration', question: 'Perimeter of a rectangle with sides 6 and 4 is:', options: ['10', '12', '20', '24'], correctAnswer: '20', explanation: 'Perimeter = 2(l + b).', tags: ['mensuration'] }),
];

questionExtras.maths.medium = [
  q({ id: 'maths-m11', subject: 'Maths', difficulty: 'medium', topic: 'Number System', question: 'What is the HCF of 16 and 24?', options: ['4', '6', '8', '12'], correctAnswer: '8', explanation: '8 divides both numbers.', tags: ['number-system'] }),
  q({ id: 'maths-m12', subject: 'Maths', difficulty: 'medium', topic: 'Algebra', question: 'Solve: 3x + 2 = 20', options: ['5', '6', '7', '8'], correctAnswer: '6', explanation: 'Subtract 2 and divide by 3.', tags: ['algebra'] }),
  q({ id: 'maths-m13', subject: 'Maths', difficulty: 'medium', topic: 'Geometry', question: 'Each angle of an equilateral triangle is:', options: ['45 degrees', '50 degrees', '60 degrees', '90 degrees'], correctAnswer: '60 degrees', explanation: 'All angles are equal and total 180 degrees.', tags: ['geometry'] }),
  q({ id: 'maths-m14', subject: 'Maths', difficulty: 'medium', topic: 'Mensuration', question: 'Area of a square with side 9 cm is:', options: ['18', '27', '81', '90'], correctAnswer: '81', explanation: 'Area = side x side.', tags: ['mensuration'] }),
  q({ id: 'maths-m15', subject: 'Maths', difficulty: 'medium', topic: 'Simplification', question: 'What is 72 / 9?', options: ['6', '7', '8', '9'], correctAnswer: '8', explanation: '72 divided by 9 equals 8.', tags: ['simplification'] }),
];

questionExtras.maths.hard = [
  q({ id: 'maths-h11', subject: 'Maths', difficulty: 'hard', topic: 'Number System', question: 'Which number is a perfect square?', options: ['45', '50', '64', '72'], correctAnswer: '64', explanation: '64 is 8 squared.', tags: ['number-system'] }),
  q({ id: 'maths-h12', subject: 'Maths', difficulty: 'hard', topic: 'Algebra', question: 'If 2x + 7 = 25, what is x?', options: ['6', '7', '8', '9'], correctAnswer: '9', explanation: 'Subtract 7, then divide by 2.', tags: ['algebra'] }),
  q({ id: 'maths-h13', subject: 'Maths', difficulty: 'hard', topic: 'Geometry', question: 'Number of lines of symmetry in a square:', options: ['2', '3', '4', '5'], correctAnswer: '4', explanation: 'A square has 4 lines of symmetry.', tags: ['geometry'] }),
  q({ id: 'maths-h14', subject: 'Maths', difficulty: 'hard', topic: 'Mensuration', question: 'Area of a circle of radius 14 cm using pi = 22/7 is:', options: ['154 cm2', '308 cm2', '616 cm2', '88 cm2'], correctAnswer: '616 cm2', explanation: 'Area = pi r squared = 22/7 x 196.', tags: ['mensuration'] }),
  q({ id: 'maths-h15', subject: 'Maths', difficulty: 'hard', topic: 'Simplification', question: 'What is 125 x 8?', options: ['600', '800', '1000', '1200'], correctAnswer: '1000', explanation: '125 times 8 equals 1000.', tags: ['simplification'] }),
];

questionExtras.science.easy = [
  q({ id: 'science-e11', subject: 'Science', difficulty: 'easy', topic: 'Physics', question: 'Which is a source of heat?', options: ['Ice', 'Sun', 'Water', 'Stone'], correctAnswer: 'Sun', explanation: 'The Sun gives off heat.', tags: ['physics'] }),
  q({ id: 'science-e12', subject: 'Science', difficulty: 'easy', topic: 'Chemistry', question: 'Milk is best described as a:', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correctAnswer: 'Liquid', explanation: 'Milk flows and takes container shape.', tags: ['chemistry'] }),
  q({ id: 'science-e13', subject: 'Science', difficulty: 'easy', topic: 'Biology', question: 'Plants need sunlight mainly for:', options: ['Movement', 'Photosynthesis', 'Digestion', 'Evaporation'], correctAnswer: 'Photosynthesis', explanation: 'Sunlight helps plants make food.', tags: ['biology'] }),
  q({ id: 'science-e14', subject: 'Science', difficulty: 'easy', topic: 'Physics', question: 'The force that opposes motion is:', options: ['Gravity', 'Friction', 'Magnetism', 'Tension'], correctAnswer: 'Friction', explanation: 'Friction resists motion between surfaces.', tags: ['physics'] }),
  q({ id: 'science-e15', subject: 'Science', difficulty: 'easy', topic: 'Biology', question: 'Which part of the plant carries water upward?', options: ['Root', 'Stem', 'Leaf', 'Flower'], correctAnswer: 'Stem', explanation: 'The stem transports water through the plant.', tags: ['biology'] }),
];

questionExtras.science.medium = [
  q({ id: 'science-m11', subject: 'Science', difficulty: 'medium', topic: 'Physics', question: 'The speedometer in a car measures:', options: ['Distance', 'Speed', 'Force', 'Pressure'], correctAnswer: 'Speed', explanation: 'It shows how fast the car is moving.', tags: ['physics'] }),
  q({ id: 'science-m12', subject: 'Science', difficulty: 'medium', topic: 'Chemistry', question: 'The symbol for sodium is:', options: ['So', 'Na', 'Sd', 'Sn'], correctAnswer: 'Na', explanation: 'Na is the chemical symbol for sodium.', tags: ['chemistry'] }),
  q({ id: 'science-m13', subject: 'Science', difficulty: 'medium', topic: 'Biology', question: 'Which part of the human body makes insulin?', options: ['Liver', 'Pancreas', 'Kidney', 'Lungs'], correctAnswer: 'Pancreas', explanation: 'The pancreas produces insulin.', tags: ['biology'] }),
  q({ id: 'science-m14', subject: 'Science', difficulty: 'medium', topic: 'Physics', question: 'A shadow is formed when light is:', options: ['Reflected', 'Blocked', 'Bent', 'Stored'], correctAnswer: 'Blocked', explanation: 'An object blocks light to create a shadow.', tags: ['physics'] }),
  q({ id: 'science-m15', subject: 'Science', difficulty: 'medium', topic: 'Biology', question: 'The exchange of gases in lungs happens in the:', options: ['Trachea', 'Alveoli', 'Heart', 'Stomach'], correctAnswer: 'Alveoli', explanation: 'Alveoli are tiny air sacs in the lungs.', tags: ['biology'] }),
];

questionExtras.science.hard = [
  q({ id: 'science-h11', subject: 'Science', difficulty: 'hard', topic: 'Chemistry', question: 'Which particle has a negative charge?', options: ['Proton', 'Neutron', 'Electron', 'Nucleus'], correctAnswer: 'Electron', explanation: 'Electrons carry negative charge.', tags: ['chemistry'] }),
  q({ id: 'science-h12', subject: 'Science', difficulty: 'hard', topic: 'Physics', question: 'The law of inertia is associated with:', options: ['Newton', 'Einstein', 'Bohr', 'Tesla'], correctAnswer: 'Newton', explanation: 'Newton described inertia in the first law.', tags: ['physics'] }),
  q({ id: 'science-h13', subject: 'Science', difficulty: 'hard', topic: 'Biology', question: 'The process of oxygen exchange in tissues is called:', options: ['Diffusion', 'Osmosis', 'Respiration', 'Transpiration'], correctAnswer: 'Diffusion', explanation: 'Gases move by diffusion across membranes.', tags: ['biology'] }),
  q({ id: 'science-h14', subject: 'Science', difficulty: 'hard', topic: 'Chemistry', question: 'The pH of lemon juice is generally:', options: ['Above 7', 'Equal to 7', 'Below 7', '14'], correctAnswer: 'Below 7', explanation: 'Acids have pH less than 7.', tags: ['chemistry'] }),
  q({ id: 'science-h15', subject: 'Science', difficulty: 'hard', topic: 'Physics', question: 'Which mirror is used as a rear-view mirror in vehicles?', options: ['Plane', 'Concave', 'Convex', 'Parabolic'], correctAnswer: 'Convex', explanation: 'Convex mirrors give a wider field of view.', tags: ['physics'] }),
];

questionExtras.english.easy = [
  q({ id: 'english-e8', subject: 'English', difficulty: 'easy', topic: 'Grammar', question: 'Choose the correct sentence.', options: ['He are late.', 'He is late.', 'He were late.', 'He be late.'], correctAnswer: 'He is late.', explanation: 'He takes the singular verb is.', tags: ['grammar'] }),
  q({ id: 'english-e9', subject: 'English', difficulty: 'easy', topic: 'Vocabulary', question: 'The antonym of early is:', options: ['Soon', 'Late', 'Fast', 'Quick'], correctAnswer: 'Late', explanation: 'Late is opposite to early.', tags: ['vocabulary'] }),
  q({ id: 'english-e10', subject: 'English', difficulty: 'easy', topic: 'Reading', question: 'A heading usually tells us the:', options: ['Main idea', 'Last line', 'Author name', 'Page number'], correctAnswer: 'Main idea', explanation: 'Headings point to the topic.', tags: ['reading'] }),
  q({ id: 'english-e11', subject: 'English', difficulty: 'easy', topic: 'Grammar', question: 'Choose the plural of box.', options: ['Boxs', 'Boxes', 'Boxies', 'Boxen'], correctAnswer: 'Boxes', explanation: 'Words ending in x add es.', tags: ['grammar'] }),
  q({ id: 'english-e12', subject: 'English', difficulty: 'easy', topic: 'Vocabulary', question: 'Choose the synonym of small.', options: ['Tiny', 'Huge', 'Heavy', 'Loud'], correctAnswer: 'Tiny', explanation: 'Tiny means small.', tags: ['vocabulary'] }),
];

questionExtras.english.medium = [
  q({ id: 'english-m8', subject: 'English', difficulty: 'medium', topic: 'Grammar', question: 'Choose the correct passive voice: They wrote the letter.', options: ['The letter was written by them.', 'The letter is written by them.', 'The letter will write by them.', 'The letter wrote by them.'], correctAnswer: 'The letter was written by them.', explanation: 'Past tense active becomes past passive.', tags: ['grammar'] }),
  q({ id: 'english-m9', subject: 'English', difficulty: 'medium', topic: 'Reading', question: 'The word inference means:', options: ['A guess from clues', 'A dictionary entry', 'A title', 'A rhyme'], correctAnswer: 'A guess from clues', explanation: 'Inference is a logical conclusion.', tags: ['reading'] }),
  q({ id: 'english-m10', subject: 'English', difficulty: 'medium', topic: 'Vocabulary', question: 'Choose the meaning of brave.', options: ['Fearful', 'Courageous', 'Lazy', 'Quiet'], correctAnswer: 'Courageous', explanation: 'Brave means courageous.', tags: ['vocabulary'] }),
  q({ id: 'english-m11', subject: 'English', difficulty: 'medium', topic: 'Grammar', question: 'Identify the adjective in the sentence: The red car moved fast.', options: ['car', 'moved', 'red', 'fast'], correctAnswer: 'red', explanation: 'Red describes the car.', tags: ['grammar'] }),
  q({ id: 'english-m12', subject: 'English', difficulty: 'medium', topic: 'Reading', question: 'A conclusion in a passage is:', options: ['A direct copy', 'A final idea', 'A title', 'A mistake'], correctAnswer: 'A final idea', explanation: 'Conclusion wraps up the passage.', tags: ['reading'] }),
];

questionExtras.english.hard = [
  q({ id: 'english-h7', subject: 'English', difficulty: 'hard', topic: 'Grammar', question: 'Choose the correct tense: She has been studying for two hours.', options: ['Simple present', 'Present perfect continuous', 'Past perfect', 'Future continuous'], correctAnswer: 'Present perfect continuous', explanation: 'has been studying indicates present perfect continuous.', tags: ['grammar'] }),
  q({ id: 'english-h8', subject: 'English', difficulty: 'hard', topic: 'Vocabulary', question: 'Choose the closest meaning of resilient.', options: ['Fragile', 'Strong', 'Weak', 'Silent'], correctAnswer: 'Strong', explanation: 'Resilient means strong and able to recover.', tags: ['vocabulary'] }),
  q({ id: 'english-h9', subject: 'English', difficulty: 'hard', topic: 'Reading', question: 'The tone of a formal letter is usually:', options: ['Casual', 'Respectful', 'Funny', 'Angry'], correctAnswer: 'Respectful', explanation: 'Formal letters use respectful tone.', tags: ['reading'] }),
  q({ id: 'english-h10', subject: 'English', difficulty: 'hard', topic: 'Grammar', question: 'Choose the correct sentence.', options: ['Neither of the boys are ready.', 'Neither of the boys is ready.', 'Neither of the boys were ready.', 'Neither of the boys be ready.'], correctAnswer: 'Neither of the boys is ready.', explanation: 'Neither is singular in this structure.', tags: ['grammar'] }),
  q({ id: 'english-h11', subject: 'English', difficulty: 'hard', topic: 'Vocabulary', question: 'Choose the antonym of humble.', options: ['Modest', 'Arrogant', 'Kind', 'Silent'], correctAnswer: 'Arrogant', explanation: 'Arrogant is opposite to humble.', tags: ['vocabulary'] }),
];

questionExtras.reasoning.easy = [
  q({ id: 'reasoning-e8', subject: 'Reasoning', difficulty: 'easy', topic: 'Series', question: 'Find the next number: 5, 10, 15, 20, __', options: ['24', '25', '26', '30'], correctAnswer: '25', explanation: 'The series adds 5 each time.', tags: ['series'] }),
  q({ id: 'reasoning-e9', subject: 'Reasoning', difficulty: 'easy', topic: 'Analogy', question: 'Pen is to write as knife is to:', options: ['Read', 'Cut', 'Sing', 'Wash'], correctAnswer: 'Cut', explanation: 'A knife is used to cut.', tags: ['analogy'] }),
  q({ id: 'reasoning-e10', subject: 'Reasoning', difficulty: 'easy', topic: 'Direction Sense', question: 'If you face north and turn right, you face:', options: ['East', 'West', 'South', 'North'], correctAnswer: 'East', explanation: 'Right of north is east.', tags: ['direction-sense'] }),
  q({ id: 'reasoning-e11', subject: 'Reasoning', difficulty: 'easy', topic: 'Series', question: 'Find the next number: 11, 22, 33, 44, __', options: ['45', '54', '55', '66'], correctAnswer: '55', explanation: 'Add 11 each time.', tags: ['series'] }),
  q({ id: 'reasoning-e12', subject: 'Reasoning', difficulty: 'easy', topic: 'Analogy', question: 'Eye is to see as ear is to:', options: ['Feel', 'Hear', 'Taste', 'Smell'], correctAnswer: 'Hear', explanation: 'Ears are used to hear.', tags: ['analogy'] }),
];

questionExtras.reasoning.medium = [
  q({ id: 'reasoning-m8', subject: 'Reasoning', difficulty: 'medium', topic: 'Direction Sense', question: 'A person walks 3 km east and 4 km north. Distance from start is:', options: ['5 km', '6 km', '7 km', '8 km'], correctAnswer: '5 km', explanation: 'Use Pythagoras theorem: 3-4-5 triangle.', tags: ['direction-sense'] }),
  q({ id: 'reasoning-m9', subject: 'Reasoning', difficulty: 'medium', topic: 'Coding-Decoding', question: 'If MAP is coded as NCR, how is BUS coded?', options: ['DWT', 'CVT', 'DVS', 'EVT'], correctAnswer: 'DWT', explanation: 'Each letter moves two steps forward.', tags: ['coding-decoding'] }),
  q({ id: 'reasoning-m10', subject: 'Reasoning', difficulty: 'medium', topic: 'Series', question: 'Find the missing number: 1, 4, 9, 16, __', options: ['20', '24', '25', '30'], correctAnswer: '25', explanation: 'These are square numbers.', tags: ['series'] }),
  q({ id: 'reasoning-m11', subject: 'Reasoning', difficulty: 'medium', topic: 'Analogy', question: 'Bird is to nest as bee is to:', options: ['Hive', 'Web', 'Den', 'Burrow'], correctAnswer: 'Hive', explanation: 'Bees live in hives.', tags: ['analogy'] }),
  q({ id: 'reasoning-m12', subject: 'Reasoning', difficulty: 'medium', topic: 'Direction Sense', question: 'A person faces west, turns left, then right. Final direction is:', options: ['North', 'South', 'East', 'West'], correctAnswer: 'West', explanation: 'Left then right brings the person back to west.', tags: ['direction-sense'] }),
];

questionExtras.reasoning.hard = [
  q({ id: 'reasoning-h7', subject: 'Reasoning', difficulty: 'hard', topic: 'Syllogism', question: 'All cats are animals. Some animals are pets. Conclusion: Some cats are pets.', options: ['True', 'False', 'Cannot be determined', 'None of these'], correctAnswer: 'Cannot be determined', explanation: 'The overlap is not guaranteed.', tags: ['syllogism'] }),
  q({ id: 'reasoning-h8', subject: 'Reasoning', difficulty: 'hard', topic: 'Coding-Decoding', question: 'If TRAIN is coded as USBJO, how is PLANE coded?', options: ['QMBOF', 'QMBNF', 'QLBOF', 'RMBOF'], correctAnswer: 'QMBOF', explanation: 'Each letter is shifted one step forward.', tags: ['coding-decoding'] }),
  q({ id: 'reasoning-h9', subject: 'Reasoning', difficulty: 'hard', topic: 'Puzzles', question: 'If all boxes are containers and some containers are red, which is always true?', options: ['All boxes are red', 'Some boxes may be red', 'No boxes are containers', 'All containers are boxes'], correctAnswer: 'Some boxes may be red', explanation: 'Some containers are red, but not necessarily all boxes.', tags: ['puzzles'] }),
  q({ id: 'reasoning-h10', subject: 'Reasoning', difficulty: 'hard', topic: 'Direction Sense', question: 'A person walks 8 m north, 6 m east, 8 m south. How far from start?', options: ['0 m', '4 m', '6 m', '8 m'], correctAnswer: '6 m', explanation: 'North and south cancel, leaving 6 m east.', tags: ['direction-sense'] }),
  q({ id: 'reasoning-h11', subject: 'Reasoning', difficulty: 'hard', topic: 'Series', question: 'Find the next number: 2, 6, 18, 54, __', options: ['108', '144', '162', '216'], correctAnswer: '162', explanation: 'Multiply by 3 each time.', tags: ['series'] }),
];

questionExtras.gk.easy = [
  q({ id: 'gk-e8', subject: 'General Knowledge', difficulty: 'easy', topic: 'Indian Polity', question: 'India is a:', options: ['Monarchy', 'Republic', 'Empire', 'Dictatorship'], correctAnswer: 'Republic', explanation: 'India is a sovereign democratic republic.', tags: ['polity'] }),
  q({ id: 'gk-e9', subject: 'General Knowledge', difficulty: 'easy', topic: 'History', question: 'Who founded the Mughal Empire in India?', options: ['Akbar', 'Babur', 'Shah Jahan', 'Aurangzeb'], correctAnswer: 'Babur', explanation: 'Babur founded the Mughal Empire.', tags: ['history'] }),
  q({ id: 'gk-e10', subject: 'General Knowledge', difficulty: 'easy', topic: 'Geography', question: 'Which is the largest state in India by area?', options: ['Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh'], correctAnswer: 'Rajasthan', explanation: 'Rajasthan is the largest by area.', tags: ['geography'] }),
  q({ id: 'gk-e11', subject: 'General Knowledge', difficulty: 'easy', topic: 'Current Affairs', question: 'How many days are there in February in a leap year?', options: ['28', '29', '30', '31'], correctAnswer: '29', explanation: 'Leap years add one extra day in February.', tags: ['current-affairs'] }),
  q({ id: 'gk-e12', subject: 'General Knowledge', difficulty: 'easy', topic: 'Indian Polity', question: 'The Indian Parliament has how many Houses?', options: ['1', '2', '3', '4'], correctAnswer: '2', explanation: 'Lok Sabha and Rajya Sabha.', tags: ['polity'] }),
];

questionExtras.gk.medium = [
  q({ id: 'gk-m8', subject: 'General Knowledge', difficulty: 'medium', topic: 'History', question: 'The Quit India Movement began in which year?', options: ['1930', '1942', '1947', '1950'], correctAnswer: '1942', explanation: 'The movement started in 1942.', tags: ['history'] }),
  q({ id: 'gk-m9', subject: 'General Knowledge', difficulty: 'medium', topic: 'Geography', question: 'The capital of Australia is:', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctAnswer: 'Canberra', explanation: 'Canberra is the capital city of Australia.', tags: ['geography'] }),
  q({ id: 'gk-m10', subject: 'General Knowledge', difficulty: 'medium', topic: 'Indian Polity', question: 'The Rajya Sabha is the:', options: ['Lower House', 'Upper House', 'Court', 'Council'], correctAnswer: 'Upper House', explanation: 'Rajya Sabha is the upper house of Parliament.', tags: ['polity'] }),
  q({ id: 'gk-m11', subject: 'General Knowledge', difficulty: 'medium', topic: 'Current Affairs', question: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], correctAnswer: 'Mercury', explanation: 'Mercury is nearest to the Sun.', tags: ['current-affairs', 'science-fact'] }),
  q({ id: 'gk-m12', subject: 'General Knowledge', difficulty: 'medium', topic: 'History', question: 'The Jallianwala Bagh incident took place in:', options: ['1919', '1925', '1930', '1947'], correctAnswer: '1919', explanation: 'The massacre happened in 1919.', tags: ['history'] }),
];

questionExtras.gk.hard = [
  q({ id: 'gk-h8', subject: 'General Knowledge', difficulty: 'hard', topic: 'Indian Polity', question: 'The Supreme Court of India was established in:', options: ['1947', '1950', '1952', '1962'], correctAnswer: '1950', explanation: 'It was established when the Constitution came into effect.', tags: ['polity'] }),
  q({ id: 'gk-h9', subject: 'General Knowledge', difficulty: 'hard', topic: 'History', question: 'Who was the leader of the Bardoli Satyagraha?', options: ['Nehru', 'Patel', 'Bose', 'Gandhi'], correctAnswer: 'Patel', explanation: 'Sardar Patel led the Bardoli Satyagraha.', tags: ['history'] }),
  q({ id: 'gk-h10', subject: 'General Knowledge', difficulty: 'hard', topic: 'Geography', question: 'The Drakensberg Mountains are in:', options: ['India', 'South Africa', 'Canada', 'Brazil'], correctAnswer: 'South Africa', explanation: 'The Drakensberg range is in South Africa.', tags: ['geography'] }),
  q({ id: 'gk-h11', subject: 'General Knowledge', difficulty: 'hard', topic: 'Current Affairs', question: 'The Suez Canal connects the Mediterranean Sea with the:', options: ['Atlantic Ocean', 'Red Sea', 'Indian Ocean', 'Black Sea'], correctAnswer: 'Red Sea', explanation: 'The canal links the Mediterranean and Red Sea.', tags: ['current-affairs'] }),
  q({ id: 'gk-h12', subject: 'General Knowledge', difficulty: 'hard', topic: 'Indian Polity', question: 'How many Fundamental Duties are there in the Indian Constitution?', options: ['8', '10', '11', '14'], correctAnswer: '11', explanation: 'India currently has 11 Fundamental Duties.', tags: ['polity'] }),
];
