import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

/*
 * Security headers.
 *
 * The safe headers below (nosniff, referrer, permissions, HSTS) can be
 * applied to every response without any risk to the app, the Freebuff
 * preview iframe or course embeds.
 *
 * Content-Security-Policy is intentionally NOT enabled yet. A broken CSP
 * would break the app silently and cannot be verified from this terminal
 * (no browser). When the production domain is live, enable a policy like:
 *
 *   Content-Security-Policy:
 *     default-src 'self';
 *     script-src 'self';
 *     style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
 *     font-src 'self' https://fonts.gstatic.com data:;
 *     img-src 'self' data: https: blob:;
 *     connect-src 'self' https://*.convex.cloud wss://*.convex.cloud
 *       https://freebuff.com https://auth.freebuff.app;
 *     frame-src https://www.youtube.com https://www.youtube-nocookie.com;
 *     worker-src 'self' blob:;
 *     object-src 'none';
 *     base-uri 'self';
 *     form-action 'self'
 *
 * Frame protection must be a CSP `frame-ancestors` directive listing the
 * real preview/production origins (freebuff.com, *.vly.sh and the final
 * domain) — an X-Frame-Options header would block the Freebuff preview
 * iframe. HSTS is already set below; add `includeSubDomains; preload`
 * through the production CDN once the domain and HTTPS are live.
 */
app.use("*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  c.header("Strict-Transport-Security", "max-age=31536000");
});

// 1) Serve anything in /assets/**
app.use("/assets/*", serveStatic({ root: "./dist/assets" }));

// 2) Catch *all* other files in dist (CSS, JS, images, etc.)
app.use("*", serveStatic({ root: "./dist" }));

// 3) Fallback to index.html for the SPA
app.get("*", serveStatic({ path: "./dist/index.html" }));

Deno.serve(app.fetch);
