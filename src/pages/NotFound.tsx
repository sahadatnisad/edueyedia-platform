import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-ivory dark:bg-navy-deep"
    >
      <Navbar />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white" />
        <div aria-hidden className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 font-serif text-[16rem] leading-none text-navy opacity-[0.04] select-none dark:text-white"
        >
          404
        </span>
        <div className="relative text-center">
          <p className="text-xs font-bold tracking-[0.28em] text-teal uppercase dark:text-teal-bright">
            Page not found
          </p>
          <h1 className="font-serif mt-4 text-4xl text-navy text-balance sm:text-5xl dark:text-slate-50">
            This page isn't in the library.
          </h1>
          <p className="font-bangla mt-4 text-base leading-relaxed text-ink-soft dark:text-slate-300">
            আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে বা কখনো ছিল না।
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/resources"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-navy px-7 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-navy/90 dark:bg-teal dark:text-navy-deep"
            >
              Explore Resources <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-hairline bg-white px-7 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
            >
              <ArrowLeft className="size-4" /> Back home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
