import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { ListFilters, FilterSelect } from "@/components/admin/list-filters";
import { AdminPagination, listHref } from "@/components/admin/admin-pagination";
import { RefreshConfirm } from "@/components/admin/refresh-confirm";
import { Card } from "@/components/ui/card";
import { requirePagePermission } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { displayDate } from "@/lib/admin/query";
import { getEnquiry, listEnquiries } from "@/modules/leads/admin.service";
import { deleteEnquiryAction, setEnquiryStatusAction, addEnquiryNoteAction } from "@/modules/leads/actions";
import { EnquiryStatusForm } from "@/components/admin/forms/status-form";
import { NoteForm } from "@/components/admin/forms/note-form";

export async function EnquiriesListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePagePermission("leads:read");
  const params = await searchParams;
  const data = await listEnquiries({
    q: params.q,
    status: params.status,
    type: params.type,
    page: params.page,
  });
  const canWrite = hasPermission(user.role, "leads:write");

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ href: "/admin/dashboard", label: "Dashboard" }, { label: "Enquiries" }]} />
      <PageHeader title="Enquiries" description="Contact and quote requests." />
      <ListFilters
        action="/admin/enquiries"
        searchDefault={params.q ?? ""}
        searchPlaceholder="Search name, email, or company"
        filters={
          <>
            <FilterSelect
              name="status"
              label="Status"
              defaultValue={params.status}
              options={[
                { value: "", label: "All statuses" },
                { value: "new", label: "New" },
                { value: "contacted", label: "Contacted" },
                { value: "qualified", label: "Qualified" },
                { value: "in_progress", label: "In progress" },
                { value: "converted", label: "Converted" },
                { value: "closed", label: "Closed" },
              ]}
            />
            <FilterSelect
              name="type"
              label="Type"
              defaultValue={params.type}
              options={[
                { value: "", label: "All types" },
                { value: "contact", label: "Contact" },
                { value: "quote", label: "Quote" },
                { value: "general", label: "General" },
              ]}
            />
          </>
        }
      />
      <DataTable
        columns={["Name", "Type", "Status", "Received", "Actions"]}
        isEmpty={data.rows.length === 0}
        emptyTitle="No enquiries"
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/enquiries/${row.id}`} className="font-medium text-ink hover:underline">
                {row.name}
              </Link>
              <p className="text-xs text-ink-subtle">{row.email}</p>
            </td>
            <td className="px-4 py-3 text-ink-muted">{row.type}</td>
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
                  title="Delete this enquiry?"
                  description="The enquiry will be hidden from the admin list."
                  confirmLabel="Delete"
                  variant="danger"
                  action={deleteEnquiryAction.bind(null, row.id)}
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
          listHref("/admin/enquiries", { q: params.q, status: params.status, type: params.type }, page)
        }
      />
    </div>
  );
}

export async function EnquiryDetailPage({ id }: { id: string }) {
  const user = await requirePagePermission("leads:read");
  const record = await getEnquiry(id).catch(() => null);
  if (!record) notFound();
  const canWrite = hasPermission(user.role, "leads:write");

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/enquiries", label: "Enquiries" },
          { label: record.name },
        ]}
      />
      <PageHeader title={record.name} description={`${record.type} · ${record.email}`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-3 lg:col-span-2">
          <p className="text-sm text-ink-muted">Company: {record.company || "—"}</p>
          <p className="text-sm text-ink-muted">Phone: {record.phone || "—"}</p>
          <p className="text-sm text-ink-muted">Subject: {record.subject || "—"}</p>
          <p className="text-sm text-ink-muted">Budget: {record.budgetRange || "—"}</p>
          <p className="text-sm text-ink-muted">Timeline: {record.timeline || "—"}</p>
          <p className="whitespace-pre-wrap text-sm text-ink">{record.message}</p>
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
                <NoteForm action={addEnquiryNoteAction.bind(null, id)} />
              </div>
            ) : null}
          </div>
        </Card>
        <Card className="space-y-4">
          <StatusBadge status={record.status} />
          {canWrite ? (
            <>
              <EnquiryStatusForm
                current={record.status}
                action={setEnquiryStatusAction.bind(null, id)}
              />
              <RefreshConfirm
                label="Delete enquiry"
                title="Delete this enquiry?"
                description="The enquiry will be hidden from the admin list."
                confirmLabel="Delete"
                variant="danger"
                redirectTo="/admin/enquiries"
                action={deleteEnquiryAction.bind(null, id)}
              />
            </>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
