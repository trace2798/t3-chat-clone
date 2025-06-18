import { createFal } from "@ai-sdk/fal";
import { tool } from "ai";
import { z } from "zod";
import { experimental_generateImage as generateImage } from "ai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

const fal = createFal({
  apiKey: process.env.FAL_AI_KEY!,
});

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  //   endpoint: "https://pub-218acdd82f954861a52497ffd9d8edf7.r2.dev",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_KEY_ID!,
  },
});

export const generateImageTool = tool({
  description: "Generate Image using AI",
  parameters: z.object({
    prompt: z.string(),
  }),
  execute: async ({ prompt }) => {
    //console.log("INSIDE TOOL", prompt);
    const { image } = await generateImage({
      model: fal.image("fal-ai/flux-1/schnell"),
      prompt: prompt,
      size: "512x512",
    });
    //console.log("IMAGE Request done");
    const buffer = Buffer.from(image.base64!, "base64");
    //console.log("IMAGE BUFFER", buffer);
    const key = `images/${nanoid()}.png`;
    //console.log("IMAGE Key", key);
    await R2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: "image/png",
      })
    );
    const url = `https://pub-218acdd82f954861a52497ffd9d8edf7.r2.dev/${key}`;
    //console.log("IMAGE URL:", url);
    return {
      url,
      prompt,
    };
  },
});
