import { useEffect, useMemo, useState } from "react";
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
import { useAllContent, useSearchContent } from "@/hooks/use-content";
import {
  articles as legacyArticles,
  resources as legacyResources,
} from "@/data/catalog";
import { courses as legacyCourses } from "@/data/courses";
import { articlePath } from "@/data/navigation";
import {
  BookOpen,
  FileText,
  FlaskConical,
  GraduationCap,
} from "lucide-react";

interface SearchEntry {
  id: string;
  title: string;
  subtitle: string;
  group: "RESEARCH" | "RESOURCES" | "BLOG" | "COURSES";
  to: string;
  value: string;
}

const GROUP_ICON: Record<SearchEntry["group"], typeof BookOpen> = {
  RESEARCH: FlaskConical,
  RESOURCES: FileText,
  BLOG: BookOpen,
  COURSES: GraduationCap,
};

export function SearchCommand() {
  const { searchOpen, setSearchOpen } = useSite();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const results = useSearchContent(q);
  const all = useAllContent();

  // Reset the query whenever the dialog opens — "adjust state when a value
  // changes" pattern (conditional on the previous open state, so it settles).
  const [prevSearchOpen, setPrevSearchOpen] = useState(searchOpen);
  if (searchOpen !== prevSearchOpen) {
    setPrevSearchOpen(searchOpen);
    if (searchOpen) setQ("");
  }

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

  // Search the published database. With no query we show the full published
  // index so the dialog is useful on open; legacy data is only a fallback
  // while the first Convex payload loads.
  const active = q.trim().length >= 2;
  const research =
    (active ? results?.research : all?.research) ?? legacyArticles.filter((a) => a.category === "research");
  const resources =
    (active ? results?.resources : all?.resources) ?? legacyResources;
  const blog =
    (active ? results?.blog : all?.blog) ??
    legacyArticles.filter((a) => a.category !== "research");
  const courses = (active ? results?.courses : all?.courses) ?? legacyCourses;

  const entries = useMemo<SearchEntry[]>(() => {
    const researchEntries: SearchEntry[] = research.map((a) => ({
      id: `r-${a.slug}`,
      title: a.title,
      subtitle: `${a.titleBn ?? ""} • ${a.categoryLabel} • ${a.readingTime}`,
      group: "RESEARCH",
      to: articlePath(a),
      value: `${a.title} ${a.titleBn ?? ""} ${a.categoryLabel} ${a.excerpt} ${a.keywords.join(" ")}`,
    }));

    const resourceEntries: SearchEntry[] = resources.map((r) => ({
      id: `p-${r.slug}`,
      title: r.titleBn ?? r.title,
      subtitle: `${r.title} • ${r.tag} • ${r.kind === "free" ? "Free" : `৳${r.price}`}`,
      group: "RESOURCES",
      to: `/resources/${r.slug}`,
      value: `${r.title} ${r.titleBn ?? ""} ${r.tag} ${r.summary} ${r.format} ${r.category}`,
    }));

    const blogEntries: SearchEntry[] = blog.map((a) => ({
      id: `b-${a.slug}`,
      title: a.title,
      subtitle: `${a.titleBn ?? ""} • ${a.categoryLabel} • ${a.readingTime}`,
      group: "BLOG",
      to: articlePath(a),
      value: `${a.title} ${a.titleBn ?? ""} ${a.categoryLabel} ${a.excerpt} ${a.keywords.join(" ")}`,
    }));

    const courseEntries: SearchEntry[] = courses.map((c) => ({
      id: `c-${c.slug}`,
      title: c.titleBn,
      subtitle: `${c.title} • ${c.category} • ${c.isFree ? "Free" : `৳${c.price}`} • ${c.duration}`,
      group: "COURSES",
      to: `/courses/${c.slug}`,
      value: `${c.title} ${c.titleBn} ${c.category} ${c.categoryBn} ${c.shortDescription}`,
    }));

    return [...researchEntries, ...resourceEntries, ...blogEntries, ...courseEntries];
  }, [research, resources, blog, courses]);

  const groups: SearchEntry["group"][] = ["RESEARCH", "RESOURCES", "BLOG", "COURSES"];

  return (
    <CommandDialog
      open={searchOpen}
      onOpenChange={setSearchOpen}
      title="Search Edueyedia"
      description="Search research, resources, blog and courses — Bangla or English"
      className="sm:max-w-2xl"
    >
      <CommandInput
        placeholder="কী খুঁজছেন? Research, Scholarship, SOP..."
        value={q}
        onValueChange={setQ}
      />
      <CommandList className="max-h-[420px]">
        <CommandEmpty className="py-10 text-sm text-muted-foreground">
          No results found — try a broader term like{" "}
          <span className="font-bangla">গবেষণা</span> or “SOP”.
        </CommandEmpty>
        {groups.map((group) => {
          const items = entries.filter((e) => e.group === group);
          if (items.length === 0) return null;
          const Icon = GROUP_ICON[group];
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
                  <Icon className="mt-0.5 size-4 shrink-0 text-teal" />
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
