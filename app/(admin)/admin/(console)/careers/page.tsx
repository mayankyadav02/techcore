import { CareersListPage } from "@/components/admin/pages/careers-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <CareersListPage searchParams={searchParams} />;
}
