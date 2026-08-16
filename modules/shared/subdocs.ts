import { Schema, type Types } from "mongoose";

export const seoSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 320 },
    ogImageId: { type: Schema.Types.ObjectId },
  },
  { _id: false },
);

export const noteSchema = new Schema(
  {
    body: { type: String, required: true, trim: true, maxlength: 4000 },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

export const utmSchema = new Schema(
  {
    source: { type: String, trim: true, maxlength: 80 },
    medium: { type: String, trim: true, maxlength: 80 },
    campaign: { type: String, trim: true, maxlength: 80 },
  },
  { _id: false },
);

export const metricSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 80 },
    value: { type: String, required: true, trim: true, maxlength: 80 },
  },
  { _id: false },
);

export const faqSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { _id: false },
);

export const socialLinksSchema = new Schema(
  {
    linkedin: { type: String, trim: true, maxlength: 200 },
    x: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false },
);

export function maxNotes(limit = 50) {
  return {
    validator: (value: unknown[]) => value.length <= limit,
    message: `Notes cannot exceed ${limit} entries.`,
  };
}

export type SeoFields = {
  title?: string;
  description?: string;
  ogImageId?: Types.ObjectId;
};
