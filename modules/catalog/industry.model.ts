import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { contentStatuses, slugPattern } from "@/modules/shared/enums";
import { seoSchema } from "@/modules/shared/subdocs";

const industrySchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: slugPattern,
    },
    summary: { type: String, required: true, trim: true, maxlength: 400 },
    body: { type: String, trim: true, maxlength: 20000, default: "" },
    focus: { type: [String], default: [] },
    heroImageId: { type: Schema.Types.ObjectId },
    relatedServiceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    relatedProjectIds: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    seo: { type: seoSchema, default: () => ({}) },
    status: {
      type: String,
      enum: contentStatuses,
      required: true,
      default: "draft",
    },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },
    sortOrder: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

industrySchema.index({ status: 1, sortOrder: 1 });
industrySchema.index({ deletedAt: 1, status: 1 });

export type Industry = InferSchemaType<typeof industrySchema>;
export type IndustryModel = Model<Industry>;

export const Industry =
  (mongoose.models.Industry as IndustryModel | undefined) ??
  mongoose.model<Industry>("Industry", industrySchema);
