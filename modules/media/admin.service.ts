import { connectMongo } from "@/lib/db";
import { Media } from "@/modules/media/media.model";
import { requireAnyPermission } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import type { MediaUpdateInput } from "@/modules/media/media.schema";

export async function listMediaAdmin(
  query?: string,
  page: number = 1,
  limit: number = 24
) {
  await requireAnyPermission(["site:write"]);
  await connectMongo();

  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));

  const filter = query
    ? { filename: { $regex: query, $options: "i" } }
    : {};

  const totalCount = await Media.countDocuments(filter);
  const pageCount = Math.ceil(totalCount / safeLimit);

  const docs = await Media.find(filter)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * safeLimit)
    .limit(safeLimit)
    .lean();

  const items = docs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    uploadedBy: doc.uploadedBy?.toString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  }));

  return {
    items,
    page: safePage,
    limit: safeLimit,
    totalCount,
    pageCount,
  };
}

export async function getMediaAdmin(id: string) {
  await requireAnyPermission(["site:write"]);
  await connectMongo();
  const doc = await Media.findById(id).lean();
  if (!doc) return null;

  return {
    ...doc,
    _id: doc._id.toString(),
    uploadedBy: doc.uploadedBy?.toString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

export async function updateMediaAdmin(input: MediaUpdateInput, userId: string) {
  await requireAnyPermission(["site:write"]);
  await connectMongo();

  const doc = await Media.findById(input.id);
  if (!doc) {
    throw new Error("Media not found");
  }

  const updates: Record<string, unknown> = {};

  if (input.altText !== undefined) {
    doc.altText = input.altText;
    updates.altText = input.altText;
  }

  await doc.save();

  await writeAuditLog({
    action: "media.update",
    actorId: userId,
    resourceType: "Media",
    resourceId: doc._id.toString(),
    metadata: { altText: input.altText || "" },
  });

  return { success: true };
}

export async function uploadMediaAdmin(data: {
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  userId: string;
}) {
  await requireAnyPermission(["site:write"]);
  await connectMongo();

  const doc = new Media({
    filename: data.filename,
    url: data.url,
    altText: data.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    mimeType: data.mimeType,
    sizeBytes: data.sizeBytes,
    uploadedBy: data.userId,
    // width and height are omitted because we don't have a reliable dependency
    // to calculate dimensions safely without inventing values.
  });

  await doc.save();

  await writeAuditLog({
    action: "media.create",
    actorId: data.userId,
    resourceType: "Media",
    resourceId: doc._id.toString(),
    metadata: {
      filename: data.filename,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
    },
  });

  return {
    _id: doc._id.toString(),
    url: doc.url,
  };
}

export async function deleteMediaAdmin(id: string, userId: string) {
  await requireAnyPermission(["site:write"]);
  await connectMongo();

  const doc = await Media.findById(id);
  if (!doc) {
    throw new Error("Media not found");
  }

  const { Settings } = await import("@/modules/content/settings.model");
  const { HomeContent } = await import("@/modules/content/home.model");
  const { Service } = await import("@/modules/catalog/service.model");
  const { Solution } = await import("@/modules/catalog/solution.model");
  const { Industry } = await import("@/modules/catalog/industry.model");
  const { Project } = await import("@/modules/work/project.model");
  const { BlogPost } = await import("@/modules/insights/blog-post.model");

  const [settings, home, services, solutions, industries, projects, posts] = await Promise.all([
    Settings.countDocuments({ logoId: id }),
    HomeContent.countDocuments({ $or: [{ heroImageIds: id }, { aboutImageId: id }] }),
    Service.countDocuments({ heroImageId: id }),
    Solution.countDocuments({ heroImageId: id }),
    Industry.countDocuments({ heroImageId: id }),
    Project.countDocuments({ heroImageId: id }),
    BlogPost.countDocuments({ heroImageId: id }),
  ]);

  if (settings + home + services + solutions + industries + projects + posts > 0) {
    throw new Error("This media is currently in use and cannot be deleted.");
  }

  const { del } = await import("@vercel/blob");

  if (process.env.NODE_ENV !== "test" && process.env.BLOB_READ_WRITE_TOKEN !== "test-token") {
    await del(doc.url);
  }

  await Media.findByIdAndDelete(id);

  await writeAuditLog({
    action: "media.delete",
    actorId: userId,
    resourceType: "Media",
    resourceId: id,
    metadata: {
      filename: doc.filename,
      mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes || 0,
    },
  });

  return { success: true };
}
export async function uploadPublicResumeMedia(data: {
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}) {
  await connectMongo();
  const doc = new Media({
    filename: data.filename,
    url: data.url,
    mimeType: data.mimeType,
    sizeBytes: data.sizeBytes,
    altText: "Applicant Resume",
  });
  await doc.save();
  return { id: doc._id.toString(), url: doc.url };
}
