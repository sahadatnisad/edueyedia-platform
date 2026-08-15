import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { BookCover } from "@/components/BookCover";
import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSite } from "@/components/site/SiteContext";
import { useAuth } from "@/hooks/use-auth";
import { CATEGORY_LABELS, getResource } from "@/data/catalog";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Check,
  Download,
  Eye,
  FileText,
  Languages,
  Lock,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "inside", label: "Inside this resource" },
  { id: "preview", label: "Preview" },
  { id: "audience", label: "Who it is for" },
  { id: "faq", label: "FAQ" },
  { id: "reviews", label: "Reviews" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const resource = slug ? getResource(slug) : undefined;
  const [section, setSection] = useState<SectionId>("overview");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const { addToCart, setCartOpen } = useSite();
  const { isAuthenticated } = useAuth();
  const purchase = useMutation(api.library.purchase);
  const owns = useQuery(api.library.ownsResource, { resourceId: slug ?? "" });
  const navigate = useNavigate();

  if (!resource) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-navy-deep">
        <Navbar />
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-serif text-3xl text-navy dark:text-slate-100">
            Resource not found
          </p>
          <p className="text-sm text-ink-soft dark:text-slate-400">
            It may have been renamed or retired.
          </p>
          <Button asChild className="mt-2 rounded-full">
            <Link to="/resources">
              <ArrowLeft className="size-4" /> Back to the library
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const free = resource.kind === "free";
  const owned = owns === true;

  const handleBuy = () => {
    if (owned) {
      navigate("/dashboard");
      return;
    }
    addToCart(resource);
    setCartOpen(true);
    toast.success("Added to cart", {
      description: `${resource.title} is ready to check out.`,
    });
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      if (!isAuthenticated) {
        navigate(`/auth?returnTo=/resources/${resource.slug}`);
        return;
      }
      await purchase({
        resourceIds: [resource.slug],
        kind: "free",
        pricePaid: 0,
      });
      toast.success("Added to your library", {
        description: `${resource.title} is now yours, free forever.`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { description: "Please try again." });
    } finally {
      setClaiming(false);
    }
  };

  const related = resource.related.map(getResource).filter(Boolean).slice(0, 3);

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <Navbar />
      <main className="pt-28 pb-24 sm:pt-32">
        <div className="mx-auto max-w-6xl px-6">
          {/* breadcrumb */}
          <Reveal>
            <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-soft dark:text-slate-400">
              <Link to="/resources" className="link-underline hover:text-navy dark:hover:text-white">
                Resource Library
              </Link>
              <span>/</span>
              <span className="text-navy dark:text-slate-200">{CATEGORY_LABELS[resource.category]}</span>
              <span>/</span>
              <span className="line-clamp-1">{resource.title}</span>
            </nav>
          </Reveal>

          {/* Two-column product */}
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left — cover + preview */}
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative mx-auto max-w-md">
                  <div
                    aria-hidden
                    className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-teal/10 via-transparent to-gold/15 blur-2xl"
                  />
                  <BookCover resource={resource} className="relative mx-auto max-w-sm" />
                  <div className="mt-6 flex justify-center gap-3">
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setPreviewOpen(true)}
                    >
                      <Eye className="size-4" /> Preview sample pages
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — details */}
            <div className="lg:col-span-6">
              <Reveal delay={0.1}>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-teal/10 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-teal uppercase dark:text-teal-bright">
                    {resource.tag}
                  </span>
                  {free && (
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-[#8a681f] uppercase dark:text-gold">
                      Free
                    </span>
                  )}
                  {resource.bestseller && (
                    <span className="rounded-full bg-navy px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-gold uppercase dark:bg-teal dark:text-navy-deep">
                      Bestseller
                    </span>
                  )}
                </div>

                <h1 className="font-serif mt-4 text-3xl leading-tight text-navy text-balance sm:text-[40px] dark:text-slate-50">
                  {resource.title}
                </h1>
                {resource.titleBn && (
                  <p className="font-bangla mt-2 text-lg text-ink-soft dark:text-slate-300">
                    {resource.titleBn}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-4",
                          i < Math.round(resource.rating)
                            ? "fill-gold text-gold"
                            : "text-hairline dark:text-white/20",
                        )}
                      />
                    ))}
                  </span>
                  <span className="text-sm text-ink-soft dark:text-slate-400">
                    {resource.rating.toFixed(1)} · {resource.reviewCount} reviews
                  </span>
                </div>

                <p className="mt-5 text-base leading-relaxed text-ink-soft dark:text-slate-300">
                  {resource.description}
                </p>

                {/* meta */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { icon: FileText, label: "Format", value: resource.format },
                    { icon: Languages, label: "Language", value: resource.language },
                    { icon: BookOpen, label: "Pages", value: `${resource.pages}` },
                    { icon: CalendarDays, label: "Updated", value: resource.updated.replace("Updated ", "") },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-hairline bg-white p-3.5 dark:border-white/10 dark:bg-navy-surface"
                    >
                      <Icon className="size-4 text-teal dark:text-teal-bright" />
                      <p className="mt-2 text-[10px] font-bold tracking-[0.14em] text-ink-soft uppercase dark:text-slate-400">
                        {label}
                      </p>
                      <p className="mt-0.5 text-[13px] font-semibold text-navy dark:text-slate-100">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* purchase card */}
                <div className="mt-8 rounded-3xl border border-hairline bg-white p-6 shadow-[0_20px_48px_-28px_rgba(15,34,56,0.35)] dark:border-white/10 dark:bg-navy-surface">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      {free ? (
                        <span className="font-serif text-4xl font-semibold text-teal dark:text-teal-bright">
                          Free
                        </span>
                      ) : (
                        <>
                          <span className="font-serif text-4xl font-semibold text-navy dark:text-slate-50">
                            ৳{resource.price}
                          </span>
                          {resource.compareAt && (
                            <span className="text-lg text-ink-soft line-through">
                              ৳{resource.compareAt}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {!free && resource.compareAt && (
                      <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-[#8a681f] dark:text-gold">
                        Save ৳{resource.compareAt - resource.price}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col gap-2.5">
                    {owned ? (
                      <Button
                        size="lg"
                        className="w-full rounded-full bg-teal hover:bg-teal/90 dark:bg-teal dark:text-navy-deep"
                        onClick={() => navigate("/dashboard")}
                      >
                        <Check className="size-4" /> In your library — open it
                      </Button>
                    ) : free ? (
                      <Button
                        size="lg"
                        className="w-full rounded-full"
                        onClick={handleClaim}
                        disabled={claiming}
                      >
                        <Download className="size-4" />
                        {claiming ? "Adding…" : "Add to library — Free"}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full rounded-full"
                        onClick={handleBuy}
                      >
                        <ShoppingBag className="size-4" />
                        Buy now — ৳{resource.price}
                      </Button>
                    )}
                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-ink-soft dark:text-slate-400">
                      <Lock className="size-3" />
                      Instant digital delivery · Secure checkout · Lifetime access
                    </p>
                  </div>

                  <div className="mt-5 border-t border-hairline pt-4 dark:border-white/10">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-ink-soft uppercase dark:text-slate-400">
                      What's included
                    </p>
                    <ul className="mt-3 grid gap-2">
                      {resource.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[13px] text-navy dark:text-slate-200">
                          <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-teal dark:text-teal-bright" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Below — tabs */}
          <div className="mt-20">
            <Reveal>
              <div className="no-scrollbar -mx-6 flex gap-1 overflow-x-auto border-b border-hairline px-6 sm:mx-0 sm:px-0 dark:border-white/10">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSection(s.id)}
                    className={cn(
                      "relative shrink-0 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors",
                      section === s.id
                        ? "text-navy dark:text-white"
                        : "text-ink-soft hover:text-navy dark:text-slate-400 dark:hover:text-white",
                    )}
                  >
                    {s.label}
                    {section === s.id && (
                      <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-gold" />
                    )}
                  </button>
                ))}
              </div>
            </Reveal>

            <div className="mt-8 max-w-3xl">
              {section === "overview" && (
                <Reveal key="overview">
                  <p className="font-serif text-2xl leading-relaxed text-navy dark:text-slate-100">
                    {resource.summary}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-soft dark:text-slate-300">
                    {resource.description} Written in clear Bangla with English
                    technical terms, it is designed to be used the same day you
                    download it — no fluff, no filler.
                  </p>
                </Reveal>
              )}

              {section === "inside" && (
                <Reveal key="inside">
                  <ul className="flex flex-col gap-3">
                    {resource.includes.map((item, i) => (
                      <li key={item} className="flex items-start gap-3 rounded-2xl border border-hairline bg-white p-4 dark:border-white/10 dark:bg-navy-surface">
                        <span className="font-serif text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-sm font-medium text-navy dark:text-slate-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {section === "preview" && (
                <Reveal key="preview">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {resource.previewPages.map((page) => (
                      <button
                        key={page.label}
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="group rounded-2xl border border-hairline bg-white p-4 text-left transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40"
                      >
                        <p className="text-[10px] font-bold tracking-[0.16em] text-teal uppercase dark:text-teal-bright">
                          {page.label}
                        </p>
                        <div className="mt-3 flex flex-col gap-1.5">
                          {page.lines.map((line, j) => (
                            <span
                              key={j}
                              className={cn(
                                "block h-1.5 rounded-full",
                                j === 0 ? "w-full" : j % 2 === 0 ? "w-3/4" : "w-5/6",
                              )}
                              style={{
                                background:
                                  "color-mix(in srgb, var(--color-ink-soft) 30%, transparent)",
                              }}
                            />
                          ))}
                        </div>
                        <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal dark:text-teal-bright">
                          <Eye className="size-3" /> View sample
                        </p>
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-ink-soft dark:text-slate-400">
                    Sample pages only — the full document is delivered after purchase.
                  </p>
                </Reveal>
              )}

              {section === "audience" && (
                <Reveal key="audience">
                  <p className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-ink-soft uppercase dark:text-slate-400">
                    <Users className="size-4 text-teal" /> This is for
                  </p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {resource.audience.map((a) => (
                      <li key={a} className="flex items-start gap-3 text-sm text-navy dark:text-slate-200">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {section === "faq" && (
                <Reveal key="faq">
                  <div className="flex flex-col gap-4">
                    {resource.faqs.length === 0 && (
                      <p className="text-sm text-ink-soft dark:text-slate-400">
                        No FAQs yet — email us and we'll answer within a day.
                      </p>
                    )}
                    {resource.faqs.map((f) => (
                      <div key={f.q} className="rounded-2xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
                        <p className="text-sm font-semibold text-navy dark:text-slate-100">{f.q}</p>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-slate-400">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {section === "reviews" && (
                <Reveal key="reviews">
                  <div className="flex flex-col gap-4">
                    {resource.reviews.length === 0 && (
                      <p className="text-sm text-ink-soft dark:text-slate-400">
                        Be the first to review this resource after you read it.
                      </p>
                    )}
                    {resource.reviews.map((r) => (
                      <figure key={r.name} className="rounded-2xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("size-3.5", i < r.rating ? "fill-gold text-gold" : "text-hairline dark:text-white/20")} />
                          ))}
                        </div>
                        <blockquote className="mt-3 text-sm leading-relaxed text-navy dark:text-slate-200">
                          “{r.text}”
                        </blockquote>
                        <figcaption className="mt-4 flex items-center gap-2 text-xs text-ink-soft dark:text-slate-400">
                          <span className="font-semibold text-navy dark:text-slate-100">{r.name}</span>
                          · {r.role}
                          <BadgeCheck className="ml-1 size-3.5 text-teal" />
                          Verified
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <Reveal>
                <div className="flex items-end justify-between">
                  <h2 className="font-serif text-3xl text-navy dark:text-slate-50">Related resources</h2>
                  <Link
                    to="/resources"
                    className="link-underline hidden items-center gap-1 text-sm font-semibold text-navy sm:inline-flex dark:text-slate-100"
                  >
                    All resources <ArrowRight className="size-4" />
                  </Link>
                </div>
              </Reveal>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r, i) =>
                  r ? (
                    <Reveal key={r.slug} delay={0.07 * i}>
                      <ResourceCard resource={r} />
                    </Reveal>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              Sample pages — {resource.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            {resource.previewPages.map((page) => (
              <div key={page.label} className="rounded-2xl border border-hairline bg-ivory/70 p-6 dark:border-white/10 dark:bg-navy-deep">
                <p className="text-[10px] font-bold tracking-[0.2em] text-teal uppercase dark:text-teal-bright">
                  {page.label}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {page.lines.map((line, j) => (
                    <p key={j} className={cn("text-sm leading-relaxed text-ink dark:text-slate-200", j === 0 && "font-semibold")}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-ink-soft dark:text-slate-400">
              This is a preview — the full {resource.pages}-page document arrives after purchase.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
