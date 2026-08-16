import { CareerEditPage } from "@/components/admin/pages/careers-pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CareerEditPage id={id} />;
}
