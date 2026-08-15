import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ResourceCard } from "@/components/ResourceCard";
import { resources } from "@/data/catalog";
import { FileText, Layers } from "lucide-react";

const TABS = [
  { id: "all", label: "All" },
  { id: "research", label: "Research" },
  { id: "scholarships", label: "Scholarships" },
  { id: "academic-writing", label: "Academic Writing" },
  { id: "study-abroad", label: "Study Abroad" },
  { id: "career", label: "Career" },
  { id: "bundles", label: "Bundles" },
  { id: "free", label: "Free" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Resources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("tab");
  const tab: TabId = TABS.some((t) => t.id === raw)
    ? (raw as TabId)
    : "all";

  const results = useMemo(() => {
    if (tab === "all") return resources;
    if (tab === "free") return resources.filter((r) => r.kind === "free");
    return resources.filter(
      (r) => r.category === tab && r.kind === "paid",
    );
  }, [tab]);

  const setTab = (id: TabId) => {
    setSearchParams(id === "all" ? {} : { tab: id }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <Navbar />
      <main className="pt-32 pb-24 sm:pt-36">
        {/* Header */}
        <section className="relative overflow-hidden bg-ivory dark:bg-navy-deep">
          <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white" />
          <div aria-hidden className="pointer-events-none absolute -top-24 right-[-8%] h-80 w-80 rounded-full bg-teal/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-gold" />
                <p className="text-xs font-bold tracking-[0.24em] text-teal uppercase dark:text-teal-bright">
                  Resource Library
                </p>
              </div>
              <h1 className="font-serif mt-5 max-w-2xl text-4xl leading-[1.1] text-navy text-balance sm:text-6xl dark:text-slate-50">
                A library built for research minds.
              </h1>
              <p className="font-bangla mt-4 max-w-xl text-lg leading-relaxed text-ink-soft dark:text-slate-300">
                গাইড, টেমপ্লেট, চেকলিস্ট ও ম্যাপ — গবেষণা থেকে স্কলারশিপ পর্যন্ত সবকিছু এক জায়গায়।
              </p>
            </Reveal>
          </div>
        </section>

        {/* Tabs + grid */}
        <section className="relative mx-auto max-w-6xl px-6 pt-12">
          <Reveal>
            <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-all duration-300",
                    tab === t.id
                      ? "border-navy bg-navy text-white shadow-md dark:border-teal dark:bg-teal dark:text-navy-deep"
                      : "border-hairline bg-white text-ink-soft hover:border-slate-300 hover:text-navy dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-teal/40 dark:hover:text-white",
                  )}
                >
                  {t.label}
                  {t.id !== "all" && (
                    <span className="ml-1.5 opacity-60">
                      {t.id === "free"
                        ? resources.filter((r) => r.kind === "free").length
                        : resources.filter((r) => r.category === t.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 flex items-center justify-between border-b border-hairline pb-4 dark:border-white/10">
            <p className="text-sm text-ink-soft dark:text-slate-400">
              Showing <span className="font-semibold text-navy dark:text-slate-100">{results.length}</span> resources
            </p>
            <p className="hidden items-center gap-1.5 text-xs text-ink-soft sm:flex dark:text-slate-400">
              <Layers className="size-3.5 text-teal" />
              Instant digital delivery after purchase
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r, i) => (
              <Reveal key={r.slug} delay={Math.min(i * 0.05, 0.3)}>
                <ResourceCard resource={r} />
              </Reveal>
            ))}
          </div>

          {results.length === 0 && (
            <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-hairline py-20 text-center dark:border-white/15">
              <FileText className="size-8 text-ink-soft/50" />
              <p className="font-serif text-xl text-navy dark:text-slate-100">
                Nothing here yet
              </p>
              <p className="text-sm text-ink-soft dark:text-slate-400">
                New resources are published every cycle — check back soon.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
