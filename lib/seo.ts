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
  companyName,
}: {
  title: string;
  description: string;
  path: string;
  seoTitle?: string;
  seoDescription?: string;
  companyName?: string;
}): Metadata {
  const fullTitle = seoTitle?.trim() || title;
  const metaDescription = seoDescription?.trim() || description;
  const url = `${siteUrl}${path}`;
  const brandName = companyName || site.name;

  return {
    title: fullTitle,
    description: metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: `${fullTitle} | ${brandName}`,
      description: metaDescription,
      url,
      siteName: brandName,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullTitle} | ${brandName}`,
      description: metaDescription,
    },
  };
}
