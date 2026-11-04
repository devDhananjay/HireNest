"use client";

import { APPLICATION_STATUSES } from "@/lib/constants";
import type { ApplicationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const TRACK = APPLICATION_STATUSES.filter((status) => status !== "Rejected");

const SHORT: Record<string, string> = {
  Applied: "Applied",
  "Under Review": "Review",
  Shortlisted: "Shortlist",
  "Interview Scheduled": "Interview",
  Selected: "Offer",
};

export function StageTrack({
  current,
  tone = "light",
}: {
  current: ApplicationStatus;
  tone?: "light" | "dark";
}) {
  const rejected = current === "Rejected";
  const index = TRACK.indexOf(current as (typeof TRACK)[number]);

  return (
    <div>
      <ol className="flex items-center">
        {TRACK.map((stage, i) => {
          const done = !rejected && index >= 0 && i <= index;
          return (
            <li key={stage} className="flex min-w-0 flex-1 items-center">
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  rejected ? (tone === "dark" ? "bg-white/20" : "bg-[#e7e9ef]") : done ? (tone === "dark" ? "bg-white" : "bg-black") : tone === "dark" ? "bg-white/20" : "bg-[#e7e9ef]",
                )}
              />
              {i < TRACK.length - 1 ? (
                <span
                  className={cn(
                    "mx-1 h-px w-full",
                    !rejected && i < index ? (tone === "dark" ? "bg-white" : "bg-black") : tone === "dark" ? "bg-white/15" : "bg-[#e7e9ef]",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="mt-2 flex justify-between gap-1">
        {TRACK.map((stage, i) => (
          <span
            key={stage}
            className={cn(
              "text-[10px] tracking-wide",
              tone === "dark"
                ? !rejected && i === index
                  ? "font-medium text-white"
                  : "text-white/40"
                : !rejected && i === index
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
            )}
          >
            {SHORT[stage]}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StagePills({
  current,
  onSelect,
}: {
  current: ApplicationStatus;
  onSelect: (status: ApplicationStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full bg-[#f4f5f8] p-1.5">
      {APPLICATION_STATUSES.map((status) => {
        const active = current === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onSelect(status)}
            className={cn(
              "h-9 rounded-full px-3.5 text-xs font-medium transition",
              active ? "bg-black text-white shadow-[0_8px_16px_rgba(17,17,17,0.16)]" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}
