import { UsersDetailPage } from "@/components/admin/pages/users-pages";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UsersDetailPage id={id} />;
}
