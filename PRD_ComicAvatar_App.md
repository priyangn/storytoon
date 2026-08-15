# Product Requirements Document

## App Name Options

Before naming the app "[App Name]," here are candidate names to choose from — all check as generic/available-sounding and avoid any third-party IP:

| Name | Rationale |
|---|---|
| **PanelPal** | Friendly, kid-safe, hints at comic "panels" |
| **StoryToon** | Clear about comic/story output, easy to say |
| **HeroFrame** | Evokes the superhero/adventure angle without naming a specific IP |
| **Comicverse Kids** | Signals a multi-theme "universe" of styles |
| **AvatarQuest** | Emphasizes the avatar + adventure narrative loop |
| **SnapToon** | Short, punchy, implies "photo → cartoon" in one word |
| **MyHero Comics** | Warm, personal ("my child is the hero") |

**Recommendation:** *PanelPal* or *StoryToon* — both are short, trademark-searchable, domain-friendly, and clearly communicate the product without borrowing any existing franchise language.

For the rest of this document, the app is referred to as **PanelPal**. Replace with the chosen name before distribution.

---

## 1. Problem Statement & Goals

### Problem Statement
Parents and guardians want fun, personalized, and safe digital keepsakes for their children, but most AI avatar/comic tools on the market are either (a) built for general adult audiences with no child-specific safety guardrails, (b) reliant on licensed characters that create IP risk and inconsistent brand experiences, or (c) opaque about what happens to an uploaded photo of a minor. There is no lightweight, trustworthy tool that lets a parent turn their child's photo into a short, original-style comic strip while being explicit and conservative about data handling and content safety.

### Goals
- Give parents a fast, delightful way to create a personalized comic strip starring their child's stylized avatar.
- Make child-photo handling radically transparent and minimal (in-memory processing, no persistent storage of raw images, short-lived session data).
- Offer entirely original art themes with zero licensed/third-party IP exposure.
- Keep infrastructure cost predictable via free-tier hosting and a **Google-native API model** — no manual API key management is ever exposed to the user.
- Support parents on the go: capture or upload a photo from any device, and optionally save finished comics straight to Google Drive.
- Be distributable through both the Apple App Store and Google Play Store, not just the web, so parents can find and install PanelPal where they already look for apps.
- Ship a safe, exportable, shareable artifact (PDF first) that parents can print or share privately.

### Target Users
- **Primary:** Parents/guardians of children ages ~3–12 creating a keepsake or gift.
- **Secondary:** Grandparents, teachers, or family members creating personalized gifts/rewards (e.g., birthday keepsake, classroom incentive) — always assumed to be an adult acting on behalf of a child, never the child themselves as an unsupervised user.

### Success Metrics
| Metric | Target (first 90 days post-launch) |
|---|---|
| Consent-to-completion conversion rate | ≥ 60% of users who pass consent screen complete a comic |
| Avg. time to first exported comic | < 3 minutes (streamlined, minimum-step flow) |
| Google Sign-In completion rate | ≥ 90% of landing visitors who start sign-in complete it |
| Content moderation false-negative rate (unsafe content shipped) | 0 tolerated; target 0 incidents |
| 24-hour data purge compliance | 100% of eligible records purged (automated audit) |
| Free-tier uptime (ping-maintained) | ≥ 99% availability during business hours |
| App Store / Play Store rating | ≥ 4.5 stars post-launch |
| Net Promoter Score (parent survey) | ≥ 40 |

---

## 2. User Flow

**Design principle: minimum viable steps.** Every step below earns its place by either being legally/safety-required (consent, moderation) or directly reducing a later decision the user would otherwise have to make manually (e.g., age/gender-based theme suggestions replace open-ended browsing). Nice-to-have flourishes (front cover, dedication) are positioned as low-friction, skippable moments rather than gates.

