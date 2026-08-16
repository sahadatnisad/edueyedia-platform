import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ArticleCard } from "@/components/ArticleCard";
import { useAllContent } from "@/hooks/use-content";
import { articles as legacyArticles } from "@/data/catalog";
import { extraArticles as legacyExtraArticles } from "@/data/extraArticles";

/** Blog = broader education & opportunity content (research lives in /research).
 *  Legacy fallback while the first Convex payload loads. */
const legacyBlogArticles = [
  ...legacyArticles.filter((a) => a.category !== "research"),
  ...legacyExtraArticles.filter((a) => a.category !== "research"),
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "scholarships", label: "Scholarships" },
  { id: "study-abroad", label: "Study Abroad" },
  { id: "career", label: "Career" },
  { id: "academic-writing", label: "Academic Writing" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function Blog() {
  const [filter, setFilter] = useState<FilterId>("all");

  // Database-backed blog posts (published only), with legacy fallback.
  const content = useAllContent();
  const blogArticles = content?.blog ?? legacyBlogArticles;

  const featured = blogArticles.find((a) => a.featured) ?? blogArticles[0];

  const results = useMemo(() => {
    if (filter === "all") {
      return blogArticles.filter((a) => a.slug !== featured?.slug);
    }
    return blogArticles.filter((a) => a.category === filter);
  }, [filter, featured?.slug, blogArticles]);

  const featuredInFilter = filter !== "all" && featured.category === filter;

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <Navbar />
      <main className="pt-32 pb-24 sm:pt-36">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-[-8%] h-80 w-80 rounded-full bg-gold/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-gold" />
                <p className="text-xs font-bold tracking-[0.24em] text-teal uppercase dark:text-teal-bright">
                  Edueyedia Blog
                </p>
              </div>
              <h1 className="font-serif mt-5 max-w-3xl text-4xl leading-[1.1] text-navy text-balance sm:text-6xl dark:text-slate-50">
                Ideas, Guides & Opportunities
              </h1>
              <p className="font-bangla mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft dark:text-slate-300">
                শিক্ষা, স্কলারশিপ, উচ্চশিক্ষা ও ক্যারিয়ার নিয়ে নির্বাচিত লেখা — scholarship
                strategy, study-abroad planning, academic writing and practical guides.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                Research methodology and paper analysis live on the{" "}
                <Link
                  to="/research"
                  className="link-underline font-semibold text-navy dark:text-slate-100"
                >
                  Research hub
                </Link>{" "}
                — this journal covers everything else: opportunities, applications and
                student life.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pt-12">
          {/* categories */}
          <Reveal>
            <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:px-0">
              {FILTERS.map((f) => {
                const count =
                  f.id === "all"
                    ? blogArticles.length
                    : blogArticles.filter((a) => a.category === f.id).length;
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

          {/* featured */}
          {filter === "all" && featured && (
            <div className="mt-10">
              <Reveal>
                <ArticleCard article={featured} large className="mx-auto max-w-3xl" />
              </Reveal>
            </div>
          )}

          {/* grid */}
          {results.length > 0 ? (
            <div
              className={cn(
                "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
                filter === "all" ? "mt-8" : "mt-10",
              )}
            >
              {(featuredInFilter ? [featured, ...results] : results).map((a, i) => (
                <Reveal key={a.slug} delay={Math.min(i * 0.06, 0.3)}>
                  <ArticleCard article={a} className="h-full" />
                </Reveal>
              ))}
            </div>
          ) : (
            /* honest empty state for categories with no posts yet */
            <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-hairline py-20 text-center dark:border-white/15">
              <p className="font-serif text-xl text-navy dark:text-slate-100">
                Coming soon
              </p>
              <p className="font-bangla max-w-md text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                এই ক্যাটাগরিতে নতুন লেখা প্রকাশের কাজ চলছে — আপাতত অন্য ক্যাটাগরি বা
                রিসার্চ হাব দেখে নিন।
              </p>
              <Link
                to="/research"
                className="group mt-2 inline-flex items-center gap-1.5 rounded-full bg-navy px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep"
              >
                Visit the Research hub
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
