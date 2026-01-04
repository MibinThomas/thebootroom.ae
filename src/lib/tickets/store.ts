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

    // ✅ logo stored in S3
    logoUrl: doc.logoUrl,
    logoKey: doc.logoKey,

    logoFileName: doc.logoFileName,
    brandGuidelinesFileName: doc.brandGuidelinesFileName,

    // ✅ attendance fields
    checkedIn: doc.checkedIn ?? false,
    checkedInAt: doc.checkedInAt ? new Date(doc.checkedInAt).toISOString() : null,
    checkInCount: doc.checkInCount ?? 0,
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

/**
 * ✅ Mark attendance (check-in). Idempotent:
 * - If already checked-in, it will NOT reset time.
 * - It increments checkInCount only on first check-in.
 */
export async function checkInTeamById(id: string) {
  await dbConnect();

  // Only update if not already checked-in
  const updated = await Team.findOneAndUpdate(
    { _id: id, checkedIn: { $ne: true } },
    { $set: { checkedIn: true, checkedInAt: new Date() }, $inc: { checkInCount: 1 } },
    { new: true }
  ).lean();

  // If already checked-in, fetch the current record
  const doc = updated || (await Team.findById(id).lean());
  return doc ? toPayload(doc) : null;
}

/**
 * ✅ Optional: Undo check-in (admin tool)
 */
export async function uncheckInTeamById(id: string) {
  await dbConnect();
  const doc = await Team.findByIdAndUpdate(
    id,
    { $set: { checkedIn: false, checkedInAt: null } },
    { new: true }
  ).lean();

  return doc ? toPayload(doc) : null;
}
