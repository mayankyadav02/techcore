import { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { requireAnyPermission } from "@/lib/auth";
import { legalPageKeys } from "@/modules/content/legal-page.schema";
import { getLegalPageAdmin } from "@/modules/content/admin.service";
import { LegalPageForm } from "@/components/admin/settings/legal-page-form";
import { Tabs } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Legal Pages | Admin",
};

export default async function LegalSettingsPage() {
  await requireAnyPermission(["site:write"]);

  const records = await Promise.all(
    legalPageKeys.map((key) => getLegalPageAdmin(key))
  );

  const tabs = legalPageKeys.map((key) => {
    const record = records.find((r) => r?.key === key) || { key };
    return {
      id: key,
      label: `/${key}`,
      panel: <LegalPageForm values={record} />,
    };
  });

  return (
    <>
      <PageHeader title="Legal Pages" description="Manage content for privacy and terms pages." />
      <div className="py-8 max-w-4xl">
        <Tabs tabs={tabs} />
      </div>
    </>
  );
}
