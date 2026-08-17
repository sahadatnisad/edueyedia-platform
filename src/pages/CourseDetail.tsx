import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Layers,
  PlayCircle,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { CourseCover } from "@/components/CourseCover";
import { PageMeta } from "@/components/seo";
import { useSite } from "@/components/site/SiteContext";
import { useAuth } from "@/hooks/use-auth";
import {
  useAllContent,
  useCourse,
  useCourseEnrollment,
} from "@/hooks/use-content";
import { getCourse } from "@/data/courses";

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  // DB-backed course (published/coming-soon). Legacy fallback while loading.
  const dbCourse = useCourse(slug);
  const course =
    dbCourse ?? (dbCourse === undefined ? (slug ? getCourse(slug) : undefined) : undefined);
  const content = useAllContent();
  const allCourses = content?.courses ?? [];
  const enrollInCourse = useMutation(api.courses.enrollInCourse);
  const { addCourseToCart, setCartOpen } = useSite();
  // Enrollment state only applies to DB courses (legacy fallback has no id).
  const enrollment = useCourseEnrollment(course?.id);
  const enrolled = enrollment?.enrolled === true;

  const courseJsonLd = useMemo(
    () =>
      course
        ? {
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.titleBn || course.title,
            description: course.shortDescription || course.description,
            provider: {
              "@type": "Organization",
              name: "Edueyedia",
            },
            offers: {
              "@type": "Offer",
              price: course.price,
              priceCurrency: "BDT",
              availability: "https://schema.org/InStock",
            },
          }
        : undefined,
    [course],
  );

  if (!course) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-navy-deep">
        <Navbar />
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-serif text-3xl text-navy dark:text-slate-100">Course not found</p>
          <Link
            to="/courses"
            className="link-underline text-sm font-semibold text-teal dark:text-teal-bright"
          >
            Back to Courses
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const related = allCourses.filter((c) => c.slug !== course.slug).slice(0, 3);
  const comingSoon = course.status === "coming-soon";

  const handleEnroll = async () => {
    if (!course.id) return;
    if (!isAuthenticated) {
      navigate(`/auth?returnTo=/courses/${course.slug}`);
      return;
    }
    try {
      await enrollInCourse({ courseId: course.id as never });
      toast.success("Enrolled", { description: course.title });
      navigate(`/courses/${course.slug}/learn`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not enroll.");
    }
  };

  const handleAddToCart = () => {
    addCourseToCart(course);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title={`${course.titleBn || course.title} — Edueyedia Course`}
        description={course.shortDescription || course.description}
        path={`/courses/${course.slug}`}
        jsonLd={courseJsonLd}
      />
      <Navbar />
      <main className="pt-28 pb-24 sm:pt-32">
        <div className="mx-auto max-w-6xl px-6">
          {/* breadcrumb */}
          <Reveal>
            <nav className="flex items-center gap-1.5 text-xs font-medium text-ink-soft dark:text-slate-400">
              <Link to="/" className="transition-colors hover:text-navy dark:hover:text-white">
                Home
              </Link>
              <ChevronRight className="size-3" />
              <Link to="/courses" className="transition-colors hover:text-navy dark:hover:text-white">
                Courses
              </Link>
              <ChevronRight className="size-3" />
              <span className="text-navy dark:text-slate-100">{course.title}</span>
            </nav>
          </Reveal>

          {/* hero */}
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
            <Reveal className="lg:col-span-4">
              <div className="max-w-sm">
                <CourseCover course={course} />
              </div>
            </Reveal>

            <div className="lg:col-span-8">
              <Reveal delay={0.08}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-teal/10 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-teal uppercase dark:text-teal-bright">
                    {course.category}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase",
                      course.isFree
                        ? "bg-teal/10 text-teal dark:text-teal-bright"
                        : "bg-gold/15 text-[#8a681f] dark:text-gold",
                    )}
                  >
                    {course.isFree ? "Free course" : `Paid · ৳${course.price}`}
                  </span>
                  {comingSoon && (
                    <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-navy uppercase">
                      Coming Soon
                    </span>
                  )}
                </div>
              </Reveal>
              <Reveal delay={0.14}>
                <h1 className="font-bangla mt-5 text-4xl leading-[1.15] font-bold text-navy text-balance sm:text-5xl dark:text-slate-50">
                  {course.titleBn}
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="font-serif mt-2 text-xl text-ink-soft dark:text-slate-300">
                  {course.title}
                </p>
              </Reveal>
              <Reveal delay={0.26}>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-slate-300">
                  {course.description}
                </p>
              </Reveal>
              <Reveal delay={0.32}>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-hairline py-4 text-xs text-ink-soft dark:border-white/10 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5 text-teal" /> Level: {course.level}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-teal" /> {course.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="size-3.5 text-teal" /> {course.lessonCount} lessons
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-teal" /> Instructor: Edueyedia Faculty
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.38}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {comingSoon ? (
                    <>
                      <button
                        type="button"
                        disabled
                        className="inline-flex h-12 cursor-not-allowed items-center gap-2 rounded-full bg-navy/70 px-8 text-sm font-semibold text-white/70 dark:bg-teal/60 dark:text-navy-deep/80"
                      >
                        {course.isFree ? "Start Free Course" : "Enroll Now"}
                        <ArrowRight className="size-4" />
                      </button>
                      <p className="font-bangla max-w-xs text-xs leading-relaxed text-ink-soft dark:text-slate-400">
                        কোর্সটি প্রকাশের প্রস্তুতি চলছে — প্রস্তুত হলে এখান থেকেই
                        শুরু করতে পারবেন।
                      </p>
                    </>
                  ) : enrolled ? (
                    <Link
                      to={`/courses/${course.slug}/learn`}
                      className="group inline-flex h-12 items-center gap-2 rounded-full bg-navy px-8 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(21,34,56,0.5)] transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep"
                    >
                      <PlayCircle className="size-4" />
                      Continue Learning
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  ) : course.isFree ? (
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={handleEnroll}
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-navy px-8 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(21,34,56,0.5)] transition-all hover:-translate-y-0.5 hover:bg-navy/90 disabled:opacity-60 dark:bg-teal dark:text-navy-deep"
                    >
                      Start Free Course
                      <ArrowRight className="size-4" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-navy px-8 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(21,34,56,0.5)] transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep"
                      >
                        <ShoppingBag className="size-4" />
                        Enroll Now · ৳{course.price}
                        <ArrowRight className="size-4" />
                      </button>
                      <p className="font-bangla max-w-xs text-xs leading-relaxed text-ink-soft dark:text-slate-400">
                        এনরোলমেন্ট চেকআউটের মাধ্যমে সম্পন্ন হয় — পেমেন্ট নিশ্চিত
                        হলে কোর্সটি My Courses-এ আনলক হবে।
                      </p>
                    </>
                  )}
                </div>
              </Reveal>
            </div>
          </div>

          {/* body */}
          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-12">
              {/* what you'll learn */}
              <section>
                <Reveal>
                  <h2 className="font-serif text-2xl text-navy sm:text-3xl dark:text-slate-50">
                    What you'll learn
                  </h2>
                  <p className="font-bangla mt-1 text-sm text-teal dark:text-teal-bright">
                    এই কোর্স শেষে যা পারবেন
                  </p>
                </Reveal>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {course.whatYouLearn.map((item, i) => (
                    <Reveal key={item} delay={0.05 * i}>
                      <div className="flex items-start gap-3 rounded-2xl border border-hairline bg-white p-4 dark:border-white/10 dark:bg-navy-surface">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" />
                        <p className="text-sm leading-relaxed text-ink dark:text-slate-200">{item}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>

              {/* audience */}
              <section>
                <Reveal>
                  <h2 className="font-serif text-2xl text-navy sm:text-3xl dark:text-slate-50">
                    Who this course is for
                  </h2>
                </Reveal>
                <div className="mt-6 flex flex-col gap-3">
                  {course.audience.map((a, i) => (
                    <Reveal key={a} delay={0.05 * i}>
                      <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-white p-4 text-sm leading-relaxed text-ink dark:border-white/10 dark:bg-navy-surface dark:text-slate-200">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[11px] font-bold text-[#8a681f] dark:text-gold">
                          {i + 1}
                        </span>
                        {a}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>

              {/* curriculum */}
              <section>
                <Reveal>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl text-navy sm:text-3xl dark:text-slate-50">
                      Curriculum
                    </h2>
                    <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-[10px] font-bold text-teal dark:text-teal-bright">
                      {course.modules.length} modules
                    </span>
                  </div>
                </Reveal>
                <div className="mt-6 flex flex-col gap-4">
                  {course.modules.map((m, i) => (
                    <Reveal key={m.title} delay={0.05 * i}>
                      <div className="overflow-hidden rounded-3xl border border-hairline bg-white dark:border-white/10 dark:bg-navy-surface">
                        <div className="flex items-center justify-between gap-3 border-b border-hairline bg-cool/60 px-6 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                          <p className="text-sm font-semibold text-navy dark:text-slate-100">{m.title}</p>
                          <span className="text-[11px] font-medium text-ink-soft dark:text-slate-400">
                            {m.lessons.length} lessons
                          </span>
                        </div>
                        <ul className="flex flex-col">
                          {m.lessons.map((lesson, j) => (
                            <li
                              key={lesson}
                              className="flex items-center gap-3 border-b border-hairline/60 px-6 py-3.5 text-sm text-ink last:border-0 dark:border-white/5 dark:text-slate-300"
                            >
                              <span className="font-serif text-xs text-gold">
                                {String(i + 1)}.{String(j + 1)}
                              </span>
                              {lesson}
                              <ChevronRight className="ml-auto size-3.5 text-ink-soft/50" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>

              {/* requirements */}
              <section>
                <Reveal>
                  <h2 className="font-serif text-2xl text-navy sm:text-3xl dark:text-slate-50">
                    Requirements
                  </h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <div className="mt-6 flex items-start gap-3 rounded-3xl border border-hairline bg-white p-6 dark:border-white/10 dark:bg-navy-surface">
                    <BarChart3 className="mt-0.5 size-5 shrink-0 text-gold" />
                    <p className="text-sm leading-relaxed text-ink-soft dark:text-slate-300">
                      No prior experience needed beyond what is stated in the course level. A
                      willingness to practice each module's exercise is the only real prerequisite —
                      every lesson ships with notes and templates you can keep.
                    </p>
                  </div>
                </Reveal>
              </section>
            </div>

            {/* sidebar */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <Reveal delay={0.1}>
                <div className="rounded-3xl border border-hairline bg-white p-6 dark:border-white/10 dark:bg-navy-surface">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-navy dark:text-slate-100">
                      {course.isFree ? "Free course" : "Course price"}
                    </p>
                    <Sparkles className="size-4 text-gold" />
                  </div>
                  <p className="font-serif mt-2 text-3xl text-navy dark:text-slate-50">
                    {course.isFree ? (
                      "Free"
                    ) : (
                      <>
                        ৳{course.price}
                        {course.compareAt && (
                          <span className="ml-2 align-middle text-base text-ink-soft line-through">
                            ৳{course.compareAt}
                          </span>
                        )}
                      </>
                    )}
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5 border-t border-hairline pt-5 text-xs text-ink-soft dark:border-white/10 dark:text-slate-400">
                    <span className="flex items-center justify-between">
                      Level <span className="font-semibold text-navy dark:text-slate-100">{course.level}</span>
                    </span>
                    <span className="flex items-center justify-between">
                      Duration <span className="font-semibold text-navy dark:text-slate-100">{course.duration}</span>
                    </span>
                    <span className="flex items-center justify-between">
                      Lessons <span className="font-semibold text-navy dark:text-slate-100">{course.lessonCount}</span>
                    </span>
                    <span className="flex items-center justify-between">
                      Modules <span className="font-semibold text-navy dark:text-slate-100">{course.modules.length}</span>
                    </span>
                  </div>
                  {comingSoon && (
                    <p className="font-bangla mt-5 rounded-2xl bg-gold/10 px-4 py-3 text-xs leading-relaxed text-[#8a681f] dark:text-gold">
                      এই কোর্স এখনো প্রকাশিত হয়নি। এনরোলমেন্ট চালু হলে এখানেই দেখা যাবে
                      — আপাতত কোনো অগ্রিম পেমেন্ট নেওয়া হয় না।
                    </p>
                  )}
                </div>
              </Reveal>
            </aside>
          </div>

          {/* related courses */}
          {related.length > 0 && (
            <section className="mt-20 border-t border-hairline pt-12 dark:border-white/10">
              <div className="flex items-end justify-between">
                <h2 className="font-serif text-3xl text-navy dark:text-slate-50">Related courses</h2>
                <Link
                  to="/courses"
                  className="link-underline group hidden items-center gap-1 text-sm font-semibold text-navy sm:inline-flex dark:text-slate-100"
                >
                  All courses <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/courses/${c.slug}`}
                    className="group flex items-start gap-4 rounded-3xl border border-hairline bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
                  >
                    <div className="w-20 shrink-0 overflow-hidden rounded-xl">
                      <CourseCover course={c} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.16em] text-teal uppercase dark:text-teal-bright">
                        {c.category} · {c.level}
                      </p>
                      <p className="mt-1.5 font-serif text-lg leading-snug font-semibold text-navy transition-colors group-hover:text-teal dark:text-slate-100 dark:group-hover:text-teal-bright">
                        {c.titleBn}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft dark:text-slate-400">
                        {c.isFree ? "Free" : `৳${c.price}`} · {c.duration}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
