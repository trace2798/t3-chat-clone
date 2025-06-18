import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { systemPrompt } from "@/lib/ai/prompts";
import { generateImageTool } from "@/lib/ai/tools/generate-image-tool";
import { getSearchResultsTool } from "@/lib/ai/tools/get-search-results";
import { ChatSDKError } from "@/lib/errors";
import { chatModelsList } from "@/lib/model-list";
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
import type { Tool } from "ai";

type DBMessage = Doc<"message">;
export const maxDuration = 60;
const TOOL_MAP: Record<
  string,
  { tools: Record<string, Tool>; active: string[] }
> = {
  // No tools at all for DeepSeek R1
  "deepseek/deepseek-r1-0528": {
    tools: {},
    active: [],
  },

  // Both image+search for Mistral & Gemini
  "mistralai/mistral-small-3.1-24b-instruct": {
    tools: {
      generateImageTool,
      getSearchResultsTool,
    },
    active: ["generateImageTool", "getSearchResultsTool"],
  },
  "google/gemini-2.5-flash-lite-preview-06-17": {
    tools: {
      generateImageTool,
      getSearchResultsTool,
    },
    active: ["generateImageTool", "getSearchResultsTool"],
  },

  "meta-llama/llama-4-maverick": {
    tools: {
      getSearchResultsTool,
    },
    active: ["getSearchResultsTool"],
  },
  "meta-llama/llama-4-scout": {
    tools: {
      getSearchResultsTool,
    },
    active: ["getSearchResultsTool"],
  },
};

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

    console.log("search_web", searchWeb);
    console.log("data FROM FE");
    console.log("SLUG FE", slug);
    console.log("selectedChatModel FE", selectedChatModel);
    console.log("message FE", message);
    console.log("generateImage FE", generateImage);

    const modelConfig = chatModelsList.find(
      (m) => m.name === selectedChatModel
    );
    if (!modelConfig) {
      return new Response("Chat model not found", { status: 404 });
    }
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
    const userKey = await fetchQuery(api.key.getKeyByUserId, {
      userId: user._id,
    });
    console.log("USER OPEN ROUTER KEY", userKey);
    if (
      !userKey &&
      selectedChatModel === "anthropic/claude-4-sonnet-20250522"
    ) {
      return new Response("No key found", { status: 400 });
    }
    const openrouter = createOpenRouter({
      apiKey: userKey || process.env.OPENROUTER_API_KEY,
    });

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

    const messages = appendClientMessage({
      messages: uiFromDB,
      message,
    });

    const isReasoning = modelConfig.category.includes("reasoning");
    const modelTag = modelConfig.name;
    const baseModel = openrouter.chat(modelTag, {
      ...(isReasoning ? { reasoning: { effort: "medium" } } : {}),
    });

    const modelUse = isReasoning
      ? wrapLanguageModel({
          model: baseModel,
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        })
      : baseModel;

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
    const { tools, active } = TOOL_MAP[selectedChatModel] ?? {
      tools: {},
      active: [],
    };

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: modelUse,
          system: systemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 10,
          experimental_activeTools: active,
          experimental_transform: smoothStream({ chunking: "word" }),
          tools,
          toolChoice: "auto",
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
