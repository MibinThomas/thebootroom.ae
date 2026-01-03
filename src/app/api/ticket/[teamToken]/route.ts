import { NextResponse } from "next/server";
import { getTeamPayloadFromToken } from "@/lib/tickets/store";
import { buildTicketPdfBuffer } from "@/lib/tickets/buildTicketPdf";
export const runtime = "nodejs";
export async function GET(_req: Request, { params }:{ params: Promise<{ teamToken: string }> }) {
  const { teamToken } = await params;
  const team = getTeamPayloadFromToken(teamToken);
  if (!team) return NextResponse.json({ error: "Ticket not found (token invalid or expired in dev store)." }, { status: 404 });
  const pdfBuffer = await buildTicketPdfBuffer(team);
  return new NextResponse(pdfBuffer, { status: 200, headers: {
    "Content-Type":"application/pdf",
    "Content-Disposition": `inline; filename="bootroom-ticket-${team.teamNumber}.pdf"`,
    "Cache-Control":"no-store",
  }});
}
