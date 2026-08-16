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
import {
  getTestimonial,
  listTestimonials,
} from "@/modules/social-proof/admin.service";
import {
  createTestimonialAction,
  deleteTestimonialAction,
  publishTestimonialAction,
  updateTestimonialAction,
} from "@/modules/social-proof/actions";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";

export async function TestimonialsListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePagePermission("testimonials:read");
  const params = await searchParams;
  const data = await listTestimonials({
    q: params.q,
    status: params.status,
    page: params.page,
  });
  const canWrite = hasPermission(user.role, "testimonials:write");

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ href: "/admin/dashboard", label: "Dashboard" }, { label: "Testimonials" }]} />
      <PageHeader
        title="Testimonials"
        description="Moderate social proof before it appears publicly."
        actions={
          canWrite ? (
            <ButtonLink href="/admin/testimonials/new" size="sm">
              New testimonial
            </ButtonLink>
          ) : null
        }
      />
      <ListFilters
        action="/admin/testimonials"
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
        columns={["Author", "Status", "Actions"]}
        isEmpty={data.rows.length === 0}
        emptyTitle="No testimonials"
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/testimonials/${row.id}`} className="font-medium text-ink hover:underline">
                {row.authorName}
              </Link>
              <p className="text-xs text-ink-subtle">{row.company}</p>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-4 py-3">
              {canWrite ? (
                <div className="flex flex-wrap gap-2">
                  <RefreshConfirm
                    label={row.status === "published" ? "Unpublish" : "Publish"}
                    title="Change publish status?"
                    description="Published quotes can appear on the public site."
                    action={publishTestimonialAction.bind(
                      null,
                      row.id,
                      row.status !== "published",
                    )}
                  />
                  <RefreshConfirm
                    label="Delete"
                    title="Delete this testimonial?"
                    description="It will be removed from the CMS list."
                    confirmLabel="Delete"
                    variant="danger"
                    action={deleteTestimonialAction.bind(null, row.id)}
                  />
                </div>
              ) : null}
            </td>
          </tr>
        ))}
      </DataTable>
      <AdminPagination
        page={data.page}
        pageCount={data.pageCount}
        hrefForPage={(page) => listHref("/admin/testimonials", { q: params.q, status: params.status }, page)}
      />
    </div>
  );
}

export async function TestimonialCreatePage() {
  await requirePagePermission("testimonials:write");
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/testimonials", label: "Testimonials" },
          { label: "New" },
        ]}
      />
      <PageHeader title="New testimonial" />
      <TestimonialForm action={createTestimonialAction} submitLabel="Create testimonial" />
    </div>
  );
}

export async function TestimonialEditPage({ id }: { id: string }) {
  const user = await requirePagePermission("testimonials:read");
  const record = await getTestimonial(id).catch(() => null);
  if (!record) notFound();
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/testimonials", label: "Testimonials" },
          { label: record.authorName },
        ]}
      />
      <PageHeader title={record.authorName} />
      {hasPermission(user.role, "testimonials:write") ? (
        <TestimonialForm
          action={updateTestimonialAction.bind(null, id)}
          values={record as never}
          submitLabel="Save changes"
        />
      ) : (
        <p className="text-sm text-ink-muted">You have read-only access.</p>
      )}
    </div>
  );
}
