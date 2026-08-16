import { handleRouteError, jsonError, jsonSuccess } from "@/lib/api/http";
import { userFromCookieHeader } from "@/modules/identity/auth.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await userFromCookieHeader(request.headers.get("cookie"));
    if (!user) {
      return jsonError("UNAUTHORIZED", "Sign in required.", 401);
    }
    return jsonSuccess({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}
