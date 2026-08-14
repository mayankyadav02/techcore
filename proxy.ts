import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const isAdmin = request.nextUrl.pathname.startsWith("/admin");

  if (isAdmin) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Authentication gating is added in the identity phase.
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
