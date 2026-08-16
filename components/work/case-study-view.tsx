import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentList } from "@/components/marketing/content-list";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FadeIn } from "@/components/motion/fade-in";
import { ProjectMockup } from "@/components/work/project-mockup";
import { ProjectTile } from "@/components/work/project-tile";
import type { PublicIndustry, PublicProject, PublicService, PublicSolution } from "@/lib/public-mappers";
import { primaryFilterLabel } from "@/lib/work/portfolio-filters";

function Prose({ children }: { children: string }) {
  return <p className="mt-4 text-sm leading-7 text-ink-muted">{children}</p>;
}

export function CaseStudyView({
  project,
  related,
  catalogues,
}: {
  project: PublicProject;
  related: PublicProject[];
  catalogues: {
    industries: PublicIndustry[];
    solutions: PublicSolution[];
    services: PublicService[];
  };
}) {
  const kind = project.kind ?? "Fictional Case Study";
  const category = primaryFilterLabel(project);
  const industry = catalogues.industries.find((item) => item.slug === project.industrySlug);
  const solution = catalogues.solutions.find((item) => item.slug === project.solutionSlug);
  const services = (project.serviceSlugs ?? [])
    .map((slug) => catalogues.services.find((item) => item.slug === slug))
    .filter((item): item is PublicService => Boolean(item));
  const mockups = project.mockups?.length ? project.mockups : ["Interface preview"];
  const timeline = project.timeline ?? [];

  return (
    <>
      <PageHero
        eyebrow={category}
        title={project.title}
        description={project.pitch || project.summary}
        actions={
          <>
            <ButtonLink href="/quote" variant="secondary">
              Discuss Similar Project
            </ButtonLink>
            <ButtonLink href="/contact" variant="inverse">
              Talk to TechCore
            </ButtonLink>
          </>
        }
      >
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-brand/40 bg-brand/15 px-3 py-1 text-xs tracking-wide text-white uppercase">
            {kind}
          </span>
          <span className="text-sm text-white/60">{project.sector}</span>
        </div>
        <FadeIn immediate className="mt-10 max-w-4xl">
          <ProjectMockup
            slug={project.slug}
            layout={project.mockupLayout}
            size="hero"
            caption={mockups[0]}
          />
        </FadeIn>
      </PageHero>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-ink">Overview</h2>
            <Prose>{project.overview}</Prose>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-ink">Industry</h2>
              {industry ? (
                <>
                  <Prose>{industry.summary}</Prose>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="mt-3 inline-block text-sm font-medium text-brand-dark hover:underline"
                  >
                    {industry.title} industry
                  </Link>
                </>
              ) : (
                <Prose>{project.sector}</Prose>
              )}
            </div>
            {solution ? (
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-ink uppercase">
                  Solution family
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{solution.summary}</p>
                <Link
                  href={`/solutions/${solution.slug}`}
                  className="mt-2 inline-block text-sm font-medium text-brand-dark hover:underline"
                >
                  {solution.title} solutions
                </Link>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <h2 className="text-xl font-semibold text-ink">Services delivered</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Capabilities illustrated in this fictional programme — not a statement of work for a named client.
          </p>
          {services.length > 0 ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <li key={service.slug} className="border-t border-line pt-4">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-lg font-semibold text-ink hover:text-brand-dark"
                  >
                    {service.title}
                  </Link>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{service.summary}</p>
                </li>
              ))}
            </ul>
          ) : (
            <Prose>Custom software delivery illustrated for this concept programme.</Prose>
          )}
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-ink">Challenge</h2>
            <Prose>{project.challenge}</Prose>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">Approach</h2>
            <Prose>
              {project.approach ||
                "Sequence a first release around the operational record, then add role-specific workspaces and integrations."}
            </Prose>
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <h2 className="text-xl font-semibold text-ink">Solution</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-muted">{project.solution}</p>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 md:grid-cols-2">
          <ContentList title="Key features" items={project.features} />
          <div>
            <h2 className="text-xl font-semibold text-ink">Technology stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.technology.map((item) => (
                <li
                  key={item}
                  className="rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2 text-sm text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading
            eyebrow="Interface"
            title="UI previews"
            description="CSS mockups of the concept product. They are not screenshots from a live customer system."
          />
          <div className="mt-12 space-y-12">
            {mockups.map((caption, index) => (
              <FadeIn key={caption}>
                <div
                  className={
                    index % 2 === 1
                      ? "grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]"
                      : "grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]"
                  }
                >
                  <ProjectMockup
                    slug={project.slug}
                    layout={index === 1 && project.mockupLayout !== "browser" ? project.mockupLayout : "browser"}
                    size="feature"
                    className={index % 2 === 1 ? "lg:order-2" : undefined}
                  />
                  <div className={index % 2 === 1 ? "lg:order-1" : undefined}>
                    <p className="text-xs tracking-[0.14em] text-brand-dark uppercase">
                      Preview {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-ink">{caption}</h3>
                    <p className="mt-3 text-sm leading-6 text-ink-muted">
                      Demonstration artefact for {project.title}. {kind} — not a production capture.
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Outcomes"
            title="Results / demo outcomes"
            description="Scenario outcomes for this fictional programme. They are not live production metrics and do not belong to a named customer."
          />
          {project.metrics?.length ? (
            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[var(--radius-md)] border border-line bg-surface px-5 py-4"
                >
                  <dt className="text-xs tracking-[0.14em] text-ink-subtle uppercase">{metric.label}</dt>
                  <dd className="mt-2 text-lg font-semibold text-ink">{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <ul className="mt-8 space-y-3">
            {project.results.map((item) => (
              <li key={item} className="border-l-2 border-brand/40 pl-4 text-sm leading-6 text-ink-muted">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {timeline.length > 0 ? (
        <Section tone="muted">
          <Container>
            <SectionHeading
              eyebrow="Delivery"
              title="Project timeline"
              description="A typical engagement sequence for a programme of this shape. Illustrative only — not a real client schedule."
            />
            <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {timeline.map((phase, index) => (
                <li key={phase.label} className="border-t border-line pt-5">
                  <p className="text-xs font-medium tracking-[0.14em] text-brand-dark">
                    {String(index + 1).padStart(2, "0")} · {phase.window}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{phase.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{phase.detail}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        title="Start a similar programme"
        description="Share a brief. We will tell you whether TechCore is the right team — these cases are fictional demonstrations, not proof of named customers."
        primaryHref="/quote"
        primaryLabel="Discuss Similar Project"
      />

      {related.length > 0 ? (
        <Section>
          <Container>
            <SectionHeading
              eyebrow="More work"
              title="Related projects"
              description="Other fictional programmes in the TechCore portfolio."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <ProjectTile key={item.slug} project={item} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
