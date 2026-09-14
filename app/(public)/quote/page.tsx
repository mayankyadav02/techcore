import { Container } from "@/components/ui/container";
import { QuoteForm } from "@/components/forms/quote-form";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/seo";
import { loadPublicServices, loadPublicPageContent } from "@/lib/public-content";

import type { Metadata } from "next";
import { getAllPublicPageSeo } from "@/modules/content/public.service";

export async function generateMetadata(): Promise<Metadata> {
  const allSeo = await getAllPublicPageSeo();
  const seo = allSeo["quote"] || {};
  return pageMetadata({
    title: "Request a quote",
    description: "Start a TechCore project enquiry. Describe the work, budget, and timeline.",
    path: "/quote",
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
  });
}

export default async function QuotePage() {
  const pageContent = await loadPublicPageContent("quote");
  const rows = await loadPublicServices();
  const services = rows.map((item) => ({
    slug: item.slug,
    title: item.title,
  }));

  return (
    <>
      <PageHero
        eyebrow={pageContent?.heroEyebrow || "Engage"}
        title={pageContent?.heroTitle || "Start a project."}
        description={pageContent?.heroDescription || "Tell us the outcome you need. A valid submission is stored as an enquiry for the TechCore team. We treat security as default and start with a written first release."}
        actions={
          <>
            <ButtonLink href={pageContent?.primaryCta?.href || "#quote"} variant="primary">
              {pageContent?.primaryCta?.label || "Request a Quote"}
            </ButtonLink>
            {pageContent?.secondaryCta?.href && pageContent?.secondaryCta?.label && (
              <ButtonLink href={pageContent?.secondaryCta?.href} variant="inverse">
                {pageContent?.secondaryCta?.label}
              </ButtonLink>
            )}
          </>
        }
      />
      <Section>
        <Container className="max-w-3xl">
          <div
            id="quote"
            className="rounded-[var(--radius-lg)] border border-line bg-elevated p-5 shadow-[var(--shadow-sm)] sm:p-8"
          >
            {services.length === 0 ? (
              <EmptyState
                title="Quotes are unavailable"
                description="A quote can be requested once at least one service is published in the CMS."
              />
            ) : (
              <QuoteForm services={services} />
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
