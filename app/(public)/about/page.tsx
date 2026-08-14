import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="Company"
      title="About TechCore"
      description="Company story, values, and leadership will be managed as CMS page content."
    />
  );
}
