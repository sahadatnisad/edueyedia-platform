import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-slate-300">
      <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-white opacity-[0.05]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-white/10 font-serif text-lg text-teal-bright">
                N
              </span>
              <span className="text-xl font-bold tracking-[0.18em] text-white">
                NCTB HUB
              </span>
            </Link>
            <p className="mt-3 text-sm font-semibold tracking-[0.14em] text-teal-bright uppercase">
              Learn &middot; Practice &middot; Master
            </p>
            <p className="font-bangla mt-3 max-w-sm text-[15px] leading-relaxed text-slate-400">
              NCTB পাঠ্যক্রমের পাঠ-ভিত্তিক ডিজিটাল সঙ্গী — SSC ও HSC
              ইংরেজি শিখুন, অনুশীলন করুন এবং AI টিউটরের সহায়তায়
              দক্ষতা অর্জন করুন।
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                Learn
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                <li>
                  <Link to="/subjects" className="link-underline text-sm text-slate-400 hover:text-white">
                    Subjects
                  </Link>
                </li>
                <li>
                  <Link to="/subjects" className="link-underline text-sm text-slate-400 hover:text-white">
                    SSC English
                  </Link>
                </li>
                <li>
                  <Link to="/subjects" className="link-underline text-sm text-slate-400 hover:text-white">
                    HSC English
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                Support
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                <li>
                  <Link to="/#how-it-works" className="link-underline text-sm text-slate-400 hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="link-underline text-sm text-slate-400 hover:text-white">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                Legal
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                <li>
                  <a href="#" className="link-underline text-sm text-slate-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="link-underline text-sm text-slate-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            &copy; 2026 NCTB AI Learning Hub. All rights reserved.
          </p>
          <p className="font-bangla text-xs text-slate-500">
            বাংলায় তৈরি — Built for Bangladeshi students
          </p>
        </div>
      </div>
    </footer>
  );
}
