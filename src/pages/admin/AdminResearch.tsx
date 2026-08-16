import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { RESEARCH_TOPICS, type ResearchContentType } from "@/data/catalog";
import { FlaskConical, Pencil, Plus, Trash2 } from "lucide-react";
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
  BlockEditor,
  EditorShell,
  Field,
  ListEditor,
  SimpleSelect,
  StatusSelect,
  TextArea,
  TextInput,
  type Block,
} from "@/components/admin/AdminUI";

const STATUS_BADGE: Record<string, string> = {
  draft: "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400",
  published: "bg-teal/10 text-teal dark:text-teal-bright",
  "coming-soon": "bg-gold/15 text-[#8a681f] dark:text-gold",
  archived: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function AdminResearch() {
  const list = useQuery(api.admin.listResearchAdmin);
  const setStatus = useMutation(api.admin.setResearchStatus);
  const remove = useMutation(api.admin.deleteResearchArticle);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy dark:text-slate-50">Research articles</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
            {list?.length ?? 0} articles — the Research hub.
          </p>
        </div>
        <Button className="h-9 rounded-full" asChild>
          <Link to="/admin/research/new">
            <Plus className="size-3.5" /> New article
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-hairline bg-white dark:border-white/10 dark:bg-navy-surface">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase">Title</TableHead>
              <TableHead className="text-[10px] uppercase">Type</TableHead>
              <TableHead className="text-[10px] uppercase">Status</TableHead>
              <TableHead className="text-right text-[10px] uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!list && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-ink-soft">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {list?.map((r) => (
              <TableRow key={r._id} className="text-xs">
                <TableCell>
                  <Link
                    to={`/admin/research/${r._id}`}
                    className="font-medium text-navy hover:text-teal dark:text-slate-100 dark:hover:text-teal-bright"
                  >
                    {r.title}
                  </Link>
                  <p className="text-[10px] text-ink-soft dark:text-slate-400">{r.slug}</p>
                </TableCell>
                <TableCell className="text-ink-soft dark:text-slate-400">
                  {r.contentType ?? "—"}
                </TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGE[r.status] ?? ""}`}>
                    {r.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <Link to={`/admin/research/${r._id}`}>
                        <Pencil className="size-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full px-2 text-[10px]"
                      onClick={async () => {
                        const next = r.status === "published" ? "draft" : "published";
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 text-destructive hover:text-destructive"
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ------------------------------ editor ------------------------------ */

interface FormState {
  title: string;
  titleBn: string;
  excerpt: string;
  contentType: string;
  tags: string[];
  featured: boolean;
  readingTime: string;
  blocks: Block[];
  relatedResources: string[];
  relatedCourses: string[];
  references: string[];
  doiLinks: string[];
  externalSources: string[];
  status: string;
  seoTitle: string;
  metaDescription: string;
}

const EMPTY: FormState = {
  title: "",
  titleBn: "",
  excerpt: "",
  contentType: "research-guide",
  tags: [],
  featured: false,
  readingTime: "5 min read",
  blocks: [{ type: "p", text: "" }],
  relatedResources: [],
  relatedCourses: [],
  references: [],
  doiLinks: [],
  externalSources: [],
  status: "draft",
  seoTitle: "",
  metaDescription: "",
};

export function AdminResearchEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined || id === "new";
  const existing = useQuery(
    api.admin.getResearchAdmin,
    isNew ? ("skip" as never) : { id: id as never },
  );
  const save = useMutation(api.admin.upsertResearchArticle);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing || id === "new") return;
    const r = existing;
    setForm({
      title: r.title ?? "",
      titleBn: r.titleBn ?? "",
      excerpt: r.excerpt ?? "",
      contentType: r.contentType ?? "research-guide",
      tags: r.tags ?? [],
      featured: r.featured,
      readingTime: r.readingTime ?? "5 min read",
      blocks: (r.blocks ?? []) as Block[],
      relatedResources: r.relatedResources ?? [],
      relatedCourses: r.relatedCourses ?? [],
      references: r.references ?? [],
      doiLinks: r.doiLinks ?? [],
      externalSources: r.externalSources ?? [],
      status: r.status,
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
        excerpt: form.excerpt,
        contentType: form.contentType as ResearchContentType,
        tags: form.tags,
        featured: form.featured,
        readingTime: form.readingTime,
        blocks: form.blocks,
        relatedResources: form.relatedResources,
        relatedCourses: form.relatedCourses,
        references: form.references,
        doiLinks: form.doiLinks,
        externalSources: form.externalSources,
        status: form.status as never,
        seoTitle: form.seoTitle || undefined,
        metaDescription: form.metaDescription || undefined,
      };
      await save({
        id: id && id !== "new" ? (id as never) : undefined,
        data: data as never,
      });
      toast.success("Article saved");
      navigate("/admin/research");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorShell
      title={id === "new" ? "New research article" : "Edit research article"}
      backTo="/admin/research"
      onSave={handleSave}
      saving={saving}
    >
      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title (English)">
            <TextInput value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Title (Bangla)">
            <TextInput value={form.titleBn} onChange={(e) => set("titleBn", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Research type">
            <SimpleSelect
              value={form.contentType}
              onChange={(v) => set("contentType", v)}
              options={RESEARCH_TOPICS.map((t) => ({ value: t.id, label: t.label }))}
            />
          </Field>
          <Field label="Reading time">
            <TextInput value={form.readingTime} onChange={(e) => set("readingTime", e.target.value)} />
          </Field>
          <Field label="Status">
            <StatusSelect value={form.status} onChange={(v) => set("status", v)} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Excerpt / summary">
            <TextArea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              className="min-h-20"
            />
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-2.5 text-sm text-navy dark:text-slate-200">
          <Switch
            checked={form.featured}
            onCheckedChange={(c) => set("featured", c === true)}
          />
          Featured — shown on the homepage research selection.
        </div>
      </div>

      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <h2 className="font-serif text-lg text-navy dark:text-slate-100">Body</h2>
        <p className="mt-1 text-[11px] text-ink-soft dark:text-slate-400">
          Structured blocks — no raw HTML is stored. Headings get an anchor id used by the TOC.
        </p>
        <div className="mt-4">
          <BlockEditor value={form.blocks} onChange={(b) => set("blocks", b)} />
        </div>
      </div>

      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <h2 className="font-serif text-lg text-navy dark:text-slate-100">References & links</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="References" hint="One per line">
            <ListEditor value={form.references} onChange={(v) => set("references", v)} />
          </Field>
          <Field label="DOI links" hint="One per line">
            <ListEditor value={form.doiLinks} onChange={(v) => set("doiLinks", v)} />
          </Field>
          <Field label="External sources" hint="One URL per line">
            <ListEditor value={form.externalSources} onChange={(v) => set("externalSources", v)} />
          </Field>
          <Field label="Tags">
            <ListEditor value={form.tags} onChange={(v) => set("tags", v)} />
          </Field>
          <Field label="Related resources (slugs)">
            <ListEditor value={form.relatedResources} onChange={(v) => set("relatedResources", v)} />
          </Field>
          <Field label="Related courses (slugs)">
            <ListEditor value={form.relatedCourses} onChange={(v) => set("relatedCourses", v)} />
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
