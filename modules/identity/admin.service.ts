import { connectMongo } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { writeAuditLog } from "@/lib/audit";
import { User } from "@/modules/models";
import { hashPassword } from "@/modules/identity/password";
import { userInputSchema, userUpdateSchema } from "@/modules/identity/admin.schema";
import type { z } from "zod";

export type UserListRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLoginAt?: Date | null;
  createdAt?: Date;
};

export type UserDetail = UserListRow & {
  passwordChangedAt?: Date | null;
};

const pageSize = 20;

export async function listUsers({
  q = "",
  page = "1",
}: {
  q?: string;
  page?: string;
} = {}): Promise<{
  rows: UserListRow[];
  page: number;
  pageCount: number;
  total: number;
}> {
  await connectMongo();

  const pageNum = Math.max(1, parseInt(page || "1", 10));
  const skip = (pageNum - 1) * pageSize;

  const query: Record<string, unknown> = {};
  if (q) {
    const searchRegex = new RegExp(q, "i");
    query.$or = [{ email: searchRegex }, { name: searchRegex }];
  }

  const [rows, total] = await Promise.all([
    User.find(query)
      .select("id email name role status lastLoginAt createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    rows: rows.map((row) => ({
      id: row._id?.toString() || "",
      name: row.name,
      email: row.email,
      role: row.role,
      status: row.status,
      lastLoginAt: row.lastLoginAt || undefined,
      createdAt: row.createdAt,
    })),
    page: pageNum,
    pageCount: Math.ceil(total / pageSize),
    total,
  };
}

export async function getUser(id: string): Promise<UserDetail> {
  await connectMongo();

  const user = await User.findById(id).select(
    "email name role status lastLoginAt passwordChangedAt createdAt",
  );

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found.");
  }

  return {
    id: user._id?.toString() || "",
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastLoginAt: user.lastLoginAt || undefined,
    passwordChangedAt: user.passwordChangedAt || undefined,
    createdAt: user.createdAt,
  };
}

export async function createUser(
  input: z.infer<typeof userInputSchema>,
  actorId?: string,
): Promise<UserDetail> {
  await connectMongo();

  // Check if user already exists
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError("CONFLICT", "A user with this email already exists.");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    email: input.email,
    name: input.name,
    passwordHash,
    role: input.role as "super_admin" | "admin" | "editor" | "viewer",
    status: "active",
  });

  await writeAuditLog({
    actorId,
    action: "user_created",
    resourceType: "User",
    resourceId: user._id?.toString(),
    metadata: {
      email: user.email,
      role: user.role,
    },
  });

  return {
    id: user._id?.toString() || "",
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
}

export async function updateUser(
  id: string,
  input: z.infer<typeof userUpdateSchema>,
  actorId?: string,
): Promise<UserDetail> {
  await connectMongo();

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found.");
  }

  // Check email uniqueness if changed
  if (input.email !== user.email) {
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      throw new AppError("CONFLICT", "A user with this email already exists.");
    }
  }

  const oldRole = user.role;
  user.email = input.email;
  user.name = input.name;
  user.role = input.role as "super_admin" | "admin" | "editor" | "viewer";
  user.status = input.status as "active" | "disabled";

  await user.save();

  // Audit log role changes separately
  if (oldRole !== input.role) {
    await writeAuditLog({
      actorId,
      action: "user_role_changed",
      resourceType: "User",
      resourceId: user._id?.toString(),
      metadata: {
        email: user.email,
        oldRole,
        newRole: input.role,
      },
    });
  }

  await writeAuditLog({
    actorId,
    action: "user_updated",
    resourceType: "User",
    resourceId: user._id?.toString(),
    metadata: {
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });

  return {
    id: user._id?.toString() || "",
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastLoginAt: user.lastLoginAt || undefined,
    passwordChangedAt: user.passwordChangedAt || undefined,
    createdAt: user.createdAt,
  };
}

export async function disableUser(
  id: string,
  actorId?: string,
): Promise<UserDetail> {
  await connectMongo();

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found.");
  }

  if (user.status === "disabled") {
    throw new AppError("CONFLICT", "User is already disabled.");
  }

  user.status = "disabled";
  await user.save();

  await writeAuditLog({
    actorId,
    action: "user_disabled",
    resourceType: "User",
    resourceId: user._id?.toString(),
    metadata: {
      email: user.email,
      role: user.role,
    },
  });

  return {
    id: user._id?.toString() || "",
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastLoginAt: user.lastLoginAt || undefined,
    passwordChangedAt: user.passwordChangedAt || undefined,
    createdAt: user.createdAt,
  };
}

export async function deleteUser(id: string, actorId?: string): Promise<void> {
  await connectMongo();

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found.");
  }

  await User.deleteOne({ _id: id });

  await writeAuditLog({
    actorId,
    action: "user_deleted",
    resourceType: "User",
    resourceId: id,
    metadata: {
      email: user.email,
      role: user.role,
    },
  });
}

export async function resetUserPassword(
  id: string,
  input: z.infer<typeof import("@/modules/identity/admin.schema").userPasswordResetSchema>,
  actorId?: string,
): Promise<void> {
  await connectMongo();

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found.");
  }

  const passwordHash = await hashPassword(input.password);
  
  user.passwordHash = passwordHash;
  user.passwordChangedAt = new Date();
  await user.save();

  await writeAuditLog({
    actorId,
    action: "user_password_reset",
    resourceType: "User",
    resourceId: user._id?.toString(),
    metadata: {
      email: user.email,
    },
  });

  const { destroySessionsForUser } = await import("@/modules/identity/session.service");
  await destroySessionsForUser(id);
}
