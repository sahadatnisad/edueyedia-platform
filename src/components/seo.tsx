import { useEffect } from "react";

/**
 * Canonical site base used for canonical URLs, OG URLs and JSON-LD. In
 * production the backend's SITE_URL is authoritative; the frontend falls
 * back to the brand domain (never a temporary Vly/Freebuff preview URL).
 */
const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://edueyedia.com"
).replace(/\/$/, "");

interface PageMetaProps {
  /** Unique <title> for this route. */
  title: string;
  /** Unique meta description for this route. */
  description?: string;
  /** Route path, e.g. "/resources/my-guide" (defaults to "/"). */
  path?: string;
  /** Optional JSON-LD object or array for structured data. */
  jsonLd?: object | object[];
  /** OG image — absolute URL or root-relative path (defaults to the logo). */
  image?: string;
  /** Open Graph type (website / article / product). */
  type?: string;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Per-page SEO: sets a unique title, meta description, canonical URL,
 * Open Graph tags and structured data. Renders nothing. Each route calls
 * it with its own data so every public page has unique metadata (and the
 * previous route's tags are overwritten, never duplicated).
 */
export function PageMeta({
  title,
  description,
  path = "/",
  jsonLd,
  image = "/og.png",
  type = "website",
}: PageMetaProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path === "/" ? "" : path}`;

    document.title = title;
    if (description) upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta(
      "property",
      "og:image",
      image.startsWith("http") ? image : `${SITE_URL}${image}`,
    );
    upsertMeta("property", "og:site_name", "Edueyedia");
    if (description) upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:card", "summary_large_image");

    // Canonical
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Structured data (replace previous route's blocks only)
    document
      .querySelectorAll("script[data-page-jsonld]")
      .forEach((s) => s.remove());
    const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    for (const block of blocks) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-page-jsonld", "true");
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
    }
  }, [title, description, path, image, type, jsonLd]);

  return null;
}

/** Organization structured data (used on the homepage). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Edueyedia",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/og.svg`,
    slogan: "Research. Learn. Advance.",
    description:
      "গবেষণা, শিক্ষা ও সুযোগের বিশ্বস্ত ডিজিটাল প্ল্যাটফর্ম — research guides, scholarships, academic writing and study-abroad resources in Bangla.",
  };
}

/** Breadcrumb structured data for a page within a section. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
