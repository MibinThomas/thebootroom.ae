export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTicketPdf } from '@/lib/pdf';
import fs from 'fs/promises';
import path from 'path';

/**
 * Handle creation of a new team. This route accepts multipart/form-data with
 * textual fields and optional file uploads (logo, guidelines, team photo). It
 * stores uploaded files in the public/uploads directory, writes a ticket PDF
 * to public/tickets, persists the team and players in the database via
 * Prisma, and returns a JSON response indicating success.
 */
export async function POST(request: Request) {
  const formData = await request.formData();
  const teamName = formData.get('teamName')?.toString() || '';
  const companyName = formData.get('companyName')?.toString() || '';
  const companySector = formData.get('companySector')?.toString() || '';
  const companyAddress = formData.get('companyAddress')?.toString() || '';
  const managerName = formData.get('managerName')?.toString() || '';
  const managerEmail = formData.get('managerEmail')?.toString() || '';
  const managerPhone = formData.get('managerPhone')?.toString() || '';
  const captainName = formData.get('captainName')?.toString() || '';
  const captainEmail = formData.get('captainEmail')?.toString() || '';
  const captainPhone = formData.get('captainPhone')?.toString() || '';

  // Collect players from indexed fields
  const players: any[] = [];
  for (let i = 0; i < 10; i++) {
  const name = formData.get(`players[${i}][name]`)?.toString() || "";
  const jerseyNumber = formData.get(`players[${i}][jerseyNumber]`)?.toString() || ""; // ✅ add
  const jerseySize = formData.get(`players[${i}][jerseySize]`)?.toString() || "";
  const preferredPosition =
    formData.get(`players[${i}][preferredPosition]`)?.toString() || "";

  players.push({ name, jerseyNumber, jerseySize, preferredPosition }); // ✅ include
}


  // Ensure directories exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const ticketsDir = path.join(process.cwd(), 'public', 'tickets');
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(ticketsDir, { recursive: true });

  const logoFile = formData.get('logo') as File | null;
  const guidelinesFile = formData.get('guidelines') as File | null;

  async function saveFile(file: File | null): Promise<string | null> {
    if (!file) return null;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Sanitize filename to avoid unsafe characters
    const cleanName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '');
    const fileName = `${crypto.randomUUID()}-${cleanName}`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  }

  const logoUrl = await saveFile(logoFile);
  const guidelinesUrl = await saveFile(guidelinesFile);

  try {
   const team = await prisma.team.create({
  data: {
    teamName,
    companyName,
    companySector,
    companyAddress,
    managerName,
    managerEmail,
    managerPhone,
    captainName,
    captainEmail,
    captainPhone,
    logoUrl: logoUrl || undefined,
    brandGuideUrl: guidelinesUrl || undefined, // ✅ FIXED
    players: {
      create: players
    }
  },
  include: { players: true }
});

// Generate and save PDF ticket
const pdfBuffer = await generateTicketPdf(team);
const ticketName = `${team.id}.pdf`;
const ticketPath = path.join(ticketsDir, ticketName);
await fs.writeFile(ticketPath, pdfBuffer);

const ticketUrl = `/tickets/${ticketName}`;

await prisma.team.update({
  where: { id: team.id },
  data: { ticketPdfUrl: ticketUrl } // ✅ FIXED
});


    return NextResponse.json({ success: true, teamId: team.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}


