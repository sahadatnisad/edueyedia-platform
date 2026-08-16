import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  mutation,
  query,
  MutationCtx,
  QueryCtx,
} from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import {
  articleBlockValidator,
  contentStatusValidator,
  faqValidator,
  previewPageValidator,
  researchTypeValidator,
} from "./schema";

/* ------------------------------------------------------------------ */
/*  Admin backend. Every mutation re-verifies the caller's role        */
/*  server-side — the admin UI is never the security boundary.        */
/* ------------------------------------------------------------------ */

export async function requireAdmin(ctx: MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not signed in.");
  const user = await ctx.db.get(userId);
  if (user?.role !== "admin") throw new Error("Admin access required.");
  return user;
}

export async function requireAdminQuery(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not signed in.");
  const user = await ctx.db.get(userId);
  if (user?.role !== "admin") throw new Error("Admin access required.");
  return user;
}

/** Whether the signed-in user is an admin (for the frontend guard). */
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return false;
    const user = await ctx.db.get(userId);
    return user?.role === "admin";
  },
});

/**
 * Bootstrap: the first user to call this while no admin exists becomes
 * admin. After the first admin exists, non-admins are rejected.
 */
export const ensureFirstAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("You must be signed in.");
    const adminCount = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect();
    if (adminCount.length > 0) {
      const user = await ctx.db.get(userId);
      if (user?.role !== "admin") {
        throw new Error("An admin already exists.");
      }
      return { granted: false };
    }
    await ctx.db.patch(userId, { role: "admin" });
    return { granted: true };
  },
});

/* ------------------------------ helpers ---------------------------- */

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

async function slugExists(
  ctx: MutationCtx,
  table: "resources" | "researchArticles" | "blogPosts" | "courses",
  slug: string,
): Promise<boolean> {
  if (table === "resources")
    return (await ctx.db.query("resources").withIndex("slug", (q) => q.eq("slug", slug)).first()) !== null;
  if (table === "researchArticles")
    return (await ctx.db.query("researchArticles").withIndex("slug", (q) => q.eq("slug", slug)).first()) !== null;
  if (table === "blogPosts")
    return (await ctx.db.query("blogPosts").withIndex("slug", (q) => q.eq("slug", slug)).first()) !== null;
  return (await ctx.db.query("courses").withIndex("slug", (q) => q.eq("slug", slug)).first()) !== null;
}

/** Unique, safe, human-readable slug derived from a title. */
async function uniqueSlug(
  ctx: MutationCtx,
  table: "resources" | "researchArticles" | "blogPosts" | "courses",
  title: string,
): Promise<string> {
  const base = slugify(title);
  if (!base) throw new Error("Could not create a slug from the title.");
  let slug = base;
  let i = 2;
  while (await slugExists(ctx, table, slug)) {
    slug = `${base}-${i++}`;
    if (i > 100) throw new Error("Could not create a unique slug.");
  }
  return slug;
}

async function log(
  ctx: MutationCtx,
  actorId: string | undefined,
  action: string,
  entityType: string,
  entityId: string,
  details?: unknown,
) {
  await ctx.db.insert("auditLogs", {
    actorId: actorId as never,
    action,
    entityType,
    entityId,
    details: details as never,
    createdAt: Date.now(),
  });
}

/* --------------------------- publish guards ------------------------ */

/** Whether a resource has an active main file attached (publish requirement). */
async function resourceHasActiveFile(
  ctx: MutationCtx,
  resourceSlug: string,
): Promise<boolean> {
  const row = await ctx.db
    .query("resourceFiles")
    .withIndex("by_resource", (q) => q.eq("resourceId", resourceSlug))
    .filter((q) =>
      q.and(
        q.eq(q.field("kind"), "main"),
        q.eq(q.field("status"), "active"),
      ),
    )
    .first();
  return row !== null;
}

/**
 * Minimum substantive content for a text lesson before a course may be
 * published — enough to be a real lesson rather than a placeholder.
 */
const MIN_TEXT_LESSON_CHARS = 200;

/** Whether a single lesson carries real content for its lesson type. */
function lessonHasMeaningfulContent(lesson: {
  title: string;
  lessonType: string;
  content?: string;
  videoProvider?: string;
  videoId?: string;
  fileStorageId?: string;
}): boolean {
  if (!lesson.title.trim()) return false;
  switch (lesson.lessonType) {
    case "text":
      return (lesson.content ?? "").trim().length >= MIN_TEXT_LESSON_CHARS;
    case "video":
      return Boolean(lesson.videoId?.trim());
    case "PDF":
    case "downloadable-resource":
      return Boolean(lesson.fileStorageId);
    case "external-embed":
      return Boolean(lesson.videoId?.trim() || (lesson.content ?? "").trim().length >= 50);
    case "quiz":
      return (lesson.content ?? "").trim().length > 0;
    default:
      return false;
  }
}

