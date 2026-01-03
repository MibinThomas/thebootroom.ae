"use server";

import { registerTeamUiSchema } from "@/lib/validators/registerTeamUiSchema";
import type { TeamPayload } from "@/lib/tickets/types";
import { dbConnect } from "@/lib/db/mongoose";
import { Team } from "@/lib/db/models/Team";
import { signTeamToken } from "@/lib/utils/security";

async function nextTeamNumber() {
  const last = await Team.findOne({}, { teamNumber: 1 }).sort({ teamNumber: -1 }).lean();
  return (last?.teamNumber ?? 1000) + 1;
}

export async function createTicketAction(raw: unknown) {
  const data = registerTeamUiSchema.parse(raw);

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
    logoFileName: data.logoPng.name,
    brandGuidelinesFileName: data.brandGuidelinesPdf?.name,
  };

  const created = await Team.create(teamData as any);
  const token = signTeamToken({ tid: String(created._id), teamNumber, iat: Date.now() });

  return { token, teamNumber };
}
