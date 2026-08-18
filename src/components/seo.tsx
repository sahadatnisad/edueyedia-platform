import { useEffect } from "react";

const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://nctbhub.com"
).replace(/\/$/, "");

interface PageMetaProps {
  title: string;
  description?: string;
  path?: string;
  jsonLd?: object | object[];
  image?: string;
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
    upsertMeta("property", "og:site_name", "NCTB AI Learning Hub");
    if (description) upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:card", "summary_large_image");

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NCTB AI Learning Hub",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description:
      "Lesson-by-lesson digital companion to the NCTB curriculum.",
  };
}
