import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Newsletter subscribers admin page. Read-only for now: the owner can see
 * active/unsubscribed status, subscription/unsubscribe dates, and export
 * emails. Campaign sending is intentionally not built yet — a provider-ready
 * subscriber list is enough until real campaigns are planned.
 */
export default function AdminNewsletter() {
  const subscribers = useQuery(api.admin.listNewsletterSubscribers);

  const active = (subscribers ?? []).filter((s) => s.status === "active");
  const unsubscribed = (subscribers ?? []).filter(
    (s) => s.status === "unsubscribed",
  );

  const exportCsv = () => {
    const rows = subscribers ?? [];
    const header = "email,status,subscribedAt,unsubscribedAt";
    const lines = rows.map((s) => {
      const date = (ts: number | undefined) =>
        ts ? new Date(ts).toISOString() : "";
      return [
        `"${s.email.replace(/"/g, '""')}"`,
        s.status,
        date(s.subscribedAt),
        date(s.unsubscribedAt),
      ].join(",");
    });
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "edueyedia-newsletter-subscribers.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy dark:text-slate-50">Newsletter</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
            {active.length} active · {unsubscribed.length} unsubscribed ·{" "}
            {subscribers?.length ?? 0} total
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full text-xs"
          disabled={!subscribers || subscribers.length === 0}
          onClick={exportCsv}
        >
          <Download className="size-3.5" /> Export CSV
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-hairline bg-white dark:border-white/10 dark:bg-navy-surface">
        {!subscribers && (
          <p className="p-8 text-center text-sm text-ink-soft dark:text-slate-400">
            Loading…
          </p>
        )}
        {subscribers?.length === 0 && (
          <p className="flex flex-col items-center gap-2 p-10 text-center text-sm text-ink-soft dark:text-slate-400">
            <Mail className="size-5" />
            No subscribers yet. The homepage newsletter signup adds them here.
          </p>
        )}
        {subscribers && subscribers.length > 0 && (
          <table className="w-full text-left text-xs">
            <thead className="bg-cool/60 text-[10px] uppercase text-ink-soft dark:bg-white/[0.03] dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Subscribed</th>
                <th className="px-5 py-3 font-semibold">Unsubscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline dark:divide-white/5">
              {subscribers.map((s) => (
                <tr key={s.email} className="text-ink-soft dark:text-slate-400">
                  <td className="px-5 py-3 font-medium text-navy dark:text-slate-200">
                    {s.email}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        s.status === "active"
                          ? "bg-teal/10 text-teal dark:text-teal-bright"
                          : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {new Date(s.subscribedAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    {s.unsubscribedAt
                      ? new Date(s.unsubscribedAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-ink-soft dark:text-slate-400">
        Subscribers are never deleted — unsubscribed rows stay for an honest
        history. Campaign sending is not built yet; when a provider is chosen,
        sending can be layered onto this list without changing the subscriber
        model.
      </p>
    </div>
  );
}
