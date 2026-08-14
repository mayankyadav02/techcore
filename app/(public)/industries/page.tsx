import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Industries" };

export default function IndustriesPage() {
  return (
    <PlaceholderPage
      eyebrow="Sectors"
      title="Industry expertise"
      description="Industry pages will be managed as published CMS records."
    />
  );
}
