import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { collections, getResource } from "@/data/catalog";
import type { CoverStyle } from "@/data/catalog";

const TONES: Record<CoverStyle["tone"], string> = {
  navy: "from-[#1B2C4A] via-[#152238] to-[#0C1626]",
  teal: "from-[#12817A] via-[#0F766E] to-[#0A4D48]",
  gold: "from-[#EFD9A4] via-[#D6A84B] to-[#B98A2E]",
  ivory: "from-[#F3EFE3] to-[#E7E0CC]",
  graphite: "from-[#2B3850] to-[#131C2C]",
  moss: "from-[#3A4A30] to-[#1C2618]",
};

function CollectionCover({
  collection,
  className,
}: {
  collection: (typeof collections)[number];
  className?: string;
}) {
  const dark = collection.cover.tone === "ivory" || collection.cover.tone === "gold";
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        TONES[collection.cover.tone],
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 dot-grid opacity-[0.2]",
          dark ? "text-navy" : "text-white",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-y-0 right-0 w-1/2 line-grid opacity-[0.12]",
          dark ? "text-navy" : "text-white",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "absolute -right-2 -bottom-6 font-serif text-[9rem] leading-none select-none",
          dark ? "text-navy/15" : "text-white/10",
        )}
      >
        {collection.cover.glyph}
      </span>
      <div className="relative flex h-full flex-col justify-between p-6">
        <span
          className={cn(
            "text-[10px] font-bold tracking-[0.2em] uppercase",
            dark ? "text-navy/70" : "text-white/80",
          )}
        >
          Collection {collection.index}
        </span>
        <div>
          <p
            className={cn(
              "font-serif text-3xl leading-none",
              dark ? "text-navy" : "text-white",
            )}
          >
            {collection.index}
          </p>
          <span className={cn("mt-3 block h-px w-10", "bg-gold", dark ? "opacity-80" : "opacity-90")} />
          <p
            className={cn(
              "font-bangla mt-4 text-lg leading-snug font-semibold",
              dark ? "text-navy" : "text-white",
            )}
          >
            {collection.titleBn}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Collections() {
  return (
    <section className="relative overflow-hidden bg-ivory py-20 sm:py-28 dark:bg-navy-deep">
      <span
        aria-hidden
        className="section-num pointer-events-none absolute top-10 right-6 text-navy dark:text-white lg:right-10"
      >
        03
      </span>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Curated Collections"
          title="Knowledge collections, edited by hand"
          titleBn="হাতে গোনা, সাজানো নলেজ কালেকশন"
          description="Not just categories — five edited collections that take you from a blank page to a finished application."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, i) => {
            const items = collection.resourceSlugs
              .map(getResource)
              .filter(Boolean);
            const span =
              i === 0
                ? "lg:col-span-2 md:flex-row"
                : i === 2
                  ? "lg:col-span-2 md:flex-row-reverse"
                  : "";
            return (
              <Reveal
                key={collection.slug}
                delay={0.06 * i}
                className={cn(
                  i === 1 || i === 3 ? "lg:translate-y-6" : "",
                  i === 0 || i === 2 ? "lg:col-span-2" : "",
                )}
              >
                <div
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_56px_-28px_rgba(15,34,56,0.3)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40",
                    span,
                  )}
                >
                  <CollectionCover
                    collection={collection}
                    className={cn("aspect-[16/9] md:aspect-auto", i === 0 || i === 2 ? "md:w-2/5" : "h-40 md:h-auto md:min-h-48")}
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-serif text-sm text-gold">Collection {collection.index}</p>
                    <h3 className="mt-2 font-serif text-2xl leading-snug text-navy dark:text-slate-100">
                      {collection.title}
                    </h3>
                    <p className="font-bangla mt-1 text-sm text-ink-soft dark:text-slate-400">
                      {collection.titleBn}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                      {collection.description}
                    </p>
                    <ul className="mt-4 flex flex-col gap-1.5">
                      {items.slice(0, 4).map((r) =>
                        r ? (
                          <li key={r.slug} className="flex items-center gap-2 text-[13px] text-ink-soft dark:text-slate-400">
                            <span className="h-1 w-1 rounded-full bg-teal" />
                            {r.title}
                          </li>
                        ) : null,
                      )}
                    </ul>
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft dark:text-slate-400">
                        <Layers className="size-3.5 text-teal" />
                        {items.length} resources
                      </span>
                      <Link
                        to="/resources"
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal dark:text-teal-bright"
                      >
                        Browse
                        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <Link
              to="/resources"
              className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-6 py-3 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
            >
              Open the Resource Library
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
