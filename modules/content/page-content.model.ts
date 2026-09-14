import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { pageContentSchema } from "@/modules/content/page-content.schema";

// Mongoose schema mirrors the Zod schema
const pageContentMongooseSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, enum: pageContentSchema.shape.key.options },
    heroEyebrow: { type: String, trim: true, maxlength: 80 },
    heroTitle: { type: String, trim: true, maxlength: 160 },
    heroDescription: { type: String, trim: true, maxlength: 320 },
    heroPrimaryLabel: { type: String, trim: true, maxlength: 40 },
    heroPrimaryUrl: { type: String, trim: true, maxlength: 200 },
    heroSecondaryLabel: { type: String, trim: true, maxlength: 40 },
    heroSecondaryUrl: { type: String, trim: true, maxlength: 200 },
    primaryCta: {
      label: { type: String, trim: true, maxlength: 40 },
      href: { type: String, trim: true, maxlength: 200 },
    },
    secondaryCta: {
      label: { type: String, trim: true, maxlength: 40 },
      href: { type: String, trim: true, maxlength: 200 },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type PageContentDocument = InferSchemaType<typeof pageContentMongooseSchema>;

export const PageContent: Model<PageContentDocument> =
  (mongoose.models.PageContent as Model<PageContentDocument> | undefined) ??
  mongoose.model<PageContentDocument>("PageContent", pageContentMongooseSchema);
