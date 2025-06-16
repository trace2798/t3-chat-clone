import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// import {generateSlug} from "@/lib/utils";
import { customAlphabet } from "nanoid";

export const getChatVisibility = query({
  args: { chatId: v.id("chat") },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    return chat.visibility;
  },
});

export const updateChatVisibility = mutation({
  args: {
    chatId: v.id("chat"),
    visibility: v.union(v.literal("private"), v.literal("public")),
  },
  handler: async (ctx, { chatId, visibility }) => {
    await ctx.db.patch(chatId, { visibility });
  },
});

export const createChat = mutation({
  args: {
    title: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const slug = generateSlug(args.title);

    const chatId = await ctx.db.insert("chat", {
      ...args,
      visibility: "public",
      updatedAt: Date.now(),
      slug,
      isArchived: false,
      isDeleted: false,
    });

    return { chatId, slug };
  },
});

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  21
);

export function generateSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
  const suffix = nanoid();
  return `${base}-${suffix}`;
}

export const getChatBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const chat = await ctx.db
      .query("chat")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    // const chat = chats[0];
    // if (!chat) {
    //   return "Chat not found";
    // }
    console.log("CHAT SLUG API CONVEX", chat);
    return chat;
  },
});

export const getChatByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_user_updatedAt", (q) => q.eq("userId", args.userId))
      .filter((q) => q.and(q.eq(q.field("isDeleted"), false)))
      .order("desc")
      .collect();

    return chats;
  },
});

export const getArchivedChatByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_user_updatedAt", (q) => q.eq("userId", args.userId))
      .filter((q) => q.and(q.eq(q.field("isArchived"), true)))
      .order("desc")
      .collect();

    return chats;
  },
});

export const getDeletedChatByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_user_updatedAt", (q) => q.eq("userId", args.userId))
      .filter((q) => q.and(q.eq(q.field("isDeleted"), true)))
      .order("desc")
      .collect();

    return chats;
  },
});

export const archiveChat = mutation({
  args: { slug: v.string(), userId: v.string() },
  handler: async (ctx, { slug, userId }) => {
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .collect();

    const chat = chats[0];
    if (!chat) {
      return "Chat not found";
    }
    if (chat.userId !== userId) {
      return "Unauthorized";
    }
    const chatId = chat._id;
    await ctx.db.patch(chatId, {
      isArchived: true,
      archivedAt: Date.now(),
    });
    return "Chat archived";
  },
});

export const unarchiveChat = mutation({
  args: { slug: v.string(), userId: v.string() },
  handler: async (ctx, { slug, userId }) => {
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .collect();

    const chat = chats[0];
    if (!chat) {
      return "Chat not found";
    }
    if (chat.userId !== userId) {
      return "Unauthorized";
    }
    const chatId = chat._id;
    await ctx.db.patch(chatId, {
      isArchived: false,
      archivedAt: undefined,
    });
    return "Chat unarchived";
  },
});

export const softDeleteChat = mutation({
  args: { slug: v.string(), userId: v.string() },
  handler: async (ctx, { slug, userId }) => {
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .collect();

    const chat = chats[0];
    if (!chat) {
      return "Chat not found";
    }
    if (chat.userId !== userId) {
      return "Unauthorized";
    }
    await ctx.db.patch(chat._id, {
      isDeleted: true,
      deletedAt: Date.now(),
    });
    return "Chat deleted";
  },
});

export const restoreSoftDeletedChat = mutation({
  args: { slug: v.string(), userId: v.string() },
  handler: async (ctx, { slug, userId }) => {
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .collect();

    const chat = chats[0];
    if (!chat) {
      return "Chat not found";
    }
    if (chat.userId !== userId) {
      return "Unauthorized";
    }
    await ctx.db.patch(chat._id, {
      isDeleted: false,
      deletedAt: undefined,
    });
    return "Chat Restored";
  },
});

export const permanentlyDeleteChatAndMessages = mutation({
  args: { slug: v.string(), userId: v.string() },
  handler: async (ctx, { slug, userId }) => {
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .collect();

    const chat = chats[0];
    if (!chat) {
      return "Chat not found";
    }
    if (chat.userId !== userId) {
      return "Unauthorized";
    }
    for await (const message of ctx.db
      .query("message")
      .withIndex("by_chat", (q) => q.eq("chatId", chat._id))) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(chat._id);
    return "Chat deleted";
  },
});

export const getChatSearch = query({
  args: { userId: v.string(), query: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("chat")
      .withSearchIndex("search_title", (q) =>
        q
          .search("title", args.query)
          .eq("userId", args.userId)
          .eq("isDeleted", false)
      )
      .take(20);
    console.log("CONVER SEARCH");
    return results;
  },
});

export const branchChat = mutation({
  args: {
    chatSlug: v.string(),
    messageId: v.id("message"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(
      "CONVER BRANCH testing",
      "Message ID",
      args.messageId,
      "User ID",
      args.userId,
      "chatId",
      args.chatSlug
    );
    const chat = await ctx.db
      .query("chat")
      .withIndex("by_slug", (q) => q.eq("slug", args.chatSlug))
      .first();

    console.log("CONVER BRANCH testing chat info", chat);
    if (!chat) {
      return "Chat not found";
    }
    if (chat?.userId !== args.userId) {
      return "Unauthorized";
    }
    const selectedMessageInfo = await ctx.db.get(args.messageId);
    if (!selectedMessageInfo) {
      return "Message not found";
    }
    console.log("CONVER BRANCH testing message info", selectedMessageInfo);
    const history = await ctx.db
      .query("message")
      .withIndex("by_chat_timestamp", (q) =>
        q
          .eq("chatId", selectedMessageInfo.chatId)
          .lte("timestamp", selectedMessageInfo.timestamp)
      )
      .order("asc")
      .collect();
    console.log("HISTORY", history);
    const slug = generateSlug(selectedMessageInfo.content);
    console.log("SLUG", slug);
    const newChatId = await ctx.db.insert("chat", {
      title: selectedMessageInfo.content,
      userId: args.userId,
      parentChat: chat._id,
      visibility: chat.visibility,
      updatedAt: Date.now(),
      slug: slug,
      isArchived: false,
      isDeleted: false,
    });
    for (const m of history) {
      await ctx.db.insert("message", {
        chatId: newChatId,
        userId: m.userId,
        model: m.model,
        role: m.role,
        search_web: m.search_web,
        usage: m.usage ?? null,
        content: m.content,
        parts: m.parts ?? null,
        timestamp: m.timestamp,
        attachments: m.attachments ?? null,
      });
    }
    return {
      chatId: newChatId,
      chatSlug: slug,
    };
  },
});

export const updateChatUpdatedAt = mutation({
  args: { chatId: v.id("chat") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chatId, {
      updatedAt: Date.now(),
    });
    return "Chat archived";
  },
});
