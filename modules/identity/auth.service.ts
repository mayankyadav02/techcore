import { connectMongo } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { writeAuditLog } from "@/lib/audit";
import {
  LOGIN_LOCK_ATTEMPTS,
  LOGIN_LOCK_WINDOW_MS,
} from "@/lib/auth-constants";
import { Lockout } from "@/modules/identity/lockout.model";
import { User } from "@/modules/identity/user.model";
import { verifyPassword } from "@/modules/identity/password";
import {
  createSession,
  destroySessionByToken,
  parseCookieToken,
  resolveSession,
  type AuthUser,
} from "@/modules/identity/session.service";

const INVALID = "Invalid credentials.";

function lockKey(email: string, ip: string) {
  return `${email.toLowerCase()}:${ip}`.slice(0, 320);
}

async function assertNotLocked(key: string) {
  await connectMongo();
  const row = await Lockout.findOne({ key }).lean();
  if (row?.lockedUntil && row.lockedUntil.getTime() > Date.now()) {
    throw new AppError("UNAUTHORIZED", INVALID);
  }
}

async function recordFailure(key: string) {
  await connectMongo();
  const row = await Lockout.findOneAndUpdate(
    { key },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );
  if (row && row.count >= LOGIN_LOCK_ATTEMPTS) {
    row.lockedUntil = new Date(Date.now() + LOGIN_LOCK_WINDOW_MS);
    await row.save();
  }
}

async function clearLock(key: string) {
  await connectMongo();
  await Lockout.deleteOne({ key });
}

export async function loginWithPassword(input: {
  email: string;
  password: string;
  ip: string;
  userAgent?: string;
  existingToken?: string;
}): Promise<{ user: AuthUser; token: string }> {
  const email = input.email.trim().toLowerCase();
  const key = lockKey(email, input.ip);
  await assertNotLocked(key);

  await connectMongo();
  const user = await User.findOne({ email }).select(
    "+passwordHash email name role status",
  );
  const matches = await verifyPassword(input.password, user?.passwordHash);

  if (!user || user.status !== "active" || !matches) {
    await recordFailure(key);
    throw new AppError("UNAUTHORIZED", INVALID);
  }

  await clearLock(key);

  if (input.existingToken) {
    await destroySessionByToken(input.existingToken);
  }

  const token = await createSession({
    userId: String(user._id),
    ip: input.ip,
    userAgent: input.userAgent,
  });

  user.lastLoginAt = new Date();
  await user.save();

  await writeAuditLog({
    actorId: String(user._id),
    action: "auth.login",
    resourceType: "User",
    resourceId: String(user._id),
  });

  return {
    token,
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export async function logoutSession(token: string | undefined) {
  if (token) {
    await destroySessionByToken(token);
  }
}

export async function userFromCookieHeader(header: string | null) {
  return resolveSession(parseCookieToken(header));
}
