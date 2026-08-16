import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { ServiceCard } from "@/components/catalog/service-card";
import { EmptyState } from "@/components/ui/empty-state";
import { loadPublicServices } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Web, mobile, custom software, AI, cloud, design, security, and consulting from TechCore.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await loadPublicServices();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Eight practices. One standard."
        description="Choose a capability or combine them into a programme. Each service page sets out what we actually do."
        actions={
          <>
            <ButtonLink href="#services" variant="primary">
              Explore Services
            </ButtonLink>
            <ButtonLink href="/projects" variant="inverse">
              View Projects
            </ButtonLink>
          </>
        }
      />
      <Section>
        <Container>
          {services.length === 0 ? (
            <EmptyState
              title="No published services"
              description="Published services will appear here once they are released from the CMS."
            />
          ) : (
            <div id="services" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service, index) => (
                <ServiceCard key={service.slug} service={service} index={index} />
              ))}
            </div>
          )}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
