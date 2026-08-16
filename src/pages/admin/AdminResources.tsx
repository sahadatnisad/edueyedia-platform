import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useResourceCategories } from "@/hooks/use-content";
import {
  Copy,
  FilePlus2,
  FileText,
  HardDrive,
  Pencil,
  Trash2,
  UploadCloud,
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
  const setStatus = useMutation(api.admin.setResourceStatus);
  const duplicate = useMutation(api.admin.duplicateResource);
  const remove = useMutation(api.admin.deleteResource);
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState<string | null>(null);


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
  const getUploadUrl = useMutation(api.files.getUploadUrl);
  const attachFile = useMutation(api.files.attachResourceFile);
  const removeFile = useMutation(api.files.removeResourceFile);
  const files = useQuery(
    api.files.listResourceFiles,
    existing?.slug ? { resourceId: existing.slug } : "skip",
  );
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeFile = (files ?? []).find(
    (f) => f.kind === "main" && f.status === "active",
  );

  // Hydrate the form when the fetched record arrives — "adjust state when a
  // value changes" pattern (guarded by a previous-value comparison).
  const [prevExisting, setPrevExisting] = useState(existing);
  if (existing !== prevExisting) {
    setPrevExisting(existing);
    if (existing && id !== "new") {
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
    }
  }

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
      // Publish guard: any published downloadable resource must have a real
      // file attached (the server enforces this too) — never sell or promise
      // a download that cannot be delivered.
      if (form.status === "published" && !activeFile) {
        toast.error(
          form.isFree
            ? "Attach the PDF before publishing — a free resource still delivers a real file."
            : "Attach a PDF file before publishing a paid resource.",
        );
        return;
      }

      const savedId = await save({
        id: id && id !== "new" ? (id as never) : undefined,
        data: data as never,
      });
      toast.success("Resource saved");
      // Stay on the editor so files can be attached/replaced.
      navigate(`/admin/resources/${savedId}`, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!existing?.slug) {
      toast.error("Save the resource first, then attach its file.");
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      toast.error("File is larger than the 200 MB limit.");
      return;
    }
    if (file.type && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }
    setUploading(true);
    try {
      const uploadUrl = await getUploadUrl();
      const storageId = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/pdf" },
        body: file,
      }).then((r) => {
        if (!r.ok) throw new Error(`Upload failed (${r.status})`);
        return r.text();
      });
      await attachFile({
        resourceId: existing.slug,
        storageId: storageId as never,
        filename: file.name || "resource.pdf",
        mimeType: "application/pdf",
        fileSize: file.size,
        kind: "main",
      });
      toast.success("PDF attached", {
        description: file.name,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <EditorShell
      title={id === "new" ? "New resource" : "Edit resource"}
      backTo="/admin/resources"
      onSave={handleSave}
      saving={saving}
    >
      {/* Publish readiness checklist — a compact pre-launch indicator. */}
      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <h2 className="font-serif text-lg text-navy dark:text-slate-100">
          Publish readiness
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(
            [
              {
                label: "File attached",
                ok: Boolean(activeFile),
                note: activeFile ? activeFile.filename : "None yet",
              },
              {
                label: "Price configured",
                ok: form.isFree || (Number(form.price) || 0) > 0,
                note: form.isFree ? "Free" : `৳${Number(form.price) || 0}`,
              },
              {
                label: "SEO title + description",
                ok: Boolean(form.seoTitle.trim() && form.metaDescription.trim()),
                note: form.seoTitle.trim() ? "Set" : "Missing",
              },
              {
                label: "Status",
                ok: form.status === "published",
                note: form.status,
              },
            ] as const
          ).map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-2 rounded-xl bg-cool/50 px-3 py-2 text-xs dark:bg-white/[0.03]"
            >
              <span className="flex items-center gap-2 font-medium text-navy dark:text-slate-200">
                <span
                  className={`flex size-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    item.ok
                      ? "bg-teal/15 text-teal dark:text-teal-bright"
                      : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                  }`}
                >
                  {item.ok ? "✓" : "·"}
                </span>
                {item.label}
              </span>
              <span className="max-w-32 truncate text-[10px] text-ink-soft dark:text-slate-400">
                {item.note}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-ink-soft dark:text-slate-400">
          Seed/demo records are never production-ready just because they were
          seeded — move them to Draft until real files and content replace them.
        </p>
      </div>

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
        <h2 className="flex items-center gap-2 font-serif text-lg text-navy dark:text-slate-100">
          <HardDrive className="size-4 text-teal" /> File (private PDF)
        </h2>
        <p className="mt-1 text-xs text-ink-soft dark:text-slate-400">
          Files are stored in private Convex storage — never in public/. Customers
          download through the verified, expiring download flow only.
        </p>

        {!existing && (
          <p className="mt-3 rounded-2xl bg-gold/10 px-4 py-3 text-xs text-[#8a681f] dark:text-gold">
            Save the resource first to attach its PDF file.
          </p>
        )}

        {existing && (
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => void handleUpload(e.target.files?.[0])}
              />
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-full"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="size-3.5" />
                {uploading ? "Uploading…" : activeFile ? "Replace PDF" : "Upload PDF"}
              </Button>
              {activeFile && (
                <span className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1 text-[11px] font-semibold text-teal dark:text-teal-bright">
                  <FileText className="size-3.5" />
                  {activeFile.filename} · {(activeFile.fileSize / 1024 / 1024).toFixed(1)} MB
                </span>
              )}
              {activeFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full text-destructive hover:text-destructive"
                  onClick={async () => {
                    try {
                      await removeFile({ id: activeFile._id as never });
                      toast.success("File removed");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Failed");
                    }
                  }}
                >
                  <Trash2 className="size-3.5" /> Remove
                </Button>
              )}
              {!activeFile && (
                <span className="text-[11px] font-semibold text-gold">
                  Required before publishing{form.isFree ? "" : " a paid"} resource.
                </span>
              )}
            </div>

            {(files ?? []).length > 0 && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-hairline dark:border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cool/60 text-[10px] uppercase text-ink-soft dark:bg-white/[0.03] dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">File</th>
                      <th className="px-4 py-2.5 font-semibold">Status</th>
                      <th className="px-4 py-2.5 font-semibold">Version</th>
                      <th className="px-4 py-2.5 font-semibold">Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline dark:divide-white/5">
                    {[...(files ?? [])].reverse().map((f) => (
                      <tr key={f._id as string} className="text-ink-soft dark:text-slate-400">
                        <td className="px-4 py-2.5 font-medium text-navy dark:text-slate-200">
                          {f.filename}
                        </td>
                        <td className="px-4 py-2.5">{f.status}</td>
                        <td className="px-4 py-2.5">v{f.version}</td>
                        <td className="px-4 py-2.5">
                          {(f.fileSize / 1024 / 1024).toFixed(1)} MB
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
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
