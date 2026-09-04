import mongoose from "mongoose";
import { connectMongo } from "@/lib/db";
import { AuditLog } from "@/modules/shared/audit-log.model";

export type AuditEvent = {
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

const blockedKey = /password|secret|token|cookie|authorization|resume/i;

function sanitizeMetadata(
  metadata?: AuditEvent["metadata"],
): Record<string, string | number | boolean | null> | undefined {
  if (!metadata) return undefined;
  const clean: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (blockedKey.test(key)) continue;
    if (typeof value === "string") {
      clean[key] = value.slice(0, 200);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

export async function writeAuditLog(event: AuditEvent): Promise<void> {
  try {
    await connectMongo();
    const logData: Record<string, unknown> = {
      action: event.action.slice(0, 80),
      resourceType: event.resourceType.slice(0, 80),
      resourceId: event.resourceId?.slice(0, 80),
      metadata: sanitizeMetadata(event.metadata),
    };

    // Only include actorId if provided and valid
    if (event.actorId) {
      try {
        logData.actorId = new mongoose.Types.ObjectId(event.actorId);
      } catch {
        // If not a valid ObjectId, omit it
      }
    }

    await AuditLog.create(logData);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        code: "AUDIT_WRITE_FAILED",
        name: error instanceof Error ? error.name : "Error",
      }),
    );
  }
}
