import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Mail, MailOpen } from "lucide-react";

export default function AdminInbox() {
  const messages = useQuery(api.admin.listContactMessages);
  const markRead = useMutation(api.admin.markContactRead);

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl text-navy dark:text-slate-50">Inbox</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
          Contact form submissions — {messages?.length ?? 0} recent messages.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {!messages && (
          <p className="rounded-3xl border border-hairline bg-white p-8 text-center text-sm text-ink-soft dark:border-white/10 dark:bg-navy-surface">
            Loading…
          </p>
        )}
        {messages?.length === 0 && (
          <p className="rounded-3xl border border-hairline bg-white p-8 text-center text-sm text-ink-soft dark:border-white/10 dark:bg-navy-surface">
            No messages yet.
          </p>
        )}
        {messages?.map((m) => (
          <article
            key={m._id as string}
            className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex size-9 items-center justify-center rounded-full ${
                    m.status === "new"
                      ? "bg-teal/10 text-teal dark:text-teal-bright"
                      : "bg-cool text-ink-soft dark:bg-white/5 dark:text-slate-400"
                  }`}
                >
                  {m.status === "new" ? (
                    <Mail className="size-4" />
                  ) : (
                    <MailOpen className="size-4" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy dark:text-slate-100">
                    {m.name} <span className="font-normal text-ink-soft">· {m.email}</span>
                  </p>
                  <p className="text-[11px] font-semibold tracking-wide text-teal uppercase dark:text-teal-bright">
                    {m.topic} · {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {m.status === "new" && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await markRead({ id: m._id as never });
                      toast.success("Marked as read");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Failed");
                    }
                  }}
                  className="rounded-full border border-hairline px-3 py-1 text-[11px] font-semibold text-ink-soft transition-colors hover:border-teal hover:text-teal dark:border-white/15"
                >
                  Mark read
                </button>
              )}
            </div>
            <p className="mt-3 rounded-2xl bg-ivory px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-ink dark:bg-white/[0.03] dark:text-slate-200">
              {m.message}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