1. **Landing** — User sees example (non-child, illustrated) comics; taps "Create a Comic."
2. **Google Sign-In (mandatory) + Consent** — User signs in with their Google Account — required to use the app; there is no guest or email/password path. In this single screen, the user also grants consent for: (a) standard account/session use, (b) PanelPal's use of Google APIs (see Section 4) to power generation — with no manual API key ever requested from the user, and (c) optionally, access to Google Drive for saving finished comics (Section 6/7). One consent screen, no repeated interruptions later.
3. **Add Child Details + Photo** — In one combined step, the user provides: child's first name, approximate age range, and gender (optional, used only for theme/tone suggestions — see below), and a photo, captured either **directly from the device camera** or **chosen from the device's local photo library**, each requiring standard OS-level permission approval at the point of use.
4. **Smart Theme Suggestion** — Based on the age range and (if provided) gender, the app pre-highlights 1–2 best-fit themes (e.g., younger children default toward Fairytale Kingdom/Jungle Adventure styling, older children toward Detective Mystery/Space Explorer) while still showing all themes — this speeds theme choice down to a single tap for most users without forcing a suggestion. Gender is never used to gate or hide any theme, only to order suggestions; all themes remain available to every user regardless of the answer given.
5. **Generate** — A single "Generate My Comic" action triggers avatar creation and comic-strip generation in one continuous flow (combining what were previously separate avatar-preview and comic-generation steps) — the user sees one unified progress state rather than two, with the option to regenerate the whole result if unhappy.
6. **Preview** — Full comic strip (with interactive front cover) shown, "Made with AI" watermark visible, moderation pass confirmed. User can regenerate, or optionally add a one-line dedication ("Gifted By / Created By").
7. **Export** — User chooses PDF download, save to Google Drive, or both (Section 7).
8. **Session End** — User is informed that session data (minus anything exported/saved) auto-deletes within 24 hours; the raw photo was never stored to begin with.

---

## 3. Consent & Child Safety Requirements

### Google Sign-In (Mandatory) with Bundled Consent
- A Google Account is **required** to use PanelPal — there is no guest mode, no email/password account, and no anonymous usage path. This is a deliberate product decision to avoid maintaining a separate credential system and to keep the consent/data model simple and centralized.
- The user is never asked to create, paste, or manage any API key. All AI generation runs on **Google APIs by default** (Section 4); the only thing the user does is consent, once, at login, to PanelPal's use of those APIs.
- This single login screen bundles everything the user needs to agree to before creating anything:
  - Standard account/session consent (Google profile use, per below).
  - Consent for PanelPal to use Google's AI APIs to generate the avatar and comic — plainly explained, not buried in legal text.
  - An optional, separately-toggled consent for Google Drive access, only requested if/when the user wants to save comics to their Drive (least-privilege: scoped to files PanelPal creates, not blanket Drive access) — see Sections 6–7.
- This does not replace the photo-specific disclosures below — it front-loads the account/API consent so the later upload step only needs a lightweight, contextual confirmation, not a full re-explanation.
- Google profile data collected at login is limited to what's required for authentication (name, email, profile ID) and is subject to the same 24-hour session-data retention policy as other non-image data (Section 5) unless the user opts into a persistent account in a future release (Section 13).

### Consent Screen (Upload Step)
- Must appear **before** any upload is transmitted for processing — blocking modal, not a footnote or pre-checked box.
- Must explicitly state, in plain language (not legalese):
  - The photo is used only to generate a stylized avatar and comic.
  - The photo is processed **in-memory only** and is **never saved to disk, database, or cloud storage**, by PanelPal or any subprocessor.
  - The photo (and any derived avatar) is discarded immediately after the session ends or after a defined short TTL, whichever is first.
  - If the child's photo is captured via device camera rather than chosen from the photo library, standard OS-level camera-permission approval is required at the point of capture, separate from and in addition to this consent.
  - The photo is transmitted to Google's AI APIs for processing under Google's API terms — user must be shown a link to Google's relevant data-handling policy for this purpose.
  - The user confirms they are the parent/legal guardian of the child, or have explicit permission from the parent/guardian, to upload this photo.
