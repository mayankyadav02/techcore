import { forbidden, redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { AppError } from "@/lib/errors";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { hasPermission, type Permission } from "@/lib/rbac";
import { resolveSession } from "@/modules/identity/session.service";

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return resolveSession(token);
}

export async function requireUser() {
  const user = await getSession();
  if (!user) {
    throw new AppError("UNAUTHORIZED", "Sign in required.");
  }
  return user;
}

export async function requireAdminPage() {
  const user = await getSession();
  if (!user) {
    const path = (await headers()).get("x-pathname") || "/admin/dashboard";
    const callback =
      path.startsWith("/admin") && !path.startsWith("/admin/login")
        ? path
        : "/admin/dashboard";
    redirect(`/admin/login?callbackUrl=${encodeURIComponent(callback)}`);
  }
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  if (!hasPermission(user.role, permission)) {
    throw new AppError("FORBIDDEN", "You do not have access to this resource.");
  }
  return user;
}

export async function requirePagePermission(permission: Permission) {
  const user = await requireAdminPage();
  if (!hasPermission(user.role, permission)) {
    forbidden();
  }
  return user;
}
