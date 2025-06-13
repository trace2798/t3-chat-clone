import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
