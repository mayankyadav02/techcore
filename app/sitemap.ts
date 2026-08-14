import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://techcore.example";
  const paths = [
    "",
    "/about",
    "/services",
    "/solutions",
    "/industries",
    "/projects",
    "/careers",
    "/blog",
    "/contact",
    "/request-quote",
    "/privacy",
    "/terms",
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
