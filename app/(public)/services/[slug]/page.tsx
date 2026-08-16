import { notFound } from "next/navigation";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentList } from "@/components/marketing/content-list";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { loadPublicService, serviceStaticParams } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return serviceStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await loadPublicService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
    seoTitle: service.seoTitle,
    seoDescription: service.seoDescription,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await loadPublicService(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.summary}
        actions={
          <>
            <ButtonLink href="/contact" variant="primary">
              Contact Us
            </ButtonLink>
            <ButtonLink href="/services" variant="inverse">
              Explore Service
            </ButtonLink>
          </>
        }
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-xl font-semibold text-ink">Overview</h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">{service.overview}</p>
          </div>
          <ContentList title="Capabilities" items={service.capabilities} />
        </Container>
      </Section>
      <Section tone="muted">
        <Container className="grid gap-12 md:grid-cols-2">
          <ContentList title="Features" items={service.features} />
          <ContentList title="Technologies" items={service.technologies} />
        </Container>
      </Section>
      <Section>
        <Container className="grid gap-12 md:grid-cols-2">
          <ContentList title="Benefits" items={service.benefits} />
          <ContentList title="Process" items={service.process} />
        </Container>
      </Section>
      {service.faqs.length > 0 ? (
        <Section tone="muted">
          <Container className="max-w-3xl">
            <SectionHeading title="Questions" />
            <div className="mt-8">
              <Accordion items={service.faqs} />
            </div>
          </Container>
        </Section>
      ) : null}
      <CtaBand />
    </>
  );
}
