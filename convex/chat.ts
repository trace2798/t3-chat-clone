
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
