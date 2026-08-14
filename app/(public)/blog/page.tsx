import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <PlaceholderPage
      eyebrow="Insights"
      title="Blog"
      description="Articles will be authored and published through the admin CMS."
    />
  );
}
