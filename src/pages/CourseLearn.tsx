import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { cn } from "@/lib/utils";
import { CONVEX_URL, fetchAndSaveDownload } from "@/lib/secureDownload";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PageMeta } from "@/components/seo";
import {
  useCourse,
  useCourseEnrollment,
  useLessonContent,
} from "@/hooks/use-content";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Circle,
  Download,
  GraduationCap,
  Loader2,
  Lock,
} from "lucide-react";

/** Extract a YouTube video id from either a raw id or a watch/short URL. */
function youtubeId(input: string): string {
  const watch = input.match(/[?&]v=([^&#]+)/);
  if (watch) return watch[1];
  const short = input.match(/youtu\.be\/([^?#]+)/);
  if (short) return short[1];
  const shorts = input.match(/shorts\/([^?#]+)/);
  if (shorts) return shorts[1];
  return input.trim();
}

/**
 * The course player — modules, lessons, lesson content and completion
 * tracking. Access is enforced server-side: preview lessons are public
 * (signed-out visitors can open them), everything else requires an active
 * enrollment. PDF / downloadable-resource lessons stream through the same
 * single-use token flow as resource files — never a permanent URL.
 */
export default function CourseLearn() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId?: string }>();
  const navigate = useNavigate();

  const course = useCourse(slug);
  const courseId = course?.id;
  const lessonsQuery = useQuery(api.content.courseLessons, {
    courseId: courseId as never,
  });
  const enrollment = useCourseEnrollment(courseId);
  const setLessonComplete = useMutation(api.courses.setLessonComplete);
  const getLessonFile = useAction(api.fileActions.getLessonFile);
  const authToken = useAuthToken();
  const [downloading, setDownloading] = useState(false);

  // Flatten lessons into one ordered list, remembering each lesson's module.
  const flatLessons = useMemo(() => {
    if (!lessonsQuery) return [];
    return lessonsQuery.flatMap((group) =>
      group.lessons.map((l) => ({
        ...l,
        moduleTitle: group.module.title,
        modulePosition: group.module.position,
      })),
    );
  }, [lessonsQuery]);

  const selectedId = lessonId ?? flatLessons[0]?._id;
  const selected = flatLessons.find((l) => l._id === selectedId);
  const lesson = useLessonContent(courseId, selected?._id);

  const completedSet = useMemo(
    () => new Set((enrollment?.completedLessonIds ?? []) as string[]),
    [enrollment],
  );
  const completedCount = flatLessons.filter((l) =>
    completedSet.has(l._id as string),
  ).length;
  const percent =
    flatLessons.length > 0
      ? Math.round((completedCount / flatLessons.length) * 100)
      : 0;

  const selectedIndex = flatLessons.findIndex((l) => l._id === selectedId);
  const prev = selectedIndex > 0 ? flatLessons[selectedIndex - 1] : null;
  const next =
    selectedIndex >= 0 && selectedIndex < flatLessons.length - 1
      ? flatLessons[selectedIndex + 1]
      : null;

  const goTo = (id: string) =>
    navigate(`/courses/${slug}/learn/${id}`, { replace: false });

  const toggleComplete = async () => {
    if (!selected || !courseId) return;
    const willComplete = !completedSet.has(selected._id as string);
    await setLessonComplete({
      courseId: courseId as never,
      lessonId: selected._id as never,
      completed: willComplete,
    });
    toast.success(willComplete ? "Lesson completed" : "Marked as incomplete", {
      description: selected.title,
    });
  };

  const handleDownload = async () => {
    if (!courseId || !selected || !lesson?.hasFile) return;
    setDownloading(true);
    try {
      const res = await getLessonFile({
        courseId: courseId as never,
        lessonId: selected._id as never,
      });
      await fetchAndSaveDownload({
        convexUrl: CONVEX_URL,
        authToken,
        params: {
          kind: "lesson",
          token: res.token,
          courseId,
          lessonId: selected._id as string,
        },
        fallbackFilename: res.filename || `${selected.slug}.pdf`,
      });
      toast.success("Download started", {
        description: `${selected.title} — check your downloads folder.`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-navy-deep">
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="h-8 w-48 animate-pulse rounded-full bg-muted" />
        </main>
        <Footer />
      </div>
    );
  }

  // Coming-soon courses have no learning area yet.
  if (course.status === "coming-soon") {
    return (
      <div className="min-h-screen bg-ivory dark:bg-navy-deep">
        <Navbar />
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <GraduationCap className="size-10 text-gold" />
          <p className="font-serif text-3xl text-navy dark:text-slate-100">
            This course isn't open yet
          </p>
          <p className="font-bangla max-w-md text-sm leading-relaxed text-ink-soft dark:text-slate-400">
            কোর্সটি প্রকাশের প্রস্তুতি চলছে। প্রকাশিত হলে এখান থেকেই শেখা শুরু
            করতে পারবেন।
          </p>
          <Button asChild className="mt-2 rounded-full">
            <Link to={`/courses/${course.slug}`}>Back to course</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Not enrolled — preview lessons only; everything else stays locked.
  const locked = !enrollment?.enrolled;
  // The selected lesson's content is only returned by the server when the
  // visitor may see it (preview lessons are public; the rest need enrollment).
  const selectedLocked = locked && !lesson;

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title={`${course.titleBn || course.title} — Course Player | Edueyedia`}
        description={`Learn ${course.title} at your own pace — lessons, progress and downloads.`}
        path={`/courses/${course.slug}/learn`}
      />
      <Navbar />
      <main className="pt-24 pb-24 sm:pt-28">
        <div className="mx-auto max-w-6xl px-6">
          {/* breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-medium text-ink-soft dark:text-slate-400">
            <Link to="/" className="transition-colors hover:text-navy dark:hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link to="/courses" className="transition-colors hover:text-navy dark:hover:text-white">
              Courses
            </Link>
            <ChevronRight className="size-3" />
            <Link
              to={`/courses/${course.slug}`}
              className="transition-colors hover:text-navy dark:hover:text-white"
            >
              {course.title}
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-navy dark:text-slate-100">Learn</span>
          </nav>

          {/* header */}
          <div className="mt-6 flex flex-col gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-teal uppercase dark:text-teal-bright">
                {locked ? "Course preview" : "Course player"}
              </p>
              <h1 className="font-bangla mt-2 text-3xl leading-tight font-bold text-navy text-balance sm:text-4xl dark:text-slate-50">
                {course.titleBn}
              </h1>
              <p className="font-serif mt-1 text-base text-ink-soft dark:text-slate-300">
                {course.title}
              </p>
            </div>
            <div className="w-full sm:w-64">
              <div className="flex items-center justify-between text-xs font-medium text-ink-soft dark:text-slate-400">
                <span>
                  {locked
                    ? "Preview — enroll for full access"
                    : `${completedCount}/${flatLessons.length} lessons`}
                </span>
                {!locked && <span>{percent}%</span>}
              </div>
              {!locked && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cool dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-teal transition-all duration-500 dark:bg-teal-bright"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
            {/* sidebar — always visible so preview lessons are reachable */}
            <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
              <div className="flex flex-col gap-5">
                {lessonsQuery?.map((group) => (
                  <div key={group.module._id}>
                    <p className="text-[10px] font-bold tracking-[0.18em] text-gold uppercase dark:text-gold">
                      {group.module.title}
                    </p>
                    <ul className="mt-2.5 flex flex-col gap-1">
                      {group.lessons.map((l) => {
                        const done = completedSet.has(l._id as string);
                        const active = l._id === selectedId;
                        return (
                          <li key={l._id}>
                            <button
                              type="button"
                              onClick={() => goTo(l._id)}
                              className={cn(
                                "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13px] transition-all duration-200",
                                active
                                  ? "border-navy bg-navy text-white shadow-md dark:border-teal dark:bg-teal dark:text-navy-deep"
                                  : "border-hairline bg-white text-ink-soft hover:border-slate-300 hover:text-navy dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-teal/40 dark:hover:text-white",
                              )}
                            >
                              {done ? (
                                <CheckCircle2
                                  className={cn(
                                    "size-4 shrink-0",
                                    active
                                      ? "text-gold"
                                      : "text-teal dark:text-teal-bright",
                                  )}
                                />
                              ) : (
                                <Circle
                                  className={cn(
                                    "size-4 shrink-0",
                                    active
                                      ? "text-gold/70"
                                      : "text-ink-soft/40 dark:text-slate-500",
                                  )}
                                />
                              )}
                              <span className="line-clamp-1">{l.title}</span>
                              {l.isPreview && (
                                <span
                                  className={cn(
                                    "ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-[0.12em] uppercase",
                                    active
                                      ? "bg-gold/20 text-gold"
                                      : "bg-gold/15 text-[#8a681f] dark:text-gold",
                                  )}
                                >
                                  Preview
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </aside>

            {/* content */}
            <section className="min-w-0">
              {selectedLocked ? (
                /* Non-preview lesson without enrollment */
                <div className="flex flex-col items-center gap-5 rounded-[2rem] border border-dashed border-hairline px-6 py-16 text-center dark:border-white/15">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-gold/10">
                    <Lock className="size-8 text-[#8a681f] dark:text-gold" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl text-navy dark:text-slate-100">
                      {selected?.title ?? "Lesson locked"}
                    </p>
                    <p className="font-bangla mt-2 max-w-md text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                      {course.isFree
                        ? "সম্পূর্ণ কোর্স অ্যাক্সেস পেতে ফ্রি এনরোল করুন — আপনার অগ্রগতি স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকবে।"
                        : "এই লেসনটি এনরোলমেন্টের পরে খোলা যাবে।"}
                    </p>
                  </div>
                  <Button asChild className="rounded-full">
                    <Link to={`/courses/${course.slug}`}>
                      {course.isFree ? "Start Free Course" : "View Course"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              ) : selected && lesson ? (
                <div className="rounded-[2rem] border border-hairline bg-white p-7 sm:p-10 dark:border-white/10 dark:bg-navy-surface">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-teal uppercase dark:text-teal-bright">
                    {selected.moduleTitle}
                  </p>
                  <h2 className="font-serif mt-3 text-3xl leading-tight text-navy text-balance sm:text-4xl dark:text-slate-50">
                    {lesson.title}
                  </h2>
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-hairline py-3 text-xs text-ink-soft dark:border-white/10 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      {lesson.isPreview ? (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[#8a681f] uppercase dark:text-gold">
                          Preview lesson
                        </span>
                      ) : (
                        <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-teal uppercase dark:text-teal-bright">
                          {lesson.lessonType}
                        </span>
                      )}
                    </span>
                    {lesson.duration && <span>{lesson.duration}</span>}
                  </div>

                  {lesson.content ? (
                    <div className="mt-8 flex flex-col gap-5">
                      {lesson.content
                        .split(/\n{2,}/)
                        .filter((p) => p.trim().length > 0)
                        .map((para, i) => (
                          <p
                            key={i}
                            className="font-bangla text-[17px] leading-[1.9] text-ink dark:text-slate-200"
                          >
                            {para}
                          </p>
                        ))}
                    </div>
                  ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-hairline bg-cool/50 p-6 text-sm leading-relaxed text-ink-soft dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-400">
                      {lesson.lessonType === "PDF" ||
                      lesson.lessonType === "downloadable-resource"
                        ? "এই লেসনটি একটি ফাইল — নিচের বাটন থেকে ডাউনলোড করুন।"
                        : "এই লেসনের বিষয়বস্তু প্রস্তুত করা হচ্ছে — শীঘ্রই যুক্ত হবে। আপাতত পরবর্তী লেসনে এগিয়ে যেতে পারেন।"}
                    </div>
                  )}

                  {/* video lesson — accepts a YouTube ID or a full watch URL */}
                  {lesson.lessonType === "video" && lesson.videoId && (
                    <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-navy-deep">
                      <iframe
                        title={lesson.title}
                        src={`https://www.youtube.com/embed/${youtubeId(lesson.videoId)}`}
                        className="size-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* PDF / downloadable-resource lesson — secure token download */}
                  {(lesson.lessonType === "PDF" ||
                    lesson.lessonType === "downloadable-resource") &&
                    lesson.hasFile && (
                      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-cool/40 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                        <p className="text-sm text-ink-soft dark:text-slate-300">
                          <span className="font-semibold text-navy dark:text-slate-100">
                            {lesson.lessonType === "PDF" ? "PDF file" : "Lesson file"}
                          </span>{" "}
                          — private, secure delivery. Downloading opens the file.
                        </p>
                        <Button
                          type="button"
                          className="rounded-full"
                          disabled={downloading}
                          onClick={handleDownload}
                        >
                          {downloading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Download className="size-4" />
                          )}
                          {downloading ? "Preparing…" : "Download file"}
                        </Button>
                      </div>
                    )}

                  {locked && (
                    /* Enrolled content is gated — show the CTA under previews */
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4">
                      <p className="font-bangla text-sm text-ink-soft dark:text-slate-300">
                        এটা একটি প্রিভিউ লেসন। সম্পূর্ণ কোর্স অ্যাক্সেস পেতে এনরোল করুন।
                      </p>
                      <Button asChild size="sm" className="rounded-full">
                        <Link to={`/courses/${course.slug}`}>
                          {course.isFree ? "Enroll to continue" : "View Course"}
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* complete + navigation */}
                  {!locked && (
                    <div className="mt-10 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                      <Button
                        type="button"
                        variant={completedSet.has(selected._id as string) ? "outline" : "default"}
                        className="rounded-full"
                        onClick={toggleComplete}
                      >
                        <CheckCircle2 className="size-4" />
                        {completedSet.has(selected._id as string)
                          ? "Completed — undo"
                          : "Mark as complete"}
                      </Button>
                      <div className="flex items-center gap-3">
                        {prev && (
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => goTo(prev._id)}
                          >
                            <ArrowLeft className="size-4" /> Previous
                          </Button>
                        )}
                        {next && (
                          <Button
                            type="button"
                            className="rounded-full"
                            onClick={() => goTo(next._id)}
                          >
                            Next <ArrowRight className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex min-h-72 items-center justify-center rounded-[2rem] border border-dashed border-hairline dark:border-white/15">
                  <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
