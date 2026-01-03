import { NextResponse } from "next/server";
import { verifyTeamToken } from "@/lib/utils/security";
import { getTeamById } from "@/lib/tickets/store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "").trim();

  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const payload = verifyTeamToken(code);
  if (!payload) return NextResponse.json({ error: "Invalid or tampered QR token" }, { status: 400 });

  const team = await getTeamById(payload.tid);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  return NextResponse.json({ team }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
