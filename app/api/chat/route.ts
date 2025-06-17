import { api } from "@/convex/_generated/api";
import { getTrailingMessageId } from "@/lib/utils";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  extractReasoningMiddleware,
  smoothStream,
  streamText,
  wrapLanguageModel,
} from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";

import { systemPrompt, type RequestHints } from "@/lib/ai/prompts";
import { ChatSDKError } from "@/lib/errors";
import { createTogetherAI } from "@ai-sdk/togetherai";
import { geolocation } from "@vercel/functions";

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

    const { id: slug, selectedChatModel, message } = await req.json();
    console.log("data FROM FE");
    console.log("SLUG FE", slug);
    console.log("selectedChatModel FE", selectedChatModel);
    console.log("message FE", message);
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
    const isReasoning = selectedChatModel === "chat-model-reasoning";

    const modelTag = isReasoning
      ? "deepseek/deepseek-r1-0528:free"
      : // : "google/gemma-3n-e4b-it:free";
        "mistralai/mistral-small-3.1-24b-instruct:free";

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
      search_web: false,
      usage: lastMessage.usage,
      content: lastMessage.content,
      parts: lastMessage.parts,
      attachments: lastMessage.attachments || [],
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
    // const messages = [] as any;
    const previousMessages = [] as any;
    const messages = appendClientMessage({
      messages: previousMessages,
      message,
    });

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: modelUse,
          system: systemPrompt({ selectedChatModel, requestHints }),
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
          // experimental_generateMessageId: generateUUID,
          // tools: {
          //   getWeather,
          //   // createDocument: createDocument({ session, dataStream }),
          //   // updateDocument: updateDocument({ session, dataStream }),
          //   // requestSuggestions: requestSuggestions({
          //   //   session,
          //   //   dataStream,
          //   // }),
          // },
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
                  search_web: false,
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






//working code
// import { api } from "@/convex/_generated/api";
// import { ChatSDKError } from "@/lib/errors";
// import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
// import { createOpenRouter } from "@openrouter/ai-sdk-provider";
// import { streamText } from "ai";
// import { fetchMutation, fetchQuery } from "convex/nextjs";

// export const maxDuration = 60;

// const openrouter = createOpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY!,
// });

// export async function POST(req: Request) {
//   try {
//     const user = await fetchQuery(
//       api.users.getUser,
//       {},
//       { token: await convexAuthNextjsToken() }
//     );
//     // console.log(user);
//     if (!user) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     const { id: slug, selectedChatModel, message } = await req.json();
//     console.log("selectedChatModel", selectedChatModel);

//     console.log("Experimental Message", message);
//     const chatRecord = await fetchQuery(api.chat.getChatBySlug, { slug });
//     if (chatRecord === "Chat not found") {
//       return new Response("Chat not found", { status: 404 });
//     }
//     if (chatRecord.isArchived) {
//       return new Response("Chat is archived", { status: 400 });
//     }
//     if (chatRecord.isDeleted) {
//       return new Response("Chat is deleted", { status: 400 });
//     }
//     if (chatRecord.userId !== user._id) {
//       return new Response("Unauthorized", { status: 401 });
//     }
//     const chatId = chatRecord._id;

//     const lastMessage = message;
//     if (!lastMessage) {
//       return new Response("No message provided", { status: 400 });
//     }

//     await fetchMutation(api.message.saveMessage, {
//       chatId,
//       userId: user._id,
//       model: "deepseek/deepseek-r1-0528:free",
//       role: lastMessage.role,
//       search_web: false,
//       usage: lastMessage.usage,
//       content: lastMessage.content,
//       parts: lastMessage.parts,
//       attachments: lastMessage.attachments || [],
//       timestamp: Date.now(),
//     });

//     const result = streamText({
//       // model: openrouter.chat("google/gemma-3n-e4b-it:free"),
//       model: openrouter.chat("deepseek/deepseek-r1-0528:free"),
//       messages: [lastMessage],
//     });
//     return result.toDataStreamResponse();
//   } catch (error) {
//     if (error instanceof ChatSDKError) {
//       return error.toResponse();
//     }

//     console.error("Error API", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }
