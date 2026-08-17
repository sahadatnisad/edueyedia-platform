import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

const canonicalSite = () =>
  (process.env.SITE_URL ?? "https://edueyedia.com").replace(/\/$/, "");

/** robots.txt — the site is crawlable; sensitive paths stay authorized. */
http.route({
  path: "/robots.txt",
  method: "GET",
  handler: httpAction(async () => {
    const site = canonicalSite();
    return new Response(
      [
        "User-agent: *",
        "Allow: /",
        "",
        `Sitemap: ${site}/sitemap.xml`,
        "",
      ].join("\n"),
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      },
    );
  }),
});

/** sitemap.xml — only published public content, canonical URLs from SITE_URL. */
http.route({
  path: "/sitemap.xml",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const site = canonicalSite();
    const content = await ctx.runQuery(api.content.allPublished);
    const urls: string[] = [
      site,
      `${site}/research`,
      `${site}/resources`,
      `${site}/blog`,
      `${site}/courses`,
      `${site}/about`,
      `${site}/contact`,
      `${site}/faq`,
      `${site}/privacy`,
      `${site}/terms`,
      `${site}/refund-policy`,
      `${site}/digital-product-policy`,
      `${site}/copyright`,
      `${site}/disclaimer`,
    ];
    for (const r of content?.resources ?? []) {
      urls.push(`${site}/resources/${r.slug}`);
    }
    for (const a of content?.research ?? []) {
      urls.push(`${site}/research/${a.slug}`);
    }
    for (const b of content?.blog ?? []) {
      urls.push(`${site}/blog/${b.slug}`);
    }
    for (const c of content?.courses ?? []) {
      urls.push(`${site}/courses/${c.slug}`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url><loc>${url.replace(/&/g, "&amp;")}</loc><changefreq>weekly</changefreq></url>`,
  )
  .join("\n")}
</urlset>`;
    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }),
});

/**
 * Protected file delivery.
 *
 * The client never receives a permanent public file URL. Instead it calls
 * fileActions.getSecureDownload (resources) or getLessonFile (course
 * lessons), which — after server-side entitlement checks — mint a single-use
 * 5-minute token. This endpoint validates that token, verifies the caller's
 * authenticated identity matches the token's owner, and only then streams
 * the stored file and records the download.
 *
 * Denied cases: signed-out callers (401), another user's token (403),
 * expired tokens, already-used tokens, and tokens replayed against a
 * different resource/lesson (422).
 */
http.route({
  path: "/files/download",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const token = url.searchParams.get("token") ?? "";
    const kind = url.searchParams.get("kind") ?? "resource";
    const resourceId = url.searchParams.get("resourceId") ?? undefined;
    const courseId = url.searchParams.get("courseId") ?? undefined;
    const lessonId = url.searchParams.get("lessonId") ?? undefined;

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing download token" }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    // Test A — a signed-out visitor has no identity and is denied.
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return new Response(
        JSON.stringify({ error: "Sign in to download this file." }),
        { status: 401, headers: JSON_HEADERS },
      );
    }

    try {
      const file = await ctx.runMutation(api.files.consumeDownloadToken, {
        token,
        kind: kind as "resource" | "lesson",
        resourceId,
        courseId: courseId as Id<"courses"> | undefined,
        lessonId: lessonId as Id<"courseLessons"> | undefined,
        userId: identity.subject as Id<"users">,
      });

      const blob = await ctx.storage.get(file.storageId);
      if (blob === null) {
        return new Response(
          JSON.stringify({ error: "The file could not be found." }),
          { status: 404, headers: JSON_HEADERS },
        );
      }

      // The file exists — now record the download. This is the ONLY place
      // download recording happens, so phantom records are impossible.
      await ctx.runMutation(api.files.recordDownload, {
        userId: file.userId as Id<"users">,
        resourceId: file.resourceId ?? "",
      });

      const safeName = file.filename.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": file.mimeType || "application/pdf",
          "Content-Disposition": `attachment; filename="${safeName}"`,
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "This download link could not be used.";
      return new Response(JSON.stringify({ error: message }), {
        status: 403,
        headers: JSON_HEADERS,
      });
    }
  }),
});

/**
 * Server-side payment verification.
 *
 * The client never unlocks paid content on its own — an order only becomes
 * "paid" when this endpoint (or the SSLCommerz IPN callback) processes a
 * verified payment.
 *
 * Two modes:
 *  - Sandbox: while no SSLCOMMERZ_* credentials are configured, an explicit
 *    `gateway: "sandbox"` verification is accepted so the purchase flow can
 *    be exercised end-to-end during development. No real money moves and the
 *    response says so (`sandbox: true`).
 *  - Live SSLCommerz: when credentials are configured, a request with
 *    `gateway: "sslcommerz"` plus the gateway's `val_id` is checked against
 *    SSLCommerz's validation API server-side before the order is completed.
 *    A spoofed val_id is rejected because only the backend holds the store
 *    credentials.
 */
