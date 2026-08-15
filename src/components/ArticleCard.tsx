import { Link } from "react-router";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Article } from "@/data/catalog";
import { ArticleArt } from "@/components/ArticleArt";

export function ArticleCard({
  article,
  className,
  large = false,
}: {
  article: Article;
  className?: string;
  large?: boolean;
}) {
  return (
    <Link
      to={`/insights/${article.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-hairline bg-white transition-all duration-300",
        "hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,34,56,0.25)]",
        "dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40",
        className,
      )}
    >
      <div className={cn("relative", large ? "aspect-[16/9]" : "aspect-[16/10]")}>
        <ArticleArt article={article} />
        <span className="absolute top-4 left-4 rounded-full bg-navy/85 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase backdrop-blur">
          {article.categoryLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3 text-[11px] font-medium text-ink-soft dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="size-3" /> {article.author}
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-current opacity-50" />
          <span>{article.date}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-current opacity-50" />
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" /> {article.readingTime}
          </span>
        </div>
        <h3
          className={cn(
            "leading-snug font-semibold text-navy transition-colors group-hover:text-teal dark:text-slate-100 dark:group-hover:text-teal-bright",
            large ? "font-serif text-2xl sm:text-3xl" : "font-serif text-xl",
          )}
        >
          {article.title}
        </h3>
        {article.titleBn && (
          <p className="font-bangla text-sm text-ink-soft dark:text-slate-400">
            {article.titleBn}
          </p>
        )}
        <p className={cn("text-sm leading-relaxed text-ink-soft dark:text-slate-400", large ? "line-clamp-3" : "line-clamp-2")}>
          {article.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[13px] font-semibold text-teal dark:text-teal-bright">
          Read article
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
