import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

const TOPICS: { label: string; bn: string; to: string }[] = [
  { label: "Research", bn: "গবেষণা", to: "/resources?tab=research" },
  { label: "Scholarships", bn: "স্কলারশিপ", to: "/resources?tab=scholarships" },
  { label: "Academic Writing", bn: "অ্যাকাডেমিক রাইটিং", to: "/resources?tab=academic-writing" },
  { label: "Thesis", bn: "থিসিস", to: "/resources?tab=research" },
  { label: "Study Abroad", bn: "বিদেশে পড়াশোনা", to: "/resources?tab=study-abroad" },
  { label: "Career", bn: "ক্যারিয়ার", to: "/resources?tab=career" },
  { label: "Templates", bn: "টেমপ্লেট", to: "/resources?tab=free" },
  { label: "Free Resources", bn: "ফ্রি রিসোর্স", to: "/resources?tab=free" },
];

export function TopicBar() {
  return (
    <div className="border-y border-hairline bg-white/60 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-6xl">
        <div className="no-scrollbar flex items-stretch gap-1 overflow-x-auto px-4 py-3 sm:px-6">
          <span className="mr-2 hidden shrink-0 items-center self-center text-[10px] font-bold tracking-[0.2em] text-ink-soft uppercase sm:flex dark:text-slate-400">
            Topics
          </span>
          {TOPICS.map((topic) => (
            <Link
              key={topic.label}
              to={topic.to}
              className="group flex shrink-0 items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-ink-soft transition-all hover:border-hairline hover:bg-white hover:text-navy dark:text-slate-300 dark:hover:border-white/15 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <span className="font-bangla hidden text-[13px] text-teal sm:inline dark:text-teal-bright">
                {topic.bn}
              </span>
              {topic.label}
              <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
