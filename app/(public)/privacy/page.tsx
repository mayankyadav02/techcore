import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { privacySections } from "@/lib/content/legal";
import { loadPublicLegalPage } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";
import { RichText } from "@/components/ui/rich-text";

import type { Metadata } from "next";
import { getAllPublicPageSeo } from "@/modules/content/public.service";

export async function generateMetadata(): Promise<Metadata> {
  const allSeo = await getAllPublicPageSeo();
  const seo = allSeo["privacy"] || {};
  return pageMetadata({
    title: "Privacy Policy",
    description: "How the demonstration website would handle personal information.",
    path: "/privacy",
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
  });
}

export default async function PrivacyPage() {
  const legal = await loadPublicLegalPage("privacy");
  const sections = privacySections;

  return (
    <>
      <PageHero eyebrow="Legal" title={legal?.content ? "Privacy Policy" : "Privacy Policy"} />
      <Section>
        <Container className="max-w-3xl space-y-10 rounded-[var(--radius-lg)] border border-line bg-elevated p-6 sm:p-10">
          {legal?.content ? (
            <RichText content={legal.content} />
          ) : (
            sections.map((item) => (
              <section key={item.title}>
                <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
              </section>
            ))
          )}
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
