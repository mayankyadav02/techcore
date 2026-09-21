import { requireAdminPage } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { ToastProvider } from "@/components/ui/toast";
import "@/modules/media/media.model"; // Ensure Media schema is registered before populate
import { getPublicCompany } from "@/modules/content/public.service";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminPage();
  const company = await getPublicCompany();
  return (
    <ToastProvider>
      <AdminShell user={user} company={company}>{children}</AdminShell>
    </ToastProvider>
  );
}
