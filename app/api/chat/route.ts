// import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});
export async function POST(req: Request) {
  // const { messages } = await req.json();
  const { message, selectedChatModel, selectedVisibilityType } =
    await req.json();
  console.log("messages", message);
  // const result = streamText({
  //   model: openai("gpt-4o"),
  //   messages,
  // });
  // const result = streamText({
  //   model: openrouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
  //   prompt: messages,
  // });

  // return result.toDataStreamResponse();
  return new Response("Hello, Next.js!");
}
