import { Breadcrumb } from "@/components/admin/breadcrumb";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/forms/settings-form";
import { requireAnyPagePermission } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { getSettingsAdmin, getHomepageAdmin } from "@/modules/content/admin.service";
import { fallbackHomepage, mapHomepage } from "@/modules/content/public.service";

export default async function Page() {
  const user = await requireAnyPagePermission(["settings:read", "site:write"]);
  const settings = await getSettingsAdmin();
  const homepageData = await getHomepageAdmin();
  const homepageValues = homepageData ? mapHomepage(homepageData) : fallbackHomepage;

  const canWrite = hasPermission(user.role, "settings:write") || hasPermission(user.role, "site:write");
  const canWriteInternal = hasPermission(user.role, "settings:write");

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
        <SettingsForm {...settings} homepageValues={homepageValues} canWriteInternal={canWriteInternal} />
      ) : (
        <p className="text-sm text-ink-muted">You have read-only access.</p>
      )}
    </div>
  );
}