/**
 * Whether a course is publishable as a real course: at least one module,
 * at least one lesson, and at least one lesson with actual content for its
 * lesson type. A shell of empty placeholder lessons can never be sold.
 */
async function courseHasMeaningfulContent(
  ctx: MutationCtx,
  courseId: Id<"courses">,
): Promise<{ ok: boolean; reason?: string }> {
  const mods = await ctx.db
    .query("courseModules")
    .withIndex("by_course", (q) => q.eq("courseId", courseId))
    .collect();
  if (mods.length === 0) {
    return { ok: false, reason: "Add at least one module before publishing this course." };
  }

  let lessonCount = 0;
  let meaningful = 0;
  for (const mod of mods) {
    const lessons = await ctx.db
      .query("courseLessons")
      .withIndex("by_module", (q) => q.eq("moduleId", mod._id))
      .collect();
    for (const lesson of lessons) {
      lessonCount += 1;
      if (lessonHasMeaningfulContent(lesson)) meaningful += 1;
    }
  }
  if (lessonCount === 0) {
    return { ok: false, reason: "Add at least one lesson before publishing this course." };
  }
  if (meaningful === 0) {
    return {
      ok: false,
      reason:
        "No lesson has real content yet — add text, a video, an embed, or an attached file to at least one lesson before publishing.",
    };
  }
  return { ok: true };
}

/** Enforce course publish rules: content + paid price. */
async function assertCoursePublishable(
  ctx: MutationCtx,
  courseId: Id<"courses">,
  isFree: boolean,
  price: number,
): Promise<void> {
  const content = await courseHasMeaningfulContent(ctx, courseId);
  if (!content.ok) throw new Error(content.reason);
  if (!isFree && price <= 0) {
    throw new Error(
      "A paid course must have a price greater than 0 before it can be published.",
    );
  }
}

/* ------------------------------ validators ------------------------- */

const coverToneValidator = v.union(
  v.literal("navy"),
  v.literal("teal"),
  v.literal("gold"),
  v.literal("ivory"),
  v.literal("graphite"),
  v.literal("moss"),
);
const coverPatternValidator = v.union(
  v.literal("grid"),
  v.literal("dots"),
  v.literal("lines"),
  v.literal("nodes"),
  v.literal("quote"),
  v.literal("bars"),
  v.literal("paper"),
);

const resourceDataValidator = v.object({
  title: v.string(),
  titleBn: v.optional(v.string()),
  shortDescription: v.string(),
  description: v.string(),
  categoryId: v.string(),
  tags: v.array(v.string()),
  type: v.union(
    v.literal("PDF"),
    v.literal("Template"),
    v.literal("Checklist"),
    v.literal("Guide"),
    v.literal("Bundle"),
  ),
  price: v.number(),
  compareAt: v.optional(v.number()),
  currency: v.string(),
  isFree: v.boolean(),
  format: v.string(),
  language: v.string(),
  pageCount: v.number(),
  coverTone: coverToneValidator,
  coverPattern: coverPatternValidator,
  coverGlyph: v.optional(v.string()),
  includes: v.array(v.string()),
  audience: v.array(v.string()),
  previewPages: v.array(previewPageValidator),
  faqs: v.array(faqValidator),
  related: v.array(v.string()),
  bundleItems: v.optional(v.array(v.string())),
  status: contentStatusValidator,
  featured: v.boolean(),
  popular: v.boolean(),
  bestseller: v.boolean(),
  seoTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
});

const researchDataValidator = v.object({
  title: v.string(),
  titleBn: v.optional(v.string()),
  excerpt: v.string(),
  contentType: researchTypeValidator,
  authorId: v.optional(v.id("authors")),
  tags: v.array(v.string()),
  featured: v.boolean(),
  readingTime: v.string(),
  blocks: v.array(articleBlockValidator),
  relatedResources: v.array(v.string()),
  relatedCourses: v.array(v.string()),
  references: v.array(v.string()),
  doiLinks: v.array(v.string()),
  externalSources: v.array(v.string()),
  status: contentStatusValidator,
  seoTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
});

const blogDataValidator = v.object({
  title: v.string(),
  titleBn: v.optional(v.string()),
  excerpt: v.string(),
  category: v.string(),
  categoryLabel: v.string(),
  authorId: v.optional(v.id("authors")),
  tags: v.array(v.string()),
  featured: v.boolean(),
  readingTime: v.string(),
  blocks: v.array(articleBlockValidator),
  relatedResources: v.array(v.string()),
  relatedCourses: v.array(v.string()),
  status: contentStatusValidator,
  seoTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
});

