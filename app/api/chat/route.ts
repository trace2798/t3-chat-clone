import { api } from "@/convex/_generated/api";
import { getTrailingMessageId } from "@/lib/utils";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  appendClientMessage,
  appendResponseMessages,
  Attachment,
  createDataStream,
  extractReasoningMiddleware,
  smoothStream,
  streamText,
  UIMessage,
  wrapLanguageModel,
} from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { Doc } from "@/convex/_generated/dataModel";
import { systemPrompt, type RequestHints } from "@/lib/ai/prompts";
import { ChatSDKError } from "@/lib/errors";
import { createTogetherAI } from "@ai-sdk/togetherai";
import { generateImageTool } from "@/lib/ai/tools/generate-image-tool";
import { geolocation } from "@vercel/functions";
import { getSearchResultsTool } from "@/lib/ai/tools/get-search-results";

type DBMessage = Doc<"message">;
export const maxDuration = 60;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const togetherai = createTogetherAI({
  apiKey: process.env.TOGETHER_AI_API ?? "",
});

export async function POST(req: Request) {
  try {
    console.group("API → POST /api/chat");
    const user = await fetchQuery(
      api.users.getUser,
      {},
      { token: await convexAuthNextjsToken() }
    );

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const {
      id: slug,
      selectedChatModel,
      message,
      searchWeb,
      generateImage,
    } = await req.json();
    console.log("search_web testing", searchWeb);
    console.log("data FROM FE");
    console.log("SLUG FE", slug);
    console.log("selectedChatModel FE", selectedChatModel);
    console.log("message FE", message);
    console.log("generateImage FE", generateImage);
    const chatRecord = await fetchQuery(api.chat.getChatBySlug, { slug });
    if (!chatRecord) {
      return new Response("Chat not found", { status: 404 });
    }
    if (chatRecord.isArchived) {
      return new Response("Chat is archived", { status: 400 });
    }
    if (chatRecord.isDeleted) {
      return new Response("Chat is deleted", { status: 400 });
    }
    if (chatRecord.userId !== user._id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const chatId = chatRecord._id;

    const lastMessage = message;
    if (!lastMessage) {
      console.error("No message provided");
      return new Response("No message provided", { status: 400 });
    }

    const dbMessages = await fetchQuery(api.message.getLast10Messages, {
      chatId: chatId,
    });

    const convertToUIMessages = (msgs: DBMessage[]): UIMessage[] =>
      msgs.map((m) => ({
        id: m._id,
        parts: m.parts as UIMessage["parts"],
        role: m.role as UIMessage["role"],
        content: "",
        createdAt: new Date(m._creationTime),
        experimental_attachments: (m.attachments as Attachment[]) || [],
      }));

    const uiFromDB = dbMessages ? convertToUIMessages(dbMessages) : [];
    // console.log("uiFromDB", uiFromDB);
    const messages = appendClientMessage({
      messages: uiFromDB,
      message,
    });
    const isReasoning = selectedChatModel === "chat-model-reasoning";

    const modelTag = isReasoning
      ? "deepseek/deepseek-r1-0528:free"
      : "mistralai/mistral-small-3.1-24b-instruct:free";

    //  model: togetherai("deepseek-ai/DeepSeek-R1"),
    const modelUse = isReasoning
      ? wrapLanguageModel({
          model: openrouter.chat("deepseek/deepseek-r1-0528:free", {
            reasoning: { effort: "low" },
          }),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        })
      : openrouter.chat("mistralai/mistral-small-3.1-24b-instruct:free");
    await fetchMutation(api.message.saveMessage, {
      chatId,
      userId: user._id,
      model: modelTag,
      role: lastMessage.role,
      search_web: searchWeb,
      usage: lastMessage.usage,
      content: lastMessage.content,
      parts: lastMessage.parts,
      attachments: lastMessage.experimental_attachments || [],
      timestamp: Date.now(),
    });
    await fetchMutation(api.chat.updateChatUpdatedAt, {
      chatId,
    });

    const streamId = await fetchMutation(api.stream.createStream, { chatId });
    console.log("Stream ID:", streamId);

    const { longitude, latitude, city, country } = geolocation(req);
    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };
    const systemPrompt = `You are a friendly assistant! Keep your responses concise and helpful. You have access to the internet through getSearchResultsTool, but only use this tool if user requests it. You have the ability to generate image through the generateImageTool. Both tool should never be used together. Always use one tool per request. If you use generateImageTool, do not use getSearchResultsTool. If you use getSearchResultsTool, do not use generateImageTool. Should I use getSearchResultsTool? ${searchWeb}`;

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: modelUse,
          system: systemPrompt,
          messages,
          maxSteps: 5,
          // experimental_activeTools:
          //   selectedChatModel === "chat-model-reasoning"
          //     ? []
          //     : [
          //         "getWeather",
          //         // "createDocument",
          //         // "updateDocument",
          //         // "requestSuggestions",
          //       ],
          experimental_transform: smoothStream({ chunking: "word" }),
          tools: {
            generateImageTool,
            getSearchResultsTool,
            // createDocument: createDocument({ session, dataStream }),
            // updateDocument: updateDocument({ session, dataStream }),
            // requestSuggestions: requestSuggestions({
            //   session,
            //   dataStream,
            // }),
          },
          onFinish: async ({ response }) => {
            if (user._id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === "assistant"
                  ),
                });

                if (!assistantId) {
                  throw new Error("No assistant message found!");
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [message],
                  responseMessages: response.messages,
                });
                await fetchMutation(api.message.saveMessage, {
                  chatId,
                  userId: user._id,
                  model: modelTag,
                  role: assistantMessage.role as
                    | "assistant"
                    | "user"
                    | "system",
                  search_web: searchWeb,
                  usage: [],
                  content: lastMessage.content,
                  parts: assistantMessage.parts,
                  attachments: assistantMessage.experimental_attachments ?? [],
                  timestamp: Date.now(),
                });
                await fetchMutation(api.chat.updateChatUpdatedAt, {
                  chatId,
                });
              } catch (_) {
                console.error("Failed to save chat");
              }
            }
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error("Error occurred while streaming");
        console.error(error);
        return "Oops, an error occurred!";
      },
    });
    // const streamContext = getStreamContext();
    // console.groupEnd();
    // if (streamContext) {
    //   return new Response(
    //     await streamContext.resumableStream(streamId, () => stream)
    //   );
    // } else {
    //   return new Response(stream);
    // }
    // return new Response(stream, {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "text/event-stream",
    //     // remove buffering so the client sees tokens as they arrive
    //     "Cache-Control": "no-transform",
    //     "X-Accel-Buffering": "no",
    //   },
    // });
    return new Response(stream);
  } catch (error: any) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    console.error("Error API", error);
    console.group("API → ERROR");
    console.error("Step failed:", error.step || "unknown");
    console.error("Message:", error.message);
    console.error("Stack:  ", error.stack);
    console.groupEnd();
    return new Response("Internal Server Error", { status: 500 });
  }
}
