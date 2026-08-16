import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Clock, FileText, FlaskConical, Microscope, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ArticleCard } from "@/components/ArticleCard";
import { ResourceCard } from "@/components/ResourceCard";
import { Newsletter } from "@/components/landing/Newsletter";
import { articles, resources, RESEARCH_TOPICS, type ResearchContentType } from "@/data/catalog";
import { extraArticles } from "@/data/extraArticles";

/** All research-centred articles across the catalog. */
const researchArticles = [
  ...articles.filter((a) => a.category === "research"),
  ...extraArticles.filter((a) => a.category === "research"),
];

const TYPE_BY_SLUG: Record<string, ResearchContentType> = {
  "how-to-choose-a-research-topic": "research-guide",
  "research-question-that-matters": "research-guide",
  "literature-review-in-7-days": "literature-review",
  "qualitative-vs-quantitative-research": "methodology",
  "research-gap-explained": "research-discussion",
};

const typeOf = (slug: string): ResearchContentType | undefined =>
  researchArticles.find((a) => a.slug === slug)?.contentType ?? TYPE_BY_SLUG[slug];

const byNewest = (a: { date: string }, b: { date: string }) =>
  Date.parse(b.date) - Date.parse(a.date);

/** Topics that are planned but have no published articles yet — shown honestly. */
const COMING_SOON = [
  {
    id: "paper-review" as ResearchContentType,
    label: "Paper Reviews",
    bn: "পেপার রিভিউ",
    copy: "Careful, critical readings of published studies — real papers, real DOIs, written by editors. No study is reviewed until a real source is verified.",
  },
  {
    id: "data-analysis" as ResearchContentType,
    label: "Data & Analysis",
    bn: "ডেটা ও বিশ্লেষণ",
    copy: "Regression, thematic analysis, and when to use which — practical explainers for the analysis chapter.",
  },
  {
    id: "research-ethics" as ResearchContentType,
    label: "Research Ethics",
    bn: "রিসার্চ এথিক্স",
    copy: "Informed consent, data protection and ethics-approval guidance for Bangladeshi institutions.",
  },
  {
    id: "publication" as ResearchContentType,
    label: "Publication",
    bn: "প্রকাশনা",
    copy: "Journal selection, manuscript preparation and navigating peer review — without the predatory journals.",
  },
  {
    id: "research-tools" as ResearchContentType,
    label: "Research Tools",
    bn: "রিসার্চ টুলস",
    copy: "Zotero, Mendeley, reference managers and analysis software — honest comparisons, not endorsements.",
  },
];

const researchResources = resources.filter((r) => r.category === "research");

