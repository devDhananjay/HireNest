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
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ],
};

function IconRail({ role, pathname, onNavigate }: { role: UserRole; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex max-h-[calc(100vh-7rem)] flex-col items-center gap-4 overflow-y-auto py-3">
      {nav[role].map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
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
  const { session, ready, notifications, jobs, companies, candidates, markNotificationRead, markAllNotificationsRead, setSession } = useDemo();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);

  const mine = notifications.filter((item) => item.userId === session?.id);
  const unread = mine.filter((item) => !item.read).length;
  const pills = nav[role];

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
      <header className="sticky top-0 z-20 flex h-[5rem] items-center gap-5 bg-[#f3f4f8]/78 px-5 backdrop-blur-xl lg:px-8">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
          <Menu />
        </Button>
        <Logo href={nav[role][0].href} />
        <nav className="hidden max-w-[min(52vw,40rem)] items-center gap-0.5 overflow-x-auto rounded-full bg-white/90 p-1.5 shadow-soft md:flex">
          {pills.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-[13px] font-medium transition duration-300",
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
        <div className="ml-auto flex items-center gap-2">
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
              className="icon-orb size-11"
              aria-label="Messages"
              onClick={() => {
                setMailOpen((v) => !v);
                setBellOpen(false);
              }}
            >
              <Mail className="size-4" />
            </button>
            {mailOpen ? (
              <div className="absolute right-0 z-30 mt-2 w-80 rounded-[1.5rem] bg-white p-3 shadow-lift">
                <div className="flex items-center justify-between px-2">
                  <p className="text-sm font-medium">Messages</p>
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
                    <p className="p-3 text-sm text-muted-foreground">No messages in this demo inbox yet.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className="relative">
            <button
              type="button"
              className="icon-orb size-11"
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
              <div className="absolute right-0 z-30 mt-2 w-80 rounded-[1.5rem] bg-white p-3 shadow-lift">
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
          <Avatar className="size-11 shadow-soft">
            <AvatarFallback className="bg-black text-xs font-semibold text-white">
              {initials(session?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={logout} aria-label="Log out">
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>
      <div className="flex">
        <aside className="sticky top-[5rem] hidden h-[calc(100vh-5rem)] w-24 shrink-0 px-2 lg:block">
          <IconRail role={role} pathname={pathname} />
        </aside>
        <main className="min-w-0 flex-1 px-5 pb-16 pt-3 sm:px-8 lg:px-10">{children}</main>
      </div>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 bg-[#f3f4f8] p-4">
          <SheetHeader>
            <SheetTitle>
              <Logo href={nav[role][0].href} />
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-2">
            {nav[role].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-full bg-white px-4 py-2.5 text-sm shadow-soft">
                {item.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
