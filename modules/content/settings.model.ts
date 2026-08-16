import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { seoSchema, socialLinksSchema } from "@/modules/shared/subdocs";

const settingsSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global",
      enum: ["global"],
    },
    companyName: { type: String, required: true, trim: true, maxlength: 80 },
    tagline: { type: String, trim: true, maxlength: 160 },
    logoId: { type: Schema.Types.ObjectId },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    contactPhone: { type: String, trim: true, maxlength: 40 },
    address: { type: String, trim: true, maxlength: 240 },
    footerText: { type: String, trim: true, maxlength: 400 },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
    defaultSeo: { type: seoSchema, default: () => ({}) },
    featureFlags: {
      careersOpen: { type: Boolean, default: true },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type Settings = InferSchemaType<typeof settingsSchema>;
export type SettingsModel = Model<Settings>;

export const Settings =
  (mongoose.models.Settings as SettingsModel | undefined) ??
  mongoose.model<Settings>("Settings", settingsSchema);
