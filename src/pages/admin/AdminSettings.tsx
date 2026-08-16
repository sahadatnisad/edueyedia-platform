import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Database, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/AdminUI";

/**
 * JSON site settings — the data behind the homepage's Scholarship
 * Discovery and Collections sections. Each card edits one key; the value
 * is validated as JSON before it is written to Convex.
 */
const SETTINGS = [
  {
    key: "scholarships",
    title: "Scholarships",
    description:
      "Array of scholarship entries shown on the homepage. Keep `deadline` empty (\") — visitors are told to verify dates on the official program page.",
    example: `[
  {
    "slug": "daad-germany",
    "country": "Germany",
    "region": "Europe",
    "name": "DAAD Scholarship",
    "degree": "Masters",
    "funding": "Full tuition + stipend",
    "fullyFunded": true,
    "deadline": ""
  }
]`,
  },
  {
    key: "collections",
    title: "Collections",
    description:
      "Array of curated collections. Each references resource slugs that must exist in the published catalog.",
    example: `[
  {
    "slug": "research-starter",
    "index": "01",
    "title": "Research Starter",
    "titleBn": "গবেষণা শুরুর পথ",
    "description": "From your first research question to a finished proposal.",
    "cover": { "tone": "navy", "pattern": "nodes", "glyph": "R" },
    "resourceSlugs": ["research-proposal-master-guide"]
  }
]`,
  },
] as const;

const SETTING_KEYS: string[] = SETTINGS.map((s) => s.key);

export default function AdminSettings() {
  const settings = useQuery(api.admin.listSiteSettings);
  const save = useMutation(api.admin.updateSiteSetting);

  // Key → latest JSON from the DB.
  const byKey = useMemo(() => {
    const map = new Map<string, unknown>();
    for (const row of settings ?? []) map.set(row.key, row.value);
    return map;
  }, [settings]);

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  // Hydrate the editors from the DB once it loads — "adjust state when a
  // value changes" pattern (guarded by a previous-value comparison).
  const [prevSettings, setPrevSettings] = useState(settings);
  if (settings !== prevSettings) {
    setPrevSettings(settings);
    if (settings) {
      setDrafts((prev) => {
        const next = { ...prev };
        for (const row of settings) {
          if (next[row.key] === undefined) {
            next[row.key] = JSON.stringify(row.value, null, 2);
          }
        }
        return next;
      });
    }
  }

  const isJsonValid = (key: string) => {
    try {
      JSON.parse(drafts[key] ?? "");
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async (key: string) => {
    const raw = drafts[key] ?? "";
    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch {
      setErrors((e) => ({ ...e, [key]: "Invalid JSON — check for missing commas or quotes." }));
      return;
    }
    if (Array.isArray(value) && value.length === 0) {
      // Empty arrays are allowed (honest empty state), but confirm intent.
      if (!confirm(`Save an empty array for "${key}"?`)) return;
    }
    setSaving(key);
    try {
      await save({ key, value: value as never });
      setDrafts((d) => ({ ...d, [key]: JSON.stringify(value, null, 2) }));
      setErrors((e) => ({ ...e, [key]: "" }));
      toast.success("Setting saved", { description: key });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  const keys = useMemo(() => {
    const extra = (settings ?? [])
      .map((s) => s.key)
      .filter((k) => !SETTING_KEYS.includes(k));
    return [...SETTING_KEYS, ...extra];
  }, [settings]);

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl text-navy dark:text-slate-50">Site settings</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
          JSON values behind the homepage sections — saved straight to Convex.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {keys.map((key) => {
          const hasValue = byKey.has(key);
          const invalid = !isJsonValid(key) && (drafts[key] ?? "").trim() !== "";
          const config = SETTINGS.find((s) => s.key === key);
          const updatedAt =
            settings?.find((s) => s.key === key)?.updatedAt ?? 0;
          return (
            <div
              key={key}
              className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif text-xl text-navy dark:text-slate-50">
                    {config?.title ?? key}
                  </h2>
                  <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-ink-soft dark:text-slate-400">
                    {config?.description ?? "Custom JSON site setting."}
                  </p>
                </div>
                {!hasValue && (
                  <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-[#8a681f] uppercase dark:text-gold">
                    Not set yet
                  </span>
                )}
              </div>

              <div className="mt-4">
                <Field
                  label={`JSON — ${key}`}
                  hint={invalid ? undefined : "Must parse as valid JSON before saving."}
                >
                  <TextArea
                    value={drafts[key] ?? ""}
                    onChange={(e) => {
                      setDrafts((d) => ({ ...d, [key]: e.target.value }));
                      if (errors[key]) setErrors((err) => ({ ...err, [key]: "" }));
                    }}
                    placeholder={config?.example ?? "[]"}
                    className={cn(
                      "min-h-48 font-mono text-[13px] leading-relaxed",
                      invalid &&
                        "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/30",
                    )}
                  />
                </Field>
                {errors[key] && (
                  <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                    {errors[key]}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="flex items-center gap-1.5 text-[11px] text-ink-soft dark:text-slate-400">
                  <Database className="size-3.5 text-teal" />
                  {hasValue
                    ? `Updated ${new Date(updatedAt).toLocaleString()}`
                    : "Seeded by the legacy catalog migration on first run."}
                </p>
                <Button
                  size="sm"
                  className="h-9 rounded-full"
                  disabled={saving !== null || invalid}
                  onClick={() => handleSave(key)}
                >
                  <Save className="size-3.5" />
                  {saving === key ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-[11px] text-ink-soft dark:text-slate-400">
        Changes are live immediately on the public site. Only admins can write
        site settings — the mutation re-verifies the role server-side.
      </p>
    </div>
  );
}
