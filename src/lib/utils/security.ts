import crypto from "crypto";
function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function b64urlDecode(input: string) {
  const pad = 4 - (input.length % 4 || 4);
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(base64, "base64");
}
export type TeamTokenPayload = { teamNumber: number; iat: number };
export function signTeamToken(payload: TeamTokenPayload) {
  const secret = process.env.TICKET_SIGNING_SECRET;
  if (!secret) throw new Error("TICKET_SIGNING_SECRET is not set");
  const header = { alg: "HS256", typ: "JWT" };
  const encHeader = b64url(JSON.stringify(header));
  const encPayload = b64url(JSON.stringify(payload));
  const data = `${encHeader}.${encPayload}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest();
  return `${data}.${b64url(sig)}`;
}
export function verifyTeamToken(token: string): TeamTokenPayload | null {
  const secret = process.env.TICKET_SIGNING_SECRET;
  if (!secret) throw new Error("TICKET_SIGNING_SECRET is not set");
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encHeader, encPayload, encSig] = parts;
  const data = `${encHeader}.${encPayload}`;
  const expectedSig = crypto.createHmac("sha256", secret).update(data).digest();
  if (b64url(expectedSig) !== encSig) return null;
  try {
    const payload = JSON.parse(b64urlDecode(encPayload).toString("utf8"));
    if (typeof payload.teamNumber !== "number" || typeof payload.iat !== "number") return null;
    return payload;
  } catch { return null; }
}
