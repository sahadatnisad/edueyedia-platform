import { Link } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageMeta } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Flame,
  Target,
  Trophy,
} from "lucide-react";

const STATS = [
  { label: "Lessons Completed", value: "0", icon: BookOpen, color: "text-teal" },
  { label: "Practice Score", value: "—", icon: Target, color: "text-gold" },
  { label: "Day Streak", value: "0", icon: Flame, color: "text-orange-500" },
  { label: "Mastery Level", value: "—", icon: Trophy, color: "text-purple-500" },
];

const QUICK_ACTIONS = [
  {
    icon: BookOpen,
    title: "Continue Learning",
    description: "Pick up where you left off",
    href: "/subjects/english",
    color: "bg-teal/10 text-teal dark:bg-teal-bright/10 dark:text-teal-bright",
  },
  {
    icon: Target,
    title: "Today's Practice",
    description: "Answer questions and build mastery",
    href: "/subjects/english",
    color: "bg-gold/10 text-gold dark:bg-gold/10 dark:text-gold",
  },
  {
    icon: Brain,
    title: "Revision Due",
    description: "Review concepts you might forget",
    href: "/subjects/english",
    color: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400",
  },
  {
    icon: Flame,
    title: "My Mistakes",
    description: "Turn wrong answers into mastery",
    href: "/subjects/english",
    color: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title="Dashboard — NCTB AI Learning Hub"
        path="/dashboard"
      />
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        {/* Welcome */}
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-teal uppercase">
            Dashboard
          </p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-navy sm:text-3xl dark:text-slate-50">
            {user?.name ? `Welcome back, ${user.name}` : "Welcome to your learning hub"}
          </h1>
          <p className="font-bangla mt-1 text-ink-soft dark:text-slate-400">
            Here's what you should study today.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label} className="border-hairline bg-white dark:border-white/10 dark:bg-navy-surface">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex size-9 items-center justify-center rounded-xl bg-muted dark:bg-white/5 ${stat.color}`}>
                    <stat.icon className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy dark:text-slate-50">
                      {stat.value}
                    </p>
                    <p className="text-xs text-ink-soft dark:text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-10">
          <h2 className="font-serif text-lg font-bold text-navy dark:text-slate-50">
            Quick Actions
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.title} to={action.href}>
                <Card className="group border-hairline bg-white transition-all hover:shadow-md hover:border-teal/30 dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal-bright/30">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`flex size-11 items-center justify-center rounded-xl ${action.color}`}>
                      <action.icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-navy group-hover:text-teal dark:text-slate-50 dark:group-hover:text-teal-bright">
                        {action.title}
                      </h3>
                      <p className="text-xs text-ink-soft dark:text-slate-400">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-teal dark:group-hover:text-teal-bright" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* My Book Progress */}
        <div className="mt-10">
          <h2 className="font-serif text-lg font-bold text-navy dark:text-slate-50">
            My Book Progress
          </h2>
          <Card className="mt-4 border-hairline bg-white dark:border-white/10 dark:bg-navy-surface">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="font-serif text-base font-bold text-navy dark:text-slate-50">
                    SSC English 1st Paper
                  </h3>
                  <p className="text-xs text-ink-soft dark:text-slate-400">
                    English &middot; SSC &middot; Class 10
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-muted dark:bg-white/10">
                  <div className="h-2.5 rounded-full bg-teal transition-all dark:bg-teal-bright" style={{ width: "0%" }} />
                </div>
                <span className="text-xs font-semibold text-ink-soft dark:text-slate-400">
                  0%
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-soft dark:text-slate-400">
                Start your first lesson to begin tracking progress.
              </p>
              <Button asChild className="mt-4 rounded-full" size="sm">
                <Link to="/subjects/english">
                  Start Learning
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Empty state for revision */}
        <div className="mt-10 rounded-2xl border border-dashed border-hairline bg-white/50 p-8 text-center dark:border-white/10 dark:bg-navy-surface/50">
          <CheckCircle className="mx-auto size-10 text-teal/30 dark:text-teal-bright/30" />
          <h3 className="mt-3 font-serif text-lg font-bold text-navy dark:text-slate-50">
            All caught up!
          </h3>
          <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
            No revision due today. Keep practicing to build your streak.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
