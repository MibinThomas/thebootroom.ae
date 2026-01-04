import { z } from "zod";

const playerSchema = z.object({
  fullName: z.string().min(1, "Player name required"),
  phone: z.string().min(1, "Phone required"),
  jerseyNumber: z.coerce.number().int().min(0),
  position: z.string().min(1, "Position required"),
  jerseySize: z.enum(["S", "M", "L", "XL", "XXL"]),
});

export const registerTeamUiSchema = z.object({
  companyName: z.string().min(1),
  email: z.string().email(),
  managerName: z.string().min(1),
  phone: z.string().min(1),
  captainName: z.string().min(1),
  captainPhone: z.string().min(1),
  players: z.array(playerSchema).length(10),

  // ✅ CLIENT ONLY (browser file inputs)
  // Do NOT validate with instanceof File because server action runs in Node.
  logoPng: z.any().optional(),
  brandGuidelinesPdf: z.any().optional(),

  // checkboxes
  confirmEmployees: z.boolean().refine((v) => v === true, "Please confirm players are employees"),
  acceptTerms: z.boolean().refine((v) => v === true, "You must accept the terms & conditions"),
});

export type RegisterTeamUiInput = z.infer<typeof registerTeamUiSchema>;

/**
 * ✅ SERVER payload schema (what you send to createTicketAction)
 * Only strings (S3 results), no File objects.
 */
export const registerTeamServerSchema = z.object({
  companyName: z.string().min(1),
  email: z.string().email(),
  managerName: z.string().min(1),
  phone: z.string().min(1),
  captainName: z.string().min(1),
  captainPhone: z.string().min(1),
  players: z.array(playerSchema).length(10),

  // ✅ REQUIRED: logo stored in S3 already
  logoFileName: z.string().min(1),
  logoKey: z.string().min(1),
  logoUrl: z.string().min(1),

  // ✅ OPTIONAL: guidelines
  brandGuidelinesFileName: z.string().optional().default(""),
  brandGuidelinesKey: z.string().optional().default(""),
  brandGuidelinesUrl: z.string().optional().default(""),

  confirmEmployees: z.literal(true),
  acceptTerms: z.literal(true),
});

export type RegisterTeamServerInput = z.infer<typeof registerTeamServerSchema>;
