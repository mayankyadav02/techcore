import { PageHeader } from "@/components/admin/page-header";
import { MediaLibrary } from "@/components/admin/media/media-library";
import { listMediaAdmin } from "@/modules/media/admin.service";
import { requireAnyPagePermission } from "@/lib/auth";

export const metadata = {
  title: "Media Library",
};

export default async function AdminMediaPage() {
  await requireAnyPagePermission(["site:write"]);
  
  // Phase 5A: We load all media. There aren't many assets yet.
  const items = await listMediaAdmin();
  
  // Convert strictly to plain strings for Client Component
  const safeItems = items.map((item) => ({
    _id: item._id,
    url: item.url,
    filename: item.filename,
    altText: item.altText || "",
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes ?? undefined,
    width: item.width ?? undefined,
    height: item.height ?? undefined,
  }));

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader 
        title="Media Library" 
        description="Manage existing local image assets across the site."
      />
      <MediaLibrary initialItems={safeItems} />
    </div>
  );
}
