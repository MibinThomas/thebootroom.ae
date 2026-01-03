import { NextResponse } from "next/server";
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
  try {
    const { fileName, contentType } = await req.json();

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }
    if (contentType !== "image/png") {
      return NextResponse.json({ error: "Only PNG allowed" }, { status: 400 });
    }

    const bucket = process.env.AWS_S3_BUCKET!;
    const baseUrl = process.env.AWS_S3_PUBLIC_BASE_URL!;
    if (!bucket || !baseUrl) {
      return NextResponse.json(
        { error: "Missing AWS_S3_BUCKET or AWS_S3_PUBLIC_BASE_URL" },
        { status: 500 }
      );
    }

    const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, "");
    const id = crypto.randomBytes(8).toString("hex");
    const key = `logos/${Date.now()}-${id}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: "image/png",

      // If your bucket is public for these uploads, keep this:
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const publicUrl = `${baseUrl}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to presign upload url" },
      { status: 500 }
    );
  }
}
