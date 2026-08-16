import { cn } from "@/lib/utils";
import type { Article } from "@/data/catalog";

const TONES: Record<string, string> = {
  navy: "from-[#1B2C4A] via-[#152238] to-[#0C1626]",
  teal: "from-[#12817A] via-[#0F766E] to-[#0A4D48]",
  gold: "from-[#EFD9A4] via-[#D6A84B] to-[#B98A2E]",
  ivory: "from-[#F3EFE3] to-[#E7E0CC]",
  graphite: "from-[#2B3850] to-[#131C2C]",
  moss: "from-[#3A4A30] to-[#1C2618]",
};

export function ArticleArt({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  const tone = TONES[article.cover.tone] ?? TONES.navy;
  const darkTone = article.cover.tone === "ivory" || article.cover.tone === "gold";

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-gradient-to-br",
        tone,
        className,
      )}
    >
      {/* faint academic texture */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 dot-grid opacity-[0.22]",
          darkTone ? "text-navy" : "text-white",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-y-0 right-0 w-1/2 line-grid opacity-[0.14]",
          darkTone ? "text-navy" : "text-white",
        )}
      />

      {/* oversized serif glyph */}
      <span
        aria-hidden
        className={cn(
          "absolute -right-3 -bottom-8 font-serif text-[10rem] leading-none select-none sm:text-[13rem]",
          darkTone ? "text-navy/15" : "text-white/10",
        )}
      >
        {article.cover.glyph ?? "“"}
      </span>

      {/* connected nodes */}
      <svg
        aria-hidden
        viewBox="0 0 300 160"
        preserveAspectRatio="xMidYMid slice"
        className={cn(
          "absolute inset-0 h-full w-full opacity-[0.28]",
          darkTone ? "text-navy" : "text-white",
        )}
        fill="none"
        stroke="currentColor"
      >
        <path d="M30 40 L110 90 L80 140 L190 110 L260 40" strokeWidth="1.2" />
        <path d="M110 90 L190 110" strokeWidth="1" strokeDasharray="4 5" />
        {[
          [30, 40],
          [110, 90],
          [80, 140],
          [190, 110],
          [260, 40],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" fill="currentColor" stroke="none" />
        ))}
      </svg>

      {/* bottom hairline + label */}
      <div
        className={cn(
          "absolute inset-x-5 bottom-4 flex items-center justify-between text-[9px] font-bold tracking-[0.22em] uppercase sm:text-[10px]",
          darkTone ? "text-navy/70" : "text-white/75",
        )}
      >
        <span>Edueyedia Journal</span>
        <span>VOL. {article.cover.glyph ? "01" : "02"} — 2026</span>
      </div>
    </div>
  );
}
