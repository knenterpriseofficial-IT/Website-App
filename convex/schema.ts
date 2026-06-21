import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
    adminUserId: v.optional(v.string()), // "aditya" | "subhajit"
  }).index("by_token", ["tokenIdentifier"]),

  // Content managed by admins: announcements, offers, discounts, posters per service
  content: defineTable({
    serviceId: v.string(), // "internship" | "training" | "websites" | "custom-websites" | "ai-agents" | "mobile-apps" | "general"
    type: v.string(), // "announcement" | "offer" | "discount" | "post"
    title: v.string(),
    body: v.optional(v.string()),
    url: v.optional(v.string()), // legacy or main single url
    links: v.optional(v.array(v.string())), // multiple links
    images: v.optional(v.array(v.string())), // multiple images
    videos: v.optional(v.array(v.string())), // multiple videos
    createdBy: v.string(), // admin name
    order: v.optional(v.number()),
  }).index("by_service", ["serviceId"]),
});
