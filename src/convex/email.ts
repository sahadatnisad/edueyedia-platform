"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { createVlyIntegrations } from "@vly-ai/integrations";

/* ------------------------------------------------------------------ */
/*  Transactional email.                                               */
/*                                                                    */
/*  Provider priority:                                                 */
/*    1. Resend, when RESEND_API_KEY is configured (Keys tab).         */
/*    2. The Freebuff VLY email gateway, when VLY_INTEGRATION_KEY is   */
/*       present — it is auto-injected into every Freebuff project, so */
/*       transactional mail works without any extra account setup.    */
/*    3. Neither configured: the action logs clearly and returns       */
/*       { sent: false } — the app never claims an email was sent.     */
/*                                                                    */
/*  Emails are scheduled server-side (ctx.scheduler.runAfter) after    */
/*  verified events, so a payment can never be blocked on delivery and */
/*  a failed send can never undo a purchase.                           */
/* ------------------------------------------------------------------ */

const FROM_NAME = "Edueyedia";
const SUPPORT_EMAIL = "hello@edueyedia.com";

/** Canonical site base — SITE_URL when set, otherwise the brand domain.
 *  Email links must always be absolute: a relative "/dashboard" in an
 *  email resolves against the reader's mail client, not the site. */
const siteUrl = () =>
  (process.env.SITE_URL ?? "https://edueyedia.com").replace(/\/$/, "");

async function deliver(
  to: string,
  subject: string,
  html: string,
): Promise<{ sent: boolean; provider: "resend" | "vly" | "none" }> {
  const key = process.env.RESEND_API_KEY ?? "";
  if (key) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <no-reply@edueyedia.com>`,
        to: [to],
        subject,
        html,
        reply_to: SUPPORT_EMAIL,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Email delivery failed (${res.status}): ${body.slice(0, 200)}`);
    }
    return { sent: true, provider: "resend" };
  }

  // Fallback: the Freebuff VLY email gateway (auto-injected key). The gateway
  // supplies the sender domain, so we only set the reply-to address.
  if (process.env.VLY_INTEGRATION_KEY) {
    const vly = createVlyIntegrations({
      deploymentToken: process.env.VLY_INTEGRATION_KEY,
    });
    const result = await vly.email.send({
      to: [to],
      subject,
      html,
      replyTo: SUPPORT_EMAIL,
    });
    if (!result.success) {
      throw new Error(
        `Email delivery failed: ${result.error ?? "VLY email gateway error"}`,
      );
    }
    return { sent: true, provider: "vly" };
  }

  console.warn(
    "[email] No email provider configured (RESEND_API_KEY / VLY_INTEGRATION_KEY) — email NOT sent:",
    subject,
    "→",
    to,
  );
  return { sent: false, provider: "none" };
}

