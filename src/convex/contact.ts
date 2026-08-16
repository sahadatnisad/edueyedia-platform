import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Contact form submissions — stored in the contactMessages table (never lost)
 * with per-email rate limiting and a honeypot check for basic spam.
 */
export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    topic: v.string(),
    message: v.string(),
    /** Honeypot — real users never fill this. */
    website: v.optional(v.string()),
  },
  handler: async (ctx, { name, email, topic, message, website }) => {
    const trimmedName = name.trim().slice(0, 200);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim().slice(0, 5000);
    const trimmedTopic = topic.trim().slice(0, 100);

    if (!trimmedName || !trimmedMessage) {
      throw new Error("Please provide your name and a message.");
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    // Honeypot: bots fill hidden fields; silently drop (but appear successful).
    if (website && website.length > 0) {
      return { ok: true as const, stored: false as const };
    }

    // Rate limit: max 5 submissions per email per hour.
    const key = `contact:${trimmedEmail}`;
    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    const limit = 5;
    const row = await ctx.db
      .query("rateLimits")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (row !== null && now - row.windowStart < windowMs && row.count >= limit) {
      throw new Error(
        "Too many messages from this address — please wait an hour and try again.",
      );
    }
    if (row === null || now - row.windowStart >= windowMs) {
      await ctx.db.insert("rateLimits", { key, windowStart: now, count: 1 });
    } else {
      await ctx.db.patch(row._id, { count: row.count + 1 });
    }

    await ctx.db.insert("contactMessages", {
      name: trimmedName,
      email: trimmedEmail,
      topic: trimmedTopic || "General",
      message: trimmedMessage,
      status: "new",
      createdAt: now,
    });
    return { ok: true as const, stored: true as const };
  },
});
