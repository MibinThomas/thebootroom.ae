"use server";

import { z } from "zod";
import type { TeamPayload } from "@/lib/tickets/types";
import { dbConnect } from "@/lib/db/mongoose";
import { Team } from "@/lib/db/models/Team";
import { signTeamToken } from "@/lib/utils/security";

/**
 * Server-safe schema (NO File objects).
 * The client uploads PNG to S3 first, then sends logoUrl/logoKey/logoFileName here.
 */
const registerTeamSubmitSchema = z.object({
  companyName: z.string().min(1, "Company / Team Name is required"),
  email: z.string().email("Valid email is required"),
  managerName: z.string().min(1, "Manager Name is required"),
  phone: z.string().min(5, "Phone is required"),
  captainName: z.string().min(1, "Captain Name is required"),
  captainPhone: z.string().min(5, "Captain Phone is required"),

  players: z
    .array(
      z.object({
        fullName: z.string().min(1, "Full Name is required"),
        jerseyNumber: z.coerce.number().min(0),
        position: z.string().min(1, "Position is required"),
        jerseySize: z.enum(["S", "M", "L", "XL", "XXL"]),
        phone: z.string().min(5, "Phone is required"),
      })
    )
    .length(10, "Exactly 10 players are required"),

  // ✅ from S3 presigned upload step
  logoUrl: z.string().url("Logo URL is required"),
  logoKey: z.string().min(1, "Logo key is required"),
  logoFileName: z.string().min(1, "Logo filename is required"),

  // Optional (currently only saving name)
  brandGuidelinesFileName: z.string().optional(),
});

async function nextTeamNumber() {
  const last = await Team.findOne({}, { teamNumber: 1 }).sort({ teamNumber: -1 }).lean();
  return (last?.teamNumber ?? 1000) + 1;
}

export async function createTicketAction(raw: unknown) {
  const data = registerTeamSubmitSchema.parse(raw);

  await dbConnect();
  const teamNumber = await nextTeamNumber();

  // IMPORTANT:
  // Your Team mongoose schema must include `logoUrl` and `logoKey` fields.
  const teamData: Omit<TeamPayload, "id"> & { logoUrl: string; logoKey: string } = {
    teamNumber,
    companyName: data.companyName,
    email: data.email,
    managerName: data.managerName,
    phone: data.phone,
    captainName: data.captainName,
    captainPhone: data.captainPhone,
    players: data.players,

    // ✅ store logo info
    logoUrl: data.logoUrl,
    logoKey: data.logoKey,
    logoFileName: data.logoFileName,

    brandGuidelinesFileName: data.brandGuidelinesFileName,
  };

  const created = await Team.create(teamData as any);

  // Signed QR token contains MongoDB id (tid) + teamNumber
  const token = signTeamToken({ tid: String(created._id), teamNumber, iat: Date.now() });

  return { token, teamNumber };
}
