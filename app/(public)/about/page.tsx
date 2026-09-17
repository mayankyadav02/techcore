import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Accordion } from "@/components/ui/accordion";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { getPublicAbout, getPublicHomepage } from "@/modules/content/public.service";
import { loadPublicServices } from "@/lib/public-content";
import { EmptyState } from "@/components/ui/empty-state";
import { pageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicAbout();
  return pageMetadata({
    title: content.heroTitle || "About",
    description: content.heroDescription || "This is a fictional IT services practice organised around delivery, integrity, and operable software.",
    path: "/about",
    seoTitle: content.seoTitle,
    seoDescription: content.seoDescription,
  });
}

export default async function AboutPage() {
  const services = await loadPublicServices();
  const content = await getPublicAbout();
  const homeContent = await getPublicHomepage();

  return (
    <>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        actions={
          <>
            <ButtonLink href={content.heroPrimaryUrl} variant="primary">
              {content.heroPrimaryLabel}
            </ButtonLink>
            <ButtonLink href={content.heroSecondaryUrl} variant="inverse">
              {content.heroSecondaryLabel}
            </ButtonLink>
          </>
        }
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow={content.storyEyebrow}
            title={content.storyTitle}
            description={content.storyDescription}
          />
          <p className="text-sm leading-7 text-ink-muted">
            {content.storyBody}
          </p>
        </Container>
      </Section>

      <Section tone="muted">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-ink">{content.missionTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              {content.missionBody}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">{content.visionTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              {content.visionBody}
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow={content.valuesEyebrow} title={content.valuesTitle} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.values.map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-lg)] border border-line bg-elevated p-6"
              >
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading
            eyebrow={content.expertiseEyebrow}
            title={content.expertiseTitle}
          />
          {services.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No published practices"
                description="Published services will appear here once they are released from the CMS."
              />
            </div>
          ) : (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((item) => (
                <li
                  key={item.slug}
                  className="rounded-[var(--radius-md)] border border-line bg-elevated px-4 py-3 text-sm font-medium text-ink"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow={content.approachEyebrow}
            title={content.approachTitle}
            description={content.approachDescription}
          />
          <div>
            <SectionHeading eyebrow={content.expectationsEyebrow} title={content.expectationsTitle} />
            <ul className="mt-8 space-y-4">
              {homeContent.reasons.map((item) => (
                <li key={item.title}>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container className="max-w-3xl">
          <Accordion items={content.faqs} />
        </Container>
      </Section>

      <CtaBand
        title={content.ctaTitle}
        description={content.ctaDescription}
        primaryLabel={content.ctaPrimaryLabel}
        primaryHref={content.ctaPrimaryUrl}
        secondaryLabel={content.ctaSecondaryLabel}
        secondaryHref={content.ctaSecondaryUrl}
      />
    </>
  );
}
