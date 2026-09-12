import { AuditLogsListPage } from "@/components/admin/pages/audit-logs-pages";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return <AuditLogsListPage searchParams={searchParams} />;
}
