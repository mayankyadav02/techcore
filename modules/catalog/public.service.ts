import { connectMongo } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { parseSlug } from "@/lib/api/ids";
import { publicCatalogSelect } from "@/lib/public-select";
import { Service } from "@/modules/catalog/service.model";
import { Solution } from "@/modules/catalog/solution.model";
import { Industry } from "@/modules/catalog/industry.model";

const published = { status: "published" as const, deletedAt: null };

function mapDoc<T extends { _id: unknown }>(doc: T) {
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest };
}

export async function listPublishedServices() {
  await connectMongo();
  const rows = await Service.find(published)
    .select(publicCatalogSelect)
    .sort({ sortOrder: 1, title: 1 })
    .limit(100)
    .lean();
  return rows.map(mapDoc);
}

export async function getPublishedService(slug: string) {
  const parsed = parseSlug(slug);
  await connectMongo();
  const row = await Service.findOne({ ...published, slug: parsed })
    .select(publicCatalogSelect)
    .lean();
  if (!row) throw new AppError("NOT_FOUND", "Service not found.");
  return mapDoc(row);
}

export async function listPublishedServiceSlugs() {
  await connectMongo();
  const rows = await Service.find(published).select("slug").sort({ sortOrder: 1 }).lean();
  return rows.map((row) => ({ slug: row.slug }));
}

export async function listPublishedSolutions() {
  await connectMongo();
  const rows = await Solution.find(published)
    .select(publicCatalogSelect)
    .sort({ sortOrder: 1, title: 1 })
    .limit(100)
    .lean();
  return rows.map(mapDoc);
}

export async function getPublishedSolution(slug: string) {
  const parsed = parseSlug(slug);
  await connectMongo();
  const row = await Solution.findOne({ ...published, slug: parsed })
    .select(publicCatalogSelect)
    .lean();
  if (!row) throw new AppError("NOT_FOUND", "Solution not found.");
  return mapDoc(row);
}

export async function listPublishedSolutionSlugs() {
  await connectMongo();
  const rows = await Solution.find(published).select("slug").sort({ sortOrder: 1 }).lean();
  return rows.map((row) => ({ slug: row.slug }));
}

export async function listPublishedIndustries() {
  await connectMongo();
  const rows = await Industry.find(published)
    .select(publicCatalogSelect)
    .sort({ sortOrder: 1, title: 1 })
    .limit(100)
    .lean();
  return rows.map(mapDoc);
}

export async function getPublishedIndustry(slug: string) {
  const parsed = parseSlug(slug);
  await connectMongo();
  const row = await Industry.findOne({ ...published, slug: parsed })
    .select(publicCatalogSelect)
    .lean();
  if (!row) throw new AppError("NOT_FOUND", "Industry not found.");
  return mapDoc(row);
}

export async function listPublishedIndustrySlugs() {
  await connectMongo();
  const rows = await Industry.find(published).select("slug").sort({ sortOrder: 1 }).lean();
  return rows.map((row) => ({ slug: row.slug }));
}

export async function findPublishedServiceBySlug(slug: string) {
  const parsed = parseSlug(slug);
  await connectMongo();
  return Service.findOne({ ...published, slug: parsed })
    .select("_id title slug")
    .lean();
}
