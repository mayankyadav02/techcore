import { Breadcrumb } from "@/components/admin/breadcrumb";
import { DataTable } from "@/components/admin/data-table";
import { ListFilters, FilterSelect } from "@/components/admin/list-filters";
import { AdminPagination, listHref } from "@/components/admin/admin-pagination";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { requirePagePermission } from "@/lib/auth";
import {
  listAuditLogActions,
  listAuditLogs,
} from "@/modules/shared/audit-log.admin.service";
import type { AuditLogListRow } from "@/modules/shared/audit-log.admin.service";

function formatDateTime(value: Date | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function ActorCell({ row }: { row: AuditLogListRow }) {
  if (!row.actor) {
    return <span className="text-ink-subtle">System</span>;
  }

  return (
    <div className="min-w-0">
      <p className="font-medium text-ink">{row.actor.name ?? "Unknown actor"}</p>
      <p className="text-xs text-ink-subtle">{row.actor.email ?? row.actor.id}</p>
    </div>
  );
}

function MetadataCell({ row }: { row: AuditLogListRow }) {
  if (row.metadata.items.length === 0 && row.metadata.hiddenCount === 0) {
    return <span className="text-ink-subtle">No metadata</span>;
  }

  return (
    <div className="max-w-xs space-y-1">
      {row.metadata.items.length > 0 ? (
        <ul className="space-y-1">
          {row.metadata.items.map((item) => (
            <li key={item.key} className="break-words text-xs text-ink-muted">
              <span className="font-medium text-ink">{item.key}:</span>{" "}
              {item.value}
            </li>
          ))}
        </ul>
      ) : null}
      {row.metadata.hiddenCount > 0 ? (
        <p className="text-xs text-ink-subtle">
          {row.metadata.hiddenCount} hidden field
          {row.metadata.hiddenCount === 1 ? "" : "s"}
        </p>
      ) : null}
    </div>
  );
}

export async function AuditLogsListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requirePagePermission("audit_logs:read");
  const params = await searchParams;
  const [data, actions] = await Promise.all([
    listAuditLogs({
      q: params.q,
      action: params.action,
      from: params.from,
      to: params.to,
      page: params.page,
    }),
    listAuditLogActions(),
  ]);
  const filters = {
    q: params.q,
    action: params.action,
    from: params.from,
    to: params.to,
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { label: "Audit Logs" },
        ]}
      />
      <PageHeader
        title="Audit Logs"
        description="Read-only record of admin and system activity."
      />
      <ListFilters
        action="/admin/audit-logs"
        searchDefault={params.q ?? ""}
        searchPlaceholder="Search action, resource type, or resource ID"
        filters={
          <>
            <FilterSelect
              name="action"
              label="Action"
              defaultValue={params.action}
              options={[
                { value: "", label: "All actions" },
                ...actions.map((action) => ({ value: action, label: action })),
              ]}
            />
            <div className="w-full sm:w-40">
              <Input
                type="date"
                name="from"
                defaultValue={params.from ?? ""}
                aria-label="From date"
              />
            </div>
            <div className="w-full sm:w-40">
              <Input
                type="date"
                name="to"
                defaultValue={params.to ?? ""}
                aria-label="To date"
              />
            </div>
          </>
        }
      />
      <DataTable
        columns={[
          "Date/time",
          "Actor",
          "Action",
          "Resource type",
          "Resource ID",
          "Metadata",
        ]}
        isEmpty={data.rows.length === 0}
        emptyTitle="No audit logs"
        emptyDescription="Try adjusting the search or filters."
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
              {formatDateTime(row.createdAt)}
            </td>
            <td className="px-4 py-3">
              <ActorCell row={row} />
            </td>
            <td className="px-4 py-3 font-medium whitespace-nowrap text-ink">
              {row.action}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
              {row.resourceType}
            </td>
            <td className="px-4 py-3 text-ink-muted">
              <span className="break-all">{row.resourceId || "-"}</span>
            </td>
            <td className="px-4 py-3">
              <MetadataCell row={row} />
            </td>
          </tr>
        ))}
      </DataTable>
      <AdminPagination
        page={data.page}
        pageCount={data.pageCount}
        hrefForPage={(page) => listHref("/admin/audit-logs", filters, page)}
      />
    </div>
  );
}
