import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  EDITOR: "editor",
  INSTRUCTOR: "instructor",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.EDITOR),
  v.literal(ROLES.INSTRUCTOR),
);
export type Role = Infer<typeof roleValidator>;

/** Shared content lifecycle status. */
export const contentStatusValidator = v.union(
  v.literal("draft"),
  v.literal("published"),
  v.literal("archived"),
  v.literal("coming-soon"),
);

/** Research article content types (mirrors the frontend taxonomy). */
export const researchTypeValidator = v.union(
  v.literal("research-guide"),
  v.literal("paper-review"),
  v.literal("methodology"),
  v.literal("research-discussion"),
  v.literal("literature-review"),
  v.literal("data-analysis"),
  v.literal("academic-writing"),
  v.literal("research-ethics"),
  v.literal("publication"),
  v.literal("research-tools"),
  v.literal("evidence-review"),
);

/** Structured article blocks — no raw HTML is stored. */
export const articleBlockValidator = v.union(
  v.object({ type: v.literal("p"), text: v.string() }),
  v.object({ type: v.literal("h2"), text: v.string(), id: v.string() }),
  v.object({ type: v.literal("h3"), text: v.string(), id: v.string() }),
  v.object({
    type: v.literal("quote"),
    text: v.string(),
    source: v.optional(v.string()),
  }),
  v.object({
    type: v.literal("callout"),
    variant: v.union(
      v.literal("key"),
      v.literal("note"),
      v.literal("important"),
      v.literal("example"),
      v.literal("source"),
    ),
    text: v.string(),
  }),
  v.object({
    type: v.literal("list"),
    ordered: v.optional(v.boolean()),
    items: v.array(v.string()),
  }),
  v.object({ type: v.literal("timeline"), steps: v.array(v.string()) }),
  v.object({ type: v.literal("reference"), items: v.array(v.string()) }),
);

