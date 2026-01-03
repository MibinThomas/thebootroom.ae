import { pdf } from "@react-pdf/renderer";
import type { TeamPayload } from "@/lib/tickets/types";
import { TicketDoc } from "@/lib/tickets/TicketDoc";
import { makeQrDataUrl } from "@/lib/tickets/qr";
import fs from "node:fs";
import path from "node:path";

function fileToDataUrl(absPath: string, mime: string) {
  const buf = fs.readFileSync(absPath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export async function buildTicketPdfBuffer(team: TeamPayload) {
  const qrValue = `bootroom:team:${team.teamNumber}`; // QR payload parsed by /api/verify

  const qrDataUrl = await makeQrDataUrl(qrValue);

  const publicDir = path.join(process.cwd(), "public");
  const logoPath = path.join(publicDir, "bootroom-logo.png");
  const bannerPath = path.join(publicDir, "ticket-banner.png");

  const logoDataUrl = fs.existsSync(logoPath) ? fileToDataUrl(logoPath, "image/png") : undefined;
  const bannerDataUrl = fs.existsSync(bannerPath) ? fileToDataUrl(bannerPath, "image/png") : undefined;

  const blob = await pdf(<TicketDoc team={team} qrDataUrl={qrDataUrl} logoDataUrl={logoDataUrl} bannerDataUrl={bannerDataUrl} />).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
