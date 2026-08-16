import { query } from "./_generated/server";

/**
 * Public payment-gateway status — exposes no secrets. The checkout UI uses
 * this to decide whether a real SSLCommerz session can start and to show
 * honest messaging when the gateway is not configured yet.
 */
export const gatewayStatus = query({
  args: {},
  handler: async () => {
    const storeId = process.env.SSLCOMMERZ_STORE_ID ?? "";
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD ?? "";
    const configured = Boolean(storeId && storePassword);
    return {
      configured,
      mode: process.env.SSLCOMMERZ_MODE === "live" ? "live" : "sandbox",
      demoEnabled: process.env.ALLOW_SANDBOX_PAYMENTS === "true",
    };
  },
});
