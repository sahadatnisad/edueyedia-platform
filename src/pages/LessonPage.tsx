import { useParams, Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { PageMeta } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronRight, CheckCircle, Circle } from "lucide-react";

const SAMPLE_ACTIVITIES = [
  {
    type: "warmup",
    title: "Warm-up",
    titleBn: "উষ্ণকর",
    content: "Before we begin, think about this: Have you ever moved to a new place and felt like you didn't belong? How did that feel?",
  },
  {
    type: "reading",
    title: "Reading",
    titleBn: "পাঠ",
    content: "Read the following text carefully. Pay attention to the main idea and supporting details.\n\n---\n\nWhen Sarah arrived at her new school in Dhaka, she felt like an outsider. Everyone seemed to know each other already. The language, the customs, even the way people greeted each other — everything was different from her small-town life.\n\nBut slowly, things began to change. A classmate named Fatima invited her to sit together during lunch. They discovered they both loved poetry. That simple connection became the beginning of a deep friendship.",
  },
  {
    type: "vocabulary",
    title: "Vocabulary",
    titleBn: "শব্দভান্ডার",
    content: "Learn these key words from the reading:\n\n• Outsider (n): A person who does not belong to a particular group\n• Custom (n): A traditional practice or usual way of doing something\n• Connection (n): A relationship between people or things",
  },
  {
    type: "grammar",
    title: "Grammar Focus: Past Tense",
    titleBn: "ব্যাকরণ: অতীতকাল",
    content: "Notice how the story uses past tense verbs:\n\n• arrived (past simple of 'arrive')\n• felt (past simple of 'feel')\n• seemed (past simple of 'seem')\n• invited (past simple of 'invite')\n• discovered (past simple of 'discover')\n\nRule: We use past tense to talk about events that happened before now.",
  },
  {
    type: "practice",
    title: "Guided Practice",
    titleBn: "নির্দেশিত অনুশীলন",
    content: "Complete the sentences using the correct past tense form:\n\n1. Sarah _____ (arrive) at her new school yesterday.\n2. She _____ (feel) like an outsider.\n3. Fatima _____ (invite) her to sit together.",
  },
  {
    type: "summary",
    title: "Lesson Summary",
    titleBn: "পাঠ সারসংক্ষেপ",
    content: "In this lesson, you:\n• Read about Sarah's experience of moving to a new school\n• Learned vocabulary: outsider, custom, connection\n• Practiced past tense verbs\n\nKey takeaway: Making connections with others can help us feel like we belong.",
  },
];

const BLOCK_ICONS: Record<string, string> = {
  warmup: "🔥",
  reading: "📖",
  vocabulary: "📚",
  grammar: "📐",
  practice: "✏️",
  summary: "✅",
};

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title="Lesson — NCTB AI Learning Hub"
        path={`/learn/${lessonId}`}
      />
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-ink-soft dark:text-slate-400">
          <Link to="/subjects" className="hover:text-navy dark:hover:text-white">Subjects</Link>
          <ChevronRight className="size-3.5" />
          <Link to="/subjects/english" className="hover:text-navy dark:hover:text-white">English</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-navy font-medium dark:text-slate-100">Lesson</span>
        </nav>

        <div className="mt-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal dark:bg-teal-bright/10 dark:text-teal-bright">
            SSC English — Unit 1
          </span>
          <h1 className="mt-4 font-serif text-2xl font-bold text-navy sm:text-3xl dark:text-slate-50">
            Longing and Belonging
          </h1>
          <p className="font-bangla mt-1 text-ink-soft dark:text-slate-400">
            পাঠ ১: আকাঙ্ক্ষা ও অধিকার
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-muted dark:bg-white/10">
            <div className="h-2 rounded-full bg-teal transition-all dark:bg-teal-bright" style={{ width: "33%" }} />
          </div>
          <span className="text-xs font-semibold text-ink-soft dark:text-slate-400">
            33% complete
          </span>
        </div>

        {/* Activity blocks */}
        <div className="mt-10 flex flex-col gap-6">
          {SAMPLE_ACTIVITIES.map((activity, idx) => (
            <Card
              key={idx}
              className="border-hairline bg-white shadow-sm dark:border-white/10 dark:bg-navy-surface"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{BLOCK_ICONS[activity.type] ?? "📝"}</span>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-navy dark:text-slate-50">
                      {activity.title}
                    </h2>
                    <p className="font-bangla text-xs text-teal dark:text-teal-bright">
                      {activity.titleBn}
                    </p>
                  </div>
                  {idx < 2 ? (
                    <CheckCircle className="ml-auto size-5 text-teal dark:text-teal-bright" />
                  ) : (
                    <Circle className="ml-auto size-5 text-muted-foreground" />
                  )}
                </div>
                <div className="prose prose-sm max-w-none text-ink-soft dark:text-slate-300 whitespace-pre-line">
                  {activity.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="rounded-full" asChild>
            <Link to="/subjects/english">
              <ArrowLeft className="mr-2 size-4" />
              Back to Lessons
            </Link>
          </Button>
          <Button className="rounded-full bg-teal text-white hover:bg-teal/90 dark:bg-teal-bright dark:text-navy-deep">
            Continue Practice
            <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
