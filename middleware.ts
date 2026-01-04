import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminApi = pathname.startsWith("/api/admin") || pathname.startsWith("/api/verify");
  const isProtectedPage =
    (pathname.startsWith("/admin") && pathname !== "/admin/login" && pathname !== "/admin/logout") ||
    pathname === "/verify";

  if (isProtectedPage || isAdminApi) {
    const token = req.cookies.get("br_admin")?.value;

    if (!token) {
      if (isAdminApi) return new NextResponse("Unauthorized", { status: 401 });
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname + (req.nextUrl.search || ""));
      return NextResponse.redirect(url);
    }

    const ok = await verifyAdminSession(token);
    if (!ok) {
      const res = isAdminApi
        ? new NextResponse("Unauthorized", { status: 401 })
        : NextResponse.redirect(new URL("/admin/login", req.url));

      res.cookies.set("br_admin", "", { path: "/", maxAge: 0 });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/verify", "/api/verify"],
};
