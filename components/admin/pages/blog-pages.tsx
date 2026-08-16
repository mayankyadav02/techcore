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
import { getPost, listPosts } from "@/modules/insights/admin.service";
import {
  createPostAction,
  deletePostAction,
  setPostStatusAction,
  updatePostAction,
} from "@/modules/insights/actions";
import { PostForm } from "@/components/admin/forms/post-form";

export async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePagePermission("content:read");
  const params = await searchParams;
  const data = await listPosts({
    q: params.q,
    status: params.status,
    category: params.category,
    page: params.page,
  });
  const canWrite = hasPermission(user.role, "content:write");
  const canPublish = hasPermission(user.role, "content:publish");

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ href: "/admin/dashboard", label: "Dashboard" }, { label: "Blog" }]} />
      <PageHeader
        title="Blog"
        description="Draft, publish, and organise articles."
        actions={
          canWrite ? (
            <ButtonLink href="/admin/blog/new" size="sm">
              New post
            </ButtonLink>
          ) : null
        }
      />
      <ListFilters
        action="/admin/blog"
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
              ]}
            />
            <FilterSelect
              name="category"
              label="Category"
              defaultValue={params.category}
              options={[
                { value: "", label: "All categories" },
                ...data.categories.map((category) => ({
                  value: category,
                  label: category,
                })),
              ]}
            />
          </>
        }
      />
      <DataTable
        columns={["Title", "Category", "Status", "Published", "Actions"]}
        isEmpty={data.rows.length === 0}
        emptyTitle="No posts"
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/blog/${row.id}`} className="font-medium text-ink hover:underline">
                {row.title}
              </Link>
            </td>
            <td className="px-4 py-3 text-ink-muted">{row.category}</td>
            <td className="px-4 py-3">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-4 py-3 text-ink-muted">
              {displayDate((row as { publishedAt?: Date }).publishedAt)}
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {canPublish ? (
                  <RefreshConfirm
                    label={row.status === "published" ? "Unpublish" : "Publish"}
                    title="Change post status?"
                    description="Published posts appear on the public blog."
                    action={setPostStatusAction.bind(
                      null,
                      row.id,
                      row.status !== "published",
                    )}
                  />
                ) : null}
                {canWrite ? (
                  <RefreshConfirm
                    label="Delete"
                    title="Delete this post?"
                    description="It will be removed from the CMS list."
                    confirmLabel="Delete"
                    variant="danger"
                    action={deletePostAction.bind(null, row.id)}
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
        hrefForPage={(page) =>
          listHref("/admin/blog", { q: params.q, status: params.status, category: params.category }, page)
        }
      />
    </div>
  );
}

export async function BlogCreatePage() {
  await requirePagePermission("content:write");
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/blog", label: "Blog" },
          { label: "New" },
        ]}
      />
      <PageHeader title="New post" />
      <PostForm action={createPostAction} submitLabel="Create post" />
    </div>
  );
}

export async function BlogEditPage({ id }: { id: string }) {
  const user = await requirePagePermission("content:read");
  const record = await getPost(id).catch(() => null);
  if (!record) notFound();
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/blog", label: "Blog" },
          { label: record.title },
        ]}
      />
      <PageHeader title={record.title} />
      {hasPermission(user.role, "content:write") ? (
        <PostForm
          action={updatePostAction.bind(null, id)}
          values={record as never}
          submitLabel="Save changes"
        />
      ) : (
        <p className="text-sm text-ink-muted">You have read-only access.</p>
      )}
    </div>
  );
}
