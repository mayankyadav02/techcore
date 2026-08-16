import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { contentStatuses } from "@/modules/shared/enums";

const testimonialSchema = new Schema(
  {
    quote: { type: String, required: true, trim: true, maxlength: 800 },
    authorName: { type: String, required: true, trim: true, maxlength: 80 },
    authorRole: { type: String, trim: true, maxlength: 160 },
    company: { type: String, trim: true, maxlength: 120 },
    avatarId: { type: Schema.Types.ObjectId },
    relatedProjectId: { type: Schema.Types.ObjectId, ref: "Project" },
    rating: { type: Number, min: 1, max: 5 },
    status: {
      type: String,
      enum: contentStatuses,
      required: true,
      default: "draft",
    },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

testimonialSchema.index({ status: 1, sortOrder: 1 });
testimonialSchema.index({ featured: 1, status: 1 });

export type Testimonial = InferSchemaType<typeof testimonialSchema>;
export type TestimonialModel = Model<Testimonial>;

export const Testimonial =
  (mongoose.models.Testimonial as TestimonialModel | undefined) ??
  mongoose.model<Testimonial>("Testimonial", testimonialSchema);
