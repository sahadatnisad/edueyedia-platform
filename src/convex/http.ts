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
 * "paid" when this endpoint processes a verified payment. This is where a
 * payment gateway's server-to-server confirmation (e.g. SSLCommerz IPN /
 * status API) is checked using credentials from the environment.
 *
 * Until a live gateway is configured, this endpoint accepts an explicit
 * `gateway: "sandbox"` verification so the purchase flow can be exercised
 * end-to-end during development. No real money moves, and the response says
 * so (`sandbox: true`). Once SSLCOMMERZ_* credentials are present, sandbox
 * verifications are rejected by the completing mutation.
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

    // Decide the verification mode. When gateway credentials are configured
    // this branch must perform the real gateway status check; the sandbox
    // path exists only for development, before a live gateway is connected.
    const gatewayConfigured = Boolean(
      process.env.SSLCOMMERZ_STORE_ID &&
        process.env.SSLCOMMERZ_STORE_PASSWORD,
    );
    const isSandbox = gateway === "sandbox" || !gatewayConfigured;
    const resolvedGateway =
      typeof gateway === "string" && gateway.length > 0
        ? gateway
        : "sandbox";

    if (!isSandbox) {
      return new Response(
        JSON.stringify({
          ok: false,
          error:
            "Live gateway verification is not implemented yet. Configure SSLCommerz credentials and complete the gateway status check.",
        }),
        { status: 501, headers: JSON_HEADERS },
      );
    }

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
          gateway: resolvedGateway,
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

export default http;
