// import { api } from "@/convex/_generated/api";
// import { generateUUID, getTrailingMessageId } from "@/lib/utils";
// import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
// import { createOpenRouter } from "@openrouter/ai-sdk-provider";
// import {
//   appendClientMessage,
//   appendResponseMessages,
//   createDataStream,
//   smoothStream,
//   streamText,
// } from "ai";
// import { fetchMutation, fetchQuery } from "convex/nextjs";
// import {
//   createResumableStreamContext,
//   type ResumableStreamContext,
// } from "resumable-stream";
// import { after } from "next/server";
// import { ChatSDKError } from "@/lib/errors";
// import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
// import { geolocation } from "@vercel/functions";

// export const maxDuration = 60;

// const openrouter = createOpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY!,
// });

// let globalStreamContext: ResumableStreamContext | null = null;

// function getStreamContext() {
//   if (!globalStreamContext) {
//     try {
//       globalStreamContext = createResumableStreamContext({
//         waitUntil: after,
//       });
//     } catch (error: any) {
//       if (error.message.includes("REDIS_URL")) {
//         console.log(
//           " > Resumable streams are disabled due to missing REDIS_URL"
//         );
//       } else {
//         console.error(error);
//       }
//     }
//   }

//   return globalStreamContext;
// }
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

//     const { id: slug, messages } = await req.json();

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

//     const [lastMessage] = messages.slice(-1);
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
//     // const streamId = generateUUID();
//     // await createStreamId({ streamId, chatId: id });
//     const streamId = await fetchMutation(api.stream.createStream, { chatId });
//     console.log("Stream ID:", streamId);
//     const selectedChatModel = "chat-model-reasoning";
//     const { longitude, latitude, city, country } = geolocation(req);
//     const requestHints: RequestHints = {
//       longitude,
//       latitude,
//       city,
//       country,
//     };

//     const stream = createDataStream({
//       execute: (dataStream) => {
//         const result = streamText({
//           model: myProvider.languageModel(selectedChatModel),
//           // model: openrouter.chat("google/gemma-3n-e4b-it:free"),
//           system: systemPrompt({ selectedChatModel, requestHints }),
//           messages,
//           maxSteps: 5,
//           // experimental_activeTools:
//           //   selectedChatModel === "chat-model-reasoning"
//           //     ? []
//           //     : [
//           //         "getWeather",
//           //         "createDocument",
//           //         "updateDocument",
//           //         "requestSuggestions",
//           //       ],
//           experimental_transform: smoothStream({ chunking: "word" }),
//           experimental_generateMessageId: generateUUID,
//           // tools: {
//           //   getWeather,
//           //   createDocument: createDocument({ session, dataStream }),
//           //   updateDocument: updateDocument({ session, dataStream }),
//           //   requestSuggestions: requestSuggestions({
//           //     session,
//           //     dataStream,
//           //   }),
//           // },
//           onFinish: async ({ response }) => {
//             if (user._id) {
//               try {
//                 const assistantId = getTrailingMessageId({
//                   messages: response.messages.filter(
//                     (message) => message.role === "assistant"
//                   ),
//                 });

//                 if (!assistantId) {
//                   throw new Error("No assistant message found!");
//                 }

//                 const [, assistantMessage] = appendResponseMessages({
//                   messages: [message],
//                   responseMessages: response.messages,
//                 });

//                 // await saveMessages({
//                 //   messages: [
//                 //     {
//                 //       id: assistantId,
//                 //       chatId: id,
//                 //       role: assistantMessage.role,
//                 //       parts: assistantMessage.parts,
//                 //       attachments:
//                 //         assistantMessage.experimental_attachments ?? [],
//                 //       createdAt: new Date(),
//                 //     },
//                 //   ],
//                 // });
//                 await fetchMutation(api.message.saveMessage, {
//                   chatId,
//                   userId: user._id,
//                   model: "deepseek/deepseek-r1-0528:free",
//                   role: assistantMessage.role as "assistant" | "user" | "system",
//                   search_web: false,
//                   usage: assistantMessage.,
//                   content: lastMessage.content,
//                   parts: assistantMessage.parts,
//                   attachments: assistantMessage.experimental_attachments ?? [],
//                   timestamp: Date.now(),
//                 });
//               } catch (_) {
//                 console.error("Failed to save chat");
//               }
//             }
//           },
//         });

//         result.consumeStream();

//         result.mergeIntoDataStream(dataStream, {
//           sendReasoning: true,
//         });
//       },
//       onError: () => {
//         return "Oops, an error occurred!";
//       },
//     });
//     const streamContext = getStreamContext();
//     if (streamContext) {
//       return new Response(
//         await streamContext.resumableStream(streamId, () => stream)
//       );
//     } else {
//       return new Response(stream);
//     }
//     // const result = streamText({
//     //   // model: openrouter.chat("google/gemma-3n-e4b-it:free"),
//     //   model: openrouter.chat("deepseek/deepseek-r1-0528:free"),
//     //   messages,
//     // });
//     // return result.toDataStreamResponse();
//   } catch (error) {
//     if (error instanceof ChatSDKError) {
//       return error.toResponse();
//     }

//     console.error("Error API", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }
import { api } from "@/convex/_generated/api";
import { ChatSDKError } from "@/lib/errors";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";

export const maxDuration = 60;

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
    // console.log(user);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id: slug, selectedChatModel, message } = await req.json();
    console.log("selectedChatModel", selectedChatModel);

    console.log("Experimental Message", message);
    const chatRecord = await fetchQuery(api.chat.getChatBySlug, { slug });
    if (chatRecord === "Chat not found") {
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
      return new Response("No message provided", { status: 400 });
    }

    await fetchMutation(api.message.saveMessage, {
      chatId,
      userId: user._id,
      model: "deepseek/deepseek-r1-0528:free",
      role: lastMessage.role,
      search_web: false,
      usage: lastMessage.usage,
      content: lastMessage.content,
      parts: lastMessage.parts,
      attachments: lastMessage.attachments || [],
      timestamp: Date.now(),
    });

    const result = streamText({
      model: openrouter.chat("google/gemma-3n-e4b-it:free"),
      // model: openrouter.chat("deepseek/deepseek-r1-0528:free"),
      messages: [lastMessage],
    });
    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error("Error API", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
