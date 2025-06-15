import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
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

export const getVotesByChatSlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();
    const chat = chats[0];
    if (!chat) {
      throw new Error("Chat not found");
    }
    const chatId: Id<"chat"> = chat._id;
    console.log("chat inside getVotesByChatSlug ", chat);
    return await ctx.db
      .query("vote")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .collect();
  },
});
export const createVote = mutation({
  args: {
    slug: v.string(),
    userId: v.optional(v.string()),
    messageId: v.id("message"),
    type: v.union(v.literal("upvote"), v.literal("downvote")),
  },
  handler: async (ctx, { slug, userId, messageId, type }) => {
    console.log("createVote", { slug, userId, messageId, type });
    const chats = await ctx.db
      .query("chat")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .collect();
    const chat = chats[0];
    if (!chat) {
      throw new Error("Chat not found");
    }
    const chatId: Id<"chat"> = chat._id;

    if (chat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const existingVotes = await ctx.db
      .query("vote")
      .withIndex("by_message", (q) => q.eq("messageId", messageId))
      .collect();
    const existing = existingVotes.find((v) => v.chatId === chatId);

    const isUp = type === "upvote";
    if (existing) {
      await ctx.db.patch(existing._id, { isUpvoted: isUp });
      return { ...existing, isUpvoted: isUp };
    }
    const newVote = await ctx.db.insert("vote", {
      chatId,
      messageId,
      isUpvoted: isUp,
    });
    return newVote;
  },
});
