import { Link } from "react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  FileText,
  GraduationCap,
  Landmark,
  Library,
  Microscope,
  Quote,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PageMeta } from "@/components/seo";
import { useAllContent } from "@/hooks/use-content";


const PRINCIPLE_STRIP = [
  {
    icon: Microscope,
    title: "Evidence-led",
    bn: "প্রমাণের ভিত্তিতে",
  },
  {
    icon: BookOpen,
    title: "Bangla-first",
    bn: "প্রথমে বাংলা",
  },
  {
    icon: FileText,
    title: "Practical",
    bn: "ব্যবহারযোগ্য",
  },
  {
    icon: BadgeCheck,
    title: "Independent",
    bn: "স্বাধীনভাবে",
  },
];

const PUBLISH = [
  {
    icon: Microscope,
    title: "Research Guides",
    bn: "গবেষণা গাইড",
    copy: "Proposals, methodology, data analysis and publishing — written so a beginner can follow and a researcher can cite.",
    to: "/resources?tab=research",
    cta: "Browse research",
  },
  {
    icon: GraduationCap,
    title: "Scholarship Strategy",
    bn: "স্কলারশিপ গাইড",
    copy: "Funded study roadmaps, application playbooks and deadline-aware checklists for fully funded opportunities.",
    to: "/resources?tab=scholarships",
    cta: "Find scholarships",
  },
  {
    icon: Landmark,
    title: "Study Abroad",
    bn: "বিদেশে উচ্চশিক্ষা",
    copy: "Admissions, tests, budgets and country guides that turn a confusing process into a clear sequence of steps.",
    to: "/resources?tab=study-abroad",
    cta: "Plan your move",
  },
  {
    icon: BookOpen,
    title: "The Edueyedia Blog",
    bn: "এডুইডিয়া ব্লগ",
    copy: "Long-form guides and analysis on research methods, academic writing and scholarship strategy — in Bangla and English.",
    to: "/blog",
    cta: "Read the blog",
  },
];

const PRINCIPLES = [
  {
    index: "01",
    title: "Evidence over opinion",
    bn: "যুক্তির চেয়ে প্রমাণ",
    copy: "Every guide is grounded in research methods, verified sources and real application data — not recycled blog advice.",
  },
  {
    index: "02",
    title: "Bangla-first, always",
    bn: "প্রথমে বাংলা",
    copy: "Complex ideas explained in clear, precise Bangla, with English kept for terms that belong to the academic world.",
  },
  {
    index: "03",
    title: "Practical, not performative",
    bn: "দেখানোর নয়, শেখার",
    copy: "Templates, checklists and step-by-step plans you can use the same day — tested against real applications and theses.",
  },
  {
    index: "04",
    title: "Independent by design",
    bn: "স্বাধীনভাবে নির্মিত",
    copy: "No sponsored rankings, no commission-driven picks. What we recommend earns its place on the page.",
  },
];

const AUDIENCE = [
  {
    icon: Microscope,
    title: "Researchers",
    bn: "গবেষক",
    copy: "From first proposal to published paper — methodology, writing and citation support at every stage.",
  },
  {
    icon: GraduationCap,
    title: "Scholarship Seekers",
    bn: "স্কলারশিপ প্রার্থী",
    copy: "Curated, deadline-aware guidance for fully funded master's and PhD opportunities worldwide.",
  },
  {
    icon: Library,
    title: "University Students",
    bn: "বিশ্ববিদ্যালয় শিক্ষার্থী",
    copy: "Academic writing, thesis planning and study-abroad decisions, simplified into clear, actionable steps.",
  },
  {
    icon: BookOpen,
    title: "Lifelong Learners",
    bn: "আজীবন শিক্ষার্থী",
    copy: "Anyone who believes knowledge should be accessible — in Bangla — without the noise of the internet.",
  },
];

