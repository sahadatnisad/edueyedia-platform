import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ResourceCard } from "@/components/ResourceCard";
import { getResource } from "@/data/catalog";

const POPULAR_SLUGS = [
  "research-proposal-master-guide",
  "scholarship-application-essentials",
  "sop-writer-bangla",
  "fully-funded-scholarships-map-2026",
];

export function PopularResources() {
  const popular = POPULAR_SLUGS.map(getResource).filter(Boolean);

  return (
    <section className="bg-ivory py-20 sm:py-28 dark:bg-navy-deep">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Featured Publications"
            title="Popular resources"
            titleBn="জনপ্রিয় রিসোর্সসমূহ"
            description="The guides our editors recommend starting with — research, scholarships and academic writing, in one shelf."
          />
          <Reveal delay={0.15}>
            <Link
              to="/resources"
              className="link-underline group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-navy dark:text-slate-100"
            >
              Browse all resources
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* mobile: swipeable; desktop: grid */}
        <div className="mt-12">
          <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
            {popular.map((r, i) =>
              r ? (
                <Reveal
                  key={r.slug}
                  delay={0.07 * i}
                  className="w-[260px] shrink-0 snap-start md:w-auto"
                >
                  <ResourceCard resource={r} />
                </Reveal>
              ) : null,
            )}
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-hairline bg-white p-6 sm:flex-row dark:border-white/10 dark:bg-navy-surface">
            <div>
              <p className="font-serif text-xl text-navy dark:text-slate-100">
                More than a download — a research library.
              </p>
              <p className="font-bangla mt-1 text-sm text-ink-soft dark:text-slate-400">
                গাইড, টেমপ্লেট ও টুলস — গবেষণা থেকে স্কলারশিপ পর্যন্ত সব এক জায়গায়।
              </p>
            </div>
            <Link
              to="/resources"
              className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep"
            >
              Explore the Resource Library
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
