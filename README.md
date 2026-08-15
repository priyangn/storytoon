# StoryToon

Personalized, privacy-first comic keepsakes for parents. **Mobile-friendly web app + PWA**, ready to wrap later for App Store / Play Store (Capacitor).

Named **StoryToon** (per product choice). See `PRD_ComicAvatar_App.md` for full requirements.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — works on phone browsers too (same Wi‑Fi: use your machine IP).

## What’s built (MVP foundation)

| Area | Status |
|---|---|
| Responsive landing + create flow | Done |
| Google Sign-In consent UI (demo session until OAuth keys) | Done |
| Child details, camera/gallery, blocking photo consent | Done |
| 5 original themes + smart suggestions | Done |
| Generate API (quota, no photo persistence) | Done (demo comic; Gemini hook ready) |
| Preview, dedication, Made with AI, Report | Done |
| PDF download | Done |
| Drive save button (needs Drive OAuth) | Stub |
| `/api/health`, `/api/purge` (24h TTL backstop) | Done |
| PWA manifest + icons | Done |
| Capacitor store packaging | Next phase |

## Scripts

- `npm run dev` — local development
- `npm run build` / `npm start` — production
- `npm run lint` — ESLint

## Free hosting (recommended)

1. Push this repo to GitHub
2. Import on [Vercel](https://vercel.com) (frontend + API routes in one Next.js app)
3. Add env vars from `.env.example`
4. Keep-alive: ping `https://YOUR_DOMAIN/api/health` every 5–10 minutes (UptimeRobot / GitHub Actions)

## Mobile apps (next)

1. Stabilize the web/PWA flow
2. `npx cap init` + Capacitor Android/iOS shells pointed at this app
3. Configure Google OAuth iOS/Android clients
4. Submit Play Store, then App Store (privacy labels must match: no raw image storage, 24h metadata TTL)

## Privacy highlights

- Raw photos: never written to disk/DB
- Session metadata: 24-hour expiry + purge endpoint
- No user-facing API keys
