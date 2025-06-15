import { query } from "./_generated/server";
import { v } from "convex/values";

export const getVotesByChatId = query({
  args: { chatId: v.id("chat") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vote")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();
  },
});


