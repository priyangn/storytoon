import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { CreateWizard } from "@/components/CreateWizard";

export default function CreatePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <CreateWizard />
      </main>
      <SiteFooter />
    </div>
  );
}
