import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { termsSections } from "@/lib/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms",
  description: "Terms of use for the TechCore demonstration website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms" />
      <Section>
        <Container className="max-w-3xl space-y-10 rounded-[var(--radius-lg)] border border-line bg-elevated p-6 sm:p-10">
          {termsSections.map((item) => (
            <section key={item.title}>
              <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
            </section>
          ))}
        </Container>
      </Section>
      <CtaBand
        title="Ready to engage?"
        description="Request a Quote for a scoped brief, or talk to TechCore first."
        primaryHref="/quote"
        primaryLabel="Request a Quote"
      />
    </>
  );
}
