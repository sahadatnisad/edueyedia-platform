import { cn } from "@/lib/utils";
import type { CoverStyle } from "@/data/catalog";
import type { Course } from "@/data/courses";

const TONES: Record<
  CoverStyle["tone"],
  { bg: string; text: string; soft: string; accent: string }
> = {
  navy: {
    bg: "bg-gradient-to-br from-[#1B2C4A] via-[#152238] to-[#0C1626]",
    text: "text-white",
    soft: "text-slate-300/90",
    accent: "text-gold",
  },
  teal: {
    bg: "bg-gradient-to-br from-[#12817A] via-[#0F766E] to-[#0A4D48]",
    text: "text-white",
    soft: "text-teal-50/90",
    accent: "text-gold",
  },
  gold: {
    bg: "bg-gradient-to-br from-[#EFD9A4] via-[#D6A84B] to-[#B98A2E]",
    text: "text-navy",
    soft: "text-navy/70",
    accent: "text-navy",
  },
  ivory: {
    bg: "bg-[#F6F3EA]",
    text: "text-navy",
    soft: "text-ink-soft",
    accent: "text-teal",
  },
  graphite: {
    bg: "bg-gradient-to-br from-[#2B3850] to-[#131C2C]",
    text: "text-white",
    soft: "text-slate-300/90",
    accent: "text-teal-bright",
  },
  moss: {
    bg: "bg-gradient-to-br from-[#3A4A30] to-[#1C2618]",
    text: "text-white",
    soft: "text-slate-200/90",
    accent: "text-gold",
  },
};

/** A designed course cover — rendered entirely from CSS, matching BookCover. */
export function CourseCover({
  course,
  className,
}: {
  course: Course;
  className?: string;
}) {
  const tone = TONES[course.cover.tone];
  const isBanglaTitle = Boolean(course.titleBn);

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_18px_40px_-18px_rgba(15,34,56,0.35)] ring-1 ring-black/5",
        tone.bg,
        tone.text,
        className,
      )}
    >
      {/* pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 line-grid opacity-[0.12]"
        style={{ color: tone.soft }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 -bottom-8 font-serif text-[9rem] leading-none opacity-[0.12] select-none"
        style={{ color: tone.soft }}
      >
        {course.cover.glyph}
      </span>

      <span className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-white/30 to-transparent" />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-[9px] font-bold tracking-[0.2em] uppercase sm:text-[10px]",
              tone.accent,
            )}
          >
            {course.category}
          </span>
          <span
            className={cn(
              "rounded-full border border-current px-2 py-0.5 text-[9px] font-bold tracking-[0.14em] uppercase opacity-70",
              tone.accent,
            )}
          >
            {course.isFree ? "Free" : `৳${course.price}`}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-1.5">
          {course.cover.glyph && (
            <span
              aria-hidden
              className={cn("font-serif text-2xl leading-none opacity-60 sm:text-3xl", tone.accent)}
            >
              {course.cover.glyph}
            </span>
          )}
          <h3
            className={cn(
              "text-lg leading-snug sm:text-xl",
              isBanglaTitle ? "font-bangla font-semibold" : "font-serif",
            )}
          >
            {course.titleBn}
          </h3>
          <p className={cn("font-serif text-sm leading-snug sm:text-base", tone.soft)}>
            {course.title}
          </p>
          <span aria-hidden className={cn("mt-1 h-px w-10", "bg-current", "opacity-40")} />
        </div>

        <div
          className={cn(
            "mt-3 flex items-center justify-between text-[10px] font-medium sm:text-[11px]",
            tone.soft,
          )}
        >
          <span>{course.lessonCount} lessons</span>
          <span className={cn("font-bold", tone.accent)}>{course.duration}</span>
        </div>
      </div>
    </div>
  );
}
