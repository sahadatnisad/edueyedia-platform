import { Link, NavLink, Outlet } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  BookOpen,
  FileText,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PenLine,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/resources", label: "Resources", icon: FileText, end: false },
  { to: "/admin/research", label: "Research", icon: FlaskConical, end: false },
  { to: "/admin/blog", label: "Blog", icon: BookOpen, end: false },
  { to: "/admin/courses", label: "Courses", icon: GraduationCap, end: false },
  { to: "/admin/authors", label: "Authors", icon: UserRound, end: false },
];

export function AdminShell() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#F6F7F9] dark:bg-navy-deep">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-hairline bg-white dark:border-white/10 dark:bg-navy-surface lg:flex">
        <Link
          to="/admin"
          className="flex items-center gap-2.5 border-b border-hairline px-5 py-5 dark:border-white/10"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-navy text-sm font-black text-gold dark:bg-teal dark:text-navy-deep">
            E
          </span>
          <span>
            <span className="block font-serif text-base leading-none font-bold text-navy dark:text-slate-100">
              EDUEYEDIA
            </span>
            <span className="mt-0.5 block text-[9px] font-bold tracking-[0.2em] text-teal uppercase dark:text-teal-bright">
              Admin Console
            </span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-navy text-white dark:bg-teal dark:text-navy-deep"
                    : "text-ink-soft hover:bg-cool hover:text-navy dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white",
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-hairline p-3 dark:border-white/10">
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal dark:text-teal-bright">
              {(user?.name ?? "A")[0]?.toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-navy dark:text-slate-100">
                {user?.name ?? "Admin"}
              </p>
              <p className="truncate text-[10px] text-ink-soft dark:text-slate-400">
                {user?.email ?? "admin"}
              </p>
            </div>
          </div>
          <div className="mt-1 flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 flex-1 rounded-full text-xs"
            >
              <Link to="/">
                <PenLine className="size-3.5" /> View site
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-full text-xs"
              onClick={() => signOut()}
            >
              <LogOut className="size-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-hairline bg-white/90 px-4 py-3 backdrop-blur lg:hidden dark:border-white/10 dark:bg-navy-deep/90">
          <Link to="/admin" className="font-serif text-lg font-bold text-navy dark:text-slate-100">
            EDUEYEDIA <span className="text-teal">Admin</span>
          </Link>
          <div className="flex gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                    isActive
                      ? "bg-navy text-white dark:bg-teal dark:text-navy-deep"
                      : "text-ink-soft hover:bg-cool dark:text-slate-400",
                  )
                }
              >
                <item.icon className="size-3.5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminShell;

