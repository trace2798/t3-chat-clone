import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const saveDocument = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    kind: v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("image"),
      v.literal("sheet")
    ),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const newId = await ctx.db.insert("document", {
      title: args.title,
      content: args.content ?? "",
      kind: args.kind,
      userId: args.userId,
    });
    return newId;
  },
});

export const updateDocument = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    content: v.string(),
    kind: v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("image"),
      v.literal("sheet")
    ),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id as Id<"document">);
    if (!document) return null;
    const update = await ctx.db.patch(document._id, {
      title: args.title,
      content: args.content ?? "",
      kind: args.kind,
    });
    return update;
  },
});
