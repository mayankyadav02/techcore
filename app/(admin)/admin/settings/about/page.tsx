import { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { getAboutAdmin } from "@/modules/content/admin.service";
import { fallbackAbout, mapAbout } from "@/modules/content/public.service";
import { AboutForm } from "@/components/admin/settings/about-form";
import { requireAnyPermission } from "@/lib/auth";

export const metadata: Metadata = {
  title: "About Content | Admin",
};

export default async function AboutSettingsPage() {
  await requireAnyPermission(["site:write"]);
  
  const data = await getAboutAdmin();
  const values = data 
    ? mapAbout(data) 
    : fallbackAbout;

  return (
    <>
      <PageHeader title="About Content" />
      <div className="py-8 max-w-4xl">
        <AboutForm values={values} />
      </div>
    </>
  );
}
