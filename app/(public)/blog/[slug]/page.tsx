import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import {
  loadPublicPost,
  loadPublicPosts,
  postStaticParams,
  relatedPublicPosts,
} from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return postStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await loadPublicPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await loadPublicPost(slug);
  if (!post) notFound();
  const all = await loadPublicPosts();
  const related = relatedPublicPosts(all, post.slug, post.category);

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={`${post.date} · ${post.readTime}`}
        actions={
          <ButtonLink href="/contact" variant="inverse">
            Contact Us
          </ButtonLink>
        }
      />
      <Section>
        <Container className="max-w-3xl">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mt-5 text-base leading-8 text-ink-muted first:mt-0">
              {paragraph}
            </p>
          ))}
        </Container>
      </Section>
      <Section tone="muted">
        <Container>
          <h2 className="text-xl font-semibold text-ink">Related</h2>
          <ul className="mt-6 grid gap-8 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug} className="rounded-[var(--radius-md)] border border-line bg-elevated p-4">
                <p className="text-xs text-ink-subtle">{item.category}</p>
                <Link
                  href={`/blog/${item.slug}`}
                  className="mt-2 block font-medium text-ink hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm">
            <Link href="/blog" className="font-medium text-ink hover:underline">
              All articles
            </Link>
          </p>
        </Container>
      </Section>
      <CtaBand
        title="Discuss this with the practice."
        description="A short conversation is enough to tell you whether the idea belongs in a first release."
        primaryHref="/contact"
        primaryLabel="Talk to TechCore"
        secondaryHref="/quote"
        secondaryLabel="Request a Quote"
      />
    </>
  );
}
