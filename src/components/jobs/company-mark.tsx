import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

export function CompanyMark({
  name,
  color,
  className,
  size = "md",
}: {
  name: string;
  color: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const light = color.toLowerCase() === "#ffffff";
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-sm font-semibold tracking-tight ring-4 ring-white/70",
        size === "sm" && "size-9 text-xs",
        size === "md" && "size-12",
        size === "lg" && "size-14 text-base",
        className,
      )}
      style={{ background: color, color: light ? "#111111" : "#ffffff" }}
    >
      {initials(name)}
    </span>
  );
}