function layout(title: string, bodyHtml: string): string {
  const base = siteUrl();
  const link = base || "https://edueyedia.com";
  return `<!doctype html>
<html lang="bn">
<body style="margin:0;padding:0;background:#FAFAF6;font-family:'Inter','Hind Siliguri',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF6;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" maxwidth="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #E2E8F0;border-radius:20px;overflow:hidden;">
        <tr>
          <td style="padding:28px 32px 20px;background:#152238;">
            <p style="margin:0;color:#D6A84B;font-size:15px;font-weight:800;letter-spacing:4px;">EDUEYEDIA</p>
            <p style="margin:4px 0 0;color:#9fb2c8;font-size:11px;font-weight:600;letter-spacing:2px;">RESEARCH · LEARN · ADVANCE</p>
          </td>
        </tr>
        <tr><td style="padding:28px 32px 8px;">
          <h1 style="margin:0 0 12px;color:#152238;font-size:22px;line-height:1.3;font-family:'DM Serif Display',Georgia,serif;">${title}</h1>
          ${bodyHtml}
        </td></tr>
        <tr>
          <td style="padding:16px 32px 28px;border-top:1px solid #E2E8F0;">
            <p style="margin:0 0 4px;color:#64748B;font-size:12px;line-height:1.6;">
              Questions? Reply to this email or write to
              <a href="mailto:${SUPPORT_EMAIL}" style="color:#0F766E;font-weight:600;text-decoration:none;">${SUPPORT_EMAIL}</a>.
            </p>
            <p style="margin:0;color:#94a3b8;font-size:11px;">© ${new Date().getFullYear()} Edueyedia — জ্ঞানকে সহজ করি, সম্ভাবনাকে এগিয়ে নিই।</p>
            <p style="margin:6px 0 0;font-size:11px;color:#94a3b8;"><a href="${link}" style="color:#0F766E;text-decoration:none;">${link}</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* --------------------------- order confirmation -------------------- */

export const sendOrderConfirmation = action({
  args: { orderId: v.id("orders") },
  handler: async (
    ctx,
    { orderId },
  ): Promise<{ sent: boolean }> => {
    const order = await ctx.runQuery(api.emailData.orderForEmail, { orderId });
    if (order === null) return { sent: false as const };
    const base = siteUrl();
    const dashboard = `${base}/dashboard`;
    const courses = order.hasCourses ? `${base}/courses` : null;

    const itemsHtml = order.items
      .map(
        (i) =>
          `<tr>
             <td style="padding:8px 0;color:#334155;font-size:14px;">${
               i.kind === "course" ? "🎓 " : "📕 "
             }${escapeHtml(i.title)}</td>
             <td align="right" style="padding:8px 0;color:#152238;font-size:14px;font-weight:600;">৳${i.price}</td>
           </tr>`,
      )
      .join("");

    const body = `
      <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.7;">প্রিয় ${escapeHtml(order.contactName)},</p>
      <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.7;">
        আপনার অর্ডার <strong>#${escapeHtml(order.orderRef)}</strong> নিশ্চিত হয়েছে এবং পেমেন্ট যাচাই করা হয়েছে। আপনার কেনা
        রিসোর্স ও কোর্স এখন <strong>My Library / My Courses</strong>-এ প্রস্তুত।
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:12px;margin:0 0 16px;">
        <tr><td style="padding:14px 16px;background:#F3F6F8;font-size:11px;font-weight:700;letter-spacing:1px;color:#64748B;">ORDER SUMMARY</td></tr>
        ${itemsHtml}
        <tr>
          <td style="padding:10px 16px;border-top:1px solid #E2E8F0;color:#152238;font-size:14px;font-weight:700;">Total</td>
          <td align="right" style="padding:10px 16px;border-top:1px solid #E2E8F0;color:#152238;font-size:15px;font-weight:700;">৳${order.total}</td>
        </tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
        <tr>
          <td style="background:#0F766E;border-radius:999px;padding:12px 24px;">
            <a href="${dashboard}" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Open my library</a>
          </td>
          ${courses ? `<td style="padding-left:10px;background:#152238;border-radius:999px;padding:12px 24px;">
            <a href="${courses}" style="color:#D6A84B;font-size:14px;font-weight:700;text-decoration:none;">My courses</a>
          </td>` : ""}
        </tr>
      </table>
      <p style="margin:0;color:#64748B;font-size:12px;line-height:1.7;">
        এই ইমেইলটি শুধু তথ্যের জন্য — কোনো গেটওয়ে সিক্রেট বা ব্যক্তিগত পেমেন্ট তথ্য এতে থাকে না।
      </p>`;

    return await deliver(order.contactEmail, `Order confirmed — #${order.orderRef}`, layout("Order confirmed ✓", body));
  },
});

/* ------------------------------ resource ready --------------------- */

export const sendResourceReady = action({
  args: {
    resourceId: v.string(),
    email: v.string(),
  },
  handler: async (
    ctx,
    { resourceId, email },
  ): Promise<{ sent: boolean }> => {
    if (!email) return { sent: false as const };
    const resource = await ctx.runQuery(api.emailData.resourceForEmail, {
      slug: resourceId,
    });
    if (resource === null) return { sent: false as const };
    const base = siteUrl();
    const dashboard = `${base}/dashboard`;

    const body = `
      <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.7;">
        আপনার ফ্রি রিসোর্সটি এখন লাইব্রেরিতে প্রস্তুত: <strong>${resource.title}</strong>।
      </p>
      <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.7;">
        সাইন ইন করে <strong>My Library</strong> থেকে যেকোনো সময় ডাউনলোড করতে পারবেন।
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#0F766E;border-radius:999px;padding:12px 24px;">
            <a href="${dashboard}" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Open my library</a>
          </td>
        </tr>
      </table>`;

    return await deliver(email, `Your Edueyedia resource is ready — ${resource.title}`, layout("Your resource is ready ✓", body));
  },
});

/* --------------------------- course enrollment --------------------- */

