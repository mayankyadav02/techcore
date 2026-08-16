import { Footer } from "@/components/marketing/footer";
import { MobileTabBar } from "@/components/marketing/mobile-tab-bar";
import { Navbar } from "@/components/marketing/navbar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { getPublicCompany } from "@/modules/content/public.service";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company = await getPublicCompany();

  return (
    <div className="flex min-h-full flex-col bg-surface pb-[calc(4.75rem+env(safe-area-inset-bottom))] lg:pb-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-elevated focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer company={company} />
      <ScrollToTop />
      <MobileTabBar />
    </div>
  );
}
