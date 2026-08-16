import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    lastSeenAt: { type: Date, required: true },
    ip: { type: String, maxlength: 128 },
    userAgent: { type: String, maxlength: 300 },
  },
  { timestamps: true },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type Session = InferSchemaType<typeof sessionSchema>;
export type SessionModel = Model<Session>;

export const Session =
  (mongoose.models.Session as SessionModel | undefined) ??
  mongoose.model<Session>("Session", sessionSchema);
