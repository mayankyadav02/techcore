import type { Project } from "@/lib/content/projects";

/**
 * Listing chips are presentation labels, not new CMS categories.
 *
 * Mapping from existing project fields:
 * - Web ← service `web-development`, or web-ish technology (Next.js / React) without a mobile-only stack
 * - Mobile ← service `mobile-app-development`, or Flutter / React Native
 * - Software ← service `custom-software`, or sector language around operations platforms
 * - AI ← service `ai-machine-learning`, or technology/summary mentioning AI / ML / search ranking as ML
 * - E-commerce ← solution `e-commerce`, sector retail/hospitality commerce, or catalogue/checkout language
 * - Dashboard ← ops workspaces: queues, boards, portals, dispatch, admin desks (healthcare, finance, logistics, property)
 *
 * A project may match several chips. "All" shows the full published list.
 */
export const portfolioFilterIds = [
  "All",
  "Web",
  "Mobile",
  "Software",
  "AI",
  "E-commerce",
  "Dashboard",
] as const;

export type PortfolioFilterId = (typeof portfolioFilterIds)[number];

export type FilterableProject = Pick<
  Project,
  | "slug"
  | "title"
  | "sector"
  | "summary"
  | "overview"
  | "technology"
  | "serviceSlugs"
  | "solutionSlug"
  | "industrySlug"
>;

function haystack(project: FilterableProject) {
  return [
    project.slug,
    project.title,
    project.sector,
    project.summary,
    project.overview,
    project.solutionSlug,
    project.industrySlug,
    ...(project.serviceSlugs ?? []),
    ...project.technology,
  ]
    .join(" ")
    .toLowerCase();
}

export function projectFilterTags(project: FilterableProject): Exclude<PortfolioFilterId, "All">[] {
  const text = haystack(project);
  const services = new Set(project.serviceSlugs ?? []);
  const tags = new Set<Exclude<PortfolioFilterId, "All">>();

  if (services.has("web-development") || /\bnext\.js\b|\breact\b/.test(text)) {
    tags.add("Web");
  }
  if (
    services.has("mobile-app-development") ||
    /\bflutter\b|\breact native\b|\bmobile app\b/.test(text)
  ) {
    tags.add("Mobile");
  }
  if (services.has("custom-software") || /\boperations\b|\bplatform\b|\bworkspace\b/.test(text)) {
    tags.add("Software");
  }
  if (services.has("ai-machine-learning") || /\bai\b|\bmachine learning\b|\bml\b/.test(text)) {
    tags.add("AI");
  }
  if (
    project.solutionSlug === "e-commerce" ||
    /\be-commerce\b|\becommerce\b|\bcatalogue\b|\bcheckout\b|\border/.test(text) ||
    project.industrySlug === "retail"
  ) {
    tags.add("E-commerce");
  }
  if (
    /\bdashboard\b|\bqueue\b|\bportal\b|\bboard\b|\bdispatch\b|\badmin\b|\bdesk\b|\bpathway\b/.test(
      text,
    ) ||
    ["healthcare", "finance", "logistics", "real-estate"].includes(project.industrySlug ?? "")
  ) {
    tags.add("Dashboard");
  }

  return portfolioFilterIds.filter((id): id is Exclude<PortfolioFilterId, "All"> => id !== "All" && tags.has(id));
}

export function projectMatchesFilter(project: FilterableProject, filter: PortfolioFilterId) {
  if (filter === "All") return true;
  return projectFilterTags(project).includes(filter);
}

export function primaryFilterLabel(project: FilterableProject) {
  const tags = projectFilterTags(project);
  if (project.solutionSlug === "e-commerce" && tags.includes("E-commerce")) return "E-commerce";
  if (tags.includes("Mobile") && (project.slug === "gymcore" || project.slug === "foodhub")) {
    return "Mobile";
  }
  if (tags.includes("Dashboard") && ["careplus", "finserve", "fleetpro", "estatepro"].includes(project.slug)) {
    return "Dashboard";
  }
  return tags[0] ?? project.sector;
}
