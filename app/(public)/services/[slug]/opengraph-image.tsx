import { loadPublicService } from "@/lib/public-content";
import { getPublicCompany } from "@/modules/content/public.service";
import { generateOgImage } from "@/lib/og";

export const alt = "Cover image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await loadPublicService(slug);
  const company = await getPublicCompany();

  if (!service) {
    return generateOgImage({ companyName: company.name, logoUrl: company.logoMedia?.url });
  }

  return generateOgImage({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.summary,
    companyName: company.name,
    logoUrl: company.logoMedia?.url,
  });
}
