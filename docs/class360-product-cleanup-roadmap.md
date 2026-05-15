# Class360 Product Cleanup Roadmap

## Keep

- AI student dashboard, test series, exam interface, post-test recovery, leaderboard, streaks, XP, weak-topic plans, and wrong-question recovery.
- School and competitive exam positioning: JEE, NEET, CUET, Olympiads, Navodaya, NDA, CBSE, and state boards.
- Mobile-first UX with fast test taking, answer autosave, translation, ranking, and recovery actions.

## Remove Or Hide

- Non-core primary navigation items that distract from learning outcomes.
- Public admin demo routes and any development-only admin bypasses.
- Duplicate legacy pages that can confuse future development.
- Broken or unfinished feature links from the homepage.
- Any fake authority for premium, admin, ranking, or certificate unlocks before backend validation exists.

## Improve First

- Replace localStorage auth with Clerk/Auth.js or a backend session system.
- Move tests, questions, attempts, rankings, premium status, and referrals to PostgreSQL with Prisma.
- Add server-validated admin permissions.
- Convert AI insights from static demo data into API-generated recommendations.
- Add real content models for videos, PDFs, flashcards, PYQs, notes, and doubt sessions.

## Add Next

- Doubt center with typed, image, and voice input.
- Parent mode with study hours, weak areas, consistency, and AI suggestions.
- Teacher/admin content workflow for question review, PYQ tagging, and moderation.
- Real payment and entitlement flow for Pro.
- Observability: event tracking for test starts, submissions, weak-topic recovery, streak completion, referrals, and premium conversion.

## Billion-Dollar Rule

Every screen should answer one question clearly:

> What should the student do next to improve?

If a feature does not improve learning outcome, retention, trust, or revenue, hide it until it does.
