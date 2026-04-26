# Sequential Course Unlock System

## Folder map

- `server/controllers/sequentialCourseController.js`
- `server/routes/sequentialCourseRoutes.js`
- `server/models/SequentialCourseProgress.js`
- `server/models/User.js`
- `server/utils/sequentialCourseUtils.js`
- `src/data/sequentialCourse.js`
- `src/context/SequentialCourseContext.jsx`
- `src/services/sequentialCourseApi.js`
- `src/components/sequential-course/*`
- `src/pages/SequentialCourseDashboardPage.jsx`
- `src/pages/SequentialCourseLessonPage.jsx`

## Run locally

1. Frontend
   `npm install`
   `npm run dev`

2. Backend
   `cd server`
   `npm install`
   `npm run dev`

3. Optional MongoDB
   Set `MONGODB_URI` before starting the server.
   Example:
   `set MONGODB_URI=mongodb://127.0.0.1:27017/class360`

If `MONGODB_URI` is not present, the backend still works with in-memory fallback storage for local testing.

## Routes

- `GET /api/sequential-course/days`
- `GET /api/sequential-course/days/:dayNumber`
- `POST /api/sequential-course/update-progress`
- `POST /api/sequential-course/track/video`
- `POST /api/sequential-course/track/notes`
- `POST /api/sequential-course/track/podcast`
- `POST /api/sequential-course/track/quiz`
- `GET /api/sequential-course/user-progress`
- `GET /api/sequential-course/unlock-status`

Pass `userId`, `email`, and `name` as query params for GET requests. The frontend already sends them automatically.

## Example test payload

```json
{
  "userId": "student@class360.live",
  "email": "student@class360.live",
  "name": "Demo Student",
  "dayNumber": 1,
  "videoProgress": 96,
  "notesOpened": true,
  "notesTime": 33,
  "podcastProgress": 84,
  "quizScore": 75,
  "quizPassed": true,
  "quizAttempted": true,
  "quizTimeTaken": 58,
  "weakAreas": ["Risk sizing basics"]
}
```

Sample seed progress is included in `server/seed/sequentialCourseDemoData.json`.
