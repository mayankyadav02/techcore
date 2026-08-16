import { ServiceEditPage } from "@/components/admin/pages/services-pages";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServiceEditPage id={id} />;
}