const courseDataValidator = v.object({
  title: v.string(),
  titleBn: v.string(),
  shortDescription: v.string(),
  description: v.string(),
  category: v.string(),
  categoryBn: v.string(),
  level: v.union(
    v.literal("Beginner"),
    v.literal("Intermediate"),
    v.literal("All levels"),
  ),
  duration: v.string(),
  price: v.number(),
  compareAt: v.optional(v.number()),
  isFree: v.boolean(),
  status: contentStatusValidator,
  featured: v.boolean(),
  whatYouLearn: v.array(v.string()),
  audience: v.array(v.string()),
  prerequisites: v.array(v.string()),
  coverTone: coverToneValidator,
  coverPattern: coverPatternValidator,
  coverGlyph: v.optional(v.string()),
  seoTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
});

/* ------------------------------ stats ------------------------------ */

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);

    const [resources, research, blog, courses, orders, users, newsletters, enrollments] =
      await Promise.all([
        ctx.db.query("resources").collect(),
        ctx.db.query("researchArticles").collect(),
        ctx.db.query("blogPosts").collect(),
        ctx.db.query("courses").collect(),
        ctx.db.query("orders").collect(),
        ctx.db.query("users").collect(),
        ctx.db.query("newsletters").collect(),
        ctx.db.query("enrollments").collect(),
      ]);

    const paidOrders = orders.filter((o) => o.status === "paid");
    const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

    const recentOrders = [...orders]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map((o) => ({
        _id: o._id,
        total: o.total,
        status: o.status,
        contactName: o.contactName,
        createdAt: o.createdAt,
        itemCount: o.resourceIds.length,
      }));

    return {
      stats: {
        publishedResources: resources.filter((r) => r.status === "published").length,
        draftResources: resources.filter((r) => r.status === "draft").length,
        researchPublished: research.filter((r) => r.status === "published").length,
        researchDraft: research.filter((r) => r.status === "draft").length,
        blogPublished: blog.filter((b) => b.status === "published").length,
        blogDraft: blog.filter((b) => b.status === "draft").length,
        coursesPublished: courses.filter((c) => c.status === "published").length,
        coursesComingSoon: courses.filter((c) => c.status === "coming-soon").length,
        orders: orders.length,
        revenue,
        users: users.length,
        newsletterSubscribers: newsletters.length,
        enrollments: enrollments.length,
      },
      recentOrders,
    };
  },
});

export const seedStatus = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const [resources, research, blog, courses] = await Promise.all([
      ctx.db.query("resources").collect(),
      ctx.db.query("researchArticles").collect(),
      ctx.db.query("blogPosts").collect(),
      ctx.db.query("courses").collect(),
    ]);
    return {
      resources: resources.length,
      research: research.length,
      blog: blog.length,
      courses: courses.length,
    };
  },
});

/* ------------------------- resource management ---------------------- */

export const listResourcesAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const rows = await ctx.db.query("resources").order("desc").collect();
    const cats = await ctx.db.query("resourceCategories").collect();
    const catName = new Map(cats.map((c) => [c.slug, c.name]));
    return rows.map((r) => ({
      _id: r._id,
      slug: r.slug,
      title: r.title,
      titleBn: r.titleBn,
      category: catName.get(r.categoryId) ?? r.categoryId,
      price: r.price,
      isFree: r.isFree,
      status: r.status,
      featured: r.featured,
      updatedAt: r.updatedAt,
    }));
  },
});

export const getResourceAdmin = query({
  args: { id: v.id("resources") },
  handler: async (ctx, { id }) => {
    await requireAdminQuery(ctx);
    const row = await ctx.db.get(id);
    if (!row) return null;
    return row;
  },
});

