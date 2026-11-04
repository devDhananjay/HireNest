import { cn } from "@/lib/utils";

export function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-11 w-full appearance-none rounded-full border border-transparent bg-[#f4f5f8] px-4 text-sm text-foreground outline-none transition focus:bg-white focus:ring-2 focus:ring-black/8 disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
