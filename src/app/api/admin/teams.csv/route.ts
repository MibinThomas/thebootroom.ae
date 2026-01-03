import { NextResponse } from "next/server";
import { listTeams } from "@/lib/tickets/store";
import { requireAdmin } from "@/lib/admin/requireAdmin";
export const runtime = "nodejs";

function csvEscape(v: any) {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes("\n") || s.includes("\"")) return `"${s.replace(/"/g,'""')}"`;
  return s;
}

export async function GET() {
  await requireAdmin();
  const teams = listTeams();
  const header = ["teamNumber","companyName","email","managerName","phone","captainName","captainPhone","playersCount"];
  const rows = teams.map(t => [t.teamNumber,t.companyName,t.email,t.managerName,t.phone,t.captainName,t.captainPhone,t.players.length]);
  const csv = [header,...rows].map(r => r.map(csvEscape).join(",")).join("\n");
  return new NextResponse(csv, { status: 200, headers: {
    "Content-Type":"text/csv; charset=utf-8",
    "Content-Disposition": 'attachment; filename="bootroom-teams.csv"',
    "Cache-Control":"no-store"
  }});
}
