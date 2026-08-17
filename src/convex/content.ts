import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import type {
  Article,
  Category,
  Resource,
} from "../data/catalog";
import type { Course } from "../data/courses";

/* ------------------------------------------------------------------ */
/*  Public content queries — the ONLY way the frontend reads content.  */
/*                                                                    */
/*  Every query here returns shapes compatible with the approved      */
/*  frontend components (Resource / Article / Course), so existing    */
/*  cards and layouts keep working unchanged. Only `published` (and,   */
/*  for courses, `coming-soon`) content is ever exposed publicly.     */
/* ------------------------------------------------------------------ */

export type ResourceRow = Doc<"resources">;
export type ResearchRow = Doc<"researchArticles">;
export type BlogRow = Doc<"blogPosts">;
export type CourseRow = Doc<"courses">;
export type ModuleRow = Doc<"courseModules">;

/* ----------------------------- mapping ---------------------------- */

export function resourceToFrontend(row: ResourceRow): Resource {
  return {
    slug: row.slug,
    title: row.title,
    titleBn: row.titleBn,
    category: row.categoryId as Category,
    tag: row.type.toUpperCase(),
    kind: row.isFree ? "free" : "paid",
    summary: row.shortDescription,
    description: row.description,
    format: row.format,
    language: row.language,
    pages: row.pageCount,
    updated: row.updatedAt
      ? `Updated ${new Date(row.updatedAt).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        })}`
      : "",
    price: row.price,
    compareAt: row.compareAt,
    rating: 0,
    reviewCount: row.reviews.length,
    cover: {
      tone: row.coverTone,
      pattern: row.coverPattern,
      glyph: row.coverGlyph,
    },
    includes: row.includes,
    audience: row.audience,
    previewPages: row.previewPages,
    faqs: row.faqs,
    reviews: row.reviews,
    related: row.related,
    featured: row.featured,
    popular: row.popular,
    bestseller: row.bestseller,
    bundleItems: row.bundleItems,
  };
}

/**
 * Resolve the byline for an article: the real author from the authors
 * table when one is assigned, otherwise the editorial desk fallback.
 * Credentials are only ever shown if an admin actually entered them.
 */
async function resolveAuthor(
  ctx: QueryCtx,
  authorId: Id<"authors"> | undefined,
  fallbackRole: string,
): Promise<{ author: string; authorRole: string }> {
  if (authorId === undefined) {
    return { author: "Edueyedia Editorial", authorRole: fallbackRole };
  }
  const author = await ctx.db.get(authorId);
  if (!author) {
    return { author: "Edueyedia Editorial", authorRole: fallbackRole };
  }
  return { author: author.name, authorRole: author.role || fallbackRole };
}