export const upsertResource = mutation({
  args: {
    id: v.optional(v.id("resources")),
    data: resourceDataValidator,
  },
  handler: async (ctx, { id, data }) => {
    const actor = await requireAdmin(ctx);
    const title = data.title.trim();
    if (!title) throw new Error("Title is required.");
    if (data.price < 0) throw new Error("Price cannot be negative.");
    if (data.isFree && data.price !== 0) {
      throw new Error("Free resources must have a price of 0.");
    }
    if (!data.categoryId.trim()) throw new Error("Category is required.");
    if (data.pageCount < 0) throw new Error("Page count cannot be negative.");

    if (id === undefined) {
      const slug = await uniqueSlug(ctx, "resources", title);
      const now = Date.now();
      const newId = await ctx.db.insert("resources", {
        ...data,
        title,
        slug,
        reviews: [],
        publishedAt: data.status === "published" ? now : undefined,
        createdBy: actor._id,
        createdAt: now,
        updatedAt: now,
      });
      // Publish guard (server-side): a published resource must have a real file.
      if (data.status === "published" && !(await resourceHasActiveFile(ctx, slug))) {
        throw new Error(
          "Attach a PDF file before publishing this resource — save as draft, upload the file, then publish.",
        );
      }
      await log(ctx, actor._id, "resource.created", "resource", newId, { title });
      return newId;
    }

    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Resource not found.");
    const statusChanged = existing.status !== data.status;
    const priceChanged = existing.price !== data.price;
    // Publish guard: only transitions INTO published are blocked without a file,
    // so editing an already-published resource is never interrupted.
    if (statusChanged && data.status === "published") {
      if (!(await resourceHasActiveFile(ctx, existing.slug))) {
        throw new Error("Attach a PDF file before publishing this resource.");
      }
    }
    await ctx.db.patch(id, {
      ...data,
      title,
      updatedAt: Date.now(),
      publishedAt:
        data.status === "published" && !existing.publishedAt
          ? Date.now()
          : existing.publishedAt,
    });
    if (statusChanged) {
      await log(ctx, actor._id, `resource.${data.status}`, "resource", id, {
        from: existing.status,
        to: data.status,
      });
    }
    if (priceChanged) {
      await log(ctx, actor._id, "resource.price_changed", "resource", id, {
        from: existing.price,
        to: data.price,
      });
    }
    return id;
  },
});

export const setResourceStatus = mutation({
  args: { id: v.id("resources"), status: contentStatusValidator },
  handler: async (ctx, { id, status }) => {
    const actor = await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Resource not found.");
    // Publish guard (server-side): publishing requires an attached file.
    if (status === "published" && existing.status !== "published") {
      if (!(await resourceHasActiveFile(ctx, existing.slug))) {
        throw new Error("Attach a PDF file before publishing this resource.");
      }
    }
    await ctx.db.patch(id, {
      status,
      updatedAt: Date.now(),
      publishedAt:
        status === "published" && !existing.publishedAt ? Date.now() : existing.publishedAt,
    });
    await log(ctx, actor._id, `resource.${status}`, "resource", id, {
      from: existing.status,
    });
    return id;
  },
});

export const duplicateResource = mutation({
  args: { id: v.id("resources") },
  handler: async (ctx, { id }) => {
    const actor = await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Resource not found.");
    const slug = await uniqueSlug(ctx, "resources", `${existing.title} copy`);
    const now = Date.now();
    const newId = await ctx.db.insert("resources", {
      ...existing,
      slug,
      title: `${existing.title} (Copy)`,
      status: "draft",
      featured: false,
      publishedAt: undefined,
      createdBy: actor._id,
      createdAt: now,
      updatedAt: now,
    });
    await log(ctx, actor._id, "resource.duplicated", "resource", newId, {
      from: id,
    });
    return newId;
  },
});

export const deleteResource = mutation({
  args: { id: v.id("resources") },
  handler: async (ctx, { id }) => {
    const actor = await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Resource not found.");
    await ctx.db.delete(id);
    await log(ctx, actor._id, "resource.deleted", "resource", id, {
      title: existing.title,
    });
    return id;
  },
});

/* ------------------------- research management ---------------------- */

export const listResearchAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const rows = await ctx.db.query("researchArticles").order("desc").collect();
    return rows.map((r) => ({
      _id: r._id,
      slug: r.slug,
      title: r.title,
      contentType: r.contentType,
      status: r.status,
      featured: r.featured,
      updatedAt: r.updatedAt,
    }));
  },
});

export const getResearchAdmin = query({
  args: { id: v.id("researchArticles") },
  handler: async (ctx, { id }) => {
    await requireAdminQuery(ctx);
    const row = await ctx.db.get(id);
    if (!row) return null;
    return row;
  },
});

export const upsertResearchArticle = mutation({
  args: {
    id: v.optional(v.id("researchArticles")),
    data: researchDataValidator,
  },
  handler: async (ctx, { id, data }) => {
    const actor = await requireAdmin(ctx);
    const title = data.title.trim();
    if (!title) throw new Error("Title is required.");
    if (!data.excerpt.trim()) throw new Error("Summary is required.");
    if (!data.contentType) throw new Error("Research type is required.");

    if (id === undefined) {
      const slug = await uniqueSlug(ctx, "researchArticles", title);
      const now = Date.now();
      const newId = await ctx.db.insert("researchArticles", {
        ...data,
        title,
        slug,
        categoryLabel: "Research",
        editorId: undefined,
        publishedAt: data.status === "published" ? now : undefined,
        createdBy: actor._id,
        createdAt: now,
        updatedAt: now,
      });
      await log(ctx, actor._id, "research.created", "research", newId, { title });
      return newId;
    }

    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Research article not found.");
    const statusChanged = existing.status !== data.status;
    await ctx.db.patch(id, {
      ...data,
      title,
      updatedAt: Date.now(),
      publishedAt:
        data.status === "published" && !existing.publishedAt
          ? Date.now()
          : existing.publishedAt,
    });
    if (statusChanged) {
      await log(ctx, actor._id, `research.${data.status}`, "research", id, {
        from: existing.status,
      });
    }
    return id;
  },
});

