import { PageHeader } from "@/components/admin/page-header";
import { MediaLibrary } from "@/components/admin/media/media-library";
import { listMediaAdmin } from "@/modules/media/admin.service";
import { requireAnyPagePermission } from "@/lib/auth";

export const metadata = {
  title: "Media Library",
};

export default async function AdminMediaPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAnyPagePermission(["site:write"]);

  const searchParams = await props.searchParams;
  const q = typeof searchParams?.q === "string" ? searchParams.q : undefined;
  const page = typeof searchParams?.page === "string" ? parseInt(searchParams.page, 10) : 1;

  const result = await listMediaAdmin(q, page, 24);

  // Convert strictly to plain strings for Client Component
  const safeItems = result.items.map((item) => ({
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
      <MediaLibrary
        initialItems={safeItems}
        initialSearch={q || ""}
        page={result.page}
        pageCount={result.pageCount}
      />
    </div>
  );
}