export async function researchToArticle(
  ctx: QueryCtx,
  row: ResearchRow,
): Promise<Article> {
  const { author, authorRole } = await resolveAuthor(
    ctx,
    row.authorId,
    "Research Desk",
  );
  return {
    slug: row.slug,
    title: row.title,
    titleBn: row.titleBn,
    contentType: row.contentType,
    category: "research",
    categoryLabel: row.categoryLabel || "Research",
    author,
    authorRole,
    date: row.publishedAt
      ? new Date(row.publishedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "",
    readingTime: row.readingTime,
    excerpt: row.excerpt,
    featured: row.featured,
    cover: { tone: "navy", pattern: "nodes", glyph: "R" },
    blocks: row.blocks,
    relatedResources: row.relatedResources,
    keywords: row.tags,
    // Research credibility fields.
    references: row.references,
    doiLinks: row.doiLinks,
    externalSources: row.externalSources,
    // Editor/reviewer byline.
    ...(row.editorId != null
      ? await (async () => {
          const editor = await ctx.db.get(row.editorId!);
          if (!editor || !('name' in editor)) return {};
          return { editorName: (editor as { name?: string }).name ?? "", editorRole: (editor as { role?: string }).role || "Editor" };
        })()
      : {}),
  };
}

export async function blogToArticle(
  ctx: QueryCtx,
  row: BlogRow,
): Promise<Article> {
  const { author, authorRole } = await resolveAuthor(
    ctx,
    row.authorId,
    "Editorial Desk",
  );
  return {
    slug: row.slug,
    title: row.title,
    titleBn: row.titleBn,
    category: row.category as Category,
    categoryLabel: row.categoryLabel || row.category,
    author,
    authorRole,
    date: row.publishedAt
      ? new Date(row.publishedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "",
    readingTime: row.readingTime,
    excerpt: row.excerpt,
    featured: row.featured,
    cover: { tone: "teal", pattern: "paper", glyph: "B" },
    blocks: row.blocks,
    relatedResources: row.relatedResources,
    keywords: row.tags,
  };
}

/** Map a course row to the frontend Course shape, merging modules/lessons. */
export function courseToFrontend(
  row: CourseRow,
  modules: ModuleRow[],
  lessonsByModule: Map<string, { title: string; isPreview: boolean }[]>,
): Course {
  const orderedModules = [...modules].sort((a, b) => a.position - b.position);
  const lessonCount = orderedModules.reduce(
    (sum, m) => sum + (lessonsByModule.get(m._id)?.length ?? 0),
    0,
  );
  return {
    id: row._id as string,
    slug: row.slug,
    title: row.title,
    titleBn: row.titleBn,
    category: row.category,
    categoryBn: row.categoryBn,
    level: row.level,
    duration: row.duration,
    lessonCount,
    isFree: row.isFree,
    price: row.price,
    compareAt: row.compareAt,
    status: row.status as Course["status"],
    shortDescription: row.shortDescription,
    description: row.description,
    whatYouLearn: row.whatYouLearn,
    audience: row.audience,
    cover: {
      tone: row.coverTone,
      pattern: row.coverPattern,
      glyph: row.coverGlyph,
    },
    modules: orderedModules.map((m) => ({
      title: m.title,
      lessons: (lessonsByModule.get(m._id) ?? []).map((l) => l.title),
    })),
  };
}

/* ------------------------------ queries ---------------------------- */

/**
 * Everything the public site needs in one reactive payload:
 * published resources, published research + blog articles, and
 * published/coming-soon courses.
 */
export const allPublished = query({
  args: {},
  handler: async (ctx) => {
    const [resourceRows, researchRows, blogRows, courseRows] =
      await Promise.all([
        ctx.db
          .query("resources")
          .withIndex("status", (q) => q.eq("status", "published"))
          .order("desc")
          .collect(),
        ctx.db
          .query("researchArticles")
          .withIndex("status", (q) => q.eq("status", "published"))
          .order("desc")
          .collect(),
        ctx.db
          .query("blogPosts")
          .withIndex("status", (q) => q.eq("status", "published"))
          .order("desc")
          .collect(),
        ctx.db
          .query("courses")
          .filter((q) =>
            q.or(
              q.eq(q.field("status"), "published"),
              q.eq(q.field("status"), "coming-soon"),
            ),
          )
          .collect(),
      ]);

    // Courses need their modules + lessons.
    const modulesByCourse = new Map<string, ModuleRow[]>();
    for (const course of courseRows) {
      const mods = await ctx.db
        .query("courseModules")
        .withIndex("by_course", (q) => q.eq("courseId", course._id))
        .collect();
      modulesByCourse.set(course._id, mods);
    }
    const lessonsByModule = new Map<string, { title: string; isPreview: boolean }[]>();
    for (const mods of modulesByCourse.values()) {
      for (const mod of mods) {
        const lessons = await ctx.db
          .query("courseLessons")
          .withIndex("by_module", (q) => q.eq("moduleId", mod._id))
          .collect();
        lessonsByModule.set(
          mod._id,
          lessons.map((l) => ({ title: l.title, isPreview: l.isPreview })),
        );
      }
    }

    const resources = resourceRows.map(resourceToFrontend);
    const research = await Promise.all(
      researchRows.map((r) => researchToArticle(ctx, r)),
    );
    const blog = await Promise.all(blogRows.map((b) => blogToArticle(ctx, b)));
    const courses = courseRows.map((c) =>
      courseToFrontend(c, modulesByCourse.get(c._id) ?? [], lessonsByModule),
    );

    return {
      resources,
      research,
      blog,
      courses,
      // Combined article feed, newest published first — matches the legacy
      // frontend shape (research + non-research articles in one array).
      articles: [...research, ...blog],
      updatedAt: Date.now(),
    };
  },
});

/** A single published resource by slug (for product pages). */
export const resourceBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const row = await ctx.db
      .query("resources")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();
    if (!row || row.status !== "published") return null;
    return resourceToFrontend(row);
  },
});

/** A single published article (research or blog) by slug. */
export const articleBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const research = await ctx.db
      .query("researchArticles")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();
    if (research && research.status === "published") {
      return await researchToArticle(ctx, research);
    }
    const blog = await ctx.db
      .query("blogPosts")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();
    if (blog && blog.status === "published") return await blogToArticle(ctx, blog);
    return null;
  },
});

