import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Request a Quote" };

export default function RequestQuotePage() {
  return (
    <PlaceholderPage
      eyebrow="Engage"
      title="Start a project"
      description="Quote requests will create enquiry records for the admin team."
    />
  );
}
