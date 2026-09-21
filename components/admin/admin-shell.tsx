import { Logo } from "@/components/marketing/logo";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { adminNavForRole } from "@/lib/site";
import { roleLabel } from "@/lib/rbac";
import type { AuthUser } from "@/modules/identity/session.service";
import type { PublicCompany } from "@/modules/content/public.service";

import { DirtyStateProvider } from "@/components/admin/dirty-state-provider";

export function AdminShell({
  user,
  company,
  children,
}: {
  user: AuthUser;
  company: PublicCompany;
  children: React.ReactNode;
}) {
  const items = adminNavForRole(user.role);

  return (
    <DirtyStateProvider>
      <div className="min-h-screen bg-surface">
        <aside className="fixed inset-y-0 left-0 hidden w-[var(--admin-sidebar)] bg-navy-950 lg:flex lg:flex-col">
          <div className="flex h-14 shrink-0 items-center border-b border-white/10 px-4">
            <Logo inverted className="text-sm" size="sm" company={company} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <AdminSidebar groups={items} tone="dark" />
          </div>
        </aside>
        <div className="lg:pl-[var(--admin-sidebar)]">
          <AdminHeader
            items={items}
            user={{
              name: user.name,
              email: user.email,
              roleLabel: roleLabel(user.role),
            }}
            company={company}
          />
          <main className="min-w-0 px-3 py-5 sm:px-4 lg:px-8 lg:py-7">{children}</main>
        </div>
      </div>
    </DirtyStateProvider>
  );
}
