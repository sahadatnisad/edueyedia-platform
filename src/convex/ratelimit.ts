import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Fixed-window rate limiter backed by a Convex table.
 *
 * Call via `ctx.runMutation(api.ratelimit.hit, { key, limit, windowMs })`
 * from an action, or directly from a mutation. Throws a clear error when
 * the caller is over the limit — sensitive operations (downloads, contact,
 * newsletter, payment init) must not be hammerable.
 */
export const hit = mutation({
  args: {
    key: v.string(),
    limit: v.number(),
    windowMs: v.number(),
  },
  handler: async (ctx, { key, limit, windowMs }) => {
    const now = Date.now();
    const row = await ctx.db
      .query("rateLimits")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    if (row === null || now - row.windowStart >= windowMs) {
      await ctx.db.insert("rateLimits", {
        key,
        windowStart: now,
        count: 1,
      });
      return { allowed: true, remaining: limit - 1 };
    }

    if (row.count >= limit) {
      throw new Error("Too many requests — please wait a moment and try again.");
    }

    await ctx.db.patch(row._id, { count: row.count + 1 });
    return { allowed: true, remaining: limit - row.count - 1 };
  },
});
