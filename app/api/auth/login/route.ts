import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/api/http";
import {
  assertSameOrigin,
  clientKey,
  readJson,
} from "@/lib/api/request";
import { enforceRateLimit } from "@/lib/rate-limit";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { loginApiSchema } from "@/modules/identity/schema";
import { loginWithPassword } from "@/modules/identity/auth.service";
import {
  parseCookieToken,
  sessionCookieOptions,
} from "@/modules/identity/session.service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit("login", clientKey(request));
    const body = await readJson(request, loginApiSchema);
    const { user, token } = await loginWithPassword({
      email: body.email,
      password: body.password,
      ip: clientKey(request),
      userAgent: request.headers.get("user-agent") ?? undefined,
      existingToken: parseCookieToken(request.headers.get("cookie")),
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "Signed in.",
      },
      { status: 200 },
    );
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
