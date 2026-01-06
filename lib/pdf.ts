import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path from "path";

const logoPath = path.join(process.cwd(), "public", "logo.png");


type Player = {
  name: string;
  preferredPosition: string;
  jerseySize: string;
  jerseyNumber?: string | null;
};

type TeamForTicket = {
  id: string;
  teamName: string;
  companyName: string;
  managerName: string;
  managerPhone: string;
  captainName: string;
  captainPhone: string;
  createdAt?: Date;
  players: Player[];
};

function toBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

export async function generateTicketPdf(team: TeamForTicket) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
    info: {
      Title: `BootRoom Ticket - ${team.teamName}`,
      Author: "The BootRoom",
    },
  });

  // Colors (theme)
  const RED = "#C62d32";
  const YELLOW = "#f8bb13";
  const ORANGE = "#E68302";
  const DARK = "#111827";

  // Background header bar
  doc.save();
  doc.rect(0, 0, doc.page.width, 140).fill(RED);
  doc.restore();

  // Title
  doc.image(logoPath, {
  fit: [180, 80],      // control logo size
  align: "center",
  valign: "top",
  x: (doc.page.width - 180) / 2,
  y: 30,
});
  doc.fillColor("#b9b4b4ff").fontSize(16).text("TEAM ENTRY TICKET", 40, 85, { align: "center" });

  // Ticket meta box
  doc.roundedRect(40, 160, 515, 110, 10).fill("#FFF7ED").stroke(ORANGE);
  doc.fillColor(DARK).fontSize(12);

  const leftX = 60;
  const rightX = 320;
  const topY = 175;

  doc.text(`Team Name: ${team.teamName}`, leftX, topY);
  doc.text(`Company: ${team.companyName}`, leftX, topY + 20);
  doc.text(`Captain: ${team.captainName}`, leftX, topY + 40);
  doc.text(`Captain Phone: ${team.captainPhone}`, leftX, topY + 60);

  doc.text(`Manager: ${team.managerName}`, rightX, topY);
  doc.text(`Manager Phone: ${team.managerPhone}`, rightX, topY + 20);
  doc.text(`Ticket ID: ${team.id}`, rightX, topY + 40);
  doc.text(`Players: ${team.players?.length ?? 0}/10`, rightX, topY + 60);

  // QR Code (points to scan page)
  const scanUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/scan/${team.id}`;
  const qrDataUrl = await QRCode.toDataURL(scanUrl, { margin: 1, scale: 6 });
  const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, "");
  const qrBuffer = Buffer.from(qrBase64, "base64");
  

  // QR block
  doc.roundedRect(420, 285, 135, 160, 10).fill("#ffffff").stroke(ORANGE);
  doc.image(qrBuffer, 440, 305, { width: 95 });
  doc.fillColor(DARK).fontSize(10).text("Scan at entry\nto mark attendance", 420, 410, {
    width: 135,
    align: "center",
  });

  // Players table title
 // Players table title
doc.fillColor(RED).fontSize(14).text("PLAYER LIST", 40, 290);

/**
 * TABLE (same design)
 * New columns: No | Player Name | Position | Jersey No | Jersey(Size)
 */
const tableTop = 320;
const tableX = 40;
const tableW = 360;

// Table header bar
doc.roundedRect(tableX, tableTop, tableW, 28, 6).fill(RED);
doc.fillColor(YELLOW).fontSize(11);

// Column x-positions inside the 360px table
const colNoX = 55;
const colNameX = 90;
const colPosX = 235;
const colJNoX = 305;   // ✅ NEW
const colSizeX = 360;  // (size moved a bit right)

// Headers
doc.text("No.", colNoX, tableTop + 8);
doc.text("Player Name", colNameX, tableTop + 8);
doc.text("Position", colPosX, tableTop + 8);
doc.text("Jersey No", colJNoX, tableTop + 8);   // ✅ NEW
doc.text("Jersey", colSizeX, tableTop + 8);     // size

// Table rows
doc.fillColor(DARK).fontSize(11);
const rowH = 26;
let y = tableTop + 35;

team.players.slice(0, 10).forEach((p, idx) => {
  doc
    .roundedRect(tableX, y - 6, tableW, 24, 4)
    .fill(idx % 2 === 0 ? "#FFF7ED" : "#ffffff")
    .stroke("#F3E8D3");

  doc.fillColor(DARK);

  doc.text(String(idx + 1), colNoX, y);

  doc.text(p.name || "-", colNameX, y, { width: 135 });

  doc.text(p.preferredPosition || "-", colPosX, y, { width: 65 });

  // ✅ NEW: jersey number
  doc.text((p.jerseyNumber ?? "-").toString(), colJNoX, y, { width: 50 });

  // jersey size
  doc.text(p.jerseySize || "-", colSizeX, y);

  y += rowH;
});


  // Footer
  doc.fillColor("#6B7280").fontSize(9).text(
    "Please carry this ticket to the venue. QR scan will confirm your team entry and mark attendance.",
    40,
    750,
    { width: 515, align: "center" }
  );

  return await toBuffer(doc);
}
