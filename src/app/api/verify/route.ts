import { NextResponse } from "next/server";
import { getTeamPayloadByNumber } from "@/lib/tickets/store";

export const runtime = "nodejs";

function parseTeamNumber(code: string): number | null {
  const v = code.trim();
  if (!v) return null;

  // Format: bootroom:team:1001
  const m = /^bootroom:team:(\d+)$/i.exec(v);
  if (m?.[1]) return Number(m[1]);

  // Allow raw number
  if (/^\d+$/.test(v)) return Number(v);

  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") || "";

  const teamNumber = parseTeamNumber(code);
  if (!teamNumber || !Number.isFinite(teamNumber)) {
    return NextResponse.json({ error: "Invalid code format" }, { status: 400 });
  }

  const team = getTeamPayloadByNumber(teamNumber);
  if (!team) {
    return NextResponse.json({ error: "Team not found (dev store cleared or invalid code)" }, { status: 404 });
  }

  return NextResponse.json({ team }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
