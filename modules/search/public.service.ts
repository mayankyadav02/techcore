import { connectMongo } from "@/lib/db";
import { Service } from "@/modules/catalog/service.model";
import { Solution } from "@/modules/catalog/solution.model";
import { Industry } from "@/modules/catalog/industry.model";
import { Project } from "@/modules/work/project.model";
import { BlogPost } from "@/modules/insights/blog-post.model";
import { Job } from "@/modules/careers/job.model";

export type SearchResult = {
  type: "service" | "solution" | "industry" | "project" | "blog" | "job";
  title: string;
  slug: string;
  description: string;
  href: string;
};

const MAX_QUERY_LENGTH = 100;
const LIMIT_PER_MODEL = 10;

export async function searchPublicContent(query: string): Promise<SearchResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery || normalizedQuery.length === 0) {
    return [];
  }

  // Prevent super long queries (ReDoS / abuse)
  const safeQuery = normalizedQuery.slice(0, MAX_QUERY_LENGTH);

  try {
    await connectMongo();

    const publishedFilter = { status: "published" as const, deletedAt: null };
    const openJobFilter = { status: "open" as const, deletedAt: null };
    const textSearch = { $text: { $search: safeQuery } };
    const sortScore = { score: { $meta: "textScore" } };

    const [
      services,
      solutions,
      industries,
      projects,
      blogs,
      jobs,
    ] = await Promise.all([
      Service.find({ ...publishedFilter, ...textSearch }, { score: { $meta: "textScore" } })
        .sort(sortScore)
        .limit(LIMIT_PER_MODEL)
        .lean(),
      Solution.find({ ...publishedFilter, ...textSearch }, { score: { $meta: "textScore" } })
        .sort(sortScore)
        .limit(LIMIT_PER_MODEL)
        .lean(),
      Industry.find({ ...publishedFilter, ...textSearch }, { score: { $meta: "textScore" } })
        .sort(sortScore)
        .limit(LIMIT_PER_MODEL)
        .lean(),
      Project.find({ ...publishedFilter, ...textSearch }, { score: { $meta: "textScore" } })
        .sort(sortScore)
        .limit(LIMIT_PER_MODEL)
        .lean(),
      BlogPost.find({ ...publishedFilter, ...textSearch }, { score: { $meta: "textScore" } })
        .sort(sortScore)
        .limit(LIMIT_PER_MODEL)
        .lean(),
      Job.find({ ...openJobFilter, ...textSearch }, { score: { $meta: "textScore" } })
        .sort(sortScore)
        .limit(LIMIT_PER_MODEL)
        .lean(),
    ]);

    const results: SearchResult[] = [];

    for (const doc of services) {
      results.push({
        type: "service",
        title: (doc as any).title,
        slug: (doc as any).slug,
        description: (doc as any).summary,
        href: `/services/${(doc as any).slug}`,
      });
    }

    for (const doc of solutions) {
      results.push({
        type: "solution",
        title: (doc as any).title,
        slug: (doc as any).slug,
        description: (doc as any).summary,
        href: `/solutions/${(doc as any).slug}`,
      });
    }

    for (const doc of industries) {
      results.push({
        type: "industry",
        title: (doc as any).title,
        slug: (doc as any).slug,
        description: (doc as any).summary,
        href: `/industries/${(doc as any).slug}`,
      });
    }

    for (const doc of projects) {
      results.push({
        type: "project",
        title: (doc as any).title,
        slug: (doc as any).slug,
        description: (doc as any).summary,
        href: `/projects/${(doc as any).slug}`,
      });
    }

    for (const doc of blogs) {
      results.push({
        type: "blog",
        title: (doc as any).title,
        slug: (doc as any).slug,
        description: (doc as any).excerpt,
        href: `/blog/${(doc as any).slug}`,
      });
    }

    for (const doc of jobs) {
      results.push({
        type: "job",
        title: (doc as any).title,
        slug: (doc as any).slug,
        // Jobs have a description field which can be very long (8000 chars).
        // Let's use department & location as the description to keep it safe and concise.
        description: `${(doc as any).department || ""} - ${(doc as any).location || ""}`,
        href: `/careers/${(doc as any).slug}`,
      });
    }

    return results;
  } catch (error) {
    console.error("Search error:", error);
    // Don't expose MongoDB errors to the user
    return [];
  }
}
