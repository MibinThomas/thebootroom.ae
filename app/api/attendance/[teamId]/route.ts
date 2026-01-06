import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: { teamId: string } }
) {
  const updated = await prisma.team.update({
    where: { id: params.teamId },
    data: { attendance: true },
    select: { id: true, teamName: true, attendance: true }
  });

  return NextResponse.json({ success: true, team: updated });
}
