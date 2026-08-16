import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { EmptyState } from "@/components/ui/empty-state";
import { loadPublicPosts, publicBlogCategories } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Notes on delivery, architecture, AI, cloud, and security from the TechCore practice.",
  path: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPosts = await loadPublicPosts();
  const categories = publicBlogCategories(allPosts);
  const active = categories.find((item) => item === category);
  const posts = active ? allPosts.filter((post) => post.category === active) : allPosts;
  const featured = !active ? posts.find((post) => post.featured) ?? posts[0] : undefined;
  const filtered = featured
    ? posts.filter((post) => post.slug !== featured.slug)
    : posts;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Writing for people who have to ship."
        description="Short pieces on delivery and architecture. Not a content mill."
        actions={
          <ButtonLink href="/contact" variant="inverse">
            Contact Us
          </ButtonLink>
        }
      />
      <Section>
        <Container>
          <div className="flex flex-wrap gap-2" aria-label="Categories">
            <CategoryLink href="/blog" active={!active}>
              All
            </CategoryLink>
            {categories.map((item) => (
              <CategoryLink
                key={item}
                href={`/blog?category=${encodeURIComponent(item)}`}
                active={active === item}
              >
                {item}
              </CategoryLink>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                title="No published articles"
                description="Published posts will appear here once they are released from the CMS."
              />
            </div>
          ) : null}

          {featured ? (
            <article className="mt-12 rounded-[var(--radius-lg)] border border-line bg-elevated p-8 shadow-[var(--shadow-sm)]">
              <p className="text-xs tracking-[0.14em] text-ink-subtle uppercase">
                Featured · {featured.category}
              </p>
              <h2 className="mt-3 max-w-3xl text-2xl font-semibold break-words text-ink sm:text-3xl">
                <Link href={`/blog/${featured.slug}`} className="hover:text-brand-dark">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-muted">
                {featured.excerpt}
              </p>
              <p className="mt-3 text-xs text-ink-subtle">
                {featured.date} · {featured.readTime}
              </p>
              <Link
                href={`/blog/${featured.slug}`}
                className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-brand-dark hover:underline"
              >
                Read Article
              </Link>
            </article>
          ) : null}

          {filtered.length > 0 ? (
            <ul className="mt-8 grid gap-4">
              {filtered.map((post) => (
                <li key={post.slug} className="card-lift rounded-[var(--radius-lg)] border border-line bg-elevated p-6">
                  <p className="text-xs text-ink-subtle">
                    {post.category} · {post.date}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-ink">
                    <Link href={`/blog/${post.slug}`} className="hover:text-brand-dark">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-brand-dark hover:underline"
                  >
                    Read Article
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </Section>
      <CtaBand
        title="Put the writing to work."
        description="If an article maps to a programme you are scoping, talk to the practice. We will say if TechCore is the wrong team."
        primaryHref="/contact"
        primaryLabel="Talk to TechCore"
        secondaryHref="/quote"
        secondaryLabel="Request a Quote"
      />
    </>
  );
}

function CategoryLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center border px-3 py-1.5 text-sm",
        active
          ? "border-ink bg-ink text-surface"
          : "border-line bg-elevated text-ink-muted hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
