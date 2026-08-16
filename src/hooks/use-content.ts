import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

/**
 * Frontend data layer for the database-backed content platform.
 *
 * Every hook is a reactive Convex subscription. The queries in
 * `src/convex/content.ts` return shapes compatible with the approved
 * frontend components (Resource / Article / Course), so existing cards
 * and layouts keep working unchanged.
 */

/** Everything the public site needs (published content only). */
export function useAllContent() {
  return useQuery(api.content.allPublished);
}

/** A single published resource by slug (null → not found/not published). */
export function useResource(slug: string | undefined) {
  return useQuery(api.content.resourceBySlug, { slug: slug ?? "" });
}

/** A single published article (research or blog) by slug. */
export function useArticle(slug: string | undefined) {
  return useQuery(api.content.articleBySlug, { slug: slug ?? "" });
}

/** A single published/coming-soon course by slug. */
export function useCourse(slug: string | undefined) {
  return useQuery(api.content.courseBySlug, { slug: slug ?? "" });
}

/** Published resources by slugs (cart, related lists, checkout). */
export function useResourcesBySlugs(slugs: string[] | undefined) {
  return useQuery(api.content.resourcesBySlugs, { slugs: slugs ?? [] });
}

/** Resource categories with live published counts. */
export function useResourceCategories() {
  return useQuery(api.content.resourceCategories);
}

/** Homepage featured selections — driven by the featured flag in the DB. */
export function useFeaturedHome() {
  return useQuery(api.content.featuredHome);
}

/** Grouped search across published research / resources / blog / courses. */
export function useSearchContent(q: string) {
  return useQuery(api.content.searchAll, { q });
}

/** A single JSON site setting (e.g. scholarships, collections). */
export function useSiteSetting(key: string) {
  return useQuery(api.content.siteSetting, { key });
}

/** The signed-in user's course enrollments with progress. */
export function useMyEnrollments() {
  return useQuery(api.courses.myEnrollments);
}

/** The signed-in user's enrollment + completion state for one course. */
export function useCourseEnrollment(courseId: string | undefined) {
  return useQuery(api.courses.courseEnrollment, {
    courseId: courseId as never,
  });
}

/** A single lesson's content (enrollment-gated server-side). */
export function useLessonContent(
  courseId: string | undefined,
  lessonId: string | undefined,
) {
  return useQuery(api.courses.lessonContent, {
    courseId: courseId as never,
    lessonId: lessonId as never,
  });
}

/** Whether the signed-in user has the admin role (frontend guard only). */
export function useIsAdmin() {
  return useQuery(api.admin.isAdmin);
}
