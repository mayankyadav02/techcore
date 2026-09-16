import type { Metadata } from "next";
import { searchPublicContent } from "@/modules/search/public.service";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { SearchInput } from "@/components/marketing/search-input";
import Link from "next/link";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Search",
  description: "Search our site for services, solutions, projects, and insights.",
  robots: "noindex, nofollow", // Do not let search engines crawl every permutation
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q || "";
  const results = q ? await searchPublicContent(q) : [];

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={q ? `Results for "${q}"` : "Site Search"}
      />
      <Section className="pt-0">
        <Container className="max-w-4xl space-y-12">
          {/* Search bar at the top of the page */}
          <div className="flex justify-center mb-10">
            <SearchInput className="max-w-xl shadow-sm" />
          </div>

          {!q ? (
            <div className="text-center py-20 bg-elevated border border-line rounded-3xl dark:border-white/10">
              <Search className="mx-auto h-12 w-12 text-ink-muted mb-4 opacity-30" />
              <h2 className="text-xl font-semibold text-ink">Enter a search term</h2>
              <p className="mt-2 text-ink-muted max-w-sm mx-auto">
                Search our services, solutions, insights, and career opportunities.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 bg-elevated border border-line rounded-3xl dark:border-white/10">
              <Search className="mx-auto h-12 w-12 text-ink-muted mb-4 opacity-30" />
              <h2 className="text-xl font-semibold text-ink">No results found</h2>
              <p className="mt-2 text-ink-muted max-w-sm mx-auto">
                We couldn&apos;t find anything matching &quot;{q}&quot;. Try adjusting your keywords.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm font-medium text-ink-muted">
                Found {results.length} result{results.length === 1 ? "" : "s"}
              </p>
              
              <ul className="space-y-4">
                {results.map((result, idx) => (
                  <li key={`${result.type}-${result.slug}-${idx}`}>
                    <Link
                      href={result.href}
                      className="block p-6 bg-elevated border border-line rounded-2xl hover:border-brand/50 hover:shadow-md transition-all dark:border-white/10 dark:hover:border-brand/50 group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand-dark dark:text-brand-bright">
                          {result.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-ink dark:text-white group-hover:text-brand transition-colors">
                        {result.title}
                      </h3>
                      {result.description && (
                        <p className="mt-2 text-sm text-ink-muted line-clamp-2">
                          {result.description}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
