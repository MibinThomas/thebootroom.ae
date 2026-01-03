import { cookies } from "next/headers";
import { verifyAdminSession } from "@/lib/admin/session";
export async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get("br_admin")?.value;
  const ok = verifyAdminSession(token);
  if (!ok) throw new Error("UNAUTHORIZED");
  return ok;
}
