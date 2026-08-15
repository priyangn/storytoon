import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B3A4B]">
          Privacy
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#1B3A4B]/85">
          <p>
            <strong>Raw photos:</strong> Never persisted to StoryToon disk, object storage, or
            database. Processed in memory for generation, then discarded.
          </p>
          <p>
            <strong>Session metadata:</strong> Theme choice, consent flags, and temporary comic
            metadata are deleted within 24 hours.
          </p>
          <p>
            <strong>Google:</strong> Sign-In provides identity. Generation uses Google AI APIs via
            StoryToon’s backend credentials — you never paste an API key. Photos transmitted for
            generation are subject to Google’s API terms.
          </p>
          <p>
            <strong>Exports:</strong> PDFs you download or save to Drive live in places you control.
            StoryToon does not keep long-term comic libraries in MVP.
          </p>
          <p>
            <strong>Audience:</strong> StoryToon is a parent tool. Children are not unsupervised
            users of the product.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
