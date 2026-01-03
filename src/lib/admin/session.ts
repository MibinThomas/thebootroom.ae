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
type SessionPayload = { email: string; iat: number };
export function createAdminSession(payload: { email: string }) {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) throw new Error("ADMIN_AUTH_SECRET is not set");
  const data: SessionPayload = { email: payload.email, iat: Date.now() };
  const encPayload = b64url(JSON.stringify(data));
  const sig = crypto.createHmac("sha256", secret).update(encPayload).digest();
  return `${encPayload}.${b64url(sig)}`;
}
export function verifyAdminSession(token?: string | null) {
  if (!token) return null;
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) throw new Error("ADMIN_AUTH_SECRET is not set");
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encPayload, encSig] = parts;
  const expectedSig = crypto.createHmac("sha256", secret).update(encPayload).digest();
  if (b64url(expectedSig) !== encSig) return null;
  try {
    const payload = JSON.parse(b64urlDecode(encPayload).toString("utf8")) as SessionPayload;
    if (typeof payload.email !== "string") return null;
    return payload;
  } catch { return null; }
}
