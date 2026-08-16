import { IndustriesListPage } from "@/components/admin/pages/industries-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <IndustriesListPage searchParams={searchParams} />;
}
