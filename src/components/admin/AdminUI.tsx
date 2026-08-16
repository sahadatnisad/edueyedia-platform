import { ArrowLeft, Check, GripVertical, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

/* ------------------------------ primitives -------------------------- */

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-xs font-semibold text-navy dark:text-slate-200">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-ink-soft dark:text-slate-400">{hint}</p>}
    </div>
  );
}

export function TextInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className={cn(
        "h-10 rounded-xl border-hairline bg-white text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100",
        props.className,
      )}
    />
  );
}

export function TextArea(props: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      {...props}
      className={cn(
        "rounded-xl border-hairline bg-white text-sm leading-relaxed dark:border-white/10 dark:bg-white/5 dark:text-slate-100",
        props.className,
      )}
    />
  );
}

export const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "coming-soon", label: "Coming soon" },
  { value: "archived", label: "Archived" },
] as const;

export function StatusSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-40 rounded-xl border-hairline bg-white text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SimpleSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-10 rounded-xl border-hairline bg-white text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
        <SelectValue placeholder={placeholder ?? "Select…"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Editable string list — one item per line in the textarea. */
export function ListEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <TextArea
      value={value.join("\n")}
      onChange={(e) =>
        onChange(
          e.target.value
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        )
      }
      placeholder={placeholder ?? "One item per line"}
      className="min-h-24 font-mono text-[13px]"
    />
  );
}

export const TONES = ["navy", "teal", "gold", "ivory", "graphite", "moss"];
export const PATTERNS = ["grid", "dots", "lines", "nodes", "quote", "bars", "paper"];

export function CoverFields({
  tone,
  pattern,
  glyph,
  onChange,
}: {
  tone: string;
  pattern: string;
  glyph?: string;
  onChange: (patch: { tone: string; pattern: string; glyph?: string }) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field label="Cover tone">
        <SimpleSelect
          value={tone}
          onChange={(v) => onChange({ tone: v, pattern, glyph })}
          options={TONES.map((t) => ({ value: t, label: t }))}
        />
      </Field>
      <Field label="Cover pattern">
        <SimpleSelect
          value={pattern}
          onChange={(v) => onChange({ tone, pattern: v, glyph })}
          options={PATTERNS.map((p) => ({ value: p, label: p }))}
        />
      </Field>
      <Field label="Glyph" hint="Single letter/symbol on the cover">
        <TextInput
          value={glyph ?? ""}
          maxLength={2}
          onChange={(e) => onChange({ tone, pattern, glyph: e.target.value })}
        />
      </Field>
    </div>
  );
}

/** Editor page shell — title, back link, save button. */
export function EditorShell({
  title,
  backTo,
  onSave,
  saving,
  children,
}: {
  title: string;
  backTo: string;
  onSave: () => void;
  saving?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="h-9 rounded-full">
            <Link to={backTo}>
              <ArrowLeft className="size-3.5" /> Back
            </Link>
          </Button>
          <h1 className="font-serif text-2xl text-navy dark:text-slate-50">{title}</h1>
        </div>
        <Button size="sm" className="h-9 rounded-full" onClick={onSave} disabled={saving}>
          <Check className="size-3.5" />
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

/* ------------------------------ block editor ------------------------- */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "quote"; text: string; source?: string }
  | {
      type: "callout";
      variant: "key" | "note" | "important" | "example" | "source";
      text: string;
    }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "timeline"; steps: string[] }
  | { type: "reference"; items: string[] };

export const BLOCK_TYPES: { value: Block["type"]; label: string }[] = [
  { value: "p", label: "Paragraph" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "quote", label: "Quote" },
  { value: "callout", label: "Callout" },
  { value: "list", label: "List" },
  { value: "timeline", label: "Timeline" },
  { value: "reference", label: "References" },
];

const CALLOUT_VARIANTS = ["key", "note", "important", "example", "source"];

const slugId = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60) || `section-${Math.random().toString(36).slice(2, 7)}`;

