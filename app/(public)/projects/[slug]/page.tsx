import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/work/case-study-view";
import {
  loadPublicIndustries,
  loadPublicProject,
  loadPublicProjects,
  loadPublicServices,
  loadPublicSolutions,
  projectStaticParams,
  relatedPublicProjects,
} from "@/lib/public-content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return projectStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await loadPublicProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, projects, industries, solutions, services] = await Promise.all([
    loadPublicProject(slug),
    loadPublicProjects(),
    loadPublicIndustries(),
    loadPublicSolutions(),
    loadPublicServices(),
  ]);
  if (!project) notFound();
  const related = relatedPublicProjects(projects, project.slug);

  return (
    <CaseStudyView
      project={project}
      related={related}
      catalogues={{ industries, solutions, services }}
    />
  );
}
