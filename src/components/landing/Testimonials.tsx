import { BadgeCheck, Quote } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { testimonials } from "@/data/catalog";

export function Testimonials() {
  return (
    <section className="bg-ivory py-20 sm:py-28 dark:bg-navy-deep">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Reader Stories"
          title="From readers who finished"
          titleBn="যারা শেষ করেছেন, তাদের কথা"
          description="Real readers, real outcomes — every story below comes from a verified purchase."
          align="center"
          className="items-center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={0.07 * i}>
              <figure className="group relative flex h-full flex-col rounded-3xl border border-hairline bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,34,56,0.25)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40">
                <Quote className="absolute top-6 right-6 size-8 text-gold/25" />
                <blockquote className="text-[15px] leading-relaxed text-navy dark:text-slate-200">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-hairline pt-5 dark:border-white/10">
                  <span className="flex size-10 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold dark:bg-teal dark:text-navy-deep">
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy dark:text-slate-100">{t.name}</p>
                    <p className="text-xs text-ink-soft dark:text-slate-400">{t.role}</p>
                  </div>
                  <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-[10px] font-bold tracking-wide text-teal uppercase dark:text-teal-bright">
                    <BadgeCheck className="size-3.5" />
                    Verified · {t.resource}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
