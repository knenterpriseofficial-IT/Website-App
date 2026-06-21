import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";

export const listByService = query({
  args: { serviceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content")
      .withIndex("by_service", (q) => q.eq("serviceId", args.serviceId))
      .order("desc")
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("content").order("desc").collect();
  },
});

async function requireAdmin(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not logged in" });

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  if (!user?.isAdmin) throw new ConvexError({ code: "FORBIDDEN", message: "Admin access required" });
  return user;
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const addContent = mutation({
  args: {
    serviceId: v.string(),
    type: v.string(),
    title: v.string(),
    body: v.optional(v.string()),
    url: v.optional(v.string()),
    links: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    videos: v.optional(v.array(v.string())),
    imageStorageIds: v.optional(v.array(v.string())),
    videoStorageIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<string> => {
    const user = await requireAdmin(ctx);

    const resolvedImages = [...(args.images ?? [])];
    if (args.imageStorageIds) {
      for (const id of args.imageStorageIds) {
        const url = await ctx.storage.getUrl(id as any);
        if (url) resolvedImages.push(url);
      }
    }

    const resolvedVideos = [...(args.videos ?? [])];
    if (args.videoStorageIds) {
      for (const id of args.videoStorageIds) {
        const url = await ctx.storage.getUrl(id as any);
        if (url) resolvedVideos.push(url);
      }
    }

    const id = await ctx.db.insert("content", {
      serviceId: args.serviceId,
      type: args.type,
      title: args.title,
      body: args.body,
      url: args.url,
      links: args.links,
      images: resolvedImages.length > 0 ? resolvedImages : undefined,
      videos: resolvedVideos.length > 0 ? resolvedVideos : undefined,
      createdBy: user.name ?? "Admin",
    });

    // Notify both admins via email
    await ctx.scheduler.runAfter(0, internal.emails.sendAdminChangeNotification, {
      action: "added",
      adminName: user.name ?? "Admin",
      serviceId: args.serviceId,
      contentTitle: args.title,
      contentType: args.type,
    });

    return id;
  },
});

export const deleteContent = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args): Promise<null> => {
    const user = await requireAdmin(ctx);
    const item = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);

    if (item) {
      await ctx.scheduler.runAfter(0, internal.emails.sendAdminChangeNotification, {
        action: "deleted",
        adminName: user.name ?? "Admin",
        serviceId: item.serviceId,
        contentTitle: item.title,
        contentType: item.type,
      });
    }

    return null;
  },
});

// No-auth versions used by the local session admin system
export const addContentNoAuth = mutation({
  args: {
    serviceId: v.string(),
    type: v.string(),
    title: v.string(),
    body: v.optional(v.string()),
    url: v.optional(v.string()),
    links: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    videos: v.optional(v.array(v.string())),
    imageStorageIds: v.optional(v.array(v.string())),
    videoStorageIds: v.optional(v.array(v.string())),
    adminName: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const { adminName } = args;

    const resolvedImages = [...(args.images ?? [])];
    if (args.imageStorageIds) {
      for (const id of args.imageStorageIds) {
        const url = await ctx.storage.getUrl(id as any);
        if (url) resolvedImages.push(url);
      }
    }

    const resolvedVideos = [...(args.videos ?? [])];
    if (args.videoStorageIds) {
      for (const id of args.videoStorageIds) {
        const url = await ctx.storage.getUrl(id as any);
        if (url) resolvedVideos.push(url);
      }
    }

    const id = await ctx.db.insert("content", {
      serviceId: args.serviceId,
      type: args.type,
      title: args.title,
      body: args.body,
      url: args.url,
      links: args.links,
      images: resolvedImages.length > 0 ? resolvedImages : undefined,
      videos: resolvedVideos.length > 0 ? resolvedVideos : undefined,
      createdBy: adminName,
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendAdminChangeNotification, {
      action: "added",
      adminName,
      serviceId: args.serviceId,
      contentTitle: args.title,
      contentType: args.type,
    });
    return id;
  },
});

export const deleteContentNoAuth = mutation({
  args: { id: v.id("content"), adminName: v.string() },
  handler: async (ctx, args): Promise<null> => {
    const item = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);
    if (item) {
      await ctx.scheduler.runAfter(0, internal.emails.sendAdminChangeNotification, {
        action: "deleted",
        adminName: args.adminName,
        serviceId: item.serviceId,
        contentTitle: item.title,
        contentType: item.type,
      });
    }
    return null;
  },
});

export const updateContent = mutation({
  args: {
    id: v.id("content"),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    url: v.optional(v.string()),
    links: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    videos: v.optional(v.array(v.string())),
    imageStorageIds: v.optional(v.array(v.string())),
    videoStorageIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<null> => {
    const user = await requireAdmin(ctx);
    const { id, ...updates } = args;

    const resolvedImages = updates.images ? [...updates.images] : undefined;
    if (updates.imageStorageIds) {
      const imagesList = resolvedImages ?? [];
      for (const storageId of updates.imageStorageIds) {
        const url = await ctx.storage.getUrl(storageId as any);
        if (url) imagesList.push(url);
      }
      updates.images = imagesList;
    }

    const resolvedVideos = updates.videos ? [...updates.videos] : undefined;
    if (updates.videoStorageIds) {
      const videosList = resolvedVideos ?? [];
      for (const storageId of updates.videoStorageIds) {
        const url = await ctx.storage.getUrl(storageId as any);
        if (url) videosList.push(url);
      }
      updates.videos = videosList;
    }

    // Delete temporary keys from updates to match schema
    delete (updates as any).imageStorageIds;
    delete (updates as any).videoStorageIds;

    const item = await ctx.db.get(id);
    await ctx.db.patch(id, updates);

    if (item) {
      await ctx.scheduler.runAfter(0, internal.emails.sendAdminChangeNotification, {
        action: "updated",
        adminName: user.name ?? "Admin",
        serviceId: item.serviceId,
        contentTitle: args.title ?? item.title,
        contentType: item.type,
      });
    }

    return null;
  },
});
