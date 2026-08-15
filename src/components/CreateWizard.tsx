"use client";

import { useMemo, useState } from "react";
import type {
  AgeRange,
  ChildDetails,
  FlowStep,
  GenderHint,
  GeneratedComic,
  ThemeId,
  UserSession,
} from "@/lib/types";
import { THEMES, suggestedThemeIds } from "@/lib/themes";
import { downloadComicPdf } from "@/lib/pdf";
import { isSafeDedication, sanitizeText } from "@/lib/sanitize";

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "3-5", label: "Ages 3–5" },
  { value: "6-8", label: "Ages 6–8" },
  { value: "9-12", label: "Ages 9–12" },
];

export function CreateWizard() {
  const [step, setStep] = useState<FlowStep>("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);

  const [accountConsent, setAccountConsent] = useState(false);
  const [apiConsent, setApiConsent] = useState(false);
  const [driveConsent, setDriveConsent] = useState(false);

  const [details, setDetails] = useState<ChildDetails>({
    firstName: "",
    ageRange: "6-8",
    gender: "",
    photoDataUrl: null,
    photoConsent: false,
  });

  const [themeId, setThemeId] = useState<ThemeId | null>(null);
  const [comic, setComic] = useState<GeneratedComic | null>(null);
  const [dedication, setDedication] = useState("");
  const [progressMsg, setProgressMsg] = useState("Warming up the comic engine…");

  const suggestions = useMemo(
    () => suggestedThemeIds(details.ageRange, details.gender),
    [details.ageRange, details.gender]
  );

  async function signIn() {
    setError(null);
    if (!accountConsent || !apiConsent) {
      setError("Please agree to account use and Google AI API consent to continue.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountConsent,
          apiConsent,
          driveConsent,
          name: "Parent",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-in failed");
      setSession(data.session);
      setStep("details");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  function onPhoto(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Please use a photo under 8 MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setDetails((d) => ({
        ...d,
        photoDataUrl: typeof reader.result === "string" ? reader.result : null,
      }));
    };
    reader.readAsDataURL(file);
  }

  function continueFromDetails() {
    setError(null);
    const name = sanitizeText(details.firstName, 40);
    if (!name) {
      setError("Please enter your child’s first name.");
      return;
    }
    if (!details.photoConsent) {
      setError("Photo consent is required before continuing.");
      return;
    }
    if (!details.photoDataUrl) {
      setError("Add a photo from camera or gallery.");
      return;
    }
    setDetails((d) => ({ ...d, firstName: name }));
    const suggested = suggestedThemeIds(details.ageRange, details.gender);
    setThemeId(suggested[0] ?? "superhero");
    setStep("theme");
  }

  async function generate() {
    if (!session || !themeId) return;
    setError(null);
    setStep("generating");
    setBusy(true);
    setProgressMsg("Drawing your child’s stylized avatar…");
    const t1 = setTimeout(() => setProgressMsg("Building comic panels…"), 900);
    const t2 = setTimeout(() => setProgressMsg("Running safety checks…"), 1800);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          childName: details.firstName,
          themeId,
          // Sent for future Gemini path; server does not persist it.
          photoDataUrl: details.photoDataUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setComic(data.comic);
      // Clear photo from client memory after generation
      setDetails((d) => ({ ...d, photoDataUrl: null }));
      setStep("preview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
      setStep("theme");
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setBusy(false);
    }
  }

  function applyDedicationAndExport() {
    if (!comic) return;
    const line = sanitizeText(dedication, 120);
    if (line && !isSafeDedication(line)) {
      setError("Please keep the dedication family-friendly.");
      return;
    }
    setError(null);
    setComic({ ...comic, dedication: line });
    setStep("export");
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6 sm:max-w-2xl sm:py-10">
      <StepDots step={step} />

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {step === "signin" && (
        <section className="space-y-5">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B3A4B]">
            Sign in to create
          </h1>
          <p className="text-[#1B3A4B]/75">
            Google Sign-In is required. StoryToon never asks you for API keys — generation
            runs on Google AI through our secure backend.
          </p>
          <label className="flex gap-3 rounded-2xl bg-white/70 p-4 text-sm leading-snug shadow-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-[#FF6B35]"
              checked={accountConsent}
              onChange={(e) => setAccountConsent(e.target.checked)}
            />
            <span>
              I agree to use StoryToon with my Google account for this session (name/email for
              login only).
            </span>
          </label>
          <label className="flex gap-3 rounded-2xl bg-white/70 p-4 text-sm leading-snug shadow-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-[#FF6B35]"
              checked={apiConsent}
              onChange={(e) => setApiConsent(e.target.checked)}
            />
            <span>
              I consent to StoryToon using Google AI APIs to generate the avatar and comic.{" "}
              <a
                className="underline"
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
              >
                Google privacy policy
              </a>
            </span>
          </label>
          <label className="flex gap-3 rounded-2xl bg-white/70 p-4 text-sm leading-snug shadow-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-[#FF6B35]"
              checked={driveConsent}
              onChange={(e) => setDriveConsent(e.target.checked)}
            />
            <span>
              Optional: allow saving finished comics to my Google Drive (files StoryToon creates
              only).
            </span>
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={signIn}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1B3A4B] py-3.5 text-base font-semibold text-white transition hover:bg-[#152e3c] disabled:opacity-60"
          >
            <GoogleMark />
            Continue with Google
          </button>
          <p className="text-center text-xs text-[#1B3A4B]/55">
            Demo mode works without OAuth keys. Add GOOGLE_CLIENT_ID later for production Google
            Sign-In.
          </p>
        </section>
      )}

      {step === "details" && (
        <section className="space-y-5">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B3A4B]">
            Child details & photo
          </h1>
          <p className="text-sm text-[#1B3A4B]/75">
            Photos are processed in memory only and never saved to StoryToon’s disk or database.
          </p>

          <label className="block text-sm font-semibold text-[#1B3A4B]">
            First name
            <input
              className="mt-1.5 w-full rounded-xl border border-[#1B3A4B]/15 bg-white px-3 py-3 text-base outline-none ring-[#FF6B35] focus:ring-2"
              value={details.firstName}
              onChange={(e) =>
                setDetails((d) => ({ ...d, firstName: e.target.value }))
              }
              maxLength={40}
              autoComplete="off"
              placeholder="e.g. Maya"
            />
          </label>

          <fieldset>
            <legend className="text-sm font-semibold text-[#1B3A4B]">Age range</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {AGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDetails((d) => ({ ...d, ageRange: opt.value }))}
                  className={`rounded-xl py-3 text-sm font-medium ${
                    details.ageRange === opt.value
                      ? "bg-[#FF6B35] text-white"
                      : "bg-white text-[#1B3A4B]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-[#1B3A4B]">
              Gender (optional — suggests themes only)
            </legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  ["girl", "Girl"],
                  ["boy", "Boy"],
                  ["neutral", "Skip"],
                ] as [GenderHint, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setDetails((d) => ({
                      ...d,
                      gender: value === "neutral" ? "" : value,
                    }))
                  }
                  className={`rounded-xl py-3 text-sm font-medium ${
                    (value === "neutral" && !details.gender) ||
                    details.gender === value
                      ? "bg-[#1B6CA8] text-white"
                      : "bg-white text-[#1B3A4B]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#1B3A4B]">Photo</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="cursor-pointer rounded-xl bg-[#FF6B35] py-3 text-center text-sm font-semibold text-white">
                Take a Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
                />
              </label>
              <label className="cursor-pointer rounded-xl bg-[#1B6CA8] py-3 text-center text-sm font-semibold text-white">
                Choose Gallery
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            {details.photoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={details.photoDataUrl}
                alt="Selected child photo preview"
                className="mx-auto max-h-48 rounded-xl object-cover"
              />
            )}
          </div>

          <label className="flex gap-3 rounded-2xl border-2 border-[#FF6B35]/40 bg-[#FFF1E8] p-4 text-sm leading-snug">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-[#FF6B35]"
              checked={details.photoConsent}
              onChange={(e) =>
                setDetails((d) => ({ ...d, photoConsent: e.target.checked }))
              }
            />
            <span>
              I am the parent/guardian (or have permission). This photo is used only to make a
              stylized avatar/comic, processed in memory, never stored by StoryToon, and sent to
              Google AI APIs under their terms.
            </span>
          </label>

          <button
            type="button"
            onClick={continueFromDetails}
            className="w-full rounded-2xl bg-[#FF6B35] py-3.5 font-semibold text-white"
          >
            I Agree & Continue
          </button>
        </section>
      )}

      {step === "theme" && (
        <section className="space-y-5">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B3A4B]">
            Pick a theme
          </h1>
          <p className="text-sm text-[#1B3A4B]/75">
            Suggested for you are highlighted — every theme stays available.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {THEMES.map((theme) => {
              const suggested = suggestions.includes(theme.id);
              const selected = themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeId(theme.id)}
                  className={`rounded-2xl p-4 text-left transition ${
                    selected
                      ? "ring-4 ring-[#FF6B35] ring-offset-2"
                      : "ring-1 ring-[#1B3A4B]/10"
                  }`}
                  style={{ background: theme.gradient }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-[family-name:var(--font-display)] text-lg font-bold text-white drop-shadow">
                      {theme.name}
                    </p>
                    {suggested && (
                      <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1B3A4B]">
                        Suggested
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-white/95">{theme.tagline}</p>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={!themeId || busy}
            onClick={generate}
            className="w-full rounded-2xl bg-[#1B3A4B] py-3.5 font-semibold text-white disabled:opacity-50"
          >
            Generate My Comic
          </button>
        </section>
      )}

      {step === "generating" && (
        <section className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <div className="mascot-bounce mb-6 flex size-24 items-center justify-center rounded-full bg-[#FF6B35] text-5xl shadow-lg">
            ✎
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#1B3A4B]">
            Creating your comic
          </h1>
          <p className="mt-2 text-[#1B3A4B]/70">{progressMsg}</p>
          <p className="mt-6 text-xs text-[#1B3A4B]/50">
            Content is moderated before anything is shown.
          </p>
        </section>
      )}

      {step === "preview" && comic && (
        <section className="space-y-5">
          <div
            className="cover-shine overflow-hidden rounded-3xl p-6 text-white shadow-lg"
            style={{ background: `linear-gradient(145deg, ${comic.coverAccent}, #1B3A4B)` }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest opacity-90">
              StoryToon · Front cover
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold">
              {comic.title}
            </h1>
            <p className="mt-2 text-lg">Starring {comic.childName}</p>
            <p className="mt-6 inline-block rounded-md bg-black/25 px-2 py-1 text-xs">
              Made with AI
            </p>
          </div>

          <div className="space-y-3">
            {comic.panels.map((panel) => (
              <article
                key={panel.id}
                className="rounded-2xl p-4 shadow-sm"
                style={{ background: panel.bg }}
              >
                <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#1B3A4B]">
                  {panel.sceneLabel}
                </h2>
                <p className="mt-1 text-sm text-[#1B3A4B]/85">{panel.caption}</p>
                <p className="mt-3 text-[10px] uppercase tracking-wide text-[#1B3A4B]/45">
                  Made with AI
                </p>
              </article>
            ))}
          </div>

          <label className="block text-sm font-semibold text-[#1B3A4B]">
            Dedication (optional)
            <input
              className="mt-1.5 w-full rounded-xl border border-[#1B3A4B]/15 bg-white px-3 py-3 outline-none ring-[#FF6B35] focus:ring-2"
              placeholder='e.g. "Gifted by Grandma Ellen"'
              value={dedication}
              maxLength={120}
              onChange={(e) => setDedication(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={generate}
              className="rounded-2xl border-2 border-[#1B3A4B]/20 bg-white py-3 font-semibold text-[#1B3A4B]"
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={applyDedicationAndExport}
              className="rounded-2xl bg-[#FF6B35] py-3 font-semibold text-white"
            >
              Continue
            </button>
          </div>
          <button
            type="button"
            className="w-full text-sm text-[#1B3A4B]/60 underline"
            onClick={() => alert("Thanks — your report was noted for review (demo).")}
          >
            Report Content
          </button>
        </section>
      )}

      {step === "export" && comic && (
        <section className="space-y-5">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B3A4B]">
            Save your comic
          </h1>
          <p className="text-sm text-[#1B3A4B]/75">
            Session data (except what you export) auto-deletes within 24 hours. The raw photo was
            never stored.
          </p>
          {comic.dedication && (
            <p className="rounded-xl bg-white/80 px-4 py-3 text-sm italic text-[#1B3A4B]">
              {comic.dedication}
            </p>
          )}
          <button
            type="button"
            onClick={() => downloadComicPdf(comic)}
            className="w-full rounded-2xl bg-[#FF6B35] py-3.5 font-semibold text-white"
          >
            Download PDF
          </button>
          <button
            type="button"
            disabled={!session?.driveConsent}
            onClick={() =>
              alert(
                session?.driveConsent
                  ? "Google Drive upload will connect when Drive OAuth is configured."
                  : "Enable Drive consent at sign-in to use this option."
              )
            }
            className="w-full rounded-2xl bg-[#1B6CA8] py-3.5 font-semibold text-white disabled:opacity-40"
          >
            Save to Google Drive
          </button>
          <p className="text-center text-xs text-[#1B3A4B]/55">{comic.modelAttribution}</p>
          <button
            type="button"
            onClick={() => {
              setComic(null);
              setThemeId(null);
              setDedication("");
              setDetails({
                firstName: "",
                ageRange: "6-8",
                gender: "",
                photoDataUrl: null,
                photoConsent: false,
              });
              setStep("details");
            }}
            className="w-full text-sm font-medium text-[#1B3A4B] underline"
          >
            Create another comic
          </button>
        </section>
      )}
    </div>
  );
}

function StepDots({ step }: { step: FlowStep }) {
  const order: FlowStep[] = [
    "signin",
    "details",
    "theme",
    "generating",
    "preview",
    "export",
  ];
  const idx = order.indexOf(step);
  return (
    <div className="mb-6 flex justify-center gap-1.5" aria-hidden>
      {order.map((s, i) => (
        <span
          key={s}
          className={`h-1.5 rounded-full transition-all ${
            i <= idx ? "w-6 bg-[#FF6B35]" : "w-1.5 bg-[#1B3A4B]/20"
          }`}
        />
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l.1.1 6.2 5.2C39.2 37.3 44 32 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
