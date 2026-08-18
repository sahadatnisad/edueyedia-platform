import { Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageMeta, organizationJsonLd } from "@/components/seo";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  Languages,
  Lightbulb,
  MessageCircle,
  Target,
  Trophy,
} from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "NCTB-Aligned Lessons",
    titleBn: "NCTB সমন্বিত পাঠ",
    description:
      "Every lesson follows the official NCTB book structure — same unit, same chapter, same topic as your school.",
  },
  {
    icon: Target,
    title: "Practice & Mastery",
    titleBn: "অনুশীলন ও দক্ষতা",
    description:
      "Active practice with MCQ, fill-in-the-blank, short answer, and writing tasks. Track progress and mastery separately.",
  },
  {
    icon: MessageCircle,
    title: "AI English Tutor",
    titleBn: "AI ইংরেজি টিউটর",
    description:
      "Contextual AI help inside each lesson — ask for hints, explanations, Bangla translations, or similar examples.",
  },
  {
    icon: Languages,
    title: "English + Bangla",
    titleBn: "ইংরেজি + বাংলা",
    description:
      "Learn with bilingual support. Get explanations in English, Bangla, or both based on your preference.",
  },
  {
    icon: Trophy,
    title: "Board Exam Practice",
    titleBn: "বোর্ড পরীক্ষার প্রস্তুতি",
    description:
      "Verified past board questions linked to concepts and lessons. Historical exam intelligence, not prediction.",
  },
  {
    icon: Lightbulb,
    title: "Smart Revision",
    titleBn: "স্মার্ট পুনরালোচনা",
    description:
      "Spaced repetition ensures you review at the right time. Mistakes get extra attention until mastered.",
  },
];

const SUBJECTS = [
  {
    name: "English",
    nameBn: "ইংরেজি",
    levels: "SSC + HSC",
    status: "Available Now",
    available: true,
  },
  {
    name: "ICT",
    nameBn: "আইসিটি",
    levels: "SSC + HSC",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Bangla",
    nameBn: "বাংলা",
    levels: "SSC + HSC",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Mathematics",
    nameBn: "গণিত",
    levels: "SSC + HSC",
    status: "Coming Soon",
    available: false,
  },
  {
    name: "Science",
    nameBn: "বিজ্ঞান",
    levels: "SSC + HSC",
    status: "Coming Soon",
    available: false,
  },
];

