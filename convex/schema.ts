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
    isArchived: v.boolean(),
    isDeleted: v.boolean(),
    archivedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentChat"])
    .index("by_slug", ["slug"])
    .index("by_user_updatedAt", ["userId", "updatedAt"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["userId", "visibility", "isDeleted"],
    }),
  message: defineTable({
    chatId: v.id("chat"),
    userId: v.string(),
    model: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    search_web: v.boolean(),
    usage: v.optional(v.any()),
    content: v.string(),
    parts: v.optional(v.any()),
    timestamp: v.number(),
    attachments: v.optional(v.any()),
  })
    .index("by_chat", ["chatId"])
    .index("by_user", ["userId"]),
  vote: defineTable({
    chatId: v.id("chat"),
    messageId: v.id("message"),
    isUpvoted: v.boolean(),
  })
    .index("by_chat", ["chatId"])
    .index("by_message", ["messageId"]),
  stream: defineTable({
    chatId: v.id("chat"),
    createdAt: v.number(),
  })
    .index("by_chat", ["chatId"])
    .index("by_chat_createdAt", ["chatId", "createdAt"]),
  document: defineTable({
    title: v.string(),
    content: v.string(),
    kind: v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("image"),
      v.literal("sheet")
    ),
    userId: v.string(),
  }),
  suggestions: defineTable({
    documentId: v.id("documents"),
    documentCreatedAt: v.number(),
    originalText: v.string(),
    suggestedText: v.string(),
    description: v.optional(v.string()),
    isResolved: v.boolean(),
    userId: v.string(),
  }).index("by_documentId", ["documentId"]),
});

export default schema;
