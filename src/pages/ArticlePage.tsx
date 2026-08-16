import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ArticleArt } from "@/components/ArticleArt";
import { Callout } from "@/components/Callout";
import { Timeline } from "@/components/Timeline";
import { ResourceCard } from "@/components/ResourceCard";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Hash,
} from "lucide-react";
import {
  useAllContent,
  useArticle,
  useResourcesBySlugs,
} from "@/hooks/use-content";
import { getArticle, getResource, articles as legacyArticles } from "@/data/catalog";
import { articlePath } from "@/data/navigation";
import { PageMeta } from "@/components/seo";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  // DB-backed article (research or blog, published only). Legacy fallback
  // while the first Convex payload loads; once loaded, the DB is authoritative.
  const dbArticle = useArticle(slug);
  const article =
    dbArticle ?? (dbArticle === undefined ? (slug ? getArticle(slug) : undefined) : undefined);
  const content = useAllContent();
  const relatedQuery = useResourcesBySlugs(article?.relatedResources);
  const [activeId, setActiveId] = useState<string>("");

  const headings = article?.blocks.filter(
    (b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2",
  );

  const articleJsonLd = useMemo(
    () =>
      article
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            datePublished: article.date || undefined,
            author: { "@type": "Organization", name: article.author },
            publisher: {
              "@type": "Organization",
              name: "Edueyedia",
            },
          }
        : undefined,
    [article],
  );

  useEffect(() => {
    if (!article) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    const ids = article.blocks
      .filter((b) => b.type === "h2")
      .map((b) => (b as { id: string }).id);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [article]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-navy-deep">
        <Navbar />
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-serif text-3xl text-navy dark:text-slate-100">
            Article not found
          </p>
          <Link
            to="/blog"
            className="link-underline text-sm font-semibold text-teal dark:text-teal-bright"
          >
            Back to the Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isResearch = article.category === "research";
  const indexLabel = isResearch ? "Research" : "Blog";
  const indexHref = isResearch ? "/research" : "/blog";

  const relatedResources =
    relatedQuery ??
    (article
      ? article.relatedResources.map(getResource).filter(Boolean).slice(0, 3)
      : []);
  const articles = content?.articles ?? legacyArticles;

  const moreArticles = articles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);
  const TITLES = new Set(["Dr.", "Prof.", "Mr.", "Ms.", "Mrs."]);
  const initials = article.author
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w) && !TITLES.has(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title={`${article.title} — Edueyedia`}
        description={article.excerpt}
        path={articlePath(article)}
        jsonLd={articleJsonLd}
        type="article"
      />
      <Navbar />
      <main className="pt-28 pb-24 sm:pt-32">
        <article className="mx-auto max-w-6xl px-6">
          {/* header */}
          <header className="mx-auto max-w-3xl">
            <Reveal>
              <Link
                to={indexHref}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft transition-colors hover:text-navy dark:text-slate-400 dark:hover:text-white"
              >
                <ArrowLeft className="size-3.5" /> {indexLabel}
              </Link>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-6 flex items-center gap-2">
                <span className="rounded-full bg-teal/10 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-teal uppercase dark:text-teal-bright">
                  {article.categoryLabel}
                </span>
                <span className="text-xs text-ink-soft dark:text-slate-400">{article.date}</span>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <h1 className="font-serif mt-4 text-3xl leading-[1.12] text-navy text-balance sm:text-5xl dark:text-slate-50">
                {article.title}
              </h1>
            </Reveal>
            {article.titleBn && (
              <Reveal delay={0.2}>
                <p className="font-bangla mt-3 text-xl leading-relaxed text-ink-soft dark:text-slate-300">
                  {article.titleBn}
                </p>
              </Reveal>
            )}
            <Reveal delay={0.26}>
              <div className="mt-7 flex flex-wrap items-center gap-4 border-y border-hairline py-4 dark:border-white/10">
                <span className="flex size-10 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold dark:bg-teal dark:text-navy-deep">
                  {initials || "E"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy dark:text-slate-100">
                    {article.author}
                  </p>
                  <p className="text-xs text-ink-soft dark:text-slate-400">{article.authorRole}</p>
                </div>
                <span className="ml-auto flex items-center gap-4 text-xs text-ink-soft dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" /> {article.readingTime}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="size-3.5" /> Vol. 01
                  </span>
                </span>
              </div>
            </Reveal>
          </header>

          {/* featured art */}
          <Reveal delay={0.2}>
            <div className="mt-8 aspect-[21/10] overflow-hidden rounded-3xl border border-hairline dark:border-white/10">
              <ArticleArt article={article} />
            </div>
          </Reveal>

          {/* body */}
          <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr]">
            {/* sticky TOC */}
            {headings && headings.length > 1 && (
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-ink-soft uppercase dark:text-slate-400">
                    <Hash className="size-3.5 text-teal" /> In this article
                  </p>
                  <ul className="mt-4 flex flex-col gap-1 border-l border-hairline dark:border-white/10">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={cn(
                            "-ml-px block border-l-2 py-1.5 pl-4 text-[13px] leading-snug transition-all",
                            activeId === h.id
                              ? "border-teal font-semibold text-teal dark:border-teal-bright dark:text-teal-bright"
                              : "border-transparent text-ink-soft hover:border-hairline hover:text-navy dark:text-slate-400 dark:hover:text-white",
                          )}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}

            {/* content */}
            <div className="max-w-2xl">
              {article.blocks.map((block, i) => {
                switch (block.type) {
                  case "p":
                    return (
                      <p
                        key={i}
                        className={cn(
                          "leading-[1.9] text-[16px] text-ink dark:text-slate-200",
                          i > 0 && "mt-6",
                        )}
                      >
                        {block.text}
                      </p>
                    );
                  case "h2":
                    return (
                      <h2
                        key={i}
                        id={block.id}
                        className="font-serif mt-14 mb-4 scroll-mt-28 text-2xl leading-snug text-navy sm:text-3xl dark:text-slate-50"
                      >
                        {block.text}
                      </h2>
                    );
                  case "h3":
                    return (
                      <h3
                        key={i}
                        id={block.id}
                        className="font-serif mt-10 mb-3 scroll-mt-28 text-xl leading-snug text-navy sm:text-2xl dark:text-slate-100"
                      >
                        {block.text}
                      </h3>
                    );
                  case "quote":
                    return (
                      <blockquote
                        key={i}
                        className="mt-8 mb-8 rounded-3xl border-l-4 border-gold bg-gold/8 px-6 py-6"
                      >
                        <p className="font-serif text-xl leading-relaxed text-navy italic sm:text-2xl dark:text-slate-100">
                          “{block.text}”
                        </p>
                        {block.source && (
                          <footer className="mt-3 text-xs font-semibold tracking-wide text-ink-soft uppercase dark:text-slate-400">
                            — {block.source}
                          </footer>
                        )}
                      </blockquote>
                    );
                  case "callout":
                    return (
                      <div key={i} className="mt-6 mb-6">
                        <Callout variant={block.variant} text={block.text} />
                      </div>
                    );
                  case "list":
                    return block.ordered ? (
                      <ol
                        key={i}
                        className="mt-6 flex flex-col gap-3 pl-1 text-[15px] leading-relaxed text-ink dark:text-slate-200"
                      >
                        {block.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-gold dark:bg-teal dark:text-navy-deep">
                              {j + 1}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <ul
                        key={i}
                        className="mt-6 flex flex-col gap-3 text-[15px] leading-relaxed text-ink dark:text-slate-200"
                      >
                        {block.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  case "timeline":
                    return (
                      <div key={i} className="mt-8 mb-8 rounded-3xl border border-hairline bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-navy-surface">
                        <Timeline steps={block.steps} />
                      </div>
                    );
                  case "reference":
                    return (
                      <div key={i} className="mt-10 border-t border-hairline pt-6 dark:border-white/10">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-ink-soft uppercase dark:text-slate-400">
                          References
                        </p>
                        <ol className="mt-4 flex list-none flex-col gap-2.5 pl-0">
                          {block.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-[13px] leading-relaxed text-ink-soft dark:text-slate-400">
                              <span className="font-serif text-gold">{String(j + 1).padStart(2, "0")}</span>
                              {item}
                            </li>
                          ))}
                        </ol>
                      </div>
                    );
                  default:
                    return null;
                }
              })}

              {/* author card */}
              <div className="mt-14 rounded-3xl border border-hairline bg-white p-6 dark:border-white/10 dark:bg-navy-surface">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-gold dark:bg-teal dark:text-navy-deep">
                    {initials || "E"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy dark:text-slate-100">{article.author}</p>
                    <p className="text-xs text-ink-soft dark:text-slate-400">{article.authorRole}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                  Edueyedia's editorial team publishes research-backed guides in Bangla
                  and English — written by researchers, reviewed by educators.
                </p>
              </div>
            </div>
          </div>

          {/* related resources */}
          {relatedResources.length > 0 && (
            <section className="mt-20 border-t border-hairline pt-12 dark:border-white/10">
              <div className="flex items-end justify-between">
                <h2 className="font-serif text-3xl text-navy dark:text-slate-50">
                  Resources for this insight
                </h2>
                <Link
                  to="/resources"
                  className="link-underline hidden items-center gap-1 text-sm font-semibold text-navy sm:inline-flex dark:text-slate-100"
                >
                  All resources <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedResources.map((r, i) =>
                  r ? (
                    <Reveal key={r.slug} delay={0.07 * i}>
                      <ResourceCard resource={r} />
                    </Reveal>
                  ) : null,
                )}
              </div>
            </section>
          )}

          {/* keep reading */}
          {moreArticles.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl text-navy dark:text-slate-50">Keep reading</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {moreArticles.map((a) => (
                  <Link
                    key={a.slug}
                    to={articlePath(a)}
                    className="group flex items-start gap-4 rounded-3xl border border-hairline bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
                  >
                    <div className="w-20 shrink-0 overflow-hidden rounded-xl">
                      <div className="aspect-square">
                        <ArticleArt article={a} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.16em] text-teal uppercase dark:text-teal-bright">
                        {a.categoryLabel} · {a.readingTime}
                      </p>
                      <p className="mt-1.5 font-serif text-lg leading-snug font-semibold text-navy transition-colors group-hover:text-teal dark:text-slate-100 dark:group-hover:text-teal-bright">
                        {a.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
