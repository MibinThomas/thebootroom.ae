import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/admin/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get("br_admin")?.value;

    // No session cookie
    if (!token) {
      if (isAdminApi) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Verify admin session (Edge-safe + async)
    const session = await verifyAdminSession(token);

    if (!session) {
      if (isAdminApi) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
