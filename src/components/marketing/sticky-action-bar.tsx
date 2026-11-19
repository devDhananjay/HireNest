"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StickyActionBar({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  eyebrow,
  title,
  className,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  eyebrow?: string;
  title?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition duration-300 sm:px-5",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
      aria-hidden={!visible}
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-3xl flex-col gap-3 rounded-[1.35rem] border border-black/8 bg-white/95 p-3 shadow-lift backdrop-blur-xl sm:flex-row sm:items-center sm:gap-4 sm:rounded-full sm:px-5 sm:py-3",
          !visible && "pointer-events-none",
        )}
      >
        {(eyebrow || title) && (
          <div className="min-w-0 flex-1 px-1 sm:px-0">
            {eyebrow ? (
              <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">{eyebrow}</p>
            ) : null}
            {title ? <p className="truncate text-sm font-medium tracking-tight">{title}</p> : null}
          </div>
        )}
        <div className="flex shrink-0 gap-2">
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-border px-4 text-sm font-medium sm:flex-none"
            >
              {secondaryLabel}
            </Link>
          ) : null}
          <Link
            href={primaryHref}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white sm:flex-none"
          >
            {primaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function StickyJobApplyBar({
  open,
  applied,
  salaryLabel,
  location,
  onApply,
  whatsappHref,
}: {
  open: boolean;
  applied: boolean;
  salaryLabel: string;
  location: string;
  onApply: () => void;
  whatsappHref: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition duration-300 lg:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
      aria-hidden={!visible}
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-lg items-center gap-2 rounded-full border border-black/8 bg-white/95 p-2 pl-4 shadow-lift backdrop-blur-xl",
          !visible && "pointer-events-none",
        )}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium tracking-tight">{salaryLabel}</p>
          <p className="truncate text-xs text-muted-foreground">{location}</p>
        </div>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-border px-3 text-sm font-medium"
        >
          Chat
        </a>
        <button
          type="button"
          disabled={!open || applied}
          onClick={onApply}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-black px-4 text-sm font-medium text-white disabled:opacity-50"
        >
          {!open ? "Closed" : applied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}

export function StickyBriefBar(props: {
  title?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: ReactNode;
}) {
  return (
    <StickyActionBar
      eyebrow="HIREORA"
      title={props.title ?? "Brief a consultant on your next hire"}
      primaryHref={props.primaryHref ?? "/contact"}
      primaryLabel={props.primaryLabel ?? "Brief us"}
      secondaryHref={props.secondaryHref ?? "/engagement"}
      secondaryLabel={props.secondaryLabel ?? "Fees"}
    />
  );
}
