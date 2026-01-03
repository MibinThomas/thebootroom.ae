"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerTeamUiSchema,
  type RegisterTeamUiInput,
} from "@/lib/validators/registerTeamUiSchema";
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

type PresignResponse =
  | { uploadUrl: string; publicUrl: string; key: string }
  | { error: string };

export default function RegisterForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    } as any,
  });

  const { control, register, handleSubmit, formState, setValue } = form;
  const { errors, isSubmitting } = formState;
  const { fields } = useFieldArray({ control, name: "players" });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      // 1) Get the selected logo file (PNG)
      const logoFile = (values as any).logoPng as File | undefined;
      if (!logoFile) {
        setSubmitError("Please upload the company logo (PNG).");
        return;
      }
      if (logoFile.type !== "image/png") {
        setSubmitError("Company logo must be a PNG file.");
        return;
      }

      // 2) Ask server for a presigned URL
      const presignRes = await fetch("/api/s3/presign-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: logoFile.name,
          contentType: logoFile.type,
        }),
      });

      const presignData = (await presignRes.json()) as PresignResponse;
      if (!presignRes.ok || "error" in presignData) {
        setSubmitError(
          "error" in presignData
            ? presignData.error
            : "Failed to get upload URL."
        );
        return;
      }

      // 3) Upload the file directly to S3 using PUT
      const putRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/png" },
        body: logoFile,
      });

      if (!putRes.ok) {
        setSubmitError("Logo upload failed. Please try again.");
        return;
      }

      // 4) Call the server action WITHOUT file objects
      // IMPORTANT: We must not send File() to server action to avoid 413 limits.
      const payload = {
        companyName: values.companyName,
        email: values.email,
        managerName: values.managerName,
        phone: values.phone,
        captainName: values.captainName,
        captainPhone: values.captainPhone,
        players: values.players,

        // ✅ store logo location in DB
        logoUrl: presignData.publicUrl,
        logoKey: presignData.key,
        logoFileName: logoFile.name,

        // optional: brand guideline file name only (you can later add S3 upload similarly)
        brandGuidelinesFileName: (values as any).brandGuidelinesPdf?.name,
      };

      const res = await createTicketAction(payload as any);
      router.push(`/register/success?token=${encodeURIComponent(res.token)}`);
    } catch (e: any) {
      setSubmitError(e?.message || "Something went wrong. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {submitError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
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
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-black/20 accent-bootred"
              onChange={(e) =>
                setValue("confirmEmployees" as any, e.target.checked as any, {
                  shouldValidate: true,
                })
              }
            />
            <span className="text-sm text-black/75">
              I confirm all 10 players are employees of the company.
            </span>
          </label>
          <ErrorText>{(errors as any).confirmEmployees?.message}</ErrorText>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-black/20 accent-bootred"
              onChange={(e) =>
                setValue("acceptTerms" as any, e.target.checked as any, {
                  shouldValidate: true,
                })
              }
            />
            <span className="text-sm text-black/75">
              I agree to the Terms & Conditions.
            </span>
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
