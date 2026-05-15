# Class360 AI Learning Recovery Content System

## Purpose

Convert every wrong answer into a guided recovery plan: videos, notes, formula sheets, flashcards, PYQs, micro tests, doubts, retention checks, and parent insights.

## Scalable Content Models

```prisma
model LearningAsset {
  id          String @id @default(cuid())
  topicId     String
  type        AssetType
  title       String
  url         String
  durationSec Int?
  difficulty  String
  teacherName String?
  metadata    Json
  topic       Topic @relation(fields: [topicId], references: [id])
}

model RecoveryPlan {
  id          String @id @default(cuid())
  attemptId   String
  userId      String
  weakTopics  Json
  tasks       RecoveryTask[]
  readiness   Float
  nextScore   Float
  createdAt   DateTime @default(now())
}

model RecoveryTask {
  id          String @id @default(cuid())
  planId      String
  topicId     String
  type        RecoveryTaskType
  title       String
  dueAt       DateTime
  status      TaskStatus @default(PENDING)
  xpReward    Int
  plan        RecoveryPlan @relation(fields: [planId], references: [id])
}

model RetentionCheck {
  id          String @id @default(cuid())
  userId      String
  questionId  String
  intervalDay Int
  dueAt       DateTime
  completedAt DateTime?
}

enum AssetType { VIDEO PDF NOTES FORMULA_SHEET MIND_MAP FLASHCARD PYQ MICRO_TEST }
enum RecoveryTaskType { VIDEO NOTES FLASHCARDS PYQ_DRILL MINI_TEST RETENTION_CHECK DOUBT }
enum TaskStatus { PENDING DONE SKIPPED }
```

## AI Pipeline

1. Score attempt and classify every wrong answer.
2. Map mistakes to topics, chapters, formulas, and prior question patterns.
3. Retrieve ranked assets by topic, difficulty, language, and exam target.
4. Generate recovery tasks and spaced repetition checks for 1, 3, 7, and 15 days.
5. Predict next score, burnout risk, readiness, and ideal retest timing.
6. Send parent summary only after simplifying sensitive student details.
