"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerTeamUiSchema, type RegisterTeamUiInput } from "@/lib/validators/registerTeamUiSchema";
import { DEFAULT_PLAYERS } from "@/components/register/defaults";
import { createTicketAction } from "@/components/register/actions";

import { Field, ErrorText } from "@/components/ui/Field";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-black/10 bg-white/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/60"
      >
        <div className="font-semibold">{title}</div>
        <div className="text-bootred font-bold">{open ? "−" : "+"}</div>
      </button>
      {open ? <div className="p-4 pt-0">{children}</div> : null}
    </div>
  );
}

async function presignAndUploadLogo(file: File) {
  const res = await fetch("/api/s3/presign-logo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type || "image/png",
    }),
  });
  if (!res.ok) throw new Error("Logo presign failed");
  const data = await res.json();

  // upload to S3
  const put = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "image/png" },
    body: file,
  });
  if (!put.ok) throw new Error("Logo upload failed");

  return { logoKey: data.key as string, logoUrl: data.publicUrl as string, logoFileName: file.name };
}

async function presignAndUploadGuidelines(file: File) {
  const res = await fetch("/api/s3/presign-guidelines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type || "application/pdf",
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Guidelines presign failed");

  const put = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/pdf",
    },
    body: file,
  });

  if (!put.ok) {
    const txt = await put.text().catch(() => "");
    throw new Error(`Guidelines upload failed (${put.status}) ${txt}`);
  }

  return {
    brandGuidelinesKey: data.key,
    brandGuidelinesUrl: data.publicUrl,
    brandGuidelinesFileName: file.name,
  };
}


