import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const TOPICS = [
  {
    num: "01",
    label: "Research Methodology",
    bn: "গবেষণা পদ্ধতি",
    to: "/resources?tab=research",
  },
  {
    num: "02",
    label: "Thesis Resources",
    bn: "থিসিস রিসোর্স",
    to: "/resources?tab=research",
  },
  {
    num: "03",
    label: "Academic Writing",
    bn: "অ্যাকাডেমিক রাইটিং",
    to: "/resources?tab=academic-writing",
  },
  {
    num: "04",
    label: "Citation & Sources",
    bn: "সাইটেশন ও সোর্স",
    to: "/resources?tab=academic-writing",
  },
];

export function ResearchSpotlight() {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 text-white sm:py-32">
      {/* motifs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-white opacity-[0.05]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid text-gold opacity-[0.08]" />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-8 font-serif text-[16rem] leading-none text-white opacity-[0.05] select-none sm:text-[22rem]"
      >
        R
      </span>
      <div aria-hidden className="pointer-events-none absolute top-1/3 left-[-8%] h-80 w-80 rounded-full bg-teal/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        {/* Left copy */}
        <div>
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <p className="text-xs font-bold tracking-[0.24em] text-gold uppercase">
                Research Spotlight
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif mt-6 text-4xl leading-[1.1] text-balance sm:text-5xl lg:text-[52px]">
              Research doesn't have to feel complicated.
            </h2>
            <p className="font-bangla mt-4 text-2xl font-medium text-gold sm:text-3xl">
              গবেষণাকে জটিল হতে হবে না।
            </p>
            <p className="font-bangla mt-5 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
              ধাপে ধাপে গাইড, টেমপ্লেট ও বাস্তব উদাহরণের মাধ্যমে গবেষণার প্রতিটি পর্যায় বুঝুন।
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              to="/resources?tab=research"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-navy shadow-[0_16px_32px_-14px_rgba(214,168,75,0.6)] transition-all hover:-translate-y-0.5 hover:bg-gold/90"
            >
              Explore Research
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Right — asymmetric topic cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {TOPICS.map((topic, i) => (
            <Reveal key={topic.num} delay={0.1 + i * 0.08} className={i === 1 ? "sm:translate-y-6" : ""}>
              <Link
                to={topic.to}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-navy-surface/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-navy-surface"
              >
                <div className="flex items-start justify-between">
                  <span className="font-serif text-2xl text-gold/70 transition-colors group-hover:text-gold">
                    {topic.num}
                  </span>
                  <ArrowUpRight className="size-4 text-slate-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
                </div>
                <div className="mt-10">
                  <p className="text-lg leading-snug font-semibold text-white">{topic.label}</p>
                  <p className="font-bangla mt-1 text-sm text-slate-400">{topic.bn}</p>
                </div>
                <span className="mt-5 h-px w-8 bg-gold/50 transition-all duration-300 group-hover:w-14 group-hover:bg-gold" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
