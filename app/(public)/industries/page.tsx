import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { IndustryGrid } from "@/components/marketing/industry-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { EmptyState } from "@/components/ui/empty-state";
import { loadPublicIndustries, loadPublicPageContent } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

import type { Metadata } from "next";
import { getAllPublicPageSeo } from "@/modules/content/public.service";

export async function generateMetadata(): Promise<Metadata> {
  const allSeo = await getAllPublicPageSeo();
  const seo = allSeo["industries"] || {};
  return pageMetadata({
    title: "Industries",
    description: "TechCore works across healthcare, education, retail, finance, manufacturing, property, logistics, and startups.",
    path: "/industries",
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
  });
}

export default async function IndustriesPage() {
  const pageContent = await loadPublicPageContent("industries");
  const industries = await loadPublicIndustries();

  return (
    <>
      <PageHero
          eyebrow={pageContent?.heroEyebrow || "Industries"}
          title={pageContent?.heroTitle || "We learn the operating model first."}
          description={pageContent?.heroDescription || "Industry pages on this site describe the kinds of work we take on. They are not claims that we run hospitals, banks, or factories."}
          actions={
            <>
              <ButtonLink href={pageContent?.primaryCta?.href || "#industries"} variant="primary">
                {pageContent?.primaryCta?.label || "Explore Industry"}
              </ButtonLink>
              <ButtonLink href={pageContent?.secondaryCta?.href || "/contact"} variant="inverse">
                {pageContent?.secondaryCta?.label || "Contact Us"}
              </ButtonLink>
            </>
          }
      />
      <Section>
        <Container>
          {industries.length === 0 ? (
            <EmptyState
              title="No published industries"
              description="Published industry pages will appear here once they are released from the CMS."
            />
          ) : (
            <div id="industries">
              <IndustryGrid industries={industries} />
            </div>
          )}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
