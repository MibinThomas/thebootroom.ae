"use server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createAdminSession } from "@/lib/admin/session";
const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
export async function adminLoginAction(raw: unknown) {
  const { email, password } = schema.parse(raw);
  const ok = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
  if (!ok) return { ok: false as const, message: "Invalid email or password" };
  const token = createAdminSession({ email });
  const jar = await cookies();
  jar.set({ name: "br_admin", value: token, httpOnly: true, secure: process.env.NODE_ENV==="production", sameSite: "lax", path: "/", maxAge: 60*60*8 });
  return { ok: true as const };
}
