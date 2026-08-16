import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Pencil, Plus, Trash2 } from "lucide-react";
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

const BLOG_CATEGORIES = [
  { value: "scholarships", label: "Scholarships" },
  { value: "study-abroad", label: "Study Abroad" },
  { value: "career", label: "Career" },
  { value: "academic-writing", label: "Academic Writing" },
  { value: "university", label: "University" },
  { value: "student-skills", label: "Student Skills" },
  { value: "applications", label: "Applications" },
  { value: "opportunities", label: "Opportunities" },
  { value: "guides", label: "Guides" },
];

export default function AdminBlog() {
  const list = useQuery(api.admin.listBlogAdmin);
  const setStatus = useMutation(api.admin.setBlogStatus);
  const remove = useMutation(api.admin.deleteBlogPost);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy dark:text-slate-50">Blog posts</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
            {list?.length ?? 0} posts — the journal.
          </p>
        </div>
        <Button className="h-9 rounded-full" asChild>
          <Link to="/admin/blog/new">
            <Plus className="size-3.5" /> New post
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-hairline bg-white dark:border-white/10 dark:bg-navy-surface">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase">Title</TableHead>
              <TableHead className="text-[10px] uppercase">Category</TableHead>
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
                    to={`/admin/blog/${r._id}`}
                    className="font-medium text-navy hover:text-teal dark:text-slate-100 dark:hover:text-teal-bright"
                  >
                    {r.title}
                  </Link>
                  <p className="text-[10px] text-ink-soft dark:text-slate-400">{r.slug}</p>
                </TableCell>
                <TableCell className="text-ink-soft dark:text-slate-400">{r.category}</TableCell>
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
                      <Link to={`/admin/blog/${r._id}`}>
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
  category: string;
  categoryLabel: string;
  authorId: string;
  tags: string[];
  featured: boolean;
  readingTime: string;
  blocks: Block[];
  relatedResources: string[];
  relatedCourses: string[];
  status: string;
  seoTitle: string;
  metaDescription: string;
}

const EMPTY: FormState = {
  title: "",
  titleBn: "",
  excerpt: "",
  category: "guides",
  categoryLabel: "Guides",
  authorId: "",
  tags: [],
  featured: false,
  readingTime: "5 min read",
  blocks: [{ type: "p", text: "" }],
  relatedResources: [],
  relatedCourses: [],
  status: "draft",
  seoTitle: "",
  metaDescription: "",
};

export function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined || id === "new";
  const existing = useQuery(
    api.admin.getBlogAdmin,
    isNew ? ("skip" as never) : { id: id as never },
  );
  const save = useMutation(api.admin.upsertBlogPost);
  const authors = useQuery(api.admin.listAuthorsAdmin);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

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
        excerpt: r.excerpt ?? "",
        category: r.category ?? "guides",
        categoryLabel: r.categoryLabel ?? "Guides",
        authorId: r.authorId ?? "",
        tags: r.tags ?? [],
        featured: r.featured,
        readingTime: r.readingTime ?? "5 min read",
        blocks: (r.blocks ?? []) as Block[],
        relatedResources: r.relatedResources ?? [],
        relatedCourses: r.relatedCourses ?? [],
        status: r.status,
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
        excerpt: form.excerpt,
        category: form.category,
        categoryLabel: form.categoryLabel,
        authorId: form.authorId || undefined,
        tags: form.tags,
        featured: form.featured,
        readingTime: form.readingTime,
        blocks: form.blocks,
        relatedResources: form.relatedResources,
        relatedCourses: form.relatedCourses,
        status: form.status as never,
        seoTitle: form.seoTitle || undefined,
        metaDescription: form.metaDescription || undefined,
      };
      await save({
        id: id && id !== "new" ? (id as never) : undefined,
        data: data as never,
      });
      toast.success("Post saved");
      navigate("/admin/blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const categoryLabel = BLOG_CATEGORIES.find((c) => c.value === form.category)?.label;

  return (
    <EditorShell
      title={id === "new" ? "New blog post" : "Edit blog post"}
      backTo="/admin/blog"
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
          <Field label="Category">
            <SimpleSelect
              value={form.category}
              onChange={(v) => {
                set("category", v);
                set("categoryLabel", BLOG_CATEGORIES.find((c) => c.value === v)?.label ?? v);
              }}
              options={BLOG_CATEGORIES}
            />
          </Field>
          <Field label="Author">
            <SimpleSelect
              value={form.authorId}
              onChange={(v) => set("authorId", v)}
              placeholder="Editorial desk (default)"
              options={[
                { value: "", label: "Editorial desk (default)" },
                ...(authors ?? []).map((a) => ({
                  value: a._id,
                  label: `${a.name}${a.role ? ` — ${a.role}` : ""}`,
                })),
              ]}
            />
          </Field>
          <Field label="Display label">
            <TextInput
              value={form.categoryLabel}
              onChange={(e) => set("categoryLabel", e.target.value)}
              placeholder={categoryLabel ?? "Guides"}
            />
          </Field>
          <Field label="Reading time">
            <TextInput value={form.readingTime} onChange={(e) => set("readingTime", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <StatusSelect value={form.status} onChange={(v) => set("status", v)} />
          </Field>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2.5 text-sm text-navy dark:text-slate-200">
              <Switch
                checked={form.featured}
                onCheckedChange={(c) => set("featured", c === true)}
              />
              Featured — shown on the homepage blog selection.
            </label>
          </div>
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
      </div>

      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <h2 className="font-serif text-lg text-navy dark:text-slate-100">Body</h2>
        <p className="mt-1 text-[11px] text-ink-soft dark:text-slate-400">
          Structured blocks — no raw HTML is stored.
        </p>
        <div className="mt-4">
          <BlockEditor value={form.blocks} onChange={(b) => set("blocks", b)} />
        </div>
      </div>

      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <h2 className="font-serif text-lg text-navy dark:text-slate-100">Related & SEO</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Tags">
            <ListEditor value={form.tags} onChange={(v) => set("tags", v)} />
          </Field>
          <Field label="Related resources (slugs)">
            <ListEditor value={form.relatedResources} onChange={(v) => set("relatedResources", v)} />
          </Field>
          <Field label="Related courses (slugs)">
            <ListEditor value={form.relatedCourses} onChange={(v) => set("relatedCourses", v)} />
          </Field>
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
