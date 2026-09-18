import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const mediaSchema = new Schema(
  {
    filename: { type: String, required: true, trim: true, maxlength: 255 },
    url: { type: String, required: true, trim: true, maxlength: 1000, unique: true },
    altText: { type: String, trim: true, maxlength: 320, default: "" },
    mimeType: { type: String, required: true, trim: true, maxlength: 80 },
    sizeBytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type Media = InferSchemaType<typeof mediaSchema>;
export type MediaModel = Model<Media>;

export const Media =
  (mongoose.models.Media as MediaModel | undefined) ??
  mongoose.model<Media>("Media", mediaSchema);

