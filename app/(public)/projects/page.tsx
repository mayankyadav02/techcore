import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <PlaceholderPage
      eyebrow="Work"
      title="Projects and case studies"
      description="Completed work will appear here once the content platform is live."
    />
  );
}
