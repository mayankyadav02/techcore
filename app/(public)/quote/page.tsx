import { Container } from "@/components/ui/container";
import { QuoteForm } from "@/components/forms/quote-form";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/seo";
import { loadPublicServices } from "@/lib/public-content";

export const metadata = pageMetadata({
  title: "Request a quote",
  description:
    "Start a TechCore project enquiry. Describe the work, budget, and timeline.",
  path: "/quote",
});

export default async function QuotePage() {
  const rows = await loadPublicServices();
  const services = rows.map((item) => ({
    slug: item.slug,
    title: item.title,
  }));

  return (
    <>
      <PageHero
        eyebrow="Engage"
        title="Start a project."
        description="Tell us the outcome you need. A valid submission is stored as an enquiry for the TechCore team. We treat security as default and start with a written first release."
        actions={
          <>
            <ButtonLink href="#quote" variant="primary">
              Request a Quote
            </ButtonLink>
            <ButtonLink href="/contact" variant="inverse">
              Talk to TechCore
            </ButtonLink>
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
