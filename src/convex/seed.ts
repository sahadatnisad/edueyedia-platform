import { mutation } from "./_generated/server";
import {
  articles,
  resources as legacyResources,
  scholarships as legacyScholarships,
  collections as legacyCollections,
  RESEARCH_TOPICS,
} from "../data/catalog";
import { extraArticles } from "../data/extraArticles";
import { courses as legacyCourses } from "../data/courses";

/* ------------------------------------------------------------------ */
/*  One-shot migration from the legacy static catalog into Convex.     */
/*                                                                    */
/*  Run via the admin dashboard ("Seed legacy catalog") or with        */
/*  `npx convex run seed.seedFromLegacyCatalog` once a deployment is   */
/*  configured. It refuses to run when content already exists, so it   */
/*  is safe to call repeatedly.                                       */
/*                                                                    */
/*  Fictional content is NOT migrated: resource reviews are dropped    */
/*  (the UI already shows an honest "no reviews yet" state) and        */
/*  scholarship deadlines are replaced with an explicit "verify on     */
/*  the official site" marker instead of fabricated dates.            */
/* ------------------------------------------------------------------ */

const NOW = Date.now();

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

function resourceType(category: string, isFree: boolean): "PDF" | "Template" | "Checklist" | "Guide" | "Bundle" {
  if (category === "bundles") return "Bundle";
  if (isFree) return "Template";
  return "Guide";
}

