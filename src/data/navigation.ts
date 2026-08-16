import type { Article } from "./catalog";

/**
 * Where a given article lives in the Edueyedia information architecture:
 * research-centred content → /research/:slug, everything else → /blog/:slug.
 */
export const articlePath = (article: Pick<Article, "category" | "slug">) =>
  article.category === "research"
    ? `/research/${article.slug}`
    : `/blog/${article.slug}`;

/** Legacy URL redirects (see src/main.tsx). */
export const LEGACY_ARTICLE_ROUTES = {
  "/insights": "/blog",
  "/learn": "/blog",
} as const;
