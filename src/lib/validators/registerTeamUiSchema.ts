import { z } from "zod";
const fileSchema = z.instanceof(File);
const logoPngSchema = fileSchema.refine(f=>f.type==="image/png","Logo must be a PNG file").refine(f=>f.size<=5*1024*1024,"Logo must be under 5MB");
const guidelinePdfSchema = fileSchema.refine(f=>f.type==="application/pdf","Brand guidelines must be a PDF").refine(f=>f.size<=10*1024*1024,"Brand guidelines must be under 10MB");

export const playerSchema = z.object({
  fullName: z.string().min(2,"Full name is required"),
  jerseyNumber: z.coerce.number().int().min(1).max(99),
  position: z.string().min(2,"Position is required"),
  jerseySize: z.enum(["S","M","L","XL","XXL"]),
  phone: z.string().min(7,"Phone is required"),
});

export const registerTeamUiSchema = z.object({
  companyName: z.string().min(2),
  email: z.string().email(),
  managerName: z.string().min(2),
  phone: z.string().min(7),
  captainName: z.string().min(2),
  captainPhone: z.string().min(7),
  players: z.array(playerSchema).length(10,"Exactly 10 players are required"),
  logoPng: logoPngSchema,
  brandGuidelinesPdf: guidelinePdfSchema.optional(),
  confirmEmployees: z.literal(true, { errorMap:()=>({message:"Please confirm players are employees"}) }),
  acceptTerms: z.literal(true, { errorMap:()=>({message:"You must accept the terms & conditions"}) }),
});
export type RegisterTeamUiInput = z.infer<typeof registerTeamUiSchema>;
