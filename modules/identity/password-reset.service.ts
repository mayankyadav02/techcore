import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { connectMongo } from "@/lib/db";
import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { writeAuditLog } from "@/lib/audit";
import { User } from "@/modules/identity/user.model";
import { PasswordReset } from "@/modules/identity/password-reset.model";
import { hashPassword } from "@/modules/identity/password";
import { destroySessionsForUser } from "@/modules/identity/session.service";

/** OTP expires after 10 minutes */
const OTP_TTL_MS = 10 * 60 * 1000;
/** Max failed verification attempts before OTP is locked */
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  // cryptographically secure 6-digit code (000000 – 999999)
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOtp(otp: string): string {
  if (!env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required to hash password reset OTPs.");
  }

  return createHmac("sha256", env.AUTH_SECRET).update(otp).digest("hex");
}

function hashesMatch(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

/**
 * Create a password-reset OTP for the given email.
 * Only allows super_admin accounts.
 * Returns the raw OTP so it can be emailed — never persisted.
 * Always returns the same generic shape to prevent enumeration.
 */
export async function createPasswordResetOtp(email: string): Promise<{
  otp: string;
  userName: string;
  userId: string;
} | null> {
  await connectMongo();

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
    status: "active",
    role: "super_admin",
  }).select("_id email name");

  if (!user) {
    // Return null — caller must still respond generically
    return null;
  }

  // Invalidate any existing unused tokens for this user
  await PasswordReset.deleteMany({ userId: user._id });

  const otp = generateOtp();
  const tokenHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await PasswordReset.create({
    userId: user._id,
    tokenHash,
    expiresAt,
    attempts: 0,
    used: false,
  });

  await writeAuditLog({
    actorId: String(user._id),
    action: "password_reset_requested",
    resourceType: "User",
    resourceId: String(user._id),
    metadata: { email: user.email },
  });

  return { otp, userName: user.name, userId: String(user._id) };
}

/**
 * Verify the OTP and complete the password reset.
 * Returns success silently if the OTP was valid.
 * Throws AppError for all failure modes.
 */
export async function resetPasswordWithOtp(input: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<void> {
  await connectMongo();

  const user = await User.findOne({
    email: input.email.toLowerCase().trim(),
    status: "active",
    role: "super_admin",
  })
    .select("+passwordHash _id email name")
    .lean();

  if (!user) {
    throw new AppError("UNAUTHORIZED", "Invalid or expired code.");
  }

  const userId = String(user._id);
  const tokenHash = hashOtp(input.otp.trim());

  // Find active (non-expired, non-used) token for this user
  const record = await PasswordReset.findOne({
    userId: user._id,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new AppError("UNAUTHORIZED", "Invalid or expired code.");
  }

  // Increment attempt counter first (before timing-sensitive compare)
  if (record.attempts >= MAX_ATTEMPTS) {
    throw new AppError(
      "UNAUTHORIZED",
      "Too many failed attempts. Please request a new code.",
    );
  }

  record.attempts += 1;
  await record.save();

  if (!hashesMatch(record.tokenHash, tokenHash)) {
    if (record.attempts >= MAX_ATTEMPTS) {
      // Lock by marking used so the window error message is clear
      record.used = true;
      await record.save();
      throw new AppError(
        "UNAUTHORIZED",
        "Too many failed attempts. Please request a new code.",
      );
    }
    throw new AppError("UNAUTHORIZED", "Invalid or expired code.");
  }

  // OTP matched — invalidate immediately (single-use)
  record.used = true;
  await record.save();

  // Hash new password and update user
  const passwordHash = await hashPassword(input.newPassword);
  await User.updateOne(
    { _id: user._id },
    { passwordHash, passwordChangedAt: new Date() },
  );

  // Revoke all existing sessions
  await destroySessionsForUser(userId);

  await writeAuditLog({
    actorId: userId,
    action: "password_reset_completed",
    resourceType: "User",
    resourceId: userId,
    metadata: { email: user.email },
  });
}
