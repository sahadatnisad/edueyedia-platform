import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useResourceCategories } from "@/hooks/use-content";
import {
  Copy,
  FilePlus2,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CoverFields,
  EditorShell,
  Field,
  ListEditor,
  SimpleSelect,
  StatusSelect,
  TextArea,
  TextInput,
} from "@/components/admin/AdminUI";

const STATUS_BADGE: Record<string, string> = {
  draft: "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400",
  published: "bg-teal/10 text-teal dark:text-teal-bright",
  "coming-soon": "bg-gold/15 text-[#8a681f] dark:text-gold",
  archived: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function AdminResources() {
  const list = useQuery(api.admin.listResourcesAdmin);
  const categories = useResourceCategories();
  const setStatus = useMutation(api.admin.setResourceStatus);
  const duplicate = useMutation(api.admin.duplicateResource);
  const remove = useMutation(api.admin.deleteResource);
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState<string | null>(null);

  const catName = useMemo(
    () => new Map((categories ?? []).map((c) => [c.slug, c.name])),
    [categories],
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy dark:text-slate-50">Resources</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
            {list?.length ?? 0} resources in the database.
          </p>
        </div>
        <Button className="h-9 rounded-full" asChild>
          <Link to="/admin/resources/new">
            <FilePlus2 className="size-3.5" /> New resource
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-hairline bg-white dark:border-white/10 dark:bg-navy-surface">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase">Title</TableHead>
              <TableHead className="text-[10px] uppercase">Category</TableHead>
              <TableHead className="text-[10px] uppercase">Price</TableHead>
              <TableHead className="text-[10px] uppercase">Status</TableHead>
              <TableHead className="text-[10px] uppercase">Featured</TableHead>
              <TableHead className="text-right text-[10px] uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!list && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-ink-soft">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {list?.map((r) => (
              <TableRow key={r._id} className="text-xs">
                <TableCell>
                  <Link
                    to={`/admin/resources/${r._id}`}
                    className="font-medium text-navy hover:text-teal dark:text-slate-100 dark:hover:text-teal-bright"
                  >
                    {r.title}
                  </Link>
                  <p className="text-[10px] text-ink-soft dark:text-slate-400">{r.slug}</p>
                </TableCell>
                <TableCell className="text-ink-soft dark:text-slate-400">
                  {r.category}
                </TableCell>
                <TableCell>{r.isFree ? "Free" : `৳${r.price}`}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGE[r.status] ?? ""}`}>
                    {r.status}
                  </span>
                </TableCell>
                <TableCell>{r.featured ? "★" : "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0"
                      title="Edit"
                    >
                      <Link to={`/admin/resources/${r._id}`}>
                        <Pencil className="size-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0"
                      title="Duplicate as draft"
                      disabled={busyId === r._id}
                      onClick={async () => {
                        setBusyId(r._id);
                        try {
                          const id = await duplicate({ id: r._id });
                          toast.success("Duplicated as draft");
                          navigate(`/admin/resources/${id}`);
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Failed");
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 text-destructive hover:text-destructive"
                      title="Delete"
                      onClick={async () => {
                        if (!confirm(`Delete "${r.title}"?`)) return;
                        try {
                          await remove({ id: r._id });
                          toast.success("Deleted");
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Failed");
                        }
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full px-2 text-[10px]"
                      title="Change status"
                      onClick={async () => {
                        const next =
                          r.status === "published"
                            ? "draft"
                            : r.status === "draft"
                              ? "published"
                              : "draft";
                        try {
                          await setStatus({ id: r._id, status: next });
                          toast.success(`Status → ${next}`);
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Failed");
                        }
                      }}
                    >
                      {r.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-ink-soft dark:text-slate-400">
        <FileText className="size-3.5" /> Categories are seeded from the resource library —
        Scholarships and Study Abroad remain categories here, not top-level pages.
      </p>
    </div>
  );
}

/* ------------------------------ editor ------------------------------ */

const TYPES = ["PDF", "Template", "Checklist", "Guide", "Bundle"];

interface FormState {
  title: string;
  titleBn: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  tags: string[];
  type: string;
  price: string;
  compareAt: string;
  currency: string;
  isFree: boolean;
  format: string;
  language: string;
  pageCount: string;
  coverTone: string;
  coverPattern: string;
  coverGlyph: string;
  includes: string[];
  audience: string[];
  related: string[];
  faqs: string[];
  previewPages: string[];
  status: string;
  featured: boolean;
  popular: boolean;
  bestseller: boolean;
  seoTitle: string;
  metaDescription: string;
}

const EMPTY: FormState = {
  title: "",
  titleBn: "",
  shortDescription: "",
  description: "",
  categoryId: "research",
  tags: [],
  type: "PDF",
  price: "0",
  compareAt: "",
  currency: "BDT",
  isFree: true,
  format: "PDF",
  language: "বাংলা + English",
  pageCount: "0",
  coverTone: "navy",
  coverPattern: "grid",
  coverGlyph: "",
  includes: [],
  audience: [],
  related: [],
  faqs: [],
  previewPages: [],
  status: "draft",
  featured: false,
  popular: false,
  bestseller: false,
  seoTitle: "",
  metaDescription: "",
};

const faqLines = (faqs: { q: string; a: string }[]) =>
  faqs.map((f) => `${f.q} | ${f.a}`);
const parseFaqs = (lines: string[]) =>
  lines
    .map((line) => {
      const [q = "", ...rest] = line.split("|");
      return { q: q.trim(), a: rest.join("|").trim() };
    })
    .filter((f) => f.q);

const previewLines = (pages: { label: string; lines: string[] }[]) =>
  pages.map((p) => `${p.label} | ${p.lines.join("; ")}`);
const parsePreviews = (lines: string[]) =>
  lines
    .map((line) => {
      const [label = "", ...rest] = line.split("|");
      return {
        label: label.trim(),
        lines: rest
          .join("|")
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean),
      };
    })
    .filter((p) => p.label);

export function AdminResourceEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined || id === "new";
  const existing = useQuery(
    api.admin.getResourceAdmin,
    isNew ? ("skip" as never) : { id: id as never },
  );
  const categories = useResourceCategories();
  const save = useMutation(api.admin.upsertResource);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing || id === "new") return;
    const r = existing;
    setForm({
      title: r.title ?? "",
      titleBn: r.titleBn ?? "",
      shortDescription: r.shortDescription ?? "",
      description: r.description ?? "",
      categoryId: r.categoryId ?? "research",
      tags: r.tags ?? [],
      type: r.type,
      price: String(r.price ?? 0),
      compareAt: r.compareAt != null ? String(r.compareAt) : "",
      currency: r.currency ?? "BDT",
      isFree: r.isFree,
      format: r.format ?? "",
      language: r.language ?? "",
      pageCount: String(r.pageCount ?? 0),
      coverTone: r.coverTone,
      coverPattern: r.coverPattern,
      coverGlyph: r.coverGlyph ?? "",
      includes: r.includes ?? [],
      audience: r.audience ?? [],
      related: r.related ?? [],
      faqs: faqLines(r.faqs ?? []),
      previewPages: previewLines(r.previewPages ?? []),
      status: r.status,
      featured: r.featured,
      popular: r.popular,
      bestseller: r.bestseller,
      seoTitle: r.seoTitle ?? "",
      metaDescription: r.metaDescription ?? "",
    });
  }, [existing, id]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        title: form.title,
        titleBn: form.titleBn || undefined,
        shortDescription: form.shortDescription,
        description: form.description,
        categoryId: form.categoryId,
        tags: form.tags,
        type: form.type as never,
        price: Number(form.price) || 0,
        compareAt: form.compareAt ? Number(form.compareAt) : undefined,
        currency: form.currency,
        isFree: form.isFree,
        format: form.format,
        language: form.language,
        pageCount: Number(form.pageCount) || 0,
        coverTone: form.coverTone as never,
        coverPattern: form.coverPattern as never,
        coverGlyph: form.coverGlyph || undefined,
        includes: form.includes,
        audience: form.audience,
        previewPages: parsePreviews(form.previewPages),
        faqs: parseFaqs(form.faqs),
        related: form.related,
        status: form.status as never,
        featured: form.featured,
        popular: form.popular,
        bestseller: form.bestseller,
        seoTitle: form.seoTitle || undefined,
        metaDescription: form.metaDescription || undefined,
      };
      const savedId = await save({
        id: id && id !== "new" ? (id as never) : undefined,
        data: data as never,
      });
      toast.success("Resource saved");
      navigate("/admin/resources");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorShell
      title={id === "new" ? "New resource" : "Edit resource"}
      backTo="/admin/resources"
      onSave={handleSave}
      saving={saving}
    >
      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title (English)" hint="The slug is generated from this title.">
            <TextInput value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Title (Bangla)">
            <TextInput value={form.titleBn} onChange={(e) => set("titleBn", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Category">
            <SimpleSelect
              value={form.categoryId}
              onChange={(v) => set("categoryId", v)}
              options={(categories ?? []).map((c) => ({ value: c.slug, label: c.name }))}
            />
          </Field>
          <Field label="Type">
            <SimpleSelect
              value={form.type}
              onChange={(v) => set("type", v)}
              options={TYPES.map((t) => ({ value: t, label: t }))}
            />
          </Field>
          <Field label="Status">
            <StatusSelect value={form.status} onChange={(v) => set("status", v)} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Short summary">
            <TextArea
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              className="min-h-20"
            />
          </Field>
          <Field label="Full description">
            <TextArea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="min-h-20"
            />
          </Field>
        </div>
      </div>

      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <h2 className="font-serif text-lg text-navy dark:text-slate-100">Pricing & details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Field label="Price (৳)">
            <TextInput
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </Field>
          <Field label="Compare-at (৳)">
            <TextInput
              type="number"
              value={form.compareAt}
              onChange={(e) => set("compareAt", e.target.value)}
            />
          </Field>
          <Field label="Pages">
            <TextInput
              type="number"
              value={form.pageCount}
              onChange={(e) => set("pageCount", e.target.value)}
            />
          </Field>
          <Field label="Currency">
            <TextInput value={form.currency} onChange={(e) => set("currency", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Format">
            <TextInput value={form.format} onChange={(e) => set("format", e.target.value)} />
          </Field>
          <Field label="Language">
            <TextInput value={form.language} onChange={(e) => set("language", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          {(
            [
              ["isFree", "Free resource", "Free downloads unlock on sign-in."],
              ["featured", "Featured", "Shown on the homepage."],
              ["popular", "Popular", "Curated shelf placement."],
              ["bestseller", "Bestseller", "Shown on the product page."],
            ] as const
          ).map(([key, label, hint]) => (
            <label key={key} className="flex items-center gap-2.5 text-sm text-navy dark:text-slate-200">
              <Switch
                checked={form[key]}
                onCheckedChange={(c) => set(key, c === true)}
              />
              <span>
                {label}
                <span className="block text-[11px] font-normal text-ink-soft dark:text-slate-400">
                  {hint}
                </span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-5">
          <CoverFields
            tone={form.coverTone}
            pattern={form.coverPattern}
            glyph={form.coverGlyph}
            onChange={(p) => {
              set("coverTone", p.tone);
              set("coverPattern", p.pattern);
              set("coverGlyph", p.glyph ?? "");
            }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <h2 className="font-serif text-lg text-navy dark:text-slate-100">Content</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Tags">
            <ListEditor value={form.tags} onChange={(v) => set("tags", v)} />
          </Field>
          <Field label="What's included">
            <ListEditor value={form.includes} onChange={(v) => set("includes", v)} />
          </Field>
          <Field label="Audience">
            <ListEditor value={form.audience} onChange={(v) => set("audience", v)} />
          </Field>
          <Field label="Related resources (slugs)">
            <ListEditor value={form.related} onChange={(v) => set("related", v)} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Preview pages" hint="Format per line: Label | line1; line2; line3">
            <ListEditor value={form.previewPages} onChange={(v) => set("previewPages", v)} />
          </Field>
          <Field label="FAQs" hint="Format per line: Question | Answer">
            <ListEditor value={form.faqs} onChange={(v) => set("faqs", v)} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="SEO title">
            <TextInput value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
          </Field>
          <Field label="Meta description">
            <TextInput
              value={form.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
            />
          </Field>
        </div>
      </div>
    </EditorShell>
  );
}
