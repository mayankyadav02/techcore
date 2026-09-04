import { connectMongo } from "@/lib/db";
import { env } from "@/lib/env";
import {
  SESSION_ABSOLUTE_MS,
  SESSION_COOKIE,
  SESSION_IDLE_MS,
} from "@/lib/auth-constants";
import { Session } from "@/modules/identity/session.model";
import { User } from "@/modules/identity/user.model";
import type { Role } from "@/lib/rbac";
import { createHash, randomBytes } from "node:crypto";

export type AuthUser = {
  _id: string;
  id: string;
  email: string;
  name: string;
  role: Role;
};

export function hashSessionToken(token: string) {
  const pepper = env.AUTH_SECRET ?? "";
  return createHash("sha256").update(`${pepper}:${token}`).digest("hex");
}

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_ABSOLUTE_MS / 1000),
  };
}

export function parseCookieToken(header: string | null) {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const name = part.slice(0, separator).trim();
    if (name !== SESSION_COOKIE) continue;
    return decodeURIComponent(part.slice(separator + 1).trim());
  }
  return undefined;
}

export async function createSession(input: {
  userId: string;
  ip?: string;
  userAgent?: string;
}) {
  const token = createSessionToken();
  const now = new Date();
  await connectMongo();
  await Session.create({
    userId: input.userId,
    tokenHash: hashSessionToken(token),
    expiresAt: new Date(now.getTime() + SESSION_ABSOLUTE_MS),
    lastSeenAt: now,
    ip: input.ip?.slice(0, 128),
    userAgent: input.userAgent?.slice(0, 300),
  });
  return token;
}

export async function destroySessionByToken(token: string) {
  await connectMongo();
  await Session.deleteOne({ tokenHash: hashSessionToken(token) });
}

export async function destroySessionsForUser(userId: string) {
  await connectMongo();
  await Session.deleteMany({ userId });
}

export async function resolveSession(
  token: string | undefined,
): Promise<AuthUser | null> {
  if (!token || token.length < 16 || token.length > 128) return null;

  await connectMongo();
  const session = await Session.findOne({
    tokenHash: hashSessionToken(token),
  });
  if (!session) return null;

  const now = Date.now();
  const idleLimit = session.lastSeenAt.getTime() + SESSION_IDLE_MS;
  if (session.expiresAt.getTime() <= now || idleLimit <= now) {
    await Session.deleteOne({ _id: session._id });
    return null;
  }

  const user = await User.findOne({
    _id: session.userId,
    status: "active",
  }).select("email name role passwordChangedAt");

  if (!user) {
    await Session.deleteOne({ _id: session._id });
    return null;
  }

  if (
    user.passwordChangedAt &&
    session.createdAt &&
    user.passwordChangedAt.getTime() > session.createdAt.getTime()
  ) {
    await Session.deleteOne({ _id: session._id });
    return null;
  }

  if (now - session.lastSeenAt.getTime() > 5 * 60 * 1000) {
    session.lastSeenAt = new Date();
    await session.save();
  }

  return {
    _id: String(user._id),
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role as Role,
  };
}
