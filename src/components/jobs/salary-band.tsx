import type { Job } from "@/lib/types";
import { formatINR, salaryRange } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Featured / select roles publish a clear CTC band — trust signal, not a negotiation bluff. */
export function isSalaryTransparent(job: Pick<Job, "featured" | "salaryMin" | "salaryMax">) {
  const spread = job.salaryMax - job.salaryMin;
  return job.featured || spread <= 1_000_000;
}

export function SalaryBandPanel({
  job,
  className,
}: {
  job: Pick<Job, "salaryMin" | "salaryMax" | "featured">;
  className?: string;
}) {
  if (!isSalaryTransparent(job)) return null;

  const mid = Math.round((job.salaryMin + job.salaryMax) / 2);
  const spreadLpa = ((job.salaryMax - job.salaryMin) / 100000).toFixed(1);

  return (
    <div className={cn("rounded-[1.35rem] border border-[#eef0f4] bg-[linear-gradient(180deg,#fbfbfc,#f6f7fa)] p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Transparent CTC band
          </p>
          <p className="mt-2 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            {salaryRange(job.salaryMin, job.salaryMax)}
          </p>
        </div>
        <span className="rounded-full bg-black px-3 py-1 text-[10px] font-medium tracking-[0.14em] text-white uppercase">
          Published
        </span>
      </div>

      <div className="mt-5">
        <div className="relative h-2 overflow-hidden rounded-full bg-[#e7e9ef]">
          <div className="absolute inset-y-0 left-[8%] right-[8%] rounded-full bg-black/85" />
          <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black shadow-sm" />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>{formatINR(job.salaryMin)}</span>
          <span>Mid {formatINR(mid)}</span>
          <span>{formatINR(job.salaryMax)}</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Band width ~{spreadLpa} LPA. Base vs variable and any joining bonus are confirmed at offer — this page
        publishes the total CTC range the hiring desk will work within.
      </p>
    </div>
  );
}
