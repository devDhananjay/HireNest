import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type IconProp = LucideIcon | ((props: { className?: string }) => ReactNode);

function FieldIcon({ icon: Icon }: { icon: IconProp }) {
  return <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/70" />;
}

export function IconField({
  icon,
  className,
  inputClassName,
  ...props
}: ComponentProps<"input"> & { icon: IconProp; inputClassName?: string }) {
  return (
    <div className={cn("relative", className)}>
      <FieldIcon icon={icon} />
      <Input className={cn("pl-10", inputClassName)} {...props} />
    </div>
  );
}

export function IconTextarea({
  icon: Icon,
  className,
  textareaClassName,
  ...props
}: ComponentProps<"textarea"> & { icon: LucideIcon; textareaClassName?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Icon className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground/70" />
      <Textarea className={cn("pl-10", textareaClassName)} {...props} />
    </div>
  );
}

export function IconSelect({
  icon: Icon,
  className,
  selectClassName,
  children,
  ...props
}: ComponentProps<"select"> & { icon: LucideIcon; selectClassName?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Icon className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-muted-foreground/70" />
      <select
        className={cn(
          "h-11 w-full cursor-pointer appearance-none rounded-full border border-transparent bg-[#f4f5f8] py-0 pr-10 pl-10 text-sm text-foreground outline-none transition focus:bg-white focus:ring-2 focus:ring-black/8 disabled:opacity-50",
          selectClassName,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground/70" />
    </div>
  );
}