- Requires an affirmative action (checkbox + "I Agree & Continue" button) — no dark patterns, no default-checked consent.
- Consent state is itself considered session data and is purged under the same 24-hour policy.

### Technical Requirement: No Persistence of Raw Images
- Uploaded images must be held only in application memory (RAM) or ephemeral processing buffers for the duration of the request/session.
- Images must **never** be written to disk, object storage (S3/GCS/etc.), logs, caches, or databases at any stage of the pipeline.
- Any temporary file handling required by an SDK must use in-memory streams or auto-wiped tmp storage that is deleted immediately post-request, verified via automated tests.
- Logging systems must be configured to strip/redact image payloads and any base64-encoded image data from request/response logs.

### In-App Disclaimer
- Persistent, visible disclaimer (not buried in ToS) stating:
  - Content is AI-generated and may contain inaccuracies, unexpected likenesses, or stylization artifacts.
  - The app is intended for casual, personal, non-commercial use by parents/guardians.
  - The app is not a substitute for professional photography, portraiture, or identity documentation.

### Content Moderation & Guardrails
- **Pre-generation prompt filtering:** All generation prompts (avatar + comic storyline) are constrained to a safe, pre-approved vocabulary/template per theme — no free-text prompt injection from users that could steer content.
- **Post-generation automated moderation:** Every generated avatar and comic panel is run through an image-safety classifier (violence, sexual content, weapons, gore, self-harm imagery, disturbing imagery) before being shown to the user.
- **Hard fail-closed policy:** If moderation flags any panel, that panel is regenerated automatically (up to N retries) or the session is halted with a friendly error — flagged content is never displayed, exported, or stored.
- **Minor-specific safeguards:** System prompts explicitly instruct the model to keep all depictions of the child avatar in age-appropriate, fully clothed, non-sexualized, non-violent contexts, regardless of theme (e.g., "Detective Mystery" must stay light/cartoonish, not depict crime-scene violence or peril imagery).
- **Human escalation path:** A "Report Content" option post-generation for edge cases the automated system misses, feeding a review queue.

---

## 4. AI/API Integration

- **Google APIs by default, exclusively:** All avatar and comic generation runs on Google's AI APIs (e.g., Gemini). This is the only generation path — there is no alternate/fallback third-party provider and no user-supplied provider choice.
- **No manual API keys, ever:** Users never see an API-key field. Access is authorized entirely through the Google Sign-In consent captured at login (Section 3) — the user's Google Account confirms permission for PanelPal to use Google's APIs on their behalf; PanelPal's backend holds and manages the actual service credentials centrally, so no personal key management is exposed to or required from the user.
- **Feasibility note (flag for engineering validation):** Google's generative AI APIs are typically billed and quota-managed at the application/project level (via a backend service account), not per individual consumer Google Account. "Consent to use their Google Account APIs" is implemented here as **authorization + identity binding** — the user's Google Sign-In authorizes and attributes their usage — while the underlying API calls run through PanelPal's own Google Cloud project and quota. This should be explicitly validated by engineering against current Google API terms before build, and the consent language (Section 3) must accurately reflect however it's actually implemented.
- **Per-user quota & rate limiting:**
  - Every authenticated Google Account gets a defined per-day/per-session generation quota to keep the shared backend quota sustainable on a free/low-cost tier.
  - Queueing/backoff UI when overall quota is near exhaustion ("high demand, please try again in X minutes" rather than silent failure).
