import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className={cn("relative w-full", className)}>
      <select
        className="h-11 w-full cursor-pointer appearance-none rounded-full border border-transparent bg-[#f4f5f8] py-0 pr-10 pl-4 text-sm leading-[2.75rem] text-foreground outline-none transition focus:bg-white focus:ring-2 focus:ring-black/8 disabled:opacity-50"
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
        <ChevronDown aria-hidden className="size-4 text-muted-foreground/70" />
      </span>
    </div>
  );
}
