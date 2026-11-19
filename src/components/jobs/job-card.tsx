"use client";

import Link from "next/link";
import { Bookmark, Eye, Users } from "lucide-react";
import { CompanyMark } from "@/components/jobs/company-mark";
import { isSalaryTransparent } from "@/components/jobs/salary-band";
import { experienceRange, postedOn, salaryRange } from "@/lib/format";
import { useDemo } from "@/lib/store";
import type { Job } from "@/lib/types";
import { cn } from "@/lib/utils";

export function JobCard({
  job,
  featured = false,
  matchScore,
}: {
  job: Job;
  featured?: boolean;
  matchScore?: number | null;
}) {
  const { companyById, toggleSaveJob, session, savedJobIds } = useDemo();
  const company = companyById(job.companyId);
  const saved = session ? (savedJobIds[session.id] ?? []).includes(job.id) : false;
  const href = `/jobs/${job.slug}`;
  const transparent = isSalaryTransparent(job);

  return (
    <article
      className={cn(
        "group relative flex h-full min-h-[240px] flex-col rounded-[1.55rem] p-5 transition duration-300 sm:min-h-[280px] sm:rounded-[1.85rem] sm:p-6",
        featured ? "bg-black text-white shadow-lift" : "hover-lift bg-white shadow-soft",
      )}
    >
      <Link href={href} className="absolute inset-0 z-0 rounded-[inherit]" aria-label={`View ${job.title}`}>
        <span className="sr-only">View job details</span>
      </Link>

      <div className="relative z-10 flex items-start justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-3">
          <CompanyMark
            name={company?.name ?? "Company"}
            color={featured ? "#ffffff" : company?.logoColor ?? "#111111"}
            className={featured ? "ring-white/10" : "ring-[#f3f4f8]"}
          />
          <div>
            <p className={cn("text-sm font-medium", featured ? "text-white" : "text-foreground")}>
              {company?.name}
            </p>
            <p className={cn("text-xs", featured ? "text-white/45" : "text-muted-foreground")}>
              {postedOn(job.postedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {transparent ? (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] uppercase",
                featured ? "border border-white/20 text-white/80" : "border border-border text-muted-foreground",
              )}
            >
              CTC open
            </span>
          ) : null}
          {typeof matchScore === "number" ? (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight",
                featured ? "bg-white/12 text-white" : "bg-[#111111] text-white",
              )}
            >
              {matchScore}% fit
            </span>
          ) : null}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
            className={cn(
              "pointer-events-auto relative z-20 rounded-full p-2 transition",
              featured ? "text-white/70 hover:bg-white/10" : "text-muted-foreground hover:bg-muted",
              saved && (featured ? "text-white" : "text-foreground"),
            )}
            aria-label="Save job"
          >
            <Bookmark className={cn("size-4", saved && "fill-current")} />
          </button>
        </div>
      </div>

      <div className="relative z-10 pointer-events-none">
        <h3 className="mt-7 font-heading text-[1.35rem] leading-snug font-semibold tracking-tight">{job.title}</h3>
        <p className={cn("mt-2 line-clamp-2 text-sm leading-6", featured ? "text-white/60" : "text-muted-foreground")}>
          {job.description}
        </p>
        <p className={cn("mt-3 text-sm", featured ? "text-white/60" : "text-muted-foreground")}>
          {job.employmentType} · {job.workMode} · {experienceRange(job.experienceMin, job.experienceMax)}
        </p>
        <p className={cn("mt-1 text-sm", featured ? "text-white/60" : "text-muted-foreground")}>
          {salaryRange(job.salaryMin, job.salaryMax)}
        </p>
      </div>

      <div className="relative z-10 mt-auto flex items-center justify-between pt-8 pointer-events-none">
        <div className={cn("flex items-center gap-3.5 text-xs", featured ? "text-white/50" : "text-muted-foreground")}>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" /> {24 + job.openings * 10}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" /> {job.openings * 8 + 12}
          </span>
        </div>
        <span
          className={cn(
            "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium",
            featured ? "border border-white/15 text-white" : "border border-border text-foreground",
          )}
        >
          Details
        </span>
      </div>
    </article>
  );
}