const STORY = [
  {
    year: "2024",
    title: "The problem",
    bn: "সমস্যা",
    copy: "Bangla-speaking learners hit a wall: scholarship lists scattered across Facebook groups, research advice in fragmented English PDFs, and almost nothing in their own language.",
  },
  {
    year: "2025",
    title: "The idea",
    bn: "ধারণা",
    copy: "Edueyedia set out to be a research-focused digital publisher — an academic journal meets a modern knowledge platform, built for the way Bangla-speaking learners actually work.",
  },
  {
    year: "2026",
    title: "The platform",
    bn: "প্ল্যাটফর্ম",
    copy: "A curated library of premium resources, edited collections and long-form guides — written by researchers, reviewed by educators, and published in clear, precise Bangla.",
  },
  {
    year: "Next",
    title: "The promise",
    bn: "প্রতিশ্রুতি",
    copy: "Keep knowledge simple, keep opportunities within reach, and keep every page honest. Research. Learn. Advance.",
  },
];export default function About() {
  // Live published-resource count from Convex.
  const content = useAllContent();
  const totalResources = content?.resources.length ?? 0;

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title="About Edueyedia — Research. Learn. Advance."
        description="এডুইডিয়া — গবেষণা, শিক্ষা ও সুযোগের বিশ্বস্ত ডিজিটাল প্ল্যাটফর্ম। A research-focused digital publishing platform built for Bangla-speaking learners, researchers and scholarship seekers."
        path="/about"
      />
      <Navbar />
      <main>
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative overflow-hidden bg-ivory pb-16 pt-36 sm:pb-20 sm:pt-40 dark:bg-navy-deep">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-8%] h-[34rem] w-[34rem] rounded-full bg-teal/10 blur-3xl dark:bg-teal/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/3 left-[-10%] h-96 w-96 rounded-full bg-gold/15 blur-3xl dark:bg-gold/10"
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-12 lg:gap-10">
            {/* Copy */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-gold" />
                  <p className="text-xs font-bold tracking-[0.24em] text-navy uppercase dark:text-gold">
                    About Edueyedia
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="font-bangla mt-6 text-[40px] leading-[1.15] font-bold text-navy text-balance sm:text-6xl lg:text-[62px] dark:text-slate-50">
                  জ্ঞানকে সহজ করি, সম্ভাবনাকে এগিয়ে নিই
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="font-serif mt-3 text-xl text-teal italic sm:text-2xl dark:text-teal-bright">
                  Research. Learn. Advance.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg dark:text-slate-300">
                  বাংলাভাষী শিক্ষার্থী, গবেষক ও উচ্চশিক্ষা প্রত্যাশীদের জন্য
                  নির্ভরযোগ্য, পরিষ্কার ও ব্যবহারযোগ্য গবেষণা ও শিক্ষাভিত্তিক
                  জ্ঞান সহজলভ্য করা।
                </p>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg dark:text-slate-300">
                  Edueyedia is a research-focused digital publishing platform —
                  guides, templates and long-form analysis, written in Bangla and
                  grounded in evidence.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/resources"
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-navy px-7 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(21,34,56,0.5)] transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep dark:hover:bg-teal-bright"
                  >
                    Explore Resources
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/blog"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-hairline bg-white px-7 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:border-teal/40"
                  >
                    <BookOpen className="size-4 text-teal" />
                    Read the Blog
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.38}>
                <div className="mt-10 flex flex-wrap gap-2">
                  {["গবেষণা, শিক্ষা ও সুযোগের বিশ্বস্ত ডিজিটাল প্ল্যাটফর্ম", "Bangla-first", "Editorially reviewed"].map(
                    (t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white/70 px-3 py-1.5 text-xs font-medium text-navy dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                      >
                        <BadgeCheck className="size-3.5 text-teal" />
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </Reveal>
            </div>

            {/* Abstract editorial composition */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto aspect-[4/4.6] w-full max-w-[420px]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 dot-grid text-navy opacity-[0.08] dark:text-white"
                />
                {/* mission card */}
                <Reveal delay={0.15} y={20}>
                  <div className="absolute top-[4%] left-[4%] w-[68%] rotate-[-2deg]">
                    <div className="rounded-2xl bg-navy p-6 text-white shadow-[0_40px_80px_-30px_rgba(21,34,56,0.55)] ring-1 ring-white/10">
                      <Quote className="size-5 text-gold" />
                      <p className="font-bangla mt-4 text-[15px] leading-relaxed">
                        গবেষণা, শিক্ষা ও সুযোগের বিশ্বস্ত ডিজিটাল প্ল্যাটফর্ম।
                      </p>
                      <p className="mt-4 border-t border-white/10 pt-3 text-[10px] font-bold tracking-[0.18em] text-gold uppercase">
                        Our mission
                      </p>
                    </div>
                  </div>
                </Reveal>
                {/* values chip */}
                <Reveal delay={0.3} y={20}>
                  <div className="absolute top-[10%] right-[0%] w-[44%] rotate-[2deg]">
                    <div className="rounded-2xl border border-gold/30 bg-white p-4 shadow-[0_24px_48px_-20px_rgba(214,168,75,0.35)] dark:bg-navy-surface">
                      <p className="text-[9px] font-bold tracking-[0.16em] text-[#8a681f] uppercase dark:text-gold">
                        Editorial values
                      </p>
                      <ul className="mt-3 flex flex-col gap-2 text-[12px] font-semibold text-navy dark:text-slate-100">
                        <li className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-teal" /> Accuracy
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-teal" /> Clarity
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-teal" /> Independence
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-teal" /> Practicality
                        </li>
                      </ul>
                    </div>
                  </div>
                </Reveal>
                {/* live library count — real number, never fabricated */}
                <Reveal delay={0.45} y={20}>
                  <div className="absolute bottom-[8%] right-[4%] w-[46%] rotate-[1deg]">
                    <div className="rounded-2xl bg-teal p-5 text-white shadow-[0_24px_48px_-20px_rgba(15,118,110,0.5)]">
                      <p className="font-serif text-3xl text-white">
                        {totalResources.toLocaleString()}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-teal-50/90">
                        published resources in the library
                      </p>
                    </div>
                  </div>
                </Reveal>
                {/* index footnote */}
                <Reveal delay={0.55} y={20}>
                  <div className="absolute bottom-[2%] left-[6%] w-[56%] -rotate-[1deg]">
                    <div className="rounded-2xl border border-hairline bg-white p-4 shadow-[0_24px_48px_-24px_rgba(15,34,56,0.3)] dark:border-white/10 dark:bg-navy-surface">
                      <p className="text-[9px] font-bold tracking-[0.18em] text-teal uppercase dark:text-teal-bright">
                        Edueyedia Knowledge Platform
                      </p>
                      <p className="font-serif mt-2 text-sm leading-snug text-navy dark:text-slate-100">
                        Academic journal meets modern technology platform.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------ Principles ------------------------------ */}
        <section className="bg-navy-deep py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {PRINCIPLE_STRIP.map((p, i) => (
                <Reveal key={p.title} delay={0.06 * i}>
                  <div className="flex flex-col gap-1">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-white/10 text-gold">
                      <p.icon className="size-5" />
                    </span>
                    <p className="mt-3 text-sm font-semibold text-white">{p.title}</p>
                    <p className="font-bangla text-xs text-slate-400">{p.bn}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- What we publish --------------------------- */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <span aria-hidden className="section-num pointer-events-none absolute top-10 right-6 text-navy dark:text-white lg:right-10">
            01
          </span>
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="What we publish"
              title="A curated library, edited like a journal"
              titleBn="জার্নালের মতো সাজানো এক কিউরেটেড লাইব্রেরি"
              description="Not another content dump — every resource is researched, written in Bangla, and reviewed before it reaches the shelf."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PUBLISH.map((p, i) => (
                <Reveal key={p.title} delay={0.06 * i}>
                  <Link
                    to={p.to}
                    className="group flex h-full flex-col rounded-3xl border border-hairline bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,34,56,0.25)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
                  >
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-navy text-gold dark:bg-teal dark:text-navy-deep">
                      <p.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-serif text-xl leading-snug text-navy dark:text-slate-100">
                      {p.title}
                    </h3>
                    <p className="font-bangla mt-0.5 text-[13px] text-teal dark:text-teal-bright">
                      {p.bn}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                      {p.copy}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-navy dark:text-slate-100">
                      {p.cta}
                      <ArrowUpRight className="size-3.5 text-teal transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- Principles --------------------------- */}
        <section className="bg-cool py-20 sm:py-28 dark:bg-navy-ink">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
              <SectionHeading
                eyebrow="Editorial standards"
                title="How we keep the platform trustworthy"
                titleBn="বিশ্বস্ততা যেভাবে আমরা ধরে রাখি"
                description="A knowledge platform is only as valuable as its credibility. These are the standards every Edueyedia page is held to."
              />
              <div className="flex flex-col">
                {PRINCIPLES.map((p, i) => (
                  <Reveal key={p.index} delay={0.05 * i}>
                    <div className="group flex gap-5 border-b border-hairline py-6 transition-colors first:border-t dark:border-white/10">
                      <span className="font-serif text-2xl text-gold">{p.index}</span>
                      <div>
                        <h3 className="font-serif text-xl text-navy dark:text-slate-100">
                          {p.title}
                        </h3>
                        <p className="font-bangla mt-0.5 text-[13px] text-teal dark:text-teal-bright">
                          {p.bn}
                        </p>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                          {p.copy}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------- Audience ----------------------------- */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <span aria-hidden className="section-num pointer-events-none absolute top-10 left-6 text-navy dark:text-white lg:left-10">
            02
          </span>
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="Who it's for"
              title="Built for every stage of the research journey"
              titleBn="গবেষণা যাত্রার প্রতিটি ধাপের জন্য"
              description="From the first research question to a funded offer letter — Edueyedia meets learners where they are."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {AUDIENCE.map((a, i) => (
                <Reveal key={a.title} delay={0.06 * i}>
                  <div className="flex h-full flex-col rounded-3xl border border-hairline bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,34,56,0.25)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-teal/10 text-teal dark:bg-teal/15 dark:text-teal-bright">
                      <a.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-serif text-xl text-navy dark:text-slate-100">
                      {a.title}
                    </h3>
                    <p className="font-bangla mt-0.5 text-[13px] text-teal dark:text-teal-bright">
                      {a.bn}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                      {a.copy}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ Story ------------------------------ */}
        <section className="bg-cool py-20 sm:py-28 dark:bg-navy-ink">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              eyebrow="The story"
              title="Why Edueyedia exists"
              titleBn="কেন এডুইডিয়া"
              align="center"
              className="mx-auto max-w-3xl"
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STORY.map((s, i) => (
                <Reveal key={s.title} delay={0.07 * i}>
                  <div className="relative flex h-full flex-col rounded-3xl border border-hairline bg-white p-6 dark:border-white/10 dark:bg-navy-surface">
                    <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-navy uppercase">
                      {s.year}
                    </span>
                    <p className="mt-2 text-[10px] font-bold tracking-[0.2em] text-teal uppercase dark:text-teal-bright">
                      {s.bn}
                    </p>
                    <h3 className="mt-1.5 font-serif text-xl text-navy dark:text-slate-100">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                      {s.copy}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ CTA ------------------------------ */}
        <section className="relative overflow-hidden bg-navy-deep py-20 sm:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-white opacity-[0.05]" />
          <div aria-hidden className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-teal/15 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                <FileText className="size-3.5" />
                Research. Learn. Advance.
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-bangla mt-6 text-4xl leading-[1.15] font-bold text-white text-balance sm:text-5xl">
                আপনার গবেষণা যাত্রা শুরু হোক এখান থেকেই
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                Browse the library, read a guide, or save your first resource to a
                personal library — free and in Bangla.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/resources"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-navy shadow-[0_14px_30px_-12px_rgba(214,168,75,0.6)] transition-all hover:-translate-y-0.5 hover:bg-gold/90"
                >
                  Explore the Library
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/auth?returnTo=/dashboard"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-7 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-teal/60 hover:text-teal-bright"
                >
                  Create free account
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
