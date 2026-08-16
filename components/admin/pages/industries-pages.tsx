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
import { listIndustries, getIndustry } from "@/modules/catalog/admin.service";
import {
  createIndustryAction,
  deleteIndustryAction,
  publishIndustryAction,
  updateIndustryAction,
} from "@/modules/catalog/actions";
import { IndustryForm } from "@/components/admin/forms/industry-form";

export async function IndustriesListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePagePermission("content:read");
  const params = await searchParams;
  const data = await listIndustries({
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
          { label: "Industries" },
        ]}
      />
      <PageHeader
        title="Industries"
        description="Vertical pages shown on the public site."
        actions={
          canWrite ? (
            <ButtonLink href="/admin/industries/new" size="sm">
              New industry
            </ButtonLink>
          ) : null
        }
      />
      <ListFilters
        action="/admin/industries"
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
        emptyTitle="No industries"
        emptyDescription="Create an industry page for the public catalogue."
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Link
                href={`/admin/industries/${row.id}`}
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
                    title={
                      row.status === "published"
                        ? "Unpublish industry?"
                        : "Publish industry?"
                    }
                    description="This changes what visitors can see on the public site."
                    action={publishIndustryAction.bind(
                      null,
                      row.id,
                      row.status !== "published",
                    )}
                  />
                ) : null}
                {canWrite ? (
                  <RefreshConfirm
                    label="Delete"
                    title="Delete this industry?"
                    description="The page will be removed from the public catalogue."
                    confirmLabel="Delete"
                    variant="danger"
                    action={deleteIndustryAction.bind(null, row.id)}
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
        hrefForPage={(page) => listHref("/admin/industries", filters, page)}
      />
    </div>
  );
}

export async function IndustryCreatePage() {
  await requirePagePermission("content:write");
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/industries", label: "Industries" },
          { label: "New" },
        ]}
      />
      <PageHeader title="New industry" description="Saved as a draft unless you publish." />
      <IndustryForm action={createIndustryAction} submitLabel="Create industry" />
    </div>
  );
}

export async function IndustryEditPage({ id }: { id: string }) {
  const user = await requirePagePermission("content:read");
  const record = await getIndustry(id).catch(() => null);
  if (!record) notFound();
  const canWrite = hasPermission(user.role, "content:write");

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/industries", label: "Industries" },
          { label: record.title },
        ]}
      />
      <PageHeader title={record.title} description={`/${record.slug}`} />
      {canWrite ? (
        <IndustryForm
          action={updateIndustryAction.bind(null, id)}
          values={record as never}
          submitLabel="Save changes"
        />
      ) : (
        <p className="text-sm text-ink-muted">You have read-only access.</p>
      )}
    </div>
  );
}
