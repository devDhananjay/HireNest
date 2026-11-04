"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Mail, Menu, X } from "lucide-react";
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
                className={cn("icon-orb size-11", light && "bg-white/12 text-white shadow-none")}
                aria-label="Messages"
              >
                <Mail className="size-4" />
              </Link>
              <Link
                href={ROLE_HOME[session.role]}
                className={cn("icon-orb size-11", light && "bg-white/12 text-white shadow-none")}
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
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-11 rounded-full lg:hidden",
            light ? "bg-white/12 text-white hover:bg-white/18 hover:text-white" : "bg-white shadow-soft",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-black/5 bg-[#f3f4f8] lg:hidden">
          <div className="container-shell flex max-h-[calc(100svh-4rem)] flex-col gap-2 overflow-y-auto py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {NAV_PUBLIC.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-3.5 text-[15px] font-medium transition",
                  pathname === item.href ? "bg-black text-white" : "bg-white text-foreground shadow-soft",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href={session ? ROLE_HOME[session.role] : "/login"}
                onClick={() => {
                  setOpen(false);
                  router.refresh();
                }}
                className="rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-center text-[15px] font-medium"
              >
                {session ? "Dashboard" : "Login"}
              </Link>
              <Link
                href={session ? ROLE_HOME[session.role] : "/register"}
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-black px-4 py-3.5 text-center text-[15px] font-medium text-white"
              >
                {session ? "Open app" : "Get Started"}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
