"use client";

import Link from "next/link";
import { ROLE_HOME } from "@/lib/constants";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  light = false,
  href,
}: {
  className?: string;
  light?: boolean;
  href?: string;
}) {
  const { session } = useDemo();
  const to = href ?? (session ? ROLE_HOME[session.role] : "/");

  return (
    <Link href={to} className={cn("group flex min-w-0 items-center gap-2 sm:gap-2.5", className)}>
      <span
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold tracking-tight transition-transform duration-300 group-hover:scale-[1.04] sm:size-10 sm:text-[15px]",
          light
            ? "bg-white text-black shadow-[0_10px_28px_rgba(0,0,0,0.22)]"
            : "bg-black text-white shadow-[0_8px_20px_rgba(17,17,17,0.18)]",
        )}
      >
        H
      </span>
      <span
        className={cn(
          "font-heading truncate text-[1.05rem] font-semibold tracking-[-0.045em] sm:text-[1.2rem]",
          light ? "text-white" : "text-foreground",
        )}
      >
        HIREORA
      </span>
    </Link>
  );
}
