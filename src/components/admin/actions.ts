"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { signAdminSession } from "@/lib/admin/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function adminLoginAction(raw: unknown) {
  const { email, password } = schema.parse(raw);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Missing ADMIN_EMAIL / ADMIN_PASSWORD in environment variables");
  }

  if (email !== adminEmail || password !== adminPassword) {
    throw new Error("Invalid admin credentials");
  }

  const token = await signAdminSession({ email, iat: Date.now() });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { ok: true };
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return { ok: true };
}
