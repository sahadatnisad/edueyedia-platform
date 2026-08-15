import { Link } from "react-router";
import { ArrowRight, BookOpen, CalendarDays, FileText, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource } from "@/data/catalog";
import { BookCover } from "@/components/BookCover";

interface ResourceCardProps {
  resource: Resource;
  className?: string;
  index?: number;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const free = resource.kind === "free";

  return (
    <Link
      to={`/resources/${resource.slug}`}
      className={cn(
        "group flex flex-col rounded-3xl border border-hairline bg-white p-3 shadow-[0_2px_12px_rgba(15,34,56,0.04)] transition-all duration-300",
        "hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,34,56,0.28)]",
        "dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40",
        className,
      )}
    >
      <div className="relative">
        <BookCover resource={resource} className="transition-transform duration-500 group-hover:-translate-y-1.5" />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-2 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] font-bold tracking-[0.18em] uppercase",
              resource.category === "research" && "text-teal",
              resource.category === "scholarships" && "text-[#8a681f] dark:text-gold",
              resource.category === "academic-writing" && "text-slate-500 dark:text-slate-400",
              resource.category === "study-abroad" && "text-sky-700 dark:text-sky-300",
              resource.category === "career" && "text-emerald-700 dark:text-emerald-300",
              resource.category === "bundles" && "text-navy dark:text-slate-200",
            )}
          >
            {resource.tag}
          </span>
          <span className="h-px flex-1 bg-hairline dark:bg-white/10" />
        </div>

        <h3
          className={cn(
            "text-lg leading-snug font-semibold text-navy transition-colors group-hover:text-teal dark:text-slate-100 dark:group-hover:text-teal-bright",
            resource.titleBn ? "font-bangla" : "font-serif",
          )}
        >
          {resource.titleBn ?? resource.title}
        </h3>
        {resource.titleBn && (
          <p className="font-serif text-sm text-ink-soft dark:text-slate-400">
            {resource.title}
          </p>
        )}

        <p className="line-clamp-2 text-[13px] leading-relaxed text-ink-soft dark:text-slate-400">
          {resource.summary}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-[11px] font-medium text-ink-soft dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <FileText className="size-3" /> {resource.format.split(" ")[0]}
          </span>
          <span className="inline-flex items-center gap-1">
            <Languages className="size-3" /> {resource.language.split(" ")[0]}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3" /> {resource.updated.replace("Updated ", "")}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-hairline pt-3 dark:border-white/10">
          <p className="flex items-baseline gap-1.5">
            {free ? (
              <span className="text-sm font-bold text-teal dark:text-teal-bright">Free</span>
            ) : (
              <>
                <span className="font-serif text-xl font-semibold text-navy dark:text-slate-100">
                  ৳{resource.price}
                </span>
                {resource.compareAt && (
                  <span className="text-xs text-ink-soft line-through">
                    ৳{resource.compareAt}
                  </span>
                )}
              </>
            )}
          </p>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-teal dark:text-teal-bright">
            {free ? "Get Free" : "View Resource"}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
