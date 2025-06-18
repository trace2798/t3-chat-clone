import { v } from "convex/values";
import { query } from "./_generated/server";

export const getSuggestionsByDocumentId = query({
  args: {
    documentId: v.id("document"),
  },
  handler: async (ctx, args) => {
    const suggestions = await ctx.db
      .query("suggestions")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .collect();

    return suggestions;
  },
});
