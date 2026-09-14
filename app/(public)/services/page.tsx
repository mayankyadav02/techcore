import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { ServiceCard } from "@/components/catalog/service-card";
import { EmptyState } from "@/components/ui/empty-state";
import { loadPublicServices, loadPublicPageContent } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

import type { Metadata } from "next";
import { getAllPublicPageSeo } from "@/modules/content/public.service";

export async function generateMetadata(): Promise<Metadata> {
  const allSeo = await getAllPublicPageSeo();
  const seo = allSeo["services"] || {};
  return pageMetadata({
    title: "Services",
    description: "Web, mobile, custom software, AI, cloud, design, security, and consulting from TechCore.",
    path: "/services",
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
  });
}

export default async function ServicesPage() {
  const pageContent = await loadPublicPageContent("services");
  const services = await loadPublicServices();

  return (
    <>
      <PageHero
          eyebrow={pageContent?.heroEyebrow || "Services"}
          title={pageContent?.heroTitle || "Eight practices. One standard."}
          description={pageContent?.heroDescription || "Choose a capability or combine them into a programme. Each service page sets out what we actually do."}
          actions={
            <>
              <ButtonLink href={pageContent?.primaryCta?.href || "#services"} variant="primary">
                {pageContent?.primaryCta?.label || "Explore Services"}
              </ButtonLink>
              <ButtonLink href={pageContent?.secondaryCta?.href || "/projects"} variant="inverse">
                {pageContent?.secondaryCta?.label || "View Projects"}
              </ButtonLink>
            </>
          }
        />
      <Section>
        <Container>
          {services.length === 0 ? (
            <EmptyState
              title="No published services"
              description="Published services will appear here once they are released from the CMS."
            />
          ) : (
            <div id="services" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service, index) => (
                <ServiceCard key={service.slug} service={service} index={index} />
              ))}
            </div>
          )}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
