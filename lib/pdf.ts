import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

/**
 * Generate a PDF ticket for a team using PDFKit. The ticket includes key team
 * details and a QR code containing the team ID to facilitate attendance
 * tracking. The function returns a Buffer containing the PDF data.
 *
 * @param team - The team object including id, name and players.
 */
export async function generateTicketPdf(team: any): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const buffers: Uint8Array[] = [];
  doc.on('data', buffers.push.bind(buffers));

  // Header
  doc
    .fontSize(28)
    .text('The Bootroom Tournament', { align: 'center' })
    .moveDown(0.5);
  doc
    .fontSize(20)
    .text('Team Entry Ticket', { align: 'center' })
    .moveDown(1);

  // Team details
  doc.fontSize(16).text(`Team: ${team.teamName}`);
  doc.text(`Company: ${team.companyName}`);
  doc.text(`Captain: ${team.captainName}`);
  doc.moveDown();
  doc.fontSize(14).text('Players:', { underline: true });
  doc.moveDown(0.2);
  team.players.forEach((player: any, index: number) => {
    // Display player name and jersey size; include preferred position if available
    const positionInfo = player.preferredPosition ? ` (${player.preferredPosition})` : '';
    doc.text(`${index + 1}. ${player.name} - Size ${player.jerseySize}${positionInfo}`);
  });
  doc.moveDown();

  // QR code: encode only the team ID for simplicity. When scanned, this could
  // redirect the user to a route that marks attendance.
  const qrData = JSON.stringify({ teamId: team.id });
  const qrImage = await QRCode.toDataURL(qrData);
  const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');
  doc.image(qrBuffer, { fit: [150, 150], align: 'center' });

  // Footer
  doc.moveDown(1);
  doc.fontSize(10).text('Present this ticket at the venue. Scan the QR code to mark attendance.', {
    align: 'center',
  });
  doc.end();
  return Buffer.concat(buffers.map((b) => Buffer.from(b)));
}