import { SolutionsListPage } from "@/components/admin/pages/solutions-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <SolutionsListPage searchParams={searchParams} />;
}
