import { getPublicCompany } from "@/modules/content/public.service";
import { generateOgImage } from "@/lib/og";

export const alt = "Cover image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const company = await getPublicCompany();
  
  return generateOgImage({
    title: company.seoTitle || company.tagline,
    description: company.description,
    companyName: company.name,
    logoUrl: company.logoMedia?.url,
  });
}
