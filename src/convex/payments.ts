"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/* ------------------------------------------------------------------ */
/*  SSLCommerz payment gateway — live payment support for Edueyedia.   */
/*                                                                     */
/*  The flow:                                                          */
/*    1. Checkout creates a pending order (library.createOrder).       */
/*    2. createPaymentSession starts a gateway session; when no        */
/*       SSLCOMMERZ_* credentials are configured it reports            */
/*       { mode: "sandbox" } so the app keeps using the demo path.     */
/*    3. After the customer pays, the browser returns to /checkout     */
/*       with val_id/tran_id params. convex/http.ts verifies the       */
/*       transaction against SSLCommerz via                            */
/*       validateSslcommerzTransaction and completes the order         */
/*       server-side. The same check runs for the IPN callback.        */
/*                                                                     */
/*  Env vars (set in the project's Keys tab):                          */
/*    SSLCOMMERZ_STORE_ID       — store id (e.g. demotestbox)          */
/*    SSLCOMMERZ_STORE_PASSWORD — store password                       */
/*    SSLCOMMERZ_MODE           — "live" for production, else sandbox  */
/* ------------------------------------------------------------------ */

const LIVE_INIT_URL = "https://securepay.sslcommerz.com/gwprocess/v4/api.php";
const SANDBOX_INIT_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const LIVE_VALIDATE_URL =
  "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";
const SANDBOX_VALIDATE_URL =
  "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

const isLiveMode = () => process.env.SSLCOMMERZ_MODE === "live";

const initApiUrl = () => (isLiveMode() ? LIVE_INIT_URL : SANDBOX_INIT_URL);
const validationApiUrl = () =>
  isLiveMode() ? LIVE_VALIDATE_URL : SANDBOX_VALIDATE_URL;

const getCredentials = () => ({
  storeId: process.env.SSLCOMMERZ_STORE_ID ?? "",
  storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD ?? "",
});

/** SHA-256 hex digest (WebCrypto is available in every Convex runtime). */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function formEncode(params: Record<string, string | number>): string {
  return new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  ).toString();
}

/**
 * Start an SSLCommerz payment session for a pending order.
 *
 * The amount and item list are read from the server-side order row — the
 * client never decides how much to pay. Returns `{ mode: "sandbox" }` when
 * the gateway is not configured yet, so the app falls back to the demo
 * verification path without any code change at checkout.
 */
export const createPaymentSession = action({
  args: {
    orderId: v.id("orders"),
    contactName: v.string(),
    contactEmail: v.string(),
    contactMobile: v.optional(v.string()),
    /** Origin of the web app — where the customer returns after paying. */
    returnUrl: v.string(),
    /** Convex deployment URL, used to build the IPN callback address. */
    convexUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const { storeId, storePassword } = getCredentials();
    if (!storeId || !storePassword) {
      return { mode: "sandbox" as const };
    }

    const order = await ctx.runQuery(api.library.getOrderForCheckout, {
      orderId: args.orderId,
    });
    if (!order || order.status !== "pending") {
      throw new Error("Order not found or already processed.");
    }

    if (!args.contactMobile?.trim()) {
      throw new Error(
        "A mobile number is required to pay with bKash, Nagad or card.",
      );
    }

    const phone = args.contactMobile.trim().replace(/\D/g, "");
    const customerPhone = phone.length >= 11 ? phone : `0${phone}`;

    const payload = {
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: order.total.toFixed(2),
      currency: "BDT",
      tran_id: order._id,
      product_category: "Digital Publications",
      product_name: "Edueyedia digital resources",
      num_of_item: order.resourceIds.length,
      cus_name: args.contactName.trim().slice(0, 100),
      cus_email: args.contactEmail.trim().slice(0, 254),
      cus_phone: customerPhone,
      cus_country: "Bangladesh",
      shipping_method: "NO",
      // The gateway appends val_id / tran_id / status to these URLs, so the
      // /checkout page can verify the payment on return.
      success_url: `${args.returnUrl}/checkout`,
      fail_url: `${args.returnUrl}/checkout`,
      cancel_url: `${args.returnUrl}/checkout`,
      ipn_url: `${args.convexUrl}/payments/sslcommerz/ipn`,
    };

    let data: { status?: string; GatewayPageURL?: string; failedreason?: string };
    try {
      const response = await fetch(initApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formEncode(payload),
      });
      data = (await response.json()) as typeof data;
    } catch {
      throw new Error(
        "Could not reach the payment gateway. Please try again in a moment.",
      );
    }

    if (data.status !== "success" || !data.GatewayPageURL) {
      throw new Error(
        data.failedreason || "Could not start the payment session.",
      );
    }

    return { mode: "live" as const, gatewayPageUrl: data.GatewayPageURL };
  },
});

/**
 * Server-side check of a completed SSLCommerz transaction.
 *
 * Only the backend holds the store credentials, so only it can confirm that
 * a val_id corresponds to a real VALID payment. On success it returns a
 * `proof` — a hash of server-only secrets plus the order/transaction ids —
 * which library.completeVerifiedOrder re-derives before unlocking content.
 * A client cannot forge this proof, so directly calling the completion
 * mutation cannot bypass payment.
 */
export const validateSslcommerzTransaction = action({
  args: {
    orderId: v.string(),
    valId: v.string(),
  },
  handler: async (_ctx, { orderId, valId }) => {
    const { storeId, storePassword } = getCredentials();
    if (!storeId || !storePassword) {
      return { ok: false as const, message: "Live gateway is not configured." };
    }

    const query = new URLSearchParams({
      val_id: valId,
      store_id: storeId,
      store_passwd: storePassword,
      format: "json",
    });

    let data: { status?: string; tran_id?: string };
    try {
      const response = await fetch(`${validationApiUrl()}?${query.toString()}`);
      data = (await response.json()) as typeof data;
    } catch {
      return {
        ok: false as const,
        message: "Could not reach the payment gateway to verify the payment.",
      };
    }

    if (data.status !== "VALID" || data.tran_id !== orderId) {
      return {
        ok: false as const,
        message: "The payment could not be verified as completed.",
      };
    }

    const proof = await sha256Hex(
      `${storeId}|${storePassword}|${orderId}|${valId}`,
    );
    return { ok: true as const, proof };
  },
});
