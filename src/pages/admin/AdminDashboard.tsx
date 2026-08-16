import { useState } from "react";
import { Link } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useIsAdmin } from "@/hooks/use-content";
import {
  BadgeCheck,
  Database,
  FileText,
  FlaskConical,
  GraduationCap,
  Newspaper,
  RefreshCw,
  ScrollText,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/admin/AdminUI";

const ORDER_STATUS: Record<string, string> = {
  pending: "bg-gold/15 text-[#8a681f] dark:text-gold",
  paid: "bg-teal/10 text-teal dark:text-teal-bright",
  cancelled: "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400",
  failed: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function AdminDashboard() {
  const stats = useQuery(api.admin.dashboardStats);
  const seed = useQuery(api.admin.seedStatus);
  const logs = useQuery(api.admin.recentAuditLogs);
  const isAdmin = useIsAdmin();
  const ensureFirstAdmin = useMutation(api.admin.ensureFirstAdmin);
  const seedFromLegacy = useMutation(api.seed.seedFromLegacyCatalog);
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    try {
      const res = (await fn()) as { granted?: boolean; seeded?: boolean; reason?: string } | null;
      if (res && res.reason) {
        toast.info(res.reason);
      } else {
        toast.success("Done");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  };

  const s = stats?.stats;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy dark:text-slate-50">
            Content Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
            Real numbers from the database — nothing is fabricated.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-full"
              disabled={busy !== null}
              onClick={() => run("admin", () => ensureFirstAdmin())}
            >
              <BadgeCheck className="size-3.5" />
              {busy === "admin" ? "Granting…" : "Become the first admin"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full"
            disabled={busy !== null}
            onClick={() => run("seed", () => seedFromLegacy())}
          >
            <Database className="size-3.5" />
            {busy === "seed" ? "Seeding…" : "Seed legacy catalog"}
          </Button>
        </div>
      </div>

      {/* Seed state */}
      {seed && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-hairline bg-white px-4 py-3 text-xs text-ink-soft dark:border-white/10 dark:bg-navy-surface dark:text-slate-400">
          <Database className="size-3.5 text-teal" />
          Content in DB: {seed.resources} resources · {seed.research} research ·{" "}
          {seed.blog} blog · {seed.courses} courses
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Published resources" value={s?.publishedResources ?? 0} />
        <StatCard label="Draft resources" value={s?.draftResources ?? 0} />
        <StatCard label="Research published" value={s?.researchPublished ?? 0} />
        <StatCard label="Blog published" value={s?.blogPublished ?? 0} />
        <StatCard label="Courses (pub/soon)" value={`${s?.coursesPublished ?? 0}/${s?.coursesComingSoon ?? 0}`} />
        <StatCard label="Orders" value={s?.orders ?? 0} />
        <StatCard label="Revenue" value={`৳${(s?.revenue ?? 0).toLocaleString()}`} />
        <StatCard label="Users" value={s?.users ?? 0} hint={`${s?.newsletterSubscribers ?? 0} newsletter subs · ${s?.enrollments ?? 0} enrollments`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-4 text-teal" />
            <h2 className="font-serif text-xl text-navy dark:text-slate-50">Recent orders</h2>
          </div>
          {stats && stats.recentOrders.length > 0 ? (
            <Table className="mt-3">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase">Name</TableHead>
                  <TableHead className="text-[10px] uppercase">Items</TableHead>
                  <TableHead className="text-[10px] uppercase">Total</TableHead>
                  <TableHead className="text-[10px] uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.map((o) => (
                  <TableRow key={o._id} className="text-xs">
                    <TableCell className="font-medium text-navy dark:text-slate-200">
                      {o.contactName}
                    </TableCell>
                    <TableCell className="text-ink-soft dark:text-slate-400">{o.itemCount}</TableCell>
                    <TableCell>৳{o.total}</TableCell>
                    <TableCell>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${ORDER_STATUS[o.status] ?? ""}`}>
                        {o.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="mt-3 text-sm text-ink-soft dark:text-slate-400">
              No orders yet — they appear here as customers check out.
            </p>
          )}
          <Button asChild variant="outline" size="sm" className="mt-4 h-9 rounded-full text-xs">
            <Link to="/admin/orders">Manage orders</Link>
          </Button>
        </div>

        {/* Audit log */}
        <div className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
          <div className="flex items-center gap-2">
            <ScrollText className="size-4 text-gold" />
            <h2 className="font-serif text-xl text-navy dark:text-slate-50">Recent activity</h2>
          </div>
          {logs && logs.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {logs.slice(0, 8).map((l) => (
                <li key={l._id} className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-cool px-2 py-0.5 font-mono text-[10px] text-ink-soft dark:bg-white/10 dark:text-slate-300">
                    {l.action}
                  </span>
                  <span className="text-ink-soft dark:text-slate-400">
                    {new Date(l.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-soft dark:text-slate-400">
              No admin actions logged yet.
            </p>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { to: "/admin/resources", label: "Resources", icon: FileText },
          { to: "/admin/research", label: "Research", icon: FlaskConical },
          { to: "/admin/blog", label: "Blog", icon: Newspaper },
          { to: "/admin/courses", label: "Courses", icon: GraduationCap },
        ].map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-3 rounded-2xl border border-hairline bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
          >
            <Icon className="size-4 text-teal" />
            <span className="text-sm font-semibold text-navy dark:text-slate-100">
              {label}
            </span>
            <RefreshCw className="ml-auto size-3.5 text-ink-soft/40 transition-transform group-hover:rotate-90" />
          </Link>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-[11px] text-ink-soft dark:text-slate-400">
        <Users className="size-3.5" />
        All admin mutations verify the admin role server-side — the UI is never the
        security boundary.
      </p>
    </div>
  );
}
