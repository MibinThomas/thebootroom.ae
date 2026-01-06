import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Admin endpoint to list all teams. Returns a simplified set of fields
 * necessary for the dashboard. Files are included as their URL paths.
 */
export async function GET() {
  const teams = await prisma.team.findMany({
    include: { players: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({
    teams: teams.map((team) => ({
      id: team.id,
      teamName: team.teamName,
      companyName: team.companyName,
      attendance: team.attendance,
      ticketUrl: team.ticketUrl ?? null,
      brandGuidelinesUrl: team.brandGuidelinesUrl ?? null,
      logoUrl: team.logoUrl ?? null,
    })),
  });
}