import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { BookCover } from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getResource } from "@/data/catalog";
import {
  ArrowRight,
  BookMarked,
  CalendarDays,
  Download,
  Layers,
  LogOut,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const library = useQuery(api.library.myLibrary);
  const removeFromLibrary = useMutation(api.library.removeFromLibrary);
  const navigate = useNavigate();

  const owned = useMemo(
    () =>
      (library ?? [])
        .map((row) => ({ row, resource: getResource(row.resourceId) }))
        .filter((x) => x.resource),
    [library],
  );

  const paidCount = owned.filter((x) => x.row.kind === "paid").length;
  const freeCount = owned.filter((x) => x.row.kind === "free").length;
  const totalSpent = owned.reduce(
    (sum, x) => sum + (x.row.kind === "paid" ? x.row.pricePaid : 0),
    0,
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleRemove = async (slug: string, title: string) => {
    await removeFromLibrary({ resourceId: slug });
    toast.success("Removed from library", { description: title });
  };

  const handleDownload = (title: string) => {
    toast.success("Download started", {
      description: `${title} — check your downloads folder.`,
    });
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "E";

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <Navbar />
      <main className="pt-32 pb-24 sm:pt-36">
        <div className="mx-auto max-w-6xl px-6">
          {/* header */}
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-navy text-sm font-bold text-gold dark:bg-teal dark:text-navy-deep">
                    {initials}
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-teal uppercase dark:text-teal-bright">
                      Signed in workspace
                    </p>
                    <h1 className="mt-0.5 font-serif text-3xl text-navy dark:text-slate-50">
                      Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                    </h1>
                  </div>
                </div>
                <p className="font-bangla mt-3 text-sm text-ink-soft dark:text-slate-400">
                  আপনার লাইব্রেরি — কেনা ও ফ্রি রিসোর্স সব এক জায়গায়।
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="self-start rounded-full sm:self-auto"
                onClick={handleSignOut}
              >
                <LogOut className="size-4" /> Sign out
              </Button>
            </div>
          </Reveal>

          {/* stats */}
          <Reveal delay={0.1}>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: BookMarked, label: "Resources", value: owned.length },
                { icon: Layers, label: "Paid", value: paidCount },
                { icon: Sparkles, label: "Free", value: freeCount },
                { icon: Wallet, label: "Value", value: `৳${totalSpent}` },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-3xl border border-hairline bg-white p-5 dark:border-white/10 dark:bg-navy-surface"
                >
                  <Icon className="size-4 text-teal dark:text-teal-bright" />
                  <p className="mt-3 font-serif text-2xl font-semibold text-navy dark:text-slate-50">
                    {value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold tracking-[0.16em] text-ink-soft uppercase dark:text-slate-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* library */}
          <div className="mt-12">
            <Reveal>
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-serif text-3xl text-navy dark:text-slate-50">My Library</h2>
                  <p className="font-bangla mt-1 text-sm text-ink-soft dark:text-slate-400">
                    আপনার কেনা ও সংগ্রহ করা রিসোর্স
                  </p>
                </div>
                <Link
                  to="/resources"
                  className="link-underline hidden items-center gap-1 text-sm font-semibold text-navy sm:inline-flex dark:text-slate-100"
                >
                  Browse more <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>

            {library === undefined ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-3xl bg-muted" />
                ))}
              </div>
            ) : owned.length === 0 ? (
              <Reveal delay={0.1}>
                <div className="mt-8 flex flex-col items-center gap-5 rounded-[2rem] border border-dashed border-hairline px-6 py-16 text-center dark:border-white/15">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-teal/10">
                    <BookMarked className="size-8 text-teal dark:text-teal-bright" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl text-navy dark:text-slate-100">
                      Your library is waiting
                    </p>
                    <p className="font-bangla mt-2 max-w-md text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                      গবেষণা গাইড, স্কলারশিপ ম্যাপ বা ফ্রি টেমপ্লেট — প্রথম রিসোর্সটি যোগ করুন
                      আপনার লাইব্রেরিতে।
                    </p>
                  </div>
                  <Button asChild className="rounded-full">
                    <Link to="/resources">
                      Explore the library <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {owned.map(({ row, resource }, i) => (
                  <Reveal key={row.resourceId} delay={Math.min(i * 0.05, 0.25)}>
                    <div className="group flex h-full flex-col rounded-3xl border border-hairline bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_48px_-24px_rgba(15,34,56,0.25)] dark:border-white/10 dark:bg-navy-surface dark:hover:border-teal/40">
                      <div className="flex gap-4">
                        <Link to={`/resources/${resource!.slug}`} className="w-20 shrink-0">
                          <BookCover resource={resource!} compact />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-center gap-2">
                            <span
                              className={
                                row.kind === "free"
                                  ? "rounded-full bg-gold/15 px-2 py-0.5 text-[9px] font-bold tracking-[0.14em] text-[#8a681f] uppercase dark:text-gold"
                                  : "rounded-full bg-teal/10 px-2 py-0.5 text-[9px] font-bold tracking-[0.14em] text-teal uppercase dark:text-teal-bright"
                              }
                            >
                              {row.kind === "free" ? "Free" : "Paid"}
                            </span>
                            <span className="text-[10px] font-medium text-ink-soft dark:text-slate-400">
                              {resource!.tag}
                            </span>
                          </div>
                          <Link
                            to={`/resources/${resource!.slug}`}
                            className="mt-2 line-clamp-2 font-serif text-[15px] leading-snug font-semibold text-navy transition-colors hover:text-teal dark:text-slate-100 dark:hover:text-teal-bright"
                          >
                            {resource!.title}
                          </Link>
                          <p className="mt-auto flex items-center gap-1.5 pt-2 text-[11px] text-ink-soft dark:text-slate-400">
                            <CalendarDays className="size-3" />
                            {new Date(row.purchasedAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2 border-t border-hairline pt-4 dark:border-white/10">
                        <Button
                          size="sm"
                          className="flex-1 rounded-full"
                          onClick={() => handleDownload(resource!.title)}
                        >
                          <Download className="size-3.5" /> Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => handleRemove(resource!.slug, resource!.title)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
