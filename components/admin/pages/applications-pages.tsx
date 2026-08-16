import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { ListFilters, FilterSelect } from "@/components/admin/list-filters";
import { AdminPagination, listHref } from "@/components/admin/admin-pagination";
import { Card } from "@/components/ui/card";
import { requirePagePermission } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { displayDate } from "@/lib/admin/query";
import { getApplication, listApplications } from "@/modules/careers/admin.service";
import { addApplicationNoteAction, deleteApplicationAction, setApplicationStatusAction } from "@/modules/careers/actions";
import { ApplicationStatusForm } from "@/components/admin/forms/status-form";
import { NoteForm } from "@/components/admin/forms/note-form";
import { RefreshConfirm } from "@/components/admin/refresh-confirm";

export async function ApplicationsListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePagePermission("leads:read");
  const params = await searchParams;
  const data = await listApplications({
    q: params.q,
    status: params.status,
    jobId: params.jobId,
    page: params.page,
  });
  const canWrite = hasPermission(user.role, "leads:write");

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ href: "/admin/dashboard", label: "Dashboard" }, { label: "Applications" }]} />
      <PageHeader title="Applications" description="Candidates who applied through the careers pages." />
      <ListFilters
        action="/admin/applications"
        searchDefault={params.q ?? ""}
        searchPlaceholder="Search name, email, or role"
        filters={
          <>
            <FilterSelect
              name="status"
              label="Status"
              defaultValue={params.status}
              options={[
                { value: "", label: "All statuses" },
                { value: "new", label: "New" },
                { value: "reviewing", label: "Reviewing" },
                { value: "shortlisted", label: "Shortlisted" },
                { value: "rejected", label: "Rejected" },
                { value: "hired", label: "Hired" },
                { value: "archived", label: "Archived" },
              ]}
            />
            {params.jobId ? <input type="hidden" name="jobId" value={params.jobId} /> : null}
          </>
        }
      />
      <DataTable
        columns={["Applicant", "Role", "Status", "Received", "Actions"]}
        isEmpty={data.rows.length === 0}
        emptyTitle="No applications"
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/applications/${row.id}`} className="font-medium text-ink hover:underline">
                {row.name}
              </Link>
              <p className="text-xs text-ink-subtle">{row.email}</p>
            </td>
            <td className="px-4 py-3 text-ink-muted">{row.jobTitleSnapshot}</td>
            <td className="px-4 py-3">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-4 py-3 text-ink-muted">
              {displayDate((row as { createdAt?: Date }).createdAt)}
            </td>
            <td className="px-4 py-3">
              {canWrite ? (
                <RefreshConfirm
                  label="Delete"
                  title="Delete this application?"
                  description="The application will be hidden from the admin list."
                  confirmLabel="Delete"
                  variant="danger"
                  action={deleteApplicationAction.bind(null, row.id)}
                />
              ) : null}
            </td>
          </tr>
        ))}
      </DataTable>
      <AdminPagination
        page={data.page}
        pageCount={data.pageCount}
        hrefForPage={(page) =>
          listHref("/admin/applications", { q: params.q, status: params.status, jobId: params.jobId }, page)
        }
      />
    </div>
  );
}

export async function ApplicationDetailPage({ id }: { id: string }) {
  const user = await requirePagePermission("leads:read");
  const record = await getApplication(id).catch(() => null);
  if (!record) notFound();
  const canWrite = hasPermission(user.role, "leads:write");

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/applications", label: "Applications" },
          { label: record.name },
        ]}
      />
      <PageHeader title={record.name} description={record.email} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-3 lg:col-span-2">
          <p className="text-sm text-ink-muted">
            Phone: {record.phone || "—"}
          </p>
          <p className="text-sm text-ink-muted">
            Role:{" "}
            <Link href={`/admin/careers/${String(record.jobId)}`} className="text-ink hover:underline">
              {record.jobTitleSnapshot}
            </Link>
          </p>
          <div>
            <h2 className="text-sm font-semibold text-ink">Cover note</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-ink-muted">
              {record.coverLetter || "No cover note."}
            </p>
          </div>
          <div className="border-t border-line pt-4">
            <h2 className="text-sm font-semibold text-ink">Notes</h2>
            <ul className="mt-3 space-y-3">
              {(Array.isArray(record.notes) ? record.notes : []).map((note, index) => {
                const item = note as { _id?: unknown; body?: string; createdAt?: Date };
                return (
                  <li key={String(item._id ?? index)} className="text-sm text-ink-muted">
                    <p className="whitespace-pre-wrap">{item.body}</p>
                    <p className="mt-1 text-xs text-ink-subtle">
                      {displayDate(item.createdAt)}
                    </p>
                  </li>
                );
              })}
            </ul>
            {canWrite ? (
              <div className="mt-4">
                <NoteForm action={addApplicationNoteAction.bind(null, id)} />
              </div>
            ) : null}
          </div>
        </Card>
        <Card className="space-y-4">
          <StatusBadge status={record.status} />
          {canWrite ? (
            <>
              <ApplicationStatusForm
                current={record.status}
                action={setApplicationStatusAction.bind(null, id)}
              />
              <RefreshConfirm
                label="Delete application"
                title="Delete this application?"
                description="The application will be hidden from the admin list."
                confirmLabel="Delete"
                variant="danger"
                redirectTo="/admin/applications"
                action={deleteApplicationAction.bind(null, id)}
              />
            </>
          ) : (
            <p className="text-sm text-ink-muted">Status is read-only for your role.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
