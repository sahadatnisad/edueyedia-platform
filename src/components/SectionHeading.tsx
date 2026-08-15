import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  titleBn?: string;
  description?: string;
  action?: { label: string; to: string };
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  titleBn,
  description,
  action,
  dark = false,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 text-xs font-semibold tracking-[0.22em] uppercase",
          dark ? "text-gold" : "text-teal",
        )}
      >
        <span className="h-px w-8 bg-current opacity-60" />
        {eyebrow}
      </div>
      <div className="max-w-3xl">
        <h2
          className={cn(
            "font-serif text-4xl leading-[1.08] tracking-tight text-balance sm:text-5xl",
            dark ? "text-white" : "text-navy",
          )}
        >
          {title}
        </h2>
        {titleBn && (
          <p
            className={cn(
              "font-bangla mt-3 text-xl leading-relaxed sm:text-2xl",
              dark ? "text-slate-300" : "text-ink-soft",
            )}
          >
            {titleBn}
          </p>
        )}
      </div>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            dark ? "text-slate-300/90" : "text-ink-soft",
          )}
        >
          {description}
        </p>
      )}
      {action && (
        <Link
          to={action.to}
          className={cn(
            "link-underline group inline-flex w-fit items-center gap-1.5 text-sm font-semibold",
            dark ? "text-white" : "text-navy",
          )}
        >
          {action.label}
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </Reveal>
  );
}
