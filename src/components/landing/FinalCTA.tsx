import { Link } from "react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 text-white sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-white opacity-[0.05]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid text-gold opacity-[0.08]" />
      <div aria-hidden className="pointer-events-none absolute top-[-30%] left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-teal/20 blur-3xl" />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 font-serif text-[18rem] leading-none text-white opacity-[0.04] select-none"
      >
        E
      </span>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">
            Start Exploring
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif mt-6 text-4xl leading-[1.1] text-balance sm:text-6xl">
            Your next idea could start here.
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="font-bangla mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
            শেখা, গবেষণা ও নতুন সুযোগের জন্য আপনার পরবর্তী পদক্ষেপ নিন।
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/resources"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-8 text-sm font-semibold text-navy shadow-[0_18px_36px_-14px_rgba(214,168,75,0.6)] transition-all hover:-translate-y-0.5 hover:bg-gold/90"
            >
              Explore Resources
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/blog"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
            >
              <BookOpen className="size-4 text-gold" />
              Read the Blog
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.34}>
          <p className="mt-10 text-[11px] tracking-[0.2em] text-slate-500 uppercase">
            Research · Learn · Advance — from anywhere
          </p>
        </Reveal>
      </div>
    </section>
  );
}
