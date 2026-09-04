import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { ListFilters } from "@/components/admin/list-filters";
import { AdminPagination, listHref } from "@/components/admin/admin-pagination";
import { RefreshConfirm } from "@/components/admin/refresh-confirm";
import { ButtonLink } from "@/components/ui/button-link";
import { requirePagePermission } from "@/lib/auth";
import { displayDate } from "@/lib/admin/query";
import { listUsers, getUser } from "@/modules/identity/admin.service";
import {
  createUserAction,
  updateUserAction,
  disableUserAction,
  deleteUserAction,
  resetUserPasswordAction,
} from "@/modules/identity/actions";
import { UserForm } from "@/components/admin/forms/user-form";
import { PasswordResetForm } from "@/components/admin/forms/password-reset-form";

export async function UsersListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requirePagePermission("users:read");
  if (user.role !== "super_admin") {
    notFound();
  }

  const params = await searchParams;
  const data = await listUsers({
    q: params.q,
    page: params.page,
  });

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { label: "Users" },
        ]}
      />
      <PageHeader
        title="Users"
        description="Manage team members and admin access."
        actions={<ButtonLink href="/admin/users/new">New user</ButtonLink>}
      />
      <ListFilters
        action="/admin/users"
        searchDefault={params.q ?? ""}
        filters={null}
      />
      <DataTable
        columns={["Name", "Email", "Role", "Status", "Last Login", "Actions"]}
        isEmpty={data.rows.length === 0}
        emptyTitle="No users"
      >
        {data.rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Link
                href={`/admin/users/${row.id}`}
                className="font-medium text-ink hover:underline"
              >
                {row.name}
              </Link>
            </td>
            <td className="px-4 py-3 text-ink-muted text-sm">{row.email}</td>
            <td className="px-4 py-3 text-sm capitalize">{row.role}</td>
            <td className="px-4 py-3">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-4 py-3 text-ink-muted text-sm">
              {displayDate(row.lastLoginAt)}
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/users/${row.id}`}
                  className="inline-flex items-center justify-center rounded border border-ink-muted px-3 h-8 text-xs hover:bg-ink-subtle"
                >
                  Edit
                </Link>
                {row.status === "active" ? (
                  <RefreshConfirm
                    label="Disable"
                    title="Disable user?"
                    description="They will not be able to sign in."
                    confirmLabel="Disable"
                    action={disableUserAction.bind(null, row.id)}
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
        hrefForPage={(page) => listHref("/admin/users", { q: params.q }, page)}
      />
    </div>
  );
}

export async function UsersCreatePage() {
  const user = await requirePagePermission("users:write");
  if (user.role !== "super_admin") {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/users", label: "Users" },
          { label: "New" },
        ]}
      />
      <PageHeader
        title="New User"
        description="Add a team member to the admin panel."
      />
      <div className="max-w-2xl">
        <UserForm action={createUserAction} submitLabel="Create user" />
      </div>
    </div>
  );
}

export async function UsersDetailPage({ id }: { id: string }) {
  const user = await requirePagePermission("users:read");
  if (user.role !== "super_admin") {
    notFound();
  }

  const detail = await getUser(id);

  const isOwnAccount = user._id?.toString() === id;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/users", label: "Users" },
          { label: detail.name },
        ]}
      />
      <PageHeader title={detail.name} description={detail.email} />

      <div className="max-w-2xl">
        <UserForm
          action={updateUserAction.bind(null, id)}
          values={{
            email: detail.email,
            name: detail.name,
            role: detail.role,
            status: detail.status,
          }}
          submitLabel="Save changes"
          showPassword={false}
        />
      </div>

      {!isOwnAccount && (
        <div className="max-w-2xl border-t border-line pt-6">
          <PasswordResetForm action={resetUserPasswordAction.bind(null, id)} />
        </div>
      )}

      {!isOwnAccount && detail.status !== "disabled" && (
        <div className="max-w-2xl border-t border-line pt-6">
          <h2 className="text-sm font-semibold text-ink mb-4">Danger zone</h2>
          <div className="space-y-3">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="text-sm font-medium text-red-900 mb-2">
                Delete user
              </h3>
              <p className="text-sm text-red-800 mb-4">
                This action cannot be undone. All audit logs will remain.
              </p>
              <RefreshConfirm
                label="Delete user"
                title="Delete this user?"
                description="This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                action={deleteUserAction.bind(null, id)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
