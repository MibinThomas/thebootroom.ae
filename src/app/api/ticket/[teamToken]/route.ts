import { NextResponse } from "next/server";
import { getTeamPayloadFromToken, parseToken } from "@/lib/tickets/store";
import { buildTicketPdfBuffer } from "@/lib/tickets/buildTicketPdf";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }:{ params: Promise<{ teamToken: string }> }) {
  const { teamToken } = await params;

  const payload = await parseToken(teamToken);
  if (!payload) return NextResponse.json({ error: "Invalid or tampered token" }, { status: 400 });

  const team = await getTeamPayloadFromToken(teamToken);
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const pdfBuffer = await buildTicketPdfBuffer(team, teamToken);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="bootroom-ticket-${payload.teamNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
