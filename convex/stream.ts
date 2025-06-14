import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createStream = mutation({
  args: {
    chatId: v.id("chat"),
  },
  handler: async (ctx, args) => {
    const streamId = await ctx.db.insert("stream", {
      chatId: args.chatId,
      createdAt: Date.now(),
    });
    return streamId;
  },
});
