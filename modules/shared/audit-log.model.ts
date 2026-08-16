import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: { type: String, required: true, trim: true, maxlength: 80 },
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    resourceType: { type: String, required: true, trim: true, maxlength: 80 },
    resourceId: { type: String, trim: true, maxlength: 80 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });

export type AuditLog = InferSchemaType<typeof auditLogSchema>;
export type AuditLogModel = Model<AuditLog>;

export const AuditLog =
  (mongoose.models.AuditLog as AuditLogModel | undefined) ??
  mongoose.model<AuditLog>("AuditLog", auditLogSchema);
