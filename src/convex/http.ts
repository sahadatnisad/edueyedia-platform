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
    console.warn(
      "[payments/verify] Sandbox verification for order",
      orderId,
      "— no live payment gateway configured.",
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
