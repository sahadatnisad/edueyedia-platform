import { cn } from "@/lib/utils";

type CalloutVariant = "key" | "note" | "important" | "example" | "source";

const STYLES: Record<
  CalloutVariant,
  { label: string; className: string }
> = {
  key: {
    label: "Key Insight",
    className:
      "border-teal/40 bg-teal/5 text-teal dark:bg-teal/10 dark:border-teal/30",
  },
  note: {
    label: "Research Note",
    className:
      "border-sky-200 bg-sky-50 text-slate-700 dark:bg-sky-950/30 dark:border-sky-800 dark:text-sky-100",
  },
  important: {
    label: "Important",
    className:
      "border-gold/50 bg-gold/10 text-[#7c5c16] dark:bg-gold/10 dark:border-gold/40 dark:text-gold",
  },
  example: {
    label: "Example",
    className:
      "border-border bg-slate-100/80 text-slate-700 dark:bg-white/[0.04] dark:border-white/10 dark:text-slate-300",
  },
  source: {
    label: "Source",
    className:
      "border-transparent bg-transparent text-ink-soft italic border-l-2 border-l-hairline pl-4 dark:text-slate-400",
  },
};

const LABEL_COLOR: Record<CalloutVariant, string> = {
  key: "text-teal dark:text-teal-bright",
  note: "text-sky-700 dark:text-sky-300",
  important: "text-[#8a681f] dark:text-gold",
  example: "text-ink-soft dark:text-slate-400",
  source: "text-ink-soft dark:text-slate-400",
};

export function Callout({
  variant,
  text,
}: {
  variant: CalloutVariant;
  text: string;
}) {
  const style = STYLES[variant];
  return (
    <div
      className={cn(
        "rounded-2xl border px-6 py-5 text-[15px] leading-relaxed",
        style.className,
      )}
    >
      {variant !== "source" && (
        <p
          className={cn(
            "mb-1.5 text-[11px] font-bold tracking-[0.18em] uppercase",
            LABEL_COLOR[variant],
          )}
        >
          {style.label}
        </p>
      )}
      <p>{text}</p>
    </div>
  );
}
