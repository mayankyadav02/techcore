import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectFilterIsland } from "@/components/work/project-filter-island";
import { ProjectTile } from "@/components/work/project-tile";
import { loadPublicProjects } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";
import { projectFilterTags } from "@/lib/work/portfolio-filters";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Fictional TechCore case studies: ShopFlow, CarePlus, FleetPro, LearnHub, EstatePro, FinServe, GymCore, and FoodHub.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await loadPublicProjects();

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="How the work would look."
        description="These programmes are fictional. They exist to show structure, not to imply named clients. Filter the grid by the kind of product — labels are mapped from existing sectors and services, not a second category taxonomy."
        actions={
          <>
            <ButtonLink href="/projects" variant="primary">
              View Case Study
            </ButtonLink>
            <ButtonLink href="/contact" variant="inverse">
              Contact Us
            </ButtonLink>
          </>
        }
      />
      <Section>
        <Container>
          {projects.length === 0 ? (
            <EmptyState
              title="No published projects"
              description="Published case studies will appear here once they are released from the CMS."
            />
          ) : (
            <ProjectFilterIsland>
              {projects.map((project) => (
                <div
                  key={project.slug}
                  data-portfolio-tags={projectFilterTags(project).join(",")}
                  className="h-full"
                >
                  <ProjectTile project={project} />
                </div>
              ))}
            </ProjectFilterIsland>
          )}
        </Container>
      </Section>
      <CtaBand
        title="Discuss a similar programme"
        description="These cases are fictional demonstrations. Share a brief if you want TechCore to scope something in the same shape."
        primaryHref="/quote"
        primaryLabel="Discuss Similar Project"
      />
    </>
  );
}
