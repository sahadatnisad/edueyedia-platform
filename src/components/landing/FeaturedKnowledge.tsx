import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ArticleArt } from "@/components/ArticleArt";
import { BookCover } from "@/components/BookCover";
import { articles, getResource } from "@/data/catalog";

export function FeaturedKnowledge() {
  const feature = articles.find((a) => a.featured) ?? articles[0];
  const mediumA = getResource("research-proposal-master-guide")!;
  const mediumB = getResource("scholarship-application-essentials")!;
  const smalls = [
    getResource("research-topic-brainstormer")!,
    getResource("scholarship-deadline-tracker")!,
    getResource("academic-writing-phrases-bangla")!,
  ];

  return (
    <section className="relative overflow-hidden bg-ivory py-20 sm:py-28 dark:bg-navy-deep">
      <span
        aria-hidden
        className="section-num pointer-events-none absolute top-10 right-6 text-navy dark:text-white lg:right-10"
      >
        01
      </span>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Explore Knowledge"
            title="Knowledge, curated like a magazine"
            titleBn="জ্ঞান, সাজানো ম্যাগাজিনের মতো"
            description="Articles, research guides, free tools and premium resources — one editorial grid, updated every cycle."
          />
          <Reveal delay={0.15}>
            <Link
              to="/insights"
              className="link-underline group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-navy dark:text-slate-100"
            >
              All insights
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {/* Featured story */}
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <Link
              to={`/insights/${feature.slug}`}
              className="group relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl border border-hairline bg-white dark:border-white/10 dark:bg-navy-surface"
            >
              <div className="absolute inset-0">
                <ArticleArt article={feature} />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/30 to-transparent" />
              </div>
              <div className="relative p-7 sm:p-9">
                <span className="inline-flex rounded-full bg-gold px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-navy uppercase">
                  Featured Story
                </span>
                <h3 className="font-serif mt-4 max-w-xl text-3xl leading-tight text-white text-balance sm:text-4xl">
                  {feature.title}
                </h3>
                <p className="font-bangla mt-2 text-base text-slate-200">{feature.titleBn}</p>
                <p className="mt-4 line-clamp-2 max-w-xl text-sm leading-relaxed text-slate-300">
                  {feature.excerpt}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="size-3.5" /> {feature.author}
                  </span>
                  <span>{feature.date}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" /> {feature.readingTime}
                  </span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  Read the story
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Two medium resource cards */}
          {[mediumA, mediumB].map((r, i) => (
            <Reveal key={r.slug} delay={0.08 * (i + 1)} className="lg:col-span-5">
              <Link
                to={`/resources/${r.slug}`}
                className="group flex h-full gap-5 rounded-3xl border border-hairline bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,34,56,0.25)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
              >
                <div className="w-28 shrink-0 sm:w-32">
                  <BookCover resource={r} compact />
                </div>
                <div className="flex flex-1 flex-col py-1">
                  <span className="text-[10px] font-bold tracking-[0.18em] text-teal uppercase dark:text-teal-bright">
                    {r.tag}
                  </span>
                  <h3 className="font-serif mt-2 text-lg leading-snug font-semibold text-navy transition-colors group-hover:text-teal dark:text-slate-100 dark:group-hover:text-teal-bright">
                    {r.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-soft dark:text-slate-400">
                    {r.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <p className="font-serif text-lg font-semibold text-navy dark:text-slate-100">
                      ৳{r.price}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-teal dark:text-teal-bright">
                      View Resource
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}

          {/* Three small cards */}
          {smalls.map((r, i) => (
            <Reveal key={r.slug} delay={0.1 * (i + 1)} className="lg:col-span-4">
              <Link
                to={`/resources/${r.slug}`}
                className="group flex h-full items-center gap-4 rounded-3xl border border-hairline bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_40px_-20px_rgba(15,34,56,0.22)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
              >
                <div className="w-20 shrink-0">
                  <BookCover resource={r} compact />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[9px] font-bold tracking-[0.16em] text-gold uppercase dark:text-gold">
                    {r.tag}
                  </span>
                  <h3 className="mt-1 line-clamp-2 font-serif text-[15px] leading-snug font-semibold text-navy dark:text-slate-100">
                    {r.titleBn ?? r.title}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal dark:text-teal-bright">
                    Free download
                    <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
