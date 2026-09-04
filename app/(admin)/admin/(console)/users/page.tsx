import { UsersListPage } from "@/components/admin/pages/users-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <UsersListPage searchParams={searchParams} />;
}
