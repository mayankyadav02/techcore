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
import { getJobAdmin, listJobs } from "@/modules/careers/admin.service";
import {
  createJobAction,
  deleteJobAction,
  setJobActiveAction,
  updateJobAction,
} from "@/modules/careers/actions";
import { JobForm } from "@/components/admin/forms/job-form";

export async function CareersListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePagePermission("content:read");
  const params = await searchParams;
  const data = await listJobs({ q: params.q, status: params.status, page: params.page });
  const canWrite = hasPermission(user.role, "content:write");
  const canPublish = hasPermission(user.role, "content:publish");

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ href: "/admin/dashboard", label: "Dashboard" }, { label: "Careers" }]} />
      <PageHeader
        title="Careers"
        description="Open roles and hiring status."
        actions={
          canWrite ? (
            <ButtonLink href="/admin/careers/new" size="sm">
              New role
            </ButtonLink>
          ) : null
        }
      />
      <ListFilters
        action="/admin/careers"
        searchDefault={params.q ?? ""}
        filters={
          <FilterSelect
            name="status"
            label="Status"
            defaultValue={params.status}
            options={[
              { value: "", label: "All statuses" },
              { value: "draft", label: "Draft" },
              { value: "open", label: "Open" },
              { value: "closed", label: "Closed" },
              { value: "archived", label: "Archived" },
            ]}
          />
        }
      />
      <DataTable
        columns={["Role", "Status", "Applications", "Actions"]}
        isEmpty={data.rows.length === 0}
        emptyTitle="No roles"
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/careers/${row.id}`} className="font-medium text-ink hover:underline">
                {row.title}
              </Link>
              <p className="text-xs text-ink-subtle">
                {row.department} · {row.location}
              </p>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-4 py-3">
              <Link href={`/admin/applications?jobId=${row.id}`} className="text-sm text-ink hover:underline">
                {row.applicationsCount} applications
              </Link>
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {canPublish ? (
                  <RefreshConfirm
                    label={row.status === "open" ? "Deactivate" : "Activate"}
                    title={row.status === "open" ? "Close this role?" : "Open this role?"}
                    description="Open roles accept applications on the careers pages."
                    action={setJobActiveAction.bind(
                      null,
                      row.id,
                      row.status !== "open",
                    )}
                  />
                ) : null}
                {canWrite ? (
                  <RefreshConfirm
                    label="Delete"
                    title="Delete this role?"
                    description="The role will be archived and hidden from the CMS list."
                    confirmLabel="Delete"
                    variant="danger"
                    action={deleteJobAction.bind(null, row.id)}
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
        hrefForPage={(page) => listHref("/admin/careers", { q: params.q, status: params.status }, page)}
      />
    </div>
  );
}

export async function CareerCreatePage() {
  await requirePagePermission("content:write");
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/careers", label: "Careers" },
          { label: "New" },
        ]}
      />
      <PageHeader title="New role" />
      <JobForm action={createJobAction} submitLabel="Create role" />
    </div>
  );
}

export async function CareerEditPage({ id }: { id: string }) {
  const user = await requirePagePermission("content:read");
  const record = await getJobAdmin(id).catch(() => null);
  if (!record) notFound();
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/careers", label: "Careers" },
          { label: record.title },
        ]}
      />
      <PageHeader
        title={record.title}
        actions={
          <ButtonLink href={`/admin/applications?jobId=${id}`} variant="outline" size="sm">
            View applications
          </ButtonLink>
        }
      />
      {hasPermission(user.role, "content:write") ? (
        <JobForm
          action={updateJobAction.bind(null, id)}
          values={record as never}
          submitLabel="Save changes"
        />
      ) : (
        <p className="text-sm text-ink-muted">You have read-only access.</p>
      )}
    </div>
  );
}