const STEPS = [
  {
    num: "01",
    title: "Open Your Book",
    description:
      "Select your level (SSC or HSC), subject, and the exact lesson you're studying in school.",
  },
  {
    num: "02",
    title: "Learn the Lesson",
    description:
      "Read the content, notice the language, understand grammar rules with clear explanations.",
  },
  {
    num: "03",
    title: "Practice Actively",
    description:
      "Answer questions, get hints before answers, and work through guided and independent practice.",
  },
  {
    num: "04",
    title: "Ask the AI Tutor",
    description:
      "Stuck? Ask for an explanation, a hint, a Bangla translation, or a similar example — contextually.",
  },
  {
    num: "05",
    title: "Track Your Mastery",
    description:
      "See your progress, review mistakes, and use spaced revision to retain what you've learned.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title="NCTB AI Learning Hub — Learn, Practice & Master Your Lessons"
        description="The NCTB curriculum companion. Interactive English lessons for SSC & HSC students with AI tutoring, practice, progress tracking, and board exam preparation."
        path="/"
        jsonLd={organizationJsonLd()}
      />
      <Navbar />

      <main>
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pt-36 pb-20 sm:pt-44 sm:pb-28">
          <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid text-navy opacity-[0.04] dark:text-white" />
          <div aria-hidden className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-teal/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-4 py-1.5 text-xs font-semibold text-teal dark:border-teal-bright/30 dark:bg-teal-bright/10 dark:text-teal-bright">
              <span className="size-1.5 rounded-full bg-teal animate-pulse" />
              SSC &amp; HSC English — Now Available
            </span>

            <h1 className="mt-8 font-serif text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl lg:text-6xl dark:text-slate-50">
              Your NCTB Lessons,
              <br />
              <span className="text-teal dark:text-teal-bright">
                Learned Better
              </span>
            </h1>

            <p className="font-bangla mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl dark:text-slate-400">
              The same book you study in school — explained more clearly,
              practised more actively, with an AI tutor that helps when
              you're stuck. Track your progress, review your mistakes, and
              prepare for board exams.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/subjects">
                  Start Learning Free
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8"
              >
                <Link to="/#how-it-works">How It Works</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-4 text-teal" />
                Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-4 text-teal" />
                Mobile-first
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-4 text-teal" />
                English + Bangla
              </span>
            </div>
          </div>
        </section>

        {/* ── How It Works ───────────────────────────────────── */}
        <section id="how-it-works" className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-[11px] font-bold tracking-[0.2em] text-teal uppercase">
              How It Works
            </p>
            <h2 className="mt-3 text-center font-serif text-3xl font-bold text-navy sm:text-4xl dark:text-slate-50">
              From Lesson to Mastery
            </h2>
            <p className="font-bangla mx-auto mt-4 max-w-xl text-center text-ink-soft dark:text-slate-400">
              পাঠ থেকে দক্ষতা পর্যন্ত — a structured learning path that
              mirrors how students actually learn.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((step) => (
                <div key={step.num} className="relative">
                  <span className="section-num">{step.num}</span>
                  <h3 className="mt-2 text-sm font-bold text-navy dark:text-slate-100">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────── */}
        <section className="bg-cool px-6 py-20 sm:py-28 dark:bg-navy-ink">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-[11px] font-bold tracking-[0.2em] text-teal uppercase">
              Features
            </p>
            <h2 className="mt-3 text-center font-serif text-3xl font-bold text-navy sm:text-4xl dark:text-slate-50">
              Everything You Need to Learn
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-hairline bg-white shadow-sm dark:border-white/10 dark:bg-navy-surface"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-teal/10 text-teal dark:bg-teal-bright/10 dark:text-teal-bright">
                      <feature.icon className="size-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-navy dark:text-slate-50">
                      {feature.title}
                    </h3>
                    <p className="font-bangla text-xs font-medium text-teal dark:text-teal-bright">
                      {feature.titleBn}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Subjects ───────────────────────────────────────── */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-[11px] font-bold tracking-[0.2em] text-teal uppercase">
              NCTB Subjects
            </p>
            <h2 className="mt-3 text-center font-serif text-3xl font-bold text-navy sm:text-4xl dark:text-slate-50">
              Start with English, Expand to All
            </h2>
            <p className="font-bangla mx-auto mt-4 max-w-xl text-center text-ink-soft dark:text-slate-400">
              English launches first. The same learning engine will power
              every NCTB subject.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SUBJECTS.map((subject) => (
                <div
                  key={subject.name}
                  className={`flex items-center justify-between rounded-2xl border p-5 transition-all ${
                    subject.available
                      ? "border-teal/30 bg-teal/5 dark:border-teal-bright/30 dark:bg-teal-bright/5"
                      : "border-hairline bg-white dark:border-white/10 dark:bg-navy-surface"
                  }`}
                >
                  <div>
                    <h3 className="font-serif text-lg font-bold text-navy dark:text-slate-50">
                      {subject.name}
                    </h3>
                    <p className="font-bangla text-xs text-ink-soft dark:text-slate-400">
                      {subject.nameBn} &middot; {subject.levels}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      subject.available
                        ? "bg-teal text-white dark:bg-teal-bright dark:text-navy-deep"
                        : "bg-muted text-ink-soft dark:bg-white/10 dark:text-slate-400"
                    }`}
                  >
                    {subject.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl rounded-3xl bg-navy px-8 py-16 text-center sm:px-16 dark:bg-teal/10">
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              Ready to Learn Smarter?
            </h2>
            <p className="font-bangla mx-auto mt-4 max-w-lg text-lg text-slate-300">
              Start with free lessons today. No credit card required.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-teal px-8 text-white hover:bg-teal/90 dark:bg-teal-bright dark:text-navy-deep dark:hover:bg-teal-bright/90"
            >
              <Link to="/subjects">
                Start Learning Free
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
