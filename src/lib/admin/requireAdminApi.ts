import { cookies } from "next/headers";
import { verifyAdminSession } from "@/lib/admin/session";

/**
 * Use inside API routes to block non-admin requests.
 * Returns void if authorized, otherwise throws Response.
 */
export async function requireAdminApi() {
  const jar = await cookies();
  const token = jar.get("br_admin")?.value;

  // token can be undefined, so we pass "" safely
  const ok = verifyAdminSession(token ?? "");
  if (!ok) {
    throw new Response("Unauthorized", { status: 401 });
  }
}
 