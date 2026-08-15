import { cn } from "@/lib/utils";
import type { CoverStyle, Resource } from "@/data/catalog";

/* Tone palettes — fixed colours so covers look identical in light & dark mode */
const TONES: Record<
  CoverStyle["tone"],
  { bg: string; text: string; soft: string; accent: string; tag: string }
> = {
  navy: {
    bg: "bg-gradient-to-br from-[#1B2C4A] via-[#152238] to-[#0C1626]",
    text: "text-white",
    soft: "text-slate-300/90",
    accent: "text-gold",
    tag: "text-gold",
  },
  teal: {
    bg: "bg-gradient-to-br from-[#12817A] via-[#0F766E] to-[#0A4D48]",
    text: "text-white",
    soft: "text-teal-50/90",
    accent: "text-gold",
    tag: "text-gold",
  },
  gold: {
    bg: "bg-gradient-to-br from-[#EFD9A4] via-[#D6A84B] to-[#B98A2E]",
    text: "text-navy",
    soft: "text-navy/70",
    accent: "text-navy",
    tag: "text-navy/80",
  },
  ivory: {
    bg: "bg-[#F6F3EA]",
    text: "text-navy",
    soft: "text-ink-soft",
    accent: "text-gold",
    tag: "text-teal",
  },
  graphite: {
    bg: "bg-gradient-to-br from-[#2B3850] to-[#131C2C]",
    text: "text-white",
    soft: "text-slate-300/90",
    accent: "text-teal-bright",
    tag: "text-teal-bright",
  },
  moss: {
    bg: "bg-gradient-to-br from-[#3A4A30] to-[#1C2618]",
    text: "text-white",
    soft: "text-slate-200/90",
    accent: "text-gold",
    tag: "text-gold",
  },
};

function Pattern({
  pattern,
  tone,
}: {
  pattern: CoverStyle["pattern"];
  tone: CoverStyle["tone"];
}) {
  const base = cn(
    "pointer-events-none absolute inset-0",
    pattern === "grid" && "line-grid",
    pattern === "dots" && "dot-grid",
  );
  const color = TONES[tone].soft;

  if (pattern === "lines") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[22%] bottom-[26%] opacity-[0.16]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 16px)",
          color,
        }}
      />
    );
  }
  if (pattern === "paper") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div
          className="absolute inset-x-6 top-[20%] bottom-[28%]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 22px, currentColor 22px 23px)",
            color,
          }}
        />
        <div
          className="absolute top-[20%] bottom-[28%] left-9 w-px bg-current"
          style={{ color }}
        />
      </div>
    );
  }
  if (pattern === "bars") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 flex items-end justify-center gap-2 px-8 opacity-25"
        style={{ color }}
      >
        {[34, 58, 44, 72, 52, 84, 40, 66].map((h, i) => (
          <span
            key={i}
            className="w-3 rounded-t-sm bg-current"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    );
  }
  if (pattern === "nodes") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
        style={{ color }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M30 40 L90 78 L60 150 L140 120 L180 60 L120 30" />
        <circle cx="30" cy="40" r="4" fill="currentColor" stroke="none" />
        <circle cx="90" cy="78" r="4" fill="currentColor" stroke="none" />
        <circle cx="60" cy="150" r="4" fill="currentColor" stroke="none" />
        <circle cx="140" cy="120" r="4" fill="currentColor" stroke="none" />
        <circle cx="180" cy="60" r="4" fill="currentColor" stroke="none" />
        <circle cx="120" cy="30" r="4" fill="currentColor" stroke="none" />
        <path d="M90 78 L140 120" strokeDasharray="3 4" />
      </svg>
    );
  }
  if (pattern === "quote") {
    return (
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-6 -right-2 font-serif text-[11rem] leading-none opacity-[0.14] select-none",
          TONES[tone].text,
        )}
      >
        &rdquo;
      </span>
    );
  }
  return <div aria-hidden className={base} />;
}

interface BookCoverProps {
  resource: Resource;
  className?: string;
  compact?: boolean;
}

/** A designed book/document cover — rendered entirely from CSS. */
export function BookCover({ resource, className, compact = false }: BookCoverProps) {
  const tone = TONES[resource.cover.tone];
  const isBanglaTitle = Boolean(resource.titleBn);

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_18px_40px_-18px_rgba(15,34,56,0.35)] ring-1 ring-black/5",
        tone.bg,
        tone.text,
        className,
      )}
    >
      <Pattern pattern={resource.cover.pattern} tone={resource.cover.tone} />

      {/* spine highlight */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-white/30 to-transparent" />
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        {/* top row */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-[9px] font-bold tracking-[0.2em] uppercase sm:text-[10px]",
              tone.tag,
            )}
          >
            {resource.tag}
          </span>
          {resource.kind === "free" ? (
            <span
              className={cn(
                "rounded-full border border-current px-2 py-0.5 text-[9px] font-bold tracking-[0.14em] uppercase opacity-60",
                tone.accent,
              )}
            >
              Free
            </span>
          ) : (
            <span className={cn("text-[9px] font-semibold tracking-wide sm:text-[10px]", tone.soft)}>
              {resource.format.split(" ")[0]}
            </span>
          )}
        </div>

        {/* center */}
        <div className="mt-auto flex flex-col gap-1.5">
          {resource.cover.glyph && !compact && (
            <span
              aria-hidden
              className={cn(
                "font-serif text-2xl leading-none opacity-60 sm:text-3xl",
                tone.accent,
              )}
            >
              {resource.cover.glyph}
            </span>
          )}
          <h3
            className={cn(
              compact
                ? "text-base leading-snug sm:text-lg"
                : "text-lg leading-snug sm:text-2xl",
              isBanglaTitle ? "font-bangla font-semibold" : "font-serif",
            )}
          >
            {resource.titleBn ?? resource.title}
          </h3>
          {resource.titleBn && (
            <p className={cn("font-serif text-sm leading-snug sm:text-base", tone.soft)}>
              {resource.title}
            </p>
          )}
          <span
            aria-hidden
            className={cn("mt-1 h-px w-10", "bg-current", "opacity-40")}
          />
        </div>

        {/* bottom meta */}
        <div
          className={cn(
            "mt-3 flex items-center justify-between text-[10px] font-medium sm:text-[11px]",
            tone.soft,
          )}
        >
          <span>{resource.pages} pages</span>
          <span className={cn("font-bold", tone.accent)}>
            {resource.kind === "free" ? "৳0 — Free" : `৳${resource.price}`}
          </span>
        </div>
      </div>
    </div>
  );
}
