import { createDocumentHandler } from "@/lib/artifacts/server";
import { createFal } from "@ai-sdk/fal";
import { experimental_generateImage } from "ai";

const fal = createFal({
  apiKey: process.env.FAL_AI_KEY!,
});

export const imageDocumentHandler = createDocumentHandler<"image">({
  kind: "image",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const { image } = await experimental_generateImage({
      // model: myProvider.imageModel('small-model'),
      model: fal.image("fal-ai/flux-1/schnell"),
      prompt: title,
      n: 1,
    });

    draftContent = image.base64;

    dataStream.writeData({
      type: "image-delta",
      content: image.base64,
    });

    return draftContent;
  },
  onUpdateDocument: async ({ description, dataStream }) => {
    let draftContent = "";

    const { image } = await experimental_generateImage({
      model: fal.image("fal-ai/flux-1/schnell"),
      prompt: description,
      n: 1,
    });

    draftContent = image.base64;

    dataStream.writeData({
      type: "image-delta",
      content: image.base64,
    });

    return draftContent;
  },
});
