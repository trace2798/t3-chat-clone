import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getKeyByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const openRouterKey = await ctx.db
      .query("userApiKeys")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    console.log("CONVEX OPEN ROUTER SERVER", openRouterKey);
    if (!openRouterKey) {
      return false;
    }
    return true;
  },
});

export const addOpenRouterKey = mutation({
  args: { userId: v.id("users"), key: v.string() },
  handler: async (ctx, args) => {
    const openRouterKey = await ctx.db.insert("userApiKeys", {
      userId: args.userId,
      openRouterKey: args.key,
      updatedAt: Date.now(),
    });
    return openRouterKey;
  },
});
