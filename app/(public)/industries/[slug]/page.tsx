import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ContentList } from "@/components/marketing/content-list";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { ButtonLink } from "@/components/ui/button-link";
import {
  industryStaticParams,
  loadPublicIndustry,
} from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return industryStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await loadPublicIndustry(slug);
  if (!item) return {};
  return pageMetadata({
    title: item.title,
    description: item.summary,
    path: `/industries/${item.slug}`,
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
  });
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await loadPublicIndustry(slug);
  if (!item) notFound();

  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={item.title}
        description={item.summary}
        actions={
          <>
            <ButtonLink href="/contact" variant="primary">
              Contact Us
            </ButtonLink>
            <ButtonLink href="/industries" variant="inverse">
              Explore Industry
            </ButtonLink>
          </>
        }
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-xl font-semibold text-ink">Context</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-ink-muted">
              {(item.body || item.summary).split(/\n\n/).map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ContentList title="Focus" items={item.focus} />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
