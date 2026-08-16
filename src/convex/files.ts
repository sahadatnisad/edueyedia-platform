import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { requireAdmin, requireAdminQuery } from "./admin";

/* ------------------------------------------------------------------ */
/*  Secure file delivery for downloadable resources.                   */
/*                                                                    */
/*  Files are uploaded to Convex storage (private — never public/).    */
/*  A file is never delivered with a permanent public URL: the client  */
/*  calls fileActions.getSecureDownload, which re-checks entitlement   */
/*  server-side, mints a single-use 5-minute token, and the            */
/*  /files/download HTTP action streams the file only after verifying  */
/*  the token and the caller's identity. The download is logged only   */
/*  after authorization succeeds (consumeDownloadToken).               */
/* ------------------------------------------------------------------ */

const MAX_FILE_SIZE = 200 * 1024 * 1024;

/* --------------------------- entitlements -------------------------- */

/**
 * Whether the signed-in user may download a resource. Re-checks:
 * signed-in → resource published → user owns it (purchase row, paid or free).
 */
export const downloadEntitlement = query({
  args: { resourceId: v.string() },
  handler: async (ctx, { resourceId }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      return { allowed: false as const, reason: "not-signed-in" };
    }
    const resource = await ctx.db
      .query("resources")
      .withIndex("slug", (q) => q.eq("slug", resourceId))
      .first();
    if (!resource || resource.status !== "published") {
      return { allowed: false as const, reason: "unavailable" };
    }
    const owned = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("resourceId"), resourceId))
      .first();
    if (owned === null) {
      return { allowed: false as const, reason: "not-owned" };
    }
    return { allowed: true as const, userId: user._id };
  },
});

/** The active main file for a resource (metadata only — never a URL). */
export const activeResourceFile = query({
  args: { resourceId: v.string() },
  handler: async (ctx, { resourceId }) => {
    const row = await ctx.db
      .query("resourceFiles")
      .withIndex("by_resource", (q) => q.eq("resourceId", resourceId))
      .filter((q) =>
        q.and(
          q.eq(q.field("kind"), "main"),
          q.eq(q.field("status"), "active"),
        ),
      )
      .first();
    if (row === null) return null;
    return {
      storageId: row.storageId,
      filename: row.filename,
      displayFilename: row.displayFilename,
      mimeType: row.mimeType,
      fileSize: row.fileSize,
      version: row.version,
    };
  },
});

/** Whether a published resource has an attached file (public UI badge). */
export const hasFile = query({
  args: { resourceId: v.string() },
  handler: async (ctx, { resourceId }) => {
    const row = await ctx.db
      .query("resourceFiles")
      .withIndex("by_resource", (q) => q.eq("resourceId", resourceId))
      .filter((q) =>
        q.and(
          q.eq(q.field("kind"), "main"),
          q.eq(q.field("status"), "active"),
        ),
      )
      .first();
    return {
      hasFile: row !== null,
      displayFilename: row?.displayFilename ?? null,
      fileSize: row?.fileSize ?? null,
    };
  },
});

/** Course lesson file (PDF/downloadable-resource) — enrollment-gated. */
export const lessonFileRef = query({
  args: {
    courseId: v.optional(v.id("courses")),
    lessonId: v.optional(v.id("courseLessons")),
  },
  handler: async (ctx, { courseId, lessonId }) => {
    if (courseId === undefined || lessonId === undefined) return null;
    const lesson = await ctx.db.get(lessonId);
    if (
      !lesson ||
      lesson.courseId !== courseId ||
      !lesson.fileStorageId
    ) {
      return null;
    }
    return {
      storageId: lesson.fileStorageId,
      title: lesson.title,
      filename: `${lesson.slug}.pdf`,
      mimeType: "application/pdf",
    };
  },
});

/**
 * Records a genuine download. Ownership is re-checked here so a client can
 * never fabricate download records for resources they do not own.
 */
export const logDownload = mutation({
  args: { resourceId: v.string() },
  handler: async (ctx, { resourceId }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return;
    const owned = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("resourceId"), resourceId))
      .first();
    if (owned === null) return;
    await ctx.db.insert("downloads", {
      userId: user._id,
      resourceId,
      downloadedAt: Date.now(),
    });
  },
});

/**
 * Mints a single-use, expiring download token for a resource. Called by
 * fileActions.getSecureDownload after entitlement was verified — this
 * mutation re-checks the caller owns the resource so a token can never be
 * minted for content the user is not entitled to.
 */
export const mintDownloadToken = mutation({
  args: {
    token: v.string(),
    resourceId: v.string(),
    userId: v.id("users"),
    storageId: v.id("_storage"),
    filename: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const owned = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("resourceId"), args.resourceId))
      .first();
    if (owned === null) {
      throw new Error("You do not own this resource.");
    }
    await ctx.db.insert("downloadTokens", {
      token: args.token,
      kind: "resource",
      resourceId: args.resourceId,
      userId: args.userId,
      storageId: args.storageId,
      filename: args.filename,
      fileSize: args.fileSize,
      mimeType: args.mimeType,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
    return args.token;
  },
});

/**
 * Mints a single-use, expiring download token for a course lesson file.
 * Non-preview lessons require an active enrollment (re-checked here);
 * preview lesson files are available to any signed-in user.
 */