export const setResearchStatus = mutation({
  args: { id: v.id("researchArticles"), status: contentStatusValidator },
  handler: async (ctx, { id, status }) => {
    const actor = await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Research article not found.");
    await ctx.db.patch(id, {
      status,
      updatedAt: Date.now(),
      publishedAt:
        status === "published" && !existing.publishedAt ? Date.now() : existing.publishedAt,
    });
    await log(ctx, actor._id, `research.${status}`, "research", id, {
      from: existing.status,
    });
    return id;
  },
});

export const deleteResearchArticle = mutation({
  args: { id: v.id("researchArticles") },
  handler: async (ctx, { id }) => {
    const actor = await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Research article not found.");
    await ctx.db.delete(id);
    await log(ctx, actor._id, "research.deleted", "research", id, {
      title: existing.title,
    });
    return id;
  },
});

/* --------------------------- blog management ------------------------ */

export const listBlogAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const rows = await ctx.db.query("blogPosts").order("desc").collect();
    return rows.map((r) => ({
      _id: r._id,
      slug: r.slug,
      title: r.title,
      category: r.category,
      status: r.status,
      featured: r.featured,
      updatedAt: r.updatedAt,
    }));
  },
});

export const getBlogAdmin = query({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, { id }) => {
    await requireAdminQuery(ctx);
    const row = await ctx.db.get(id);
    if (!row) return null;
    return row;
  },
});

export const upsertBlogPost = mutation({
  args: {
    id: v.optional(v.id("blogPosts")),
    data: blogDataValidator,
  },
  handler: async (ctx, { id, data }) => {
    const actor = await requireAdmin(ctx);
    const title = data.title.trim();
    if (!title) throw new Error("Title is required.");
    if (!data.excerpt.trim()) throw new Error("Summary is required.");
    if (!data.category.trim()) throw new Error("Category is required.");

    if (id === undefined) {
      const slug = await uniqueSlug(ctx, "blogPosts", title);
      const now = Date.now();
      const newId = await ctx.db.insert("blogPosts", {
        ...data,
        title,
        slug,
        publishedAt: data.status === "published" ? now : undefined,
        createdBy: actor._id,
        createdAt: now,
        updatedAt: now,
      });
      await log(ctx, actor._id, "blog.created", "blog", newId, { title });
      return newId;
    }

    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Blog post not found.");
    const statusChanged = existing.status !== data.status;
    await ctx.db.patch(id, {
      ...data,
      title,
      updatedAt: Date.now(),
      publishedAt:
        data.status === "published" && !existing.publishedAt
          ? Date.now()
          : existing.publishedAt,
    });
    if (statusChanged) {
      await log(ctx, actor._id, `blog.${data.status}`, "blog", id, {
        from: existing.status,
      });
    }
    return id;
  },
});

export const setBlogStatus = mutation({
  args: { id: v.id("blogPosts"), status: contentStatusValidator },
  handler: async (ctx, { id, status }) => {
    const actor = await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Blog post not found.");
    await ctx.db.patch(id, {
      status,
      updatedAt: Date.now(),
      publishedAt:
        status === "published" && !existing.publishedAt ? Date.now() : existing.publishedAt,
    });
    await log(ctx, actor._id, `blog.${status}`, "blog", id, { from: existing.status });
    return id;
  },
});

export const deleteBlogPost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, { id }) => {
    const actor = await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Blog post not found.");
    await ctx.db.delete(id);
    await log(ctx, actor._id, "blog.deleted", "blog", id, { title: existing.title });
    return id;
  },
});

/* --------------------------- course management ---------------------- */

export const listCoursesAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const rows = await ctx.db.query("courses").order("desc").collect();
    const enrollments = await ctx.db.query("enrollments").collect();
    const countByCourse = new Map<string, number>();
    for (const e of enrollments) {
      countByCourse.set(e.courseId, (countByCourse.get(e.courseId) ?? 0) + 1);
    }
    return rows.map((r) => ({
      _id: r._id,
      slug: r.slug,
      title: r.title,
      category: r.category,
      price: r.price,
      isFree: r.isFree,
      status: r.status,
      featured: r.featured,
      updatedAt: r.updatedAt,
      enrollments: countByCourse.get(r._id) ?? 0,
    }));
  },
});

