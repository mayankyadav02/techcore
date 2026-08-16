import { connectMongo } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { isObjectId, parseObjectId, parseSlug } from "@/lib/api/ids";
import { publicJobSelect } from "@/lib/public-select";
import { Job } from "@/modules/careers/job.model";

function stillOpen() {
  return {
    $or: [
      { closesAt: null },
      { closesAt: { $exists: false } },
      { closesAt: { $gt: new Date() } },
    ],
  };
}

export function openJobFilter() {
  return { status: "open" as const, deletedAt: null, ...stillOpen() };
}

function mapDoc<T extends { _id: unknown }>(doc: T) {
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest };
}

function jobQuery(idOrSlug: string) {
  if (isObjectId(idOrSlug)) {
    return { _id: parseObjectId(idOrSlug), ...openJobFilter() };
  }
  return { slug: parseSlug(idOrSlug), ...openJobFilter() };
}

export async function listOpenJobs() {
  await connectMongo();
  const rows = await Job.find(openJobFilter())
    .select(publicJobSelect)
    .sort({ updatedAt: -1 })
    .limit(100)
    .lean();
  return rows.map(mapDoc);
}

export async function getOpenJob(idOrSlug: string) {
  const query = jobQuery(idOrSlug);
  await connectMongo();
  const row = await Job.findOne(query)
    .select(publicJobSelect)
    .lean();
  if (!row) throw new AppError("NOT_FOUND", "Role not found.");
  return mapDoc(row);
}

export async function listOpenJobSlugs() {
  await connectMongo();
  const rows = await Job.find(openJobFilter()).select("slug").sort({ updatedAt: -1 }).lean();
  return rows.map((row) => ({ slug: row.slug }));
}
