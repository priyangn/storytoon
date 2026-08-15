import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B3A4B]">
          How StoryToon works
        </h1>
        <ol className="mt-8 space-y-6 text-[#1B3A4B]/85">
          <li>
            <strong className="text-[#1B3A4B]">1. Sign in with Google</strong>
            <p className="mt-1 text-sm">
              No passwords stored by us. You consent once to account use and Google AI generation.
              Optional Drive access uses least-privilege file scope.
            </p>
          </li>
          <li>
            <strong className="text-[#1B3A4B]">2. Add details & a photo</strong>
            <p className="mt-1 text-sm">
              Camera or gallery on your phone or computer. You must confirm parental permission
              before anything is processed.
            </p>
          </li>
          <li>
            <strong className="text-[#1B3A4B]">3. We generate safely</strong>
            <p className="mt-1 text-sm">
              Fixed theme templates (no free-form prompts). Content is moderated before you see
              it. Photos are held in memory only — never written to our disk or database.
            </p>
          </li>
          <li>
            <strong className="text-[#1B3A4B]">4. Export your keepsake</strong>
            <p className="mt-1 text-sm">
              Download a PDF with a “Made with AI” label, or save to Drive. Session data auto-deletes
              within 24 hours.
            </p>
          </li>
        </ol>
        <p className="mt-10 rounded-2xl bg-white/70 p-4 text-sm text-[#1B3A4B]/70">
          StoryToon is for casual personal use by parents/guardians. AI output may include
          stylization quirks — it is not identity documentation.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
