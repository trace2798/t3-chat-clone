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
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();

    const chat = chats[0];
    if (!chat) {
      return "Chat not found";
    }

    return chat;
  },
});

export const getChatByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_user_updatedAt", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return chats;
  },
});

export const deleteChatAndMessages = mutation({
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
