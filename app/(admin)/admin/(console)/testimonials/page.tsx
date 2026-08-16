import { TestimonialsListPage } from "@/components/admin/pages/testimonials-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <TestimonialsListPage searchParams={searchParams} />;
}
