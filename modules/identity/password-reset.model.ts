import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const passwordResetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    /** HMAC-SHA256 hash of the 6-digit OTP — never store the raw OTP */
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    /** Number of failed verification attempts for this token */
    attempts: { type: Number, required: true, default: 0 },
    used: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

// TTL index: MongoDB will automatically delete expired documents
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type PasswordReset = InferSchemaType<typeof passwordResetSchema>;
export type PasswordResetModel = Model<PasswordReset>;

export const PasswordReset =
  (mongoose.models.PasswordReset as PasswordResetModel | undefined) ??
  mongoose.model<PasswordReset>("PasswordReset", passwordResetSchema);
