"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/* ------------------------------------------------------------------ */
/*  Transactional email.                                               */
/*                                                                    */
/*  Provider: Resend when RESEND_API_KEY is configured. Without a key  */
/*  the actions log clearly and return { sent: false } — the app never  */
/*  claims an email was delivered. Set RESEND_API_KEY in the project's */
/*  Keys tab to activate real delivery.                                */
/*                                                                    */
/*  Emails are scheduled server-side (ctx.scheduler.runAfter) after    */
/*  verified events, so a payment can never be blocked on delivery and */
/*  a failed send can never undo a purchase.                           */
/* ------------------------------------------------------------------ */

const FROM_NAME = "Edueyedia";
const SUPPORT_EMAIL = "hello@edueyedia.com";

const siteUrl = () => (process.env.SITE_URL ?? "").replace(/\/$/, "");

function hasProvider(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

async function deliver(
  to: string,
  subject: string,
  html: string,
): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY ?? "";
  if (!key) {
    console.warn(
      "[email] No RESEND_API_KEY configured — email NOT sent:",
      subject,
      "→",
      to,
    );
    return { sent: false };
  }
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
  return { sent: true };
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
    const dashboard = base ? `${base}/dashboard` : "/dashboard";
    const courses = order.hasCourses ? `${base ? base : ""}/courses` : null;

    const itemsHtml = order.items
      .map(
        (i) =>
          `<tr>
             <td style="padding:8px 0;color:#334155;font-size:14px;">${
               i.kind === "course" ? "🎓 " : "📕 "
             }${i.title}</td>
             <td align="right" style="padding:8px 0;color:#152238;font-size:14px;font-weight:600;">৳${i.price}</td>
           </tr>`,
      )
      .join("");

    const body = `
      <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.7;">প্রিয় ${order.contactName},</p>
      <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.7;">
        আপনার অর্ডার <strong>#${order.orderRef}</strong> নিশ্চিত হয়েছে এবং পেমেন্ট যাচাই করা হয়েছে। আপনার কেনা
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
    const dashboard = base ? `${base}/dashboard` : "/dashboard";

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
    const learn = row ? `${base ? base : ""}/courses/${row.slug}/learn` : `${base ? base : ""}/courses`;

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
