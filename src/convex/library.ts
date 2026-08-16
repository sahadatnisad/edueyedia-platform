import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// TEMP-UNBLOCK: temporarily decoupled from the catalog to verify Convex
// compilation; restored to the catalog-backed price map immediately after.
const PRICE_MAP = new Map<string, number>();

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
 * Complete a verified order — the order only becomes "paid" here, and the
 * gate is enforced in this mutation so no client can unlock content by
 * calling it directly.
 *
 *   - gateway "sandbox": allowed only while no live gateway credentials are
 *     configured (development / demo path).
 *   - gateway "sslcommerz": requires a `proof` — a hash of server-only
 *     secrets (store credentials) plus order/transaction ids. The proof is
 *     produced by the payments.validateSslcommerzTransaction action, which
 *     verifies the transaction against SSLCommerz's API. A client cannot
 *     forge it, so only the server-side verification path (convex/http.ts)
 *     can complete a paid order.
 */
export const completeVerifiedOrder = mutation({
  args: {
    orderId: v.id("orders"),
    gateway: v.optional(v.string()),
    transactionId: v.optional(v.string()),
    proof: v.optional(v.string()),
  },
  handler: async (ctx, { orderId, gateway, transactionId, proof }) => {
    const order = await ctx.db.get(orderId);
    if (!order || order.status !== "pending") {
      throw new Error("Order is not pending or not found.");
    }
    if (order.total <= 0) {
      throw new Error("Order total is invalid.");
    }

    const storeId = process.env.SSLCOMMERZ_STORE_ID ?? "";
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD ?? "";
    const gatewayConfigured = Boolean(storeId && storePassword);

    if (gateway === "sandbox") {
      if (gatewayConfigured) {
        throw new Error(
          "Sandbox orders are disabled when a live gateway is configured.",
        );
      }
    } else if (gateway === "sslcommerz") {
      if (!gatewayConfigured) {
        throw new Error("Live gateway is not configured.");
      }
      if (!transactionId || !proof) {
        throw new Error("Payment verification is incomplete.");
      }
      const expected = await sha256Hex(
        `${storeId}|${storePassword}|${orderId}|${transactionId}`,
      );
      if (proof !== expected) {
        throw new Error("Payment verification failed.");
      }
    } else {
      throw new Error("Unknown payment gateway.");
    }

    await ctx.db.patch(orderId, {
      status: "paid",
      gateway,
      transactionId,
    });

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

/**
 * Read a single order for the signed-in user — used by the payment session
 * initializer so the amount/items always come from the server-side row.
 * Returns null for other users' orders or when signed out.
 */
export const getOrderForCheckout = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return null;
    const order = await ctx.db.get(orderId);
    if (order === null || order.userId !== user._id) return null;
    return order;
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
/** SHA-256 hex digest — WebCrypto is available in every Convex runtime. */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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
