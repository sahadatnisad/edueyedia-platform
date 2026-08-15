import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSite } from "@/components/site/SiteContext";
import {
  articles,
  resources,
  scholarships,
} from "@/data/catalog";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Hash,
} from "lucide-react";

interface SearchEntry {
  id: string;
  title: string;
  subtitle: string;
  group: "Articles" | "Resources" | "Scholarships" | "Topics";
  to: string;
  value: string;
}

const TOPICS: { title: string; subtitle: string; to: string; value: string }[] = [
  {
    title: "Research",
    subtitle: "গবেষণা — proposals, methodology, publishing",
    to: "/resources?tab=research",
    value: "research গবেষণা proposal methodology thesis publishing",
  },
  {
    title: "Scholarships",
    subtitle: "স্কলারশিপ — funded study, applications",
    to: "/resources?tab=scholarships",
    value: "scholarships স্কলারশিপ funded fellowship grants",
  },
  {
    title: "Academic Writing",
    subtitle: "অ্যাকাডেমিক রাইটিং — SOP, citations, phrases",
    to: "/resources?tab=academic-writing",
    value: "academic writing অ্যাকাডেমিক রাইটিং sop citation essay",
  },
  {
    title: "Study Abroad",
    subtitle: "বিদেশে উচ্চশিক্ষা — admissions, tests, budgets",
    to: "/resources?tab=study-abroad",
    value: "study abroad বিদেশে উচ্চশিক্ষা ielts toefl admission",
  },
  {
    title: "Career",
    subtitle: "ক্যারিয়ার — CV, transitions, research careers",
    to: "/resources?tab=career",
    value: "career ক্যারিয়ার cv job research assistant",
  },
  {
    title: "Free Resources",
    subtitle: "The Edueyedia Library — free templates & checklists",
    to: "/resources?tab=free",
    value: "free resources library templates checklists ফ্রি",
  },
  {
    title: "Insights",
    subtitle: "জ্ঞান, গাইড ও বিশ্লেষণ — articles & guides",
    to: "/insights",
    value: "insights articles blog জ্ঞান গাইড বিশ্লেষণ",
  },
];

export function SearchCommand() {
  const { searchOpen, setSearchOpen } = useSite();
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "/" && !searchOpen) {
        const tag = e.target as HTMLElement;
        if (tag.tagName !== "INPUT" && tag.tagName !== "TEXTAREA") {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen, setSearchOpen]);

  const entries = useMemo<SearchEntry[]>(() => {
    const resourceEntries: SearchEntry[] = resources.map((r) => ({
      id: `r-${r.slug}`,
      title: r.titleBn ?? r.title,
      subtitle: `${r.title} • ${r.tag} • ${r.kind === "free" ? "Free" : `৳${r.price}`}`,
      group: "Resources",
      to: `/resources/${r.slug}`,
      value: `${r.title} ${r.titleBn ?? ""} ${r.tag} ${r.tagBn ?? ""} ${r.summary} ${r.format} ${r.category}`,
    }));

    const articleEntries: SearchEntry[] = articles.map((a) => ({
      id: `a-${a.slug}`,
      title: a.title,
      subtitle: `${a.titleBn ?? ""} • ${a.categoryLabel} • ${a.readingTime}`,
      group: "Articles",
      to: `/insights/${a.slug}`,
      value: `${a.title} ${a.titleBn ?? ""} ${a.categoryLabel} ${a.excerpt} ${a.keywords.join(" ")}`,
    }));

    const scholarshipEntries: SearchEntry[] = scholarships.map((s) => ({
      id: `s-${s.slug}`,
      title: s.name,
      subtitle: `${s.country} • ${s.degree} • ${s.funding} • Deadline ${s.deadline}`,
      group: "Scholarships",
      to: "/resources?tab=scholarships",
      value: `${s.name} ${s.country} ${s.degree} ${s.funding} ${s.deadline} ${s.region} scholarship স্কলারশিপ`,
    }));

    const topicEntries: SearchEntry[] = TOPICS.map((t, i) => ({
      id: `t-${i}`,
      title: t.title,
      subtitle: t.subtitle,
      group: "Topics",
      to: t.to,
      value: t.value,
    }));

    return [...articleEntries, ...resourceEntries, ...scholarshipEntries, ...topicEntries];
  }, []);

  const groups: SearchEntry["group"][] = ["Articles", "Resources", "Scholarships", "Topics"];

  return (
    <CommandDialog
      open={searchOpen}
      onOpenChange={setSearchOpen}
      title="Search Edueyedia"
      description="Search resources, articles, scholarships and topics"
      className="sm:max-w-2xl"
    >
      <CommandInput placeholder="কী খুঁজছেন? Research, Scholarship, SOP..." />
      <CommandList className="max-h-[420px]">
        <CommandEmpty className="py-10 text-sm text-muted-foreground">
          No results found — try a broader term like{" "}
          <span className="font-bangla">গবেষণা</span> or “SOP”.
        </CommandEmpty>
        {groups.map((group) => {
          const items = entries.filter((e) => e.group === group);
          if (items.length === 0) return null;
          return (
            <CommandGroup key={group} heading={group}>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.value}
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate(item.to);
                  }}
                  className="flex items-start gap-3 py-3"
                >
                  {item.group === "Articles" && (
                    <BookOpen className="mt-0.5 size-4 shrink-0 text-teal" />
                  )}
                  {item.group === "Resources" && (
                    <FileText className="mt-0.5 size-4 shrink-0 text-gold" />
                  )}
                  {item.group === "Scholarships" && (
                    <GraduationCap className="mt-0.5 size-4 shrink-0 text-sky-600 dark:text-sky-300" />
                  )}
                  {item.group === "Topics" && (
                    <Hash className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  )}
                  <span className="flex flex-col gap-0.5">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {item.subtitle}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
