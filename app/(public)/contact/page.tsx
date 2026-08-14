import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PlaceholderPage
      eyebrow="Talk to us"
      title="Contact"
      description="The contact form and enquiry pipeline ship with the leads phase."
    />
  );
}