export const getCourseAdmin = query({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    await requireAdminQuery(ctx);
    const row = await ctx.db.get(id);
    if (!row) return null;
    const modules = await ctx.db
      .query("courseModules")
      .withIndex("by_course", (q) => q.eq("courseId", id))
      .collect();
    const modulesWithLessons = [];
    for (const mod of modules.sort((a, b) => a.position - b.position)) {
      const lessons = await ctx.db
        .query("courseLessons")
        .withIndex("by_module", (q) => q.eq("moduleId", mod._id))
        .collect();
      modulesWithLessons.push({
        _id: mod._id,
        title: mod.title,
        position: mod.position,
        lessons: lessons
          .sort((a, b) => a.position - b.position)
          .map((l) => ({
            _id: l._id,
            title: l.title,
            lessonType: l.lessonType,
            content: l.content ?? "",
            videoProvider: l.videoProvider,
            videoId: l.videoId,
            fileStorageId: l.fileStorageId,
            isPreview: l.isPreview,
            duration: l.duration,
          })),
      });
    }
    return { course: row, modules: modulesWithLessons };
  },
});

export const upsertCourse = mutation({
  args: {
    id: v.optional(v.id("courses")),
    data: courseDataValidator,
  },
  handler: async (ctx, { id, data }) => {
    const actor = await requireAdmin(ctx);
    const title = data.title.trim();
    if (!title) throw new Error("Title is required.");
    if (data.price < 0) throw new Error("Price cannot be negative.");
    if (data.isFree && data.price !== 0) {
      throw new Error("Free courses must have a price of 0.");
    }

    if (id === undefined) {
      const slug = await uniqueSlug(ctx, "courses", title);
      const now = Date.now();
      const newId = await ctx.db.insert("courses", {
        ...data,
        title,
        slug,
        instructorId: undefined,
        publishedAt: data.status === "published" ? now : undefined,
        createdBy: actor._id,
        createdAt: now,
        updatedAt: now,
      });
      // A published course must have real, meaningful content and, when
      // paid, a real price (enforced server-side, never trusted from the UI).
      if (data.status === "published") {
        await assertCoursePublishable(ctx, newId, data.isFree, data.price);
      }
      await log(ctx, actor._id, "course.created", "course", newId, { title });
      return newId;
    }

    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Course not found.");
    const statusChanged = existing.status !== data.status;
    const priceChanged = existing.price !== data.price;
    if (statusChanged && data.status === "published") {
      await assertCoursePublishable(ctx, id, data.isFree, data.price);
    }
    await ctx.db.patch(id, {
      ...data,
      title,
      updatedAt: Date.now(),
      publishedAt:
        data.status === "published" && !existing.publishedAt
          ? Date.now()
          : existing.publishedAt,
    });
    if (statusChanged) {
      await log(ctx, actor._id, `course.${data.status}`, "course", id, {
        from: existing.status,
      });
    }
    if (priceChanged) {
      await log(ctx, actor._id, "course.price_changed", "course", id, {
        from: existing.price,
        to: data.price,
      });
    }
    return id;
  },
});

export const setCourseStatus = mutation({
  args: { id: v.id("courses"), status: contentStatusValidator },
  handler: async (ctx, { id, status }) => {
    const actor = await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Course not found.");
    if (status === "published" && existing.status !== "published") {
      await assertCoursePublishable(ctx, id, existing.isFree, existing.price);
    }
    await ctx.db.patch(id, {
      status,
      updatedAt: Date.now(),
      publishedAt:
        status === "published" && !existing.publishedAt ? Date.now() : existing.publishedAt,
    });
    await log(ctx, actor._id, `course.${status}`, "course", id, { from: existing.status });
    return id;
  },
});

export const deleteCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    const actor = await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Course not found.");
    const modules = await ctx.db
      .query("courseModules")
      .withIndex("by_course", (q) => q.eq("courseId", id))
      .collect();
    for (const mod of modules) {
      const lessons = await ctx.db
        .query("courseLessons")
        .withIndex("by_module", (q) => q.eq("moduleId", mod._id))
        .collect();
      for (const lesson of lessons) await ctx.db.delete(lesson._id);
      await ctx.db.delete(mod._id);
    }
    await ctx.db.delete(id);
    await log(ctx, actor._id, "course.deleted", "course", id, { title: existing.title });
    return id;
  },
});

export const upsertModule = mutation({
  args: {
    id: v.optional(v.id("courseModules")),
    courseId: v.id("courses"),
    title: v.string(),
    position: v.number(),
  },
  handler: async (ctx, { id, courseId, title, position }) => {
    const actor = await requireAdmin(ctx);
    if (!title.trim()) throw new Error("Module title is required.");
    const course = await ctx.db.get(courseId);
    if (!course) throw new Error("Course not found.");

    if (id === undefined) {
      const newId = await ctx.db.insert("courseModules", {
        courseId,
        title: title.trim(),
        position,
        status: "published",
      });
      await log(ctx, actor._id, "course.module_created", "course", courseId, {
        module: title.trim(),
      });
      return newId;
    }
    await ctx.db.patch(id, { title: title.trim(), position });
    return id;
  },
});

