import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function IconOrb({
  icon: Icon,
  className,
  size = "md",
  tone = "muted",
}: {
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg";
  tone?: "muted" | "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        size === "sm" && "size-9",
        size === "md" && "size-11",
        size === "lg" && "size-12",
        tone === "muted" && "bg-[#f4f5f8] text-foreground",
        tone === "light" && "bg-white text-foreground shadow-soft",
        tone === "dark" && "bg-black text-white shadow-[0_8px_18px_rgba(17,17,17,0.18)]",
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-3.5" : "size-4"} />
    </span>
  );
}
