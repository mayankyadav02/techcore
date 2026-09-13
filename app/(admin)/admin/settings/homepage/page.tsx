import { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { getHomepageAdmin } from "@/modules/content/admin.service";
import { fallbackHomepage, mapHomepage } from "@/modules/content/public.service";
import { HomeForm } from "@/components/admin/settings/home-form";
import { requireAnyPermission } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Homepage Content | Admin",
};

export default async function HomepageSettingsPage() {
  await requireAnyPermission(["site:write"]);
  
  const data = await getHomepageAdmin();
  const values = data 
    ? mapHomepage(data) 
    : fallbackHomepage;

  return (
    <>
      <PageHeader title="Homepage Content" />
      <div className="py-8 max-w-4xl">
        <HomeForm values={values} />
      </div>
    </>
  );
}
