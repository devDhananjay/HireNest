"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bell,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  Bookmark,
  UserRound,
  BarChart3,
  ClipboardList,
  Mail,
  Search,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { initials } from "@/lib/format";
import { useDemo } from "@/lib/store";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const nav: Record<UserRole, { href: string; label: string; icon: typeof LayoutDashboard }[]> = {
  candidate: [
    { href: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/candidate/profile", label: "Profile", icon: UserRound },
    { href: "/candidate/jobs", label: "Jobs", icon: Briefcase },
    { href: "/candidate/applications", label: "Applications", icon: ClipboardList },
    { href: "/candidate/saved-jobs", label: "Saved jobs", icon: Bookmark },
    { href: "/candidate/interviews", label: "Interviews", icon: Calendar },
  ],
  employer: [
    { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employer/company-profile", label: "Company", icon: Building2 },
    { href: "/employer/jobs", label: "Jobs", icon: Briefcase },
    { href: "/employer/jobs/create", label: "Post a job", icon: FileText },
    { href: "/employer/applications", label: "Applications", icon: ClipboardList },
    { href: "/employer/candidates", label: "Candidates", icon: Users },
  ],
  recruiter: [
    { href: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/recruiter/candidates", label: "Candidates", icon: Users },
    { href: "/recruiter/jobs", label: "Jobs", icon: Briefcase },
    { href: "/recruiter/pipeline", label: "Pipeline", icon: KanbanSquare },
    { href: "/recruiter/interviews", label: "Interviews", icon: Calendar },
    { href: "/recruiter/clients", label: "Clients", icon: Building2 },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
    { href: "/admin/applications", label: "Applications", icon: ClipboardList },
    { href: "/admin/companies", label: "Companies", icon: Building2 },
    { href: "/admin/recruiters", label: "Recruiters", icon: UserRound },
    { href: "/admin/articles", label: "Articles", icon: FileText },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ],
};

const roleLabel: Record<UserRole, string> = {
  candidate: "Candidate",
  employer: "Employer",
  recruiter: "Recruiter",
  admin: "Admin",
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function IconRail({ role, pathname, onNavigate }: { role: UserRole; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex max-h-[calc(100vh-7rem)] flex-col items-center gap-4 overflow-y-auto py-3">
      {nav[role].map((item) => {
        const active = isActivePath(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            onClick={onNavigate}
            className={cn(
              "flex size-12 items-center justify-center rounded-full transition duration-300",
              active
                ? "bg-black text-white shadow-[0_10px_22px_rgba(17,17,17,0.22)]"
                : "bg-white text-muted-foreground shadow-soft hover:-translate-y-0.5 hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready, notifications, jobs, companies, candidates, leads, inquiries, markNotificationRead, markAllNotificationsRead, setSession } = useDemo();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);

  const mine = notifications.filter((item) => item.userId === session?.id);
  const unread = mine.filter((item) => !item.read).length;
  const inbox = useMemo(() => {
    if (role === "admin") {
      return inquiries.slice(0, 8).map((item) => ({
        id: item.id,
        title: item.topic || "Contact inquiry",
        body: `${item.name}: ${item.message}`,
      }));
    }
    if (role === "recruiter" || role === "employer") {
      return leads.slice(0, 8).map((item) => ({
        id: item.id,
        title: `${item.companyName} · ${item.status}`,
        body: item.hiringNeed,
      }));
    }
    return mine.slice(0, 8).map((item) => ({
      id: item.id,
      title: item.title,
      body: item.body,
    }));
  }, [inquiries, leads, mine, role]);
  const pills = nav[role];
  const mobileTabs = pills.slice(0, 4);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    const jobHits = jobs
      .filter((job) => job.title.toLowerCase().includes(q) || job.location.toLowerCase().includes(q))
      .slice(0, 4)
      .map((job) => ({ href: `/jobs/${job.slug}`, label: job.title, meta: "Job" }));
    const companyHits =
      role === "candidate"
        ? []
        : companies
            .filter((company) => company.name.toLowerCase().includes(q))
            .slice(0, 3)
            .map((company) => ({ href: `/companies`, label: company.name, meta: "Company" }));
    const candidateHits =
      role === "candidate"
        ? []
        : candidates
            .filter((candidate) => candidate.name.toLowerCase().includes(q) || candidate.skills.some((s) => s.toLowerCase().includes(q)))
            .slice(0, 3)
            .map((candidate) => ({
              href: role === "employer" ? "/employer/candidates" : "/recruiter/candidates",
              label: candidate.name,
              meta: "Candidate",
            }));
    return [...jobHits, ...companyHits, ...candidateHits];
  }, [candidates, companies, jobs, query, role]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    router.push("/login");
    router.push("/");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f8]">
        <p className="text-sm text-muted-foreground">Loading workspace…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f8]">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-2.5 bg-[#f3f4f8]/78 px-4 backdrop-blur-xl sm:h-[5rem] sm:gap-5 sm:px-5 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 rounded-full bg-white shadow-soft lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </Button>
        <Logo href={nav[role][0].href} className="min-w-0" />
        <nav className="hidden max-w-[min(52vw,40rem)] items-center gap-0.5 overflow-x-auto rounded-full bg-white/90 p-1.5 shadow-soft md:flex">
          {pills.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap transition duration-300",
                  active
                    ? "bg-black text-white shadow-[0_8px_18px_rgba(17,17,17,0.18)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div className="relative hidden max-w-xs lg:block">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-11 w-56 rounded-full bg-white pr-4 pl-10 text-sm shadow-soft outline-none"
            />
            {results.length ? (
              <div className="absolute top-[3.25rem] z-30 w-full rounded-2xl bg-white p-2 shadow-lift">
                {results.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setQuery("")}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-muted"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.meta}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative">
            <button
              type="button"
              className="icon-orb size-10 sm:size-11"
              aria-label="Messages"
              onClick={() => {
                setMailOpen((v) => !v);
                setBellOpen(false);
              }}
            >
              <Mail className="size-4" />
            </button>
            {mailOpen ? (
              <div className="absolute right-0 z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-[1.5rem] bg-white p-3 shadow-lift">
                <div className="flex items-center justify-between px-2">
                  <p className="text-sm font-medium">
                    {role === "admin" ? "Inquiries" : role === "candidate" ? "Updates" : "Hiring requests"}
                  </p>
                </div>
                <div className="mt-2 max-h-80 space-y-2 overflow-auto">
                  {inbox.length ? (
                    inbox.map((item) => (
                      <div key={item.id} className="w-full rounded-xl bg-muted/60 p-3 text-left">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.body}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-sm text-muted-foreground">Inbox is empty in this demo.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className="relative">
            <button
              type="button"
              className="icon-orb size-10 sm:size-11"
              onClick={() => {
                setBellOpen((v) => !v);
                setMailOpen(false);
              }}
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {unread ? <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-black" /> : null}
            </button>
            {bellOpen ? (
              <div className="absolute right-0 z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-[1.5rem] bg-white p-3 shadow-lift">
                <div className="flex items-center justify-between px-2">
                  <p className="text-sm font-medium">Notifications</p>
                  {unread ? (
                    <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={markAllNotificationsRead}>
                      Mark all read
                    </button>
                  ) : null}
                </div>
                <div className="mt-2 max-h-80 space-y-2 overflow-auto">
                  {mine.length ? (
                    mine.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => markNotificationRead(item.id)}
                        className="w-full rounded-xl bg-muted/60 p-3 text-left"
                      >
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.body}</p>
                      </button>
                    ))
                  ) : (
                    <p className="p-3 text-sm text-muted-foreground">No notifications yet.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <Avatar className="hidden size-11 shadow-soft sm:flex">
            <AvatarFallback className="bg-black text-xs font-semibold text-white">
              {initials(session?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" className="hidden rounded-full sm:inline-flex" onClick={logout} aria-label="Log out">
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>
      <div className="flex">
        <aside className="sticky top-[5rem] hidden h-[calc(100vh-5rem)] w-24 shrink-0 px-2 lg:block">
          <IconRail role={role} pathname={pathname} />
        </aside>
        <main className="min-w-0 flex-1 px-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-2 sm:px-8 sm:pb-16 sm:pt-3 lg:px-10">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.04] bg-[#f3f4f8]/92 px-3 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
        aria-label="Primary"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 rounded-[1.35rem] bg-white p-1.5 shadow-soft">
          {mobileTabs.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 rounded-[1.05rem] px-1 py-2.5 transition duration-300",
                  active ? "bg-black text-white shadow-[0_10px_20px_rgba(17,17,17,0.18)]" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="max-w-full truncate text-[10px] font-medium tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(22rem,92vw)] gap-0 border-none bg-[#f3f4f8] p-0 shadow-lift data-[side=left]:sm:max-w-[22rem] [&>*]:min-h-0"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(80%_90%_at_20%_-10%,rgba(255,255,255,0.95),transparent)]" />
          <SheetHeader className="relative gap-4 p-5 pb-3">
            <div className="flex items-center justify-between gap-3">
              <Logo href={nav[role][0].href} />
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-full bg-white shadow-soft"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <span className="text-lg leading-none">×</span>
              </Button>
            </div>
            <SheetTitle className="sr-only">Workspace navigation</SheetTitle>
            <SheetDescription className="sr-only">Switch between {roleLabel[role]} workspace pages</SheetDescription>
            <div className="flex items-center gap-3 rounded-[1.35rem] bg-white p-3.5 shadow-soft">
              <Avatar className="size-12 shadow-soft">
                <AvatarFallback className="bg-black text-sm font-semibold text-white">
                  {initials(session?.name ?? "U")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-[1.05rem] font-semibold tracking-tight">{session?.name}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{roleLabel[role]} workspace</p>
              </div>
            </div>
          </SheetHeader>

          <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search workspace"
                className="h-12 w-full rounded-full bg-white pr-4 pl-10 text-sm shadow-soft outline-none"
              />
              {results.length ? (
                <div className="absolute top-[3.35rem] z-30 w-full rounded-2xl bg-white p-2 shadow-lift">
                  {results.map((item) => (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      onClick={() => {
                        setQuery("");
                        setMobileOpen(false);
                      }}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm hover:bg-muted"
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.meta}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <p className="mb-2 px-1 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">Navigate</p>
            <nav className="flex flex-col gap-1.5">
              {nav[role].map((item, index) => {
                const active = isActivePath(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ animationDelay: `${0.03 + index * 0.035}s` }}
                    className={cn(
                      "drawer-link flex items-center gap-3 rounded-[1.2rem] px-3 py-3 transition duration-300",
                      active
                        ? "bg-black text-white shadow-[0_12px_24px_rgba(17,17,17,0.2)]"
                        : "bg-white text-foreground shadow-soft active:scale-[0.985]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full",
                        active ? "bg-white/12" : "bg-[#f3f4f8] text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-medium tracking-tight">{item.label}</span>
                    <ChevronRight className={cn("size-4", active ? "text-white/55" : "text-muted-foreground/70")} />
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                void logout();
              }}
              className="mt-auto flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3.5 text-sm font-medium text-foreground shadow-soft"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
