import { useParams, Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageMeta } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronRight, BookOpen } from "lucide-react";

const SUBJECT_DATA: Record<string, { name: string; nameBn: string; description: string; levels: Record<string, { books: { title: string; titleBn: string; units: { title: string; titleBn: string; lessons: { title: string; titleBn: string; free: boolean }[] }[] }[] }> }> = {
  english: {
    name: "English",
    nameBn: "ইংরেজি",
    description: "Complete SSC & HSC English curriculum — Grammar, Vocabulary, Reading, Writing, Listening & Speaking.",
    levels: {
      SSC: {
        books: [
          {
            title: "English 1st Paper",
            titleBn: "ইংরেজি ১ম পত্র",
            units: [
              {
                title: "Unit 1: Social Relations",
                titleBn: "Unit 1: সামাজিক সম্পর্ক",
                lessons: [
                  { title: "Lesson 1: Longing and Belonging", titleBn: "পাঠ ১: আকাঙ্ক্ষা ও অধিকার", free: true },
                  { title: "Lesson 2: The Value of Kindness", titleBn: "পাঠ ২: দয়ার মূল্য", free: true },
                  { title: "Lesson 3: Rights and Responsibilities", titleBn: "পাঠ ৩: অধিকার ও দায়িত্ব", free: false },
                ],
              },
              {
                title: "Unit 2: Culture and Identity",
                titleBn: "Unit 2: সংস্কৃতি ও পরিচয়",
                lessons: [
                  { title: "Lesson 4: Preserving Heritage", titleBn: "পাঠ ৪: ঐতিহ্য সংরক্ষণ", free: false },
                  { title: "Lesson 5: Art and Expression", titleBn: "পাঠ ৫: শিল্প ও অভিব্যক্তি", free: false },
                ],
              },
            ],
          },
        ],
      },
      HSC: {
        books: [
          {
            title: "English 1st Paper",
            titleBn: "ইংরেজি ১ম পত্র",
            units: [
              {
                title: "Unit 1: Communication",
                titleBn: "Unit 1: যোগাযোগ",
                lessons: [
                  { title: "Lesson 1: The Art of Listening", titleBn: "পাঠ ১: শ্রবণের শিল্প", free: true },
                ],
              },
            ],
          },
        ],
      },
    },
  },
};

export default function SubjectDetail() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const subject = SUBJECT_DATA[subjectId ?? ""];

  if (!subject) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-navy-deep">
        <Navbar />
        <main className="mx-auto max-w-5xl px-6 pt-32 pb-20 text-center">
          <h1 className="font-serif text-3xl font-bold text-navy dark:text-slate-50">
            Subject Not Found
          </h1>
          <p className="mt-3 text-ink-soft dark:text-slate-400">
            This subject is not available yet.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/subjects">Browse Subjects</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title={`${subject.name} — NCTB AI Learning Hub`}
        description={subject.description}
        path={`/subjects/${subjectId}`}
      />
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-ink-soft dark:text-slate-400">
          <Link to="/subjects" className="hover:text-navy dark:hover:text-white">Subjects</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-navy font-medium dark:text-slate-100">{subject.name}</span>
        </nav>

        <div className="mt-6">
          <h1 className="font-serif text-3xl font-bold text-navy sm:text-4xl dark:text-slate-50">
            {subject.name}
          </h1>
          <p className="font-bangla text-lg text-teal dark:text-teal-bright">{subject.nameBn}</p>
          <p className="mt-3 max-w-2xl text-ink-soft dark:text-slate-400">{subject.description}</p>
        </div>

        {Object.entries(subject.levels).map(([level, levelData]) => (
          <div key={level} className="mt-12">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-teal px-3 py-1 text-xs font-bold text-white dark:bg-teal-bright dark:text-navy-deep">
                {level}
              </span>
              <h2 className="font-serif text-xl font-bold text-navy dark:text-slate-50">
                {level} English
              </h2>
            </div>

            {levelData.books.map((book, bookIdx) => (
              <div key={bookIdx} className="mt-6">
                <Card className="border-hairline bg-white dark:border-white/10 dark:bg-navy-surface">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-navy/5 text-navy dark:bg-white/5 dark:text-white">
                        <BookOpen className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-navy dark:text-slate-50">
                          {book.title}
                        </h3>
                        <p className="font-bangla text-sm text-ink-soft dark:text-slate-400">
                          {book.titleBn}
                        </p>
                      </div>
                    </div>

                    {book.units.map((unit, unitIdx) => (
                      <div key={unitIdx} className="mt-6">
                        <h4 className="text-sm font-bold text-navy dark:text-slate-100">
                          {unit.title}
                        </h4>
                        <p className="font-bangla text-xs text-ink-soft dark:text-slate-400">
                          {unit.titleBn}
                        </p>

                        <div className="mt-3 flex flex-col gap-2">
                          {unit.lessons.map((lesson, lessonIdx) => (
                            <div
                              key={lessonIdx}
                              className="flex items-center justify-between rounded-xl border border-hairline bg-ivory/50 px-4 py-3 transition-colors hover:border-teal/30 hover:bg-teal/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-bright/30 dark:hover:bg-teal-bright/5"
                            >
                              <div>
                                <p className="text-sm font-medium text-navy dark:text-slate-100">
                                  {lesson.title}
                                </p>
                                <p className="font-bangla text-xs text-ink-soft dark:text-slate-400">
                                  {lesson.titleBn}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {lesson.free ? (
                                  <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold text-teal dark:bg-teal-bright/10 dark:text-teal-bright">
                                    Free
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-ink-soft dark:bg-white/10 dark:text-slate-400">
                                    Premium
                                  </span>
                                )}
                                <Link
                                  to={lesson.free ? `/learn/lesson-${subjectId}-${bookIdx}-${unitIdx}-${lessonIdx}` : "/auth?returnTo=/dashboard"}
                                  className="flex size-7 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-teal/90 dark:bg-teal-bright dark:text-navy-deep dark:hover:bg-teal-bright/90"
                                >
                                  <ArrowRight className="size-3.5" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}
