import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { contentStatuses, slugPattern } from "@/modules/shared/enums";
import { metricSchema, seoSchema } from "@/modules/shared/subdocs";

const projectSchema = new Schema(
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
    clientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      default: "Confidential",
    },
    sector: { type: String, trim: true, maxlength: 80 },
    summary: { type: String, required: true, trim: true, maxlength: 400 },
    overview: { type: String, trim: true, maxlength: 8000, default: "" },
    challenge: { type: String, required: true, trim: true, maxlength: 8000 },
    solution: { type: String, required: true, trim: true, maxlength: 8000 },
    results: { type: [String], default: [] },
    features: { type: [String], default: [] },
    technology: { type: [String], default: [] },
    industryIds: [{ type: Schema.Types.ObjectId, ref: "Industry" }],
    serviceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    solutionIds: [{ type: Schema.Types.ObjectId, ref: "Solution" }],
    heroImageId: { type: Schema.Types.ObjectId },
    heroImageUrl: { type: String, trim: true, maxlength: 500 },
    galleryIds: [{ type: Schema.Types.ObjectId }],
    galleryUrls: { type: [String], default: [] },
    metrics: { type: [metricSchema], default: [] },
    year: { type: Number, min: 2000, max: 2100 },
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

projectSchema.index({ status: 1, sortOrder: 1 });
projectSchema.index({ deletedAt: 1, status: 1 });
projectSchema.index({ featured: 1, status: 1 });
projectSchema.index({ year: 1 });

export type Project = InferSchemaType<typeof projectSchema>;
export type ProjectModel = Model<Project>;

export const Project =
  (mongoose.models.Project as ProjectModel | undefined) ??
  mongoose.model<Project>("Project", projectSchema);