export default function RegisterForm() {
  const router = useRouter();
  const [topError, setTopError] = useState<string | null>(null);

  const form = useForm<RegisterTeamUiInput>({
    resolver: zodResolver(registerTeamUiSchema),
    mode: "onTouched",
    defaultValues: {
      companyName: "",
      email: "",
      managerName: "",
      phone: "",
      captainName: "",
      captainPhone: "",
      players: DEFAULT_PLAYERS,

      // ✅ important: exist in form values
      confirmEmployees: false,
      acceptTerms: false,

      // ✅ will be filled after S3 upload
      logoFileName: "",
      logoKey: "",
      logoUrl: "",

      brandGuidelinesFileName: "",
      brandGuidelinesKey: "",
      brandGuidelinesUrl: "",
    } as any,
  });

  const { control, register, handleSubmit, formState, setValue } = form;
  const { errors, isSubmitting } = formState;
  const { fields } = useFieldArray({ control, name: "players" });

  const onSubmit = handleSubmit(async (values) => {
    setTopError(null);

    try {
      // ✅ upload logo file first (must exist)
      const logoFile = (values as any).logoPng as File | undefined;
      if (!logoFile) throw new Error("Please upload company logo (PNG).");

      const logo = await presignAndUploadLogo(logoFile);

      // ✅ optional guidelines upload
      let guidelines: any = {};
      const guidelinesFile = (values as any).brandGuidelinesPdf as File | undefined;
      if (guidelinesFile) {
        guidelines = await presignAndUploadGuidelines(guidelinesFile);
      }

      // ✅ send ONLY strings to server action (no File objects)
      const payload = {
        companyName: values.companyName,
        email: values.email,
        managerName: values.managerName,
        phone: values.phone,
        captainName: values.captainName,
        captainPhone: values.captainPhone,
        players: values.players,

        confirmEmployees: values.confirmEmployees,
        acceptTerms: values.acceptTerms,

        logoFileName: logo.logoFileName,
        logoKey: logo.logoKey,
        logoUrl: logo.logoUrl,

        brandGuidelinesFileName: guidelines.brandGuidelinesFileName || "",
        brandGuidelinesKey: guidelines.brandGuidelinesKey || "",
        brandGuidelinesUrl: guidelines.brandGuidelinesUrl || "",
      };

      const res = await createTicketAction(payload);
      router.push(`/register/success?token=${encodeURIComponent(res.token)}`);
    } catch (e: any) {
      setTopError(e?.message || "Something went wrong. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {topError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">{topError}</div>
      ) : null}

      <div className="rounded-2xl border border-black/10 bg-white/80 shadow-soft p-6 space-y-4">
        <h2 className="font-display text-2xl text-bootred">Team Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <Label>Company / Team Name</Label>
            <Input {...register("companyName")} />
            <ErrorText>{errors.companyName?.message}</ErrorText>
          </Field>
          <Field>
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
            <ErrorText>{errors.email?.message}</ErrorText>
          </Field>
          <Field>
            <Label>Manager Name</Label>
            <Input {...register("managerName")} />
            <ErrorText>{errors.managerName?.message}</ErrorText>
          </Field>
          <Field>
            <Label>Phone</Label>
            <Input {...register("phone")} />
            <ErrorText>{errors.phone?.message}</ErrorText>
          </Field>
          <Field>
            <Label>Captain Name</Label>
            <Input {...register("captainName")} />
            <ErrorText>{errors.captainName?.message}</ErrorText>
          </Field>
          <Field>
            <Label>Captain Phone</Label>
            <Input {...register("captainPhone")} />
            <ErrorText>{errors.captainPhone?.message}</ErrorText>
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/80 shadow-soft p-6 space-y-4">
        <h2 className="font-display text-2xl text-bootred">Players (10)</h2>
        <div className="space-y-3">
          {fields.map((f, idx) => {
            const pErr = (errors.players?.[idx] ?? {}) as any;
            return (
              <Accordion key={f.id} title={`Player ${idx + 1}`} defaultOpen={idx === 0}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <Label>Full Name</Label>
                    <Input {...register(`players.${idx}.fullName`)} />
                    <ErrorText>{pErr.fullName?.message}</ErrorText>
                  </Field>
                  <Field>
                    <Label>Phone</Label>
                    <Input {...register(`players.${idx}.phone`)} />
                    <ErrorText>{pErr.phone?.message}</ErrorText>
                  </Field>
                  <Field>
                    <Label>Jersey Number</Label>
                    <Input type="number" {...register(`players.${idx}.jerseyNumber`)} />
                    <ErrorText>{pErr.jerseyNumber?.message}</ErrorText>
                  </Field>
                  <Field>
                    <Label>Position</Label>
                    <Input {...register(`players.${idx}.position`)} />
                    <ErrorText>{pErr.position?.message}</ErrorText>
                  </Field>
                  <Field className="md:col-span-2">
                    <Label>Jersey Size</Label>
                    <select
                      className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-bootred/50 focus:ring-2 focus:ring-bootred/10"
                      {...register(`players.${idx}.jerseySize`)}
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                    <ErrorText>{pErr.jerseySize?.message}</ErrorText>
                  </Field>
                </div>
              </Accordion>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/80 shadow-soft p-6 space-y-4">
        <h2 className="font-display text-2xl text-bootred">Brand Uploads</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <Label>Company Logo (PNG) *</Label>
            <Controller
              control={control as any}
              name={"logoPng" as any}
              render={({ field }) => (
                <Input
                  type="file"
                  accept="image/png"
                  onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
                />
              )}
            />
            <ErrorText>{(errors as any).logoPng?.message}</ErrorText>
          </Field>

          <Field>
            <Label>Brand Guidelines (PDF)</Label>
            <Controller
              control={control as any}
              name={"brandGuidelinesPdf" as any}
              render={({ field }) => (
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
                />
              )}
            />
            <ErrorText>{(errors as any).brandGuidelinesPdf?.message}</ErrorText>
          </Field>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 space-y-3">
          {/* ✅ register checkboxes properly */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-black/20 accent-bootred"
              {...register("confirmEmployees")}
            />
            <span className="text-sm text-black/75">I confirm all 10 players are employees of the company.</span>
          </label>
          <ErrorText>{(errors as any).confirmEmployees?.message}</ErrorText>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-black/20 accent-bootred"
              {...register("acceptTerms")}
            />
            <span className="text-sm text-black/75">I agree to the Terms & Conditions.</span>
          </label>
          <ErrorText>{(errors as any).acceptTerms?.message}</ErrorText>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit & Generate Ticket"}
          </Button>
        </div>
      </div>
    </form>
  );
}
