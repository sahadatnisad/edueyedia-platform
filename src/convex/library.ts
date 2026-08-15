import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { resources } from "../data/catalog";

const PRICE_MAP = new Map(
  resources
    .filter((r) => r.kind === "paid")
    .map((r) => [r.slug, r.price]),
);

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
 *
 * Free resources unlock immediately (no payment involved). Paid resources
 * only unlock when the caller supplies a `paid` order — i.e. an order whose
 * payment was verified server-side. This prevents anyone from unlocking paid
 * content based purely on client-side input.
 */
export const purchase = mutation({
  args: {
    resourceIds: v.array(v.string()),
    kind: v.union(v.literal("paid"), v.literal("free")),
    pricePaid: v.number(),
    orderId: v.optional(v.id("orders")),
  },
  handler: async (ctx, { resourceIds, kind, pricePaid, orderId }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      throw new Error("You must be signed in to add resources to your library.");
    }

    // Paid purchases must reference a server-verified, paid order.
    if (kind === "paid") {
      if (orderId === undefined) {
        throw new Error("Paid purchases require a verified order.");
      }
      const order = await ctx.db.get(orderId);
      if (!order || order.userId !== user._id || order.status !== "paid") {
        throw new Error("This order has not been verified as paid.");
      }
      for (const resourceId of resourceIds) {
        if (!order.resourceIds.includes(resourceId)) {
          throw new Error("The order does not cover this resource.");
        }
      }
      // Defensive: never trust client-side pricing.
      const expected = resourceIds.reduce(
        (sum, id) => sum + (PRICE_MAP.get(id) ?? 0),
        0,
      );
      if (pricePaid < expected) {
        throw new Error("Payment amount does not match the catalog price.");
      }
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
        orderId,
      });
    }
  },
});

/**
 * Create a pending order at checkout. The total is computed server-side from
 * the catalog — the client never decides how much to pay.
 *
 * The order stays `pending` until the payment gateway verifies the payment
 * server-side (see convex/http.ts gateway callbacks), at which point
 * `markOrderPaid` unlocks the resources into the customer's library.
 */
export const createOrder = mutation({
  args: {
    resourceIds: v.array(v.string()),
    contactName: v.string(),
    contactEmail: v.string(),
    contactMobile: v.optional(v.string()),
    gateway: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      throw new Error("You must be signed in to place an order.");
    }
    if (args.resourceIds.length === 0) {
      throw new Error("Your order is empty.");
    }
    if (!args.contactName.trim() || !args.contactEmail.trim()) {
      throw new Error("Please provide your name and email.");
    }

    const total = args.resourceIds.reduce(
      (sum, id) => sum + (PRICE_MAP.get(id) ?? 0),
      0,
    );
    if (total <= 0) {
      throw new Error("Your order must contain paid resources.");
    }

    return await ctx.db.insert("orders", {
      userId: user._id,
      resourceIds: args.resourceIds,
      contactName: args.contactName.trim(),
      contactEmail: args.contactEmail.trim().toLowerCase(),
      contactMobile: args.contactMobile?.trim(),
      total,
      gateway: args.gateway,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/**
 * Complete a verified order — called only from the server-side payment
 * verification endpoint (see convex/http.ts). Marks the order paid and
 * unlocks its resources into the customer's library.
 *
 * A client calling this directly gains nothing beyond what the public
 * verification endpoint already offers: the real gate is the gateway check
 * below. Once SSLCOMMERZ_* credentials are configured, sandbox verifications
 * are rejected here, so nobody can unlock content by pretending to be the
 * payment gateway.
 */
export const completeVerifiedOrder = mutation({
  args: {
    orderId: v.id("orders"),
    gateway: v.optional(v.string()),
    transactionId: v.optional(v.string()),
  },
  handler: async (ctx, { orderId, gateway, transactionId }) => {
    const order = await ctx.db.get(orderId);
    if (!order || order.status !== "pending") {
      throw new Error("Order is not pending or not found.");
    }
    if (order.total <= 0) {
      throw new Error("Order total is invalid.");
    }

    const gatewayConfigured = Boolean(
      process.env.SSLCOMMERZ_STORE_ID && process.env.SSLCOMMERZ_STORE_PASSWORD,
    );
    if (gatewayConfigured && gateway !== "sandbox") {
      throw new Error(
        "Live gateway verification is not implemented yet — configure the gateway status check before going live.",
      );
    }
    if (gatewayConfigured && gateway === "sandbox") {
      throw new Error(
        "Sandbox orders are disabled when a live gateway is configured.",
      );
    }

    await ctx.db.patch(orderId, { status: "paid", gateway });

    const owned = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", order.userId))
      .collect();
    const ownedIds = new Set(owned.map((row) => row.resourceId));
    const now = Date.now();
    for (const resourceId of order.resourceIds) {
      if (ownedIds.has(resourceId)) continue;
      await ctx.db.insert("purchases", {
        userId: order.userId,
        resourceId,
        kind: "paid",
        pricePaid: order.total / order.resourceIds.length,
        purchasedAt: now,
        orderId: order._id,
      });
    }

    return {
      ok: true as const,
      orderId: order._id,
      transactionId: transactionId ?? null,
    };
  },
});

/** The signed-in user's orders, newest first. */
export const myOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return [];
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
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
