import { getAuthUserId } from "@convex-dev/auth/server";
import { asyncMap } from "convex-helpers";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";

export const getUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return;
    }
    return {
      ...user,
    };
  },
});





export const deleteUserAccount = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await asyncMap(
      ["github" /* add other providers as needed */],
      async (provider) => {
        const authAccount = await ctx.db
          .query("authAccounts")
          .withIndex("userIdAndProvider", (q) =>
            q.eq("userId", args.userId).eq("provider", provider)
          )
          .unique();
        if (!authAccount) {
          return;
        }
        await ctx.db.delete(authAccount._id);
      }
    );
    await ctx.db.delete(args.userId);
  },
});

