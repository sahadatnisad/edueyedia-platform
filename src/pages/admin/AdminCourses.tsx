import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";
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

export default function AdminCourses() {
  const list = useQuery(api.admin.listCoursesAdmin);
  const setStatus = useMutation(api.admin.setCourseStatus);
  const remove = useMutation(api.admin.deleteCourse);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy dark:text-slate-50">Courses</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
            {list?.length ?? 0} courses — real enrollment counts only.
          </p>
        </div>
        <Button className="h-9 rounded-full" asChild>
          <Link to="/admin/courses/new">
            <Plus className="size-3.5" /> New course
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
              <TableHead className="text-[10px] uppercase">Enrolled</TableHead>
              <TableHead className="text-[10px] uppercase">Status</TableHead>
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
            {list?.map((c) => (
              <TableRow key={c._id} className="text-xs">
                <TableCell>
                  <Link
                    to={`/admin/courses/${c._id}`}
                    className="font-medium text-navy hover:text-teal dark:text-slate-100 dark:hover:text-teal-bright"
                  >
                    {c.title}
                  </Link>
                  <p className="text-[10px] text-ink-soft dark:text-slate-400">{c.slug}</p>
                </TableCell>
                <TableCell className="text-ink-soft dark:text-slate-400">{c.category}</TableCell>
                <TableCell>{c.isFree ? "Free" : `৳${c.price}`}</TableCell>
                <TableCell>{c.enrollments}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGE[c.status] ?? ""}`}>
                    {c.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                      <Link to={`/admin/courses/${c._id}`}>
                        <Pencil className="size-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full px-2 text-[10px]"
                      onClick={async () => {
                        const next =
                          c.status === "published" || c.status === "coming-soon"
                            ? "draft"
                            : "published";
                        try {
                          await setStatus({ id: c._id, status: next });
                          toast.success(`Status → ${next}`);
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Failed");
                        }
                      }}
                    >
                      {c.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 text-destructive hover:text-destructive"
                      onClick={async () => {
                        if (!confirm(`Delete "${c.title}"?`)) return;
                        try {
                          await remove({ id: c._id });
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
  shortDescription: string;
  description: string;
  category: string;
  categoryBn: string;
  level: string;
  duration: string;
  price: string;
  compareAt: string;
  isFree: boolean;
  status: string;
  featured: boolean;
  whatYouLearn: string[];
  audience: string[];
  prerequisites: string[];
  coverTone: string;
  coverPattern: string;
  coverGlyph: string;
  seoTitle: string;
  metaDescription: string;
}

const EMPTY: FormState = {
  title: "",
  titleBn: "",
  shortDescription: "",
  description: "",
  category: "Research",
  categoryBn: "গবেষণা",
  level: "Beginner",
  duration: "4 weeks",
  price: "0",
  compareAt: "",
  isFree: true,
  status: "coming-soon",
  featured: false,
  whatYouLearn: [],
  audience: [],
  prerequisites: [],
  coverTone: "navy",
  coverPattern: "nodes",
  coverGlyph: "",
  seoTitle: "",
  metaDescription: "",
};

interface LessonDraft {
  id?: string;
  title: string;
  lessonType: string;
  content: string;
  isPreview: boolean;
}

interface ModuleDraft {
  id?: string;
  title: string;
  lessons: LessonDraft[];
}

export function AdminCourseEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined || id === "new";
  const existing = useQuery(
    api.admin.getCourseAdmin,
    isNew ? ("skip" as never) : { id: id as never },
  );
  const saveCourse = useMutation(api.admin.upsertCourse);
  const saveModule = useMutation(api.admin.upsertModule);
  const deleteModule = useMutation(api.admin.deleteModule);
  const saveLesson = useMutation(api.admin.upsertLesson);
  const deleteLesson = useMutation(api.admin.deleteLesson);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [modules, setModules] = useState<ModuleDraft[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing || id === "new") return;
    const { course: c, modules: mods } = existing;
    setForm({
      title: c.title ?? "",
      titleBn: c.titleBn ?? "",
      shortDescription: c.shortDescription ?? "",
      description: c.description ?? "",
      category: c.category ?? "",
      categoryBn: c.categoryBn ?? "",
      level: c.level,
      duration: c.duration ?? "",
      price: String(c.price ?? 0),
      compareAt: c.compareAt != null ? String(c.compareAt) : "",
      isFree: c.isFree,
      status: c.status,
      featured: c.featured,
      whatYouLearn: c.whatYouLearn ?? [],
      audience: c.audience ?? [],
      prerequisites: c.prerequisites ?? [],
      coverTone: c.coverTone,
      coverPattern: c.coverPattern,
      coverGlyph: c.coverGlyph ?? "",
      seoTitle: c.seoTitle ?? "",
      metaDescription: c.metaDescription ?? "",
    });
    setModules(
      (mods ?? []).map((m) => ({
        id: m._id,
        title: m.title,
        lessons: m.lessons.map((l) => ({
          id: l._id,
          title: l.title,
          lessonType: l.lessonType,
          content: "",
          isPreview: l.isPreview,
        })),
      })),
    );
  }, [existing, id]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    // Publish guard: never publish a course with no meaningful lesson content.
    const hasRealLesson = modules.some((mod) =>
      mod.lessons.some(
        (l) => l.title.trim().length > 0 && l.content.trim().length > 0,
      ),
    );
    if (form.status === "published" && !hasRealLesson) {
      toast.error(
        "Add at least one lesson with real content before publishing a course.",
      );
      return;
    }
    setSaving(true);
    try {
      const data = {
        title: form.title,
        titleBn: form.titleBn,
        shortDescription: form.shortDescription,
        description: form.description,
        category: form.category,
        categoryBn: form.categoryBn,
        level: form.level as never,
        duration: form.duration,
        price: Number(form.price) || 0,
        compareAt: form.compareAt ? Number(form.compareAt) : undefined,
        isFree: form.isFree,
        status: form.status as never,
        featured: form.featured,
        whatYouLearn: form.whatYouLearn,
        audience: form.audience,
        prerequisites: form.prerequisites,
        coverTone: form.coverTone as never,
        coverPattern: form.coverPattern as never,
        coverGlyph: form.coverGlyph || undefined,
        seoTitle: form.seoTitle || undefined,
        metaDescription: form.metaDescription || undefined,
      };
      const courseId = (await saveCourse({
        id: id && id !== "new" ? (id as never) : undefined,
        data: data as never,
      })) as string;

      // Persist modules/lessons (only for saved courses).
      for (const [mi, mod] of modules.entries()) {
        const moduleId = (await saveModule({
          id: mod.id ? (mod.id as never) : undefined,
          courseId: courseId as never,
          title: mod.title,
          position: mi,
        })) as string;
        for (const [li, lesson] of mod.lessons.entries()) {
          await saveLesson({
            id: lesson.id ? (lesson.id as never) : undefined,
            courseId: courseId as never,
            moduleId: moduleId as never,
            title: lesson.title,
            lessonType: lesson.lessonType as never,
            content: lesson.content || undefined,
            position: li,
            isPreview: lesson.isPreview,
          });
        }
      }

      toast.success("Course saved");
      navigate("/admin/courses");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorShell
      title={id === "new" ? "New course" : "Edit course"}
      backTo="/admin/courses"
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
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Field label="Category">
            <TextInput value={form.category} onChange={(e) => set("category", e.target.value)} />
          </Field>
          <Field label="Category (Bangla)">
            <TextInput value={form.categoryBn} onChange={(e) => set("categoryBn", e.target.value)} />
          </Field>
          <Field label="Level">
            <SimpleSelect
              value={form.level}
              onChange={(v) => set("level", v)}
              options={["Beginner", "Intermediate", "All levels"].map((l) => ({
                value: l,
                label: l,
              }))}
            />
          </Field>
          <Field label="Duration">
            <TextInput value={form.duration} onChange={(e) => set("duration", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Field label="Price (৳)">
            <TextInput type="number" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
          <Field label="Compare-at (৳)">
            <TextInput
              type="number"
              value={form.compareAt}
              onChange={(e) => set("compareAt", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <StatusSelect value={form.status} onChange={(v) => set("status", v)} />
          </Field>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2.5 text-sm text-navy dark:text-slate-200">
              <Switch checked={form.isFree} onCheckedChange={(c) => set("isFree", c === true)} />
              Free course
            </label>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Short description">
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
        <div className="mt-4 flex items-center gap-2.5 text-sm text-navy dark:text-slate-200">
          <Switch checked={form.featured} onCheckedChange={(c) => set("featured", c === true)} />
          Featured — shown on the homepage course selection.
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
        <h2 className="font-serif text-lg text-navy dark:text-slate-100">Learning outcomes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="What you'll learn" hint="One per line">
            <ListEditor value={form.whatYouLearn} onChange={(v) => set("whatYouLearn", v)} />
          </Field>
          <Field label="Audience" hint="One per line">
            <ListEditor value={form.audience} onChange={(v) => set("audience", v)} />
          </Field>
          <Field label="Prerequisites" hint="One per line">
            <ListEditor value={form.prerequisites} onChange={(v) => set("prerequisites", v)} />
          </Field>
          <div className="grid gap-4">
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
      </div>

      {/* Modules & lessons */}
      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-navy dark:text-slate-100">Modules & lessons</h2>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-full text-xs"
            onClick={() =>
              setModules((m) => [...m, { title: "Module", lessons: [{ title: "", lessonType: "text", content: "", isPreview: false }] }])
            }
          >
            <Plus className="size-3" /> Add module
          </Button>
        </div>
        <p className="mt-1 text-[11px] text-ink-soft dark:text-slate-400">
          Saved when you press Save. Deleting a module deletes its lessons.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {modules.map((mod, mi) => (
            <div key={mi} className="rounded-2xl border border-hairline bg-cool/40 p-4 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider text-teal uppercase">
                  Module {mi + 1}
                </span>
                <TextInput
                  value={mod.title}
                  onChange={(e) =>
                    setModules((ms) => ms.map((m, j) => (j === mi ? { ...m, title: e.target.value } : m)))
                  }
                  className="h-9 flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0 text-destructive"
                  onClick={() => {
                    if (mod.id) {
                      deleteModule({ id: mod.id as never }).catch((err) =>
                        toast.error(err instanceof Error ? err.message : "Failed"),
                      );
                    }
                    setModules((ms) => ms.filter((_, j) => j !== mi));
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <div className="mt-3 flex flex-col gap-2 pl-1">
                {mod.lessons.map((lesson, li) => (
                  <div key={li} className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-2 dark:bg-white/5">
                    <span className="w-8 text-center font-serif text-xs text-gold">
                      {li + 1}.
                    </span>
                    <TextInput
                      value={lesson.title}
                      placeholder="Lesson title"
                      onChange={(e) =>
                        setModules((ms) =>
                          ms.map((m, j) =>
                            j === mi
                              ? {
                                  ...m,
                                  lessons: m.lessons.map((l, k) =>
                                    k === li ? { ...l, title: e.target.value } : l,
                                  ),
                                }
                              : m,
                          ),
                        )
                      }
                      className="h-8 flex-1 min-w-40"
                    />
                    <SimpleSelect
                      value={lesson.lessonType}
                      onChange={(v) =>
                        setModules((ms) =>
                          ms.map((m, j) =>
                            j === mi
                              ? {
                                  ...m,
                                  lessons: m.lessons.map((l, k) =>
                                    k === li ? { ...l, lessonType: v } : l,
                                  ),
                                }
                              : m,
                          ),
                        )
                      }
                      options={["text", "video", "PDF", "downloadable-resource", "quiz", "external-embed"].map((t) => ({
                        value: t,
                        label: t,
                      }))}
                    />
                    <label className="flex items-center gap-1.5 text-[11px] font-medium text-ink-soft dark:text-slate-400">
                      <Switch
                        checked={lesson.isPreview}
                        onCheckedChange={(c) =>
                          setModules((ms) =>
                            ms.map((m, j) =>
                              j === mi
                                ? {
                                    ...m,
                                    lessons: m.lessons.map((l, k) =>
                                      k === li ? { ...l, isPreview: c === true } : l,
                                    ),
                                  }
                                : m,
                            ),
                          )
                        }
                        className="scale-75"
                      />
                      Preview
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 text-destructive"
                      onClick={() => {
                        if (lesson.id) {
                          deleteLesson({ id: lesson.id as never }).catch((err) =>
                            toast.error(err instanceof Error ? err.message : "Failed"),
                          );
                        }
                        setModules((ms) =>
                          ms.map((m, j) =>
                            j === mi
                              ? { ...m, lessons: m.lessons.filter((_, k) => k !== li) }
                              : m,
                          ),
                        );
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-fit rounded-full text-xs"
                  onClick={() =>
                    setModules((ms) =>
                      ms.map((m, j) =>
                        j === mi
                          ? { ...m, lessons: [...m.lessons, { title: "", lessonType: "text", content: "", isPreview: false }] }
                          : m,
                      ),
                    )
                  }
                >
                  <Plus className="size-3" /> Add lesson
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-[11px] text-ink-soft dark:text-slate-400">
          <GraduationCap className="size-3.5" /> Enrollment counts are real — never fabricated.
        </p>
      </div>
    </EditorShell>
  );
}
