import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
  tone = "light",
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  tone?: "light" | "muted";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[1.85rem] px-6 py-14 text-center sm:py-16",
        tone === "light" ? "bg-white shadow-soft" : "border border-dashed border-[#d9dde6] bg-[#f8f9fc]",
      )}
    >
      <span className="icon-orb size-14">
        <Icon className="size-5 text-muted-foreground" />
      </span>
      <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{action}</div> : null}
    </div>
  );
}
