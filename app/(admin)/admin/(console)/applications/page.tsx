import { ApplicationsListPage } from "@/components/admin/pages/applications-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <ApplicationsListPage searchParams={searchParams} />;
}
