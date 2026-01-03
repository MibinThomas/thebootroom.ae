import { z } from "zod";

export const registerTeamSubmitSchema = z.object({
  companyName: z.string().min(1),
  email: z.string().email(),
  managerName: z.string().min(1),
  phone: z.string().min(5),
  captainName: z.string().min(1),
  captainPhone: z.string().min(5),

  players: z.array(
    z.object({
      fullName: z.string().min(1),
      jerseyNumber: z.number(),
      position: z.string().min(1),
      jerseySize: z.enum(["S", "M", "L", "XL", "XXL"]),
      phone: z.string().min(5),
    })
  ).length(10),

  logoUrl: z.string().url(),
  logoKey: z.string().min(1),
  logoFileName: z.string().min(1),

  brandGuidelinesFileName: z.string().optional(),
});
