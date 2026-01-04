"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { signAdminSession } from "@/lib/admin/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function adminLoginAction(raw: unknown) {
  try {
    const { email, password } = schema.parse(raw);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_AUTH_SECRET;

    if (!adminEmail || !adminPassword || !secret) {
      return {
        ok: false,
        message:
          "Missing ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_AUTH_SECRET in Vercel Environment Variables.",
      };
    }

    if (email !== adminEmail || password !== adminPassword) {
      return { ok: false, message: "Invalid admin email or password." };
    }

    const token = await signAdminSession({ email, iat: Date.now() });

    const jar = await cookies();
    jar.set("br_admin", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { ok: true, message: "Logged in" };
  } catch (err: any) {
    return { ok: false, message: err?.message || "Login failed" };
  }
}

export async function adminLogoutAction() {
  const jar = await cookies();
  jar.set("br_admin", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return { ok: true };
}
