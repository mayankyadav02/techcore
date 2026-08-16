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
  mapService,
  mapSolution,
} from "@/lib/public-mappers";
import {
  getPublishedIndustry,
  getPublishedService,
  getPublishedSolution,
  listPublishedIndustries,
  listPublishedServices,
  listPublishedSolutions,
} from "@/modules/catalog/public.service";
import { getPublishedProject, listPublishedProjects } from "@/modules/work/public.service";
import { getPublishedPost, listPublishedPosts } from "@/modules/insights/public.service";
import { getOpenJob, listOpenJobs } from "@/modules/careers/public.service";

function asRecord(value: object): Record<string, unknown> {
  return value as Record<string, unknown>;
}

export const listPublicServicesApi = async () => mapPublicServices(await listPublishedServices());
export const getPublicServiceApi = async (slug: string) =>
  mapService(asRecord(await getPublishedService(slug)));

export const listPublicSolutionsApi = async () => mapPublicSolutions(await listPublishedSolutions());
export const getPublicSolutionApi = async (slug: string) =>
  mapSolution(asRecord(await getPublishedSolution(slug)));

export const listPublicIndustriesApi = async () =>
  mapPublicIndustries(await listPublishedIndustries());
export const getPublicIndustryApi = async (slug: string) =>
  mapIndustry(asRecord(await getPublishedIndustry(slug)));

export const listPublicProjectsApi = async () => mapPublicProjects(await listPublishedProjects());
export const getPublicProjectApi = async (slug: string) =>
  mapProject(asRecord(await getPublishedProject(slug)));

export const listPublicPostsApi = async (category?: string) =>
  mapPublicPosts(await listPublishedPosts(category));
export const getPublicPostApi = async (slug: string) =>
  mapPost(asRecord(await getPublishedPost(slug)));

export const listPublicJobsApi = async () => mapPublicJobs(await listOpenJobs());
export const getPublicJobApi = async (id: string) => mapJob(asRecord(await getOpenJob(id)));
