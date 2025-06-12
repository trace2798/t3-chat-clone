import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  chat: defineTable({
    title: v.string(),
    userId: v.string(),
    parentChat: v.optional(v.id("chat")),
    visibility: v.union(v.literal("private"), v.literal("public")),
    updatedAt: v.number(),
    slug: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentChat"])
    .index("by_slug", ["slug"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["userId", "visibility"],
    }),
  message: defineTable({
    chatId: v.id("chat"),
    userId: v.string(),
    model: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    search_web: v.boolean(),
    reasoning: v.optional(v.string()),
    usage: v.optional(v.any()),
    content: v.string(),
    timestamp: v.float64(),
  })
    .index("by_chat", ["chatId"])
    .index("by_user", ["userId"]),
  vote: defineTable({
    chatId: v.id("chat"),
    messageId: v.id("message"),
    userId: v.string(),
    isUpvoted: v.boolean(),
  })
    .index("by_chat", ["chatId"])
    .index("by_message", ["messageId"]),
});

export default schema;
