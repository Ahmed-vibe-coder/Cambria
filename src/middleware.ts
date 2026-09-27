import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Exclude admin and verification routes from search engine indexing
  if (pathname.startsWith("/admin") || pathname.startsWith("/verify")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // 2. Protect /admin/* routes
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/mfa";

  if (pathname.startsWith("/admin") && !isAuthPage) {
    const sessionCookie = request.cookies.get("cambria_staff_session");
    const mfaCookie = request.cookies.get("cambria_staff_mfa_verified");
    const supabaseCookie =
      request.cookies.get("sb-access-token") ||
      request.cookies.get("supabase-auth-token") ||
      request.cookies.getAll().find((c) => c.name.includes("-auth-token"));

    const hasSession = Boolean(sessionCookie?.value || supabaseCookie?.value);
    const requireMfa =
      process.env.REQUIRE_ADMIN_MFA === "true" ||
      process.env.MFA_REQUIRED === "true";
    const hasMfa = requireMfa ? (mfaCookie?.value === "true") : true;

    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (requireMfa && !hasMfa) {
      const mfaUrl = new URL("/admin/mfa", request.url);
      mfaUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(mfaUrl);
    }
  }

  // If already authenticated and accessing login page, forward directly to /admin
  if (pathname === "/admin/login") {
    const sessionCookie = request.cookies.get("cambria_staff_session");
    const supabaseCookie =
      request.cookies.get("sb-access-token") ||
      request.cookies.get("supabase-auth-token") ||
      request.cookies.getAll().find((c) => c.name.includes("-auth-token"));

    if (sessionCookie?.value || supabaseCookie?.value) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/verify/:path*"],
};