export default function Research() {
  const [topic, setTopic] = useState<ResearchContentType | "all">("all");

  const featured = useMemo(
    () => [...researchArticles].sort(byNewest)[0],
    [],
  );
  const side = useMemo(
    () =>
      [...researchArticles]
        .sort(byNewest)
        .filter((a) => a.slug !== featured.slug)
        .slice(0, 3),
    [featured.slug],
  );

  const visible = useMemo(() => {
    const list = [...researchArticles].sort(byNewest);
    if (topic === "all") return list;
    return list.filter((a) => typeOf(a.slug) === topic);
  }, [topic]);

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <Navbar />
      <main className="pt-32 pb-24 sm:pt-36">
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white" />
          <div aria-hidden className="pointer-events-none absolute -top-32 right-[-8%] h-[30rem] w-[30rem] rounded-full bg-teal/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute top-1/3 left-[-10%] h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-gold" />
                  <p className="text-xs font-bold tracking-[0.24em] text-teal uppercase dark:text-teal-bright">
                    Edueyedia Research
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="font-bangla mt-6 text-[38px] leading-[1.2] font-bold text-navy text-balance sm:text-5xl lg:text-[58px] dark:text-slate-50">
                  গবেষণাকে বুঝুন, বিশ্লেষণ করুন, আরও ভালোভাবে প্রয়োগ করুন
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="font-serif mt-3 text-xl text-teal italic sm:text-2xl dark:text-teal-bright">
                  Research, reviewed and explained.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <p className="font-bangla mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg dark:text-slate-300">
                  গবেষণা পদ্ধতি, গবেষণা প্রবন্ধ, methodology, academic writing, data
                  analysis এবং publication নিয়ে বিশ্লেষণ, আলোচনা ও ব্যবহারিক গাইড।
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#latest-research"
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-navy px-7 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(21,34,56,0.5)] transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep dark:hover:bg-teal-bright"
                  >
                    Explore Research Articles
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                  <Link
                    to="/resources?tab=research"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-hairline bg-white px-7 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:border-teal/40"
                  >
                    <FileText className="size-4 text-teal" />
                    Research Resources
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.38}>
                <p className="mt-8 max-w-xl text-xs leading-relaxed text-ink-soft dark:text-slate-400">
                  Editorial policy: sources are cited when used, papers are reviewed only
                  from verified records, and nothing is invented to fill a page.
                </p>
              </Reveal>
            </div>

            {/* Abstract academic composition */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto aspect-[4/4.6] w-full max-w-[420px]">
                <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid text-navy opacity-[0.08] dark:text-white" />
                {/* journal card */}
                <Reveal delay={0.15} y={20}>
                  <div className="absolute top-[4%] left-[2%] w-[64%] -rotate-[2deg]">
                    <div className="rounded-2xl bg-navy p-6 text-white shadow-[0_40px_80px_-30px_rgba(21,34,56,0.55)] ring-1 ring-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-gold uppercase">
                          Journal Review
                        </span>
                        <BookOpen className="size-3.5 text-slate-400" />
                      </div>
                      <p className="font-serif mt-4 text-sm leading-snug">
                        How to read a study critically — methods, sample, limits
                      </p>
                      <div className="mt-4 flex flex-col gap-1.5">
                        {[100, 78, 90, 60].map((w, i) => (
                          <span key={i} className="block h-1.5 rounded-full bg-white/25" style={{ width: `${w}%` }} />
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[9px] text-slate-400">
                        <span>Vol. 01 · 2026</span>
                        <span>Peer-reviewed</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
                {/* methodology card */}
                <Reveal delay={0.3} y={20}>
                  <div className="absolute top-[10%] right-[0%] w-[46%] rotate-[2deg]">
                    <div className="rounded-2xl bg-teal p-5 text-white shadow-[0_24px_48px_-20px_rgba(15,118,110,0.5)]">
                      <Microscope className="size-4 text-teal-100" />
                      <p className="mt-3 text-[13px] leading-snug font-semibold">
                        Qualitative vs Quantitative
                      </p>
                      <div className="mt-3 flex items-end gap-1.5">
                        {[46, 70, 54, 84, 62].map((h, i) => (
                          <span key={i} className="w-2 rounded-t-sm bg-white/80" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-teal-50/90">Methodology explainer</p>
                    </div>
                  </div>
                </Reveal>
                {/* citation card */}
                <Reveal delay={0.45} y={20}>
                  <div className="absolute top-[48%] right-[2%] w-[48%] rotate-[1deg]">
                    <div className="rounded-2xl border border-hairline bg-white p-4 shadow-[0_24px_48px_-20px_rgba(214,168,75,0.35)] dark:border-white/10 dark:bg-navy-surface">
                      <p className="text-[9px] font-bold tracking-[0.16em] text-gold uppercase">
                        Citation
                      </p>
                      <p className="font-bangla mt-2 text-xs leading-relaxed text-navy dark:text-slate-100">
                        “সূত্র ছাড়া দাবি নয়, দাবির পাশে সূত্র।”
                      </p>
                      <p className="mt-2 border-t border-hairline pt-2 text-[10px] text-ink-soft dark:border-white/10 dark:text-slate-400">
                        DOI · Accessed date · Verified source
                      </p>
                    </div>
                  </div>
                </Reveal>
                {/* note card */}
                <Reveal delay={0.55} y={20}>
                  <div className="absolute bottom-[4%] left-[4%] w-[58%] -rotate-[1deg]">
                    <div className="rounded-2xl border border-hairline bg-white p-4 shadow-[0_24px_48px_-24px_rgba(15,34,56,0.3)] dark:border-white/10 dark:bg-navy-surface">
                      <Quote className="size-4 text-gold" />
                      <p className="font-bangla mt-2 text-[13px] leading-relaxed text-navy dark:text-slate-100">
                        রিসার্চ গ্যাপ, মেথডোলজি, পেপার রিভিউ — প্রতিটি লেখা প্রমাণের
                        ভিত্তিতে।
                      </p>
                      <p className="mt-2 text-[9px] font-bold tracking-[0.18em] text-teal uppercase dark:text-teal-bright">
                        Edueyedia Research Desk
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------- Research topics ------------------------ */}
        <section className="mx-auto max-w-6xl px-6 pt-16">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <p className="text-xs font-bold tracking-[0.2em] text-teal uppercase dark:text-teal-bright">
                Research Topics
              </p>
            </div>
            <p className="font-bangla mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft dark:text-slate-300">
              কোন বিষয় নিয়ে পড়তে চান? একটি টপিক বেছে নিন — সংশ্লিষ্ট লেখাগুলো নিচে
              দেখানো হবে।
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="no-scrollbar -mx-6 mt-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              <button
                type="button"
                onClick={() => setTopic("all")}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-300",
                  topic === "all"
                    ? "border-navy bg-navy text-white shadow-md dark:border-teal dark:bg-teal dark:text-navy-deep"
                    : "border-hairline bg-white text-ink-soft hover:border-slate-300 hover:text-navy dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-teal/40 dark:hover:text-white",
                )}
              >
                All
              </button>
              {RESEARCH_TOPICS.map((t) => {
                const count = researchArticles.filter((a) => typeOf(a.slug) === t.id).length;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTopic(t.id)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-300",
                      topic === t.id
                        ? "border-teal bg-teal text-white shadow-md dark:text-navy-deep"
                        : "border-hairline bg-white text-ink-soft hover:border-slate-300 hover:text-navy dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-teal/40 dark:hover:text-white",
                    )}
                  >
                    {t.label}
                    <span className="ml-1.5 opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </section>

        {/* --------------------------- Featured research ---------------------- */}
        <section className="mx-auto max-w-6xl px-6 pt-16">
          <Reveal>
            <div className="flex items-end justify-between">
              <SectionHeading
                eyebrow="Featured Research"
                title="From the research desk"
                titleBn="রিসার্চ ডেস্ক থেকে"
                description="Analyses, guides and discussions — written for researchers at every stage."
              />
            </div>
          </Reveal>
          {featured && (
            <div className="mt-10 grid gap-6 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <ArticleCard article={featured} large className="h-full" />
              </Reveal>
              <div className="flex flex-col gap-6 lg:col-span-5">
                {side.map((a, i) => (
                  <Reveal key={a.slug} delay={0.08 * (i + 1)}>
                    <ArticleCard article={a} className="h-full" />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* --------------------------- Latest research ------------------------ */}
        <section id="latest-research" className="mx-auto max-w-6xl scroll-mt-28 px-6 pt-16">
          <Reveal>
            <div className="flex items-end justify-between">
              <SectionHeading
                eyebrow="Latest Research Articles"
                title={topic === "all" ? "The latest from the desk" : RESEARCH_TOPICS.find((t) => t.id === topic)?.label ?? "Articles"}
                titleBn={
                  topic === "all"
                    ? "সাম্প্রতিক গবেষণা লেখা"
                    : RESEARCH_TOPICS.find((t) => t.id === topic)?.bn ?? ""
                }
              />
            </div>
          </Reveal>

          {visible.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((a, i) => (
                <Reveal key={a.slug} delay={Math.min(i * 0.05, 0.3)}>
                  <ArticleCard article={a} className="h-full" />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-hairline py-16 text-center dark:border-white/15">
              <FlaskConical className="size-7 text-ink-soft/50" />
              <p className="font-serif text-xl text-navy dark:text-slate-100">In the works</p>
              <p className="font-bangla max-w-md text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                এই টপিকে লেখা প্রকাশের প্রস্তুতি চলছে। আপাতত সংশ্লিষ্ট গাইড রিসোর্সগুলো
                দেখে নিন।
              </p>
              <Link
                to="/resources?tab=research"
                className="group mt-1 inline-flex items-center gap-1.5 rounded-full bg-navy px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep"
              >
                Browse research resources
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </section>

        {/* --------------------------- Planned topics ------------------------- */}
        <section className="mt-20 bg-cool py-20 sm:py-24 dark:bg-navy-surface/40">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="On the editorial calendar"
              title="Coming next from the desk"
              titleBn="আগামী প্রকাশনার পরিকল্পনা"
              description="These topics are on the editorial calendar. Nothing is published until a real source can be verified — no invented citations, no fake statistics."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {COMING_SOON.map((t, i) => (
                <Reveal key={t.id} delay={0.05 * i}>
                  <div className="flex h-full flex-col rounded-3xl border border-dashed border-hairline bg-white/70 p-6 dark:border-white/15 dark:bg-white/[0.03]">
                    <span className="w-fit rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-[#8a681f] uppercase dark:text-gold">
                      Coming soon
                    </span>
                    <h3 className="font-serif mt-4 text-xl text-navy dark:text-slate-100">
                      {t.label}
                    </h3>
                    <p className="font-bangla mt-0.5 text-[13px] text-teal dark:text-teal-bright">
                      {t.bn}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                      {t.copy}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- Research resources --------------------- */}
        <section className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24">
          <Reveal>
            <div className="flex items-end justify-between">
              <SectionHeading
                eyebrow="Featured Research Resources"
                title="Take it further with our research guides"
                titleBn="গবেষণা গাইড ও টেমপ্লেট"
                description="The downloadable companions to the articles — proposals, methodology, literature reviews and publishing."
              />
              <Reveal delay={0.15}>
                <Link
                  to="/resources?tab=research"
                  className="link-underline group hidden items-center gap-1.5 text-sm font-semibold text-navy sm:inline-flex dark:text-slate-100"
                >
                  All research resources
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {researchResources.slice(0, 6).map((r, i) => (
              <Reveal key={r.slug} delay={Math.min(i * 0.05, 0.3)}>
                <ResourceCard resource={r} className="h-full" />
              </Reveal>
            ))}
          </div>
        </section>

        <Newsletter />

        {/* ------------------------------ CTA ------------------------------ */}
        <section className="relative overflow-hidden bg-navy-deep py-20 sm:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-white opacity-[0.05]" />
          <div aria-hidden className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-teal/15 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                <Microscope className="size-3.5" />
                Understand · Apply · Publish
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-bangla mt-6 text-4xl leading-[1.15] font-bold text-white text-balance sm:text-5xl">
                গবেষণা বিষয়ক লেখার পাশাপাশি সুযোগের গাইডও পড়ুন
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                Scholarships, study abroad and academic writing — the broader journal
                lives on the Blog.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/blog"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-navy shadow-[0_14px_30px_-12px_rgba(214,168,75,0.6)] transition-all hover:-translate-y-0.5 hover:bg-gold/90"
                >
                  Read the Blog
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-7 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-teal/60 hover:text-teal-bright"
                >
                  <Clock className="size-4 text-gold" />
                  Explore Courses
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
