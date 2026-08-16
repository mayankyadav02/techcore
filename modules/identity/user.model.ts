import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { userRoles, userStatuses } from "@/modules/shared/enums";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: userRoles,
      required: true,
      default: "viewer",
    },
    status: {
      type: String,
      enum: userStatuses,
      required: true,
      default: "active",
    },
    lastLoginAt: { type: Date },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ role: 1, status: 1 });

userSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.passwordHash;
    return ret;
  },
});

export type User = InferSchemaType<typeof userSchema>;
export type UserModel = Model<User>;

export const User =
  (mongoose.models.User as UserModel | undefined) ??
  mongoose.model<User>("User", userSchema);
