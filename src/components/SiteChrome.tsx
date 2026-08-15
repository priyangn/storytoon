import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-[#FFF8F0]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[#1B3A4B] sm:text-2xl">
          StoryToon
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-[#1B3A4B]/80 sm:gap-5">
          <Link href="/how-it-works" className="hidden hover:text-[#1B3A4B] sm:inline">
            How it works
          </Link>
          <Link href="/privacy" className="hidden hover:text-[#1B3A4B] sm:inline">
            Privacy
          </Link>
          <Link
            href="/create"
            className="rounded-xl bg-[#FF6B35] px-3.5 py-2 text-white shadow-sm transition hover:bg-[#e85d2c] active:scale-[0.98]"
          >
            Create a Comic
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#1B3A4B]/10 bg-[#FFF8F0] px-4 py-8 text-center text-sm text-[#1B3A4B]/70">
      <p className="font-[family-name:var(--font-display)] text-base font-semibold text-[#1B3A4B]">
        StoryToon
      </p>
      <p className="mt-1">Personalized comics for parents — Made with AI · Original themes only</p>
      <p className="mt-3 flex flex-wrap justify-center gap-4">
        <Link href="/privacy" className="underline-offset-2 hover:underline">
          Privacy
        </Link>
        <Link href="/how-it-works" className="underline-offset-2 hover:underline">
          How it works
        </Link>
      </p>
    </footer>
  );
}
