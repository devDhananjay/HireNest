"use client";

import Link from "next/link";
import { Bookmark, Eye, Users } from "lucide-react";
import { CompanyMark } from "@/components/jobs/company-mark";
import { buttonVariants } from "@/components/ui/button";
import { experienceRange, postedOn, salaryRange } from "@/lib/format";
import { useDemo } from "@/lib/store";
import type { Job } from "@/lib/types";
import { cn } from "@/lib/utils";

export function JobCard({ job, featured = false }: { job: Job; featured?: boolean }) {
  const { companyById, toggleSaveJob, session, savedJobIds } = useDemo();
  const company = companyById(job.companyId);
  const saved = session ? (savedJobIds[session.id] ?? []).includes(job.id) : false;

  return (
    <article
      className={cn(
        "group relative flex h-full min-h-[240px] flex-col rounded-[1.55rem] p-5 transition duration-300 sm:min-h-[280px] sm:rounded-[1.85rem] sm:p-6",
        featured
          ? "bg-black text-white shadow-lift"
          : "hover-lift bg-white shadow-soft",
      )}
    >
      <div className="flex items-start justify-between gap-3">
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
        <button
          type="button"
          onClick={() => toggleSaveJob(job.id)}
          className={cn(
            "rounded-full p-2 transition",
            featured ? "text-white/70 hover:bg-white/10" : "text-muted-foreground hover:bg-muted",
            saved && (featured ? "text-white" : "text-foreground"),
          )}
          aria-label="Save job"
        >
          <Bookmark className={cn("size-4", saved && "fill-current")} />
        </button>
      </div>
      <h3 className="mt-7 font-heading text-[1.35rem] leading-snug font-semibold tracking-tight">
        {job.title}
      </h3>
      <p className={cn("mt-2 text-sm", featured ? "text-white/60" : "text-muted-foreground")}>
        {job.employmentType} · {job.workMode} · {experienceRange(job.experienceMin, job.experienceMax)}
      </p>
      <p className={cn("mt-1 text-sm", featured ? "text-white/60" : "text-muted-foreground")}>
        {salaryRange(job.salaryMin, job.salaryMax)}
      </p>
      <div className="mt-auto flex items-center justify-between pt-8">
        <div className={cn("flex items-center gap-3.5 text-xs", featured ? "text-white/50" : "text-muted-foreground")}>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" /> {24 + job.openings * 10}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" /> {job.openings * 8 + 12}
          </span>
        </div>
        <Link
          href={`/jobs/${job.slug}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-9 rounded-full px-4",
            featured && "border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white",
          )}
        >
          Details
        </Link>
      </div>
    </article>
  );
}
