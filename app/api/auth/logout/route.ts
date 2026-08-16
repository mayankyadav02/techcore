import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/api/http";
import { assertSameOrigin } from "@/lib/api/request";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { logoutSession } from "@/modules/identity/auth.service";
import {
  parseCookieToken,
  sessionCookieOptions,
} from "@/modules/identity/session.service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await logoutSession(parseCookieToken(request.headers.get("cookie")));
    const response = NextResponse.json({
      success: true,
      data: { signedOut: true },
      message: "Signed out.",
    });
    response.cookies.set(SESSION_COOKIE, "", {
      ...sessionCookieOptions(),
      maxAge: 0,
    });
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
