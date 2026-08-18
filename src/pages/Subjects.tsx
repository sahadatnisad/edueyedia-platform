import { Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageMeta } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Lock } from "lucide-react";

const SUBJECTS_DATA = [
  {
    slug: "english",
    name: "English",
    nameBn: "ইংরেজি",
    description: "SSC & HSC English — Grammar, Vocabulary, Reading, Writing, Listening & Speaking",
    levels: ["SSC", "HSC"],
    available: true,
    icon: "📝",
  },
  {
    slug: "ict",
    name: "ICT",
    nameBn: "তথ্য ও যোগাযোগ প্রযুক্তি",
    description: "Information & Communication Technology for SSC & HSC",
    levels: ["SSC", "HSC"],
    available: false,
    icon: "💻",
  },
  {
    slug: "bangla",
    name: "Bangla",
    nameBn: "বাংলা",
    description: "বাংলা সাহিত্য ও ব্যাকরণ — SSC & HSC",
    levels: ["SSC", "HSC"],
    available: false,
    icon: "📖",
  },
  {
    slug: "mathematics",
    name: "Mathematics",
    nameBn: "গণিত",
    description: "Mathematics for SSC & HSC",
    levels: ["SSC", "HSC"],
    available: false,
    icon: "🔢",
  },
  {
    slug: "science",
    name: "Science",
    nameBn: "বিজ্ঞান",
    description: "Science for SSC & HSC",
    levels: ["SSC", "HSC"],
    available: false,
    icon: "🔬",
  },
];

export default function Subjects() {
  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title="Subjects — NCTB AI Learning Hub"
        description="Browse NCTB subjects available on the learning hub. Start with SSC & HSC English."
        path="/subjects"
      />
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <p className="text-[11px] font-bold tracking-[0.2em] text-teal uppercase">
          NCTB Curriculum
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-navy sm:text-4xl dark:text-slate-50">
          Choose a Subject
        </h1>
        <p className="font-bangla mt-3 max-w-xl text-ink-soft dark:text-slate-400">
          Select a subject to start learning. Each subject follows the official
          NCTB book structure lesson by lesson.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {SUBJECTS_DATA.map((subject) => (
            <div
              key={subject.slug}
              className={`group relative flex flex-col rounded-2xl border p-6 transition-all ${
                subject.available
                  ? "border-teal/30 bg-white shadow-sm hover:shadow-md hover:border-teal/50 dark:border-teal-bright/30 dark:bg-navy-surface dark:hover:border-teal-bright/50"
                  : "border-hairline bg-white/50 dark:border-white/10 dark:bg-navy-surface/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl">{subject.icon}</div>
                {!subject.available && (
                  <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-ink-soft dark:bg-white/10 dark:text-slate-400">
                    <Lock className="size-3" />
                    Coming Soon
                  </span>
                )}
              </div>

              <h2 className="mt-4 font-serif text-xl font-bold text-navy dark:text-slate-50">
                {subject.name}
              </h2>
              <p className="font-bangla text-sm text-ink-soft dark:text-slate-400">
                {subject.nameBn}
              </p>
              <p className="mt-2 flex-1 text-sm text-ink-soft dark:text-slate-400">
                {subject.description}
              </p>

              <div className="mt-4 flex items-center gap-2">
                {subject.levels.map((level) => (
                  <span
                    key={level}
                    className="rounded-full bg-teal/10 px-2.5 py-0.5 text-[10px] font-bold text-teal dark:bg-teal-bright/10 dark:text-teal-bright"
                  >
                    {level}
                  </span>
                ))}
              </div>

              {subject.available && (
                <Button asChild className="mt-5 w-full rounded-full" size="sm">
                  <Link to={`/subjects/${subject.slug}`}>
                    <BookOpen className="mr-1.5 size-3.5" />
                    View Lessons
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
