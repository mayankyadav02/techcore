import { randomBytes } from "node:crypto";
import { Types } from "mongoose";
import { AppError } from "@/lib/errors";
import { slugPattern } from "@/modules/shared/enums";

const objectIdPattern = /^[a-f\d]{24}$/i;

export function isObjectId(value: string) {
  return objectIdPattern.test(value);
}

export function parseObjectId(value: string) {
  if (!isObjectId(value)) {
    throw new AppError("VALIDATION_ERROR", "Invalid identifier.");
  }
  return new Types.ObjectId(value);
}

export function parseSlug(value: string) {
  if (!slugPattern.test(value) || value.length > 120) {
    throw new AppError("VALIDATION_ERROR", "Invalid slug.");
  }
  return value;
}

export function toId(value: unknown) {
  return String(value);
}

/** Opaque 24-char hex id used for honeypot responses (same shape as Mongo ids). */
export function opaqueRecordId() {
  return randomBytes(12).toString("hex");
}
