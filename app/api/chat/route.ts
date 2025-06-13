import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";

export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});
export async function POST(req: Request) {
  try {
    const user = await fetchQuery(
      api.users.getUser,
      {},
      { token: await convexAuthNextjsToken() }
    );
    console.log(user);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id: slug, messages } = await req.json();
    // 1) look up internal chatId by slug …
    const chatRecord = await fetchQuery(api.chat.getChatBySlug, { slug });
    if (chatRecord === "Chat not found") {
      return new Response("Chat not found", { status: 404 });
    }
    const chatId = chatRecord._id;

    // 2) get the last message object
    const [lastMessage] = messages.slice(-1);
    if (!lastMessage) {
      return new Response("No message provided", { status: 400 });
    }

    // 3) save it
    await fetchMutation(api.message.saveMessage, {
      chatId,
      userId: user._id,
      model: "deepseek/deepseek-r1-0528:free",
      role: lastMessage.role,
      search_web: false,
      usage: lastMessage.usage,
      content: lastMessage.content,
      parts: lastMessage.parts,
      timestamp: Date.now(),
    });

    // 4) stream the AI response
    const result = streamText({
      model: openrouter.chat("deepseek/deepseek-r1-0528:free"),
      messages,
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error API", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
