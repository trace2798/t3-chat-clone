import { NextResponse } from "next/server";
import { z } from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

// Validate incoming file
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "File type should be JPEG or PNG",
    }),
});

// Cloudflare R2 S3-compatible client
const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_KEY_ID!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file size & type
    const parsed = FileSchema.safeParse({ file });
    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // Extract filename, buffer, and determine contentType
    const filename = (formData.get("file") as File).name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type;

    // Generate a unique key (you can include subfolders)
    const key = `uploads/${nanoid()}-${filename}`;

    // Upload to R2
    // await R2.send(
    //   new PutObjectCommand({
    //     Bucket: process.env.R2_BUCKET_NAME!,
    //     Key: key,
    //     Body: buffer,
    //     ContentType: contentType,
    //     // Optional: set ACL or metadata
    //   })
    // );
    await R2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const url = `https://pub-218acdd82f954861a52497ffd9d8edf7.r2.dev/${key}`;
    return NextResponse.json(
      {
        url,
        pathname: key,
        contentType,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
