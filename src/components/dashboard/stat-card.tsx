import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "navy" | "royal" | "orange";
}) {
  return (
    <div className="rounded-[1.85rem] bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-3xl font-semibold tracking-tight">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className="flex size-11 items-center justify-center rounded-full bg-black text-white shadow-[0_8px_18px_rgba(17,17,17,0.18)]">
          <Icon className="size-4" />
        </span>
      </div>
    </div>
  );
}