/** A single course (published or coming-soon) with modules and lessons. */
export const courseBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const row = await ctx.db
      .query("courses")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();
    if (!row || (row.status !== "published" && row.status !== "coming-soon")) {
      return null;
    }
    const modules = await ctx.db
      .query("courseModules")
      .withIndex("by_course", (q) => q.eq("courseId", row._id))
      .collect();
    const lessonsByModule = new Map<string, { title: string; isPreview: boolean }[]>();
    for (const mod of modules) {
      const lessons = await ctx.db
        .query("courseLessons")
        .withIndex("by_module", (q) => q.eq("moduleId", mod._id))
        .collect();
      lessonsByModule.set(
        mod._id,
        lessons.map((l) => ({ title: l.title, isPreview: l.isPreview })),
      );
    }
    return courseToFrontend(row, modules, lessonsByModule);
  },
});

/** Published resources by slugs — used by cart, checkout and dashboard. */
export const resourcesBySlugs = query({
  args: { slugs: v.array(v.string()) },
  handler: async (ctx, { slugs }) => {
    if (slugs.length === 0) return [];
    const rows = await ctx.db
      .query("resources")
      .withIndex("status", (q) => q.eq("status", "published"))
      .collect();
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    return slugs
      .map((slug) => bySlug.get(slug))
      .filter((r): r is ResourceRow => r !== undefined)
      .map(resourceToFrontend);
  },
});

/** Resource categories with live published counts. */
export const resourceCategories = query({
  args: {},
  handler: async (ctx) => {
    const cats = await ctx.db.query("resourceCategories").collect();
    const rows = await ctx.db
      .query("resources")
      .withIndex("status", (q) => q.eq("status", "published"))
      .collect();
    const countByCategory = new Map<string, number>();
    const freeCountByCategory = new Map<string, number>();
    for (const r of rows) {
      countByCategory.set(r.categoryId, (countByCategory.get(r.categoryId) ?? 0) + 1);
      if (r.isFree) {
        freeCountByCategory.set(
          r.categoryId,
          (freeCountByCategory.get(r.categoryId) ?? 0) + 1,
        );
      }
    }
    return [...cats]
      .sort((a, b) => a.position - b.position)
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        nameBn: c.nameBn,
        count: countByCategory.get(c.slug) ?? 0,
        freeCount: freeCountByCategory.get(c.slug) ?? 0,
      }));
  },
});

/** Homepage featured selections — all driven by the featured flag in the DB. */
export const featuredHome = query({
  args: {},
  handler: async (ctx) => {
    const [featuredResources, featuredResearch, featuredBlog, featuredCourses] =
      await Promise.all([
        ctx.db
          .query("resources")
          .withIndex("by_featured", (q) =>
            q.eq("featured", true).eq("status", "published"),
          )
          .collect(),
        ctx.db
          .query("researchArticles")
          .withIndex("by_featured", (q) =>
            q.eq("featured", true).eq("status", "published"),
          )
          .collect(),
        ctx.db
          .query("blogPosts")
          .withIndex("by_featured", (q) =>
            q.eq("featured", true).eq("status", "published"),
          )
          .collect(),
        ctx.db
          .query("courses")
          .withIndex("status", (q) => q.eq("status", "published"))
          .collect(),
      ]);

    const featuredCourseRows = featuredCourses
      .filter((c) => c.featured)
      .slice(0, 3);

    const courseModules = await Promise.all(
      featuredCourseRows.map(async (c) => {
        const mods = await ctx.db
          .query("courseModules")
          .withIndex("by_course", (q) => q.eq("courseId", c._id))
          .collect();
        return { course: c, mods };
      }),
    );
    const lessonsByModule = new Map<string, { title: string; isPreview: boolean }[]>();
    for (const { mods } of courseModules) {
      for (const mod of mods) {
        const lessons = await ctx.db
          .query("courseLessons")
          .withIndex("by_module", (q) => q.eq("moduleId", mod._id))
          .collect();
        lessonsByModule.set(
          mod._id,
          lessons.map((l) => ({ title: l.title, isPreview: l.isPreview })),
        );
      }
    }

    return {
      resources: featuredResources.map(resourceToFrontend).slice(0, 6),
      research: (
        await Promise.all(featuredResearch.map((r) => researchToArticle(ctx, r)))
      ).slice(0, 4),
      blog: (
        await Promise.all(featuredBlog.map((b) => blogToArticle(ctx, b)))
      ).slice(0, 4),
      courses: courseModules.map(({ course, mods }) =>
        courseToFrontend(course, mods, lessonsByModule),
      ),
    };
  },
});

/** A single JSON site setting (e.g. scholarships list, collections). */
export const siteSetting = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const row = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    return row?.value ?? null;
  },
});

const normalize = (s: string) => s.toLowerCase().trim();

