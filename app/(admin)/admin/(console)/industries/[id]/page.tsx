import { IndustryEditPage } from "@/components/admin/pages/industries-pages";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <IndustryEditPage id={id} />;
}
