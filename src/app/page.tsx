import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Full-bleed hero — brand first */}
        <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-16 top-10 size-64 rounded-full bg-[#5EC8F2]/35 blur-3xl" />
            <div className="absolute -left-10 bottom-0 size-72 rounded-full bg-[#FFB347]/40 blur-3xl" />
          </div>

          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[#1B3A4B] sm:text-6xl">
                StoryToon
              </p>
              <h1 className="mt-4 max-w-md text-xl font-semibold leading-snug text-[#1B3A4B]/90 sm:text-2xl">
                Your child stars in a joyful, original comic — made safely for parents.
              </h1>
              <p className="mt-4 max-w-md text-base text-[#1B3A4B]/70">
                Photo stays in memory only. Export a print-ready PDF in minutes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#FF6B35] px-8 py-4 text-center text-lg font-bold text-white shadow-md transition hover:bg-[#e85d2c] active:scale-[0.98]"
                >
                  Create a Comic
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-2xl border-2 border-[#1B3A4B]/15 bg-white/60 px-8 py-4 text-center font-semibold text-[#1B3A4B]"
                >
                  How it works
                </Link>
              </div>
            </div>

            <div className="hero-float relative mx-auto w-full max-w-md">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1B6CA8] via-[#5EC8F2] to-[#FFB347] p-1 shadow-2xl">
                <div className="flex h-full flex-col justify-between rounded-[1.85rem] bg-[#FFF8F0]/95 p-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B35]">
                      Sample comic · illustrated
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold text-[#1B3A4B]">
                      The Kindness Cape
                    </p>
                    <p className="mt-1 text-sm text-[#1B3A4B]/70">
                      Everyday Hero theme — no licensed characters
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["Morning Mission", "Helping Hands", "Teamwork", "Hero Smile"].map(
                      (label, i) => (
                        <div
                          key={label}
                          className="rounded-xl p-3 text-xs font-semibold text-[#1B3A4B]"
                          style={{
                            background: ["#FFE8DC", "#FFF3C4", "#FFD6C8", "#FFE0B2"][i],
                          }}
                        >
                          {label}
                        </div>
                      )
                    )}
                  </div>
                  <p className="text-center text-[10px] uppercase tracking-wide text-[#1B3A4B]/45">
                    Made with AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#1B3A4B]">
            Built for phones and the web
          </h2>
          <p className="mt-2 max-w-2xl text-[#1B3A4B]/70">
            One responsive app: use it in the browser, install as a PWA on your phone, and later
            wrap with Capacitor for App Store & Play Store.
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                t: "Privacy-first",
                d: "No raw photo storage. Session metadata auto-purges in 24 hours.",
              },
              {
                t: "Original themes",
                d: "Superhero, Space, Fairytale, Jungle, Detective — IP-safe archetypes.",
              },
              {
                t: "Parent tools",
                d: "Google Sign-In, PDF export, optional Drive save, safety moderation.",
              },
            ].map((item) => (
              <li key={item.t} className="border-t-4 border-[#FF6B35] pt-4">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#1B3A4B]">
                  {item.t}
                </h3>
                <p className="mt-1 text-sm text-[#1B3A4B]/70">{item.d}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
