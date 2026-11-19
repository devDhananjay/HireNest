import { INTERVIEW_PROCESS, type InterviewProcessStep } from "@/lib/content/interview-process";
import { cn } from "@/lib/utils";

export function InterviewProcessTimeline({
  steps = INTERVIEW_PROCESS,
  tone = "light",
  className,
}: {
  steps?: InterviewProcessStep[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <ol className={cn("space-y-0", className)}>
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
          {index < steps.length - 1 ? (
            <span
              aria-hidden
              className={cn(
                "absolute top-10 bottom-0 left-[1.15rem] w-px",
                dark ? "bg-white/15" : "bg-[#e7e9ef]",
              )}
            />
          ) : null}
          <span
            className={cn(
              "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold",
              dark ? "bg-white text-black" : "bg-black text-white",
            )}
          >
            {index + 1}
          </span>
          <div className="min-w-0 pt-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className={cn("font-heading text-lg font-semibold tracking-tight", dark && "text-white")}>
                {step.title}
              </p>
              <span
                className={cn(
                  "text-[11px] font-medium tracking-[0.14em] uppercase",
                  dark ? "text-white/40" : "text-muted-foreground",
                )}
              >
                {step.typical}
              </span>
            </div>
            <p className={cn("mt-1 text-sm leading-7", dark ? "text-white/55" : "text-muted-foreground")}>
              {step.detail}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
