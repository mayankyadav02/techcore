import { Logo } from "@/components/marketing/logo";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-[var(--admin-sidebar)] bg-navy-900 lg:flex lg:flex-col">
        <div className="flex h-14 items-center border-b border-white/10 px-4">
          <Logo inverted className="text-sm" />
        </div>
        <AdminSidebar />
      </aside>
      <div className="lg:pl-[var(--admin-sidebar)]">
        <AdminHeader />
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