http.route({
  path: "/payments/verify",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let body: {
      orderId?: unknown;
      gateway?: unknown;
      transactionId?: unknown;
    };
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid JSON body" }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    const { orderId, gateway, transactionId } = body;
    if (typeof orderId !== "string" || orderId.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing orderId" }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    const gatewayConfigured = Boolean(
      process.env.SSLCOMMERZ_STORE_ID &&
        process.env.SSLCOMMERZ_STORE_PASSWORD,
    );
    const resolvedGateway =
      typeof gateway === "string" && gateway.length > 0
        ? gateway
        : "sandbox";

    /* ------------------- Live SSLCommerz verification ------------------- */
    if (resolvedGateway === "sslcommerz" && gatewayConfigured) {
      if (typeof transactionId !== "string" || transactionId.length === 0) {
        return new Response(
          JSON.stringify({ ok: false, error: "Missing transaction id" }),
          { status: 400, headers: JSON_HEADERS },
        );
      }

      // Check the transaction against SSLCommerz using server-only
      // credentials; this is the real gate against forged callbacks.
      const validation = await ctx.runAction(
        api.payments.validateSslcommerzTransaction,
        {
          orderId,
          valId: transactionId,
        },
      );
      if (!validation.ok) {
        return new Response(
          JSON.stringify({ ok: false, error: validation.message }),
          { status: 422, headers: JSON_HEADERS },
        );
      }

      try {
        const result = await ctx.runMutation(
          api.library.completeVerifiedOrder,
          {
            orderId: orderId as Id<"orders">,
            gateway: "sslcommerz",
            transactionId,
            proof: validation.proof,
          },
        );
        return new Response(
          JSON.stringify({ ...result, gateway: "sslcommerz" }),
          { status: 200, headers: JSON_HEADERS },
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Payment verification failed";
        return new Response(
          JSON.stringify({ ok: false, error: message }),
          { status: 422, headers: JSON_HEADERS },
        );
      }
    }

    /* ------------------- Unknown gateway with live config ---------------- */
    if (gatewayConfigured) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: `Unknown payment gateway "${resolvedGateway}".`,
        }),
        { status: 501, headers: JSON_HEADERS },
      );
    }

    /* ----------------------------- Sandbox path --------------------------- */
    // Development-only: completing an order without a real gateway must be
    // explicitly enabled with ALLOW_SANDBOX_PAYMENTS=true AND never runs in a
    // production deployment (NODE_ENV=production). This path is unreachable
    // in production even if the flag is set by mistake.
    const production = process.env.NODE_ENV === "production";
    if (production || process.env.ALLOW_SANDBOX_PAYMENTS !== "true") {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Demo checkout is disabled. Configure the payment gateway first.",
        }),
        { status: 501, headers: JSON_HEADERS },
      );
    }

    console.warn(
      "[payments/verify] Sandbox verification for order",
      orderId,
      "— development-only path (ALLOW_SANDBOX_PAYMENTS=true).",
    );

    // The actual state change runs server-side in a mutation; the client
    // never performs the unlock itself.
    try {
      const result = await ctx.runMutation(
        api.library.completeVerifiedOrder,
        {
          orderId: orderId as Id<"orders">,
          gateway: "sandbox",
          transactionId:
            typeof transactionId === "string" ? transactionId : undefined,
        },
      );
      return new Response(
        JSON.stringify({ ...result, sandbox: true }),
        { status: 200, headers: JSON_HEADERS },
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment verification failed";
      return new Response(
        JSON.stringify({ ok: false, error: message }),
        { status: 422, headers: JSON_HEADERS },
      );
    }
  }),
});

/**
 * SSLCommerz IPN (Instant Payment Notification) callback.
 *
 * SSLCommerz POSTs form data here after every transaction attempt. We verify
 * the val_id against SSLCommerz's validation API before completing the order,
 * so a forged IPN cannot unlock content. This is a safety net for customers
 * who close the browser before the success redirect — the /checkout return
 * path does the same verification.
 */
http.route({
  path: "/payments/sslcommerz/ipn",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return new Response("bad-request", { status: 200 });
    }

    const status = String(form.get("status") ?? "");
    const tranId = String(form.get("tran_id") ?? "");
    const valId = String(form.get("val_id") ?? "");

    if (status !== "VALID" || !tranId || !valId) {
      // Not a successful payment — acknowledge so the gateway stops retrying.
      return new Response("not-valid", { status: 200 });
    }

    try {
      const validation = await ctx.runAction(
        api.payments.validateSslcommerzTransaction,
        { orderId: tranId, valId },
      );
      if (!validation.ok) {
        return new Response("invalid", { status: 200 });
      }
      await ctx.runMutation(api.library.completeVerifiedOrder, {
        orderId: tranId as Id<"orders">,
        gateway: "sslcommerz",
        transactionId: valId,
        proof: validation.proof,
      });
      return new Response("success", { status: 200 });
    } catch (err) {
      // "not pending" means the order was already completed (e.g. by the
      // return-redirect verification) — treat as success.
      if (err instanceof Error && err.message.includes("not pending")) {
        return new Response("already-paid", { status: 200 });
      }
      // Any other failure: rethrow so SSLCommerz retries the IPN later.
      throw err;
    }
  }),
});

export default http;
