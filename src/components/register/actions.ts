"use server";
import { registerTeamUiSchema } from "@/lib/validators/registerTeamUiSchema";
import { putTeamPayload } from "@/lib/tickets/store";
import type { TeamPayload } from "@/lib/tickets/types";
import { signTeamToken } from "@/lib/utils/security";

let teamCounter = 1000;

export async function createTicketAction(raw: unknown) {
  const data = registerTeamUiSchema.parse(raw);
  teamCounter += 1;
  const team: TeamPayload = {
    teamNumber: teamCounter,
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
  putTeamPayload(team);
  const token = signTeamToken({ teamNumber: team.teamNumber, iat: Date.now() });
  return { token, teamNumber: team.teamNumber };
}
