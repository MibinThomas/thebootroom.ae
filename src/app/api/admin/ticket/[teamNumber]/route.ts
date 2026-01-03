import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { dbConnect } from "@/lib/db/mongoose";
import { Team } from "@/lib/db/models/Team";
import { signTeamToken } from "@/lib/utils/security";
import { buildTicketPdfBuffer } from "@/lib/tickets/buildTicketPdf";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ teamNumber: string }> }) {
  await requireAdmin();
  const { teamNumber } = await params;
  const num = Number(teamNumber);
  if (!Number.isFinite(num)) return NextResponse.json({ error: "Invalid team number" }, { status: 400 });

  await dbConnect();
  const doc = await Team.findOne({ teamNumber: num }).lean();
  if (!doc) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const teamPayload = {
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

  const teamToken = signTeamToken({ tid: String(doc._id), teamNumber: doc.teamNumber, iat: Date.now() });
  const pdfBuffer = await buildTicketPdfBuffer(teamPayload as any, teamToken);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="bootroom-ticket-${doc.teamNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
