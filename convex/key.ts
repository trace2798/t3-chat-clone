import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const checkKeyByUserId = query({
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

export const deleteKey = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const key = await ctx.db
      .query("userApiKeys")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!key) {
      return "Key not found";
    }
    if (key.userId !== userId) {
      return "Unauthorized";
    }
    await ctx.db.delete(key._id);
    return "Key deleted";
  },
});

export const getKeyByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const openRouterKey = await ctx.db
      .query("userApiKeys")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    console.log("CONVEX OPEN ROUTER SERVER", openRouterKey);
    if (!openRouterKey) {
      return null;
    }

    return openRouterKey.openRouterKey;
  },
});
