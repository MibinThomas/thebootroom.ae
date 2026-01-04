import { NextResponse } from "next/server";
import { verifyTeamToken } from "@/lib/utils/security";
import { getTeamById, checkInTeamById } from "@/lib/tickets/store";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // ✅ must be admin
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "").trim();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const payload = verifyTeamToken(code);
  if (!payload) return NextResponse.json({ error: "Invalid or tampered QR token" }, { status: 400 });

  const team = await getTeamById(payload.tid);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  return NextResponse.json({ team }, { status: 200, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  // ✅ must be admin
  await requireAdmin();

  const body = await req.json().catch(() => ({}));
  const code = String(body?.code || "").trim();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const payload = verifyTeamToken(code);
  if (!payload) return NextResponse.json({ error: "Invalid or tampered QR token" }, { status: 400 });

  // ✅ check-in (idempotent)
  const team = await checkInTeamById(payload.tid);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  return NextResponse.json(
    {
      ok: true,
      team,
      checkedIn: team.checkedIn ?? false,
      checkedInAt: team.checkedInAt ?? null,
      checkInCount: team.checkInCount ?? 0,
    },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
