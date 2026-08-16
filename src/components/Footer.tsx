import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Research", to: "/resources?tab=research" },
      { label: "Scholarships", to: "/resources?tab=scholarships" },
      { label: "Study Abroad", to: "/resources?tab=study-abroad" },
      { label: "Academic Writing", to: "/resources?tab=academic-writing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Resource Library", to: "/resources" },
      { label: "Free Library", to: "/resources?tab=free" },
      { label: "Blog", to: "/blog" },
      { label: "Collections", to: "/resources" },
    ],
  },
  {
    title: "Edueyedia",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Refund Policy", to: "/refund-policy" },
      { label: "Digital Product Policy", to: "/digital-product-policy" },
    ],
  },
];

// Social profiles are linked only when they actually exist — no placeholder
// links to facebook.com / linkedin.com / etc. (see pre-launch checklist #53).
// Add real Edueyedia profile URLs here when they go live.
const SOCIALS: { label: string; icon: LucideIcon; href: string }[] = [];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-slate-300">
      {/* texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-white opacity-[0.05]" />
      <div aria-hidden className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-teal/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-white/10 font-serif text-lg text-gold">
                E
              </span>
              <span className="text-xl font-bold tracking-[0.24em] text-white">
                EDUEYEDIA
              </span>
            </Link>
            <p className="mt-4 text-sm font-semibold tracking-[0.14em] text-gold uppercase">
              Research. Learn. Advance.
            </p>
            <p className="font-bangla mt-4 max-w-sm text-[15px] leading-relaxed text-slate-400">
              গবেষণা, শিক্ষা ও সুযোগের বিশ্বস্ত ডিজিটাল প্ল্যাটফর্ম — জ্ঞানকে সহজ করি,
              সম্ভাবনাকে এগিয়ে নিই।
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                  {col.title}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="link-underline text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © 2026 Edueyedia. All rights reserved.
          </p>
          <p className="font-bangla text-xs text-slate-500">
            বাংলায় তৈরি — Made with research in Bangladesh 🇧🇩
          </p>
        </div>
      </div>
    </footer>
  );
}
