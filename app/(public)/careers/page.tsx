import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <PlaceholderPage
      eyebrow="People"
      title="Careers"
      description="Open roles will be published from the careers module."
    />
  );
}
