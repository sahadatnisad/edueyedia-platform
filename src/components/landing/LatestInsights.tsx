import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ArticleCard } from "@/components/ArticleCard";
import { articles } from "@/data/catalog";

export function LatestInsights() {
  const latest = articles.slice(0, 3);
  const feature = articles.find((a) => a.featured);

  return (
    <section className="bg-ivory py-20 sm:py-28 dark:bg-navy-deep">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Insights"
            title="Ideas, Guides & Insights"
            titleBn="জ্ঞান, গাইড ও বিশ্লেষণ"
            description="Long-form reading for curious minds — research methods, scholarship strategy and academic writing, published in Bangla and English."
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

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {latest.map((a, i) => (
            <Reveal key={a.slug} delay={0.08 * i}>
              <ArticleCard article={a} className="h-full" />
            </Reveal>
          ))}
        </div>

        {feature && (
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl border border-hairline bg-white p-6 sm:flex-row sm:items-center dark:border-white/10 dark:bg-navy-surface">
              <div className="flex items-center gap-4">
                <span className="font-serif text-4xl text-gold">“</span>
                <p className="max-w-xl font-serif text-lg leading-snug text-navy dark:text-slate-100">
                  {feature.excerpt}
                </p>
              </div>
              <Link
                to={`/insights/${feature.slug}`}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep"
              >
                Keep reading
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
