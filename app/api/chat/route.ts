import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});
export async function POST(req: Request) {

  try {
    const { messages, selectedChatModel, selectedVisibilityType } =
      await req.json();
    console.log("messages", messages);

    const result = streamText({
      model: openrouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log("Error API", error);
  }
}
