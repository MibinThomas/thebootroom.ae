import { cookies } from "next/headers";
import { verifyAdminSession } from "@/lib/admin/session";

export async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get("br_admin")?.value;

  // ✅ token can be undefined
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  // ✅ verify is async (Edge-safe WebCrypto)
  const session = await verifyAdminSession(token);

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}
