import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/admin/login";
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminApi && !hasSession) {
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        message: "Sign in required.",
      },
      { status: 401 },
    );
  }

  if (isAdminPage && !isLogin && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (isAdminPage) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
