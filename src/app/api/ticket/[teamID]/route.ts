import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/requireAdminApi";
import { getTeamById } from "@/lib/tickets/store";
import { buildTicketPdfBuffer } from "@/lib/tickets/buildTicketPdf";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  await requireAdminApi();

  const { teamId } = await params;

  const team = await getTeamById(teamId);
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const pdfBuffer = await buildTicketPdfBuffer(team);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="bootroom-ticket-${team.teamNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
