"use server";

import { registerTeamServerSchema } from "@/lib/validators/registerTeamUiSchema";
import type { TeamPayload } from "@/lib/tickets/types";
import { dbConnect } from "@/lib/db/mongoose";
import { Team } from "@/lib/db/models/Team";
import { signTeamToken } from "@/lib/utils/security";

async function nextTeamNumber() {
  const last = await Team.findOne({}, { teamNumber: 1 }).sort({ teamNumber: -1 }).lean();
  return (last?.teamNumber ?? 1000) + 1;
}

export async function createTicketAction(raw: unknown) {
  // ✅ IMPORTANT: parse SERVER payload (strings only)
  const data = registerTeamServerSchema.parse(raw);

  await dbConnect();
  const teamNumber = await nextTeamNumber();

  const teamData: Omit<TeamPayload, "id"> = {
    teamNumber,
    companyName: data.companyName,
    email: data.email,
    managerName: data.managerName,
    phone: data.phone,
    captainName: data.captainName,
    captainPhone: data.captainPhone,
    players: data.players,

    // ✅ logo (top level)
    logoFileName: data.logoFileName,
    logoKey: data.logoKey,
    logoUrl: data.logoUrl,

    // ✅ guidelines (top level optional)
    brandGuidelinesFileName: data.brandGuidelinesFileName || "",
  };

  const created = await Team.create({
    ...teamData,
    // store these too if your model has them (recommended)
    brandGuidelinesKey: data.brandGuidelinesKey || "",
    brandGuidelinesUrl: data.brandGuidelinesUrl || "",
  } as any);

  const token = signTeamToken({ tid: String(created._id), teamNumber, iat: Date.now() });
  return { token, teamNumber };
}
