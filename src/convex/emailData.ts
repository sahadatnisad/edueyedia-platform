import { v } from "convex/values";
import { query } from "./_generated/server";

/* ------------------------------------------------------------------ */
/*  Email data lookups.                                                */
/*                                                                    */
/*  Kept in a leaf module (no `api` references) so the transactional   */
/*  email actions can read exactly the rows they need without creating */
/*  import cycles with the commerce/course modules that schedule them. */
/* ------------------------------------------------------------------ */

/**
 * Order snapshot for the confirmation email (server-scheduled only).
 * Returns null unless the order is actually paid.
 */
export const orderForEmail = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    const order = await ctx.db.get(orderId);
    if (!order || order.status !== "paid") return null;
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", orderId))
      .collect();
    return {
      orderRef: order._id.slice(-8).toUpperCase(),
      contactName: order.contactName,
      contactEmail: order.contactEmail,
      total: order.total,
      gateway: order.gateway,
      transactionId: order.transactionId,
      createdAt: order.createdAt,
      items: items.map((i) => ({
        kind: i.kind ?? "resource",
        title: i.title,
        price: i.price,
      })),
      hasCourses: (order.courseIds?.length ?? 0) > 0,
    };
  },
});

/** Published resource title for the resource-ready email. */
export const resourceForEmail = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const row = await ctx.db
      .query("resources")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();
    if (!row || row.status !== "published") return null;
    return { title: row.titleBn || row.title };
  },
});

/** Course identity for the enrollment email. */
export const courseForEmail = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    const row = await ctx.db.get(courseId);
    if (!row) return null;
    return {
      title: row.titleBn || row.title,
      slug: row.slug,
    };
  },
});
