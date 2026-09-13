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

  const staticSitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const dynamicSitemap = [
    ...serviceSlugs.map((item) => ({ url: `${siteUrl}/services/${item.slug}`, lastModified: item.updatedAt })),
    ...solutionSlugs.map((item) => ({ url: `${siteUrl}/solutions/${item.slug}`, lastModified: item.updatedAt })),
    ...industrySlugs.map((item) => ({ url: `${siteUrl}/industries/${item.slug}`, lastModified: item.updatedAt })),
    ...projectSlugs.map((item) => ({ url: `${siteUrl}/projects/${item.slug}`, lastModified: item.updatedAt })),
    ...jobSlugs.map((item) => ({ url: `${siteUrl}/careers/${item.slug}`, lastModified: item.updatedAt })),
    ...postSlugs.map((item) => ({ url: `${siteUrl}/blog/${item.slug}`, lastModified: item.updatedAt })),
  ];

  return [...staticSitemap, ...dynamicSitemap];
}
