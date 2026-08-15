import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, CalendarDays, Globe2, Landmark, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { scholarships } from "@/data/catalog";

const FILTERS = [
  "Masters",
  "PhD",
  "Fully Funded",
  "Europe",
  "Asia",
  "USA",
  "Australia",
] as const;

type Filter = (typeof FILTERS)[number];

function matches(s: (typeof scholarships)[number], filter: Filter) {
  switch (filter) {
    case "Masters":
      return s.degree === "Masters" || s.degree === "Both";
    case "PhD":
      return s.degree === "PhD" || s.degree === "Both";
    case "Fully Funded":
      return s.fullyFunded;
    default:
      return s.region === filter;
  }
}

export function ScholarshipDiscovery() {
  const [active, setActive] = useState<Filter[]>([]);

  const results = useMemo(() => {
    if (active.length === 0) return scholarships;
    return scholarships.filter((s) => active.every((f) => matches(s, f)));
  }, [active]);

  const toggle = (f: Filter) =>
    setActive((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );

  return (
    <section className="relative overflow-hidden bg-cool py-20 sm:py-28 dark:bg-navy-surface/40">
      <span
        aria-hidden
        className="section-num pointer-events-none absolute top-10 right-6 text-navy dark:text-white lg:right-10"
      >
        02
      </span>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Scholarship Discovery"
            title="Find Your Next Opportunity"
            titleBn="আপনার পরবর্তী সুযোগ খুঁজে নিন"
            description="Fully funded programs open to Bangladeshi students — filtered by degree and region, mapped with real deadlines."
          />
        </div>

        {/* Filters */}
        <Reveal delay={0.1}>
          <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => {
              const on = active.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggle(f)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-300",
                    on
                      ? "border-navy bg-navy text-white shadow-md dark:border-teal dark:bg-teal dark:text-navy-deep"
                      : "border-hairline bg-white text-ink-soft hover:border-slate-300 hover:text-navy dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-teal/40 dark:hover:text-white",
                  )}
                >
                  {f}
                </button>
              );
            })}
            {active.length > 0 && (
              <button
                type="button"
                onClick={() => setActive([])}
                className="shrink-0 rounded-full px-3 py-2 text-[13px] font-semibold text-teal underline-offset-4 hover:underline dark:text-teal-bright"
              >
                Clear all
              </button>
            )}
          </div>
        </Reveal>

        {/* Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((s, i) => (
            <Reveal key={s.slug} delay={0.05 * i}>
              <div className="group flex h-full flex-col rounded-3xl border border-hairline bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,34,56,0.25)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cool px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-ink-soft uppercase dark:bg-white/10 dark:text-slate-300">
                    <Globe2 className="size-3 text-teal" />
                    {s.country}
                  </span>
                  {s.fullyFunded && (
                    <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-[#8a681f] uppercase dark:text-gold">
                      Fully Funded
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-serif text-lg leading-snug font-semibold text-navy dark:text-slate-100">
                  {s.name}
                </h3>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-ink-soft dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Landmark className="size-3.5 text-teal" />
                    {s.degree}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Wallet className="size-3.5 text-gold" />
                    {s.funding}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-sky-600 dark:text-sky-300" />
                    {s.deadline}
                  </span>
                </div>

                <Link
                  to="/resources/fully-funded-scholarships-map-2026"
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-teal transition-colors group-hover:text-navy dark:text-teal-bright dark:group-hover:text-white"
                >
                  Explore guide
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-sm text-ink-soft dark:text-slate-400">
            Deadlines move — check each official program page before applying.{" "}
            <Link
              to="/resources/fully-funded-scholarships-map-2026"
              className="link-underline font-semibold text-navy dark:text-slate-100"
            >
              Get the full 2026 map
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
