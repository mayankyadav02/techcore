import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { privacySections } from "@/lib/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How the TechCore demonstration website would handle personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Section>
        <Container className="max-w-3xl space-y-10 rounded-[var(--radius-lg)] border border-line bg-elevated p-6 sm:p-10">
          {privacySections.map((item) => (
            <section key={item.title}>
              <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
            </section>
          ))}
        </Container>
      </Section>
      <CtaBand
        title="Questions about how we work?"
        description="Talk to the practice, or start a project brief if you already have a programme in mind."
        primaryHref="/quote"
        primaryLabel="Request a Quote"
      />
    </>
  );
}
