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
    const body = await req.json();
    const fileName = String(body.fileName || "guidelines.pdf");
    const contentType = String(body.contentType || "application/pdf");

    if (contentType !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF allowed" }, { status: 400 });
    }

    const rand = crypto.randomBytes(16).toString("hex");
    const key = `guidelines/${Date.now()}-${rand}.pdf`;

    const cmd = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: contentType,
      // ✅ DO NOT set ACL (bucket has ACLs disabled)
    });

    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 });

    // This is a "regular" object URL (may not be public if bucket is private)
    const publicBase = process.env.AWS_S3_PUBLIC_BASE_URL!;
    const publicUrl = `${publicBase}/${key}`;

    return NextResponse.json({ uploadUrl, key, publicUrl });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to presign", details: e?.message || "unknown" },
      { status: 500 }
    );
  }
}
