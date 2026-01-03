import type { TeamPayload } from "@/lib/tickets/types";
import { dbConnect } from "@/lib/db/mongoose";
import { Team } from "@/lib/db/models/Team";
import { verifyTeamToken, type TeamTokenPayload } from "@/lib/utils/security";

function toPayload(doc: any): TeamPayload {
  return {
    id: String(doc._id),
    teamNumber: doc.teamNumber,
    companyName: doc.companyName,
    email: doc.email,
    managerName: doc.managerName,
    phone: doc.phone,
    captainName: doc.captainName,
    captainPhone: doc.captainPhone,
    players: doc.players,
    logoFileName: doc.logoFileName,
    brandGuidelinesFileName: doc.brandGuidelinesFileName || undefined,
  };
}

export async function createTeam(team: Omit<TeamPayload, "id">) {
  await dbConnect();
  const created = await Team.create(team as any);
  return toPayload(created);
}

export async function getTeamByNumber(teamNumber: number) {
  await dbConnect();
  const doc = await Team.findOne({ teamNumber }).lean();
  return doc ? toPayload(doc) : null;
}

export async function getTeamById(id: string) {
  await dbConnect();
  const doc = await Team.findById(id).lean();
  return doc ? toPayload(doc) : null;
}

export async function listTeams() {
  await dbConnect();
  const docs = await Team.find({}).sort({ teamNumber: -1 }).lean();
  return docs.map(toPayload);
}

export async function getTeamPayloadFromToken(teamToken: string) {
  const payload = verifyTeamToken(teamToken);
  if (!payload) return null;
  return getTeamById(payload.tid);
}

export async function parseToken(teamToken: string): Promise<TeamTokenPayload | null> {
  return verifyTeamToken(teamToken);
}
