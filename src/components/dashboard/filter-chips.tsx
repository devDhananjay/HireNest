"use client";

import { cn } from "@/lib/utils";

export function FilterChips({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string; count?: number }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition duration-300",
              active
                ? "bg-black text-white shadow-[0_8px_18px_rgba(17,17,17,0.16)]"
                : "bg-white text-muted-foreground shadow-soft hover:text-foreground",
            )}
          >
            {item.label}
            {typeof item.count === "number" ? (
              <span className={cn("rounded-full px-1.5 text-[11px]", active ? "bg-white/15" : "bg-[#f4f5f8] text-foreground")}>
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
