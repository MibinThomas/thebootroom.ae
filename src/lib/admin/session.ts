// src/lib/admin/session.ts
const textEncoder = new TextEncoder();

function b64url(input: ArrayBuffer | Uint8Array) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64urlJson(obj: any) {
  const json = JSON.stringify(obj);
  return b64url(textEncoder.encode(json));
}

function b64urlDecodeToString(input: string) {
  const pad = input.length % 4 ? "=".repeat(4 - (input.length % 4)) : "";
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function hmacSha256(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, textEncoder.encode(data));
}

export async function signAdminSession(payload: any) {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) throw new Error("ADMIN_AUTH_SECRET is not set");

  const header = { alg: "HS256", typ: "JWT" };
  const encHeader = b64urlJson(header);
  const encPayload = b64urlJson(payload);
  const data = `${encHeader}.${encPayload}`;
  const sig = await hmacSha256(secret, data);

  return `${data}.${b64url(sig)}`;
}

export async function verifyAdminSession(token: string) {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) throw new Error("ADMIN_AUTH_SECRET is not set");

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encHeader, encPayload, encSig] = parts;
  const data = `${encHeader}.${encPayload}`;

  const expected = await hmacSha256(secret, data);
  if (b64url(expected) !== encSig) return null;

  try {
    return JSON.parse(b64urlDecodeToString(encPayload));
  } catch {
    return null;
  }
}
