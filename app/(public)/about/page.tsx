import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Accordion } from "@/components/ui/accordion";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { aboutFaqs, values } from "@/lib/content/about";
import { reasons } from "@/lib/content/home";
import { loadPublicServices } from "@/lib/public-content";
import { EmptyState } from "@/components/ui/empty-state";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "TechCore is a fictional IT services practice organised around delivery, integrity, and operable software.",
  path: "/about",
});

export default async function AboutPage() {
  const services = await loadPublicServices();
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="A serious technology practice."
        description="TechCore is presented as an independent delivery firm. We design and build digital systems that operations teams can run — and that leadership can explain."
        actions={
          <>
            <ButtonLink href="/contact" variant="primary">
              Contact Us
            </ButtonLink>
            <ButtonLink href="/services" variant="inverse">
              Explore Services
            </ButtonLink>
          </>
        }
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Story"
            title="Built around delivery, not display."
            description="The firm exists in this demonstration as a response to a familiar pattern: organisations buy software that looks complete and then spend years teaching it their process."
          />
          <p className="text-sm leading-7 text-ink-muted">
            TechCore’s story, for the purpose of this site, is a practice that
            grew by staying on programmes after launch. Architecture, design,
            and engineering sit in one team so the artefact that ships is the
            artefact that was promised.
          </p>
        </Container>
      </Section>

      <Section tone="muted">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-ink">Mission</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              Help organisations replace fragile operational glue with software
              they can own, inspect, and extend.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">Vision</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              A standard of digital work in which public websites, internal
              tools, and integrations are held to the same quality bar.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Values" title="How we choose." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((item) => (
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
            eyebrow="Expertise"
            title="Practices, not a catalogue of buzzwords."
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
            eyebrow="Approach"
            title="Write the decision, then write the software."
            description="Discovery produces a recommendation a sponsor can accept or reject. Build work starts when the first release is named."
          />
          <div>
            <SectionHeading eyebrow="Why TechCore" title="Expectations." />
            <ul className="mt-8 space-y-4">
              {reasons.map((item) => (
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
          <Accordion items={aboutFaqs} />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
