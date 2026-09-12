import "server-only";

import mongoose from "mongoose";
import { connectMongo } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import {
  ADMIN_PAGE_SIZE,
  parsePage,
  searchFilter,
} from "@/lib/admin/query";
import { AuditLog } from "@/modules/shared/audit-log.model";
import { User } from "@/modules/identity/user.model";

export type AuditLogActor = {
  id: string;
  name: string | null;
  email: string | null;
};

export type AuditLogMetadataSummary = {
  items: {
    key: string;
    value: string;
  }[];
  hiddenCount: number;
};

export type AuditLogListRow = {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  actor: AuditLogActor | null;
  metadata: AuditLogMetadataSummary;
  createdAt?: Date;
};

type AuditLogRow = {
  _id: unknown;
  action?: string;
  actorId?: unknown;
  resourceType?: string;
  resourceId?: string;
  metadata?: unknown;
  createdAt?: Date;
};

type AuditLogListInput = {
  q?: string;
  action?: string;
  from?: string;
  to?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
};

const sensitiveKey =
  /password|passwordhash|otp|one[-_\s]?time|token|secret|cookie|authorization|api[-_\s]?key|apikey|credential|session|jwt|bearer|resume/i;
const sensitiveValue =
  /password|otp|token|secret|cookie|authorization|api[-_\s]?key|bearer\s+[a-z0-9._-]+/i;
const metadataLimit = 4;

function stringifyId(value: unknown) {
  if (!value) return "";
  return String(value);
}

function parseDateFilter(value: string | undefined, endOfDay = false) {
  const text = value?.trim();
  if (!text) return undefined;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return undefined;
  if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(text)) {
    date.setUTCHours(23, 59, 59, 999);
  }
  return date;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function summarizeMetadataValue(value: unknown) {
  if (value === null) return "None";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value !== "string") return undefined;

  const text = value.trim().slice(0, 120);
  if (!text || sensitiveValue.test(text)) return undefined;
  return text;
}

function summarizeMetadata(metadata: unknown): AuditLogMetadataSummary {
  const summary: AuditLogMetadataSummary = { items: [], hiddenCount: 0 };
  if (!metadata) return summary;
  if (!isRecord(metadata)) {
    summary.hiddenCount = 1;
    return summary;
  }

  for (const [key, value] of Object.entries(metadata)) {
    if (summary.items.length >= metadataLimit) {
      summary.hiddenCount += 1;
      continue;
    }

    if (sensitiveKey.test(key)) {
      summary.hiddenCount += 1;
      continue;
    }

    const safeValue = summarizeMetadataValue(value);
    if (safeValue === undefined) {
      summary.hiddenCount += 1;
      continue;
    }

    summary.items.push({
      key: key.trim().slice(0, 40),
      value: safeValue,
    });
  }

  return summary;
}

async function resolveActors(actorIds: string[]) {
  const validIds = actorIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (validIds.length === 0) return new Map<string, AuditLogActor>();

  const users = await User.find({ _id: { $in: validIds } })
    .select("name email")
    .lean();

  return new Map(
    users.map((user) => [
      String(user._id),
      {
        id: String(user._id),
        name: user.name ?? null,
        email: user.email ?? null,
      },
    ]),
  );
}

function mapAuditLogRow(
  row: AuditLogRow,
  actors: Map<string, AuditLogActor>,
): AuditLogListRow {
  const actorId = stringifyId(row.actorId);

  return {
    id: stringifyId(row._id),
    action: row.action ?? "",
    resourceType: row.resourceType ?? "",
    resourceId: row.resourceId ?? "",
    actor: actorId
      ? actors.get(actorId) ?? { id: actorId, name: null, email: null }
      : null,
    metadata: summarizeMetadata(row.metadata),
    createdAt: row.createdAt,
  };
}

export async function listAuditLogs(input: AuditLogListInput = {}) {
  await requirePermission("audit_logs:read");
  await connectMongo();

  const page = parsePage(input.page);
  const filter: Record<string, unknown> = {};
  Object.assign(
    filter,
    searchFilter(input.q, ["action", "resourceType", "resourceId"]),
  );

  const action = input.action?.trim().slice(0, 80);
  if (action) filter.action = action;

  const from = parseDateFilter(input.from ?? input.dateFrom);
  const to = parseDateFilter(input.to ?? input.dateTo, true);
  if (from || to) {
    filter.createdAt = {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lte: to } : {}),
    };
  }

  const query = filter as never;
  const [rows, total] = await Promise.all([
    AuditLog.find(query)
      .select("action actorId resourceType resourceId metadata createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean<AuditLogRow[]>(),
    AuditLog.countDocuments(query),
  ]);

  const actorIds = Array.from(
    new Set(rows.map((row) => stringifyId(row.actorId)).filter(Boolean)),
  );
  const actors = await resolveActors(actorIds);

  return {
    rows: rows.map((row) => mapAuditLogRow(row, actors)),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  };
}

export async function listAuditLogActions() {
  await requirePermission("audit_logs:read");
  await connectMongo();

  const actions = await AuditLog.distinct("action");
  return actions
    .filter((action): action is string => typeof action === "string" && Boolean(action.trim()))
    .sort((a, b) => a.localeCompare(b));
}
