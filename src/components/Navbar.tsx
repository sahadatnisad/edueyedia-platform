import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen, Menu, UserRound, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Subjects", to: "/subjects" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const accountTarget = isAuthenticated
    ? "/dashboard"
    : "/auth?returnTo=/dashboard";

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-hairline bg-white/85 shadow-[0_8px_30px_-12px_rgba(15,34,56,0.18)] backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-navy-deep/80",
          scrolled ? "h-12 px-3 sm:px-4" : "h-14 px-4 sm:px-5",
        )}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-teal font-serif text-base text-white">
            N
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-[0.18em] text-navy dark:text-slate-100">
              NCTB HUB
            </span>
            <span className="mt-0.5 hidden text-[9px] font-semibold tracking-[0.14em] text-ink-soft uppercase sm:block dark:text-slate-400">
              Learn &middot; Practice &middot; Master
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "link-underline rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-navy dark:text-slate-300 dark:hover:text-white",
                  isActive && "text-navy dark:text-white",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            className="hidden rounded-full px-3 sm:inline-flex"
            size="sm"
          >
            <Link to="/subjects">
              <BookOpen className="mr-1.5 size-3.5" />
              Subjects
            </Link>
          </Button>
          <Button
            asChild
            className="ml-1 hidden rounded-full px-4 sm:inline-flex"
            size="sm"
          >
            <Link to={accountTarget}>
              {isAuthenticated ? "Dashboard" : "Get Started"}
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden rounded-full text-ink-soft hover:text-navy sm:inline-flex dark:text-slate-300 dark:hover:text-white"
            aria-label="Account"
            onClick={() => navigate(accountTarget)}
          >
            <UserRound className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          className="w-[85%] max-w-sm p-0 sm:max-w-sm"
        >
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-xl bg-teal font-serif text-base text-white">
                  N
                </span>
                <span className="text-sm font-bold tracking-[0.18em]">
                  NCTB HUB
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setMenuOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium text-navy transition-colors hover:bg-muted dark:text-slate-100"
              >
                {link.label}
                <ArrowRight className="size-4 text-teal" />
              </Link>
            ))}
            <div className="mt-3 border-t border-border pt-5 dark:border-white/10">
              <Button
                asChild
                className="w-full rounded-full"
                size="lg"
                onClick={() => setMenuOpen(false)}
              >
                <Link to={accountTarget}>
                  {isAuthenticated ? "My Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
