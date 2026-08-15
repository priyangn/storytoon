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
| **Gemini story + cover/panel image generation** | Done (requires `GEMINI_API_KEY`) |
| Preview with AI images, dedication, Made with AI | Done |
| PDF download (includes generated images) | Done |
| Drive save button (needs Drive OAuth) | Stub |
| `/api/health`, `/api/purge` (24h TTL backstop) | Done |
| PWA manifest + icons | Done |
| Capacitor store packaging | Next phase |

## Gemini setup (required for real comics)

1. Create an API key: [Google AI Studio](https://aistudio.google.com/apikey)
2. Copy `.env.example` → `.env.local` and set:

```bash
GEMINI_API_KEY=your_key_here
```

3. Restart `npm run dev`

Generation flow:
1. Gemini text model writes a 4-panel script from the **theme templates**
2. Gemini image model draws the cover avatar from the uploaded photo
3. Each panel is illustrated with the same character reference
4. Photos stay in memory for the request only — never written to disk/DB


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
