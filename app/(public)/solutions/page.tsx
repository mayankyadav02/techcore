import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { SolutionCard } from "@/components/marketing/solution-card";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { EmptyState } from "@/components/ui/empty-state";
import { loadPublicSolutions } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

import type { Metadata } from "next";
import { getAllPublicPageSeo } from "@/modules/content/public.service";

export async function generateMetadata(): Promise<Metadata> {
  const allSeo = await getAllPublicPageSeo();
  const seo = allSeo["solutions"] || {};
  return pageMetadata({
    title: "Solutions",
    description: "Sector solutions for healthcare, education, commerce, finance, property, and logistics.",
    path: "/solutions",
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
  });
}

export default async function SolutionsPage() {
  const solutions = await loadPublicSolutions();

  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Software shaped by the operating model."
        description="Each solution describes a problem we see repeatedly, the approach we take, and the kind of system that follows."
        actions={
          <>
            <ButtonLink href="#solutions" variant="primary">
              View Solutions
            </ButtonLink>
            <ButtonLink href="/contact" variant="inverse">
              Contact Us
            </ButtonLink>
          </>
        }
      />
      <Section>
        <Container>
          {solutions.length === 0 ? (
            <EmptyState
              title="No published solutions"
              description="Published solutions will appear here once they are released from the CMS."
            />
          ) : (
            <ul id="solutions" className="grid gap-5 md:grid-cols-2">
              {solutions.map((item) => (
                <li key={item.slug}>
                  <SolutionCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
