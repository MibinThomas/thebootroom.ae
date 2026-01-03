import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getTeamPayloadByNumber } from "@/lib/tickets/store";
import { buildTicketPdfBuffer } from "@/lib/tickets/buildTicketPdf";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ teamNumber: string }> }) {
  await requireAdmin();
  const { teamNumber } = await params;
  const num = Number(teamNumber);
  if (!Number.isFinite(num)) return NextResponse.json({ error: "Invalid team number" }, { status: 400 });
  const team = getTeamPayloadByNumber(num);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
  const pdfBuffer = await buildTicketPdfBuffer(team);
  return new NextResponse(pdfBuffer, { status: 200, headers: {
    "Content-Type":"application/pdf",
    "Content-Disposition": `inline; filename="bootroom-ticket-${team.teamNumber}.pdf"`,
    "Cache-Control":"no-store",
  }});
}
