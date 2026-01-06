import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

/**
 * Fetch a single team by ID, including its players. If the team is not
 * found, returns a 404 response.
 */
export async function GET(request: Request, { params }: Params) {
  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: { players: true },
  });
  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }
  return NextResponse.json({ team });
}

/**
 * Update a team record. Currently used to toggle attendance from the admin
 * dashboard. Accepts a JSON payload with an `attendance` boolean.
 */
export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const attendance = body.attendance ?? false;
  const team = await prisma.team.update({
    where: { id: params.id },
    data: { attendance },
  });
  return NextResponse.json({ team });
}