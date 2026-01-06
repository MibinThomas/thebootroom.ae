import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Endpoint to mark attendance for a team. Expects a JSON body with teamId.
 * This route can be called when scanning a QR code from a ticket; it sets
 * the team's attendance to true.
 */
export async function POST(request: Request) {
  const { teamId } = await request.json();
  if (!teamId) {
    return NextResponse.json({ error: 'Missing teamId' }, { status: 400 });
  }
  try {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: { attendance: true },
    });
    return NextResponse.json({ team });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 });
  }
}