export const deleteModule = mutation({
  args: { id: v.id("courseModules") },
  handler: async (ctx, { id }) => {
    const actor = await requireAdmin(ctx);
    const mod = await ctx.db.get(id);
    if (!mod) throw new Error("Module not found.");
    const lessons = await ctx.db
      .query("courseLessons")
      .withIndex("by_module", (q) => q.eq("moduleId", id))
      .collect();
    for (const lesson of lessons) await ctx.db.delete(lesson._id);
    await ctx.db.delete(id);
    await log(ctx, actor._id, "course.module_deleted", "course", mod.courseId, {});
    return id;
  },
});

export const upsertLesson = mutation({
  args: {
    id: v.optional(v.id("courseLessons")),
    courseId: v.id("courses"),
    moduleId: v.id("courseModules"),
    title: v.string(),
    lessonType: v.union(
      v.literal("text"),
      v.literal("video"),
      v.literal("PDF"),
      v.literal("downloadable-resource"),
      v.literal("quiz"),
      v.literal("external-embed"),
    ),
    content: v.optional(v.string()),
    videoProvider: v.optional(v.string()),
    videoId: v.optional(v.string()),
    duration: v.optional(v.string()),
    position: v.number(),
    isPreview: v.boolean(),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    const title = args.title.trim();
    if (!title) throw new Error("Lesson title is required.");
    const mod = await ctx.db.get(args.moduleId);
    if (!mod) throw new Error("Module not found.");

    if (args.id === undefined) {
      const base = slugify(title);
      const slug = `${mod.courseId.slice(-6)}-${base || "lesson"}`;
      const newId = await ctx.db.insert("courseLessons", {
        ...args,
        title,
        slug,
        status: "published",
      });
      await log(ctx, actor._id, "course.lesson_created", "course", args.courseId, {
        lesson: title,
      });
      return newId;
    }
    await ctx.db.patch(args.id, { ...args, title });
    return args.id;
  },
});

export const deleteLesson = mutation({
  args: { id: v.id("courseLessons") },
  handler: async (ctx, { id }) => {
    const actor = await requireAdmin(ctx);
    const lesson = await ctx.db.get(id);
    if (!lesson) throw new Error("Lesson not found.");
    await ctx.db.delete(id);
    await log(ctx, actor._id, "course.lesson_deleted", "course", lesson.courseId, {});
    return id;
  },
});

/**
 * Admin: attach an uploaded file (private Convex storage) to a lesson of
 * type PDF / downloadable-resource. Replaces any previous lesson file.
 */
export const attachLessonFile = mutation({
  args: {
    courseId: v.id("courses"),
    lessonId: v.id("courseLessons"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson || lesson.courseId !== args.courseId) {
      throw new Error("Lesson not found.");
    }
    if (!args.filename.trim() || args.fileSize <= 0 || args.fileSize > 200 * 1024 * 1024) {
      throw new Error("Invalid file.");
    }
    // Replace: remove the old storage object when a previous file exists.
    if (lesson.fileStorageId) {
      try {
        await ctx.storage.delete(lesson.fileStorageId as Id<"_storage">);
      } catch {
        // best-effort
      }
    }
    await ctx.db.patch(args.lessonId, {
      fileStorageId: args.storageId as string,
    });
    await log(ctx, actor._id, "course.lesson_file", "course", args.lessonId, {
      filename: args.filename,
    });
    return args.lessonId;
  },
});

/** Admin: remove a lesson's attached file. */
export const removeLessonFile = mutation({
  args: {
    courseId: v.id("courses"),
    lessonId: v.id("courseLessons"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson || lesson.courseId !== args.courseId) {
      throw new Error("Lesson not found.");
    }
    if (lesson.fileStorageId) {
      try {
        await ctx.storage.delete(lesson.fileStorageId as Id<"_storage">);
      } catch {
        // best-effort
      }
      await ctx.db.patch(args.lessonId, { fileStorageId: undefined });
    }
    return args.lessonId;
  },
});

/* --------------------------- author management ---------------------- */

export const getAuthorAdmin = query({
  args: { id: v.id("authors") },
  handler: async (ctx, { id }) => {
    await requireAdminQuery(ctx);
    const row = await ctx.db.get(id);
    if (!row) return null;
    return row;
  },
});

export const listAuthorsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const rows = await ctx.db.query("authors").order("desc").collect();
    return rows.map((a) => ({
      _id: a._id,
      name: a.name,
      role: a.role,
      bio: a.bio,
      credentials: a.credentials,
      status: a.status,
    }));
  },
});

