"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginAction } from "@/components/admin/actions";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Field, ErrorText } from "@/components/ui/Field";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.target as HTMLFormElement);
    const payload = { email: String(form.get("email")||""), password: String(form.get("password")||"") };
    try {
      const res = await adminLoginAction(payload);
      if (!res.ok) { setError(res.message); setLoading(false); return; }
      router.push("/admin/teams");
    } catch { setError("Something went wrong. Try again."); setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field>
        <Label>Email</Label>
        <Input name="email" type="email" placeholder="admin@thebootroom.ae" required />
      </Field>
      <Field>
        <Label>Password</Label>
        <Input name="password" type="password" placeholder="••••••••" required />
      </Field>
      <ErrorText>{error ?? undefined}</ErrorText>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
      <p className="text-xs text-black/50">Set credentials in <code>.env.local</code>.</p>
    </form>
  );
}
