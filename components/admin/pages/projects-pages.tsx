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
import { getProject, listProjects } from "@/modules/work/admin.service";
import {
  createProjectAction,
  deleteProjectAction,
  toggleProjectFeaturedAction,
  updateProjectAction,
} from "@/modules/work/actions";
import { ProjectForm } from "@/components/admin/forms/project-form";

export async function ProjectsListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePagePermission("content:read");
  const params = await searchParams;
  const data = await listProjects({
    q: params.q,
    status: params.status,
    featured: params.featured,
    page: params.page,
  });
  const canWrite = hasPermission(user.role, "content:write");

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ href: "/admin/dashboard", label: "Dashboard" }, { label: "Projects" }]} />
      <PageHeader
        title="Projects"
        description="Case studies and completed work."
        actions={
          canWrite ? (
            <ButtonLink href="/admin/projects/new" size="sm">
              New project
            </ButtonLink>
          ) : null
        }
      />
      <ListFilters
        action="/admin/projects"
        searchDefault={params.q ?? ""}
        filters={
          <>
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
            <FilterSelect
              name="featured"
              label="Featured"
              defaultValue={params.featured}
              options={[
                { value: "", label: "All" },
                { value: "true", label: "Featured" },
                { value: "false", label: "Not featured" },
              ]}
            />
          </>
        }
      />
      <DataTable
        columns={["Title", "Status", "Featured", "Actions"]}
        isEmpty={data.rows.length === 0}
        emptyTitle="No projects"
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/projects/${row.id}`} className="font-medium text-ink hover:underline">
                {row.title}
              </Link>
              <p className="text-xs text-ink-subtle">{row.sector}</p>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-4 py-3 text-sm text-ink-muted">{row.featured ? "Yes" : "No"}</td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {canWrite ? (
                  <>
                    <RefreshConfirm
                      label={row.featured ? "Unfeature" : "Feature"}
                      title="Toggle featured?"
                      description="Featured projects appear first on marketing surfaces."
                      action={toggleProjectFeaturedAction.bind(null, row.id)}
                    />
                    <RefreshConfirm
                      label="Delete"
                      title="Delete this project?"
                      description="It will be removed from the CMS list."
                      confirmLabel="Delete"
                      variant="danger"
                      action={deleteProjectAction.bind(null, row.id)}
                    />
                  </>
                ) : null}
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      <AdminPagination
        page={data.page}
        pageCount={data.pageCount}
        hrefForPage={(page) =>
          listHref("/admin/projects", { q: params.q, status: params.status, featured: params.featured }, page)
        }
      />
    </div>
  );
}

export async function ProjectCreatePage() {
  await requirePagePermission("content:write");
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/projects", label: "Projects" },
          { label: "New" },
        ]}
      />
      <PageHeader title="New project" />
      <ProjectForm action={createProjectAction} submitLabel="Create project" />
    </div>
  );
}

export async function ProjectEditPage({ id }: { id: string }) {
  const user = await requirePagePermission("content:read");
  const record = await getProject(id).catch(() => null);
  if (!record) notFound();
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/projects", label: "Projects" },
          { label: record.title },
        ]}
      />
      <PageHeader title={record.title} />
      {hasPermission(user.role, "content:write") ? (
        <ProjectForm
          action={updateProjectAction.bind(null, id)}
          values={record as never}
          submitLabel="Save changes"
        />
      ) : (
        <p className="text-sm text-ink-muted">You have read-only access.</p>
      )}
    </div>
  );
}
