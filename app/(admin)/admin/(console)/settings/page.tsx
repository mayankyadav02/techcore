import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/forms/settings-form";
import { requirePagePermission } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { getSettingsAdmin } from "@/modules/content/admin.service";

export default async function Page() {
  const user = await requirePagePermission("settings:read");
  const settings = await getSettingsAdmin();
  const canWrite = hasPermission(user.role, "settings:write");

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { label: "Settings" },
        ]}
      />
      <PageHeader
        title="Settings"
        description="Company profile used across the public site."
      />
      {canWrite ? (
        <SettingsForm {...settings} />
      ) : (
        <p className="text-sm text-ink-muted">You have read-only access.</p>
      )}
    </div>
  );
}