function newBlock(type: Block["type"]): Block {
  switch (type) {
    case "h2":
    case "h3":
      return { type, text: "", id: "" };
    case "quote":
      return { type, text: "", source: "" };
    case "callout":
      return { type, variant: "note", text: "" };
    case "list":
      return { type, items: [""] };
    case "timeline":
    case "reference":
      return { type, steps: [""], items: [""] } as Block;
    default:
      return { type: "p", text: "" };
  }
}

export function BlockEditor({
  value,
  onChange,
}: {
  value: Block[];
  onChange: (b: Block[]) => void;
}) {
  const update = (i: number, patch: Partial<Block>) =>
    onChange(value.map((b, j) => (j === i ? ({ ...b, ...patch } as Block) : b)));
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {value.map((block, i) => (
        <div
          key={i}
          className="rounded-2xl border border-hairline bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]"
        >
          <div className="flex items-center gap-2">
            <GripVertical className="size-4 shrink-0 text-ink-soft/40" />
            <SimpleSelect
              value={block.type}
              onChange={(t) => update(i, newBlock(t as Block["type"]))}
              options={BLOCK_TYPES}
              placeholder="Block type"
            />
            <span className="ml-auto flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                aria-label="Move down"
              >
                ↓
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0 text-destructive hover:text-destructive"
                onClick={() => remove(i)}
                aria-label="Remove block"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-3 pl-6">
            {(block.type === "p" ||
              block.type === "h2" ||
              block.type === "h3") && (
              <>
                <TextArea
                  value={block.text}
                  onChange={(e) => update(i, { text: e.target.value })}
                  placeholder="Text"
                  className="min-h-20"
                />
                {(block.type === "h2" || block.type === "h3") && (
                  <TextInput
                    value={block.id}
                    onChange={(e) => update(i, { id: e.target.value })}
                    placeholder="Anchor id"
                    className="font-mono text-xs"
                  />
                )}
              </>
            )}
            {block.type === "quote" && (
              <>
                <TextArea
                  value={block.text}
                  onChange={(e) => update(i, { text: e.target.value })}
                  placeholder="Quoted text"
                  className="min-h-16"
                />
                <TextInput
                  value={block.source ?? ""}
                  onChange={(e) => update(i, { source: e.target.value })}
                  placeholder="Source (optional)"
                />
              </>
            )}
            {block.type === "callout" && (
              <>
                <SimpleSelect
                  value={block.variant}
                  onChange={(v) =>
                    update(i, {
                      variant: v as "key" | "note" | "important" | "example" | "source",
                    })
                  }
                  options={CALLOUT_VARIANTS.map((v) => ({ value: v, label: v }))}
                />
                <TextArea
                  value={block.text}
                  onChange={(e) => update(i, { text: e.target.value })}
                  placeholder="Callout text"
                  className="min-h-16"
                />
              </>
            )}
            {block.type === "list" && (
              <>
                <label className="flex items-center gap-2 text-xs font-medium text-ink-soft dark:text-slate-400">
                  <Checkbox
                    checked={block.ordered ?? false}
                    onCheckedChange={(c) => update(i, { ordered: c === true })}
                  />
                  Numbered list
                </label>
                <ListEditor
                  value={block.items}
                  onChange={(items) => update(i, { items })}
                />
              </>
            )}
            {(block.type === "timeline" || block.type === "reference") && (
              <ListEditor
                value={block.type === "timeline" ? block.steps : block.items}
                onChange={(items) =>
                  block.type === "timeline"
                    ? update(i, { steps: items })
                    : update(i, { items })
                }
              />
            )}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {BLOCK_TYPES.map((t) => (
          <Button
            key={t.value}
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-full text-xs"
            onClick={() => onChange([...value, newBlock(t.value)])}
          >
            <Plus className="size-3" /> {t.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

/** Small stat card used on the dashboard. */
export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
      <p className="text-[10px] font-bold tracking-[0.16em] text-ink-soft uppercase dark:text-slate-400">
        {label}
      </p>
      <p className="font-serif mt-2 text-3xl text-navy dark:text-slate-50">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-ink-soft dark:text-slate-400">{hint}</p>}
    </div>
  );
}
