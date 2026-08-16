import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PageMeta } from "@/components/seo";
import { CheckCircle2, Loader2, MailX } from "lucide-react";

type State =
  | { phase: "confirm" }
  | { phase: "busy" }
  | { phase: "done" }
  | { phase: "error"; message: string };

/**
 * One-click unsubscribe landing page. The only identifier the email link
 * carries is the per-subscriber secret token — the subscriber's database id
 * is never exposed. The server marks the row unsubscribed (kept, not
 * deleted) and the page shows a clear success or safe error state.
 */
export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const unsubscribe = useMutation(api.newsletter.unsubscribe);
  const [state, setState] = useState<State>(
    token ? { phase: "confirm" } : { phase: "error", message: "This unsubscribe link is not valid." },
  );

  const confirm = async () => {
    setState({ phase: "busy" });
    try {
      await unsubscribe({ token });
      setState({ phase: "done" });
      toast.success("You're unsubscribed");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "This unsubscribe link could not be used.";
      setState({ phase: "error", message });
      toast.error("Could not unsubscribe", { description: message });
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title="Unsubscribe — Edueyedia"
        description="Unsubscribe from the Edueyedia Letter email updates."
        path="/unsubscribe"
      />
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-6 pt-24 pb-24">
        <div className="w-full max-w-lg rounded-[2rem] border border-hairline bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-navy-surface">
          {state.phase === "confirm" && (
            <>
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gold/15">
                <MailX className="size-7 text-[#8a681f] dark:text-gold" />
              </span>
              <h1 className="font-serif mt-6 text-3xl text-navy dark:text-slate-50">
                Unsubscribe from the Edueyedia Letter?
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                You'll stop receiving research insights, scholarship updates and
                new publication notices by email. You can re-subscribe anytime
                from the Edueyedia homepage.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button onClick={confirm} className="rounded-full">
                  Confirm unsubscribe
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/">Keep my subscription</Link>
                </Button>
              </div>
            </>
          )}

          {state.phase === "busy" && (
            <div className="flex flex-col items-center gap-4 py-10">
              <Loader2 className="size-8 animate-spin text-teal" />
              <p className="text-sm text-ink-soft dark:text-slate-400">
                Updating your subscription…
              </p>
            </div>
          )}

          {state.phase === "done" && (
            <>
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-teal/10">
                <CheckCircle2 className="size-7 text-teal dark:text-teal-bright" />
              </span>
              <h1 className="font-serif mt-6 text-3xl text-navy dark:text-slate-50">
                You're unsubscribed
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                Your email address has been removed from the Edueyedia Letter
                list. No more updates will arrive. You're welcome back anytime —
                the library and research hub stay free.
              </p>
              <div className="mt-8">
                <Button asChild className="rounded-full">
                  <Link to="/">Back to Edueyedia</Link>
                </Button>
              </div>
            </>
          )}

          {state.phase === "error" && (
            <>
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10">
                <MailX className="size-7 text-red-500" />
              </span>
              <h1 className="font-serif mt-6 text-3xl text-navy dark:text-slate-50">
                Link not valid
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                {state.message}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                If you'd still like to stop receiving emails, reply to any
                Edueyedia email and ask to be removed.
              </p>
              <div className="mt-8">
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/">Back to Edueyedia</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
