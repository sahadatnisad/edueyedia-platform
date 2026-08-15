import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, BookOpen, FileText, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { resources } from "@/data/catalog";

const TRUST = [
  "বাংলায় তৈরি",
  "Research-focused",
  "Practical Resources",
  "Secure Digital Delivery",
];

const REVIEWERS = [
  { initials: "NJ", name: "Nusrat J." },
  { initials: "IZ", name: "Israt Z." },
  { initials: "MC", name: "Mehjabin C." },
  { initials: "AH", name: "Arif H." },
  { initials: "TA", name: "Tanvir A." },
];

export function Hero() {
  const totalReviews = resources.reduce((sum, r) => sum + r.reviewCount, 0);
  const avgRating =
    resources.reduce((sum, r) => sum + r.rating * r.reviewCount, 0) / totalReviews;

  return (
    <section className="relative overflow-hidden bg-ivory pb-16 pt-36 sm:pb-20 sm:pt-40 dark:bg-navy-deep">
      {/* background motifs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-teal/10 blur-3xl dark:bg-teal/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-[-12%] h-96 w-96 rounded-full bg-gold/15 blur-3xl dark:bg-gold/10"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-12 lg:gap-10">
        {/* ---------------- Left: editorial copy ---------------- */}
        <div className="lg:col-span-6">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <p className="text-xs font-bold tracking-[0.24em] text-navy uppercase dark:text-gold">
                Edueyedia Knowledge Platform
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-bangla mt-6 text-[42px] leading-[1.15] font-bold text-navy text-balance sm:text-6xl lg:text-[64px] dark:text-slate-50">
              জ্ঞান, গবেষণা ও সুযোগকে নতুনভাবে আবিষ্কার করুন
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="font-bangla mt-3 font-serif text-xl leading-relaxed text-teal italic sm:text-2xl dark:text-teal-bright">
              Research. Learn. Advance.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <p className="font-bangla mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg dark:text-slate-300">
              গবেষণা, স্কলারশিপ, উচ্চশিক্ষা ও ক্যারিয়ারের জন্য প্রয়োজনীয় গাইড,
              বিশ্লেষণ, PDF ও ডিজিটাল রিসোর্স — সহজ বাংলায়।
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
                to="/insights"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-hairline bg-white px-7 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:border-teal/40"
              >
                <BookOpen className="size-4 text-teal" />
                Read Insights
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.38}>
            <div className="mt-10 flex flex-col gap-5">
              {/* rating strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex -space-x-2.5">
                  {REVIEWERS.map((r) => (
                    <span
                      key={r.name}
                      title={r.name}
                      className="flex size-9 items-center justify-center rounded-full border-2 border-ivory bg-navy text-[11px] font-bold text-white dark:border-navy-deep dark:bg-teal dark:text-navy-deep"
                    >
                      {r.initials}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-gold text-gold"
                      />
                    ))}
                  </span>
                  <p className="text-xs text-ink-soft dark:text-slate-400">
                    <span className="font-semibold text-navy dark:text-slate-200">
                      {avgRating.toFixed(1)}
                    </span>{" "}
                    from {totalReviews.toLocaleString()}+ reader reviews
                  </p>
                </div>
              </div>
              {/* trust chips */}
              <div className="flex flex-wrap gap-2">
                {TRUST.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white/70 px-3 py-1.5 text-xs font-medium text-navy dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    <BadgeCheck className="size-3.5 text-teal" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---------------- Right: abstract knowledge composition ---------------- */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[4/4.4] w-full max-w-[520px]">
            {/* nodes behind */}
            <svg
              aria-hidden
              viewBox="0 0 400 400"
              className="absolute inset-0 h-full w-full text-navy opacity-[0.10] dark:text-white"
              fill="none"
              stroke="currentColor"
            >
              <path d="M60 80 L180 150 L140 300 L300 240 L340 90 L210 40" />
              <path d="M180 150 L300 240" strokeDasharray="5 6" />
              {[
                [60, 80],
                [180, 150],
                [140, 300],
                [300, 240],
                [340, 90],
                [210, 40],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="6" fill="currentColor" />
              ))}
            </svg>

            {/* main paper card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-[6%] left-[4%] w-[62%] rotate-[-3deg]"
            >
              <div className="animate-float rounded-2xl bg-navy p-5 text-white shadow-[0_40px_80px_-30px_rgba(21,34,56,0.55)] ring-1 ring-white/10 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-gold uppercase">
                    Research Paper
                  </span>
                  <FileText className="size-3.5 text-slate-400" />
                </div>
                <p className="font-serif mt-4 text-sm leading-snug sm:text-base">
                  Digital literacy & rural women in Bangladesh: a mixed-methods study
                </p>
                <div className="mt-4 flex flex-col gap-1.5">
                  {[100, 82, 92, 66].map((w, i) => (
                    <span
                      key={i}
                      className="block h-1.5 rounded-full bg-white/25"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[9px] text-slate-400">
                  <span>Vol. 12 · 2026</span>
                  <span>n = 320</span>
                </div>
              </div>
            </motion.div>

            {/* scholarship card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-[8%] right-[0%] w-[42%] rotate-[3deg]"
            >
              <div className="animate-float-slow rounded-2xl border border-gold/30 bg-white p-4 shadow-[0_24px_48px_-20px_rgba(214,168,75,0.4)] dark:bg-navy-surface sm:p-5">
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-[#8a681f] uppercase dark:text-gold">
                  Fully Funded
                </span>
                <p className="mt-3 text-[13px] leading-snug font-semibold text-navy dark:text-slate-100">
                  Erasmus Mundus
                  <span className="block text-[11px] font-medium text-ink-soft dark:text-slate-400">
                    Europe · Master's
                  </span>
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-hairline pt-2.5 text-[10px] dark:border-white/10">
                  <span className="text-ink-soft dark:text-slate-400">Stipend included</span>
                  <span className="font-bold text-teal dark:text-teal-bright">৳0 tuition</span>
                </div>
              </div>
            </motion.div>

            {/* chart fragment */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-[46%] right-[2%] w-[36%] rotate-[2deg]"
            >
              <div className="animate-float rounded-2xl bg-teal p-4 text-white shadow-[0_24px_48px_-20px_rgba(15,118,110,0.5)] [animation-delay:1.2s] sm:p-5">
                <p className="text-[9px] font-bold tracking-[0.18em] text-teal-100 uppercase">
                  Research output
                </p>
                <div className="mt-3 flex h-16 items-end gap-1.5">
                  {[40, 62, 48, 78, 58, 92].map((h, i) => (
                    <span
                      key={i}
                      className="w-2.5 rounded-t-sm bg-white/80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-teal-50/90">+63% vs 2024</p>
              </div>
            </motion.div>

            {/* quote card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-[2%] left-[6%] w-[54%] -rotate-[1deg]"
            >
              <div className="animate-float-slow rounded-2xl border border-hairline bg-white p-5 shadow-[0_24px_48px_-24px_rgba(15,34,56,0.3)] [animation-delay:2s] dark:border-white/10 dark:bg-navy-surface">
                <span className="font-serif text-4xl leading-none text-gold">“</span>
                <p className="font-bangla -mt-2 text-sm leading-relaxed text-navy dark:text-slate-100">
                  গবেষণাকে জটিল হতে হবে না। ধাপে ধাপে শিখুন।
                </p>
                <p className="mt-2 text-[10px] font-semibold tracking-wide text-teal uppercase dark:text-teal-bright">
                  — Edueyedia Research Method
                </p>
              </div>
            </motion.div>

            {/* gold seal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="absolute bottom-[10%] right-[6%]"
            >
              <div className="flex size-16 animate-float items-center justify-center rounded-full bg-gold text-center shadow-[0_16px_32px_-12px_rgba(214,168,75,0.6)] [animation-delay:0.6s] sm:size-20">
                <div>
                  <p className="text-[15px] leading-none font-black text-navy sm:text-lg">22+</p>
                  <p className="mt-0.5 text-[7px] font-bold tracking-[0.14em] text-navy/70 uppercase">
                    Resources
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
