import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { api } from "./_generated/api";

/* ------------------------------------------------------------------ */
/*  Newsletter subscription management.                                */
/*                                                                    */
/*  Subscribers are stored in the `newsletters` table with an active / */
/*  unsubscribed status and a per-subscriber unsubscribe token (the    */
/*  one-click link in the welcome email). Rows are never deleted on    */
/*  unsubscribe — the owner keeps an honest subscription history.      */
/*                                                                    */
/*  Sending is handled by the shared transactional email provider      */
/*  (email.ts): Resend when configured → Freebuff VLY gateway →        */
/*  honest { sent: false } when no provider exists. The welcome email  */
/*  is scheduled, so a delivery failure never breaks the subscription. */
/* ------------------------------------------------------------------ */

function randomToken(): string {
  // crypto.randomUUID is available in the Convex runtime (Node 18+).
  return crypto.randomUUID();
}

/** Normalized subscriber email. */
const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Subscribe an email to the Edueyedia Letter.
 *
 * - Already active → idempotent no-op (returns { alreadySubscribed: true }).
 * - Unsubscribed before → re-subscribes (new token, fresh subscribedAt).
 * - Legacy rows created before status/token existed are migrated in place.
 */
export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = normalizeEmail(email);
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      throw new Error("Please enter a valid email address.");
    }

    // Abuse protection: at most 5 subscribe attempts per address per hour.
    await ctx.runMutation(api.ratelimit.hit, {
      policy: "newsletter",
      identifier: normalized,
    });

    const existing = await ctx.db
      .query("newsletters")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    const now = Date.now();
    const token = randomToken();

    if (existing === null) {
      await ctx.db.insert("newsletters", {
        email: normalized,
        status: "active",
        subscribedAt: now,
        unsubscribeToken: token,
      });
    } else {
      // Migrate legacy rows (created before status/token existed).
      if (existing.status === "active") {
        if (!existing.unsubscribeToken) {
          await ctx.db.patch(existing._id, { unsubscribeToken: token });
        }
        return { alreadySubscribed: true as const };
      }
      // Re-subscribe: fresh token + subscription timestamp, history kept.
      await ctx.db.patch(existing._id, {
        status: "active",
        subscribedAt: now,
        unsubscribedAt: undefined,
        unsubscribeToken: token,
      });
    }

    // Welcome email is scheduled (never blocks the subscribe) and goes out
    // through the shared provider priority. It also carries the one-click
    // unsubscribe link for this subscriber.
    await ctx.scheduler.runAfter(0, api.email.sendNewsletterWelcome, {
      email: normalized,
      unsubscribeToken: token,
    });

    return { alreadySubscribed: false as const };
  },
});

/**
 * Unsubscribe via the secret per-subscriber token from the email link.
 * Marks the row unsubscribed (keeps history) and reports success only
 * when a matching subscriber was found. The subscriber's database id is
 * never exposed — the token is the only identifier the link carries.
 */
export const unsubscribe = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const trimmed = token.trim();
    if (!trimmed) {
      throw new Error("This unsubscribe link is not valid.");
    }
    const row = await ctx.db
      .query("newsletters")
      .withIndex("by_token", (q) => q.eq("unsubscribeToken", trimmed))
      .first();
    if (row === null) {
      throw new Error(
        "This unsubscribe link could not be found. It may have been used already — you can reply to any Edueyedia email to be removed.",
      );
    }
    if (row.status !== "active") {
      // Already unsubscribed — idempotent, still a friendly success.
      return { ok: true as const, alreadyUnsubscribed: true as const };
    }
    await ctx.db.patch(row._id, {
      status: "unsubscribed",
      unsubscribedAt: Date.now(),
    });
    return { ok: true as const, alreadyUnsubscribed: false as const };
  },
});
