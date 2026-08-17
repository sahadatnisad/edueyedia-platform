import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

/* ------------------------------------------------------------------ */
/*  Download actions.                                                  */
/*                                                                    */
/*  These live apart from files.ts so the actions can call the         */
/*  entitlement/query functions through `api.files.*` without          */
/*  self-referencing the same module (which breaks TS inference).      */
/*                                                                    */
/*  Flow: entitlement verified → rate limit → single-use token minted  */
/*  (5-minute expiry) → client opens /files/download?token=… — the     */
/*  HTTP action re-checks the token, expiry, ownership and the         */
/*  caller's identity before streaming the file.                       */
/* ------------------------------------------------------------------ */

const TOKEN_TTL_MS = 5 * 60 * 1000; // download tokens live 5 minutes

/**
 * The protected download flow for a resource:
 * entitlement verified → rate limit → single-use token issued.
 * No permanent public URL is ever exposed, and the download is not
 * logged until the HTTP action actually streams the file.
 */
export const getSecureDownload = action({
  args: { resourceId: v.string() },
  handler: async (
    ctx,
    { resourceId },
  ): Promise<{
    token: string;
    filename: string;
    fileSize: number;
    expiresAt: number;
  }> => {
    const check = await ctx.runQuery(api.files.downloadEntitlement, {
      resourceId,
    });
    if (!check.allowed) {
      if (check.reason === "not-signed-in") {
        throw new Error("Sign in to download this resource.");
      }
      if (check.reason === "not-owned") {
        throw new Error("You do not own this resource.");
      }
      throw new Error("This resource is not available.");
    }

    await ctx.runMutation(api.ratelimit.hit, {
      policy: "download",
      identifier: check.userId,
    });

    const file = await ctx.runQuery(api.files.activeResourceFile, {
      resourceId,
    });
    if (file === null) {
      throw new Error("A file is not attached to this resource yet.");
    }

    const token = crypto.randomUUID();
    const now = Date.now();
    // Server determines userId and storageId — the client only sends
    // filename, fileSize, mimeType which are display-only values.
    await ctx.runMutation(api.files.mintDownloadToken, {
      token,
      resourceId,
      filename: file.displayFilename || file.filename,
      fileSize: file.fileSize,
      mimeType: file.mimeType || "application/pdf",
      expiresAt: now + TOKEN_TTL_MS,
    });

    return {
      token,
      filename: file.displayFilename || file.filename,
      fileSize: file.fileSize,
      expiresAt: now + TOKEN_TTL_MS,
    };
  },
});

/**
 * Signed download for a course lesson file. Non-preview lessons require an
 * active enrollment (checked server-side); preview lesson files are public.
 */
export const getLessonFile = action({
  args: {
    courseId: v.id("courses"),
    lessonId: v.id("courseLessons"),
  },
  handler: async (
    ctx,
    { courseId, lessonId },
  ): Promise<{
    token: string;
    courseId: Id<"courses">;
    lessonId: Id<"courseLessons">;
    filename: string;
    title: string;
    expiresAt: number;
  }> => {
    const lesson = await ctx.runQuery(api.files.lessonFileRef, {
      courseId,
      lessonId,
    });
    if (lesson === null) {
      throw new Error("This lesson has no attached file.");
    }

    // Lesson files require a signed-in caller. Preview lessons are then
    // available to any signed-in user; all other lessons require an active
    // enrollment (checked again in the mint mutation, server-side).
    const user = await ctx.runQuery(api.users.currentUser);
    if (user === null) {
      throw new Error("Sign in to access course files.");
    }
    const isPreview = await ctx.runQuery(api.content.lessonIsPreview, {
      courseId,
      lessonId,
    });
    if (!isPreview) {
      const enrollment = await ctx.runQuery(api.courses.courseEnrollment, {
        courseId,
      });
      if (!enrollment.enrolled) {
        throw new Error("Enroll in this course to access its files.");
      }
    }

    const token = crypto.randomUUID();
    const now = Date.now();
    // Server determines userId and storageId — the client only sends
    // filename and mimeType which are display-only values.
    await ctx.runMutation(api.files.mintLessonToken, {
      token,
      courseId,
      lessonId,
      filename: lesson.filename,
      mimeType: lesson.mimeType || "application/pdf",
      expiresAt: now + TOKEN_TTL_MS,
    });

    return {
      token,
      courseId,
      lessonId,
      filename: lesson.filename,
      title: lesson.title,
      expiresAt: now + TOKEN_TTL_MS,
    };
  },
});
