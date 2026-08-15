import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ArticleCard } from "@/components/ArticleCard";
import { articles } from "@/data/catalog";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "research", label: "Research" },
  { id: "scholarships", label: "Scholarships" },
  { id: "academic-writing", label: "Academic Writing" },
  { id: "study-abroad", label: "Study Abroad" },
  { id: "career", label: "Career" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function Insights() {
  const [filter, setFilter] = useState<FilterId>("all");

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = useMemo(() => {
    const list =
      filter === "all"
        ? articles.filter((a) => a.slug !== featured.slug)
        : articles.filter((a) => a.category === filter);
    return list;
  }, [filter, featured.slug]);

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <Navbar />
      <main className="pt-32 pb-24 sm:pt-36">
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white" />
          <div aria-hidden className="pointer-events-none absolute -top-24 left-[-8%] h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-gold" />
                <p className="text-xs font-bold tracking-[0.24em] text-teal uppercase dark:text-teal-bright">
                  Edueyedia Insights
                </p>
              </div>
              <h1 className="font-serif mt-5 max-w-2xl text-4xl leading-[1.1] text-navy text-balance sm:text-6xl dark:text-slate-50">
                Ideas, Guides & Research Insights
              </h1>
              <p className="font-bangla mt-4 max-w-xl text-lg leading-relaxed text-ink-soft dark:text-slate-300">
                গবেষণা, শিক্ষা ও সুযোগ নিয়ে নির্বাচিত লেখা — research methods, scholarship strategy and academic writing.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pt-12">
          {/* filters */}
          <Reveal>
            <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:px-0">
              {FILTERS.map((f) => (
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
                </button>
              ))}
            </div>
          </Reveal>

          {/* featured */}
          {filter === "all" && (
            <div className="mt-10">
              <Reveal>
                <ArticleCard article={featured} large className="mx-auto max-w-3xl" />
              </Reveal>
            </div>
          )}

          <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", filter === "all" && "mt-8")}>
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={Math.min(i * 0.06, 0.3)}>
                <ArticleCard article={a} className="h-full" />
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
