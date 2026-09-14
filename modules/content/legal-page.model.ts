import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { legalPageSchema } from "@/modules/content/legal-page.schema";

// Mongoose schema mirrors the Zod schema
const legalPageMongooseSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, enum: legalPageSchema.shape.key.options },
    content: { type: String, trim: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export type LegalPageDocument = InferSchemaType<typeof legalPageMongooseSchema>;

export const LegalPage: Model<LegalPageDocument> =
  (mongoose.models.LegalPage as Model<LegalPageDocument> | undefined) ??
  mongoose.model<LegalPageDocument>("LegalPage", legalPageMongooseSchema);
