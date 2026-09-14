import { connectMongo } from "@/lib/db";
import { Media } from "@/modules/media/media.model";
import { requireAnyPermission } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import type { MediaUpdateInput } from "@/modules/media/media.schema";

export async function listMediaAdmin(query?: string) {
  await requireAnyPermission(["site:write"]);
  await connectMongo();

  const filter = query
    ? { filename: { $regex: query, $options: "i" } }
    : {};

  const docs = await Media.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return docs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    uploadedBy: doc.uploadedBy?.toString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  }));
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
