import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { getCurrentUser } from "./users";

/* ------------------------------------------------------------------ */
/*  Course enrollments, progress and lesson access.                    */
/*                                                                    */
/*  Everything here re-checks the signed-in user server-side — the     */
/*  client never decides who is enrolled or what content is unlocked.  */
/*  Free published courses enroll instantly; paid courses unlock only  */
/*  through the unified checkout (server-verified order → enrollment). */
/* ------------------------------------------------------------------ */

/** Enroll the signed-in user in a published free course. */
export const enrollInCourse = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) throw new Error("You must be signed in to enroll.");

    const course = await ctx.db.get(courseId);
    if (!course || course.status === "archived") {
      throw new Error("Course not found.");
    }
    if (course.status !== "published") {
      throw new Error("This course is not open for enrollment yet.");
    }
    if (!course.isFree) {
      throw new Error(
        "This is a paid course — enroll through checkout after payment verification.",
      );
    }

    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("courseId"), courseId))
      .first();
    if (existing) {
      return { alreadyEnrolled: true as const, enrollmentId: existing._id };
    }

    const enrollmentId = await ctx.db.insert("enrollments", {
      userId: user._id,
      courseId,
      enrolledAt: Date.now(),
      status: "active",
    });

    // Free enrollment confirmation (scheduled; never blocks enrollment).
    if (user.email) {
      await ctx.scheduler.runAfter(0, api.email.sendCourseEnrollment, {
        courseId,
        email: user.email,
      });
    }
    return { alreadyEnrolled: false as const, enrollmentId };
  },
});

/** Minimal course info by id (for emails and lookups). */
export const courseById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    const row = await ctx.db.get(courseId);
    if (!row) return null;
    return {
      slug: row.slug,
      title: row.title,
      titleBn: row.titleBn,
    };
  },
});

/** The signed-in user's enrollments with course details and progress. */
export const myEnrollments = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return [];

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    const result = [];
    for (const enrollment of enrollments) {
      const course = await ctx.db.get(enrollment.courseId);
      if (
        !course ||
        (course.status !== "published" && course.status !== "coming-soon")
      ) {
        continue;
      }
      const lessons = await ctx.db
        .query("courseLessons")
        .withIndex("by_course", (q) => q.eq("courseId", course._id))
        .collect();
      const completed = await ctx.db
        .query("courseProgress")
        .withIndex("by_user_course", (q) =>
          q.eq("userId", user._id).eq("courseId", course._id),
        )
        .collect();
      const completedIds = new Set(completed.map((c) => c.lessonId as string));

      result.push({
        courseId: course._id,
        slug: course.slug,
        title: course.title,
        titleBn: course.titleBn,
        category: course.category,
        duration: course.duration,
        isFree: course.isFree,
        price: course.price,
        cover: {
          tone: course.coverTone,
          pattern: course.coverPattern,
          glyph: course.coverGlyph,
        },
        enrolledAt: enrollment.enrolledAt,
        totalLessons: lessons.length,
        completedLessons: lessons.filter((l) =>
          completedIds.has(l._id as string),
        ).length,
      });
    }
    return result;
  },
});

/**
 * The signed-in user's relationship with one course: whether they are
 * enrolled and which lessons they have completed. Returns an unenrolled
 * shape when signed out or not enrolled — the UI shows the honest state.
 */
export const courseEnrollment = query({
  args: { courseId: v.optional(v.id("courses")) },
  handler: async (ctx, { courseId }) => {
    if (courseId === undefined) {
      return { enrolled: false, completedLessonIds: [], totalLessons: 0 };
    }
    const user = await getCurrentUser(ctx);
    if (user === null) {
      return { enrolled: false, completedLessonIds: [], totalLessons: 0 };
    }

    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("courseId"), courseId))
      .first();

    const lessons = await ctx.db
      .query("courseLessons")
      .withIndex("by_course", (q) => q.eq("courseId", courseId))
      .collect();

    if (enrollment === null) {
      return {
        enrolled: false,
        completedLessonIds: [],
        totalLessons: lessons.length,
      };
    }

    const completed = await ctx.db
      .query("courseProgress")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", user._id).eq("courseId", courseId),
      )
      .collect();

    return {
      enrolled: true,
      enrollmentId: enrollment._id,
      completedLessonIds: completed.map((c) => c.lessonId as string),
      totalLessons: lessons.length,
      completedLessons: completed.length,
    };
  },
});

/** Mark a lesson complete / incomplete for an enrolled user. */
export const setLessonComplete = mutation({
  args: {
    courseId: v.id("courses"),
    lessonId: v.id("courseLessons"),
    completed: v.boolean(),
  },
  handler: async (ctx, { courseId, lessonId, completed }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) throw new Error("You must be signed in.");

    const lesson = await ctx.db.get(lessonId);
    if (!lesson || lesson.courseId !== courseId) {
      throw new Error("Lesson not found in this course.");
    }

    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("courseId"), courseId))
      .first();
    if (enrollment === null) {
      throw new Error("You are not enrolled in this course.");
    }

    const existing = await ctx.db
      .query("courseProgress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", lessonId),
      )
      .first();

    if (completed && existing === null) {
      await ctx.db.insert("courseProgress", {
        userId: user._id,
        courseId,
        lessonId,
        completedAt: Date.now(),
      });
    } else if (!completed && existing !== null) {
      await ctx.db.delete(existing._id);
    }
    return lessonId;
  },
});

/**
 * A single lesson's content. Preview lessons are public; everything else
 * requires an active enrollment — checked server-side.
 */
export const lessonContent = query({
  args: {
    courseId: v.optional(v.id("courses")),
    lessonId: v.optional(v.id("courseLessons")),
  },
  handler: async (ctx, { courseId, lessonId }) => {
    if (courseId === undefined || lessonId === undefined) return null;
    const lesson = await ctx.db.get(lessonId);
    if (!lesson || lesson.courseId !== courseId) return null;

    const user = await getCurrentUser(ctx);
    let enrolled = false;
    if (user !== null) {
      const enrollment = await ctx.db
        .query("enrollments")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("courseId"), courseId))
        .first();
      enrolled = enrollment !== null;
    }
    if (!lesson.isPreview && !enrolled) return null;

    return {
      title: lesson.title,
      lessonType: lesson.lessonType,
      content: lesson.content ?? "",
      videoProvider: lesson.videoProvider,
      videoId: lesson.videoId,
      hasFile: Boolean(lesson.fileStorageId),
      duration: lesson.duration,
      isPreview: lesson.isPreview,
    };
  },
});
