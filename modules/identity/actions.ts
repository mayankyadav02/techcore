"use server";

import { runAdminAction } from "@/lib/admin/action";
import { requirePermission } from "@/lib/auth";
import { parseForm } from "@/lib/admin/parse";
import { formString } from "@/lib/admin/query";
import {
  userInputSchema,
  userUpdateSchema,
} from "@/modules/identity/admin.schema";
import {
  createUser,
  updateUser,
  disableUser,
  deleteUser,
} from "@/modules/identity/admin.service";

function createPayload(formData: FormData) {
  return parseForm(userInputSchema, {
    email: formString(formData.get("email")),
    name: formString(formData.get("name")),
    password: formString(formData.get("password")),
    role: formString(formData.get("role")),
  });
}

function updatePayload(formData: FormData) {
  return parseForm(userUpdateSchema, {
    email: formString(formData.get("email")),
    name: formString(formData.get("name")),
    role: formString(formData.get("role")),
    status: formString(formData.get("status")),
  });
}

export async function createUserAction(formData: FormData) {
  return runAdminAction(async () => {
    const user = await requirePermission("users:write");
    const data = await createUser(createPayload(formData), user._id?.toString());
    return { ok: true as const, message: "User created.", data };
  });
}

export async function updateUserAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    const user = await requirePermission("users:write");
    // Prevent self-update of own disabled status to prevent self-disable
    if (user._id?.toString() === id) {
      const newStatus = formString(formData.get("status"));
      if (newStatus === "disabled") {
        throw new Error("You cannot disable your own account.");
      }
    }
    const data = await updateUser(id, updatePayload(formData), user._id?.toString());
    return { ok: true as const, message: "User saved.", data };
  });
}

export async function disableUserAction(id: string) {
  return runAdminAction(async () => {
    const user = await requirePermission("users:write");
    if (user._id?.toString() === id) {
      throw new Error("You cannot disable your own account.");
    }
    await disableUser(id, user._id?.toString());
    return { ok: true as const, message: "User disabled." };
  });
}

export async function deleteUserAction(id: string) {
  return runAdminAction(async () => {
    const user = await requirePermission("users:delete");
    if (user._id?.toString() === id) {
      throw new Error("You cannot delete your own account.");
    }
    await deleteUser(id, user._id?.toString());
    return { ok: true as const, message: "User deleted." };
  });
}
