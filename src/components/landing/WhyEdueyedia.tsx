import { BadgeCheck, BookOpenCheck, FileCheck2, RefreshCcw, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { trustPoints } from "@/data/catalog";

const ICONS = [BookOpenCheck, FileCheck2, BadgeCheck, ShieldCheck, RefreshCcw];

export function WhyEdueyedia() {
  return (
    <section className="relative overflow-hidden bg-cool py-20 sm:py-28 dark:bg-navy-surface/40">
      <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Why Edueyedia"
              title="Built on evidence, not hype"
              titleBn="প্রমাণের ভিত্তিতে তৈরি"
              description="No inflated statistics. Just the practices that make our resources actually work for Bangladeshi students and researchers."
            />
            <Reveal delay={0.2}>
              <div className="mt-8 hidden rounded-3xl border border-hairline bg-white p-6 lg:block dark:border-white/10 dark:bg-navy-surface">
                <p className="font-serif text-lg leading-snug text-navy dark:text-slate-100">
                  "If it doesn't help you finish, we rewrite it."
                </p>
                <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-teal uppercase dark:text-teal-bright">
                  — The Edueyedia editorial standard
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {trustPoints.map((point, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Reveal key={point.en} delay={0.06 * i}>
                  <div className="group h-full rounded-3xl border border-hairline bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_44px_-22px_rgba(15,34,56,0.22)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-teal/10 text-teal transition-colors group-hover:bg-teal group-hover:text-white dark:bg-teal/20 dark:text-teal-bright dark:group-hover:bg-teal dark:group-hover:text-navy-deep">
                      <Icon className="size-5" />
                    </div>
                    <p className="font-bangla mt-4 text-lg font-semibold text-navy dark:text-slate-100">
                      {point.title}
                    </p>
                    <p className="mt-0.5 text-xs font-bold tracking-[0.14em] text-teal uppercase dark:text-teal-bright">
                      {point.en}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                      {point.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
