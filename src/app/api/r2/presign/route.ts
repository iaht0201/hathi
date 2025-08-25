import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // Một số môi trường cần bật path-style; nếu lỗi, thử bỏ dòng dưới.
  forcePathStyle: true,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  const contentType =
    searchParams.get("contentType") || "application/octet-stream";

  if (!filename) {
    return NextResponse.json({ error: "missing filename" }, { status: 400 });
  }

  // Tạo key (có thể thêm folder, userId, timestamp, v.v.)
  const key = `uploads/${Date.now()}-${filename}`;

  const cmd = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    ContentType: contentType,
  });

  // URL ký cho PUT
  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 }); // 5 phút

  // URL public để truy cập file sau khi upload
  const publicUrl = `${process.env.R2_PUBLIC_BASE}/${encodeURIComponent(key)}`;

  return NextResponse.json({ uploadUrl, key, publicUrl });
}
