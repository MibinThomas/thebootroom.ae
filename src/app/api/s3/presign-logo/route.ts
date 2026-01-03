import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export const runtime = "nodejs";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export const runtime = "nodejs";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const { fileName, contentType } = await req.json();

  if (!fileName || contentType !== "image/png") {
    return NextResponse.json({ error: "Only PNG allowed" }, { status: 400 });
  }

  const bucket = process.env.AWS_S3_BUCKET!;
  const base = process.env.AWS_S3_PUBLIC_BASE_URL!;
  const id = crypto.randomBytes(8).toString("hex");

  // store under a prefix
  const key = `logos/${Date.now()}-${id}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "")}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: "image/png",
    // If bucket is NOT public, remove this:
    ACL: "public-read",
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  const publicUrl = `${base}/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}

    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const { fileName, contentType } = await req.json();

  if (!fileName || contentType !== "image/png") {
    return NextResponse.json({ error: "Only PNG allowed" }, { status: 400 });
  }

  const bucket = process.env.AWS_S3_BUCKET!;
  const base = process.env.AWS_S3_PUBLIC_BASE_URL!;
  const id = crypto.randomBytes(8).toString("hex");

  // store under a prefix
  const key = `logos/${Date.now()}-${id}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "")}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: "image/png",
    // If bucket is NOT public, remove this:
    ACL: "public-read",
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  const publicUrl = `${base}/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
