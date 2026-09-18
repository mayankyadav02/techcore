import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const rateLimitSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RateLimit = InferSchemaType<typeof rateLimitSchema>;
export type RateLimitModel = Model<RateLimit>;

export const RateLimit =
  (mongoose.models.RateLimit as RateLimitModel | undefined) ??
  mongoose.model<RateLimit>("RateLimit", rateLimitSchema);
