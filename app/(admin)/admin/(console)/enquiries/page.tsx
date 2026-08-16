import { EnquiriesListPage } from "@/components/admin/pages/enquiries-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <EnquiriesListPage searchParams={searchParams} />;
}
