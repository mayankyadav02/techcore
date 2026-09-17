import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectFilterIsland } from "@/components/work/project-filter-island";
import { ProjectTile } from "@/components/work/project-tile";
import { loadPublicProjects, loadPublicPageContent } from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";
import { projectFilterTags } from "@/lib/work/portfolio-filters";

import type { Metadata } from "next";
import { getAllPublicPageSeo } from "@/modules/content/public.service";

export async function generateMetadata(): Promise<Metadata> {
  const allSeo = await getAllPublicPageSeo();
  const seo = allSeo["projects"] || {};
  return pageMetadata({
    title: "Projects",
    description:
      "Recent delivery from our team, including complex re-platforming and custom enterprise software.",
    path: "/projects",
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
  });
}

export default async function ProjectsPage() {
  const pageContent = await loadPublicPageContent("projects");
  const projects = await loadPublicProjects();

  return (
    <>
      <PageHero
        eyebrow={pageContent?.heroEyebrow || "Projects"}
        title={pageContent?.heroTitle || "How the work would look."}
        description={pageContent?.heroDescription || "These programmes are fictional. They exist to show structure, not to imply named clients. Filter the grid by the kind of product — labels are mapped from existing sectors and services, not a second category taxonomy."}
        actions={
          <>
            <ButtonLink href={pageContent?.primaryCta?.href || "/projects"} variant="primary">
              {pageContent?.primaryCta?.label || "View Case Study"}
            </ButtonLink>
            <ButtonLink href={pageContent?.secondaryCta?.href || "/contact"} variant="inverse">
              {pageContent?.secondaryCta?.label || "Contact Us"}
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
        description="These cases are fictional demonstrations. Share a brief if you want us to scope something in the same shape."
        primaryHref="/quote"
        primaryLabel="Discuss Similar Project"
      />
    </>
  );
}
