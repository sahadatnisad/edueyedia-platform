import { Link } from "react-router";
import { ArrowRight, HelpCircle, Mail, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/landing/Newsletter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const GROUPS: {
  id: string;
  label: string;
  bn: string;
  items: { q: string; a: string }[];
}[] = [
  {
    id: "account",
    label: "Accounts & Library",
    bn: "অ্যাকাউন্ট ও লাইব্রেরি",
    items: [
      {
        q: "Do I need an account to download free resources?",
        a: "Yes — a free account keeps your library organised. Sign in, save any free resource, and it stays in your library permanently on every device.",
      },
      {
        q: "What happens to my library if I delete my account?",
        a: "Deleting your account removes your library and order history. We recommend downloading anything you own before you go, because access is tied to the account.",
      },
      {
        q: "Can I share my account or downloaded files with a friend?",
        a: "No — licences are personal to each account. Sharing credentials or redistributing publications violates our terms and undermines the work of the researchers who make them.",
      },
    ],
  },
  {
    id: "orders",
    label: "Orders & Delivery",
    bn: "অর্ডার ও ডেলিভারি",
    items: [
      {
        q: "How fast is delivery after I pay?",
        a: "Instantly. As soon as the payment is confirmed, the resources unlock in your library and you can download them immediately — no waiting, no shipping.",
      },
      {
        q: "Which payment methods are accepted?",
        a: "Checkout runs through a secure payment gateway supporting bKash, Nagad and card payments. During development the checkout runs in a demo sandbox — no real money moves until the live gateway is configured.",
      },
      {
        q: "I paid but the resources are not in my library. What now?",
        a: "First check your library after refreshing the page. If they are still missing, contact us with your order reference and we will unlock your resources within 24 hours.",
      },
      {
        q: "Do bundles include everything listed?",
        a: "Yes. A bundle is a curated set of publications sold as one unit at a discount. Every item listed on the bundle page is delivered to your library together.",
      },
    ],
  },
  {
    id: "refunds",
    label: "Refunds",
    bn: "রিফান্ড",
    items: [
      {
        q: "Can I get a refund if I change my mind?",
        a: "Digital products cannot be returned, so change-of-mind refunds are not available once the resource has been delivered. We do offer refunds for genuine product defects — see the Refund Policy.",
      },
      {
        q: "A resource failed to deliver. What should I do?",
        a: "Email us from the address on your order with the order number. If the resource cannot be delivered to your library within 24 hours, you get a full refund.",
      },
    ],
  },
  {
    id: "content",
    label: "Content & Editions",
    bn: "কন্টেন্ট ও সংস্করণ",
    items: [
      {
        q: "How often are resources updated?",
        a: "We refresh scholarship maps and deadline trackers every application cycle, and revise guides when standards change. The 'Updated' date on each product page shows the latest revision.",
      },
      {
        q: "Do I get updates to a resource I bought?",
        a: "Yes — when a publication you own is substantially updated, the new version appears in your library at no extra cost. Lifetime access means exactly that.",
      },
      {
        q: "Why do some research topics say 'coming soon'?",
        a: "We only publish what we can verify. Topics marked as coming soon are on the editorial calendar but are not published until the research is sourced and reviewed — no invented citations, ever.",
      },
    ],
  },
  {
    id: "platform",
    label: "The Platform",
    bn: "প্ল্যাটফর্ম",
    items: [
      {
        q: "Is Edueyedia a coaching centre or a PDF store?",
        a: "Neither. Edueyedia is a knowledge publication — an academic journal meets a modern digital publishing platform. We publish research, guides and opportunities, with paid publications funding the free knowledge.",
      },
      {
        q: "Why Bangla-first?",
        a: "Bangla-speaking learners deserve research-grade knowledge in their own language. We explain in clear Bangla and keep English for academic terms, so complex ideas stay precise and accessible.",
      },
      {
        q: "How do I report an error in an article or resource?",
        a: "Use the contact page and mark the topic 'Editorial feedback'. We investigate every report and publish corrections when something is wrong — accuracy is the whole point of the platform.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
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
            className="pointer-events-none absolute -top-24 right-[-8%] h-80 w-80 rounded-full bg-teal/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <Reveal>
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-navy text-gold dark:bg-teal dark:text-navy-deep">
                <HelpCircle className="size-7" />
              </span>
              <p className="mt-5 text-xs font-bold tracking-[0.24em] text-teal uppercase dark:text-teal-bright">
                Frequently Asked Questions
              </p>
              <h1 className="font-serif mt-4 text-4xl leading-[1.1] text-navy text-balance sm:text-6xl dark:text-slate-50">
                Answers, before you ask.
              </h1>
              <p className="font-bangla mt-4 text-lg leading-relaxed text-ink-soft dark:text-slate-300">
                অ্যাকাউন্ট, অর্ডার, রিফান্ড ও কন্টেন্ট নিয়ে সাধারণ প্রশ্নের উত্তর —
                না পেলে সরাসরি যোগাযোগ করুন।
              </p>
            </Reveal>
          </div>
        </section>

        {/* Accordion */}
        <section className="mx-auto max-w-3xl px-6 pt-14">
          {GROUPS.map((group, gi) => (
            <div key={group.id} className={gi > 0 ? "mt-12" : undefined}>
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gold" />
                  <div>
                    <h2 className="font-serif text-2xl text-navy dark:text-slate-100">
                      {group.label}
                    </h2>
                    <p className="font-bangla text-[13px] text-teal dark:text-teal-bright">
                      {group.bn}
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <Accordion type="single" collapsible className="mt-6">
                  {group.items.map((item) => (
                    <AccordionItem
                      key={item.q}
                      value={item.q}
                      className="rounded-2xl border border-hairline bg-white px-6 dark:border-white/10 dark:bg-navy-surface"
                    >
                      <AccordionTrigger className="py-5 text-left text-[15px] font-semibold text-navy hover:no-underline dark:text-slate-100">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-[14px] leading-[1.8] text-ink-soft dark:text-slate-400">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            </div>
          ))}

          {/* Still stuck? */}
          <Reveal delay={0.1}>
            <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-3xl border border-hairline bg-white p-7 sm:flex-row sm:items-center dark:border-white/10 dark:bg-navy-surface">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-teal/10 text-teal dark:text-teal-bright">
                  <MessageCircle className="size-5" />
                </span>
                <div>
                  <p className="font-serif text-xl text-navy dark:text-slate-100">
                    Still have a question?
                  </p>
                  <p className="font-bangla mt-1 text-sm text-ink-soft dark:text-slate-400">
                    উত্তর না পেলে সরাসরি আমাদের লিখুন।
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep"
                >
                  <Mail className="size-4" />
                  Contact us
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/resources"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-hairline bg-white px-6 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
                >
                  Browse resources
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
