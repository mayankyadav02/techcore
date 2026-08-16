import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { contentStatuses, slugPattern } from "@/modules/shared/enums";
import { faqSchema, seoSchema } from "@/modules/shared/subdocs";

const serviceSchema = new Schema(
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
    body: { type: String, required: true, trim: true, maxlength: 20000 },
    icon: { type: String, trim: true, maxlength: 40 },
    heroImageId: { type: Schema.Types.ObjectId },
    highlights: { type: [String], default: [] },
    features: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    process: { type: [String], default: [] },
    faqs: { type: [faqSchema], default: [] },
    relatedSolutionIds: [{ type: Schema.Types.ObjectId, ref: "Solution" }],
    relatedIndustryIds: [{ type: Schema.Types.ObjectId, ref: "Industry" }],
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

serviceSchema.index({ status: 1, sortOrder: 1 });
serviceSchema.index({ deletedAt: 1, status: 1 });
serviceSchema.index({ featured: 1, status: 1 });

export type Service = InferSchemaType<typeof serviceSchema>;
export type ServiceModel = Model<Service>;

export const Service =
  (mongoose.models.Service as ServiceModel | undefined) ??
  mongoose.model<Service>("Service", serviceSchema);
