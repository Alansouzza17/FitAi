# FitIA

App web React/TypeScript mobile-first with Firebase Authentication/Firestore, server-side Gemini generation, and PWA support.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env` and fill the Firebase Web config. Add the Firebase Admin service account JSON and Gemini key for AI generation. `.env` is ignored by Git.
3. Enable Email/Password in Firebase Authentication and deploy `firestore.rules` to the project's Firestore rules.
4. Run `npm ci` then `npm run dev`. For the production server locally, run `npm run build` then `npm start`; Node loads the local `.env` automatically.

The app uses `/api/generate-workout`. In local development, run `npm start` after `npm run build` to serve the UI and API together. Vercel runs the same endpoint as a serverless function.

## GitHub, Vercel, Render

The repository is configured for both providers. The actual secret values are deliberately not stored in GitHub; enter them manually in each provider's Environment Variables settings:

See [`CREDENTIALS.md`](./CREDENTIALS.md) for the exact Firebase, Gemini, Render, and Vercel setup steps and environment-variable names.

- **Vercel:** Import `Alansouzza17/FitAi`, framework Vite, build `npm run build`, output `dist`. Add the variables listed in `.env.example` under Project Settings → Environment Variables. Apply `VITE_FIREBASE_*` to Production and Preview builds; `FIREBASE_SERVICE_ACCOUNT` and `GEMINI_API_KEY` are server-only. API route is `api/generate-workout.js`.
- **Render:** Create a Blueprint from this repository's `render.yaml`. Its `sync: false` entries prompt for the values during setup, or add them later under the service's Environment tab. It runs `npm start`, serves the built SPA and `/api/health`, and exposes the API to the same origin.
- Pushes to the connected production branch trigger provider builds. Both are set up to use `main` by default.

Never commit `.env`, Firebase Admin JSON, or the Gemini API key. Firebase Web configuration is public client configuration; Firebase Admin JSON and Gemini API key are server-only secrets. `FIREBASE_SERVICE_ACCOUNT` must be the complete JSON for the Admin SDK service account, serialized as a single line for `.env`.

## Before first use

Set the same Firebase project in Vercel/Render: the Firebase Web config and Admin service account must match. Enable Email/Password sign-in. Apply `firestore.rules` in Firebase Console or Firebase CLI. Without these secrets, the app shows the Firebase configuration prompt and the API refuses generation; it will not return a fake workout.

The Firebase CLI default project is set to `fitai-7dc19` in `.firebaserc`, and the same ID is prefilled as `VITE_FIREBASE_PROJECT_ID`. The remaining web app settings (`apiKey`, `authDomain`, `storageBucket`, `messagingSenderId`, and `appId`) must come from a registered Web app in that Firebase project.

The AI endpoint verifies the Firebase ID token, validates the profile and model output with Zod, applies a timeout, and calls Gemini from the server. Firestore stores each user's profile/plan under their authenticated UID.

## PWA

`public/manifest.webmanifest`, the FitIA icons, `public/service-worker.js`, and `public/offline.html` provide install metadata and a static-shell cache. API responses, Gemini output, and user data are excluded from cache. AI generation is unavailable offline.

## Status and limits

The original UI is preserved, with email sign-in/create/reset and a mobile workout experience. The repo was supplied empty, so this project scaffolds it from the provided TSX. The Render Blueprint and Vercel config prepare deployments; actual deploys still require linking provider accounts and setting Firebase/Gemini secrets. No production deployment is complete until those account-side steps succeed.
