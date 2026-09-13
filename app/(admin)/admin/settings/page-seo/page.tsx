import { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { listPageSeoAdmin } from "@/modules/content/admin.service";
import { PageSeoForm } from "@/components/admin/settings/page-seo-form";
import { requireAnyPermission } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Page SEO | Admin",
};

export default async function PageSeoSettingsPage() {
  await requireAnyPermission(["site:write"]);
  
  const data = await listPageSeoAdmin();

  return (
    <>
      <PageHeader title="Static Page SEO" description="Manage SEO metadata for top-level public pages." />
      <div className="py-8 max-w-4xl">
        <PageSeoForm records={data} />
      </div>
    </>
  );
}
