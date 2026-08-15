import { cn } from "@/lib/utils";

export function Timeline({ steps }: { steps: string[] }) {
  return (
    <ol className="relative flex flex-col gap-0 pl-6 sm:pl-0 sm:flex-row sm:flex-wrap sm:gap-y-8">
      {/* vertical line on mobile */}
      <span
        aria-hidden
        className="absolute top-1 bottom-1 left-[7px] w-px bg-teal/30 sm:hidden"
      />
      {steps.map((step, i) => (
        <li
          key={step}
          className={cn(
            "relative flex items-start gap-4 pb-7 sm:pb-0 sm:flex-1 sm:min-w-44 sm:flex-col sm:items-start sm:gap-3",
            i < steps.length - 1 && "sm:pr-6",
          )}
        >
          <span
            aria-hidden
            className="relative z-10 mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border border-teal/50 bg-background sm:mt-0"
          >
            <span className="size-1.5 rounded-full bg-teal dark:bg-teal-bright" />
          </span>
          <div className="sm:mt-1">
            <p className="text-[11px] font-bold tracking-[0.16em] text-ink-soft uppercase dark:text-slate-400">
              Step {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-0.5 font-bangla text-[15px] font-semibold text-navy sm:text-base dark:text-slate-100">
              {step}
            </p>
          </div>
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="hidden h-px flex-1 self-start bg-gradient-to-r from-teal/40 to-teal/10 sm:mt-2.5 sm:block"
            />
          )}
        </li>
      ))}
    </ol>
  );
}