export const mintLessonToken = mutation({
  args: {
    token: v.string(),
    courseId: v.id("courses"),
    lessonId: v.id("courseLessons"),
    userId: v.id("users"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson || lesson.courseId !== args.courseId) {
      throw new Error("Lesson not found.");
    }
    if (!lesson.isPreview) {
      const enrollment = await ctx.db
        .query("enrollments")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .filter((q) => q.eq(q.field("courseId"), args.courseId))
        .first();
      if (enrollment === null || enrollment.status !== "active") {
        throw new Error("Enroll in this course to access its files.");
      }
    }
    await ctx.db.insert("downloadTokens", {
      token: args.token,
      kind: "lesson",
      courseId: args.courseId,
      lessonId: args.lessonId,
      userId: args.userId,
      storageId: args.storageId,
      filename: args.filename,
      mimeType: args.mimeType,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
    return args.token;
  },
});

/**
 * Validates and consumes a download token. Called by the /files/download
 * HTTP action after the caller's identity passed (the HTTP action
 * compares the token's userId against the authenticated subject).
 *
 * A token is single-use and expires 5 minutes after it was minted, so an
 * expired or already-used token is rejected, and a token for one item
 * cannot be replayed against another. Only tokens minted by the file
 * actions exist — and those are minted only for entitled users.
 */
export const consumeDownloadToken = mutation({
  args: {
    token: v.string(),
    kind: v.union(v.literal("resource"), v.literal("lesson")),
    resourceId: v.optional(v.string()),
    courseId: v.optional(v.id("courses")),
    lessonId: v.optional(v.id("courseLessons")),
    userId: v.id("users"),
  },
  handler: async (ctx, { token, kind, resourceId, courseId, lessonId, userId }) => {
    const row = await ctx.db
      .query("downloadTokens")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
    if (row === null) {
      throw new Error("This download link is not valid.");
    }
    if (row.usedAt !== undefined) {
      throw new Error("This download link has already been used.");
    }
    if (row.expiresAt < Date.now()) {
      throw new Error("This download link has expired.");
    }
    if (row.kind !== kind) {
      throw new Error("This download link does not match the item.");
    }
    if (kind === "resource" && row.resourceId !== resourceId) {
      throw new Error("This download link does not match the resource.");
    }
    if (
      kind === "lesson" &&
      (row.courseId !== courseId || row.lessonId !== lessonId)
    ) {
      throw new Error("This download link does not match the lesson.");
    }
    if (row.userId !== userId) {
      throw new Error("This download link belongs to another account.");
    }

    // Authorization succeeded and access was issued — only now record it.
    await ctx.db.insert("downloads", {
      userId: row.userId,
      resourceId: row.resourceId ?? "",
      downloadedAt: Date.now(),
    });
    await ctx.db.patch(row._id, { usedAt: Date.now() });

    return {
      storageId: row.storageId,
      filename: row.filename,
      mimeType: row.mimeType,
    };
  },
});

/* ------------------------- admin management ------------------------ */

/** Admin: get a fresh upload URL (expires quickly, single use). */
export const getUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/** Admin: record a successfully uploaded file against a resource. */
export const attachResourceFile = mutation({
  args: {
    resourceId: v.string(),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
    kind: v.union(v.literal("main"), v.literal("preview")),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdmin(ctx);
    const resource = await ctx.db
      .query("resources")
      .withIndex("slug", (q) => q.eq("slug", args.resourceId))
      .first();
    if (!resource) throw new Error("Resource not found.");
    const filename = args.filename.trim();
    if (!filename) throw new Error("A filename is required.");
    if (args.fileSize <= 0 || args.fileSize > MAX_FILE_SIZE) {
      throw new Error("Invalid file size.");
    }

    const existing = await ctx.db
      .query("resourceFiles")
      .withIndex("by_resource", (q) => q.eq("resourceId", args.resourceId))
      .collect();
    const version = existing.filter((f) => f.kind === args.kind).length + 1;

    // Replacing: retire the previously active file of the same kind.
    for (const f of existing) {
      if (f.kind === args.kind && f.status === "active") {
        await ctx.db.patch(f._id, { status: "replaced" });
      }
    }

    const id = await ctx.db.insert("resourceFiles", {
      resourceId: args.resourceId,
      storageId: args.storageId,
      filename,
      displayFilename: filename,
      mimeType: args.mimeType || "application/pdf",
      fileSize: args.fileSize,
      version,
      kind: args.kind,
      status: "active",
      uploadedBy: actor._id,
      uploadedAt: Date.now(),
    });
    return id;
  },
});

/** Admin: remove a file (metadata + storage object). */
export const removeResourceFile = mutation({
  args: { id: v.id("resourceFiles") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const file = await ctx.db.get(id);
    if (!file) throw new Error("File not found.");
    await ctx.db.patch(id, { status: "removed" });
    try {
      await ctx.storage.delete(file.storageId);
    } catch {
      // Storage delete is best-effort; the metadata row is authoritative.
    }
    return id;
  },
});

/** Admin: all file rows for a resource (version history). */
export const listResourceFiles = query({
  args: { resourceId: v.string() },
  handler: async (ctx, { resourceId }) => {
    await requireAdminQuery(ctx);
    const rows = await ctx.db
      .query("resourceFiles")
      .withIndex("by_resource", (q) => q.eq("resourceId", resourceId))
      .collect();
    return [...rows]
      .sort((a, b) => a.uploadedAt - b.uploadedAt)
      .map((f) => ({
        _id: f._id,
        kind: f.kind,
        status: f.status,
        filename: f.filename,
        mimeType: f.mimeType,
        fileSize: f.fileSize,
        version: f.version,
        uploadedAt: f.uploadedAt,
      }));
  },
});

