import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const saveMessage = mutation({
  args: {
    chatId: v.id("chat"),
    userId: v.string(),
    model: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    search_web: v.boolean(),
    usage: v.optional(v.any()),
    content: v.string(),
    parts: v.optional(v.any()),
    timestamp: v.number(),
    attachments: v.optional(v.any()),
  },
  handler: async (
    ctx,
    {
      chatId,
      userId,
      model,
      role,
      search_web,
      usage,
      content,
      parts,
      timestamp,
      attachments,
    }
  ) => {
    return await ctx.db.insert("message", {
      chatId,
      userId,
      model,
      role,
      search_web,
      usage,
      content,
      parts,
      timestamp,
      attachments,
    });
  },
});

export const getMessagesByChatId = query({
  args: { chatId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("message")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId as Id<"chat">))
      .collect();

    // if (messages.length === 0) {
    //   return "Messages not found";
    // }

    return messages;
  },
});

export const getLast10Messages = query({
  args: {
    chatId: v.id("chat"),
  },
  handler: async (ctx, { chatId }) => {
    const messages = await ctx.db
      .query("message")
      .withIndex("by_chat_timestamp", (q) => q.eq("chatId", chatId))
      .order("desc")
      .take(10);

    // Optionally, reverse to get them in chronological order (oldest to newest)
    return messages.reverse();
  },
});
