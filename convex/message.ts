import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const saveMessage = mutation({
  args: {
    chatId: v.id("chat"),
    userId: v.string(),
    model: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    search_web: v.boolean(),
    usage: v.optional(v.any()),
    content: v.string(),
    parts: v.optional(v.any()),
    timestamp: v.number(),
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
