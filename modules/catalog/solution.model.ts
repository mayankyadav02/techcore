import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { contentStatuses, slugPattern } from "@/modules/shared/enums";
import { seoSchema } from "@/modules/shared/subdocs";

const solutionSchema = new Schema(
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
    problem: { type: String, required: true, trim: true, maxlength: 4000 },
    approach: { type: String, required: true, trim: true, maxlength: 4000 },
    outcomes: { type: [String], default: [] },
    features: { type: [String], default: [] },
    technology: { type: [String], default: [] },
    heroImageId: { type: Schema.Types.ObjectId },
    relatedServiceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
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

solutionSchema.index({ status: 1, sortOrder: 1 });
solutionSchema.index({ deletedAt: 1, status: 1 });

export type Solution = InferSchemaType<typeof solutionSchema>;
export type SolutionModel = Model<Solution>;

export const Solution =
  (mongoose.models.Solution as SolutionModel | undefined) ??
  mongoose.model<Solution>("Solution", solutionSchema);
