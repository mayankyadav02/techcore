import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { loadListOrEmpty } from "@/lib/public-load";
import {
  listPublishedIndustrySlugs,
  listPublishedServiceSlugs,
  listPublishedSolutionSlugs,
} from "@/modules/catalog/public.service";
import { listPublishedProjectSlugs } from "@/modules/work/public.service";
import { listPublishedPostSlugs } from "@/modules/insights/public.service";
import { listOpenJobSlugs } from "@/modules/careers/public.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/about",
    "/services",
    "/solutions",
    "/industries",
    "/projects",
    "/careers",
    "/blog",
    "/contact",
    "/quote",
    "/privacy",
    "/terms",
  ];

  const [serviceSlugs, solutionSlugs, industrySlugs, projectSlugs, jobSlugs, postSlugs] =
    await Promise.all([
      loadListOrEmpty(listPublishedServiceSlugs),
      loadListOrEmpty(listPublishedSolutionSlugs),
      loadListOrEmpty(listPublishedIndustrySlugs),
      loadListOrEmpty(listPublishedProjectSlugs),
      loadListOrEmpty(listOpenJobSlugs),
      loadListOrEmpty(listPublishedPostSlugs),
    ]);

  const dynamic = [
    ...serviceSlugs.map((item) => `/services/${item.slug}`),
    ...solutionSlugs.map((item) => `/solutions/${item.slug}`),
    ...industrySlugs.map((item) => `/industries/${item.slug}`),
    ...projectSlugs.map((item) => `/projects/${item.slug}`),
    ...jobSlugs.map((item) => `/careers/${item.slug}`),
    ...postSlugs.map((item) => `/blog/${item.slug}`),
  ];

  return [...staticPaths, ...dynamic].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
