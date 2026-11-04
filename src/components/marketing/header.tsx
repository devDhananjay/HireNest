"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Bell, Mail, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { NAV_PUBLIC, ROLE_HOME } from "@/lib/constants";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useDemo();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overHero = isHome && !scrolled && !open;
  const light = overHero;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300",
        overHero
          ? "bg-transparent"
          : "border-b border-black/5 bg-[#f3f4f8]/88 shadow-[0_10px_30px_rgba(17,17,17,0.04)] backdrop-blur-xl",
      )}
    >
      <div className="container-shell flex h-16 items-center justify-between sm:h-[4.35rem]">
        <Logo light={light} />
        <nav
          className={cn(
            "hidden items-center gap-0.5 rounded-full p-1.5 lg:flex",
            light ? "bg-white/10 backdrop-blur-md" : "bg-white/90 shadow-soft",
          )}
        >
          {NAV_PUBLIC.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[13px] font-medium transition duration-300 xl:px-4",
                  active
                    ? light
                      ? "bg-white text-black"
                      : "bg-black text-white shadow-[0_8px_18px_rgba(17,17,17,0.18)]"
                    : light
                      ? "text-white/70 hover:bg-white/10 hover:text-white"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <>
              <Link
                href={ROLE_HOME[session.role]}
                className={cn(
                  "icon-orb size-11",
                  light && "border-white/35 bg-white/18 text-white shadow-none backdrop-blur-md",
                )}
                aria-label="Messages"
              >
                <Mail className="size-4" />
              </Link>
              <Link
                href={ROLE_HOME[session.role]}
                className={cn(
                  "icon-orb size-11",
                  light && "border-white/35 bg-white/18 text-white shadow-none backdrop-blur-md",
                )}
                aria-label="Notifications"
              >
                <Bell className="size-4" />
              </Link>
              <Link
                href={ROLE_HOME[session.role]}
                className={cn(
                  buttonVariants(),
                  "h-11 rounded-full px-5",
                  light && "bg-white text-black hover:bg-white/90",
                )}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 rounded-full px-5",
                  light && "border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants(),
                  "h-11 rounded-full px-5",
                  light && "bg-white text-black hover:bg-white/90",
                )}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
        {!open ? (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-11 rounded-full lg:hidden",
              light
                ? "bg-white/12 text-white hover:bg-white/18 hover:text-white"
                : "bg-white shadow-soft",
            )}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={false}
          >
            <Menu className="size-5" />
          </Button>
        ) : (
          <span className="size-11 lg:hidden" aria-hidden />
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[#070709]/42 backdrop-blur-[2px] animate-fade-up"
            onClick={() => setOpen(false)}
          />
          <div className="drawer-panel absolute inset-x-0 top-0 bottom-0 flex h-[100svh] flex-col overflow-hidden bg-[#f3f4f8] shadow-lift">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(70%_80%_at_50%_-20%,rgba(255,255,255,0.95),transparent)]" />
            <div className="container-shell relative flex h-16 shrink-0 items-center justify-between sm:h-[4.35rem]">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                className="size-11 rounded-full bg-white shadow-soft"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                aria-expanded={true}
              >
                <X className="size-5" />
              </Button>
            </div>

            <div className="container-shell relative flex min-h-0 flex-1 flex-col">
              <p className="mt-1 shrink-0 text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">Navigate</p>
              <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5 pb-4">
                {NAV_PUBLIC.map((item, index) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      style={{ animationDelay: `${0.04 + index * 0.045}s` }}
                      className={cn(
                        "drawer-link group flex shrink-0 items-center gap-4 rounded-[1.35rem] px-4 py-3.5 transition duration-300",
                        active
                          ? "bg-black text-white shadow-[0_14px_28px_rgba(17,17,17,0.22)]"
                          : "bg-white/90 text-foreground shadow-soft active:scale-[0.985]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold tracking-tight",
                          active ? "bg-white/12 text-white" : "bg-[#f3f4f8] text-muted-foreground",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 font-heading text-[1.15rem] font-semibold tracking-[-0.03em]">
                        {item.label}
                      </span>
                      <ArrowUpRight
                        className={cn(
                          "size-4 transition duration-300",
                          active ? "text-white/70" : "text-muted-foreground group-active:translate-x-0.5 group-active:-translate-y-0.5",
                        )}
                      />
                    </Link>
                  );
                })}
              </nav>

              <div
                className="drawer-link shrink-0 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
                style={{ animationDelay: `${0.04 + NAV_PUBLIC.length * 0.045}s` }}
              >
                <div className="rounded-[1.6rem] bg-[#111111] p-5 text-white shadow-lift">
                  <p className="text-[11px] font-medium tracking-[0.18em] text-white/45 uppercase">
                    {session ? "Workspace" : "Get started"}
                  </p>
                  <p className="mt-2 max-w-[16rem] font-heading text-[1.2rem] leading-snug font-semibold tracking-[-0.03em]">
                    {session
                      ? `Continue as ${session.name.split(" ")[0]}`
                      : "Hire smarter with HIREORA."}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link
                      href={session ? ROLE_HOME[session.role] : "/login"}
                      onClick={() => {
                        setOpen(false);
                        router.refresh();
                      }}
                      className="rounded-full bg-white/10 px-4 py-3.5 text-center text-[14px] font-medium text-white transition hover:bg-white/16"
                    >
                      {session ? "Dashboard" : "Login"}
                    </Link>
                    <Link
                      href={session ? ROLE_HOME[session.role] : "/register"}
                      onClick={() => setOpen(false)}
                      className="rounded-full bg-white px-4 py-3.5 text-center text-[14px] font-medium text-black transition hover:bg-white/92"
                    >
                      {session ? "Open app" : "Get Started"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
