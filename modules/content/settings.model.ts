import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { seoSchema, socialLinksSchema, navItemSchema, footerGroupSchema, themeSchema } from "@/modules/shared/subdocs";

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
    logoId: { type: Schema.Types.ObjectId, ref: "Media" },
    logoType: { type: String, enum: ["image", "text"], default: "image" },
    logoText: { type: String, trim: true, maxlength: 40 },
    navigation: { type: [navItemSchema] },
    ctaLabel: { type: String, trim: true, maxlength: 40 },
    ctaUrl: { type: String, trim: true, maxlength: 200 },
    footerGroups: { type: [footerGroupSchema] },
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
    theme: { type: themeSchema, default: () => ({}) },
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
