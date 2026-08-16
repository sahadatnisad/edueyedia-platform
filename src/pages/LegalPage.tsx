import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { PageMeta } from "@/components/seo";
import { cn } from "@/lib/utils";

export type LegalPageKey =
  | "privacy"
  | "terms"
  | "refund"
  | "digital-product"
  | "copyright"
  | "disclaimer";

interface LegalDoc {
  eyebrow: string;
  title: string;
  titleBn: string;
  updated: string;
  intro: string;
  introBn: string;
  sections: { heading: string; headingBn: string; body: string[] }[];
}

const DOCS: Record<LegalPageKey, LegalDoc> = {
  privacy: {
    eyebrow: "Privacy Policy",
    title: "Your data, handled with care",
    titleBn: "আপনার তথ্য, যত্নসহকারে সুরক্ষিত",
    updated: "Last updated: February 2026",
    intro:
      "Edueyedia collects the minimum information needed to run the platform: an account to manage your library, contact details at checkout, and your email if you join the newsletter. We never sell personal data.",
    introBn:
      "এডুইডিয়া শুধু প্রয়োজনীয় তথ্য সংগ্রহ করে — আপনার লাইব্রেরি পরিচালনার জন্য অ্যাকাউন্ট, চেকআউটে যোগাযোগের তথ্য এবং নিউজলেটারে যোগদান করলে ইমেইল। আমরা কখনো ব্যক্তিগত তথ্য বিক্রি করি না।",
    sections: [
      {
        heading: "What we collect",
        headingBn: "কী সংগ্রহ করা হয়",
        body: [
          "Account data: your name and email when you sign in, so we can keep your library, orders and downloads tied to your identity.",
          "Purchase data: contact details you provide at checkout (name, email, optional mobile) so we can deliver your resources and verify payments.",
          "Newsletter: your email address when you opt in. You can unsubscribe at any time with one click.",
          "Usage data: basic, anonymised analytics to understand which resources and articles are useful — never sold and never tied to advertising profiles.",
        ],
      },
      {
        heading: "How we use it",
        headingBn: "কীভাবে ব্যবহার করা হয়",
        body: [
          "To operate the platform: authentication, order fulfilment, licence verification and delivery of the digital resources you purchase.",
          "To communicate: transactional emails about orders and your library, and — only if you opted in — the monthly Edueyedia letter.",
          "To improve: aggregate usage patterns help us decide what to publish next. Individual reading habits are never shared.",
        ],
      },
      {
        heading: "What we never do",
        headingBn: "যা আমরা কখনো করি না",
        body: [
          "We do not sell, rent or trade your personal information with any third party.",
          "We do not build advertising profiles from your reading or purchase history.",
          "We do not store or process card details ourselves — payments are handled by our payment gateway under their own security standards.",
        ],
      },
      {
        heading: "Your choices",
        headingBn: "আপনার অধিকার",
        body: [
          "You can request a copy or deletion of your account data at any time by contacting us. Downloads stay available while your account exists; deleting your account removes your library and order history.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Terms of Service",
    title: "The terms of using Edueyedia",
    titleBn: "এডুইডিয়া ব্যবহারের শর্তাবলি",
    updated: "Last updated: February 2026",
    intro:
      "By using Edueyedia you agree to these terms. They exist to keep the platform fair for authors, readers and the community — read them once and you will rarely need to look again.",
    introBn:
      "এডুইডিয়া ব্যবহারের মাধ্যমে আপনি এই শর্তাবলিতে সম্মত হচ্ছেন। লেখক, পাঠক ও কমিউনিটির স্বার্থে এগুলো তৈরি — একবার পড়ে নিলেই সাধারণত আর প্রয়োজন হয় না।",
    sections: [
      {
        heading: "Accounts",
        headingBn: "অ্যাকাউন্ট",
        body: [
          "You are responsible for keeping your account credentials safe. Your library is personal to you: free resources are licensed to your account, not for redistribution.",
          "One account, one person. Sharing login credentials to unlock paid content is a violation of these terms.",
        ],
      },
      {
        heading: "Digital products",
        headingBn: "ডিজিটাল পণ্য",
        body: [
          "All resources are digital publications delivered through your library after purchase or free download. Licences are personal, non-transferable and for personal academic use.",
          "You may print copies for your own study, but you may not resell, republish or redistribute any Edueyedia publication.",
        ],
      },
      {
        heading: "Acceptable use",
        headingBn: "গ্রহণযোগ্য ব্যবহার",
        body: [
          "Do not attempt to bypass payment, scrape the platform at scale, or use any content in a way that misrepresents Edueyedia as your own work.",
          "Quoting short excerpts with attribution for academic purposes is welcome — that is what a knowledge platform is for.",
        ],
      },
      {
        heading: "Changes to the platform",
        headingBn: "প্ল্যাটফর্মের পরিবর্তন",
        body: [
          "We may add, update or retire resources as the library evolves. Paid buyers keep lifetime access to everything they purchased, including major updates to the same publication.",
        ],
      },
    ],
  },
  refund: {
    eyebrow: "Refund Policy",
    title: "Fair refunds for digital products",
    titleBn: "ডিজিটাল পণ্যে ন্যায্য রিফান্ড নীতি",
    updated: "Last updated: February 2026",
    intro:
      "Because digital publications are delivered instantly and cannot be returned, refunds are limited to genuine problems with the product itself — and we make that easy to resolve.",
    introBn:
      "ডিজিটাল প্রকাশনা তাৎক্ষণিক ডেলিভারি হয় এবং ফেরত দেওয়া যায় না বলে রিফান্ড সীমিত — তবে পণ্যে প্রকৃত সমস্যা থাকলে তা সমাধান করা সহজ।",
    sections: [
      {
        heading: "When you qualify for a refund",
        headingBn: "কখন রিফান্ড পাবেন",
        body: [
          "If a purchased resource fails to deliver to your library within 24 hours and our support cannot resolve it, you get a full refund.",
          "If a paid resource is materially different from its description (missing chapters, unreadable file, wrong language) you can request a refund within 14 days of purchase.",
          "If you bought the same item twice by accident, we refund the duplicate automatically on request.",
        ],
      },
      {
        heading: "When refunds are not given",
        headingBn: "কখন রিফান্ড দেওয়া হয় না",
        body: [
          "Change of mind after the resource has been delivered and works as described.",
          "Free resources — they are free; there is nothing to refund.",
          "Requests made more than 14 days after purchase without a documented defect.",
        ],
      },
      {
        heading: "How to request one",
        headingBn: "কীভাবে আবেদন করবেন",
        body: [
          "Email us from the address on your order with the order number and a short description of the issue. Refunds are processed within 5–7 business days to the original payment method where possible.",
        ],
      },
    ],
  },
  "digital-product": {
    eyebrow: "Digital Product Policy",
    title: "How digital delivery works",
    titleBn: "ডিজিটাল ডেলিভারি যেভাবে কাজ করে",
    updated: "Last updated: February 2026",
    intro:
      "Everything Edueyedia sells is a digital publication: PDFs, worksheets, spreadsheets and templates. There is no physical shipping — delivery happens inside your account.",
    introBn:
      "এডুইডিয়া যা কিছু বিক্রি করে তা সবই ডিজিটাল প্রকাশনা — PDF, ওয়ার্কশিট, স্প্রেডশিট ও টেমপ্লেট। কোনো ফিজিক্যাল ডেলিভারি নেই — ডেলিভারি হয় আপনার অ্যাকাউন্টের ভেতরে।",
    sections: [
      {
        heading: "Delivery",
        headingBn: "ডেলিভারি",
        body: [
          "Paid resources unlock in your library immediately after payment is confirmed by the gateway. Free resources unlock the moment you save them to your account.",
          "You can download from your library any time, on any device, with no expiry.",
        ],
      },
      {
        heading: "What you receive",
        headingBn: "কী পাবেন",
        body: [
          "Each product page lists the exact format (e.g. 'PDF (152 pages)'), language, page count and included files before you pay, so you know precisely what to expect.",
        ],
      },
      {
        heading: "Updates",
        headingBn: "আপডেট",
        body: [
          "When a publication is substantially updated, existing buyers receive the updated version in their library at no extra cost. The 'Updated' date on each product page shows the latest revision.",
        ],
      },
      {
        heading: "Technical requirements",
        headingBn: "প্রযুক্তিগত প্রয়োজনীয়তা",
        body: [
          "A modern browser and a PDF reader are all you need. Spreadsheet-based templates open in Google Sheets, Microsoft Excel or LibreOffice.",
        ],
      },
    ],
  },
  copyright: {
    eyebrow: "Copyright Notice",
    title: "Who owns what, and fair use",
    titleBn: "কী কার মালিকানা এবং ন্যায্য ব্যবহার",
    updated: "Last updated: February 2026",
    intro:
      "All Edueyedia publications, articles, covers and platform design are original works. We also respect the copyright of researchers and publishers whose work we cite.",
    introBn:
      "এডুইডিয়ার সকল প্রকাশনা, আর্টিকেল, কভার ও প্ল্যাটফর্ম ডিজাইন মৌলিক সৃষ্টিকর্ম। আমরা যাদের গবেষণা উদ্ধৃত করি, তাদের স্বত্বও সম্মান করি।",
    sections: [
      {
        heading: "Our work",
        headingBn: "আমাদের সৃষ্টিকর্ম",
        body: [
          "Content on Edueyedia is protected by copyright. You may quote short excerpts with attribution for study or review purposes.",
          "Republishing, reselling or redistributing Edueyedia publications — in whole or in part — without written permission is not allowed.",
        ],
      },
      {
        heading: "Others' work",
        headingBn: "অন্যের সৃষ্টিকর্ম",
        body: [
          "Where we cite studies, papers or data, we link to the original source and follow academic citation practice. If you believe your work has been used in a way that requires credit or removal, contact us and we will correct it promptly.",
        ],
      },
      {
        heading: "Reporting infringement",
        headingBn: "স্বত্ব লঙ্ঘনের অভিযোগ",
        body: [
          "If you hold rights to material you believe appears on Edueyedia without authorisation, email us with the details and we will investigate and remove it if required.",
        ],
      },
    ],
  },
  disclaimer: {
    eyebrow: "Disclaimer",
    title: "Knowledge, not a guarantee",
    titleBn: "জ্ঞান, নিশ্চয়তা নয়",
    updated: "Last updated: February 2026",
    intro:
      "Edueyedia publishes educational guidance in good faith. Outcomes — admissions, scholarships, publications, exam scores — depend on many factors beyond any guide.",
    introBn:
      "এডুইডিয়া সদিচ্ছার সঙ্গে শিক্ষামূলক গাইড প্রকাশ করে। ফলাফল — ভর্তি, স্কলারশিপ, প্রকাশনা, পরীক্ষার স্কোর — অনেক কারণের ওপর নির্ভর করে।",
    sections: [
      {
        heading: "Educational purposes only",
        headingBn: "শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে",
        body: [
          "Our guides, templates and articles are educational resources, not official advice from universities, funding bodies or publishers. Always confirm requirements against the official source before applying or submitting.",
        ],
      },
      {
        heading: "Scholarships & deadlines",
        headingBn: "স্কলারশিপ ও ডেডলাইন",
        body: [
          "Scholarship information is compiled from official announcements and updated regularly, but programmes change. Verify every deadline and eligibility criterion on the official website before acting.",
        ],
      },
      {
        heading: "No liability for outcomes",
        headingBn: "ফলাফলের দায় নেই",
        body: [
          "We cannot guarantee admission, funding, publication acceptance or any other outcome. Use the resources as tools, and make your own decisions with the best available official information.",
        ],
      },
    ],
  },
};

/** Route path for a legal page key (matches src/main.tsx routes). */
function legalPath(page: LegalPageKey): string {
  switch (page) {
    case "refund":
      return "/refund-policy";
    case "digital-product":
      return "/digital-product-policy";
    default:
      return `/${page}`;
  }
}

export default function LegalPage({ page }: { page: LegalPageKey }) {
  const doc = DOCS[page];

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title={`${doc.eyebrow} — Edueyedia`}
        description={`${doc.title}. ${doc.intro}`}
        path={legalPath(page)}
      />
      <Navbar />
      <main className="pt-32 pb-24 sm:pt-36">
        {/* Header */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-[-8%] h-80 w-80 rounded-full bg-teal/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl px-6">
            <Reveal>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft transition-colors hover:text-navy dark:text-slate-400 dark:hover:text-white"
              >
                <ArrowLeft className="size-3.5" /> Back to Edueyedia
              </Link>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-navy text-gold dark:bg-teal dark:text-navy-deep">
                  <Scale className="size-5" />
                </span>
                <p className="text-xs font-bold tracking-[0.24em] text-teal uppercase dark:text-teal-bright">
                  {doc.eyebrow}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <h1 className="font-serif mt-6 text-4xl leading-[1.1] text-navy text-balance sm:text-5xl dark:text-slate-50">
                {doc.title}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-bangla mt-3 text-xl leading-relaxed text-ink-soft dark:text-slate-300">
                {doc.titleBn}
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <p className="mt-5 text-xs font-semibold tracking-wide text-ink-soft uppercase dark:text-slate-400">
                {doc.updated}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Body */}
        <section className="mx-auto max-w-3xl px-6 pt-12">
          <Reveal>
            <div className="rounded-3xl border border-hairline bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-navy-surface">
              <p className="text-base leading-relaxed text-ink dark:text-slate-200">
                {doc.intro}
              </p>
              <p className="font-bangla mt-3 text-base leading-relaxed text-ink-soft dark:text-slate-400">
                {doc.introBn}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 flex flex-col">
            {doc.sections.map((s, i) => (
              <Reveal key={s.heading} delay={0.04 * i}>
                <div
                  className={cn(
                    "py-8",
                    i > 0 && "border-t border-hairline dark:border-white/10",
                  )}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-2xl text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="font-serif text-2xl text-navy dark:text-slate-100">
                        {s.heading}
                      </h2>
                      <p className="font-bangla mt-0.5 text-[13px] text-teal dark:text-teal-bright">
                        {s.headingBn}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 pl-0 sm:pl-12">
                    {s.body.map((p, j) => (
                      <p
                        key={j}
                        className="text-[15px] leading-[1.85] text-ink-soft dark:text-slate-300"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-3xl border border-hairline bg-cool p-6 sm:flex-row sm:items-center dark:border-white/10 dark:bg-navy-surface/40">
              <div>
                <p className="font-serif text-lg text-navy dark:text-slate-100">
                  Questions about this policy?
                </p>
                <p className="font-bangla mt-1 text-sm text-ink-soft dark:text-slate-400">
                  আমাদের সাথে যোগাযোগ করুন — আমরা দ্রুত উত্তর দিই।
                </p>
              </div>
              <Link
                to="/contact"
                className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep"
              >
                Contact us
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
