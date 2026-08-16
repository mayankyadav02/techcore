import type { Metadata } from "next";
import { env } from "@/lib/env";
import { site } from "@/lib/site";

export const siteUrl = env.APP_URL;

export function pageMetadata({
  title,
  description,
  path,
  seoTitle,
  seoDescription,
}: {
  title: string;
  description: string;
  path: string;
  seoTitle?: string;
  seoDescription?: string;
}): Metadata {
  const fullTitle = seoTitle?.trim() || title;
  const metaDescription = seoDescription?.trim() || description;
  const url = `${siteUrl}${path}`;

  return {
    title: fullTitle,
    description: metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: `${fullTitle} | ${site.name}`,
      description: metaDescription,
      url,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullTitle} | ${site.name}`,
      description: metaDescription,
    },
  };
}
