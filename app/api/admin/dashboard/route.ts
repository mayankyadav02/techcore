import { handleRouteError, jsonError, jsonSuccess } from "@/lib/api/http";
import { hasPermission } from "@/lib/rbac";
import { userFromCookieHeader } from "@/modules/identity/auth.service";
import { loadDashboard } from "@/modules/identity/dashboard.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await userFromCookieHeader(request.headers.get("cookie"));
    if (!user) {
      return jsonError("UNAUTHORIZED", "Sign in required.", 401);
    }
    if (!hasPermission(user.role, "dashboard:read")) {
      return jsonError("FORBIDDEN", "You do not have access to this resource.", 403);
    }
    const data = await loadDashboard(user);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
