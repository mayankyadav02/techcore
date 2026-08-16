import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { applicationStatuses } from "@/modules/shared/enums";
import { maxNotes, noteSchema } from "@/modules/shared/subdocs";

const applicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    jobTitleSnapshot: { type: String, required: true, trim: true, maxlength: 120 },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    phone: { type: String, trim: true, maxlength: 40 },
    coverLetter: { type: String, trim: true, maxlength: 8000 },
    resumeAssetId: { type: Schema.Types.ObjectId },
    status: {
      type: String,
      enum: applicationStatuses,
      required: true,
      default: "new",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    notes: {
      type: [noteSchema],
      default: [],
      validate: maxNotes(50),
    },
    source: {
      type: String,
      enum: ["careers_page"],
      default: "careers_page",
    },
    gdprConsent: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value: boolean) => value === true,
        message: "Consent is required.",
      },
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ jobId: 1, createdAt: -1 });
applicationSchema.index({ email: 1 });

export type Application = InferSchemaType<typeof applicationSchema>;
export type ApplicationModel = Model<Application>;

export const Application =
  (mongoose.models.Application as ApplicationModel | undefined) ??
  mongoose.model<Application>("Application", applicationSchema);
