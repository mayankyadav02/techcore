import { connectMongo } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { parseSlug } from "@/lib/api/ids";
import { publicCatalogSelect } from "@/lib/public-select";
import { Project } from "@/modules/work/project.model";

const published = { status: "published" as const, deletedAt: null };

function mapDoc<T extends { _id: unknown }>(doc: T) {
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest };
}

export async function listPublishedProjects() {
  await connectMongo();
  const rows = await Project.find(published)
    .select(publicCatalogSelect)
    .sort({ sortOrder: 1, year: -1 })
    .limit(100)
    .lean();
  return rows.map(mapDoc);
}

export async function getPublishedProject(slug: string) {
  const parsed = parseSlug(slug);
  await connectMongo();
  const row = await Project.findOne({ ...published, slug: parsed })
    .select(publicCatalogSelect)
    .lean();
  if (!row) throw new AppError("NOT_FOUND", "Project not found.");
  return mapDoc(row);
}

export async function listPublishedProjectSlugs() {
  await connectMongo();
  const rows = await Project.find(published)
    .select("slug")
    .sort({ sortOrder: 1, year: -1 })
    .lean();
  return rows.map((row) => ({ slug: row.slug }));
}
