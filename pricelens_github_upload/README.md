# PriceLens

PriceLens is a React/Vite app with an Express API backend. The Android app packages the existing web UI with Capacitor; product analysis and saved server data still require a reachable API deployment.

## Run the web app

Prerequisite: Node.js.

1. Install dependencies with `npm install`.
2. Set `GEMINI_API_KEY` in `.env.local` for Gemini product analysis.
3. Start the app with `npm run dev`.

## Build the Android app

Prerequisites: Node.js, Android Studio, and the Android SDK/JDK versions required by the installed Capacitor Android platform.

1. Deploy the Express API to an HTTPS URL reachable by the Android device.
2. Set `VITE_API_BASE_URL` to that API origin before building (for example, `https://api.example.com`). Leave it unset only when requests should use the current origin.
3. Add any browser-hosted frontend origins to `CORS_ORIGINS` on the API server as a comma-separated list. Capacitor's `https://localhost` origin is allowed by default.
4. Install dependencies with `npm install`.
5. Create the native project once with `npx cap add android`.
6. Build and sync the web app with `npm run build:android`.
7. Open the project in Android Studio with `npm run android:open`, then build or run it on a device/emulator.

After changing web assets or Capacitor configuration, run `npm run build:android` again to sync the Android project. Do not put Gemini API credentials in the Android app; keep them on the API server.

The current Google login uses Firebase's browser popup flow, which may be blocked in Android WebViews. Configure Firebase Android OAuth/native Google sign-in before relying on Google login in a production release.

## Firebase setup (Authentication + Firestore)

1. Go to https://console.firebase.google.com and create a project.
2. **Authentication -> Sign-in method**: enable **Email/Password** and **Google**.
   Under **Settings -> Authorized domains**, make sure `localhost` (and your deployed domain) is listed.
3. **Firestore Database -> Create database** (any location, start in production mode).
4. **Project settings -> Your apps -> Add app -> Web (`</>`)**, then copy the config values.
5. Copy `.env.example` to `.env` and fill in the `VITE_FIREBASE_*` values. Restart `npm run dev`.
6. Put your project id in `.firebaserc`, then deploy the security rules:
   ```
   npm i -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```

## Deploy on Render

1. Push this folder to a GitHub repo (`.env` is ignored; `.env.production` with the public Firebase config IS committed on purpose).
2. Render -> New -> Web Service -> pick the repo. Settings:
   - Build Command: `npm install --include=dev && npm run build`
   - Start Command: `npm start`
   - Environment: add `GEMINI_API_KEY` (your key), `NODE_ENV=production`
3. After the first deploy, copy your Render domain (e.g. `pricelens.onrender.com`) into
   Firebase Console -> Authentication -> Settings -> Authorized domains (needed for Google login).
