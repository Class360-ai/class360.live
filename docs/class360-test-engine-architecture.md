# Class360 Test Engine Architecture

## Folder Structure

- `src/pages/TestSeries.jsx`: free/pro catalog, filters, custom test builder.
- `src/pages/TestPage.jsx`: timed exam runner, fullscreen mode, translations, section navigation, auto submit.
- `src/pages/TestResult.jsx`: analytics, ranks, weak-topic plan, mistake intelligence, prediction.
- `src/components/test/*`: reusable exam UI.
- `src/utils/testFlow.js`: scoring, negative marking, topic breakdown.
- `src/utils/testIntelligence.js`: translation adapter, mistake labels, ranks, planning helpers.
- `src/data/questions.js`: current local question bank. In production this maps to PostgreSQL question tables.

## Database Schema

Production should use Prisma with PostgreSQL. Core models:

```prisma
model User {
  id            String   @id @default(cuid())
  clerkId       String?  @unique
  name          String
  email         String   @unique
  role          Role     @default(STUDENT)
  preferredLang String   @default("en")
  schoolId      String?
  school        School?  @relation(fields: [schoolId], references: [id])
  attempts      Attempt[]
  doubts        Doubt[]
  xpEvents      XpEvent[]
  createdAt     DateTime @default(now())
}

model School {
  id       String @id @default(cuid())
  name     String
  district String
  state    String
  users    User[]
}

model Test {
  id          String @id @default(cuid())
  title       String
  exam        String
  access      TestAccess
  mode        TestMode
  durationSec Int
  negative    Float  @default(0.25)
  sections    TestSection[]
  attempts    Attempt[]
}

model TestSection {
  id        String @id @default(cuid())
  testId    String
  test      Test   @relation(fields: [testId], references: [id])
  title     String
  order     Int
  questions Question[]
}

model Question {
  id                 String @id @default(cuid())
  sectionId          String?
  section            TestSection? @relation(fields: [sectionId], references: [id])
  type               QuestionType @default(MCQ)
  subject            String
  chapter            String
  topic              String
  difficulty         String
  prompt             Json
  options            Json?
  answer             Json
  explanation        Json?
  examSource         String?
  pyqFrequency       Int @default(0)
  commonWrongOptions Json?
  relatedNotes       Note[]
  relatedVideos      Video[]
  attempts           AttemptAnswer[]
}

model Attempt {
  id            String @id @default(cuid())
  userId        String
  testId        String
  user          User   @relation(fields: [userId], references: [id])
  test          Test   @relation(fields: [testId], references: [id])
  score         Float
  accuracy      Float
  percentile    Float?
  timeSpentSec  Int
  autoSubmitted Boolean @default(false)
  answers       AttemptAnswer[]
  analytics     AttemptAnalytics?
  createdAt     DateTime @default(now())
}

model AttemptAnswer {
  id           String @id @default(cuid())
  attemptId    String
  questionId   String
  selected     Json?
  isCorrect    Boolean
  timeSpentSec Int
  mistakeType  MistakeType?
  attempt      Attempt  @relation(fields: [attemptId], references: [id])
  question     Question @relation(fields: [questionId], references: [id])
}

model AttemptAnalytics {
  id              String @id @default(cuid())
  attemptId       String @unique
  weakTopics      Json
  speedAnalysis   Json
  readinessScore  Float
  airPrediction   Int?
  studyPlan       Json
  attempt         Attempt @relation(fields: [attemptId], references: [id])
}

model Doubt {
  id        String @id @default(cuid())
  userId    String
  user      User   @relation(fields: [userId], references: [id])
  inputType DoubtInputType
  mediaUrl  String?
  text      String?
  status    DoubtStatus @default(AI_PENDING)
  createdAt DateTime @default(now())
}

model Note {
  id       String @id @default(cuid())
  topic    String
  content  Json
  questions Question[]
}

model Video {
  id       String @id @default(cuid())
  title    String
  url      String
  topic    String
  questions Question[]
}

model XpEvent {
  id        String @id @default(cuid())
  userId    String
  user      User   @relation(fields: [userId], references: [id])
  points    Int
  reason    String
  createdAt DateTime @default(now())
}

enum Role { STUDENT PARENT TEACHER ADMIN }
enum TestAccess { FREE PRO }
enum TestMode { DAILY_QUIZ WEEKLY_MOCK LIVE_TEST PYQ SECTIONAL FULL_LENGTH }
enum QuestionType { MCQ SUBJECTIVE }
enum MistakeType { CONCEPTUAL FORMULA CALCULATION TIME_PRESSURE SILLY }
enum DoubtInputType { IMAGE VOICE TEXT }
enum DoubtStatus { AI_PENDING TEACHER_PENDING RESOLVED }
```

## API Architecture

- `GET /api/tests`: filter by exam, access, mode, class, language.
- `POST /api/tests/:id/start`: create attempt, return signed question payload and server timer.
- `PATCH /api/attempts/:id/answers`: save answer and per-question time.
- `POST /api/attempts/:id/submit`: score, rank, analytics, weak topics, XP.
- `POST /api/questions/:id/translate`: AI translation with Redis cache by question/language/version.
- `GET /api/attempts/:id/analytics`: dashboard, ranks, prediction, mistake intelligence.
- `POST /api/pyq/import`: parse PDFs/images into interactive questions for admin review.
- `POST /api/doubts`: image/voice/text upload to S3 or Cloudinary, AI answer, teacher escalation.
- `GET /api/admin/live-tests`: live test scheduling, moderation, and monitoring.

## AI Workflow

1. Translate question text with cached OpenAI/Gemini output; never mutate selected answers.
2. Score deterministic answers server-side using canonical option IDs.
3. Classify wrong answers into conceptual, formula, calculation, time pressure, or silly mistake.
4. Generate weak-topic notes with formulas, tricks, PYQ patterns, diagrams, and common mistakes.
5. Recommend videos, practice sets, doubt sessions, and a 7-day study plan.
6. Predict percentile/AIR using attempt history, test difficulty, cohort statistics, and recency weighting.

## Production Notes

- Use server-side timers for live/high-stakes tests and client timers only for UI.
- Cache translations and generated notes aggressively for low-end Android and slow networks.
- Store question prompts/options as JSON with stable canonical option IDs for multilingual safety.
- Queue heavy AI jobs with BullMQ or Cloud Tasks so submit remains fast.
- Partition analytics tables by month when attempts cross Bharat-scale volume.
