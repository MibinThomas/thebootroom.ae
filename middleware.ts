import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin/session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (pathname === "/admin/login") return NextResponse.next();

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get("br_admin")?.value;
    const ok = verifyAdminSession(token);
    if (!ok) {
      if (isAdminApi) return new NextResponse("Unauthorized", { status: 401 });
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