export const upsertAuthor = mutation({
  args: {
    id: v.optional(v.id("authors")),
    name: v.string(),
    role: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.string()),
    credentials: v.array(v.string()),
    status: contentStatusValidator,
  },
  handler: async (ctx, { id, ...data }) => {
    const actor = await requireAdmin(ctx);
    const name = data.name.trim();
    if (!name) throw new Error("Name is required.");
    const now = Date.now();
    if (id === undefined) {
      const newId = await ctx.db.insert("authors", {
        ...data,
        name,
        socials: undefined,
        createdAt: now,
        updatedAt: now,
      });
      await log(ctx, actor._id, "author.created", "author", newId, { name });
      return newId;
    }
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Author not found.");
    await ctx.db.patch(id, { ...data, name, updatedAt: now });
    return id;
  },
});

export const deleteAuthor = mutation({
  args: { id: v.id("authors") },
  handler: async (ctx, { id }) => {
    const actor = await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Author not found.");
    await ctx.db.delete(id);
    await log(ctx, actor._id, "author.deleted", "author", id, { name: existing.name });
    return id;
  },
});

/* ----------------------------- orders ------------------------------- */

export const adminOrders = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const orders = await ctx.db.query("orders").order("desc").collect();
    const users = await ctx.db.query("users").collect();
    const emailById = new Map(users.map((u) => [u._id, u.email ?? ""]));
    return orders.slice(0, 100).map((o) => ({
      _id: o._id,
      total: o.total,
      status: o.status,
      contactName: o.contactName,
      contactEmail: o.contactEmail,
      userEmail: o.userId ? emailById.get(o.userId) ?? "" : "",
      createdAt: o.createdAt,
      itemCount: o.resourceIds.length,
    }));
  },
});

export const updateOrderStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("cancelled"),
      v.literal("failed"),
    ),
  },
  handler: async (ctx, { id, status }) => {
    const actor = await requireAdmin(ctx);
    const order = await ctx.db.get(id);
    if (!order) throw new Error("Order not found.");
    await ctx.db.patch(id, { status });
    await log(ctx, actor._id, "order.status_changed", "order", id, {
      from: order.status,
      to: status,
    });
    return id;
  },
});

/* --------------------------- site settings -------------------------- */

/** All site settings (key + JSON value) for the Settings admin page. */
export const listSiteSettings = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const rows = await ctx.db.query("siteSettings").collect();
    return rows.map((r) => ({
      key: r.key,
      value: r.value,
      updatedAt: r.updatedAt,
    }));
  },
});

/**
 * Upsert a JSON site setting (e.g. scholarships, collections). The value is
 * validated as JSON on the client; here we only guard size and type so a
 * malformed write cannot corrupt the public site.
 */
export const updateSiteSetting = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, { key, value }) => {
    const actor = await requireAdmin(ctx);
    const trimmed = key.trim();
    if (!trimmed) throw new Error("A setting key is required.");
    if (!Array.isArray(value) && (typeof value !== "object" || value === null)) {
      throw new Error("Settings must be saved as a JSON object or array.");
    }
    if (JSON.stringify(value).length > 250_000) {
      throw new Error("This setting is too large to save.");
    }

    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", trimmed))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        value,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("siteSettings", {
        key: trimmed,
        value,
        updatedAt: Date.now(),
      });
    }
    await log(ctx, actor._id, "settings.updated", "siteSettings", trimmed);
    return trimmed;
  },
});

/* --------------------------- newsletter ---------------------------- */

/** Admin: all newsletter subscribers with status and dates. */
export const listNewsletterSubscribers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const rows = await ctx.db.query("newsletters").collect();
    return [...rows]
      .sort((a, b) => b.subscribedAt - a.subscribedAt)
      .map((r) => ({
        email: r.email,
        status: r.status ?? "active", // legacy rows pre-status are active
        subscribedAt: r.subscribedAt,
        unsubscribedAt: r.unsubscribedAt ?? undefined,
      }));
  },
});

/* --------------------------- contact inbox ------------------------- */

export const listContactMessages = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const rows = await ctx.db
      .query("contactMessages")
      .withIndex("by_created")
      .order("desc")
      .take(100);
    return rows.map((r) => ({
      _id: r._id,
      name: r.name,
      email: r.email,
      topic: r.topic,
      message: r.message,
      status: r.status,
      createdAt: r.createdAt,
    }));
  },
});

export const markContactRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { status: "read" });
    return id;
  },
});

/* ---------------------------- audit log ----------------------------- */

export const recentAuditLogs = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    const rows = await ctx.db.query("auditLogs").order("desc").take(40);
    return rows.map((r) => ({
      _id: r._id,
      action: r.action,
      entityType: r.entityType,
      entityId: r.entityId,
      createdAt: r.createdAt,
      details: r.details,
    }));
  },
});
