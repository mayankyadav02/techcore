import { ServicesListPage } from "@/components/admin/pages/services-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <ServicesListPage searchParams={searchParams} />;
}
