import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { enquiryStatuses, enquiryTypes } from "@/modules/shared/enums";
import { maxNotes, noteSchema, utmSchema } from "@/modules/shared/subdocs";

const enquirySchema = new Schema(
  {
    type: {
      type: String,
      enum: enquiryTypes,
      required: true,
      default: "contact",
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    phone: { type: String, trim: true, maxlength: 40 },
    company: { type: String, trim: true, maxlength: 120 },
    subject: { type: String, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    serviceInterestIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    budgetRange: { type: String, trim: true, maxlength: 40 },
    timeline: { type: String, trim: true, maxlength: 40 },
    status: {
      type: String,
      enum: enquiryStatuses,
      required: true,
      default: "new",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    notes: {
      type: [noteSchema],
      default: [],
      validate: maxNotes(50),
    },
    sourcePage: { type: String, trim: true, maxlength: 200 },
    utm: { type: utmSchema },
    honeypotCaught: { type: Boolean, default: false, select: false },
    gdprConsent: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

enquirySchema.index({ type: 1, status: 1, createdAt: -1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ deletedAt: 1, createdAt: -1 });

export type Enquiry = InferSchemaType<typeof enquirySchema>;
export type EnquiryModel = Model<Enquiry>;

export const Enquiry =
  (mongoose.models.Enquiry as EnquiryModel | undefined) ??
  mongoose.model<Enquiry>("Enquiry", enquirySchema);