export const sendCourseEnrollment = action({
  args: {
    courseId: v.id("courses"),
    email: v.string(),
  },
  handler: async (
    ctx,
    { courseId, email },
  ): Promise<{ sent: boolean }> => {
    if (!email) return { sent: false as const };
    const row = await ctx.runQuery(api.emailData.courseForEmail, { courseId });
    const title = row?.title ?? "your course";
    const base = siteUrl();
    const learn = row ? `${base}/courses/${row.slug}/learn` : `${base}/courses`;

    const body = `
      <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.7;">
        অভিনন্দন! আপনি <strong>${title}</strong> কোর্সে এনরোল করেছেন। শেখা শুরু করতে
        <strong>My Courses</strong>-এ গিয়ে প্রথম লেসনটি খুলুন।
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#0F766E;border-radius:999px;padding:12px 24px;">
            <a href="${learn}" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Start learning</a>
          </td>
        </tr>
      </table>`;

    return await deliver(email, `Enrolled — ${title}`, layout("Enrollment confirmed ✓", body));
  },
});

/* --------------------------- newsletter welcome -------------------- */

export const sendNewsletterWelcome = action({
  args: {
    email: v.string(),
    unsubscribeToken: v.string(),
  },
  handler: async (
    ctx,
    { email, unsubscribeToken },
  ): Promise<{ sent: boolean }> => {
    if (!email) return { sent: false as const };
    const base = siteUrl();
    const unsubscribeUrl = `${base}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;

    const body = `
      <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.7;">
        ধন্যবাদ! আপনি এখন <strong>Edueyedia Letter</strong>-এর সদস্য। গবেষণা
        ইনসাইট, স্কলারশিপ সুযোগ এবং নতুন প্রকাশনা — মাসে একবার, কোনো স্প্যাম নেই।
      </p>
      <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.7;">
        This is the English edition of the same letter — research insights,
        scholarship opportunities and new Edueyedia publications.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#0F766E;border-radius:999px;padding:12px 24px;">
            <a href="${base}/research" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Explore the Research Hub</a>
          </td>
        </tr>
      </table>
      <p style="margin:24px 0 0;color:#94a3b8;font-size:11px;line-height:1.6;">
        You can unsubscribe anytime:
        <a href="${unsubscribeUrl}" style="color:#0F766E;text-decoration:none;">Unsubscribe from the Edueyedia Letter</a>.
      </p>`;

    return await deliver(
      email,
      "Welcome to the Edueyedia Letter",
      layout("Welcome to the Edueyedia Letter ✓", body),
    );
  },
});

/* --------------------------- contact notification ------------------ */

export const sendContactNotification = action({
  args: {
    name: v.string(),
    email: v.string(),
    topic: v.string(),
    message: v.string(),
  },
  handler: async (
    ctx,
    { name, email, topic, message },
  ): Promise<{ sent: boolean; skipped?: boolean }> => {
    const to = (process.env.CONTACT_EMAIL ?? "").trim();
    if (!to) {
      console.warn(
        "[email] CONTACT_EMAIL not set — staff notification skipped for contact from",
        email,
      );
      return { sent: false as const, skipped: true as const };
    }

    const body = `
      <p style="margin:0 0 12px;color:#334155;font-size:14px;line-height:1.7;">
        New contact form submission on <strong>Edueyedia</strong>.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:12px;margin:0 0 16px;">
        <tr><td style="padding:10px 16px;color:#152238;font-size:13px;font-weight:600;">Name</td><td style="padding:10px 16px;color:#334155;font-size:13px;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:10px 16px;color:#152238;font-size:13px;font-weight:600;">Email</td><td style="padding:10px 16px;color:#334155;font-size:13px;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:10px 16px;color:#152238;font-size:13px;font-weight:600;">Topic</td><td style="padding:10px 16px;color:#334155;font-size:13px;">${escapeHtml(topic)}</td></tr>
        <tr><td colspan="2" style="padding:10px 16px;color:#152238;font-size:13px;font-weight:600;">Message</td></tr>
        <tr><td colspan="2" style="padding:0 16px 14px;color:#334155;font-size:13px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</td></tr>
      </table>
      <p style="margin:0;color:#94a3b8;font-size:11px;">Reply from the Admin → Inbox in the Edueyedia console.</p>`;

    try {
      return await deliver(
        to,
        `New contact message — ${escapeHtml(topic) || "General"}`,
        layout("New contact message", body),
      );
    } catch (err) {
      // A notification failure must never surface to the visitor — the
      // message is already stored in Convex. Log and report honestly.
      console.warn("[email] Contact notification failed:", err);
      return { sent: false as const };
    }
  },
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
