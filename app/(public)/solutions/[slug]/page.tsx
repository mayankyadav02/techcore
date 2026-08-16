import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentList } from "@/components/marketing/content-list";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { loadPublicSolution, solutionStaticParams } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return solutionStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await loadPublicSolution(slug);
  if (!item) return {};
  return pageMetadata({
    title: `${item.title} solutions`,
    description: item.summary,
    path: `/solutions/${item.slug}`,
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
  });
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await loadPublicSolution(slug);
  if (!item) notFound();

  return (
    <>
      <PageHero
        eyebrow="Solution"
        title={item.title}
        description={item.summary}
        actions={
          <>
            <ButtonLink href="/contact" variant="primary">
              Contact Us
            </ButtonLink>
            <ButtonLink href="/solutions" variant="inverse">
              View Solution
            </ButtonLink>
          </>
        }
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-ink">Business problem</h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">{item.problem}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">Solution approach</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-ink-muted">
              {item.approach.split(/\n\n/).map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="muted">
        <Container className="grid gap-12 md:grid-cols-3">
          <ContentList title="Core features" items={item.features} />
          <ContentList title="Technology" items={item.technology} />
          <ContentList title="Benefits" items={item.benefits} />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
