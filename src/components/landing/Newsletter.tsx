import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function Newsletter() {
  const subscribe = useMutation(api.newsletter.subscribe);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    if (!consent) {
      toast.error("Please confirm you'd like to receive Edueyedia emails.");
      return;
    }
    setStatus("loading");
    try {
      const result = await subscribe({ email });
      setStatus("done");
      toast.success(
        result.alreadySubscribed ? "Already subscribed" : "Welcome to Edueyedia",
        {
          description: result.alreadySubscribed
            ? "This address is already on the list — you're all set."
            : "You're on the list — we'll write when there's something worth reading.",
        },
      );
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error("Could not subscribe", {
        description: "Please check your email address and try again.",
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-cool py-20 sm:py-28 dark:bg-navy-surface/40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-hairline bg-white px-6 py-14 sm:px-14 sm:py-16 dark:border-white/10 dark:bg-navy-surface">
            {/* motifs */}
            <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid text-navy opacity-[0.07] dark:text-white" />
            <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-teal/15 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute -top-8 right-8 font-serif text-[10rem] leading-none text-navy opacity-[0.05] select-none dark:text-white">
              “
            </span>

            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-teal uppercase dark:text-teal-bright">
                  <span className="h-px w-8 bg-current" />
                  The Edueyedia Letter
                </p>
                <h2 className="font-serif mt-5 text-4xl leading-[1.1] text-navy text-balance sm:text-5xl dark:text-slate-50">
                  Stay Curious. Stay Ahead.
                </h2>
                <p className="font-bangla mt-3 text-lg text-ink-soft dark:text-slate-300">
                  নতুন জ্ঞান ও সুযোগের সঙ্গে যুক্ত থাকুন
                </p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                  Research insights, scholarship opportunities, free resources and
                  new Edueyedia publications — once a month, never spam. Every
                  letter includes a one-click unsubscribe link.
                </p>
              </div>

              <div>
                {status === "done" ? (
                  <div className="flex items-start gap-4 rounded-3xl border border-teal/30 bg-teal/5 p-6">
                    <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-teal dark:text-teal-bright" />
                    <div>
                      <p className="font-serif text-xl text-navy dark:text-slate-100">
                        You're in. Welcome.
                      </p>
                      <p className="font-bangla mt-1 text-sm text-ink-soft dark:text-slate-400">
                        আপনার প্রথম লেটারটি শীঘ্রই আসছে — গবেষণা ও স্কলারশিপের নতুন সুযোগসহ।
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-soft" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="h-13 w-full rounded-full border border-hairline bg-ivory/60 py-3.5 pr-4 pl-11 text-sm text-navy placeholder:text-ink-soft/70 focus:border-teal focus:ring-2 focus:ring-teal/30 focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === "loading" || !consent}
                        className="inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90 disabled:opacity-60 dark:bg-teal dark:text-navy-deep dark:hover:bg-teal-bright"
                      >
                        {status === "loading" ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            Join Edueyedia
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </button>
                    </div>
                    {/* Explicit consent — never pre-checked. */}
                    <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-soft dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 size-4 shrink-0 accent-teal"
                        aria-describedby="newsletter-consent-note"
                      />
                      <span id="newsletter-consent-note">
                        By subscribing, you agree to receive Edueyedia updates by
                        email. You can unsubscribe anytime.
                      </span>
                    </label>
                  </form>
                )}
                <p className="mt-4 text-xs text-ink-soft dark:text-slate-500">
                  Free forever. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
