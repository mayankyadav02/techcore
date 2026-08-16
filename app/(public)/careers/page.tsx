import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { EmptyState } from "@/components/ui/empty-state";
import { loadPublicJobs } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers",
  description:
    "Open roles at TechCore: engineering, design, and quality. Fictional listings for this demonstration site.",
  path: "/careers",
});

export default async function CareersPage() {
  const jobs = await loadPublicJobs();

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Work with people who finish things."
        description="These roles describe the kind of team TechCore would hire. Applications are stored for the hiring team."
        actions={
          <ButtonLink href="#open-positions" variant="primary">
            View Openings
          </ButtonLink>
        }
      />
      <Section>
        <Container>
          <h2 id="open-positions" className="text-xl font-semibold text-ink">
            Open positions
          </h2>
          {jobs.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No open roles"
                description="When a role is marked open in the CMS, it will appear here."
              />
            </div>
          ) : (
            <ul className="mt-8 grid gap-4">
              {jobs.map((job) => (
                <li key={job.slug}>
                  <Card interactive className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Link
                        href={`/careers/${job.slug}`}
                        className="text-lg font-semibold text-ink hover:text-brand-dark"
                      >
                        {job.title}
                      </Link>
                      <p className="mt-1 text-sm text-ink-muted">
                        {job.department} · {job.location} · {job.employmentType}
                      </p>
                    </div>
                    <Link
                      href={`/careers/${job.slug}#apply`}
                      className="inline-flex min-h-11 items-center text-sm font-medium text-brand-dark hover:underline"
                    >
                      Apply
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
      <CtaBand
        title="Not seeing a role?"
        description="Send a short note through contact. Open roles are listed above when they are live."
        primaryHref="/contact"
        primaryLabel="Talk to TechCore"
        secondaryHref="/careers#open-positions"
        secondaryLabel="View open roles"
      />
    </>
  );
}
