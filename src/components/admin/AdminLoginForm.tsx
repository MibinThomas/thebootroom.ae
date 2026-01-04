"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginAction } from "@/components/admin/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Field, ErrorText } from "@/components/ui/Field";

export default function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      const res = await adminLoginAction(payload);

      if (!res?.ok) {
        setError(res?.message || "Login failed.");
        setLoading(false);
        return;
      }

      // ✅ force navigation after login
      router.push("/admin/teams");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-soft p-6 space-y-4"
    >
      <div>
        <h1 className="font-display text-3xl text-bootred">Admin Login</h1>
        <p className="mt-1 text-sm text-black/60">Sign in to manage teams and tickets.</p>
      </div>

      <Field>
        <Label>Email</Label>
        <Input name="email" type="email" placeholder="admin@thebootroom.ae" required />
      </Field>

      <Field>
        <Label>Password</Label>
        <Input name="password" type="password" placeholder="••••••••" required />
      </Field>

      {error ? <ErrorText>{error}</ErrorText> : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
