import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { BookCover } from "@/components/BookCover";
import { finderOptions, getArticle, getResource } from "@/data/catalog";

export function ResourceFinder() {
  const [selected, setSelected] = useState(finderOptions[0].id);
  const option = finderOptions.find((o) => o.id === selected) ?? finderOptions[0];

  return (
    <section className="relative overflow-hidden bg-cool py-20 sm:py-28 dark:bg-navy-surface/40">
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid text-navy opacity-[0.06] dark:text-white" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Left — options */}
          <div className="lg:col-span-2">
            <SectionHeading
              eyebrow="Intelligent Finder"
              title="What are you working on?"
              titleBn="আপনি কী নিয়ে কাজ করছেন?"
              description="Tell us where you are — we'll show you exactly what to read next."
            />
            <div className="mt-8 flex flex-col gap-2">
              {finderOptions.map((opt, i) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelected(opt.id)}
                  className={cn(
                    "group flex items-center gap-4 rounded-2xl border px-5 py-3.5 text-left transition-all duration-300",
                    selected === opt.id
                      ? "border-navy bg-navy text-white shadow-[0_16px_32px_-16px_rgba(21,34,56,0.5)] dark:border-teal dark:bg-teal dark:text-navy-deep"
                      : "border-hairline bg-white text-navy hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-teal/40",
                  )}
                >
                  <span
                    className={cn(
                      "font-serif text-sm",
                      selected === opt.id ? "text-gold dark:text-navy-deep/60" : "text-ink-soft dark:text-slate-400",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-bangla text-[15px] font-semibold">{opt.label}</span>
                  <ArrowRight
                    className={cn(
                      "ml-auto size-4 transition-transform duration-300",
                      selected === opt.id
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — results */}
          <div className="lg:col-span-3">
            <Reveal key={selected} className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold tracking-[0.2em] text-teal uppercase dark:text-teal-bright">
                  Recommended for you
                </p>
                <p className="font-bangla text-xs text-ink-soft dark:text-slate-400">
                  আপনার জন্য সাজানো
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {option.resourceSlugs.map((slug) => {
                  const r = getResource(slug);
                  if (!r) return null;
                  return (
                    <Link
                      key={slug}
                      to={`/resources/${slug}`}
                      className="group flex items-center gap-4 rounded-2xl border border-hairline bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_32px_-20px_rgba(15,34,56,0.25)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
                    >
                      <div className="w-14 shrink-0">
                        <BookCover resource={r} compact />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold tracking-[0.16em] text-teal uppercase dark:text-teal-bright">
                          {r.tag} · {r.kind === "free" ? "Free" : `৳${r.price}`}
                        </p>
                        <p className="mt-1 line-clamp-1 font-serif text-[15px] font-semibold text-navy dark:text-slate-100">
                          {r.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft dark:text-slate-400">
                          {r.summary}
                        </p>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-teal transition-transform duration-300 group-hover:translate-x-1 dark:text-teal-bright" />
                    </Link>
                  );
                })}
              </div>

              {option.articleSlugs.length > 0 && (
                <div className="mt-1 rounded-2xl border border-hairline bg-ivory/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-navy uppercase dark:text-slate-200">
                    <FileText className="size-3.5 text-gold" />
                    Start with a guide
                  </p>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {option.articleSlugs.map((slug) => {
                      const a = getArticle(slug);
                      if (!a) return null;
                      return (
                        <Link
                          key={slug}
                          to={`/learn/${slug}`}
                          className="group flex items-baseline justify-between gap-4 text-sm"
                        >
                          <span className="font-medium text-navy transition-colors group-hover:text-teal dark:text-slate-200 dark:group-hover:text-teal-bright">
                            {a.title}
                          </span>
                          <span className="flex shrink-0 items-center gap-1 text-xs text-ink-soft dark:text-slate-400">
                            {a.readingTime}
                            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