export const seedFromLegacyCatalog = mutation({
  args: {},
  handler: async (ctx) => {
    // One-shot guard: never run twice.
    const existing = await ctx.db.query("resources").first();
    if (existing !== null) {
      return {
        seeded: false,
        reason: "Content already exists — seed is a one-shot migration.",
      };
    }

    /* ------------------------- categories ------------------------- */
    const categories = [
      { slug: "research", name: "Research", nameBn: "গবেষণা", position: 1 },
      { slug: "scholarships", name: "Scholarships", nameBn: "স্কলারশিপ", position: 2 },
      { slug: "study-abroad", name: "Study Abroad", nameBn: "বিদেশে উচ্চশিক্ষা", position: 3 },
      { slug: "academic-writing", name: "Academic Writing", nameBn: "অ্যাকাডেমিক রাইটিং", position: 4 },
      { slug: "thesis", name: "Thesis", nameBn: "থিসিস", position: 5 },
      { slug: "templates", name: "Templates", nameBn: "টেমপ্লেট", position: 6 },
      { slug: "career", name: "Career", nameBn: "ক্যারিয়ার", position: 7 },
      { slug: "bundles", name: "Bundles", nameBn: "প্যাকেজ", position: 8 },
    ] as const;
    for (const c of categories) {
      await ctx.db.insert("resourceCategories", {
        slug: c.slug,
        name: c.name,
        nameBn: c.nameBn,
        position: c.position,
        status: "published",
      });
    }

    /* --------------------------- authors --------------------------- */
    const authorId = await ctx.db.insert("authors", {
      name: "Edueyedia Editorial Desk",
      role: "Editorial Team",
      bio: "The Edueyedia editorial team curates, writes and fact-checks every guide and article before publication.",
      credentials: [],
      status: "published",
      createdAt: NOW,
      updatedAt: NOW,
    });

    /* -------------------------- resources -------------------------- */
    for (const r of legacyResources) {
      const isFree = r.kind === "free";
      await ctx.db.insert("resources", {
        slug: r.slug,
        title: r.title,
        titleBn: r.titleBn,
        shortDescription: r.summary,
        description: r.description,
        categoryId: r.category === "academic-writing" || r.category === "study-abroad" || r.category === "career" || r.category === "research" || r.category === "scholarships" || r.category === "bundles"
          ? r.category
          : "research",
        tags: [r.tag],
        type: resourceType(r.category, isFree),
        price: isFree ? 0 : r.price,
        compareAt: r.compareAt,
        currency: "BDT",
        isFree,
        format: r.format,
        language: r.language,
        pageCount: r.pages,
        coverTone: r.cover.tone,
        coverPattern: r.cover.pattern,
        coverGlyph: r.cover.glyph,
        includes: r.includes,
        audience: r.audience,
        previewPages: r.previewPages,
        faqs: r.faqs,
        // Fictional reviews are deliberately NOT migrated.
        reviews: [],
        related: r.related,
        bundleItems: r.bundleItems,
        status: "published",
        featured: r.featured ?? false,
        popular: r.popular ?? false,
        bestseller: r.bestseller ?? false,
        publishedAt: NOW,
        updatedAt: NOW,
        seoTitle: r.title,
        metaDescription: r.summary,
        createdBy: undefined,
        createdAt: NOW,
      });
    }

    /* -------------------------- articles --------------------------- */
    const allArticles = [...articles, ...extraArticles];
    for (const a of allArticles) {
      const common = {
        slug: a.slug,
        title: a.title,
        titleBn: a.titleBn,
        excerpt: a.excerpt,
        tags: a.keywords ?? [],
        featured: a.featured ?? false,
        readingTime: a.readingTime,
        blocks: a.blocks,
        relatedResources: a.relatedResources ?? [],
        relatedCourses: [] as string[],
        status: "published" as const,
        publishedAt: Date.parse(a.date) || NOW,
        updatedAt: NOW,
        seoTitle: a.title,
        metaDescription: a.excerpt,
        createdBy: undefined,
        createdAt: NOW,
      };

      if (a.category === "research") {
        const topic = RESEARCH_TOPICS.find((t) => t.id === a.contentType);
        await ctx.db.insert("researchArticles", {
          ...common,
          contentType: a.contentType ?? topic?.id ?? "research-guide",
          categoryLabel: "Research",
          authorId,
          editorId: undefined,
          references: [],
          doiLinks: [],
          externalSources: [],
        });
      } else {
        await ctx.db.insert("blogPosts", {
          ...common,
          category: a.category,
          categoryLabel: a.categoryLabel,
          authorId,
        });
      }
    }

    /* --------------------------- courses ---------------------------- */
    for (const c of legacyCourses) {
      const courseId = await ctx.db.insert("courses", {
        slug: c.slug,
        title: c.title,
        titleBn: c.titleBn,
        shortDescription: c.shortDescription,
        description: c.description,
        category: c.category,
        categoryBn: c.categoryBn,
        level: c.level,
        duration: c.duration,
        instructorId: authorId,
        price: c.price,
        compareAt: c.compareAt,
        isFree: c.isFree,
        status: c.status, // coming-soon — matches the approved public state
        featured: false,
        whatYouLearn: c.whatYouLearn,
        audience: c.audience,
        prerequisites: [],
        coverTone: c.cover.tone,
        coverPattern: c.cover.pattern,
        coverGlyph: c.cover.glyph,
        publishedAt: NOW,
        updatedAt: NOW,
        seoTitle: c.title,
        metaDescription: c.shortDescription,
        createdBy: undefined,
        createdAt: NOW,
      });

      for (const [mi, mod] of c.modules.entries()) {
        const moduleId = await ctx.db.insert("courseModules", {
          courseId,
          title: mod.title,
          position: mi,
          status: "published",
        });
        for (const [li, lessonTitle] of mod.lessons.entries()) {
          await ctx.db.insert("courseLessons", {
            courseId,
            moduleId,
            title: lessonTitle,
            slug: `${c.slug}-${slugify(lessonTitle)}-${mi}-${li}`,
            lessonType: "text",
            position: li,
            isPreview: mi === 0,
            status: "published",
          });
        }
      }
    }

    /* ------------------------- site settings ------------------------ */
    await ctx.db.insert("siteSettings", {
      key: "scholarships",
      updatedAt: NOW,
      value: legacyScholarships.map((s) => ({
        slug: s.slug,
        country: s.country,
        region: s.region,
        name: s.name,
        degree: s.degree,
        funding: s.funding,
        fullyFunded: s.fullyFunded,
        // Fabricated deadlines are replaced with an honest marker.
        deadline: "",
      })),
    });

    await ctx.db.insert("siteSettings", {
      key: "collections",
      updatedAt: NOW,
      value: legacyCollections,
    });

    return {
      seeded: true,
      resources: legacyResources.length,
      researchArticles: allArticles.filter((a) => a.category === "research").length,
      blogPosts: allArticles.filter((a) => a.category !== "research").length,
      courses: legacyCourses.length,
    };
  },
});
