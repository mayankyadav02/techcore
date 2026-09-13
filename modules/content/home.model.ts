import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { seoSchema } from "@/modules/shared/subdocs";

const packageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    audience: { type: String, required: true, trim: true, maxlength: 120 },
    summary: { type: String, required: true, trim: true, maxlength: 320 },
    includes: { type: [String], required: true },
    featured: { type: Boolean, default: false },
  },
  { _id: false },
);

const reasonSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 320 },
  },
  { _id: false },
);

const processStepSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 320 },
  },
  { _id: false },
);

const faqSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { _id: false },
);

const homeContentSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "home",
      enum: ["home"],
    },
    
    // Hero
    heroEyebrow: { type: String, trim: true, maxlength: 80 },
    heroTitle: { type: String, trim: true, maxlength: 160 },
    heroDescription: { type: String, trim: true, maxlength: 320 },
    heroPrimaryLabel: { type: String, trim: true, maxlength: 40 },
    heroPrimaryUrl: { type: String, trim: true, maxlength: 200 },
    heroSecondaryLabel: { type: String, trim: true, maxlength: 40 },
    heroSecondaryUrl: { type: String, trim: true, maxlength: 200 },

    // About
    aboutEyebrow: { type: String, trim: true, maxlength: 80 },
    aboutTitle: { type: String, trim: true, maxlength: 160 },
    aboutDescription: { type: String, trim: true, maxlength: 320 },
    aboutBody: { type: String, trim: true, maxlength: 1000 },
    aboutLinkLabel: { type: String, trim: true, maxlength: 40 },
    aboutLinkUrl: { type: String, trim: true, maxlength: 200 },

    // Packages
    packagesEyebrow: { type: String, trim: true, maxlength: 80 },
    packagesTitle: { type: String, trim: true, maxlength: 160 },
    packagesDescription: { type: String, trim: true, maxlength: 320 },
    packages: { type: [packageSchema], default: () => [] },

    // Why TechCore
    reasonsEyebrow: { type: String, trim: true, maxlength: 80 },
    reasonsTitle: { type: String, trim: true, maxlength: 160 },
    reasons: { type: [reasonSchema], default: () => [] },

    // Process
    processEyebrow: { type: String, trim: true, maxlength: 80 },
    processTitle: { type: String, trim: true, maxlength: 160 },
    processDescription: { type: String, trim: true, maxlength: 320 },
    processSteps: { type: [processStepSchema], default: () => [] },

    // FAQ
    faqEyebrow: { type: String, trim: true, maxlength: 80 },
    faqTitle: { type: String, trim: true, maxlength: 160 },
    faqs: { type: [faqSchema], default: () => [] },

    // Dynamic Section Intros
    servicesEyebrow: { type: String, trim: true, maxlength: 80 },
    servicesTitle: { type: String, trim: true, maxlength: 160 },
    servicesDescription: { type: String, trim: true, maxlength: 320 },

    solutionsEyebrow: { type: String, trim: true, maxlength: 80 },
    solutionsTitle: { type: String, trim: true, maxlength: 160 },
    solutionsDescription: { type: String, trim: true, maxlength: 320 },

    projectsEyebrow: { type: String, trim: true, maxlength: 80 },
    projectsTitle: { type: String, trim: true, maxlength: 160 },
    projectsDescription: { type: String, trim: true, maxlength: 320 },

    industriesEyebrow: { type: String, trim: true, maxlength: 80 },
    industriesTitle: { type: String, trim: true, maxlength: 160 },
    industriesDescription: { type: String, trim: true, maxlength: 320 },

    testimonialsEyebrow: { type: String, trim: true, maxlength: 80 },
    testimonialsTitle: { type: String, trim: true, maxlength: 160 },
    testimonialsDescription: { type: String, trim: true, maxlength: 320 },

    insightsEyebrow: { type: String, trim: true, maxlength: 80 },
    insightsTitle: { type: String, trim: true, maxlength: 160 },
    insightsDescription: { type: String, trim: true, maxlength: 320 },

    // CTA
    ctaTitle: { type: String, trim: true, maxlength: 160 },
    ctaDescription: { type: String, trim: true, maxlength: 320 },
    ctaPrimaryLabel: { type: String, trim: true, maxlength: 40 },
    ctaPrimaryUrl: { type: String, trim: true, maxlength: 200 },
    ctaSecondaryLabel: { type: String, trim: true, maxlength: 40 },
    ctaSecondaryUrl: { type: String, trim: true, maxlength: 200 },

    seo: { type: seoSchema },

    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type HomeContent = InferSchemaType<typeof homeContentSchema>;
export type HomeContentModel = Model<HomeContent>;

export const HomeContent =
  (mongoose.models.HomeContent as HomeContentModel | undefined) ??
  mongoose.model<HomeContent>("HomeContent", homeContentSchema);
