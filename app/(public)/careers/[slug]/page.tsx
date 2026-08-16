import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentList } from "@/components/marketing/content-list";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { ApplicationForm } from "@/components/forms/application-form";
import { jobStaticParams, loadPublicJob } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return jobStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await loadPublicJob(slug);
  if (!job) return {};
  return pageMetadata({
    title: job.title,
    description: `${job.title} — ${job.department}, ${job.location}.`,
    path: `/careers/${job.slug}`,
    seoTitle: job.seoTitle,
    seoDescription: job.seoDescription,
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await loadPublicJob(slug);
  if (!job) notFound();

  return (
    <>
      <PageHero
        eyebrow={job.department}
        title={job.title}
        description={`${job.location} · ${job.employmentType} · ${job.experience}`}
        actions={
          <ButtonLink href="#apply" variant="primary">
            Apply
          </ButtonLink>
        }
      />
      <Section>
        <Container>
          <p className="max-w-3xl text-sm leading-7 text-ink-muted">{job.description}</p>
          <div className="mt-12 grid gap-12 md:grid-cols-2">
            <ContentList title="Responsibilities" items={job.responsibilities} />
            <ContentList title="Requirements" items={job.requirements} />
          </div>
          {job.benefits && job.benefits.length > 0 ? (
            <div className="mt-12">
              <ContentList title="Benefits" items={job.benefits} />
            </div>
          ) : null}
          {job.skills.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-ink">Skills</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-[var(--radius-sm)] border border-line bg-elevated px-3 py-1 text-sm text-ink-muted"
          >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-12" id="apply">
            <h2 className="text-xl font-semibold text-ink">Apply</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Applications are stored for the hiring team. Resume files are
              validated but not kept on disk until media storage is enabled.
            </p>
            <div className="mt-6 max-w-xl rounded-[var(--radius-lg)] border border-line bg-elevated p-5 shadow-[var(--shadow-sm)] sm:p-6">
              <ApplicationForm jobId={job.id} />
            </div>
          </div>
          <p className="mt-10 text-sm">
            <Link href="/careers" className="inline-flex min-h-11 items-center font-medium text-ink hover:underline">
              All roles
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}
