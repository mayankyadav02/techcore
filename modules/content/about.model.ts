import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const valueSchema = new Schema(
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

const aboutContentSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "about",
      enum: ["about"],
    },
    
    // Hero
    heroEyebrow: { type: String, trim: true, maxlength: 80 },
    heroTitle: { type: String, trim: true, maxlength: 160 },
    heroDescription: { type: String, trim: true, maxlength: 320 },
    heroPrimaryLabel: { type: String, trim: true, maxlength: 40 },
    heroPrimaryUrl: { type: String, trim: true, maxlength: 200 },
    heroSecondaryLabel: { type: String, trim: true, maxlength: 40 },
    heroSecondaryUrl: { type: String, trim: true, maxlength: 200 },

    // Story
    storyEyebrow: { type: String, trim: true, maxlength: 80 },
    storyTitle: { type: String, trim: true, maxlength: 160 },
    storyDescription: { type: String, trim: true, maxlength: 320 },
    storyBody: { type: String, trim: true, maxlength: 1000 },

    // Mission & Vision
    missionTitle: { type: String, trim: true, maxlength: 160 },
    missionBody: { type: String, trim: true, maxlength: 1000 },
    visionTitle: { type: String, trim: true, maxlength: 160 },
    visionBody: { type: String, trim: true, maxlength: 1000 },

    // Values
    valuesEyebrow: { type: String, trim: true, maxlength: 80 },
    valuesTitle: { type: String, trim: true, maxlength: 160 },
    values: { type: [valueSchema], default: () => [] },

    // Expertise (Services Intro)
    expertiseEyebrow: { type: String, trim: true, maxlength: 80 },
    expertiseTitle: { type: String, trim: true, maxlength: 160 },

    // Approach
    approachEyebrow: { type: String, trim: true, maxlength: 80 },
    approachTitle: { type: String, trim: true, maxlength: 160 },
    approachDescription: { type: String, trim: true, maxlength: 320 },

    // Why TechCore (Expectations Intro)
    expectationsEyebrow: { type: String, trim: true, maxlength: 80 },
    expectationsTitle: { type: String, trim: true, maxlength: 160 },
    // (The array items are reused from Homepage reasons)

    // FAQ
    faqEyebrow: { type: String, trim: true, maxlength: 80 },
    faqTitle: { type: String, trim: true, maxlength: 160 },
    faqs: { type: [faqSchema], default: () => [] },

    // CTA
    ctaTitle: { type: String, trim: true, maxlength: 160 },
    ctaDescription: { type: String, trim: true, maxlength: 320 },
    ctaPrimaryLabel: { type: String, trim: true, maxlength: 40 },
    ctaPrimaryUrl: { type: String, trim: true, maxlength: 200 },
    ctaSecondaryLabel: { type: String, trim: true, maxlength: 40 },
    ctaSecondaryUrl: { type: String, trim: true, maxlength: 200 },

    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type AboutContent = InferSchemaType<typeof aboutContentSchema>;
export type AboutContentModel = Model<AboutContent>;

export const AboutContent =
  (mongoose.models.AboutContent as AboutContentModel | undefined) ??
  mongoose.model<AboutContent>("AboutContent", aboutContentSchema);
