import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Clock, GraduationCap, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CourseCover } from "@/components/CourseCover";
import { PageMeta } from "@/components/seo";
import { useAllContent } from "@/hooks/use-content";
import type { Course } from "@/data/courses";

const FILTERS: { id: string; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Free", label: "Free" },
  { id: "Paid", label: "Paid" },
  { id: "Research", label: "Research" },
  { id: "Academic Writing", label: "Academic Writing" },
  { id: "Scholarships", label: "Scholarships" },
  { id: "Study Abroad", label: "Study Abroad" },
];

export default function Courses() {
  const [filter, setFilter] = useState("All");

  // Database-backed courses (published + coming-soon), with legacy fallback.
  const content = useAllContent();
  const courses = content?.courses ?? [];

  const results = useMemo(() => {
    let list = [...courses];
    if (filter === "Free") list = list.filter((c) => c.isFree);
    if (filter === "Paid") list = list.filter((c) => !c.isFree);
    if (filter !== "All" && filter !== "Free" && filter !== "Paid") {
      list = list.filter((c) => c.category === filter);
    }
    return list;
  }, [filter, courses]);

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title="Courses — Edueyedia"
        description="গবেষণা, একাডেমিক দক্ষতা, স্কলারশিপ প্রস্তুতি এবং উচ্চশিক্ষার জন্য structured Bangla courses — ধাপে ধাপে, মডিউলে মডিউলে। Learn deeply. Apply confidently."
        path="/courses"
      />
      <Navbar />
      <main className="pt-32 pb-24 sm:pt-36">
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-[-8%] h-96 w-96 rounded-full bg-teal/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-[-8%] h-80 w-80 rounded-full bg-gold/15 blur-3xl"
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-gold" />
                  <p className="text-xs font-bold tracking-[0.24em] text-teal uppercase dark:text-teal-bright">
                    Edueyedia Courses
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="font-bangla mt-6 text-[38px] leading-[1.18] font-bold text-navy text-balance sm:text-5xl lg:text-[56px] dark:text-slate-50">
                  জ্ঞানকে দক্ষতায় রূপান্তর করুন
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="font-serif mt-3 text-xl text-teal italic sm:text-2xl dark:text-teal-bright">
                  Learn deeply. Apply confidently.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <p className="font-bangla mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg dark:text-slate-300">
                  গবেষণা, একাডেমিক দক্ষতা, স্কলারশিপ প্রস্তুতি এবং উচ্চশিক্ষার জন্য
                  structured Bangla courses — ধাপে ধাপে, মডিউলে মডিউলে।
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#course-list"
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-navy px-7 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(21,34,56,0.5)] transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep dark:hover:bg-teal-bright"
                  >
                    Browse Courses
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#course-list"
                    onClick={(e) => {
                      e.preventDefault();
                      setFilter("Free");
                      document.getElementById("course-list")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-hairline bg-white px-7 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:border-teal/40"
                  >
                    <Sparkles className="size-4 text-gold" />
                    Explore Free Courses
                  </a>
                </div>
              </Reveal>
            </div>

            {/* abstract curriculum composition */}
            <div className="relative hidden lg:col-span-5 lg:block">
              <div className="relative mx-auto aspect-[4/4.6] w-full max-w-[400px]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 dot-grid text-navy opacity-[0.08] dark:text-white"
                />
                <Reveal delay={0.15} y={20}>
                  <div className="absolute top-[2%] left-[2%] w-[62%] -rotate-[2deg]">
                    <div className="rounded-2xl bg-navy p-6 text-white shadow-[0_40px_80px_-30px_rgba(21,34,56,0.55)] ring-1 ring-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-gold uppercase">
                          Module 1 · Research
                        </span>
                        <Layers className="size-3.5 text-slate-400" />
                      </div>
                      <p className="font-serif mt-4 text-sm leading-snug">
                        Research questions & objectives
                      </p>
                      <div className="mt-4 flex flex-col gap-1.5">
                        {[100, 70, 55, 85].map((w, i) => (
                          <span
                            key={i}
                            className="block h-1.5 rounded-full bg-white/25"
                            style={{ width: `${w}%` }}
                          />
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[9px] text-slate-400">
                        <span>Lessons 1–3</span>
                        <span className="text-teal-bright">✓ 2 of 3</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.3} y={20}>
                  <div className="absolute top-[12%] right-[0%] w-[44%] rotate-[2deg]">
                    <div className="rounded-2xl bg-teal p-5 text-white shadow-[0_24px_48px_-20px_rgba(15,118,110,0.5)]">
                      <GraduationCap className="size-4 text-teal-100" />
                      <p className="mt-3 text-[13px] leading-snug font-semibold">Lesson 4</p>
                      <p className="mt-1 text-[10px] text-teal-50/90">Choosing a design</p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/25">
                        <span className="block h-full w-2/3 rounded-full bg-white/90" />
                      </div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.45} y={20}>
                  <div className="absolute top-[46%] right-[2%] w-[48%] rotate-[1deg]">
                    <div className="rounded-2xl border border-hairline bg-white p-4 shadow-[0_24px_48px_-20px_rgba(214,168,75,0.35)] dark:border-white/10 dark:bg-navy-surface">
                      <p className="text-[9px] font-bold tracking-[0.16em] text-gold uppercase">
                        Progress
                      </p>
                      <p className="font-bangla mt-2 text-xs leading-relaxed text-navy dark:text-slate-100">
                        “প্রতি মডিউলে একটি ছোট অ্যাসাইনমেন্ট — শেখা যাচাই হয়, মুখস্থ নয়।”
                      </p>
                      <p className="mt-2 border-t border-hairline pt-2 text-[10px] text-ink-soft dark:border-white/10 dark:text-slate-400">
                        Notes · Templates · Quizzes
                      </p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.55} y={20}>
                  <div className="absolute bottom-[4%] left-[4%] w-[58%] -rotate-[1deg]">
                    <div className="rounded-2xl border border-hairline bg-white p-4 shadow-[0_24px_48px_-24px_rgba(15,34,56,0.3)] dark:border-white/10 dark:bg-navy-surface">
                      <Clock className="size-4 text-gold" />
                      <p className="font-bangla mt-2 text-[13px] leading-relaxed text-navy dark:text-slate-100">
                        নিজের গতিতে শিখুন — প্রতিটি কোর্সের শেষে একটি সার্টিফিকেটের
                        ভিত্তি তৈরি হয় প্রগতিতে।
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------- filters ------------------------------ */}
        <section id="course-list" className="mx-auto max-w-6xl scroll-mt-28 px-6 pt-16">
          <Reveal>
            <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {FILTERS.map((f) => {
                const count =
                  f.id === "All"
                    ? courses.length
                    : f.id === "Free"
                      ? courses.filter((c) => c.isFree).length
                      : f.id === "Paid"
                        ? courses.filter((c) => !c.isFree).length
                        : courses.filter((c) => c.category === f.id).length;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "shrink-0 rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-all duration-300",
                      filter === f.id
                        ? "border-navy bg-navy text-white shadow-md dark:border-teal dark:bg-teal dark:text-navy-deep"
                        : "border-hairline bg-white text-ink-soft hover:border-slate-300 hover:text-navy dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-teal/40 dark:hover:text-white",
                    )}
                  >
                    {f.label}
                    <span className="ml-1.5 opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </section>

        {/* --------------------------- course grid -------------------------- */}
        <section className="mx-auto max-w-6xl px-6 pt-12">
          {results.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((course, i) => (
                <Reveal key={course.slug} delay={Math.min(i * 0.05, 0.3)}>
                  <CourseCard course={course} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-hairline py-20 text-center dark:border-white/15">
              <GraduationCap className="size-7 text-ink-soft/50" />
              <p className="font-serif text-xl text-navy dark:text-slate-100">Coming soon</p>
              <p className="font-bangla max-w-md text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                এই ক্যাটাগরির কোর্স প্রকাশের প্রস্তুতি চলছে — আপাতত অন্য কোর্স বা
                রিসোর্স লাইব্রেরি দেখে নিন।
              </p>
              <Link
                to="/resources"
                className="group mt-1 inline-flex items-center gap-1.5 rounded-full bg-navy px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep"
              >
                Browse resources
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </section>

        {/* --------------------------- how courses work --------------------- */}
        <section className="mt-20 bg-cool py-20 sm:py-24 dark:bg-navy-surface/40">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="How it works"
              title="Structured learning, built for Bangla speakers"
              titleBn="শেখার পথ: মডিউল, পাঠ, অনুশীলন"
              description="Every course follows the same honest structure — no fake enrollments, no fabricated reviews. Courses open as they are completed and verified."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: <Layers className="size-5 text-teal" />,
                  title: "Modules & lessons",
                  bn: "মডিউল ও পাঠ",
                  copy: "Courses are organised into modules of short lessons, each with a clear outcome — not one long video dump.",
                },
                {
                  icon: <GraduationCap className="size-5 text-teal" />,
                  title: "Free & paid",
                  bn: "ফ্রি ও পেইড",
                  copy: "Free courses unlock on sign-in. Paid courses unlock only after a verified payment — never from frontend state.",
                },
                {
                  icon: <Sparkles className="size-5 text-teal" />,
                  title: "Progress saved",
                  bn: "প্রগতি সংরক্ষিত",
                  copy: "Your progress, lessons and downloads live in your account — resume from any device, backed by real completion data.",
                },
              ].map((s, i) => (
                <Reveal key={s.title} delay={0.06 * i}>
                  <div className="flex h-full flex-col rounded-3xl border border-hairline bg-white p-7 dark:border-white/10 dark:bg-navy-surface">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-teal/10">
                      {s.icon}
                    </span>
                    <h3 className="font-serif mt-5 text-xl text-navy dark:text-slate-100">{s.title}</h3>
                    <p className="font-bangla mt-0.5 text-[13px] font-semibold text-teal dark:text-teal-bright">
                      {s.bn}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">{s.copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- CTA ------------------------------ */}
        <section className="relative overflow-hidden bg-navy-deep py-20 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 line-grid text-white opacity-[0.05]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                <GraduationCap className="size-3.5" />
                Learn · Practice · Apply
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-bangla mt-6 text-4xl leading-[1.15] font-bold text-white text-balance sm:text-5xl">
                পড়া শেষ হতেই পারে, কিন্তু শেখা শেষ হয় না
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                যত দিন পর্যন্ত কোর্সগুলো সত্যিই প্রস্তুত না হয়, তত দিন এখানে শুধুই
                পরিকল্পনা — কোনো মিথ্যা এনরোলমেন্ট সংখ্যা নয়।
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/resources"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-navy shadow-[0_14px_30px_-12px_rgba(214,168,75,0.6)] transition-all hover:-translate-y-0.5 hover:bg-gold/90"
                >
                  Explore the Resource Library
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/research"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-7 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-teal/60 hover:text-teal-bright"
                >
                  Visit the Research hub
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,34,56,0.25)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
    >
      <div className="relative p-5 pb-0 sm:p-6 sm:pb-0">
        <CourseCover course={course} />
        {course.status === "coming-soon" && (
          <span className="absolute top-2 right-2 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-navy uppercase shadow">
            Coming Soon
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <p className="text-[10px] font-bold tracking-[0.18em] text-teal uppercase dark:text-teal-bright">
          {course.category} · {course.level}
        </p>
        <h3 className="font-serif text-xl leading-snug text-navy transition-colors group-hover:text-teal dark:text-slate-100 dark:group-hover:text-teal-bright">
          {course.titleBn}
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft dark:text-slate-400">{course.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between border-t border-hairline pt-4 text-xs text-ink-soft dark:border-white/10 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> {course.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-3.5" /> {course.lessonCount} lessons
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-navy dark:text-slate-100">
            {course.isFree ? (
              <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal dark:text-teal-bright">
                Free
              </span>
            ) : (
              <span className="text-sm">
                ৳{course.price}
                {course.compareAt && (
                  <span className="ml-1.5 text-xs text-ink-soft line-through">৳{course.compareAt}</span>
                )}
              </span>
            )}
          </span>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-teal dark:text-teal-bright">
            View Course
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
