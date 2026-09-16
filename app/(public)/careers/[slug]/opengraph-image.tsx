import { loadPublicJob } from "@/lib/public-content";
import { getPublicCompany } from "@/modules/content/public.service";
import { generateOgImage } from "@/lib/og";

export const alt = "Cover image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await loadPublicJob(slug);
  const company = await getPublicCompany();

  if (!job) {
    return generateOgImage({ companyName: company.name, logoUrl: company.logoMedia?.url });
  }

  // Jobs typically don't have separate SEO fields in this specific setup,
  // but if they do, we use them, else fallback to title & department
  return generateOgImage({
    title: job.seoTitle || job.title,
    description: job.seoDescription || `${job.department} - ${job.location}`,
    companyName: company.name,
    logoUrl: company.logoMedia?.url,
  });
}
