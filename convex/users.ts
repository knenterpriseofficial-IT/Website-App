import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "User not logged in",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (user !== null) {
      return user._id;
    }
    return await ctx.db.insert("users", {
      name: identity.name,
      email: identity.email,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
  },
});

// Grant admin role based on email. Called after login.
export const claimAdminRole = mutation({
  args: { secretCode: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not logged in" });

    const email = identity.email ?? "";
    let adminUserId: string | null = null;

    if (email === "aditya.saha.official963@gmail.com" && args.secretCode === "Aditya0918") {
      adminUserId = "aditya";
    } else if (args.secretCode === "Subhajit1113") {
      // Subhajit's email not provided, match by secret code only for now
      adminUserId = "subhajit";
    } else {
      throw new ConvexError({ code: "FORBIDDEN", message: "Invalid secret code" });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) throw new ConvexError({ code: "NOT_FOUND", message: "User not found" });

    await ctx.db.patch(user._id, { isAdmin: true, adminUserId });
    return { success: true };
  },
});
