import { TestimonialEditPage } from "@/components/admin/pages/testimonials-pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TestimonialEditPage id={id} />;
}
