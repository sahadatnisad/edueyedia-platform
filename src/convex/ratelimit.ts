import { v } from "convex/values";
import { mutation } from "./_generated/server";

/* ------------------------------------------------------------------ */
/*  Server-defined rate-limit policies.                               */
/*                                                                    */
/*  Clients call `hit({ policy: "order" })` — the key prefix, window  */
/*  and limit are determined here, not by the client. A client can    */
/*  never choose their own rate-limit key, window, or limit.         */
/* ------------------------------------------------------------------ */

const POLICIES = {
  /** Payment initialization: 10 per hour per user. */
  order: { windowMs: 60 * 60 * 1000, limit: 10 },
  /** Free resource claim: 30 per hour per user. */
  claim: { windowMs: 60 * 60 * 1000, limit: 30 },
  /** Download: 30 per minute per user. */
  download: { windowMs: 60_000, limit: 30 },
  /** Newsletter subscribe: 5 per hour per email. */
  newsletter: { windowMs: 60 * 60 * 1000, limit: 5 },
  /** Contact form: 5 per hour per email. */
  contact: { windowMs: 60 * 60 * 1000, limit: 5 },
} as const;

type PolicyName = keyof typeof POLICIES;

/**
 * Apply a server-defined rate limit. The caller provides a policy name
 * and a unique identifier (e.g. userId or email). The key prefix,
 * window and limit are always determined server-side.
 */
export const hit = mutation({
  args: {
    policy: v.string(),
    identifier: v.string(),
  },
  handler: async (ctx, { policy, identifier }) => {
    const p = POLICIES[policy as PolicyName];
    if (!p) {
      throw new Error(`Unknown rate-limit policy: ${policy}`);
    }

    const key = `${policy}:${identifier}`;
    const now = Date.now();
    const row = await ctx.db
      .query("rateLimits")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    if (row === null || now - row.windowStart >= p.windowMs) {
      await ctx.db.insert("rateLimits", {
        key,
        windowStart: now,
        count: 1,
      });
      return { allowed: true, remaining: p.limit - 1 };
    }

    if (row.count >= p.limit) {
      throw new Error("Too many requests — please wait a moment and try again.");
    }

    await ctx.db.patch(row._id, { count: row.count + 1 });
    return { allowed: true, remaining: p.limit - row.count - 1 };
  },
});
