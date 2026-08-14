import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <PlaceholderPage
      eyebrow="Capabilities"
      title="IT Services"
      description="The services catalogue will be published from the CMS."
    />
  );
}
