import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const lockoutSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, maxlength: 320 },
    count: { type: Number, required: true, default: 0 },
    lockedUntil: { type: Date },
  },
  { timestamps: true },
);

export type Lockout = InferSchemaType<typeof lockoutSchema>;
export type LockoutModel = Model<Lockout>;

export const Lockout =
  (mongoose.models.Lockout as LockoutModel | undefined) ??
  mongoose.model<Lockout>("Lockout", lockoutSchema);
