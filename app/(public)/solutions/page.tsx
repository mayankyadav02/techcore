import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Solutions" };

export default function SolutionsPage() {
  return (
    <PlaceholderPage
      eyebrow="Platforms"
      title="Technology solutions"
      description="Packaged solutions will be listed and detailed from the CMS."
    />
  );
}
