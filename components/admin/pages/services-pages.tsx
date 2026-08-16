import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { ListFilters, FilterSelect } from "@/components/admin/list-filters";
import { AdminPagination, listHref } from "@/components/admin/admin-pagination";
import { RefreshConfirm } from "@/components/admin/refresh-confirm";
import { ButtonLink } from "@/components/ui/button-link";
import { requirePagePermission } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { displayDate } from "@/lib/admin/query";
import { listServices, getService } from "@/modules/catalog/admin.service";
import {
  createServiceAction,
  deleteServiceAction,
  publishServiceAction,
  updateServiceAction,
} from "@/modules/catalog/actions";
import { ServiceForm } from "@/components/admin/forms/service-form";

export async function ServicesListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePagePermission("content:read");
  const params = await searchParams;
  const data = await listServices({
    q: params.q,
    status: params.status,
    page: params.page,
  });
  const canWrite = hasPermission(user.role, "content:write");
  const canPublish = hasPermission(user.role, "content:publish");
  const filters = { q: params.q, status: params.status };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { label: "Services" },
        ]}
      />
      <PageHeader
        title="Services"
        description="Catalogue of IT services shown on the public site."
        actions={
          canWrite ? (
            <ButtonLink href="/admin/services/new" size="sm">
              New service
            </ButtonLink>
          ) : null
        }
      />
      <ListFilters
        action="/admin/services"
        searchDefault={params.q ?? ""}
        searchPlaceholder="Search title or slug"
        filters={
          <FilterSelect
            name="status"
            label="Status"
            defaultValue={params.status}
            options={[
              { value: "", label: "All statuses" },
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
          />
        }
      />
      <DataTable
        columns={["Title", "Status", "Updated", "Actions"]}
        isEmpty={data.rows.length === 0}
        emptyTitle="No services"
        emptyDescription="Create a service to populate the public catalogue."
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Link
                href={`/admin/services/${row.id}`}
                className="font-medium text-ink hover:underline"
              >
                {row.title}
              </Link>
              <p className="text-xs text-ink-subtle">{row.slug}</p>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-4 py-3 text-ink-muted">
              {displayDate((row as { updatedAt?: Date }).updatedAt)}
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {canPublish ? (
                  <RefreshConfirm
                    label={row.status === "published" ? "Unpublish" : "Publish"}
                    title={row.status === "published" ? "Unpublish service?" : "Publish service?"}
                    description="This changes what visitors can see on the public site."
                    action={publishServiceAction.bind(
                      null,
                      row.id,
                      row.status !== "published",
                    )}
                  />
                ) : null}
                {canWrite ? (
                  <RefreshConfirm
                    label="Delete"
                    title="Delete this service?"
                    description="The service will be removed from the catalogue. This can be reversed in the database later."
                    confirmLabel="Delete"
                    variant="danger"
                    action={deleteServiceAction.bind(null, row.id)}
                  />
                ) : null}
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      <AdminPagination
        page={data.page}
        pageCount={data.pageCount}
        hrefForPage={(page) => listHref("/admin/services", filters, page)}
      />
    </div>
  );
}

export async function ServiceCreatePage() {
  await requirePagePermission("content:write");
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/services", label: "Services" },
          { label: "New" },
        ]}
      />
      <PageHeader title="New service" description="Saved as a draft unless you publish." />
      <ServiceForm action={createServiceAction} submitLabel="Create service" />
    </div>
  );
}

export async function ServiceEditPage({ id }: { id: string }) {
  const user = await requirePagePermission("content:read");
  const record = await getService(id).catch(() => null);
  if (!record) notFound();
  const canWrite = hasPermission(user.role, "content:write");

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/services", label: "Services" },
          { label: record.title },
        ]}
      />
      <PageHeader title={record.title} description={`/${record.slug}`} />
      {canWrite ? (
        <ServiceForm
          action={updateServiceAction.bind(null, id)}
          values={record as never}
          submitLabel="Save changes"
        />
      ) : (
        <p className="text-sm text-ink-muted">You have read-only access.</p>
      )}
    </div>
  );
}
