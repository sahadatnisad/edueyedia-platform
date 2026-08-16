import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/landing/Newsletter";
import { PageMeta } from "@/components/seo";

const CHANNELS = [
  {
    icon: Mail,
    title: "Email us",
    bn: "ইমেইল করুন",
    line: "For orders, refunds and account help — the fastest channel.",
    value: "hello@edueyedia.com",
    href: "mailto:hello@edueyedia.com",
    cta: "Send an email",
  },
  {
    icon: MessageSquare,
    title: "Content enquiries",
    bn: "কন্টেন্ট সম্পর্কিত",
    line: "Suggestions, corrections or guest-writing for the Research hub and Blog.",
    value: "editors@edueyedia.com",
    href: "mailto:editors@edueyedia.com",
    cta: "Write to the editors",
  },
  {
    icon: BookOpen,
    title: "Partnerships",
    bn: "পার্টনারশিপ",
    line: "Universities, libraries and organisations interested in collaboration.",
    value: "partners@edueyedia.com",
    href: "mailto:partners@edueyedia.com",
    cta: "Start a conversation",
  },
];

const RESPONSE = [
  { label: "Order & delivery", time: "Within 24 hours" },
  { label: "Account & library", time: "Within 24 hours" },
  { label: "Refunds", time: "2–3 business days" },
  { label: "Editorial feedback", time: "Within a week" },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Order & delivery");
  const [message, setMessage] = useState("");
  // Honeypot — hidden from humans, filled by bots.
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitContact = useMutation(api.contact.submitContact);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    setError(null);
    try {
      await submitContact({
        name,
        email,
        topic,
        message,
        website: website || undefined,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send — try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title="Contact — Edueyedia"
        description="অর্ডার, লাইব্রেরি, রিফান্ড বা কন্টেন্ট নিয়ে প্রশ্ন থাকলে জানান — we reply to every message, usually within one business day."
        path="/contact"
      />
      <Navbar />
      <main className="pt-32 pb-24 sm:pt-36">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-[-8%] h-80 w-80 rounded-full bg-gold/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-gold" />
                <p className="text-xs font-bold tracking-[0.24em] text-teal uppercase dark:text-teal-bright">
                  Contact Edueyedia
                </p>
              </div>
              <h1 className="font-serif mt-5 max-w-2xl text-4xl leading-[1.1] text-navy text-balance sm:text-6xl dark:text-slate-50">
                We reply to every message.
              </h1>
              <p className="font-bangla mt-4 max-w-xl text-lg leading-relaxed text-ink-soft dark:text-slate-300">
                অর্ডার, লাইব্রেরি, রিফান্ড বা কন্টেন্ট নিয়ে প্রশ্ন থাকলে জানান — আমরা
                দ্রুত উত্তর দিই।
              </p>
            </Reveal>
          </div>
        </section>

        {/* Channels */}
        <section className="mx-auto max-w-6xl px-6 pt-14">
          <div className="grid gap-5 md:grid-cols-3">
            {CHANNELS.map((c, i) => (
              <Reveal key={c.title} delay={0.07 * i}>
                <a
                  href={c.href}
                  className="group flex h-full flex-col rounded-3xl border border-hairline bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,34,56,0.25)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
                >
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-navy text-gold dark:bg-teal dark:text-navy-deep">
                    <c.icon className="size-5" />
                  </span>
                  <h2 className="mt-5 font-serif text-xl text-navy dark:text-slate-100">
                    {c.title}
                  </h2>
                  <p className="font-bangla mt-0.5 text-[13px] text-teal dark:text-teal-bright">
                    {c.bn}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                    {c.line}
                  </p>
                  <p className="mt-4 rounded-2xl border border-hairline bg-ivory px-4 py-2.5 font-mono text-[13px] text-navy dark:border-white/10 dark:bg-navy-deep dark:text-slate-200">
                    {c.value}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-navy dark:text-slate-100">
                    {c.cta}
                    <ArrowRight className="size-3.5 text-teal transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Form + response times */}
        <section className="mx-auto max-w-6xl px-6 pt-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="rounded-[2rem] border border-hairline bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-navy-surface">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold dark:bg-teal dark:text-navy-deep">
                      1
                    </span>
                    <div>
                      <h2 className="font-serif text-2xl text-navy dark:text-slate-100">
                        Send a message
                      </h2>
                      <p className="font-bangla text-sm text-ink-soft dark:text-slate-400">
                        বার্তা পাঠান — আমরা উত্তর দেব
                      </p>
                    </div>
                  </div>

                  {sent ? (
                    <div className="mt-7 flex flex-col items-start gap-3 rounded-3xl border border-teal/20 bg-teal/5 p-6 dark:border-teal/30 dark:bg-teal/10">
                      <span className="flex size-12 items-center justify-center rounded-full bg-teal/10">
                        <CheckCircle2 className="size-6 text-teal dark:text-teal-bright" />
                      </span>
                      <h3 className="font-serif text-xl text-navy dark:text-slate-100">
                        Message received
                      </h3>
                      <p className="font-bangla text-sm leading-relaxed text-ink-soft dark:text-slate-300">
                        ধন্যবাদ! আপনার বার্তা আমাদের কাছে পৌঁছেছে — আমরা দ্রুত
                        উত্তর দেব।
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSent(false);
                          setName("");
                          setEmail("");
                          setMessage("");
                        }}
                        className="link-underline text-sm font-semibold text-teal dark:text-teal-bright"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                  <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
                    {/* Honeypot — invisible to humans, catches bots. */}
                    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                      <label htmlFor="contact-website">Leave this field empty</label>
                      <input
                        id="contact-website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="text-[13px] font-semibold text-navy dark:text-slate-200"
                        >
                          Your name
                        </label>
                        <input
                          id="contact-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Full name"
                          className="mt-1.5 h-12 w-full rounded-2xl border border-hairline bg-ivory/60 px-4 text-sm text-navy placeholder:text-ink-soft/70 focus:border-teal focus:ring-2 focus:ring-teal/30 focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="text-[13px] font-semibold text-navy dark:text-slate-200"
                        >
                          Email address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="you@example.com"
                          className="mt-1.5 h-12 w-full rounded-2xl border border-hairline bg-ivory/60 px-4 text-sm text-navy placeholder:text-ink-soft/70 focus:border-teal focus:ring-2 focus:ring-teal/30 focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="contact-topic"
                        className="text-[13px] font-semibold text-navy dark:text-slate-200"
                      >
                        Topic
                      </label>
                      <select
                        id="contact-topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-1.5 h-12 w-full rounded-2xl border border-hairline bg-ivory/60 px-4 text-sm text-navy focus:border-teal focus:ring-2 focus:ring-teal/30 focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
                      >
                        {RESPONSE.map((r) => (
                          <option key={r.label} value={r.label}>
                            {r.label}
                          </option>
                        ))}
                        <option value="Something else">Something else</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="text-[13px] font-semibold text-navy dark:text-slate-200"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={6}
                        placeholder="Tell us what we can help with…"
                        className="mt-1.5 w-full resize-none rounded-2xl border border-hairline bg-ivory/60 px-4 py-3.5 text-sm leading-relaxed text-navy placeholder:text-ink-soft/70 focus:border-teal focus:ring-2 focus:ring-teal/30 focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </div>
                    {error && (
                      <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        {error}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={sending}
                      className="group inline-flex h-12 w-fit items-center gap-2 rounded-full bg-navy px-7 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal dark:text-navy-deep dark:hover:bg-teal-bright"
                    >
                      <Send className="size-4" />
                      {sending ? "Sending…" : "Send message"}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                    <p className="text-xs leading-relaxed text-ink-soft dark:text-slate-500">
                      Your message is stored securely and we reply from
                      hello@edueyedia.com — if you do not see a reply, check spam.
                    </p>
                  </form>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Response expectations */}
            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="rounded-[2rem] border border-hairline bg-white p-6 sm:p-8 lg:sticky lg:top-28 dark:border-white/10 dark:bg-navy-surface">
                  <p className="flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-teal uppercase dark:text-teal-bright">
                    <span className="h-px w-8 bg-current" />
                    Response times
                  </p>
                  <h2 className="font-serif mt-4 text-2xl text-navy dark:text-slate-100">
                    When you will hear back
                  </h2>
                  <p className="font-bangla mt-2 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                    আমরা প্রতিটি বার্তার উত্তর দিই — সাধারণত এক কার্যদিবসের মধ্যে।
                  </p>
                  <ul className="mt-6 flex flex-col">
                    {RESPONSE.map((r) => (
                      <li
                        key={r.label}
                        className="flex items-center justify-between gap-4 border-b border-hairline py-4 last:border-b-0 dark:border-white/10"
                      >
                        <span className="flex items-center gap-3 text-sm font-medium text-navy dark:text-slate-100">
                          <Clock className="size-4 text-teal dark:text-teal-bright" />
                          {r.label}
                        </span>
                        <span className="text-xs font-semibold text-ink-soft dark:text-slate-400">
                          {r.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-[#8a681f] dark:text-gold" />
                    <p className="text-[13px] leading-relaxed text-[#7c5c16] dark:text-gold">
                      Edueyedia is a digital-first platform — we operate remotely
                      from Bangladesh and serve readers worldwide.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-hairline bg-ivory px-4 py-3 dark:border-white/10 dark:bg-navy-deep">
                    <span className="flex items-center gap-2 text-sm text-ink-soft dark:text-slate-400">
                      <FileText className="size-4 text-teal" />
                      Before you write, check
                    </span>
                    <Link
                      to="/faq"
                      className="link-underline text-sm font-semibold text-navy dark:text-slate-100"
                    >
                      the FAQ
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