/** Grouped full-text-ish search across published content. */
export const searchAll = query({
  args: { q: v.string() },
  handler: async (ctx, { q }) => {
    const needle = normalize(q);
    if (needle.length < 2) {
      return { research: [], resources: [], blog: [], courses: [] };
    }

    const matches = (fields: (string | undefined)[]) =>
      fields.some((f) => f && normalize(f).includes(needle));

    const [resourceRows, researchRows, blogRows, courseRows] =
      await Promise.all([
        ctx.db
          .query("resources")
          .withIndex("status", (q) => q.eq("status", "published"))
          .collect(),
        ctx.db
          .query("researchArticles")
          .withIndex("status", (q) => q.eq("status", "published"))
          .collect(),
        ctx.db
          .query("blogPosts")
          .withIndex("status", (q) => q.eq("status", "published"))
          .collect(),
        ctx.db
          .query("courses")
          .filter((fq) =>
            fq.or(
              fq.eq(fq.field("status"), "published"),
              fq.eq(fq.field("status"), "coming-soon"),
            ),
          )
          .collect(),
      ]);

    const resources = resourceRows
      .filter((r) =>
        matches([
          r.title,
          r.titleBn,
          r.shortDescription,
          r.description,
          r.slug,
          ...r.tags,
        ]),
      )
      .map(resourceToFrontend)
      .slice(0, 8);

    const research = (
      await Promise.all(
        researchRows
          .filter((r) =>
            matches([r.title, r.titleBn, r.excerpt, r.slug, ...r.tags]),
          )
          .map((r) => researchToArticle(ctx, r)),
      )
    ).slice(0, 6);

    const blog = (
      await Promise.all(
        blogRows
          .filter((b) =>
            matches([b.title, b.titleBn, b.excerpt, b.slug, ...b.tags]),
          )
          .map((b) => blogToArticle(ctx, b)),
      )
    ).slice(0, 6);

    const courseIds = courseRows
      .filter((c) =>
        matches([c.title, c.titleBn, c.shortDescription, c.slug, c.category]),
      )
      .map((c) => c._id);
    const courseSet = new Set<string>(courseIds.map((id) => id as string));
    const courses = courseRows
      .filter((c) => courseSet.has(c._id as string))
      .slice(0, 6);

    // Attach modules/lessons for matched courses (small dataset).
    const moduleRows = await ctx.db.query("courseModules").collect();
    const modsByCourse = new Map<string, ModuleRow[]>();
    for (const mod of moduleRows) {
      const list = modsByCourse.get(mod.courseId as string) ?? [];
      list.push(mod);
      modsByCourse.set(mod.courseId as string, list);
    }
    const lessonRows = await ctx.db.query("courseLessons").collect();
    const lessonsByModule = new Map<string, { title: string; isPreview: boolean }[]>();
    for (const lesson of lessonRows) {
      const list = lessonsByModule.get(lesson.moduleId as string) ?? [];
      list.push({ title: lesson.title, isPreview: lesson.isPreview });
      lessonsByModule.set(lesson.moduleId as string, list);
    }

    return {
      resources,
      research,
      blog,
      courses: courses.map((c) =>
        courseToFrontend(c, modsByCourse.get(c._id as string) ?? [], lessonsByModule),
      ),
    };
  },
});

/** Whether a lesson is a public preview (used by file access checks). */
export const lessonIsPreview = query({
  args: {
    courseId: v.optional(v.id("courses")),
    lessonId: v.optional(v.id("courseLessons")),
  },
  handler: async (ctx, { courseId, lessonId }) => {
    if (courseId === undefined || lessonId === undefined) return false;
    const lesson = await ctx.db.get(lessonId);
    if (!lesson || lesson.courseId !== courseId) return false;
    return lesson.isPreview === true;
  },
});

/** Course lesson list for a course (public, published lessons only). */
export const courseLessons = query({
  args: { courseId: v.optional(v.id("courses")) },
  handler: async (ctx, { courseId }) => {
    if (courseId === undefined) return [];
    const mods = await ctx.db
      .query("courseModules")
      .withIndex("by_course", (q) => q.eq("courseId", courseId))
      .collect();
    const result: {
      module: ModuleRow;
      lessons: {
        _id: Id<"courseLessons">;
        title: string;
        slug: string;
        lessonType: string;
        isPreview: boolean;
        duration?: string;
      }[];
    }[] = [];
    for (const mod of mods) {
      const lessons = await ctx.db
        .query("courseLessons")
        .withIndex("by_module", (q) => q.eq("moduleId", mod._id))
        .collect();
      result.push({
        module: mod,
        lessons: lessons.map((l) => ({
          _id: l._id,
          title: l.title,
          slug: l.slug,
          lessonType: l.lessonType,
          isPreview: l.isPreview,
          duration: l.duration,
        })),
      });
    }
    return result.sort((a, b) => a.module.position - b.module.position);
  },
});