export const previewPageValidator = v.object({
  label: v.string(),
  lines: v.array(v.string()),
});
export const faqValidator = v.object({ q: v.string(), a: v.string() });
export const reviewValidator = v.object({
  name: v.string(),
  role: v.string(),
  rating: v.number(),
  text: v.string(),
});

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    /* ------------------------------------------------------------------ */
    /*  Content: authors & categories                                      */
    /* ------------------------------------------------------------------ */

    // Real author/editor records. Credentials are only ever filled in by an
    // admin — never invented automatically.
    authors: defineTable({
      name: v.string(),
      role: v.string(),
      bio: v.optional(v.string()),
      image: v.optional(v.string()),
      credentials: v.array(v.string()),
      socials: v.optional(
        v.object({
          website: v.optional(v.string()),
          linkedin: v.optional(v.string()),
          email: v.optional(v.string()),
        }),
      ),
      status: contentStatusValidator,
      createdAt: v.number(),
      updatedAt: v.number(),
    }),

    // Resource categories (Scholarships & Study Abroad live here, not in the
    // top-level navigation).
    resourceCategories: defineTable({
      slug: v.string(),
      name: v.string(),
      nameBn: v.optional(v.string()),
      description: v.optional(v.string()),
      position: v.number(),
      status: contentStatusValidator,
    }).index("slug", ["slug"]),

    /* ------------------------------------------------------------------ */
    /*  Content: resources                                                 */
    /* ------------------------------------------------------------------ */

    resources: defineTable({
      slug: v.string(),
      title: v.string(),
      titleBn: v.optional(v.string()),
      subtitle: v.optional(v.string()),
      shortDescription: v.string(),
      description: v.string(),
      categoryId: v.string(), // resourceCategories.slug
      tags: v.array(v.string()),
      type: v.union(
        v.literal("PDF"),
        v.literal("Template"),
        v.literal("Checklist"),
        v.literal("Guide"),
        v.literal("Bundle"),
      ),
      price: v.number(), // taka; 0 for free resources
      compareAt: v.optional(v.number()),
      currency: v.string(),
      isFree: v.boolean(),
      format: v.string(),
      language: v.string(),
      pageCount: v.number(),
      // Cover style drives the generated publication covers (approved design).
      coverTone: v.union(
        v.literal("navy"),
        v.literal("teal"),
        v.literal("gold"),
        v.literal("ivory"),
        v.literal("graphite"),
        v.literal("moss"),
      ),
      coverPattern: v.union(
        v.literal("grid"),
        v.literal("dots"),
        v.literal("lines"),
        v.literal("nodes"),
        v.literal("quote"),
        v.literal("bars"),
        v.literal("paper"),
      ),
      coverGlyph: v.optional(v.string()),
      includes: v.array(v.string()),
      audience: v.array(v.string()),
      previewPages: v.array(previewPageValidator),
      faqs: v.array(faqValidator),
      reviews: v.array(reviewValidator),
      related: v.array(v.string()), // resource slugs
      bundleItems: v.optional(v.array(v.string())),
      status: contentStatusValidator,
      featured: v.boolean(),
      popular: v.boolean(),
      bestseller: v.boolean(),
      publishedAt: v.optional(v.number()),
      updatedAt: v.number(),
      seoTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("status", ["status"])
      .index("by_category_status", ["categoryId", "status"])
      .index("by_featured", ["featured", "status"]),

    /* ------------------------------------------------------------------ */
    /*  Content: research articles (the Research hub)                      */
    /* ------------------------------------------------------------------ */

    researchArticles: defineTable({
      slug: v.string(),
      title: v.string(),
      titleBn: v.optional(v.string()),
      excerpt: v.string(),
      contentType: v.optional(researchTypeValidator),
      categoryLabel: v.string(),
      tags: v.array(v.string()),
      authorId: v.optional(v.id("authors")),
      editorId: v.optional(v.id("authors")),
      featured: v.boolean(),
      readingTime: v.string(),
      blocks: v.array(articleBlockValidator),
      relatedResources: v.array(v.string()),
      relatedCourses: v.array(v.string()),
      references: v.array(v.string()),
      doiLinks: v.array(v.string()),
      externalSources: v.array(v.string()),
      status: contentStatusValidator,
      publishedAt: v.optional(v.number()),
      updatedAt: v.number(),
      seoTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("status", ["status"])
      .index("by_type_status", ["contentType", "status"])
      .index("by_featured", ["featured", "status"]),

    /* ------------------------------------------------------------------ */
    /*  Content: blog posts                                                */
    /* ------------------------------------------------------------------ */

    blogPosts: defineTable({
      slug: v.string(),
      title: v.string(),
      titleBn: v.optional(v.string()),
      excerpt: v.string(),
      category: v.string(), // e.g. scholarships, study-abroad, career, university…
      categoryLabel: v.string(),
      tags: v.array(v.string()),
      authorId: v.optional(v.id("authors")),
      featured: v.boolean(),
      readingTime: v.string(),
      blocks: v.array(articleBlockValidator),
      relatedResources: v.array(v.string()),
      relatedCourses: v.array(v.string()),
      status: contentStatusValidator,
      publishedAt: v.optional(v.number()),
      updatedAt: v.number(),
      seoTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("status", ["status"])
      .index("by_category_status", ["category", "status"])
      .index("by_featured", ["featured", "status"]),

    /* ------------------------------------------------------------------ */
    /*  Content: courses                                                   */
    /* ------------------------------------------------------------------ */

    courses: defineTable({
      slug: v.string(),
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
      instructorId: v.optional(v.id("authors")),
      price: v.number(),
      compareAt: v.optional(v.number()),
      isFree: v.boolean(),
      status: contentStatusValidator,
      featured: v.boolean(),
      whatYouLearn: v.array(v.string()),
      audience: v.array(v.string()),
      prerequisites: v.array(v.string()),
      coverTone: v.union(
        v.literal("navy"),
        v.literal("teal"),
        v.literal("gold"),
        v.literal("ivory"),
        v.literal("graphite"),
        v.literal("moss"),
      ),
      coverPattern: v.union(
        v.literal("grid"),
        v.literal("dots"),
        v.literal("lines"),
        v.literal("nodes"),
        v.literal("quote"),
        v.literal("bars"),
        v.literal("paper"),
      ),
      coverGlyph: v.optional(v.string()),
      publishedAt: v.optional(v.number()),
      updatedAt: v.number(),
      seoTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
    })
      .index("slug", ["slug"])
      .index("status", ["status"]),

    courseModules: defineTable({
      courseId: v.id("courses"),
      title: v.string(),
      description: v.optional(v.string()),
      position: v.number(),
      status: contentStatusValidator,
    }).index("by_course", ["courseId", "position"]),

    courseLessons: defineTable({
      courseId: v.id("courses"),
      moduleId: v.id("courseModules"),
      title: v.string(),
      slug: v.string(),
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
      fileStorageId: v.optional(v.string()),
      duration: v.optional(v.string()),
      position: v.number(),
      isPreview: v.boolean(),
      status: contentStatusValidator,
    })
      .index("by_module", ["moduleId", "position"])
      .index("by_course", ["courseId", "position"]),

    /* ------------------------------------------------------------------ */
    /*  Commerce                                                           */
    /* ------------------------------------------------------------------ */

    // User library — which resources a signed-in user owns (paid or free)
    purchases: defineTable({
      userId: v.id("users"),
      resourceId: v.string(), // slug from the resources table
      kind: v.union(v.literal("paid"), v.literal("free")),
      pricePaid: v.number(), // taka (0 for free resources)
      purchasedAt: v.number(),
      orderId: v.optional(v.id("orders")), // for paid items — set only after verified payment
    })
      .index("by_user", ["userId"])
      .index("by_resource", ["resourceId"]),

    // Orders — created at checkout, unlocked only after server-side payment verification.
    // One order can contain both resources and paid courses (unified commerce).
    orders: defineTable({
      userId: v.id("users"),
      resourceIds: v.array(v.string()),
      courseIds: v.optional(v.array(v.id("courses"))),
      contactName: v.string(),
      contactEmail: v.string(),
      contactMobile: v.optional(v.string()),
      total: v.number(), // taka, computed server-side from the catalog
      gateway: v.optional(v.string()),
      transactionId: v.optional(v.string()), // gateway transaction reference (e.g. SSLCommerz val_id)
      status: v.union(
        v.literal("pending"),
        v.literal("paid"),
        v.literal("cancelled"),
        v.literal("failed"),
      ),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Line items for every order (snapshot of what was purchased).
    orderItems: defineTable({
      orderId: v.id("orders"),
      kind: v.optional(v.union(v.literal("resource"), v.literal("course"))),
      resourceId: v.optional(v.string()),
      courseId: v.optional(v.id("courses")),
      title: v.string(),
      price: v.number(),
    }).index("by_order", ["orderId"]),

    /* ------------------------------------------------------------------ */
    /*  Files: secure PDF storage for resources                            */
    /* ------------------------------------------------------------------ */

    // Real uploaded files for downloadable resources. Files live in Convex
    // storage (private, never in public/); rows here are the metadata and
    // the version history (replacements retire the previous active file).
    resourceFiles: defineTable({
      resourceId: v.string(), // resource slug
      storageId: v.id("_storage"),
      filename: v.string(),
      displayFilename: v.string(),
      mimeType: v.string(),
      fileSize: v.number(),
      version: v.number(),
      kind: v.union(v.literal("main"), v.literal("preview")),
      status: v.union(v.literal("active"), v.literal("replaced"), v.literal("removed")),
      uploadedBy: v.optional(v.id("users")),
      uploadedAt: v.number(),
    }).index("by_resource", ["resourceId", "status"]),

    // Contact form submissions — stored, never lost.
    contactMessages: defineTable({
      name: v.string(),
      email: v.string(),
      topic: v.string(),
      message: v.string(),
      status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
      createdAt: v.number(),
    }).index("by_created", ["createdAt"]),

    // Fixed-window rate limiting buckets (per user / email / ip key).
    rateLimits: defineTable({
      key: v.string(),
      windowStart: v.number(),
      count: v.number(),
    }).index("by_key", ["key"]),

    // Course enrollments — real counts only, never fabricated.
    enrollments: defineTable({
      userId: v.id("users"),
      courseId: v.id("courses"),
      enrolledAt: v.number(),
      status: v.union(
        v.literal("active"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
    })
      .index("by_user", ["userId"])
      .index("by_course", ["courseId"]),

    courseProgress: defineTable({
      userId: v.id("users"),
      courseId: v.id("courses"),
      lessonId: v.id("courseLessons"),
      completedAt: v.number(),
    })
      .index("by_user_lesson", ["userId", "lessonId"])
      .index("by_user_course", ["userId", "courseId"]),

    downloads: defineTable({
      userId: v.id("users"),
      resourceId: v.string(),
      downloadedAt: v.number(),
    }).index("by_user", ["userId"]),

    // Single-use, expiring download tokens. A token is minted only after
    // entitlement is verified server-side, and the /files/download HTTP
    // action re-checks the token (valid → unused → unexpired → owned by the
    // caller) before streaming the file.
    downloadTokens: defineTable({
      token: v.string(),
      kind: v.union(v.literal("resource"), v.literal("lesson")),
      resourceId: v.optional(v.string()),
      courseId: v.optional(v.id("courses")),
      lessonId: v.optional(v.id("courseLessons")),
      userId: v.id("users"),
      storageId: v.id("_storage"),
      filename: v.string(),
      fileSize: v.optional(v.number()),
      mimeType: v.string(),
      expiresAt: v.number(),
      usedAt: v.optional(v.number()),
      createdAt: v.number(),
    }).index("by_token", ["token"]),

    /* ------------------------------------------------------------------ */
    /*  Platform                                                           */
    /* ------------------------------------------------------------------ */

    // Newsletter subscribers. Rows are never deleted on unsubscribe — the
    // status flips to "unsubscribed" so the owner keeps the (honest) history.
    // The unsubscribeToken is a per-subscriber secret used in the one-click
    // unsubscribe link; it is regenerated on re-subscribe.
    newsletters: defineTable({
      email: v.string(),
      status: v.union(v.literal("active"), v.literal("unsubscribed")),
      subscribedAt: v.number(),
      unsubscribedAt: v.optional(v.number()),
      unsubscribeToken: v.string(),
    })
      .index("by_email", ["email"])
      .index("by_token", ["unsubscribeToken"]),

    // Site settings — JSON values keyed by name (e.g. scholarships, collections).
    siteSettings: defineTable({
      key: v.string(),
      value: v.any(),
      updatedAt: v.number(),
    }).index("by_key", ["key"]),

    // Audit log for important admin actions. Secrets are never stored.
    auditLogs: defineTable({
      actorId: v.optional(v.id("users")),
      action: v.string(),
      entityType: v.string(),
      entityId: v.string(),
      details: v.optional(v.any()),
      createdAt: v.number(),
    }).index("by_created", ["createdAt"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
