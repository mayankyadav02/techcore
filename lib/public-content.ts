import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import { loadListOrEmpty, loadOneOrEmpty, staticParamsFrom } from "@/lib/public-load";
import {
  mapIndustry,
  mapJob,
  mapPost,
  mapProject,
  mapPublicIndustries,
  mapPublicJobs,
  mapPublicPosts,
  mapPublicProjects,
  mapPublicServices,
  mapPublicSolutions,
  mapPublicTestimonials,
  mapService,
  mapSolution,
  type PublicIndustry,
  type PublicJob,
  type PublicPost,
  type PublicProject,
  type PublicService,
  type PublicSolution,
  type PublicTestimonial,
} from "@/lib/public-mappers";
import { services as staticServices } from "@/lib/content/services";
import { solutions as staticSolutions } from "@/lib/content/solutions";
import { industries as staticIndustries } from "@/lib/content/industries";
import { projects as staticProjects, relatedProjectList } from "@/lib/content/projects";
import { posts as staticPosts } from "@/lib/content/posts";
import { jobs as staticJobs } from "@/lib/content/jobs";
import {
  getPublishedService,
  getPublishedSolution,
  getPublishedIndustry,
  listPublishedIndustries,
  listPublishedIndustrySlugs,
  listPublishedServiceSlugs,
  listPublishedServices,
  listPublishedSolutionSlugs,
  listPublishedSolutions,
} from "@/modules/catalog/public.service";
import {
  getPublishedProject,
  listPublishedProjectSlugs,
  listPublishedProjects,
} from "@/modules/work/public.service";
import {
  getPublishedPost,
  listPublishedPostSlugs,
  listPublishedPosts,
} from "@/modules/insights/public.service";
import {
  getOpenJob,
  listOpenJobSlugs,
  listOpenJobs,
} from "@/modules/careers/public.service";
import { listPublishedTestimonials } from "@/modules/social-proof/public.service";

function asRecord(value: object): Record<string, unknown> {
  return value as Record<string, unknown>;
}

function tagged<T>(
  fn: () => Promise<T>,
  key: string,
  tag: string,
) {
  return unstable_cache(fn, [key], { tags: [tag], revalidate: 3600 });
}

const cachedServices = tagged(
  async () => mapPublicServices(await listPublishedServices()),
  "public-services",
  cacheTags.services,
);
const cachedSolutions = tagged(
  async () => mapPublicSolutions(await listPublishedSolutions()),
  "public-solutions",
  cacheTags.solutions,
);
const cachedIndustries = tagged(
  async () => mapPublicIndustries(await listPublishedIndustries()),
  "public-industries",
  cacheTags.industries,
);
const cachedProjects = tagged(
  async () => mapPublicProjects(await listPublishedProjects()),
  "public-projects",
  cacheTags.projects,
);
const cachedPosts = tagged(
  async () => mapPublicPosts(await listPublishedPosts()),
  "public-posts",
  cacheTags.posts,
);
const cachedJobs = tagged(
  async () => mapPublicJobs(await listOpenJobs()),
  "public-jobs",
  cacheTags.jobs,
);
const cachedTestimonials = tagged(
  async () => mapPublicTestimonials(await listPublishedTestimonials()),
  "public-testimonials",
  cacheTags.testimonials,
);

const cachedService = unstable_cache(
  async (slug: string) => mapService(asRecord(await getPublishedService(slug))),
  ["public-service"],
  { tags: [cacheTags.services], revalidate: 3600 },
);
const cachedSolution = unstable_cache(
  async (slug: string) => mapSolution(asRecord(await getPublishedSolution(slug))),
  ["public-solution"],
  { tags: [cacheTags.solutions], revalidate: 3600 },
);
const cachedProject = unstable_cache(
  async (slug: string) => mapProject(asRecord(await getPublishedProject(slug))),
  ["public-project"],
  { tags: [cacheTags.projects], revalidate: 3600 },
);
const cachedPost = unstable_cache(
  async (slug: string) => mapPost(asRecord(await getPublishedPost(slug))),
  ["public-post"],
  { tags: [cacheTags.posts], revalidate: 3600 },
);
const cachedJob = unstable_cache(
  async (slug: string) => mapJob(asRecord(await getOpenJob(slug))),
  ["public-job"],
  { tags: [cacheTags.jobs], revalidate: 3600 },
);

const cachedIndustry = unstable_cache(
  async (slug: string) => mapIndustry(asRecord(await getPublishedIndustry(slug))),
  ["public-industry"],
  { tags: [cacheTags.industries], revalidate: 3600 },
);

export async function loadPublicServices(): Promise<PublicService[]> {
  return loadListOrEmpty(cachedServices);
}

export async function loadPublicService(slug: string): Promise<PublicService | undefined> {
  return loadOneOrEmpty(async () => cachedService(slug));
}

export async function loadPublicSolutions(): Promise<PublicSolution[]> {
  return loadListOrEmpty(cachedSolutions);
}

export async function loadPublicSolution(slug: string): Promise<PublicSolution | undefined> {
  return loadOneOrEmpty(async () => cachedSolution(slug));
}

export async function loadPublicIndustries(): Promise<PublicIndustry[]> {
  return loadListOrEmpty(cachedIndustries);
}

export async function loadPublicIndustry(slug: string): Promise<PublicIndustry | undefined> {
  return loadOneOrEmpty(async () => cachedIndustry(slug));
}

export async function loadPublicProjects(): Promise<PublicProject[]> {
  return loadListOrEmpty(cachedProjects);
}

export async function loadPublicProject(slug: string): Promise<PublicProject | undefined> {
  return loadOneOrEmpty(async () => cachedProject(slug));
}

export async function loadPublicPosts(category?: string): Promise<PublicPost[]> {
  const posts = await loadListOrEmpty(cachedPosts);
  return category ? posts.filter((post) => post.category === category) : posts;
}

export async function loadPublicPost(slug: string): Promise<PublicPost | undefined> {
  return loadOneOrEmpty(async () => cachedPost(slug));
}

export async function loadPublicJobs(): Promise<PublicJob[]> {
  return loadListOrEmpty(cachedJobs);
}

export async function loadPublicJob(slug: string): Promise<PublicJob | undefined> {
  return loadOneOrEmpty(async () => cachedJob(slug));
}

export async function loadHomeTestimonials(): Promise<PublicTestimonial[]> {
  return loadListOrEmpty(cachedTestimonials);
}

export function relatedPublicPosts(posts: PublicPost[], slug: string, category: string) {
  return posts
    .filter((post) => post.slug !== slug)
    .sort((a, b) => Number(b.category === category) - Number(a.category === category))
    .slice(0, 3);
}

export function relatedPublicProjects(projects: PublicProject[], slug: string) {
  return relatedProjectList(projects, slug, 3);
}

export function publicBlogCategories(posts: PublicPost[]) {
  return [...new Set(posts.map((post) => post.category))];
}

export { featuredThenFill } from "@/lib/public-mappers";

export const serviceStaticParams = () =>
  staticParamsFrom(listPublishedServiceSlugs, staticServices);
export const solutionStaticParams = () =>
  staticParamsFrom(listPublishedSolutionSlugs, staticSolutions);
export const projectStaticParams = () =>
  staticParamsFrom(listPublishedProjectSlugs, staticProjects);
export const postStaticParams = () => staticParamsFrom(listPublishedPostSlugs, staticPosts);
export const jobStaticParams = () => staticParamsFrom(listOpenJobSlugs, staticJobs);
export const industryStaticParams = () =>
  staticParamsFrom(listPublishedIndustrySlugs, staticIndustries);
