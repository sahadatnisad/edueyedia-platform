import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { BookCover } from "@/components/BookCover";
import { useAllContent } from "@/hooks/use-content";
import { libraryFilters, freeResources as legacyFreeResources } from "@/data/catalog";
import type { Resource } from "@/data/catalog";

/** Free-library filter label derived from the (DB-backed) resource itself. */
function freeLibraryFilterFor(r: Resource): (typeof libraryFilters)[number] {
  if (r.slug.includes("checklist")) return "Checklists";
  if (r.category === "research") return "Research";
  if (r.category === "scholarships") return "Scholarships";
  return "Academic Writing";
}

export function FreeLibrary() {
  const [filter, setFilter] = useState<(typeof libraryFilters)[number] | "All">("All");

  // Database-backed free resources (published only), legacy fallback while
  // the first Convex payload loads.
  const content = useAllContent();
  const freeResources = content?.resources.filter((r) => r.kind === "free") ?? legacyFreeResources;

  const results = useMemo(
    () =>
      filter === "All"
        ? freeResources
        : freeResources.filter((r) => freeLibraryFilterFor(r) === filter),
    [filter, freeResources],
  );

  return (
    <section className="relative overflow-hidden bg-cool py-20 sm:py-28 dark:bg-navy-surface/40">
      <span
        aria-hidden
        className="section-num pointer-events-none absolute top-10 right-6 text-navy dark:text-white lg:right-10"
      >
        04
      </span>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The Edueyedia Library"
            title="Free resources, forever"
            titleBn="নির্বাচিত ফ্রি টেমপ্লেট, চেকলিস্ট ও গাইড"
            description="Templates, checklists and cheat sheets we believe everyone should have — no email wall, no strings."
          />
        </div>

        {/* filters */}
        <Reveal delay={0.08}>
          <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
            {(["All", ...libraryFilters] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-300",
                  filter === f
                    ? "border-teal bg-teal text-white shadow-md dark:text-navy-deep"
                    : "border-hairline bg-white text-ink-soft hover:border-slate-300 hover:text-navy dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-teal/40 dark:hover:text-white",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* shelf */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {results.map((r, i) => (
            <Reveal key={r.slug} delay={0.05 * i}>
              <Link
                to={`/resources/${r.slug}`}
                className="group flex h-full gap-5 rounded-3xl border border-hairline bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_44px_-22px_rgba(15,34,56,0.25)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
              >
                <div className="w-24 shrink-0">
                  <BookCover resource={r} compact />
                </div>
                <div className="flex min-w-0 flex-1 flex-col py-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[#8a681f] uppercase dark:text-gold">
                      {freeLibraryFilterFor(r)}
                    </span>
                    <span className="text-[10px] font-medium text-ink-soft dark:text-slate-400">
                      {r.format.split(" ")[0]}
                    </span>
                  </div>
                  <h3 className="mt-2 line-clamp-1 font-serif text-lg leading-snug font-semibold text-navy transition-colors group-hover:text-teal dark:text-slate-100 dark:group-hover:text-teal-bright">
                    {r.titleBn ?? r.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft dark:text-slate-400">
                    {r.summary}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13px] font-semibold text-teal dark:text-teal-bright">
                    <Download className="size-3.5" />
                    Get free
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {filter !== "All" && results.length === 0 && (
          <p className="mt-8 text-center text-sm text-ink-soft dark:text-slate-400">
            Nothing in this category yet — check back next cycle.
          </p>
        )}
      </div>
    </section>
  );
}
