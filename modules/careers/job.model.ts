import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import {
  employmentTypes,
  jobStatuses,
  slugPattern,
} from "@/modules/shared/enums";
import { seoSchema } from "@/modules/shared/subdocs";

const jobSchema = new Schema(
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
    department: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    employmentType: {
      type: String,
      enum: employmentTypes,
      required: true,
      default: "Full-time",
    },
    experience: { type: String, trim: true, maxlength: 40 },
    description: { type: String, required: true, trim: true, maxlength: 8000 },
    requirements: { type: String, trim: true, maxlength: 8000, default: "" },
    benefits: { type: String, trim: true, maxlength: 4000, default: "" },
    responsibilities: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    status: {
      type: String,
      enum: jobStatuses,
      required: true,
      default: "draft",
    },
    closesAt: { type: Date },
    applicationsCount: { type: Number, default: 0, min: 0 },
    seo: { type: seoSchema, default: () => ({}) },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

jobSchema.index({ status: 1, updatedAt: -1 });
jobSchema.index({ deletedAt: 1, status: 1 });

export type Job = InferSchemaType<typeof jobSchema>;
export type JobModel = Model<Job>;

export const Job =
  (mongoose.models.Job as JobModel | undefined) ??
  mongoose.model<Job>("Job", jobSchema);
