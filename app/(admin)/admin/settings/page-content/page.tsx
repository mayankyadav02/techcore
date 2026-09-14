import { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { requireAnyPermission } from "@/lib/auth";
import { pageContentKeys } from "@/modules/content/page-content.schema";
import { getPageContentAdmin } from "@/modules/content/admin.service";
import { PageContentForm } from "@/components/admin/settings/page-content-form";
import { Tabs } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Page Content | Admin",
};

export default async function PageContentSettingsPage() {
  await requireAnyPermission(["site:write"]);

  const records = await Promise.all(
    pageContentKeys.map((key) => getPageContentAdmin(key))
  );

  const tabs = pageContentKeys.map((key) => {
    const record = records.find((r) => r?.key === key) || { key };
    return {
      id: key,
      label: `/${key}`,
      panel: <PageContentForm values={record} />,
    };
  });

  return (
    <>
      <PageHeader title="Page Content" description="Manage shared hero/content for top-level pages." />
      <div className="py-8 max-w-4xl">
        <Tabs tabs={tabs} />
      </div>
    </>
  );
}
