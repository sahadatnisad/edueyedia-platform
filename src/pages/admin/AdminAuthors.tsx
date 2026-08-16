import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EditorShell,
  Field,
  ListEditor,
  StatusSelect,
  TextArea,
  TextInput,
} from "@/components/admin/AdminUI";

export default function AdminAuthors() {
  const list = useQuery(api.admin.listAuthorsAdmin);
  const remove = useMutation(api.admin.deleteAuthor);
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy dark:text-slate-50">Authors & editors</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
            {list?.length ?? 0} records — credentials are only ever filled in by a human admin.
          </p>
        </div>
        <Button className="h-9 rounded-full" onClick={() => navigate("/admin/authors/new")}>
          <Plus className="size-3.5" /> New author
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-hairline bg-white dark:border-white/10 dark:bg-navy-surface">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase">Name</TableHead>
              <TableHead className="text-[10px] uppercase">Role</TableHead>
              <TableHead className="text-[10px] uppercase">Credentials</TableHead>
              <TableHead className="text-[10px] uppercase">Status</TableHead>
              <TableHead className="text-right text-[10px] uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!list && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-ink-soft">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {list?.map((a) => (
              <TableRow key={a._id} className="text-xs">
                <TableCell className="font-medium text-navy dark:text-slate-100">{a.name}</TableCell>
                <TableCell className="text-ink-soft dark:text-slate-400">{a.role}</TableCell>
                <TableCell className="text-ink-soft dark:text-slate-400">
                  {a.credentials.length > 0 ? a.credentials.join(" · ") : "—"}
                </TableCell>
                <TableCell>
                  <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold uppercase text-teal dark:text-teal-bright">
                    {a.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={() => navigate(`/admin/authors/${a._id}`)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 text-destructive hover:text-destructive"
                      onClick={async () => {
                        if (!confirm(`Delete "${a.name}"?`)) return;
                        try {
                          await remove({ id: a._id });
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

export function AdminAuthorEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === undefined || id === "new";
  const existing = useQuery(
    api.admin.getAuthorAdmin,
    isNew ? ("skip" as never) : { id: id as never },
  );
  const save = useMutation(api.admin.upsertAuthor);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [credentials, setCredentials] = useState<string[]>([]);
  const [status, setStatus] = useState("published");
  const [saving, setSaving] = useState(false);

  // Hydrate the form when the fetched record arrives — "adjust state when a
  // value changes" pattern (guarded by a previous-value comparison).
  const [prevExisting, setPrevExisting] = useState(existing);
  if (existing !== prevExisting) {
    setPrevExisting(existing);
    if (existing && id !== "new") {
      setName(existing.name ?? "");
      setRole(existing.role ?? "");
      setBio(existing.bio ?? "");
      setImage(existing.image ?? "");
      setCredentials(existing.credentials ?? []);
      setStatus(existing.status);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await save({
        id: id && id !== "new" ? (id as never) : undefined,
        name,
        role,
        bio: bio || undefined,
        image: image || undefined,
        credentials,
        status: status as never,
      });
      toast.success("Author saved");
      navigate("/admin/authors");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorShell
      title={id === "new" ? "New author" : "Edit author"}
      backTo="/admin/authors"
      onSave={handleSave}
      saving={saving}
    >
      <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Role" hint="e.g. Research Editor, Methodology Writer">
            <TextInput value={role} onChange={(e) => setRole(e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Bio">
            <TextArea value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-24" />
          </Field>
          <div className="grid gap-4">
            <Field label="Profile image URL" hint="Optional">
              <TextInput value={image} onChange={(e) => setImage(e.target.value)} />
            </Field>
            <Field label="Status">
              <StatusSelect value={status} onChange={setStatus} />
            </Field>
          </div>
        </div>
        <div className="mt-4">
          <Field
            label="Credentials"
            hint="Never invented — only real degrees, affiliations and roles, added by an admin."
          >
            <ListEditor value={credentials} onChange={setCredentials} />
          </Field>
        </div>
      </div>
      <p className="flex items-center gap-1.5 text-[11px] text-ink-soft dark:text-slate-400">
        <UserRound className="size-3.5" /> Authors appear on articles and courses once linked by an admin.
      </p>
    </EditorShell>
  );
}
