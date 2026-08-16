import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { IndustryGrid } from "@/components/marketing/industry-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { EmptyState } from "@/components/ui/empty-state";
import { loadPublicIndustries } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "TechCore works across healthcare, education, retail, finance, manufacturing, property, logistics, and startups.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const industries = await loadPublicIndustries();

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="We learn the operating model first."
        description="Industry pages on this site describe the kinds of work we take on. They are not claims that we run hospitals, banks, or factories."
        actions={
          <>
            <ButtonLink href="#industries" variant="primary">
              Explore Industry
            </ButtonLink>
            <ButtonLink href="/contact" variant="inverse">
              Contact Us
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
