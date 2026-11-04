import { calendarParts } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DateBlock({ iso, tone = "light" }: { iso: string; tone?: "light" | "dark" }) {
  const parts = calendarParts(iso);
  return (
    <div
      className={cn(
        "flex size-[4.35rem] shrink-0 flex-col items-center justify-center rounded-[1.25rem]",
        tone === "dark" ? "bg-white/10 text-white" : "bg-[#f4f5f8] text-foreground",
      )}
    >
      <span className={cn("text-[10px] font-medium tracking-[0.16em] uppercase", tone === "dark" ? "text-white/50" : "text-muted-foreground")}>
        {parts.month}
      </span>
      <span className="font-heading text-[1.65rem] leading-none font-semibold">{parts.day}</span>
      <span className={cn("mt-1 text-[10px]", tone === "dark" ? "text-white/45" : "text-muted-foreground")}>{parts.weekday}</span>
    </div>
  );
}