- **Error handling:**
  - Graceful degradation messaging for quota-exceeded, timeout, and model-refusal errors (e.g., safety-filtered by Google's API).
  - Retry-with-backoff logic (max 3 attempts) before surfacing a user-facing error.
  - No credentials, prompts containing image data, or raw error payloads are logged in plaintext.

---

## 5. Data Retention Policy

- **Raw images:** Never persisted at all — not subject to the 24-hour window because they are never written to storage in the first place.
- **Session/account metadata (theme chosen, generated comic file, consent record, timestamps — excluding raw images):** Automatically deleted **24 hours** after creation.
- **Rationale:** Minimizes data footprint and liability associated with any content connected to a minor's likeness, aligns with data-minimization best practice, and reduces the surface area for breach impact.
- **Enforcement mechanism:**
  - Database records use a `created_at` + TTL index (e.g., MongoDB TTL index, or a Postgres `expires_at` column) enabling native or scheduled expiry.
  - A scheduled cron job (e.g., hourly) sweeps and hard-deletes any records past their TTL as a backstop to native TTL mechanisms.
  - Deletion events are logged (metadata only, e.g., "record X purged at time Y") for compliance auditing — never logging the deleted content itself.
  - Users are notified at export time that their session will auto-purge, encouraging them to save their download immediately.

---

## 6. Hosting & Infrastructure

- **Frontend:** Static/SPA hosting on a free tier such as Vercel or Netlify.
- **Backend:** API/processing layer on a free tier such as Render, Railway, or Fly.io.
- **Database:** Free-tier managed DB (e.g., Supabase/Postgres free tier or MongoDB Atlas free tier) for the minimal session metadata described above.
- **Google Drive as user-side storage:** Rather than PanelPal hosting long-term file storage itself, finished exports can be saved directly to the user's own Google Drive (via a narrowly-scoped `drive.file` permission, requested only if the user opts in — Section 3). This keeps PanelPal's own storage footprint at effectively zero for exported comics while still giving parents a durable place to keep them, consistent with the 24-hour deletion policy for anything left only on PanelPal's side.
- **Cold-start mitigation:** Free-tier backends typically sleep after inactivity. Mitigate with:
  - A scheduled uptime-ping (e.g., a lightweight cron via GitHub Actions, UptimeRobot, or a similar free monitor) hitting a `/health` endpoint every 5–10 minutes during expected usage windows.
  - Clear UI loading state ("Waking up the comic engine...") for the rare cold-start the ping doesn't catch.
- **Scaling assumption:** Free-tier infra is explicitly assumed to support a modest MVP user base; see Section 12 for scaling limits and triggers for paid-tier migration.

---

## 7. Output & Export Formats

### Interactive Front Cover
- The in-app creation experience opens with (and the final export includes) a front cover treatment — the child's stylized avatar, the comic's auto-generated title, and the selected theme's signature art style.
- In-app, the cover is interactive (subtle animation, tap/hover reveal) to set a joyous, storybook tone before the user proceeds; in the exported PDF, it renders as a static, polished title page.
- The optional "Gifted By / Created By" dedication (see below) appears on this cover or on an immediately following dedication page.

### Dedication ("Gifted By / Created By")
- Optional free-text field, offered after preview, where the parent/guardian can add a short personal line (e.g., "Created by Mom & Dad," "Gifted by Grandma Ellen") for emotional, keepsake-style personalization.
- Field is length-limited and passed through the same content-moderation text filter as other user-provided text to prevent inappropriate input.
- Treated as session data under the standard 24-hour retention/deletion policy (Section 5); not required to complete a comic.

### MVP Scope: PDF Export (Primary)
- Default export format at launch, available two ways:
  - **Download locally** to the device.
  - **Save to Google Drive** — if the user granted Drive access at sign-in (Section 3), a "Save to Drive" option uploads the PDF directly to a PanelPal-created folder in their Drive, using the least-privilege `drive.file` scope (PanelPal can only see/manage files it created, not the user's broader Drive).
- Comic panels laid out in a print-friendly, shareable PDF (e.g., single page or multi-page depending on panel count), preceded by the front cover / dedication page.
- Includes "Made with AI" watermark and attribution footer (see Section 10).
- Optimized for both on-screen viewing and home printing (standard letter/A4 sizing).

### Phase 2 (Fast-Follow): Video Export
- Short animated slideshow of the comic panels with transitions and optional narration (e.g., text-to-speech reading captions).
- **Explicitly out of MVP scope** pending a feasibility spike, because video generation/rendering is significantly more compute- and API-cost-intensive than static PDF generation and may not be sustainable on free-tier infrastructure.
- Before building, validate: rendering approach (client-side canvas/ffmpeg.wasm vs. server-side), cost per video under the shared Google-API quota model, and generation time vs. user expectations.
- Recommendation: greenlight Phase 2 only after MVP PDF flow is stable and cost/performance data from real usage is available.

---

## 8. Cross-Platform UI Requirements

- Fully responsive layout supporting mobile, tablet, and desktop breakpoints from a single codebase.
- **Recommended approach:** Progressive Web App (PWA) for MVP — installable, offline-capable shell, push-notification-ready, and avoids the overhead of maintaining separate native codebases while still giving a near-native mobile experience.
- **Future consideration:** If deeper native capability is needed (e.g., camera integration, native share sheets, app-store distribution/discoverability), evaluate React Native or Flutter for a dedicated mobile app sharing business logic with the web app.
- Core interactions (photo upload, theme selection, panel preview, export) must be touch-optimized and thumb-reachable on mobile.
- Photo capture UI offers two clearly-presented entry points — **"Take a Photo"** (device camera) and **"Choose from Gallery"** (device photo library) — each triggering the relevant native OS permission prompt only at the moment it's needed, never pre-emptively on app load.

### Modules: App Store & Google Play Store Distribution
- In addition to the responsive web/PWA experience, PanelPal is packaged for distribution on both the **Apple App Store** and **Google Play Store** so parents can discover and install it as a native-feeling app, not just a website.
- **Recommended packaging approach:** wrap the existing web app using a cross-platform shell (e.g., Capacitor, or a Trusted Web Activity for Play Store specifically) rather than building two fully separate native codebases — keeps a single source of truth for UI/logic while producing store-installable binaries for both platforms. Full native rebuild (React Native/Flutter) remains a future option if store performance/capability needs outgrow this approach.
- **Store-specific compliance requirements (both platforms handle child-adjacent photo content, so these are treated as launch-blocking, not nice-to-have):**
  - Accurate completion of Apple's Privacy Nutrition Label and Google Play's Data Safety form — both must reflect the true architecture (no raw image persistence, 24-hour metadata TTL, Google-API-only processing).
  - Clear, specific system permission-usage strings for camera and photo-library access (explaining *why* PanelPal needs each, shown in the OS permission dialog).
  - Because the app is parent-directed (not marketed to or targeted at children as direct users), it is submitted under a general audience/parent-tool category rather than Apple's Kids Category or Google Play's Designed for Families program — those programs carry stricter, additional child-directed-app requirements that don't fit this product's actual usage model; this categorization decision should be confirmed with each platform's current policy at submission time, since store policies evolve.
  - Age rating set appropriately for AI-generated content and camera/photo access, per each store's rating questionnaire.
  - In-app purchase / account-deletion flows (if any monetization or account features are added later) must meet each store's current requirements at that time.

### Child-Friendly Visual Design
- Overall visual language should feel colorful, joyous, and storybook-like — designed to delight the parent and reflect the spirit of a children's product, even though the direct user is an adult.
- Bright, high-contrast, playful color palette (varied per theme where appropriate) rather than a corporate/neutral SaaS aesthetic; rounded shapes, friendly iconography, and light motion/animation (button bounces, sparkle transitions, page-turn effects) to reinforce a sense of fun.
- Friendly, warm illustrated mascot or guide character (original, non-licensed) can accompany onboarding and loading states to keep the experience approachable for parents creating something with/for their child.
- Typography should remain highly legible (accessibility first, per Section 12) while using a friendly, rounded typeface for headings; body text stays clean and readable.
- Loading/generation states use playful, reassuring copy and imagery (e.g., a small animated character "drawing" the comic) rather than plain spinners, to make wait times feel engaging rather than clinical.

---

## 9. Legal / IP Considerations

- All theme art styles and story archetypes must be **wholly original** or based on **generic, public-domain-style archetypes** (e.g., "a superhero," "a space explorer," "a detective") with no visual or narrative resemblance to specific copyrighted or trademarked characters, franchises, or studios.
- No theme, panel template, or generated prompt may reference specific franchise names, character names, or trademarked visual motifs (e.g., specific capes, symbols, logos, or color schemes strongly associated with existing IP).

### Theme Addition Review Checklist (required before any new theme ships)
- [ ] Theme name and description contain no reference to existing franchises, characters, or trademarks.
- [ ] Concept art/style references used for model fine-tuning or prompting are original or licensed for commercial AI use.
- [ ] Generated sample outputs reviewed by legal/design for unintentional resemblance to known copyrighted characters (visual similarity check).
- [ ] Story templates/prompts contain no borrowed catchphrases, quotes, or plot structures lifted from existing copyrighted works.
- [ ] Sign-off recorded (reviewer name + date) before the theme is enabled in production.

---

## 10. Branding & Transparency

- Every generated avatar, panel, and exported file (PDF, and later video) carries a visible **"Made with AI"** watermark/label — not removable by the user.
- Export footer/metadata includes attribution of which AI model/API generated the content (e.g., "Avatar & comic generated using Google Gemini API").
- In-app "How this works" page explains the AI pipeline in plain language for transparency with parents.

---

## 11. Cybersecurity & Abuse Prevention

**Note on framing:** No internet-connected system can be claimed as literally "unhackable" — any PRD or vendor promising a 100%-proof system should be treated with skepticism. The goal below is **defense-in-depth**: layered, verifiable controls that make PanelPal a hardened, low-attack-surface target, catch misuse early, and fail safely when something does go wrong.

### Authentication & Access Control
- Google OAuth (Section 3) is the sole login method for MVP — avoids PanelPal ever storing passwords, eliminating an entire class of credential-breach risk.
- Session tokens are short-lived, signed, and scoped; refreshed via secure, HttpOnly, SameSite cookies (never stored in localStorage, which is vulnerable to XSS-based token theft).
- All admin/internal tooling (moderation review queue, theme-approval dashboard) requires separate, role-based authentication with MFA — never reachable from the public app surface.

### Input & API Hardening
- Strict server-side validation on every input: file type/size/magic-byte checks on uploads (not just file extension), length/character limits on name and dedication text fields, and rejection of any executable or script-bearing payloads.
- All user-supplied text (child's name, dedication, any free-text) is sanitized and escaped before use in prompts, UI rendering, or exports — prevents prompt-injection into the AI pipeline and cross-site scripting (XSS) in the rendered app/PDF.
- Parameterized queries / ORM usage only — no raw string-built database queries, eliminating SQL-injection risk.
- API endpoints validate the authenticated session on every request; no endpoint trusts client-supplied identity or entitlement claims alone.

### AI Misuse Prevention
- Prompt templates are fixed and server-controlled (Section 3); user input is only ever inserted into designated, escaped fields — never concatenated into freeform instructions the model could interpret as new commands (prevents prompt-injection/jailbreak attempts aimed at bypassing content moderation).
- Per-user and per-IP request throttling on generation endpoints specifically, separate from general API rate limiting, to prevent automated/bulk misuse (e.g., scripting the app to mass-generate content or exhaust shared free-tier quota).
- Moderation pipeline (Section 3) is itself treated as a security control, not just a content-quality one — logged (metadata only) and monitored for anomalous spikes in flagged content, which may indicate a probing/abuse attempt.
- All Google API service credentials are held only in secure backend secrets storage (Section 11), never exposed to or requested from the user, and never echoed back in any response, error message, or log line.

### Secrets & Infrastructure Security
- All secrets (Google API service credentials, OAuth client secrets) stored in the hosting platform's managed secrets/environment-variable system — never committed to source control; automated secret-scanning on every commit/PR to catch accidental leaks.
- TLS/HTTPS enforced end-to-end (frontend, backend, and all third-party API calls); HSTS enabled; no mixed-content endpoints.
- Standard web-hardening headers applied (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) to reduce clickjacking, XSS, and MIME-sniffing risk.
- Dependency vulnerability scanning (e.g., automated Dependabot/`npm audit`-style checks) integrated into CI, blocking merges that introduce known-critical CVEs.
- Principle of least privilege for all service accounts/API integrations — each component only has the access it strictly needs (e.g., the deletion cron job can delete session records but has no access to auth secrets).

### Verification, Testing & Ongoing Assurance
- Automated security testing (SAST/dependency scanning) runs on every build; a lightweight DAST or manual penetration test is recommended before public launch and at a regular cadence (e.g., annually or after major architecture changes) even on a free-tier budget (community/open-source tools where commercial pen-testing isn't affordable pre-revenue).
- Abuse/red-team test cases specifically target: prompt-injection attempts via name/dedication fields, moderation bypass attempts, upload-endpoint fuzzing (oversized/malformed files), and session/token replay.
- Incident response plan defined pre-launch: designated contact, disclosure timeline commitments, and a documented process to rotate any compromised keys/secrets within hours, not days.
- Given the "no raw image persistence" architecture (Section 3), a breach of the database cannot expose historical photos of children by design — this is treated as a core security property, not just a privacy one, and should be highlighted as such in any security review.

### Security Verification Checklist (pre-launch gate)
- [ ] OAuth login flow reviewed for token handling/storage best practices
- [ ] All user-input fields fuzz-tested for injection (SQL, XSS, prompt-injection)
- [ ] Upload pipeline verified to reject disguised/malicious file payloads
- [ ] Secrets-scanning and dependency-scanning both green in CI
- [ ] Security headers (CSP, HSTS, etc.) verified in production response headers
- [ ] Rate limiting confirmed effective against scripted/bulk abuse
- [ ] Incident response contact and key-rotation runbook documented and accessible to the team
- [ ] Confirmed: no raw image, API key, or full-resolution photo data appears in any log, error tracker, or backup

---

## 12. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Avatar generation < 20s p95; full comic generation < 60s p95 under normal load |
| Security | TLS/HTTPS enforced end-to-end; no image data written to logs, error trackers, or analytics tools; API keys transmitted only over encrypted channels and never persisted server-side; see Section 11 for full cybersecurity controls |
| Privacy | No raw image persistence (Section 3); 24-hour metadata TTL (Section 5); no third-party ad/tracking SDKs on upload or consent screens |
| Accessibility | WCAG 2.1 AA target — keyboard navigable flows, alt text on illustrative theme previews, sufficient color contrast, screen-reader-friendly consent screen |
| Scalability limits (free tier) | Expect throughput ceilings from shared free-tier compute/DB/API quotas; define explicit concurrent-session caps and a graceful "at capacity" queue message; document clear triggers (e.g., sustained >70% quota usage) for migrating to paid infrastructure tiers |
| Reliability | Health-check endpoint for uptime monitoring; automated alerting on moderation-service failures (fail closed, not open) |

---

## 13. Out of Scope / Future Considerations

- **Video export** — deferred to Phase 2, contingent on cost/performance validation (Section 7).
- **Multi-language support** — UI and generated comic text localization; not in MVP.
- **Print-on-demand fulfillment** — physical printing/shipping of comics or merchandise; future partnership/integration consideration.
- **Multi-child / group comics** — comics featuring more than one child avatar.
- **User accounts with persistent libraries** — MVP is explicitly session-based and non-persistent by design; a future opt-in "save my comics" account model would require a separate, more rigorous data-retention and parental-consent framework (e.g., COPPA-aligned verifiable parental consent) before being considered.
- **Full native rebuild (React Native/Flutter)** — MVP ships to app stores via a wrapped web-shell approach (Section 8); a fully native rebuild is a future consideration only if store performance or platform-capability needs outgrow that approach.

---

## Requirements Table

| Feature | Priority | Description |
|---|---|---|
| Google Sign-In (mandatory, OAuth) | P0 | Sole login method; no guest/manual-account path |
| Bundled login consent (account + Google API use + optional Drive) | P0 | Captured once at login for transparency; avoids repeat interruptions later |
| Google-API-only generation (no manual key entry) | P0 | User never sees or manages an API key; access via account consent |
| Camera capture + gallery upload options | P0 | Two clear entry points, each with just-in-time OS permission prompt |
| Child details: name, age range, gender (optional) | P0 | Minimum step; powers theme suggestion, never gates themes |
| Smart theme suggestion by age/gender | P1 | Pre-highlights best-fit themes to cut choice time; all themes stay available |
| Blocking consent screen | P0 | Must appear before any processing; explicit affirmative consent |
| Interactive front cover | P1 | Animated storybook-style cover; static title page in export |
| "Gifted By / Created By" dedication field | P1 | Optional parent name for emotional/keepsake personalization |
| Child-friendly colorful UI system | P0 | Playful, joyous visual language across all screens |
| In-memory-only image processing | P0 | No raw image ever written to disk/DB/cloud storage |
| Theme selection (5 original themes) | P0 | Superhero, Space Explorer, Fairytale Kingdom, Jungle Adventure, Detective Mystery |
| Unified avatar + comic generation step | P0 | Single "Generate" action, one progress state, minimum steps |
| Content moderation pipeline | P0 | Pre- and post-generation safety filtering; fail-closed |
| Per-user quota & rate limiting | P0 | Keeps shared Google-API backend quota sustainable |
| PDF export (local download) | P0 | MVP primary export format, print-ready layout |
| Save to Google Drive (optional) | P1 | Least-privilege `drive.file` scope; user-side durable storage |
| "Made with AI" watermark + attribution | P0 | On all generated/exported content |
| 24-hour data auto-deletion (metadata) | P0 | TTL index + cron sweep enforcement |
| Responsive web UI (PWA) | P0 | Mobile/tablet/desktop parity from one codebase |
| App Store (Apple) + Play Store (Google) packaging | P0 | Wrapped web-shell distribution; store compliance (privacy labels, permissions, ratings) |
| Uptime-ping strategy | P1 | Prevents free-tier backend cold sleep |
| Theme IP review checklist | P0 | Required gate before any new theme ships |
| Accessibility (WCAG 2.1 AA) | P1 | Inclusive design across core flows |
| Report Content option | P1 | Human escalation path for moderation edge cases |
| OAuth-only auth (no stored passwords) | P0 | Eliminates credential-breach risk; short-lived signed session tokens |
| Input validation & sanitization (uploads, name, dedication text) | P0 | Blocks injection, XSS, and malicious file payloads |
| Prompt-injection prevention (fixed server-side templates) | P0 | User text never becomes freeform AI instructions |
| Secrets management + automated secret/dependency scanning | P0 | No secrets in source control; CI blocks known-critical CVEs |
| Security headers (CSP, HSTS, etc.) + TLS/HSTS enforcement | P0 | Reduces XSS/clickjacking/MITM risk |
| Abuse-specific rate limiting on generation endpoints | P0 | Prevents scripted/bulk misuse and quota-drain attacks |
| Pre-launch security testing (SAST/DAST/pen-test pass) | P1 | Verifies controls before public launch; recurring cadence post-launch |
| Incident response & key-rotation runbook | P1 | Documented process for fast response to any compromise |
| Video export (animated slideshow + narration) | P2 (Phase 2) | Deferred pending cost/performance feasibility study |
| Multi-language support | P3 (Future) | Not in MVP |
| Print-on-demand integration | P3 (Future) | Not in MVP |
| Persistent user accounts / saved libraries | P3 (Future) | Requires separate consent/retention framework |
| Full native rebuild (React Native/Flutter) | P3 (Future) | Only if wrapped web-shell approach proves insufficient |
