import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminApi = pathname.startsWith("/api/admin");

  // ✅ Protect admin pages except login
  const isAdminPage =
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    pathname !== "/admin/logout";

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get("br_admin")?.value;

    // not logged in → redirect to login (for pages) or 401 (for api)
    if (!token) {
      if (isAdminApi) return new NextResponse("Unauthorized", { status: 401 });
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    const session = await verifyAdminSession(token);

    if (!session) {
      // clear bad cookie to stop loops
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
