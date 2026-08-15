import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

/**
 * The signed-in user's library: every resource they own, newest first.
 * Returns an empty array when signed out.
 */
export const myLibrary = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return [];

    const rows = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return rows.map((row) => ({
      resourceId: row.resourceId,
      kind: row.kind,
      pricePaid: row.pricePaid,
      purchasedAt: row.purchasedAt,
    }));
  },
});

/** Whether the user owns a given resource (used on product pages). */
export const ownsResource = query({
  args: { resourceId: v.string() },
  handler: async (ctx, { resourceId }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return false;

    const existing = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("resourceId"), resourceId))
      .first();
    return existing !== null;
  },
});

/**
 * Add resources to the signed-in user's library.
 * Re-purchasing a resource is a no-op (deduplicated by resourceId).
 */
export const purchase = mutation({
  args: {
    resourceIds: v.array(v.string()),
    kind: v.union(v.literal("paid"), v.literal("free")),
    pricePaid: v.number(),
  },
  handler: async (ctx, { resourceIds, kind, pricePaid }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      throw new Error("You must be signed in to add resources to your library.");
    }

    const owned = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const ownedIds = new Set(owned.map((row) => row.resourceId));

    const now = Date.now();
    for (const resourceId of resourceIds) {
      if (ownedIds.has(resourceId)) continue;
      await ctx.db.insert("purchases", {
        userId: user._id,
        resourceId,
        kind,
        pricePaid,
        purchasedAt: now,
      });
    }
  },
});

/** Remove a resource from the user's library. */
export const removeFromLibrary = mutation({
  args: { resourceId: v.string() },
  handler: async (ctx, { resourceId }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return;

    const existing = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("resourceId"), resourceId))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

/** Subscribe an email to the Edueyedia newsletter. */
export const subscribeNewsletter = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }

    const existing = await ctx.db
      .query("newsletters")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();
    if (existing === null) {
      await ctx.db.insert("newsletters", {
        email: normalized,
        subscribedAt: Date.now(),
      });
    }
  },
});
