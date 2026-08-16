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
import { listSolutions, getSolution } from "@/modules/catalog/admin.service";
import {
  createSolutionAction,
  deleteSolutionAction,
  publishSolutionAction,
  updateSolutionAction,
} from "@/modules/catalog/actions";
import { SolutionForm } from "@/components/admin/forms/solution-form";

const crumbs = { href: "/admin/solutions", label: "Solutions" };

export async function SolutionsListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePagePermission("content:read");
  const params = await searchParams;
  const data = await listSolutions({
    q: params.q,
    status: params.status,
    page: params.page,
  });
  const canWrite = hasPermission(user.role, "content:write");
  const canPublish = hasPermission(user.role, "content:publish");

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ href: "/admin/dashboard", label: "Dashboard" }, { label: "Solutions" }]} />
      <PageHeader
        title="Solutions"
        description="Packaged technology solutions."
        actions={
          canWrite ? (
            <ButtonLink href="/admin/solutions/new" size="sm">
              New solution
            </ButtonLink>
          ) : null
        }
      />
      <ListFilters
        action="/admin/solutions"
        searchDefault={params.q ?? ""}
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
        emptyTitle="No solutions"
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/solutions/${row.id}`} className="font-medium text-ink hover:underline">
                {row.title}
              </Link>
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
                    title="Change publish status?"
                    description="This updates the public solutions catalogue."
                    action={publishSolutionAction.bind(
                      null,
                      row.id,
                      row.status !== "published",
                    )}
                  />
                ) : null}
                {canWrite ? (
                  <RefreshConfirm
                    label="Delete"
                    title="Delete this solution?"
                    description="It will be removed from the CMS list."
                    confirmLabel="Delete"
                    variant="danger"
                    action={deleteSolutionAction.bind(null, row.id)}
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
        hrefForPage={(page) => listHref("/admin/solutions", { q: params.q, status: params.status }, page)}
      />
    </div>
  );
}

export async function SolutionCreatePage() {
  await requirePagePermission("content:write");
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ href: "/admin/dashboard", label: "Dashboard" }, crumbs, { label: "New" }]} />
      <PageHeader title="New solution" />
      <SolutionForm action={createSolutionAction} submitLabel="Create solution" />
    </div>
  );
}

export async function SolutionEditPage({ id }: { id: string }) {
  const user = await requirePagePermission("content:read");
  const record = await getSolution(id).catch(() => null);
  if (!record) notFound();
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ href: "/admin/dashboard", label: "Dashboard" }, crumbs, { label: record.title }]} />
      <PageHeader title={record.title} />
      {hasPermission(user.role, "content:write") ? (
        <SolutionForm
          action={updateSolutionAction.bind(null, id)}
          values={record as never}
          submitLabel="Save changes"
        />
      ) : (
        <p className="text-sm text-ink-muted">You have read-only access.</p>
      )}
    </div>
  );
}
