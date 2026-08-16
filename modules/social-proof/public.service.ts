import { connectMongo } from "@/lib/db";
import { publicCatalogSelect } from "@/lib/public-select";
import { Testimonial } from "@/modules/social-proof/testimonial.model";

const published = { status: "published" as const, deletedAt: null };

function mapDoc<T extends { _id: unknown }>(doc: T) {
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest };
}

export async function listPublishedTestimonials() {
  await connectMongo();
  const featured = await Testimonial.find({ ...published, featured: true })
    .select(publicCatalogSelect)
    .sort({ sortOrder: 1 })
    .limit(6)
    .lean();
  if (featured.length > 0) {
    return featured.map(mapDoc);
  }
  const rows = await Testimonial.find(published)
    .select(publicCatalogSelect)
    .sort({ sortOrder: 1 })
    .limit(6)
    .lean();
  return rows.map(mapDoc);
}
