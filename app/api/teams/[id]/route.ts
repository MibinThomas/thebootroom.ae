import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const team = await prisma.team.findUnique({
    where: { id: params.id },
    select: { id: true, ticketPdfUrl: true, teamName: true, companyName: true },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(team);
}
