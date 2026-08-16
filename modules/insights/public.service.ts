import { connectMongo } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { parseSlug } from "@/lib/api/ids";
import { publicCatalogSelect } from "@/lib/public-select";
import { BlogPost } from "@/modules/insights/blog-post.model";

const published = { status: "published" as const, deletedAt: null };

function mapDoc<T extends { _id: unknown }>(doc: T) {
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest };
}

export async function listPublishedPosts(category?: string) {
  if (category && !/^[\w\s-]{1,40}$/.test(category)) {
    throw new AppError("VALIDATION_ERROR", "Invalid category.");
  }
  await connectMongo();
  const rows = await BlogPost.find(
    category ? { ...published, category } : published,
  )
    .select(publicCatalogSelect)
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(100)
    .lean();
  return rows.map(mapDoc);
}

export async function getPublishedPost(slug: string) {
  const parsed = parseSlug(slug);
  await connectMongo();
  const row = await BlogPost.findOne({ ...published, slug: parsed })
    .select(publicCatalogSelect)
    .lean();
  if (!row) throw new AppError("NOT_FOUND", "Article not found.");
  return mapDoc(row);
}

export async function listPublishedPostSlugs() {
  await connectMongo();
  const rows = await BlogPost.find(published)
    .select("slug")
    .sort({ publishedAt: -1 })
    .lean();
  return rows.map((row) => ({ slug: row.slug }));
}
